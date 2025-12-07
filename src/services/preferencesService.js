const User = require('../models/User');

class PreferencesService {
  getPreferences(userId) {
    const user = User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { preferences: user.preferences || [] };
  }

  updatePreferences(userId, preferences) {
    const user = User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = User.update(userId, { preferences });
    return { preferences: updatedUser.preferences };
  }
}

module.exports = new PreferencesService();