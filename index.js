const express = require('express')
const logger = require('morgan')
const app = express()

app.use(express.json())
logger.token('msg', function (req, res) { return JSON.stringify(req.body) })
app.use(logger(':method :url :status :res[content-length] - :response-time ms :msg'))


let persons = [
{ 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
},
{ 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
},
{ 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
},
{ 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
}
]



app.get('/', (req, res) => {
  console.log("hi")
  res.send('<h1>Helloooo World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})


app.get('/info', (req, res) => {
  var myDate = new Date();
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>
  ${myDate.toLocaleString( )}
  </p>
  `)
})

app.post('/api/persons', (req, res) => {
  const newId = Math.floor(Math.random()*1000)

  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  } else if (persons.find(person => person.name === body.name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })

  } else {
    const person = {...body, id: newId}
    persons = persons.concat(person)
    res.json(person)
  }


})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})