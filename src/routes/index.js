const express = require('express')
const userRouter = require('../controllers/userController')
const taskRouter = require('../controllers/todoController')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.uuna0au.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const app = express()
app.use(express.json())

// Allow CORS from a specific origin (localhost:4200 in this case)
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies for authorized requests
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Improved logging middleware with error handling
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  next();
});

// Mount routers with proper path prefixes
app.use('/users', userRouter)
app.use('/todo', taskRouter)

// Connect to MongoDB with proper error handling
mongoose.connect(DB_URL)
  .then(() => {
    console.log("Banco de dados conectado com sucesso!")
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta :${PORT}`)
    })
  })
  .catch((error) => {
    console.error(`Erro ao conectar no banco de dados. ${error}`)
    process.exit(1) // Exit the process on connection error
  })

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send("I'm alive!")
})

module.exports = app; // Export the app for potential usage in other files
