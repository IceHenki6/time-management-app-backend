const jwt = require('jsonwebtoken')
const User = require('../models/user')
const refreshTokenRouter = require('express').Router()


refreshTokenRouter.get('/', async (req, res, next) => {
  const cookies = req.cookies

  if (!cookies.jwt) {
    return res.status(401).json({ message: 'unauthorized' })
  }

  const refreshToken = cookies.jwt

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'forbidden' })
        }

        const user = await User.findOne({ username: decoded.username }).exec()

        if (!user) return res.status(401).json({ message: 'unauthorized' })

        const tokenUser = {
          username: user.username,
          id: user._id
        }

        const token = jwt.sign(
          tokenUser,
          process.env.TOKEN_SECRET,
          { expiresIn: '1m' }
        )

        res.json({ token, username: user.username })
      }
    )
  } catch (error) {
    next(error)
  }
})

module.exports = refreshTokenRouter