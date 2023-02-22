require("dotenv").config();
module.exports = {
  development: {
    username: process.env.USERNAME_DEV,
    password: process.env.PASSWORD_DEV,
    database: process.env.DATABASE_DEV,
    host: process.env.HOST_DEV,
    port: process.env.DBPORT,
    dialect: process.env.DIALECT,
    pool: {
      max: 50,
      min: 0,
      idle: 10000,
      acquire: 20000,
    },
  },

  production: {
    username: process.env.USERNAME_PROD,
    password: process.env.PASSWORD_PROD,
    database: process.env.DATABASE_PROD,
    host: process.env.HOST_PROD,
    port: process.env.DBPORT,
    dialect: process.env.DIALECT,
    pool: {
      max: 50,
      min: 0,
      idle: 10000,
      acquire: 20000,
    },
    timezone: "07:00",
  },
};
