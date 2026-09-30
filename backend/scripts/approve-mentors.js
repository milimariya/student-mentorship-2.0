require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Mentor = require('../models/Mentor');

const targetNames = ['kiran', 'sneha a'];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const results = [];

    for (const name of targetNames) {
      const user = await User.findOne({ name: new RegExp(name, 'i'), role: 'mentor' }).lean();

      if (!user) {
        results.push({ name, status: 'not found' });
        continue;
      }

      const mentor = await Mentor.findOneAndUpdate(
        { user: user._id },
        { $set: { isApproved: true } },
        { new: true }
      ).populate('user');

      results.push({
        name: mentor?.user?.name || user.name,
        email: mentor?.user?.email || user.email,
        status: mentor?.isApproved ? 'approved' : 'failed',
      });
    }

    console.log(JSON.stringify(results, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
