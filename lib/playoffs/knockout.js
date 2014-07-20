module.exports = function(teams) {
  if (teams < 2) {
    return 0;
  } else if (teams < 4) {
    return 1;
  } else {
    return teams - (teams % 4);
  }
};
