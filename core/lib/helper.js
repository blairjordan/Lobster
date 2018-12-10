const random = () => `${Math.round((Math.random() * 36 ** 12)).toString(36)}`;

module.exports = { random };