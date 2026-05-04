import express  from 'express'
import movies from './movies.js'

const app = express()

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the movie watchlist server."
    })
})

app.get("/movies", (req, res) => {
    res.json(movies)
})

app.get ("/movies/:name", (req, res) =>{
    // console.log(req.params.name)
    res.json(movies.find(movie.title === res.params.name))
})

app.get("/movies/actor/:actorname", (req, res) => {
    const actorName = req.params.actorname.toLowerCase()
    res.json(movies.filter(movie => 
        movie.starring.some(actor => actor.toLowerCase() === actorName)
    ))
})


const port = 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})

// app.get("/movies/actor/:actorname", (req, res) => {
//     res.json(movies.filter(movie => movie.starring.includes(req.params.actorname))
// )
// })
// I was having issues with a name  
//     // console.log(JSON.stringify(movies[1].starring))
//     // console.log(movies[1].starring.includes('Zendaya'))
//     // console.log(JSON.stringify(req.params.actorname))
//     // console.log(req.params.actorname === 'Zendaya')
// //     console.log([...req.params.actorname].map(c => c.charCodeAt(0)))
// // console.log([...'Zendaya'].map(c => c.charCodeAt(0)))


