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

getPerms = (user, server) => {
    try {
        var globalUserConfig = Config.getGlobalUserConfig(user);
        var userConfig = Config.getUserConfig(user, server);
        if (user.bot) {
            globalUserConfig.permission_override = Permissions.BOT;
            Config.writeGlobalUserConfig(user, globalUserConfig);
        }
        if (globalUserConfig.permission_override) {
            userConfig.permissions = globalUserConfig.permission_override;
        }
        Config.writeUserConfig(user, server, userConfig);
    }
    catch(e) {
        console.log(e);
    }

    try {
        return Config.getUserConfig(user, server).permissions;
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
            var commandName = command;
            var command = require(`./src/commands/${command}`);
        }
        catch(e) {
            console.log(`Error loading command, '${command}'.`);
            return;
        }

        try {
            command = new command();
        }
        catch(e) {
            console.log(`Error initializing command, '${commandName}'.`)
            return;
        }

        if (!command) return;

        commands.set(command.data.name, command);
    });
}

function reloadCommands() {
    commands = new Discord.Collection();
    initCommands();
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
    if (getPerms(message.author.id, message.guild.id) < command.data.permissions) {
        return; // TODO: Handle this as a no permissions error
    }
    if (message.author.bot) {
        var user = message.author.id;
        var server = message.guild.id;
        var userConfig = Config.getUserConfig(user, server);
        userConfig.permissions = Permissions.BOT;
        Config.writeUserConfig(user, server, userConfig);
        return;
    }
    try {
        command.run(message, args);
    }
    catch(e) {
        message.reply(`An error has occurred while running this command: \n\`${e}\`\nYou should never see this error! Please contact bennyman123abc#1417 to report this error!`)
    }
});

client.on("ready", async () => {
    initCommands();
    console.log(client.user.username);
    console.log(client.user.id);
    client.user.setPresence({game: {name: "*help"}});
});

if (config["general"]["token"]) {
    client.login(config["general"]["token"]);
}
else {
    console.log(`Bot token not available!`);
}

module.exports = {
    commands: commands,
    client: client
}