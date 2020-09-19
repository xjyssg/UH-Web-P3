require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')
const app = express()



app.use(cors())
app.use(express.static('build'))
app.use(express.json())
logger.token('msg', function (req, res) { return JSON.stringify(req.body) })
app.use(logger(':method :url :status :res[content-length] - :response-time ms :msg'))


app.get('/', (req, res) => {
  console.log("hi")
  res.send('<h1>Helloooo World!</h1>')
})

app.get('/api/persons', (req, res) => {
  PersonModel.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  PersonModel.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PersonModel.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.get('/info', (req, res) => {
  var myDate = new Date()
  PersonModel.find({}).then(persons => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>
    ${myDate.toLocaleString( )}
    </p>
    `)
  })
})

app.post('/api/persons', (req, res, next) => {
  const newId = Math.floor(Math.random()*1000)

  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  } else {
    const person = new PersonModel({
      name: body.name,
      number: body.number,
    })
    
    person.save()
      .then(savedPerson => {
        console.log('person saved!')
        res.json(savedPerson)
      })
      .catch(error => next(error))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  PersonModel.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true}, next)
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})