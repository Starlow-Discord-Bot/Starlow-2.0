var Permissions = require("../data/permissions.js");

class TestCommand {
    constructor() {
        this.data = {
            name: "test",
            description: "Test command",
            usage: "{INVOKER}{COMMAND}",
            permissions: Permissions.MEMBER,
            category: "Testing"
        }
    }

    run(message, args) {
        message.reply("Test");
    }
}

module.exports = TestCommand;