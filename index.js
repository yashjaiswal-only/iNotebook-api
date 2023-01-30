const connectToMongo=require('./db');
const express = require('express')
var cors=require('cors')

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json()) //to use api in browser

app.use(express.json()) //to use req.body  (middleware)


app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))
app.get('/', (req, res) => {
  res.send('Hello Yash!')
}) 
// app.get('/api/v1/login', (req, res) => {
//   res.send('Hello Login!')
// })
// app.get('/api/v1/signup', (req, res) => {
//   res.send('Hello signup!')
// })

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
