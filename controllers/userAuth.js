const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "enter username and password both" });

  const userExist = usersDB.users.find((person) => person.username === user);
  try {
    if (!userExist)
      return res.status(404).json({ message: `user ${user} does not exist` });

    // check password
    const pwdmatch = bcrypt.compare(pwd, userExist.password);

    if (pwdmatch)
      // create JWT
      return res.status(200).json({ success: `user ${user} logged in` });
    else res.status(401).json({ message: "wrong password" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
