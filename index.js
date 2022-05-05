require('dotenv').config()
require('./mongodb')

const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const app = express()

app.use(cors())
app.use(express.json())
const notFound = require('./middleware/notFound')
const Note = require('./models/Note')
const handleError = require('./middleware/handleError')

Sentry.init({
  dsn: "https://44aef8b38ff546429b72f2492cec9ad3@o1230978.ingest.sentry.io/6378071",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/',(request, response, next) => {
  response.send('<h1>Hola mundo</h1>')
})

app.get('/api/notes',(request, response, next) => {
  Note.find({})
  .then(res => response.status(200).json(res))
  .catch(next)
})

app.get('/api/notes/:id',(request, response, next) => {
  const { id } = request.params
  Note.findById(id).then(res => response.status(200).json(res))
  .catch(next)
})

app.get('/api/notes/:id',(request, response, next) => {
  const { id } = request.params
  Note.findById(id).then(res => response.status(200).json(res))
  .catch(next)
})

app.post('/api/notes',(request, response, next) => {
  const { id } = request.params
  const note = request.body
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important
  })
  newNote.save().then(res => response.status(201).json(res))
  .catch(next)
})

app.put('/api/notes/:id',(request, response, next) => {
  const { id } = request.params
  const note = request.body
  const newNoteInfo = {
    content: note.content,    
    important: note.important
  }
  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
  .then(res => response.status(200).json(res))
  .catch(next)
})

app.delete('/api/notes/:id',(request, response, next) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
  .then(res => response.status(204).json(res))
  .catch(next)
})


app.use(notFound)
app.use(Sentry.Handlers.errorHandler());
app.use(handleError)

const PORT = process.env.PORT
app.listen(PORT)