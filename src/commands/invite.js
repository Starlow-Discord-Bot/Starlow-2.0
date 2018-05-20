var Permissions = require('../data/permissions.js');

class InviteCommand {
    constructor() {
        this.data = {
            name: "invite",
            description: "Get an invite link for your guild",
            usage: "{INVOKER}{COMMAND}",
            permissions: Permissions.MEMBER,
            category: "Misc."
        }
    }

    run(message, args) {
        message.author.send("https://discordapp.com/oauth2/authorize?client_id=369599186284445707&scope=bot&permissions=738454767");
        message.author.send("Use that link to invite me to your Discord server! You won't regret it! :smile:");
        message.reply("I DM'ed you my invite link. Hope to see you on your server!");
    }
}

module.exports = InviteCommand;