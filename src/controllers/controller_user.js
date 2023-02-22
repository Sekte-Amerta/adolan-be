const models = require("../../src/models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../helpers/email/sendEmail");
const activateAccountEmail = require("../helpers/email/activateAccountEmail");
const resetAccountEmail = require("../helpers/email/resetAccountEmail");
const jwtToken = require("../helpers/generateJwtToken");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, photo, status } = req.body;

      const CheckEmail = await models.user.findOne({
        where: { email },
      });

      if (CheckEmail) {
        return res.status(409).json({
          responseCode: 409,
          status: "failed",
          message: "Register Failed",
          error: "Email already exist",
        });
      }

      // Proses Insert Data
      const Generatepassword = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(30).toString("hex");

      const insertData = await models.user.create({
        name,
        email,
        password: Generatepassword,
        phone,
        status,
        photo,
      });

      const dataId = insertData.id;

      await models.user.update(
        { token },
        {
          where: { id: dataId },
        }
      );

      // send email for activate account
      const templateEmail = {
        from: `"Catalog" <${process.env.EMAIL_FROM}>`,
        to: req.body.email.toLowerCase(),
        subject: "Activate Your Account!",
        html: activateAccountEmail(
          `${process.env.API_URL}/auth/activation/${token}`
        ),
      };
      sendEmail(templateEmail);

      return res.status(200).json({
        responseCode: 200,
        status: "success",
        message: "Register success",
        error: null,
      });
    } catch (error) {
      // console.log(error)
      if (error.response) {
        return res
          .status(500)
          .json({ responseCode: 500, message: error.response.data.message });
      }
      return res
        .status(500)
        .json({ responseCode: 500, message: error.message });
    }
  },
  activation: async (req, res) => {
    try {
      const { token } = req.params;
      const user = await models.user.findOne({
        where: { token },
      });

      if (!user) {
        res.send(`
                <div>
                <h1>Activation Failed</h1>
                <h3>Token invalid</h3>
                </div>`);
        return;
      }

      await models.user.update(
        { is_verified: true, token: "" },
        { where: { id: user.id } }
      );

      return res.send(`
                    <div>
                        <h1>Activation Success</h1>
                        <h3>You can login now</h3>
                    </div>`);
    } catch (error) {
      res.send(`
                <div>
                    <h1>Activation Failed</h1>
                    <h3>${error.message}</h3>
                </div>`);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await models.user.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          responseCode: 404,
          status: "failed",
          message: "failed to login",
          error: "your account is not registered",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      // jika password benar
      if (match) {
        const jwt = await jwtToken({
          id: user.id,
          name: user.name,
          photo: user.photo,
        });
        return res.status(200).json({
          responseCode: 200,
          status: "success",
          message: "Login Success",
          token: jwt,
        });
      }

      return res.status(401).json({
        responseCode: 401,
        status: "failed",
        message: "Login Failed",
        error: "Wrong Email or Password",
      });
    } catch (error) {
      console.log(error);
    }
  },
  forgot: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await models.user.findOne({
        where: { email },
      });

      if (user) {
        const token = crypto.randomBytes(30).toString("hex");
        // update email token
        await models.user.update({ token }, { where: { id: user.id } });

        // send email for reset password
        const templateEmail = {
          from: `"Catalog" <${process.env.EMAIL_FROM}>`,
          to: req.body.email.toLowerCase(),
          subject: "Reset Your Password!",
          html: resetAccountEmail(
            `${process.env.CLIENT_URL}/auth/reset/${token}`
          ),
        };
        sendEmail(templateEmail);
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Forgot Password Success",
        data: null,
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "failed",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  reset: async (req, res) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      // const user = await userModel.findBy("token", token);
      const user = await models.user.findOne({
        where: { token },
      });

      if (!user) {
        return res.status(401).json({
          code: 401,
          status: "failed",
          message: "Reset Password Failed",
          error: "Token invalid",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      await models.user.update(
        { password: hashPassword, token: "" },
        {
          where: { id: user.id },
        }
      );

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Reset Password Success",
        data: null,
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: "failed",
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
