'use strict';
const fs = require('fs');

module.exports = {
    saveRoomData: function (roomData) {
        let data = JSON.stringify(roomData);
        fs.writeFile('data/' + roomData.roomId + '.json', data, (err) => {  
            if (err) return { "state": "ERR", "data": err }
        });
        return { "state": "OK" }
    },

    getRoomData: function(roomId) {
        let exists = fs.existsSync("data/" + roomId + ".json");
        if (!exists)
            return { "state": "ERR", "data": "FILE_NOT_FOUND" }
        let data = fs.readFileSync("data/" + roomId + ".json", "utf8");
        return { "state": "OK", "data": JSON.parse(data)};
    },

    // Delete room configs older than specified time
    deleteOldRooms: function() {
        fs.readdir("data/", (err, files) => {
            for (var i=0; i<files.length; i++) {
                var filename = files[i];
                fs.stat("data/"+filename, (err, stats) => {
                    if (Date.now() - stats.ctime > 8 * 3600 * 1000) {
                        fs.unlink("data/"+filename, (err) => {});
                    }
                });
            }
        });
    }
}