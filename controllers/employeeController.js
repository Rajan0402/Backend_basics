const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(400).send({ message: "no employees found!" });
  res.status(201).json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    res.status(400).send({ message: "first & last names are required" });
  }

  try {
    const newEmployee = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  //update the specific employee record through id
  // const employee = data.employees.find((emp) => emp.id === id);
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const employeeExist = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employeeExist)
    res
      .status(204)
      .json({ error: `employee with id ${req.body.id} not found` });

  if (req.body?.firstname) employeeExist.firstname = req.body.firstname;
  if (req.body?.lastname) employeeExist.lastname = req.body.lastname;

  const updatedEmployee = await employeeExist.save();
  res.json(updatedEmployee);
};

const deleteEmployee = async (req, res) => {
  // delete the employee record through id
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const employeeExist = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employeeExist)
    res
      .status(400)
      .json({ error: `employee with id ${req.body.id} not found` });

  const deletedEmployee = await Employee.deleteOne({ _id: req.body.id });
  res.json(deletedEmployee);
};

const getEMployeeWithId = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const employeeExist = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employeeExist)
    res
      .status(400)
      .json({ error: `employee with id ${req.params.id} not found` });

  res.json(employeeExist);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEMployeeWithId,
};
