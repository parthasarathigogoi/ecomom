const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { verifyAdmin } = require('../middleware/auth');

// Get settings
router.get('/', verifyAdmin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(); // Create default settings if none exist
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update settings
router.put('/', verifyAdmin, async (req, res) => {
  const { siteTitle, adminEmail, itemsPerPage } = req.body;

  const settingsFields = {};
  if (siteTitle) settingsFields.siteTitle = siteTitle;
  if (adminEmail) settingsFields.adminEmail = adminEmail;
  if (itemsPerPage) settingsFields.itemsPerPage = itemsPerPage;

  try {
    let settings = await Setting.findOne();
    if (settings) {
      // Update
      settings = await Setting.findOneAndUpdate(
        { _id: settings._id },
        { $set: settingsFields },
        { new: true }
      );
      return res.json(settings);
    } else {
      // Create if not found
      settings = new Setting(settingsFields);
      await settings.save();
      return res.json(settings);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;