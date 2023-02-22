const models = require("../models/index");

module.exports = {
  isVerified: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await models.user.findOne({
        where: { email },
      });

      if (!user) {
        next();
      } else if (user.is_verified === "1") {
        next();
      } else {
        return res.json({
          responseCode: 401,
          status: "failed",
          message: "Unauthorized",
          error: "Your email is not verified yet",
        });
      }
    } catch (error) {
      return res.json({
        responseCode: 500,
        status: "failed",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
