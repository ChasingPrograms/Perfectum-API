require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Goal = require('./models/Goal');

const app = express();
app.use(express.json());



app.get('/', async (req, res) => {
  res.json({ message: 'Perfectum API is running' });
});

//Post Method
app.post('/goals',async (req, res) => {
  const goal = await Goal.create({title: req.body.title});
  res.status(201).json(goal);
});

//Get Method 
app.get('/goals', async (req, res) => {
  const archived = req.query.archived === 'true';
  const goals = await Goal.find({archived});
  res.status(200).json(goals);
});

app.get('/goals/:goalId', async (req, res) => {

  try{
    const goal = await Goal.findById(req.params.goalId);

    if(!goal){ //If there's no such goal
      return res.status(404).json({error: 'Goal Not Found'});
    }

    res.status(200).json(goal);
  }

  catch(err){
    if(err.name === 'CastError'){
      return res.status(400).json({error: 'Invalid goal ID'});
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
