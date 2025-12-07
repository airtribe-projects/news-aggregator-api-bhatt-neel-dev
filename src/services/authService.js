const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

class AuthService {
  async signup(userData) {
    const existingUser = User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      preferences: userData.preferences || []
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiry }
    );

    return { token };
  }
}

module.exports = new AuthService();