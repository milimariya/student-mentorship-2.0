require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Mentor = require('../models/Mentor');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({ name: /kiran/i, role: 'mentor' }).select('_id name email');

    if (!users.length) {
      console.log('No mentor named Kiran found.');
      await mongoose.disconnect();
      return;
    }

    for (const user of users) {
      const mentor = await Mentor.findOneAndUpdate(
        { user: user._id },
        { $set: { isApproved: true } },
        { new: true }
      ).populate('user');

      console.log(`Approved mentor: ${mentor.user.name} (${mentor.user.email})`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Failed to approve Kiran:', error.message);
    process.exit(1);
  }
})();
