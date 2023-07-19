const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOption = require("./config/corsOption");
const PORT = process.env.PORT || 3000;

// custom middleware
app.use(logger);

// cross origin resource sharig
app.use(cors(corsOption));

// biult-in middleware to handle urlencoded data
// in other words form data
// 'content-type': 'application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// biult-in middleware for json
app.use(express.json());

// serves static file
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
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

app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on Port ${PORT}`));
