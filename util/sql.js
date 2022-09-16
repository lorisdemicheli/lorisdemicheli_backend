require('dotenv').config();
let mysql = require('serverless-mysql')({
    config: {
      host     : process.env.ENDPOINT,
      database : process.env.DATABASE,
      user     : process.env.USER,
      port     : process.env.DATABASEPORT,
      password : process.env.PASSWORD
    }
})

module.exports =  mysql;