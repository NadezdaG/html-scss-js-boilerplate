console.log("Load script.js");

// Instantiating the global app object
var app = {};

// Global
app.global = {
    init: function(){ // Load all global functions here
        console.log("load global functions s");
        app.global.loadHeader();
    },
    loadHeader: function(){ // Some specific function
        console.log("loadHeader()");
    }
}

// Run the global stuff
app.global.init();
