require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Goal = require('./models/Goal');



const app = express();
app.use(express.json());

const MAX_SUBGOALS = 20; //Maximum sub-goals per goal (Limits Rule 1)


//Progress Function
const getProgress = (goal) => {
  const total = goal.subGoals.length;
  const count = goal.subGoals.filter(sub => sub.completed).length;
  return{completed: count,total}
};

app.get('/', async (req, res) => {
  res.json({ message: 'Perfectum API is running' });
});


// == Goal CRUD ==

//Post Method
app.post('/goals',async (req, res) => {

  try{
    const subGoals = req.body.subGoals ?? []; //Optional list of sub-goal titles

    if(!Array.isArray(subGoals)){
      return res.status(400).json({error: 'subGoals must be a list of titles'});
    }

    if(subGoals.length > MAX_SUBGOALS){
      return res.status(400).json({error: `The Maximum Amount of Sub-Goals is ${MAX_SUBGOALS}`});
    }

    //Goal and sub-goals are saved together, so either all are created or none are
    const goal = await Goal.create({
      title: req.body.title,
      description: req.body.description ?? '',
      subGoals: subGoals.map(title => ({title}))
    });
    res.status(201).json(goal);
  }

  catch(err){
    if(err.name === 'ValidationError'){
      if(Object.keys(err.errors).some(path => path.startsWith('subGoals'))){
        return res.status(400).json({error: 'Invalid sub-goal title input'});
      }
      return res.status(400).json({error: err.errors.description ? 'Invalid description input' : 'Invalid title input'});
    }
    res.status(500).json({error: 'Server Error'});
  }
  
});

//Get Method 
app.get('/goals', async (req, res) => {

  try{
    const archived = req.query.archived === 'true';
    const goals = await Goal.find({archived});
    res.status(200).json(goals.map(goal => ({ ...goal.toObject(), progress: getProgress(goal) })));
  }

  catch(err){
     res.status(500).json({error: 'Server Error'});
  }
  
});

app.get('/goals/:goalId', async (req, res) => {

  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }

    res.status(500).json({error: 'Server Error'});
  }
});

//Patch Method
app.patch('/goals/:goalId', async (req, res) => { //Updating Goal Titles and Descriptions
  try{
    const goal = await Goal.findById(req.params.goalId);
    const { title, description } = req.body;

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(title === undefined && description === undefined){ //Nothing to update
      return res.status(400).json({error: 'Provide a title or description to update'});
    }

    if(title !== undefined){
      goal.title = title;
    }

    if(description !== undefined){
      goal.description = description ?? ''; //null clears the description
    }

    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }

    if(err.name === 'ValidationError'){
      return res.status(400).json({error: err.errors.description ? 'Invalid description input' : 'Invalid title input'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});

// Goal Delete Method
app.delete('/goals/:goalId', async (req, res) => {
  try{
    const goal = await Goal.findById(req.params.goalId);

     if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }
    await goal.deleteOne();
     res.status(204).send();
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }

    res.status(500).json({error: 'Server Error'});
  }
})



// == Sub-goal CRUD ==

// Sub-Goal Post Method

app.post('/goals/:goalId/subgoals', async (req, res) => {
  try{
    const goal = await Goal.findById(req.params.goalId);
    if(!goal){
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(goal.archived){
      return res.status(409).json({error: 'Cannot Add Sub-Goals to Archived Goals'});
    }

    if(goal.subGoals.length >= MAX_SUBGOALS){
      return res.status(409).json({error: `The Maximum Amount of Sub-Goals is ${MAX_SUBGOALS}`});
    }

    if(goal.completed){
      goal.completed = false;
      goal.completedAt = null;
    }



    goal.subGoals.push({title: req.body.title});
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){

    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid Goal ID'});
    }

    if(err.name === 'ValidationError'){
      return res.status(400).json({error: 'Invalid Title Input'});
    }
    res.status(500).json({error: 'Server Error'});
  }
})

//Sub-Goals Patch Method
app.patch('/goals/:goalId/subgoals/:subGoalId', async (req, res) => { //Updating Sub-Goal Titles
  try{
    const goal = await Goal.findById(req.params.goalId);
    const title = req.body.title;

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Can\'t be Edited'});
    }

    const sub = goal.subGoals.id(req.params.subGoalId);
    if(!sub){ //If there's no sub goal
      return res.status(404).json({error: 'Sub-Goal Not Found'});
    }

   sub.title = title;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid ID'});
    }

    if(err.name === 'ValidationError'){
      return res.status(400).json({error: 'Invalid title input'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});

app.delete('/goals/:goalId/subgoals/:subGoalId', async (req, res) => { //Deleting Sub-Goal
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Can\'t be Edited'});
    }

    const sub = goal.subGoals.id(req.params.subGoalId);
    if(!sub){ //If there's no sub goal
      return res.status(404).json({error: 'Sub-Goal Not Found'});
    }

    await sub.deleteOne();
    await goal.save();
    res.status(204).send();
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid ID'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});


