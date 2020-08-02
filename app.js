const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port =process.env.port || 3000;
const users = require('./routes/api/users');
const bodyparser = require('body-parser');
const passport = require('passport');

//DB config
const db = require('./config/keys').mongourl;

//connect to mongodb
mongoose
    .connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log('mongodb conected'))
    .catch( err => console.group(err))

    
//passport middleware
app.use(passport.initialize());

//passport Config
require('./config/passport')(passport);


//bodyparser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());

//use routes
app.use('/api/users',users);


app.listen(port,()=>console.log(`server running on ${port}`));