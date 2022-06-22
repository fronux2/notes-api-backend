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
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

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



app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler());
app.use(handleError)

const PORT = process.env.PORT
const server = app.listen(PORT)

module.exports = {app, server}