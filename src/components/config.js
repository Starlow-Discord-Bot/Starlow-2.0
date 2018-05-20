var fs = require("fs");

class BotConfigException {
    constructor(msg) {
        this.name = "BotConfigException";
        this.message = msg || "The bot's config does not exist.";
    }
}

var generateServerConfig = (server) => {
    if (!fs.isDirSync('./config/users')) {
        fs.mkdirSync('./config/users');
    }
    fs.mkdirSync(`./config/users/${server}`);
    fs.copyFileSync('./src/data/default-serverconfig.json', `./config/users/${server}/config.json`);
}

var getServerConfig = (server) => {
    if (!fs.isDirSync('./config/users')) {
        fs.mkdirSync('./config/users');
    }
    if (!fs.isDirSync(`./config/users/${server}`)) {
        generateServerConfig(server);
    }
    try {
        return JSON.parse(fs.readFileSync(`./config/users/${server}/config.json`));
    }
    catch(e) {
        generateServerConfig(server);
    }
}

var writeServerConfig = (server, modifiedConfig) => {
    try {
        fs.writeFileSync(`./config/users/${server}/config.json`, JSON.stringify(modifiedConfig, null, 4));
        return true;
    }
    catch(e) {
        return false;
    }
}

var generateGlobalUserConfig = (user) => {
    if (!fs.isDirSync('./config/users')) {
        fs.mkdirSync('./config/users');
    }
    if (!fs.isDirSync(`./config/users/global`)) {
        fs.mkdirSync(`./config/users/global`);
    }
    fs.copyFileSync('./src/data/default-globaluserconfig.json', `./config/users/global/${user}.json`);
}

var getGlobalUserConfig = (user) => {
    if (!fs.isDirSync('./config/users')) {
        fs.mkdirSync('./config/users');
    }
    if (!fs.isDirSync(`./config/users/global`)) {
        generateGlobalUserConfig(user);
    }

    try {
        return JSON.parse(fs.readFileSync(`./config/users/global/${user}.json`));
    }
    catch(e) {
        return generateGlobalUserConfig(user);
    }
}

var writeGlobalUserConfig = (user, modifiedConfig) => {
    try {
        fs.writeFileSync(`./config/users/global/${user}.json`, JSON.stringify(modifiedConfig, null, 4));
        return true;
    }
    catch(e) {
        return false;
    }
}

var generateUserConfig = (user, server) => {
    if (!fs.isDirSync(`./config/users/${server}`)) {
        generateServerConfig(server);
    } // Just to be safe ;)

    fs.copyFileSync("./src/data/default-userconfig.json", `./config/users/${server}/${user}.json`)
    try {
        return JSON.parse(fs.readFileSync(`./config/users/${server}/${user}.json`));
    }

    catch(e) {
        return;
    }
}

var getUserConfig = (user, server) => {
    if (!fs.isDirSync('./config/users')) {
        fs.mkdirSync('./config/users');
    }

    if (!fs.isDirSync(`./config/users/${server}`)) {
        generateServerConfig(server);
    }

    try {
        return JSON.parse(fs.readFileSync(`./config/users/${server}/${user}.json`));
    }
    catch(e) {
        return generateUserConfig(user, server);
    }
}

var writeUserConfig = (user, server, modifiedConfig) => {
    try {
        fs.writeFileSync(`./config/users/${server}/${user}.json`, JSON.stringify(modifiedConfig, null, 4));
        return true;
    }
    catch(e) {
        return false;
    }
}

var generateConfig = () => {
    try {
        fs.copyFileSync("./src/data/default-config.json", "./config/config.json");
    }
    catch(e) {
        throw(e); //Temporary
    }
}

var getConfig = () => {
    try {
        return JSON.parse(fs.readFileSync("./config/config.json"));
    }
    catch(e) {
        throw(new BotConfigException());
    }
}

var writeConfig = (modifiedConfig) => {
    try {
        fs.writeFileSync('./config/config.json', JSON.stringify(modifiedConfig, null, 4));
        return true;
    }
    catch(e) {
        return false;
    }
}

var init = () => {
    if (!fs.isDirSync("./config")) {
        fs.mkdirSync("./config");
    }

    if (!fs.existsSync("./config/config.json")) {
        generateConfig();
    }
}

module.exports = {
    init,
    getConfig,
    writeConfig,
    getUserConfig,
    writeUserConfig,
    getServerConfig,
    writeServerConfig,
    getGlobalUserConfig,
    writeGlobalUserConfig
}