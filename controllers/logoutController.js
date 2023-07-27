const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // on client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const userExistWithRT = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  try {
    // check if refresh token in DB
    if (!userExistWithRT) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    // remove refresh token form DB
    const otherUsers = usersDB.users.filter(
      (person) => person.refreshToken !== refreshToken
    );
    const currentUser = { ...userExistWithRT, refreshToken: "" };
    usersDB.setUsers([otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogout };
