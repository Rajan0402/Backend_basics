const User = require("../model/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(400).send({ message: "no user found!" });
  res.status(201).json(users);
};

const deleteUser = async (req, res) => {
  // delete the employee record through id
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const userExist = await User.findOne({ _id: req.body.id }).exec();

  if (!userExist)
    res.status(400).json({ error: `user with id ${req.body.id} not found` });

  const deletedUser = await User.deleteOne({ _id: req.body.id });
  res.json(deletedUser);
};

const getUserWithId = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const userExist = await User.findOne({ _id: req.params.id }).exec();

  if (!userExist)
    res.status(400).json({ error: `user with id ${req.params.id} not found` });

  res.json(userExist);
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUserWithId,
};
