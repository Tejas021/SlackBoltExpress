const express = require("express")

const app1 = express()

const port = process.env.PORT || 7000
app1.listen(7000,()=>{
    console.log("clled")
})

module.exports = app1