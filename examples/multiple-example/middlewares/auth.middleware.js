module.exports = (req, res, next) => {
  const { token } = req.query;
  if (token === '123456') {
    req.user = {
      id: 1,
      name: 'John Doe',
    };
    
    return next();
  }

  return res.status(401).send('Unauthorized');
};
