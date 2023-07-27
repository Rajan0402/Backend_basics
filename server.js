const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOption = require("./config/corsOption");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const exp = require("constants");
const PORT = process.env.PORT || 3000;

// custom middleware to log reqs
app.use(logger);

// cross origin resource sharing
app.use(cors(corsOption));

// biult-in middleware to handle urlencoded data
// in other words form data
// 'content-type': 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// biult-in middleware for json
app.use(express.json());

// middeware for cookies
app.use(cookieParser());

// serves static file
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// * covers all remaining routes that are not available in server
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

// custom middleware to log errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on Port ${PORT}`));
