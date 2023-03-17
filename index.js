const { App, ExpressReceiver } = require("@slack/bolt");
const Axios = require('axios');
const { text } = require("express");
const express  = require("express")
const app1 = require("./app")
// const app1 = express()

const boltReceiver = new ExpressReceiver({
    signingSecret:"09ce0fcfa673e689cb8ed9c7b0b17e5f",
    router: app1,
    endpoints: '/new/slack/events'
})


const app = new App({
    token: "xoxb-2345683667521-4652214505764-LFMRhjGfcwQtM0onkfb33pZ0", //Find in the Oauth  & Permissions tab
    signingSecret: "09ce0fcfa673e689cb8ed9c7b0b17e5f", // Find in Basic Information Tab
   receiver:boltReceiver,
    appToken: "xapp-1-A04JP5AEAQ7-4673421126160-23e87ee7753574fb0a6c8da2d559128327afca6883d527b120604ab03c2e8ec4"
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
  await ack();
  try {
    
    say("Users in the workspace:")
    let users=await fetch("https://slack.com/api/users.list",{method:"GET",headers:{Authorization: "Bearer xoxb-2345683667521-4652214505764-LFMRhjGfcwQtM0onkfb33pZ0"}}).then(res=>res.json()).then(res=>res)
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
    let users=await fetch("https://slack.com/api/conversations.list",{method:"GET",headers:{Authorization: "Bearer xoxb-2345683667521-4652214505764-LFMRhjGfcwQtM0onkfb33pZ0"}}).then(res=>res.json()).then(res=>(res))
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

//SWITCH CASE RESPONSE USONG SLASG COMMANDS

app.command("/chat",async ({ command, ack, say }) => {
  console.log(command.text)
  ack()
  try {
    switch(command.text){
      case "hello":
        say("Hello from bot");
        break;
      case "hi":
        say("Hi from bot")
        break;
      default:
        say("say it again")
    }
  } catch (error) {
    console.log("err")
    console.error(error);
  }
})

//SWITCH CASE RESPONSE USING APP MENTIONS

app.event("app_mention",async({event, client, logger})=>{
  let text=event.text.substr(event.text.indexOf(" ") + 1)
  let message
  switch(text){
    case "hello":
      message="hello from bot"
      break;
    case "hi":
      message="hi from bot"
      break;
    default:
      message="say again"
      
  }
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel:event.channel,
      text: `Welcome to the team, <@${event.user}>! ${message}`
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }

  
})


//SWITCH CASE RESPONSE USING MESSAGE

app.message("com", async ({ message, say }) => { // Replace hello with the message
  console.log(message.text) 
  try {
      
      switch(message.text){
        case "hello":
          say("Hello from bot");
          break;
        case "hi":
          say("Hi from bot")
          break;
        default:
          say("say it again")
      }

      // say("Hi! Thanks for PM'ing me!"+" "+`this tect is from ${message.user} in team ${message.team}`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});



// app1.listen(7000,()=>{
//     console.log("called")
// })