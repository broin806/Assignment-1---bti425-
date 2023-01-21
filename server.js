/********************************************************************************* * BTI425 – Assignment 1 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  * No part of this assignment has been copied manually or electronically from any other source * (including web sites) or distributed to other students. * 
 * * Name:  Broinson Jeyarajah Student ID: 101501229 Date: 2023-01-22 * Cyclic Link: * *************/



//REFERENCES ONLINE 
//https://stackoverflow.com/questions/20355876/how-to-send-integers-in-query-parameters-in-nodejs-express-service
//https://www.educative.io/blog/what-is-database-query-sql-nosql
//https://www.linkedin.com/pulse/how-create-your-first-mern-mongodb-express-js-react-node-sam-barros



//require functions or statments 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
//require the moviesDb.js file under modules folder 
const MoviesDB = require("./modules/moviesDB.js");
//body-parser functionailty 
const app = express();


const path = require('path');

require('dotenv').config();
const dotenv = require("dotenv").config();

//middleware function 
app.use(cors());
app.use(bodyParser.json());

const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;



//ensure connection on MongoDB atlas with connection string in .env folder 
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
    });




//home route 
app.get("/", (req, res) => {
    res.json({"message": "API Listening"})
}) 

//ROUTES

// POST /api/movies
app.post("/api/movies", (req,res) => { 
    myData.addNewMovie(req.body).then(() => {
        //add a new "Movie" document
        res.status(201).json(db.addNewMovie(req.body))
        //fail message through catch 
        }).catch((err) => { res.status(400).json(err);
        });
});

//GET /api/movies
app.get("/api/movies", (req, res) => {

   //numeric query parameters "perPage"
   let perPage = req.query.perPage ? req.query.perPage : 0

   //numeric query parameters "title"
   let title = req.query.title ? req.query.title : 0

    //numeric query parameters "page"
    let page = req.query.page ? req.query.page : 0


    //use respective values to return movie objects 
    db.getAllMovies(page, perPage, title).then((movies) => {
         movies ? res.status(200).json(movies) : res.status(404).json({"message": "Movies not found"})
    })
    .catch((err) => {//error message 
        res.status(500).json({"message": "Error and data is required"})
    })
}) 

//GET /api/movies
app.get("/api/movies/:id", (req, res) => {
    //route parameter that is the _id of the respective movie object 
    db.getMovieById(req.params.id).then((movies) => {
        //return movie object back to client, otherwise an error is thrown 
        movies ? res.json(movies) : res.status(404).json({"message": "Movies not found"})
    })
    .catch((err) => {
        res.status(500).json({"message": "Error and data is required"})
    })
})


//PUT /api/movies
app.put("/api/movies/:id", (req, res) => {

    let movie = db.updateMovieById(req.body, req.params.id)
    //.then(() => {
    //     res.status(200).json(" ${req.body._id} successfully updated");
    // })
    movie ? res.status(200).json(movie)  // movie successfully updated 
    :res.status(400).json({"message": "Error Message"})
})


app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id) .then(() => { //deletes respective movie 
        res.status(200).json(" ${req.params.id} successfully deleted"); //confirmation string 
    }) 
    //res.status(204).end()
}) 



