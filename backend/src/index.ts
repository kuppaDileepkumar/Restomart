import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { AppDataSource } from './data-source'
import tasksRouter from './routes/tasks'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api', tasksRouter)

AppDataSource.initialize()
  .then(() => {
    console.log('✅ SQLite DB connected.')
    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
  })
