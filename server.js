const express = require("express");
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken')


var app = express();
app.use(express.json())

const port = 8001;



const knex = require("knex") ({
    client : "mysql",
    connection : {
        host : process.env.host,
        user : process.env.user,
        password : process.env.password,
        database : process.env.database
    }
})



app.use('/', department = express.Router());
require('./router/department')(department,knex)

app.use('/', category = express.Router());
require('./router/category')(category,knex)

app.use('/', attribute = express.Router());
require('./router/attribute')(attribute,knex)

app.use('/', product = express.Router());
require('./router/product')(product,knex)

app.use('/', customer = express.Router());
require('./router/customer')(customer,knex)

app.use('/', shopping = express.Router());
require('./router/shopping')(shopping,knex)

app.use('/', tax = express.Router());
require('./router/tax')(tax,knex)

app.use('/', shipping = express.Router());
require('./router/shipping')(shipping,knex)

app.use('/', order = express.Router());
require('./router/order')(order,knex)

app.listen(port,()=>{
    console.log(`${port} is working`);
})