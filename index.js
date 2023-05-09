const telegram = require("node-telegram-bot-api")
require("dotenv").config()
const puppeteer = require("puppeteer")
const fs = require("fs")
const check_uri = require("valid-url")

const bot = new telegram(process.env.key,{polling:true})

bot.on('message',async(msg)=>{
    const chat_id = msg.chat.id
    if(check_uri.isUri(msg.text)){
        const res = await bot.sendMessage(chat_id,"Please wait")
        const data = await doScreenCapture(msg.text)
        for(i=0;i<=100;i=i+10){
            await bot.editMessageText(i+"%",{chat_id:chat_id,message_id:res.message_id})
        }
        if(i>100){
            await bot.deleteMessage(chat_id,res.message_id)
            await bot.sendDocument(chat_id,data);
            fs.unlink(__dirname+"/"+data+"",(err,data)=>{})
        }  
    }else{
        bot.sendMessage(chat_id,"Send a website link and get screenshot of that web page!")
    }
    return
})

async function doScreenCapture(url) {
    const now = new Date().getTime()
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'domcontentloaded'});  
    await page.screenshot({
      fullPage: true,
      path:`@thenamevishnu-${now}.png`
    });
    await browser.close();
    return `@thenamevishnu-${now}.png`  
}