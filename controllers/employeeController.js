const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_change_me';

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await Employee.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const employee = await Employee.create({ name, email, passwordHash });

    return res.status(201).json({ id: employee.id, name: employee.name, email: employee.email });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, employee.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email, name: employee.name },
      JWT_SECRET,
      { expiresIn: '2d' }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

module.exports = { register, login };



