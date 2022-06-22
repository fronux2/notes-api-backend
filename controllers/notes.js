const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/k',(request, response, next) => {
  response.send('<h1>Hola mundoaa</h1>')
})

notesRouter.post('/',async(request, response) => {
    const {body} = request    
    const {content,
           important = false,
           userId
          } = body
    const user = await User.findById(userId)
    if (!content) {
      return response.status(400).json({
        error: 'required "content" field is missing'
      })
    }
    const newNote = new Note({
        content,
        date: new Date(),
        important,
        user: user._id
      })
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(200).json(savedNote)   
})

notesRouter.get('/', async(request,response) => {
  const notes = await Note.find({}).populate('user', {
    username:1,
    name:1
  })
  response.status(200).json(notes)

})

notesRouter.get('/:id',async(request, response, next) => {
  try {
    const { id } = request.params
    const noteFound = await Note.findById(id)
    response.status(200).json(noteFound)
  } catch (error) {
    next
  }
})


notesRouter.put('/:id', async (request,response) => {
  const {id} = request.params
  const {body} = request
  const newNoteInfo = {
    content: note.content,    
    important: note.important
  }
  const updateNote = await Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
  response.status(200).json(updateNote) 
})

notesRouter.delete('/:id',async(request, response, next) => {
  const { id } = request.params
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})


module.exports = notesRouter