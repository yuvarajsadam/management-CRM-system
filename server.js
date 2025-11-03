const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const employeeRoutes = require('./routes/employeeRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'crm-backend' });
});

// Health for proxied frontend requests
app.get(['/api', '/api/', '/api/health'], (req, res) => {
  res.json({ status: 'ok', service: 'crm-backend', base: '/api' });
});

app.use('/api/employees', employeeRoutes);
app.use('/api/enquiries', enquiryRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


