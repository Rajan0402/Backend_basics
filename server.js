const express = require('express');
const app = express();
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;

// custom middleware
app.use(logger);

// cross origin resource sharig
const whiteList = ['https://www.mysite.com','https://www.google.com', 'http://127.0.0.1:5500','http://localhost:3000'];
const corsOption = {
    origin : (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}
app.use(cors(corsOption));

// biult-in middleware to handle urlencoded data
// in other words form data
// 'content-type': 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));
 
// biult-in middleware for json
app.use(express.json());

// serves static file
app.use(express.static(path.join(__dirname,'public')))

// ^ = should begin with next char, $ = should end with prev char, | = or
// the regex means route should begin with and end with "/" or it can be "/index.html"
// (...)? = means whatever under braces is optional
app.get("^/$|/index(.html)?", (req, res) => {
    // res.sendFile("./views/index.html", { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, '/new-page.html');
});

app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("Hello World!")
});

// * covers all remaining routes that are not available in server
app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts("html")) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts("json")) {
        res.json({error: "404 not found"})
    } else {
        res.type('txt').send('404 not found')
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on Port ${PORT}`));