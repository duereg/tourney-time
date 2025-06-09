// This code was modified from code found at http://github.com/clux/duel

const WB = "Winner"
    , LB = "Loser"
    , WO = "BYE";

var getGameTitle = function(match, bracket) {
  if(match.isBye) {
    return (match.teams[0] === WO ? match.teams[1] : match.teams[0]);
  } else {
    return bracket + " " + match.id;
  }
};

var blank = function (matchOne, matchTwo, bracket) {
  return [getGameTitle(matchOne, bracket) , getGameTitle(matchTwo, bracket)];
};

var isBye = function(teams, numTeams) {
  return teams[0] > numTeams || teams[1] > numTeams;
}

// mark players that had to be added to fit model as WO's
var woMark = function (ps, numTeams) {
  return ps.map(function (p) {
    return (p > numTeams) ? WO : "Seed " + p;
  });
};

// shortcut to create a match id as duel tourneys are very specific about locations
var gId = function (p, round, match) {
  return parseInt(p.toString() + round.toString() + match.toString());
};

// helpers to initialize duel tournaments
// http://clux.org/entries/view/2407
var evenSeed = function (i, p) {
  var k = Math.floor(Math.log(i) / Math.log(2))
    , r = i - Math.pow(2, k);
  if (r === 0) {
    return Math.pow(2, p - k);
  }
  var nr = (i - 2*r).toString(2).split('').reverse().join('');
  return (parseInt(nr, 2) << p - nr.length) + Math.pow(2, p - k - 1);
};

// get initial players for match i in a power p duel tournament
// NB: match number i is 1-indexed - VERY UNDEFINED for i<=0
var seeds = function (i, p) {
  var even = evenSeed(i, p);
  return [Math.pow(2, p) + 1 - even, even];
};

// make ALL matches for a single elimination tournament
var elimination = function (numTeams, p) {
  var matches = [];
  // first WB round to initialize players
  for (var match = 1; match <= Math.pow(2, p - 1); match += 1) {
    var maSeed = seeds(match, p);
    matches.push({ id: gId(p, 1, match), round: 1, teams: woMark(maSeed, numTeams), isBye: isBye(maSeed, numTeams) });
  }

  // middle WB rounds
  var round, game, matchOne, matchTwo, startOfGames = 0;
  for (round = 2; round <= p; round += 1) {
    for (game = 1; game <= Math.pow(2, p - round); game += 1) {
      matchOne = matches[startOfGames + 2 * game - 2];
      matchTwo = matches[startOfGames + 2 * game - 1];
      matches.push({id: gId(p, round, game), round: round, teams: blank(matchOne, matchTwo, WB) });
    }
    startOfGames += Math.pow(2, p - round + 1);
  }

  //only do losers final if there was a game (a game wasn't a bye)
  if (matchOne && matchTwo && !!!matchOne.isBye && !!!matchTwo.isBye) {
    // bronze final if last === WB, else grand final match 2
    //but this should happen either same time or after grand final
    matches.splice(matches.length -1, 0, { id: gId(p, round - 1, 1), round: round - 1, teams: blank(matchOne, matchTwo, LB) });
    //increment count of final, now that we've inserted loser's final before it.
    matches[matches.length - 1].id += 1;
  }

  // Iterate through matches to mark bye matches and remove original isBye property
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (match.isBye) {
      match.isByeMatch = true;
      // Refine teams array for bye matches to only include the advancing team
      // The `woMark` function would have placed a WO ("BYE") placeholder.
      // We need to find the actual seed/team.
      // match.teams is currently like ['Seed 1', WO] or [WO, 'Seed 2']
      const advancingTeam = match.teams.find(function(t) { return t !== WO; });
      if (advancingTeam) {
        match.teams = [advancingTeam];
      }
      // If for some reason no advancing team is found (e.g. [WO, WO]),
      // which shouldn't happen for a bye that implies one team advances,
      // we leave match.teams as is, though this case is unlikely.
    }
    delete match.isBye; // Remove original isBye property
  }

  return matches;
};

module.exports = function(numTeams) {
  var tourney = {type: 'knockout', games: 0, schedule: []}

  if(arguments.length !== 1) {
    throw new Error("You must provide the number of teams to continue.")
  }

  if (numTeams < 2) {
    return tourney;
  }

  var p = Math.ceil(Math.log(numTeams) / Math.log(2));

  var schedule = elimination(numTeams, p);

  tourney.schedule = schedule; // schedule already contains all matches including byes
  tourney.games = schedule.filter(match => !match.isByeMatch).length; // Count only actual games

  return tourney
};
