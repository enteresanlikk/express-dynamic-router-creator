const { networkInterfaces } = require('os');

module.exports = {
  getIp() {
    var interfaces = networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    return addresses[0] || '127.0.0.1';
  },
};
