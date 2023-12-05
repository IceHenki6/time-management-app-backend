const logoutRouter = require('express').Router()

logoutRouter.post('/', (req, res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return res.sendStatus(204)
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'cookie cleared' })
})

module.exports = logoutRouter