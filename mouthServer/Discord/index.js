const RiveScript= require("rivescript")
const { Client, Intents } = require("discord.js")

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const { token } = require('./config.json');

var steeve = new RiveScript();

steeve.loadDirectory("../../server/pathtobrain").then(loading_done).catch(loading_error)

bot.login(token)

function loading_done() {
    console.log("Loading done. You can proceed.");
    steeve.sortReplies();
    }


    function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
    }

    bot.on('ready', function () {console.log("Connected to Discord")})

    bot.on('messageCreate', message => {
            if(message.channel.name == "general" && message.author.id != bot.application.id)
            {
                let entry = message.content 
                steeve.reply(message.author.name, entry).then(function(reply)
                    {
                        var output = reply;
                        if(output != "Error::No Reply Matched")
                        {
                            message.channel.send(output)
                        }
                        else
                        {
                            message.channel.send("I do not understand, please be more precise.")
                        }
                    }
                );
            }
        }
    )