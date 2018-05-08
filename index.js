const express = require('express')
const path = require("path")

app = express()

// Define root of html directory
const htmlRoot = path.join(__dirname+'/templates/')

app.get("/", (req, res) => {
    res.sendFile(htmlRoot + "index.html")
})

app.get("/about", (req, res) => {
    res.sendFile(htmlRoot + "/about.html")
})
const port = 8000


app.listen(port, ()=>{
    console.log("Listening on port :", port)
})