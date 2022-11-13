const express = require("express")

const app1 = express()

app1.listen(7000,()=>{
    console.log("clled")
})

module.exports = app1