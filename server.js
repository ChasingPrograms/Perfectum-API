require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Goal = require('./models/Goal');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Perfectum API is running' });
});

app.post('/goals',async (req, res) => {
  const goal = await Goal.create({title: req.body.title});
  res.status(201).json(goal);
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
