module.exports = {
  async get(req, res) {
    res.send('user detail');
  },
  async getAll(req, res) {
    res.send('user list');
  },
  async add(req, res) {
    res.send('add user');
  },
  async update(req, res) {
    res.send('update user');
  },
  async delete(req, res) {
    res.send('delete user');
  },
};
