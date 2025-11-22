import express from 'express'
import taskRoute from './routes/taskRouters.js'
import { connectDB } from './config/db.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()


const PORT = process.env.PORT || 5001

// middleware: always above route
app.use(express.json())
app.use(cors({origin: "http://localhost:5173"}))

app.use('/api/tasks', taskRoute)



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at localhost:${PORT}`)
  })
})


