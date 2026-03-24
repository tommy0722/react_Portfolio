import { useState } from 'react';
import { dealSolvableHand } from './lib/deal';
import './Game24.css';

/** 牌面顯示：11→J、12→Q、13→K，其餘為數字（運算仍用數值）。 */
function rankLabel(n) {
  if (n === 11) return 'J';
  if (n === 12) return 'Q';
  if (n === 13) return 'K';
  return String(n);
}

function rankAriaLabel(n) {
  if (n === 11) return 'J，點數 11';
  if (n === 12) return 'Q，點數 12';
  if (n === 13) return 'K，點數 13';
  return `數字 ${n}`;
}

export default function Game24() {
  const [game, setGame] = useState(() => dealSolvableHand());
  const [revealed, setRevealed] = useState(false);

  const newGame = () => {
    setGame(dealSolvableHand());
    setRevealed(false);
  };

  return (
    <div className="game24-app">
      <header className="game24-banner">
        <h1>24 點</h1>
        <p className="game24-tagline">
          點數 1～13（J、Q、K 為 11、12、13），用加減乘除與括號得到 24
        </p>
      </header>

      <div className="game24-layout">
        <main className="game24-play">
          <div className="game24-cards" aria-label="本局四張牌">
            {game.cards.map((n, i) => (
              <div
                key={`${n}-${i}`}
                className={`game24-card${n >= 11 ? ' game24-card-face' : ''}`}
                role="img"
                aria-label={rankAriaLabel(n)}
              >
                <span className="game24-card-value">{rankLabel(n)}</span>
              </div>
            ))}
          </div>
          <button type="button" className="game24-btn game24-primary" onClick={newGame}>
            新一局
          </button>
        </main>

        <aside className="game24-sidebar" aria-labelledby="answer-heading">
          <h2 id="answer-heading">答案</h2>
          {!revealed ? (
            <button
              type="button"
              className="game24-btn game24-reveal"
              onClick={() => setRevealed(true)}
            >
              點擊顯示答案
            </button>
          ) : (
            <div className="game24-solution-box">
              <code className="game24-solution">{game.solution}</code>
              <p className="game24-hint">上式結果為 24（數字各用一次）</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
