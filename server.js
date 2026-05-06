import express from 'express'
// express is a Node.js framework that makes it easy to create a server and define routes

import movies from './movies.js'
// imports the movies array from movies.js — this acts as our mock database
const app = express() 
app.use((req, res, next) => {
    res.set(`Access-Control-Allow-Origin`, `*`)

    if (req.method === `OPTIONS`) {
        res.set(`Access-Control-Allow-Methods`, `POST, PATCH, DELETE`)
        return res.sendStatus(204)
    }
    next()
})

// creates a new express application
app.use(express.json()) // middleware that parses incoming requests with JSON bodies so we can access req.body


// ─────────────────────────────────────────────
// ROUTES
// A route listens for a specific HTTP method + URL path
// and runs a callback function with (req, res) when matched
// req = what the client sends | res = what we send back
// ─────────────────────────────────────────────

// GET "/" — Welcome message, confirms the server is running
app.get("/", (req, res) => {
    res.json({ // res.json() sends a response as JSON and sets the Content-Type header automatically
        message: "Welcome to the movie watchlist server."
    })
})

// GET "/movies" — Returns the full list of movies
app.get("/movies", (req, res) => {
    res.json(movies)
})
app.get("/movies/:name", (req, res) => {
    res.json(movies.find(movie => movie.title === req.params.name))
})

// GET "/movies/actor/:actorName" — Returns all movies featuring a specific actor
// .filter() returns an array of all matches (vs .find() which returns only the first)
// .includes() checks if the starring array contains the given actor name
// ⚠️ This route has a conflict with "/movies/:name" above — since :name catches everything,
// "/movies/actor/:actorName" will never be reached. Move it above "/movies/:name" to fix this.

app.get("/movies/actor/:actorName", (req, res) => {
    res.json(movies.filter(movie => movie.starring.includes(req.params.actorName)))
})

// GET "/movies/watched" — Returns only movies marked as watched
// ⚠️ Same conflict issue — this route should also be moved above "/movies/:name"
// otherwise Express will match "watched" as the :name parameter instead
app.get("/movies/watched", (req, res) => {
    res.json(movies.filter(movie => movie.watched))
})

// DELETE "/movies/:id" — Removes a movie from the list by id
app.delete("/movies/:id", (req, res) => {
    const id = parseInt(req.params.id) // req.params are always strings, parseInt converts to number so we can match against numeric ids
    const index = movies.findIndex(movie => movie.id === id) // findIndex returns the position in the array, or -1 if not found

    if (index === -1) {
        return res.status(404).json({error: `No movie with id ${id}.`}) // 404 = Not Found. return stops the function so the code below doesn't run
    }

    const deletedMovie = movies.splice(index, 1) // splice(index, 1) removes 1 element at the given index and returns it as an array
    res.json({message: "Deleted:", movie: deletedMovie})
})

// PATCH "/movies/:id/toggle-watched" — Flips the watched status of a movie (true → false or false → true)
// PATCH is used for partial updates (vs PUT which replaces the whole object)
app.patch("/movies/:id/toggle-watched", (req, res) => {
    const id = parseInt(req.params.id)
    const movie = movies.find(movie => movie.id === id)
    movie.watched = !movie.watched // the ! (NOT) operator flips the boolean value
    res.json({message: "Toggled watched status of:", movie: movie})
})


// ─────────────────────────────────────────────
// POST "/movies" — Adds a new movie to the list
// ─────────────────────────────────────────────

let counter = 20
// counter starts at 20 because the existing movies have ids 1–19
// it auto-increments with each new movie posted so every movie gets a unique id

app.post("/movies", (req, res) => {
    counter++ // increment first to avoid reusing the previous id if the route is called multiple times
    const newMovie = {
        id: counter,         // unique id assigned automatically
        title: req.body.title,       // req.body contains the data sent by the client in the request body
        starring: req.body.starring,
        year: req.body.year,
        watched: false       // new movies default to unwatched
    }

    movies.push(newMovie) // adds the new movie to the in-memory array (resets on server restart since there's no real database)
    res.status(201).json(newMovie) // 201 = Created, used instead of 200 to indicate a new resource was made
})

// To test the POST route with curl:
// curl -X POST http://localhost:3000/movies -H "Content-Type: application/json" -d '{"title":"Inception","starring":["Leonardo DiCaprio","Marion Cotillard"],"year":2010}'

const port = 3000

// app.listen() starts the server and keeps it running, waiting for incoming requests
app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})

// To start the server, run in terminal: node server.js
// Then visit: http://localhost:3000/

// ─────────────────────────────────────────────
// ROUTES SUMMARY
// ─────────────────────────────────────────────
// GET    "/"                            → Welcome message
// GET    "/movies"                      → Returns all movies
// GET    "/movies/:name"                → Returns one movie by title
// GET    "/movies/actor/:actorName"     → Returns all movies by a specific actor ⚠️ move above /movies/:name
// GET    "/movies/watched"              → Returns all watched movies ⚠️ move above /movies/:name
// DELETE "/movies/:id"                 → Deletes a movie by id
// PATCH  "/movies/:id/toggle-watched"  → Toggles the watched status of a movie
// POST   "/movies"                     → Adds a new movie