const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const userExistWithRT = await User.findOne({ refreshToken }).exec();
  try {
    // check if refresh token in DB
    if (!userExistWithRT) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    // remove refresh token form DB

    // const result = await User.findOneAndUpdate(
    //   { username: userExistWithRT.username },
    //   { $set: { refreshToken: "" } },
    //   { new: true }
    // );
    // console.log(result);
    // ****** OR USE BELOW CODE ******* //

    userExistWithRT.refreshToken = "";
    const result = await userExistWithRT.save();
    console.log(result);

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
