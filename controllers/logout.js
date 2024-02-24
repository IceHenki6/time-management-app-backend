const logoutRouter = require('express').Router()

logoutRouter.get('/', (req, res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    console.log('no cookie')
    return res.sendStatus(204)
  }

  res.clearCookie('jwt', { 
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  })
  res.json({ message: 'cookie cleared' })
})

module.exports = logoutRouter
