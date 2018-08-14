const fr = require('find-remove');

module.exports = {
    // Utility to create random string
    makeRandomString: function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length - 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    // Utility to create room ID (6 characters)
    makeRoomId: function() {
        return this.makeRandomString(6);
    },

    // Utility to create Stream Key (24 characters)
    makeStreamKey: function() {
        return this.makeRandomString(24);
    },

    makeNewRoom: function(roomName) {
        return {
            "roomId": this.makeRoomId(),
            "roomName": roomName,
            "streamKeyIn": this.makeStreamKey(),
            "streamKeyOut": this.makeStreamKey(),
            "expirationDate": Date.now() + 8 * 3600 * 10000
        }
    }
}