// == Features ==


// Archiving
app.patch('/goals/:goalId/archive', async (req, res) => { //Archiving Active Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(goal.archived){
      return res.status(409).json({error: 'Goal is Already Archived'})
    }

    goal.archived = true;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid Goal ID'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});


app.patch('/goals/:goalId/unarchive', async (req, res) => { //Unarchiving Inactive Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(!goal.archived){
      return res.status(409).json({error: 'Goal is Already Active'})
    }

    goal.archived = false;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }
    
     res.status(500).json({error: 'Server Error'});
  }
});

// Completing Goals
app.patch('/goals/:goalId/complete', async (req, res) => { //Completing Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(goal.completed){
      return res.status(409).json({error: 'Goal is Already Completed'});
    }

    if(goal.subGoals.some(sub => !sub.completed)){
       return res.status(409).json({error: 'All Subgoals Must Be Completed'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Archived Goal Can\'t be completed'});
    }

    goal.completedAt = new Date();
    goal.completed = true;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});


// Uncompleting Goals
app.patch('/goals/:goalId/uncomplete', async (req, res) => { //Uncompleting Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    if(!goal.completed){
      return res.status(409).json({error: 'Goal is Not Completed'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Archived Goal Can\'t be uncompleted'});
    }

    goal.completedAt = null;
    goal.completed = false;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
    }

     res.status(500).json({error: 'Server Error'});
  }
});

// Completing Subgoals
app.patch('/goals/:goalId/subgoals/:subGoalId/complete', async (req, res) => { //Completing Sub-Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }
    
    const sub = goal.subGoals.id(req.params.subGoalId);
    if(!sub){ //If there's no sub goal
      return res.status(404).json({error: 'Sub-Goal Not Found'});
    }

    if(sub.completed){
      return res.status(409).json({error: 'Sub-Goal is Already Completed'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Archived Goal Can\'t be completed'});
    }

    sub.completed = true;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid ID'});
    }
     res.status(500).json({error: 'Server Error'});
  }
});


// Uncompleting Subgoals
app.patch('/goals/:goalId/subgoals/:subGoalId/uncomplete', async (req, res) => { //Unompleting Sub-Goals
  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }
    
    const sub = goal.subGoals.id(req.params.subGoalId);
    if(!sub){ //If there's no sub goal
      return res.status(404).json({error: 'Sub-Goal Not Found'});
    }

    if(!sub.completed){
      return res.status(409).json({error: 'Sub-Goal is Not Completed'});
    }

    if(goal.archived){
       return res.status(409).json({error: 'Archived Goal Can\'t be completed'});
    }

    if(goal.completed){
      goal.completed = false;
      goal.completedAt = null;
    }

    sub.completed = false;
    await goal.save();
    res.status(200).json({ ...goal.toObject(), progress: getProgress(goal) });
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid ID'});
    }
     res.status(500).json({error: 'Server Error'});
  }
});


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
