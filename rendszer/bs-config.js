const browserSync = require('browser-sync').create();

module.exports = {
    server: {
        baseDir: ["../film", "./"],

        middleware: function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            next();
        }
    },
    files: ["index.html", "css/*.css", "js/*.js", "../film/*"],
    open: true, // Automatically open browser
    notify: false, // Disable notifications in the browser

    ghostMode: {
        clicks: false, // Disable click synchronization
        scroll: false, // Disable scroll synchronization
        forms: false,  // Disable form synchronization
    },

    injectChanges: true, // Enable script injection

    port: 99,
    open: false,

    // Custom hook to handle socket events after BrowserSync starts
    callbacks: {
        ready: function (err, bs) {
            bs.io.sockets.on("connection", (client) => {
                console.log("A browser connected!");

                // Listen for custom events
                client.on("custom:event", (data) => {
                    console.log("Received custom event:", data);

                    // Broadcast the custom event to all connected clients
                    bs.io.sockets.emit("custom:event", data);  // Broadcasting to all connected clients
                });
            });
        }
    }
};
