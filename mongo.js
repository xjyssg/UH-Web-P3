const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://xue:${password}@cluster0-shard-00-00.emxfw.mongodb.net:27017,cluster0-shard-00-01.emxfw.mongodb.net:27017,cluster0-shard-00-02.emxfw.mongodb.net:27017/note-app?ssl=true&replicaSet=atlas-11i7l8-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const PersonModel = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    PersonModel.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    const person = new PersonModel({
      name: newName,
      number: newNumber,
    })
    
    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })
}
