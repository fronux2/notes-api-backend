
const {server}  = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/Note')

const {api,initialNotes, getAllContentfromNotes} = require('./helpers')


beforeEach(async () => {
    await Note.deleteMany({})
    
    
    /* //parallel
    const notesObjects = initialNotes.map(note => new Note(note))
    const promises = notesObjects.map(note => note.save())
    await Promise.all(promises) */

    //sequential
    for (const note of initialNotes){
        const noteObject = new Note(note)
        await noteObject.save()
    }

    
})

test('notes are returned as json', async() => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)      
  })

test('there are two notes', async() => {
    const response = await api.get('/api/notes')
      expect(response.body).toHaveLength(initialNotes.length)
  })

test('the second note is about learning testing for midudev', async() => {
    const {response} = await getAllContentfromNotes() 
      expect(response.body[1].content).toBe('learning testing for midudev')
  })

test('the content in the notes', async() => {
    const {response, contents} = await getAllContentfromNotes()    
      expect(contents).toContain('learning testing for midudev')
  })

test('a valid note can be added', async () => {
    const newNote = {
        content: 'Proximamente async/await',
        important: true
      }

    

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type',  /application\/json/)

    const {response,contents} = await getAllContentfromNotes() 
    expect(contents).toContain(newNote.content)    
    expect(response.body).toHaveLength(initialNotes.length + 1)
})

test('is not possible with an invalid note', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const {response} = await getAllContentfromNotes() 

    expect(response.body).toHaveLength(initialNotes.length)
  })

test('a note can be delete', async () => {
    const { response: responseOne } = await getAllContentfromNotes()
    const { body: notes } = responseOne
    const noteToDelete = notes[0]
    await api
    .delete(`/api/notes/${noteToDelete.id}`)    
    .expect(204)
    
    const { contents, response: responseTwo } = await getAllContentfromNotes()
    expect(responseTwo.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be delete', async () => {    
    
    await api
        .delete(`/api/notes/1233`)    
        .expect(400)
    
    const { response } = await getAllContentfromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})



afterAll(() => {
    mongoose.connection.close()
    server.close()    
  })