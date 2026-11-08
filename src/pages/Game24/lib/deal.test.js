import { describe, it, expect } from 'vitest';
import { dealSolvableHand } from './deal';
import { solve24 } from './solve24';

describe('dealSolvableHand', () => {
    it('always deals 4 cards within 1-13 that have at least one solution', () => {
        for (let i = 0; i < 20; i++) {
            const { cards, solution } = dealSolvableHand();
            expect(cards).toHaveLength(4);
            for (const c of cards) {
                expect(c).toBeGreaterThanOrEqual(1);
                expect(c).toBeLessThanOrEqual(13);
            }
            expect(typeof solution).toBe('string');
            expect(solve24(cards).length).toBeGreaterThan(0);
        }
    });
});
