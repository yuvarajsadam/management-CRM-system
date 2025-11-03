const { sequelize, Enquiry } = require('../models');

async function submitPublic(req, res) {
  try {
    const { name, email, courseInterest, phone, message } = req.body;
    if (!name || !email || !courseInterest) {
      return res.status(400).json({ message: 'name, email, courseInterest are required' });
    }
    const enquiry = await Enquiry.create({ name, email, courseInterest, phone, message });
    return res.status(201).json(enquiry);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit enquiry', error: err.message });
  }
}

async function getPublicEnquiries(req, res) {
  try {
    const enquiries = await Enquiry.findAll({ where: { claimedBy: null }, order: [['id', 'DESC']] });
    return res.json(enquiries);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch public enquiries', error: err.message });
  }
}

async function claimEnquiry(req, res) {
  const enquiryId = parseInt(req.params.id, 10);
  if (Number.isNaN(enquiryId)) {
    return res.status(400).json({ message: 'Invalid enquiry id' });
  }

  const t = await sequelize.transaction();
  try {
    const enquiry = await Enquiry.findOne({ where: { id: enquiryId }, transaction: t, lock: t.LOCK.UPDATE });
    if (!enquiry) {
      await t.rollback();
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    if (enquiry.claimedBy) {
      await t.rollback();
      return res.status(409).json({ message: 'Enquiry already claimed' });
    }

    enquiry.claimedBy = req.user.id;
    enquiry.claimedAt = new Date();
    await enquiry.save({ transaction: t });
    await t.commit();
    return res.json(enquiry);
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ message: 'Failed to claim enquiry', error: err.message });
  }
}

async function getPrivateEnquiries(req, res) {
  try {
    const enquiries = await Enquiry.findAll({ where: { claimedBy: req.user.id }, order: [['id', 'DESC']] });
    return res.json(enquiries);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch private enquiries', error: err.message });
  }
}

module.exports = {
  submitPublic,
  getPublicEnquiries,
  claimEnquiry,
  getPrivateEnquiries,
};



