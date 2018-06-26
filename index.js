const express = require('express')
const path = require("path")
const bodyParser = require('body-parser');
const axios = require('axios')
app = express()

// Define root of html directory
const htmlRoot = path.join(__dirname+'/templates/')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use( bodyParser.json() );

app.get("/", (req, res) => {
    smsLogin("invitations@lushplans.com", "LUSH PLANS", "000000").then((res) => {
        console.log("Here")
        console.log(res)
    }).catch((err) => {
        console.log("Error")
    })
    res.sendFile(htmlRoot + "index.html")
})

app.get("/about", (req, res) => {
    res.sendFile(htmlRoot + "/about.html")
})

let smsLogin = function(email, subAcct, subAcctPwd){

    let url = `http://www.smslive247.com/http/index.aspx?cmd=login&owneremail=${email}&subacct=${subAcct}&subacctpwd=${subAcctPwd}`
    return axios.get(url).then((res) => {        
        if (res.data.includes("OK: ")){
            console.log(res.data.replace("OK: ", ""))
        }
    }).catch((err) => {
        console.log(err)
    })
}


let sendSMS = function(phoneNumberFrom, phoneNumberTo, message, session_id){
    re = /^(\+{0,1}\d{11,13})$/;
    const numberValid = re.test(phoneNumberTo);
    
    if(!numberValid){
        console.error("Invalid number supplied")
        return
    }

    if(!message){
        console.error("No message supplied")
        return
    }
            
    let url = `http://www.smslive247.com/http/index.aspx?cmd=sendmsg&sessionid=${session_id}&message=${message}&sender=${phoneNumberFrom}&sendto=${phoneNumberTo}&msgtype=0`
    return axios.get(url).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err)
    })

}


app.post("/_message-selected", function(req, res){
    // console.log(req.body)
    const vendorIDs = req.body.vendorIDs
    console.log(vendorIDs)        
})

app.get("/_allvendors", function(req, res){
    console.log(req.query.wp)
})


const FBBotFramework = require('fb-bot-framework');

const bot = new FBBotFramework({
    page_token : "EAAd4k7k4pbsBAAUZB7caYKQD5yJWfhmP0pboS41KTo1piwlfDsc805GMZAIbszklNajclmQCqkEky9vXVRfBAAVDRJPdZBx71kbMLCFJAlp2OaYOr87V4wXDAsG8BJQAhXMu8Ci3nfiE7C1TL1xmiEeCJbIsZCOjDV8OYQZA96p1BcOJhooIXO66ysyNDmcUZD",
    verify_token : "helloworld"
})

app.use('/bot/', bot.middleware())

bot.on('message', (userId, message) => {
    console.log(userId, message)
})

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log("Listening on port :", port)
})