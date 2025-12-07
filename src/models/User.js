class User {
  constructor() {
    this.users = new Map();
    this.idCounter = 1;
  }

  create(userData) {
    const id = this.idCounter++;
    const user = {
      id,
      ...userData,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  findById(id) {
    return this.users.get(id) || null;
  }

  update(id, updates) {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  delete(id) {
    return this.users.delete(id);
  }

  getAll() {
    return Array.from(this.users.values());
  }
}

module.exports = new User();