const data = {
  employees: require("../model/employees.json"),
  setEmployee: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    res.status(400).json({ message: "first & last names are required" });
  }

  data.setEmployee([...data.employees, newEmployee]);
  res.status(201).json(newEmployee);
};

const updateEmployee = (req, res) => {
  //update the specific employee record through id
  const id = parseInt(req.body.id);
  const employee = data.employees.find((emp) => emp.id === id);

  if (!employee)
    res.status(400).json({ error: `employee wit id ${req.body.id} not found` });

  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter((emp) => emp.id === id);
  const unsortedArray = [...filteredArray, employee];
  data.setEmployee(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(employee);
};

const deleteEmployee = (req, res) => {
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
};

const getEMployeeWithId = (req, res) => {
  const id = req.params.id;
  const index = data.employees.findIndex((emp) => emp.id === id);

  if (index !== -1) {
    res.json(data[index]);
  } else {
    res.status(400).json({ error: "employee not found" });
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEMployeeWithId,
};
