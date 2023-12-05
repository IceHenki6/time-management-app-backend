const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async(req, res, next) => {
  const { email, password } = req.body

  try{
    const user = await User.findOne({email})

    const passwordIsCorrect = !user ? false : 
      await bcrypt.compare(password, user.passwordHash)

    if(!passwordIsCorrect){
      return res.status(401).json({error: 'wrong email or password'})
    }

    const tokenUser = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(
      tokenUser, 
      process.env.TOKEN_SECRET,
      { expiresIn: '1m' }
    )

    const refreshToken = jwt.sign(
      tokenUser,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '15d'}
    )

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 24 * 60 * 60 * 1000
    })
    
    res.status(200).send({token, username: user.username})
  }catch(error){
    next(error)
  }
})

module.exports = loginRouter