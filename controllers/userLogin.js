const User = require("../model/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "enter username and password both" });

  const userExist = await User.findOne({ username: user }).exec();
  try {
    if (!userExist)
      return res.status(404).json({ message: `user ${user} does not exist` });

    // check password
    const pwdmatch = bcrypt.compare(pwd, userExist.password);

    if (pwdmatch) {
      const roles = Object.values(userExist.roles);
      // create JWT
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: userExist.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30S" }
      );
      const refreshToken = jwt.sign(
        { username: userExist.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // saving refersh token with current user
      const result = await User.findOneAndUpdate(
        { username: user },
        { refreshToken: refreshToken },
        { new: true }
      ).exec();
      console.log(result);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        // sameSite: "none",
        // secure: true, // ths should used for prod and in browser,with this property enabled we cant test refresh route in thunderclient
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else res.status(401).json({ message: "wrong password" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
