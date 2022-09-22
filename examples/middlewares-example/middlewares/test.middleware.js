module.exports = (req, res, next) => {
  res.setHeader('test-header', 'lorem ipsum');
  next();
};
