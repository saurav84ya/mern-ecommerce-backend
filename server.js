const express = require("express"); // Importing the Express module

const app = express(); // Creating an instance of Express

// Setting up a middleware for the root route "/"
app.use("/", (req, res) => {
    return res.send("Hello World fuck"); // Sending "Hello World" as the response
});

// Starting the server on port 6000
app.listen(6000);
