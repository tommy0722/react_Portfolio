import { describe, it, expect } from 'vitest';
import { solve24, Frac } from './solve24';

function evalExpr(expr) {
    // eslint-disable-next-line no-eval
    return eval(expr.replace(/\s+/g, ''));
}

describe('solve24', () => {
    it('finds a solution for a known solvable hand', () => {
        const solutions = solve24([4, 6, 1, 8]);
        expect(solutions.length).toBeGreaterThan(0);
    });

    it('every returned expression uses each card exactly once and evaluates to 24', () => {
        const cards = [3, 3, 8, 8];
        const solutions = solve24(cards);
        expect(solutions.length).toBeGreaterThan(0);
        for (const expr of solutions) {
            const usedNumbers = expr.match(/\d+/g).map(Number).sort();
            expect(usedNumbers).toEqual([...cards].sort());
            expect(evalExpr(expr)).toBeCloseTo(24);
        }
    });

    it('returns an empty array when no combination makes 24', () => {
        const solutions = solve24([1, 1, 1, 1]);
        expect(solutions).toEqual([]);
    });

    it('does not throw on division by zero candidates', () => {
        expect(() => solve24([0, 0, 0, 0])).not.toThrow();
    });
});

describe('Frac', () => {
    it('reduces fractions to lowest terms with a positive denominator', () => {
        const f = new Frac(-4n, -8n);
        expect(f.n).toBe(1n);
        expect(f.d).toBe(2n);
    });

    it('division by zero returns null instead of throwing', () => {
        const a = Frac.fromInt(5);
        const zero = Frac.fromInt(0);
        expect(a.div(zero)).toBeNull();
    });

    it('equals24 is true only for 24/1', () => {
        expect(Frac.fromInt(24).equals24()).toBe(true);
        expect(new Frac(48n, 2n).equals24()).toBe(true);
        expect(Frac.fromInt(23).equals24()).toBe(false);
    });
});
