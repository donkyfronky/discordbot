const Discord = require('discord.js');
const client = new Discord.Client();
const apiKey = process.env.apiKey;
const port  = process.env.PORT || 80;
let Config = {};
if(!Config.hasOwnProperty("commandPrefix")){
  Config.commandPrefix = '!';
}

let commands = {
  "ping": {
    description: "responds pong, useful for checking if bot is alive",
    process: function(bot, msg, suffix) {
      msg.channel.sendMessage( msg.author+" pong!");
      if(suffix){
        msg.channel.sendMessage( "note that !ping takes no arguments!");
      }
    }
  },
  "idle": {
    usage: "[status]",
    description: "sets bot status to idle",
    process: function(bot,msg,suffix){
      bot.user.setStatus("idle");
      bot.user.setGame(suffix);
    }
  },
  "online": {
    usage: "[status]",
    description: "sets bot status to online",
    process: function(bot,msg,suffix){
      bot.user.setStatus("online");
      bot.user.setGame(suffix);
    }
  },
  "say": {
    usage: "<message>",
    description: "bot says message",
    process: function(bot,msg,suffix){ msg.channel.sendMessage(suffix);}
  },
  "announce": {
    usage: "<message>",
    description: "bot says message with text to speech",
    process: function(bot,msg,suffix){ msg.channel.sendMessage(suffix,{tts:true});}
  },
  "eval": {
    usage: "<command>",
    description: 'Executes arbitrary javascript in the bot process. User must have "eval" permission',
    process: function(bot,msg,suffix) {
      if(Permissions.checkPermission(msg.author,"eval")){
        msg.channel.sendMessage( eval(suffix,bot));
      } else {
        msg.channel.sendMessage( msg.author + " doesn't have permission to execute eval!");
      }
    }
  }
};

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message =>
  checkMessageForCommand(message, false)
);

client.login(apiKey);

function checkMessageForCommand(msg, isEdit) {
  //check if message is a command
  if(msg.author.id != client.user.id && (msg.content.startsWith(Config.commandPrefix))){
    let cmdTxt = msg.content.split(" ")[0].substring(Config.commandPrefix.length);
    let suffix = msg.content.substring(cmdTxt.length+Config.commandPrefix.length+1);//add one for the ! and one for the space
    let cmd = commands[cmdTxt];
    if(cmd) {
          cmd.process(client,msg,suffix,isEdit);
    } else {
      msg.channel.sendMessage(cmdTxt + " not recognized as a command!").then((message => message.delete(5000)))
    }
  } else {
    //message isn't a command or is from us
    //drop our own messages to prevent feedback loops
    if(msg.author == client.user){
      return;
    }

    if (msg.author != client.user && msg.isMentioned(client.user)) {
      msg.channel.sendMessage(msg.author + ", you called?");
    } else {

    }
  }
}