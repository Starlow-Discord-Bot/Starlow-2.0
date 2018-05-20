var Discord = require("discord.js");
var Logger = require("./src/components/logger.js");
var Config = require("./src/components/config.js");
var fs = require("fs"); // I didn't want to do this, but the lack of functionality in this module forced me to... :(
var Permissions = require("./src/data/permissions.js");

// This is a very hacky way of restoring functionality that SHOULD'VE been available from the start :P
fs.isDirSync = (path) => {
    try {
        return fs.lstatSync(path).isDirectory();
    }
    catch(e) {
        return false;
    }
}

Discord.User.prototype.getPerms = (server) => {
    try {
        return Config.getUserConfig(this.id, server)['permissions'];
    }
    catch(e) {
        return -1;
    }
}

Config.init();
var config = Config.getConfig();
var client = new Discord.Client();
var commands = new Discord.Collection();

/*
    Command loader code originally from Starie Tech Modular Bot Framework,
    courtesy of Matthew "Matthe815" Orland.

    Copyright 2018
*/
function initCommands() {
    fs.readdirSync("./src/commands").forEach((command) => {
        try {
            var command = require(`./src/commands/${command}`);
        }
        catch(e) {
            console.log(`Error loading command, '${command}'.`);
            console.log(e)
            return;
        }

        try {
            command = new command();
        }
        catch(e) {
            console.log(`Error initializing command, '${command}'.`)
            console.log(e)
            return;
        }

        if (!command) return;

        commands.set(command.data.name, command);
    });
}

client.on("message", async (message) => {
    var commandInvoker = config["general"]["command-invoker"];
    if (!message.content.startsWith(commandInvoker) || message.channel.type == "dm") return; //Currently not accepting DM commands
    cmd = message.content.split(" ").slice(0, 1).join("").replace(commandInvoker, "");
    args = message.content.split(" ").slice(1);

    var command = commands.get(cmd.toLowerCase());
    if (!command) {
        return;
    }
    if (message.author.getPerms() < command.data.permissions) {
        return; // TODO: Handle this as a no permissions error
    }
    try {
        command.run(message, args);
    }
    catch(e) {
        message.reply(`An error has occurred while running this command: ${e}\nYou should never see this error! Please contact bennyman123abc#1417 to report this error!`)
    }
});

client.on("ready", async () => {
    initCommands();
    console.log(client.user.name);
    console.log(client.user.id);
    client.user.setPresence({game: {name: "Loaded!"}});
});

if (config["general"]["token"]) {
    client.login(config["general"]["token"]);
}
else {
    console.log(`Bot token not available!`);
}