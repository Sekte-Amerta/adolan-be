const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const { token } = req.headers
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.APP_DATA = {
            tokenDecoded: decoded
        }
        next()
    } catch (err) {
        res.json({
            responseCode: 500,
            message: "Token Invalid",
            error: "Unauthorized"
        })
    }
}