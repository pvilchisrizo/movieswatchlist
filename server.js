import express  from 'express' // we use require to import that code into this file.

import movies from './movies.js' //imports the info from a file called movies.js  

const app = express() // creating a new express app
app.use(express.json()) //this is saying use json to receive data


//first route, name of the route and funtion.
//When you go to that route("/") execute that function. Patameters request and response
app.get("/", (req, res) => {
    res.json({ //turns this into json
        message: "Welcome to the movie watchlist server." // when the user go to this route/ they will see this message
    })
})

app.get("/movies", (req, res) => { //whe using this route /movies, sent the list of movies as json
    res.json(movies)
})


app.get("/movies/actor/:actorName", (req, res) => {
    res.json(movies.filter(movie => 
        movie.starring.includes(req.params.actorName)
    ))
})

app.get ("/movies/:name", (req, res) =>{
    // console.log(req.params.name)
      //this is an object so we access with .name
    // console.log in a back end project logs in the terminal 
    res.json(movies.find(movie => movies.title === res.params.name))
})



// to assing an id number to any new movie posted we can 
let counter = 20 // 20 because before adding any movies, the list had id from 1 to 19


//Post Request usually requested by the user in the front end using a form
app.post("/movies", (req, res) => {
    counter++
   const newMovie = {
    id: counter,
    title: req.body.title,
    starring: req.body.starring,
    year: req.body.year,
    watched: false
}
console.log("newMovie:", newMovie) 
    movies.push(newMovie)
    res.status(201).json(newMovie)
})
// we are adding this a movie to the list, check if the post reques works by  using this in a new terminal
// curl -X POST http://localhost:3000/movies -H "Content-Type: application/json" -d '{"title":"Inception","starring":["Leonardo DiCaprio","Marion Cotillard"],"year":2010}'



const port = 3000
//the server is going to be listening for requests in port 3000 (default)

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})
// In terminal we initiate our server by typing: node  (name of the file) node server.js now the server is listening for requests in the port http://localhost:3000/


//  Notes Routes:
// Get"/"   Returns a message to let the user know the server is working
// GET"/movies"      Return a list of all the movies in the mock database
// GET"/movies/:name"    Return a specific movie
// GET"/movies/:actor/:actorName"   Return all ,ovies associated with the given actor.
// POST"/movies"   Add a new movie to the list 

// "/movies" accepts a get and a post request
