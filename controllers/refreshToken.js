const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  // console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const userExist = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  try {
    if (!userExist) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || userExist.username !== decoded.username)
          return res.sendStatus(403);

        const roles = Object.values(userExist.roles);
        const accessToken = jwt.sign(
          {
            userInfo: {
              username: userExist.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleRefreshToken };
