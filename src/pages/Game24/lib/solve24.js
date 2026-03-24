/** 有理數（化簡、分母為正），供 24 點精確比較。 */

function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === 0n ? 1n : x;
}

export class Frac {
  constructor(n, d = 1n) {
    if (d === 0n) {
      throw new Error('分母不可為 0');
    }
    let num = n;
    let den = d;
    if (den < 0n) {
      num = -num;
      den = -den;
    }
    const g = gcd(num, den);
    num /= g;
    den /= g;
    this.n = num;
    this.d = den;
  }

  static fromInt(x) {
    return new Frac(BigInt(x));
  }

  add(o) {
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(o) {
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(o) {
    return new Frac(this.n * o.n, this.d * o.d);
  }

  div(o) {
    if (o.n === 0n) return null;
    return new Frac(this.n * o.d, this.d * o.n);
  }

  equals24() {
    return this.n === 24n * this.d;
  }
}

function solveNodes(nodes) {
  if (nodes.length === 1) {
    return nodes[0].value.equals24() ? [nodes[0].expr] : [];
  }
  const out = [];
  const seen = new Set();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const others = nodes.filter((_, k) => k !== i && k !== j);
      const A = nodes[i];
      const B = nodes[j];

      const tryCombine = (value, expr) => {
        const sub = solveNodes([...others, { value, expr }]);
        for (const s of sub) {
          if (!seen.has(s)) {
            seen.add(s);
            out.push(s);
          }
        }
      };

      tryCombine(A.value.add(B.value), `(${A.expr} + ${B.expr})`);
      tryCombine(A.value.sub(B.value), `(${A.expr} - ${B.expr})`);
      tryCombine(B.value.sub(A.value), `(${B.expr} - ${A.expr})`);
      tryCombine(A.value.mul(B.value), `(${A.expr} * ${B.expr})`);

      const d1 = A.value.div(B.value);
      if (d1) tryCombine(d1, `(${A.expr} / ${B.expr})`);
      const d2 = B.value.div(A.value);
      if (d2) tryCombine(d2, `(${B.expr} / ${A.expr})`);
    }
  }
  return out;
}

/** 回傳所有相異的合法算式字串（每張牌恰用一次）。 */
export function solve24(cards) {
  const nodes = cards.map((n) => ({
    value: Frac.fromInt(n),
    expr: String(n),
  }));
  return solveNodes(nodes);
}
