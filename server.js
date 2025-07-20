const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// 🛠️ Middlewares (must come BEFORE routes that need req.body)
app.use(cors());
app.use(express.json()); // ✅ essential for parsing JSON body
app.use(bodyParser.json());
app.use(express.static('public'));

// 🛠️ Routes
const userRoutes = require('./routes/userRoutes');
const resourceroutes = require('./routes/resourceroutes');
const chatRoutes = require('./routes/chatRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const quizRoutes = require('./routes/quizRoutes');
const quizResultRoutes = require("./routes/quizResultRoutes");
const feedbackRoutes = require('./routes/feedbackRoutes');
const careerMentorRoutes = require('./routes/careerMentorRoutes');


app.use('/api/career-mentor', careerMentorRoutes);
app.use('/api/quiz-feedback', feedbackRoutes);
app.use("/api/quiz-results", quizResultRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceroutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes); // ✅ now after express.json()

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Welcome to Saarthi AI backend 🎓');
});

// 🧠 MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
