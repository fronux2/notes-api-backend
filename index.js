const express = require('express')
const app = express()
app.use(express.json())

let notes = [
  {
    id: 1,
    content: 'Me tengo que susbribir a midudev',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 2,
    content: 'Me tengo que susbribir a fronux',
    date: '2019-05-30T18:39:34.091Z',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  const ids = notes.map(notes => notes.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.content !== 'undefined' ? note.content : false
  }

  notes = [...notes, newNote]
  response.json(newNote)
})

app.put('/api/notes/:id', (request, response) => {
  const note = request.body
  const id = request.params
  const ids = notes.map(notes => notes.id)
  note = ids === id ? note.content : null
  const newNote = {
    content: note.content,
    important: typeof note.content !== 'undefined' ? note.content : false
  }

  notes = [...notes, newNote]
  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'not found'
  })
})

const PORT = 3001
app.listen(PORT)
