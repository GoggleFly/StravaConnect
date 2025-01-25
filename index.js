import express from 'express'
import { config } from 'dotenv'
import * as handlers from './handler.js'

// Load environment variables
config()

const app = express()
const port = 3000

app.get('/', handlers.athlete)
app.get('/stats', handlers.stats)
app.get('/activities', handlers.activities)

app.listen(port, () => {
  console.log(`StavaConnect listening on port ${port}`)
})