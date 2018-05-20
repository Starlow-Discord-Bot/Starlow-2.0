var Discord = require("discord.js");
var Logger = require("./src/components/logger.js");
var Config = require("./src/components/config.js");
var fs = require("fs"); // I didn't want to do this, but the lack of functionality in this module forced me to... :(

// This is a very hacky way of restoring functionality that SHOULD'VE been available from the start :P
fs.isDirSync = (path) => {
    try {
        return fs.lstatSync(path).isDirectory();
    }
    catch(e) {
        return false;
    }
}

Config.init();
var config = Config.getConfig();
var client = new Discord.Client();
var commands = [];

/*
    Command loader code originally from Starie Tech Modular Bot Framework,
    courtesy of Matthew "Matthe815" Orland.

    Copyright 2018
*/
function initCommands() {
    fs.readdirSync("./src/commands").forEach((command) => {
        try {
            require(`./src/commands/${command}`);
        }
        catch(e) {
            console.log(`Error loading command, '${command}'.`);
        }

        try {
            command = new command();
        }
        catch(e) {
            console.log(`Error initializing command, '${command}'.`)
        }

        if (!command) return;

        commands.push(command);
    });
}

client.on("message", (message) => {
    var commandInvoker = config["general"]["command-invoker"];
    if (!message.content.startsWith(commandInvoker) || message.channel.type == "dm") return; //Currently not accepting DM commands

    cmd = message.content.split(" ").slice(0, 1).join("");
    args = message.content.split(" ").slice(1);

    
});

client.on("ready", () => {
    initCommands();
});