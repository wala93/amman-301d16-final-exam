'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
// Specify a directory for static resources
app.use(express.static('public'));
app.set('views','views/');
// define our method-override reference
app.use(methodOverride("_method"));
// Set the view engine for server-side templating
app.set('view engine','ejs');

// Use app cors

app.use(cors());
// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', homeRender);
app.post('/',savetoFav);
app.get('/myFav/:id',showFav);
app.get('/details/:id',showdetails);
app.put('/details/:id',updateFun);
app.delete('/details/:id',deleteFun);
app.get('/myFavList', showList);
// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function  homeRender(req,res)
{
//  res.render('index');
let url='https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
superagent.get(url).then(apiData=> {apiData.body.map(x=>new Simpson(x));
    console.log(x);}).then(result=> res.render('index',{simpsons:result})).catch(error=> console.log(error))
    

}



function savetoFav(req,res){
let data=req.body;
let sql='INSERT INTO simpsons (quote,character,image,characterDirection) VALUES($1,$2,$3,$4) RETURNING id';
let values =[data.quote,data.character,data.image,data.characterDirection];
client.query(sql.values).then(saved=>{console.log(saved.rows.id) }).then(res.rdirect(`/myFav/${saved.rows.id}`))

}


function showFav(req,res){
let id= [req.params.id];
let sql='SELECT * FROM simpsons WHERE id=$1';
let values=id;
client.query(sql,values).then(x=> res.render('myFav',{result:x.rows[0]}))
}


function showdetails(res,req){
    let id= [req.params.id];

    let sql='SELECT * FROM simpsons WHERE id=$1';
    let values=id;
    client.query(sql,values).then(x=> res.render('details',{result:x.rows[0]}))

}

function updateFun (req,res){
let id=req.params.id;
let {quote,character,image,characterDirection}=req.body;
let sql='UPDATE simpsons SET  quote =$1,character=$2,image=$3,characterDirection=$4 WHERE id=$5;'
let values=[quote,character,image,characterDirection,id];
client.query(sql,values).then(x=> res.redirect('/details/:id'))


}

function deleteFun (req,res){
    let id=req.params.id;
    let values=[id];
    let sql='DELETE FROM simpsons WHERE id=$1;'
client.query(sql,values).then(res.redirect('/details/:id'));

}

function showList(req,res){
let sql='select * from simpsons'
client.query(sql).then(x=> res.render('allFav',{list:x.rows}))

}


// helper functions

function Simpson(info){

this.quote=info.quote;
this.character=info.character;
this.image=info.image;
this.characterDirection=info.characterDirection;


}





// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
