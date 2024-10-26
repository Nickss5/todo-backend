const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


// Initializing the app

const app = express()

// middlewares

app.use(cors())
app.use(bodyParser.json())

// connect to MongoDB

const mongoURI = process.env.MONGODB_URI
mongoose
    .connect(mongoURI)
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.log('connection error'))

// Task schema 

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true},
    completed: {type: Boolean, default: false},
})

// Task model 

const Task = mongoose.model('Task', taskSchema)

// Routes

// 1) Get all Tasks

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({message: 'Error fetching tasks', error})
    }
})

// 2) Add a new task

app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body)
        await newTask.save()
        res.json(newTask)
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    } 
})

// 3) Update/Edit a task

app.put('/tasks/:id', async (req, res) => {
    try {
        const {title, completed} = req.body
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {title, completed} , {new: true})
        res.json(updatedTask)
    } catch(error) {
        res.status(500).json({ message: 'Task not updated', error });
    }
})

// 4) Delete a task

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id)
    res.json({message: 'Task deleted'})
})

// Start Server

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
