import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import taskRoutes from './router/tasks.js'
import cors from 'cors'

dotenv.config()

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors()); 

app.use('/tasks', taskRoutes);

app.listen(4000, () => console.log('Server Started'))