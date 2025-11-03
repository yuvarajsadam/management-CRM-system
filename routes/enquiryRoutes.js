const express = require('express');
const auth = require('../middlewares/auth');
const {
  submitPublic,
  getPublicEnquiries,
  claimEnquiry,
  getPrivateEnquiries,
} = require('../controllers/enquiryController');

const router = express.Router();

// Public form submit - no auth
router.post('/public-submit', submitPublic);

// Fetch unclaimed leads - auth required
router.get('/public', auth, getPublicEnquiries);

// Claim a lead - auth required
router.post('/:id/claim', auth, claimEnquiry);

// Fetch private (claimed by logged-in user) - auth required
router.get('/private', auth, getPrivateEnquiries);

module.exports = router;



