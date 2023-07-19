const express = require("express");
const router = express.Router();
const path = require("path");

// ^ = should begin with next char, $ = should end with prev char, | = or
// the regex means route should begin with and end with "/" or it can be "/index.html"
// (...)? = means whatever under braces is optional
router.get("^/$|/index(.html)?", (req, res) => {
  // res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

module.exports = router;
