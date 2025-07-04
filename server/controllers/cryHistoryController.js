const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const CryHistory = require('../models/CryHistory');

exports.detectCry = async (req, res) => {
  try {
    const audioPath = req.file.path; // Assuming multer is used
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioPath));

    const response = await axios.post(
      'http://localhost:5000/predict-type',
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const { cry_type, confidence, timestamp } = response.data;

    const cryRecord = new CryHistory({
      user: req.user.id, // if using auth
      cryType: cry_type,
      confidence,
      timestamp,
    });

    await cryRecord.save();

    res.json({ message: 'Cry type recorded', cry_type, confidence });
  } catch (error) {
    console.error(error);
    res.status(500).send('Detection failed');
  }
};
