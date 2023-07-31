const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  // console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  // console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const userExist = await User.findOne({ refreshToken: refreshToken }).exec();
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
