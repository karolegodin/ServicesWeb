const mongoose = require('mongoose');

const pdSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
  },
  color: {
    type: String,
  }
});

pdSchema.statics.retrieveData = async function(id) {
    const identifier = await this.findOne({ id });
    if (identifier) {
      const data = this.find({ id: identifier }).project({ name: 1, color: 1 });
      return data;
    }
    throw Error('user not existing in the database');
};
  
const PersonalData = mongoose.model('personaldata', pdSchema);
  
module.exports = PersonalData;