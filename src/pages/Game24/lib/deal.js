import { solve24 } from './solve24';

/** 1～13 無解比例較 1～10 略高，多試幾次避免丟錯。 */
const MAX_TRIES = 15000;

/** 隨機發四張牌，點數 1～13（J=11、Q=12、K=13），保證至少一組解。 */
export function dealSolvableHand() {
  for (let t = 0; t < MAX_TRIES; t++) {
    const cards = Array.from(
      { length: 4 },
      () => 1 + Math.floor(Math.random() * 13),
    );
    const sols = solve24(cards);
    if (sols.length > 0) {
      return { cards, solution: sols[0] };
    }
  }
  throw new Error('無法發出有解的牌，請重試');
}
