const { App, ExpressReceiver } = require("@slack/bolt");
const Axios = require('axios')
const express  = require("express")
const app1 = require("./app")
// const app1 = express()

const boltReceiver = new ExpressReceiver({
    signingSecret:"01db0ebc393de5ec4e28f075a566c8e6",
    router: app1,
    endpoints: '/new/slack/events'
})

const app = new App({
    token: "xoxb-2345683667521-4362553405635-mcDm8bnTOXcu6s7DnMD8jyLa", //Find in the Oauth  & Permissions tab
    signingSecret: "01db0ebc393de5ec4e28f075a566c8e6", // Find in Basic Information Tab
   receiver:boltReceiver,
    appToken: "xapp-1-A04A838AL8P-4375297425969-a7b76f3375b323aab165afd3abdd370722da4541fd300aed1376d9acd51b67ba"
});

const getWeather = async (city) => {
  try {
    let result = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ba5e4daae505c48512f7b1b07df8781f`);
   
    return result.data
  } catch (error) {
    console.log("EROOR", error)
  }
}

app.command("/square", async ({ command, ack, say }) => {
    try {
      await ack();
      
      // say(JSON.stringify())
      let txt = command.text // The inputted parameters
      if(isNaN(txt)) {
          say(txt + " is not a number")
      } else {
          say(txt + " squared = " + (parseFloat(txt) * parseFloat(txt)))
      }
    } catch (error) {
      console.log("err")
      console.error(error);
    }
});


app.command("/getusers",async({command,ack,say})=>{
  try {
    say("Users in the workspace:")
    let users=await fetch("https://slack.com/api/users.list",{method:"GET",headers:{Authorization: "Bearer xoxb-2345683667521-4362553405635-mcDm8bnTOXcu6s7DnMD8jyLa"}}).then(res=>res.json()).then(res=>res)
    let user1 = users.members?.map(user=>user.name)
    
    user1.forEach(r=>say(JSON.stringify(r)))
    
  } catch (error) {
    console.log("err")
    console.error(error);
  }
})

app.command("/getchannels",async({command,ack,say})=>{
  try {
    say("Channels in the workspace:")
    let users=await fetch("https://slack.com/api/conversations.list",{method:"GET",headers:{Authorization: "Bearer xoxb-2345683667521-4362553405635-mcDm8bnTOXcu6s7DnMD8jyLa"}}).then(res=>res.json()).then(res=>(res))
    let user1 = users.channels?.map(user=>user.name)
    console.log(user1)
    user1.forEach(r=>say(JSON.stringify(r)))
    
  } catch (error) {
    console.log("err")
    console.error(error);
  }
})

app.command("/getweather", async ({ command, ack, say }) => {
  try {
   let w = await getWeather(command.text)
   say( `
   City:${w.name},
   Description:${w.weather[0].description},
   Temperature:${(w.main.temp - 273).toFixed(2)}
   `)
  } catch (error) {
    console.log("err")
    console.error(error);
  }
})


app.message("hello", async ({ command, say }) => { // Replace hello with the message
    try {
      say("Hi! Thanks for PM'ing me!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});



// app1.listen(7000,()=>{
//     console.log("called")
// })