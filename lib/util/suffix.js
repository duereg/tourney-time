module.exports = function(n) {
  var d;
  d = (n | 0) % 100;
  if (d > 3 && d < 21) {
    return 'th';
  } else {
    return ['th', 'st', 'nd', 'rd'][d % 10] || 'th';
  }
};
