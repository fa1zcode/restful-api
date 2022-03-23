var jwt = require("jsonwebtoken");
const secretKey = "rubicamp";

module.exports = {
  isAuthenticated: (req, res, next) => {
    try {
      if (req.get("Authorization") && req.get("Authorization").split(" ")[1]) {
        const token = req.get("Authorization").split(" ")[1];
        var user = jwt.verify(token, secretKey);
        req.user = user;
        next();
      } else {
        res.json({
          success: false,
          data: "Token Invalid",
        });
      }
    } catch (err) {
      res.json({
        success: false,
        data: "Token Invalid",
      });
    }
  },
  secretKey,
};
