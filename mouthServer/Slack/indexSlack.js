const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config()

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'Tim'
})


