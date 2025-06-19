const crypto = require('crypto');

const generateToken = () => {
  return crypto.randomBytes(48).toString('hex');
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${key}`;
};

const verifyPassword = (password, hashedPassword) => {
  const [salt, key] = hashedPassword.split(':');
  const keyToVerify = crypto.scryptSync(password, salt, 64).toString('hex');
  return key === keyToVerify;
};

module.exports = {
  generateToken,
  hashPassword,
  verifyPassword
};