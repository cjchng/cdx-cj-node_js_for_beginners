import express from 'express'
import bodyParser from 'body-parser'
import { getAll, getById, create, updateById, deleteById } from './store.js'

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get('/about', async (req, res) => {
    const whispers = await getAll()
    res.render('about', { whispers })
})

app.get('/api/v1/whisper', async (req, res) => {
    const whispers = await getAll()
    res.json(whispers)
})
app.get('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10)
    const whisper = await getById(id)
    if (!whisper) {
        return res.sendStatus(404)
    }
    res.json(whisper)
})
app.post('/api/v1/whisper', async (req, res) => {
    const whisper = await create(req.body.message)
    res.status(201).json(whisper)
})
app.put('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10)
    const existing = await getById(id)
    if (!existing) {
        return res.sendStatus(404)
    }
    await updateById(id, req.body.message)
    const updated = await getById(id)
    res.json(updated)
})
app.delete('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10)
    const existing = await getById(id)
    if (!existing) {
        return res.sendStatus(404)
    }
    await deleteById(id)
    res.sendStatus(204)
})
export { app }
