import { ITournamentBracketItem } from './i-tournament-bracket-item';

export const TOURNAMENT_BRACKET_STORE: ITournamentBracketItem[] = [
  { id: '1', color: 'blue', competitionPhase: 'UB Quarterfinal', date: new Date(), competitors: [{ title: 'Xtreme gaming', score: 0 }, { title: 'Team liquid', score: 2 }], nextMatchId: '5' },
  { id: '2', color: 'blue', competitionPhase: 'UB Quarterfinal', date: new Date(), competitors: [{ title: 'Cloud9', score: 2 }, { title: 'Aurora gaming', score: 0 }], nextMatchId: '5' },
  { id: '3', color: 'blue', competitionPhase: 'UB Quarterfinal', date: new Date(), competitors: [{ title: 'Team Falcons', score: 0 }, { title: 'Tundra Esport', score: 2 }], nextMatchId: '6' },
  { id: '4', color: 'blue', competitionPhase: 'UB Quarterfinal', date: new Date(), competitors: [{ title: 'Nouns', score: 1 }, { title: 'Gaimin Gladiators', score: 2 }], nextMatchId: '6' },

  { id: '5', color: 'yellow', competitionPhase: 'UB Semifinal', date: new Date(), competitors: [{ title: 'Team liquid', score: 2 }, { title: 'Cloud9', score: 0 }], nextMatchId: '7' },
  { id: '6', color: 'yellow', competitionPhase: 'UB Semifinal', date: new Date(), competitors: [{ title: 'Tundra Esport', score: 0 }, { title: 'Gaimin Gladiators', score: 2 }], nextMatchId: '7' },

  { id: '7', color: 'purple', competitionPhase: 'UB Final', date: new Date(), competitors: [{ title: 'Team liquid', score: 2 }, { title: 'Gaimin Gladiators', score: 0 }], nextMatchId: 'grand-final' },


  { id: '8', color: 'red', competitionPhase: 'LB Round 1', date: new Date(), competitors: [{ title: 'Talon', score: 1 }, { title: 'Betboom Team', score: 2 }], nextMatchId: '12' },
  { id: '9', color: 'red', competitionPhase: 'LB Round 1', date: new Date(), competitors: [{ title: '1w Team', score: 2 }, { title: 'Team Zero', score: 0 }], nextMatchId: '13' },
  { id: '10', color: 'red', competitionPhase: 'LB Round 1', date: new Date(), competitors: [{ title: 'Beastcoast', score: 1 }, { title: 'Heroic', score: 2 }], nextMatchId: '14' },
  { id: '11', color: 'red', competitionPhase: 'LB Round 1', date: new Date(), competitors: [{ title: 'Team spirit', score: 2 }, { title: 'Invictus gaming', score: 0 }], nextMatchId: '15' },

  { id: '12', color: 'blue', competitionPhase: 'LB Round 2', date: new Date(), competitors: [{ title: 'Nouns', score: 0 }, { title: 'Betboom Team', score: 2 }], nextMatchId: '16' },
  { id: '13', color: 'blue', competitionPhase: 'LB Round 2', date: new Date(), competitors: [{ title: 'Team Falcons', score: 2 }, { title: '1w Team', score: 0 }], nextMatchId: '16' },
  { id: '14', color: 'blue', competitionPhase: 'LB Round 2', date: new Date(), competitors: [{ title: 'Aurora gaming', score: 2 }, { title: 'Heroic', score: 1 }], nextMatchId: '17' },
  { id: '15', color: 'blue', competitionPhase: 'LB Round 2', date: new Date(), competitors: [{ title: 'Xtreme gaming', score: 2 }, { title: 'Team spirit', score: 1 }], nextMatchId: '17' },

  { id: '16', color: 'yellow', competitionPhase: 'LB Round 3', date: new Date(), competitors: [{ title: 'Betboom Team', score: 0 }, { title: 'Team Falcons', score: 2 }], nextMatchId: '18' },
  { id: '17', color: 'yellow', competitionPhase: 'LB Round 3', date: new Date(), competitors: [{ title: 'Aurora gaming', score: 0 }, { title: 'Xtreme gaming', score: 2 }], nextMatchId: '19' },

  { id: '18', color: 'yellow', competitionPhase: 'LB Round 4', date: new Date(), competitors: [{ title: 'Cloud9', score: 0 }, { title: 'Team Falcons', score: 2 }], nextMatchId: '20' },
  { id: '19', color: 'yellow', competitionPhase: 'LB Round 4', date: new Date(), competitors: [{ title: 'Tundra Esport', score: 2 }, { title: 'Xtreme gaming', score: 0 }], nextMatchId: '20' },

  { id: '20', color: 'purple', competitionPhase: 'LB Round 5', date: new Date(), competitors: [{ title: 'Team Falcons', score: 0 }, { title: 'Tundra Esport', score: 2 }], nextMatchId: '21' },

  { id: '21', color: 'purple', competitionPhase: 'LB Final', date: new Date(), competitors: [{ title: 'Gaimin Gladiators', score: 2 }, { title: 'Tundra Esport', score: 1 }], nextMatchId: 'grand-final' },

  { id: 'grand-final', color: 'green', competitionPhase: 'Grand Final', date: new Date(), competitors: [{ title: 'Team liquid', score: 3 }, { title: 'Gaimin Gladiators', score: 0 }], nextMatchId: '' },
];
