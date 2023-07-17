const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuid } = require("uuid");
const data = [];
data.employees = require("../../data/employees.json");

router
  .route("/")
  .get((req, res) => {
    res.json(data.employees);
  })
  .post((req, res) => {
    const newEmployee = {
      id: uuid(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    data.employees.push(newEmployee);
    console.log(data);
    res.json(newEmployee);
  })
  .put((req, res) => {
    //update the specific employee record through id
    const id = req.body.id;
    const updatedEmpoyee = {
      id: id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    const index = data.employees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      data.employees[index] = updatedEmpoyee;
      res.json(updatedEmpoyee);
    } else {
      res.status(400).json({ error: "employee not found" });
    }
    console.log(data);
  })
  .delete((req, res) => {
    // delete the employee record through id
    const id = req.body.id;
    const index = data.employees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      const deletedEmployee = data.employees.splice(index, 1);
      res.status(200).json(deletedEmployee);
    } else {
      res.status(400).json({ error: "employee not found" });
    }
    console.log(data);
  });

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const index = data.employees.findIndex((emp) => emp.id === id);

  res.json(data[index]);
});

module.exports = router;
