import React from 'react';

function SummaryCard({ summary, loading }) {
    if (loading) return <div className="text-center py-3">載入中...</div>;
    if (!summary) return null;

    const { income = 0, expense = 0, balance = 0, accounts = [], total_budget = 0, free_to_spend = income } = summary;
    const hasBudget = total_budget > 0;

    const glassCard = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' };
    const colClass = hasBudget ? 'col-12 col-sm-6 col-lg-3' : 'col-12 col-sm-4';

    return (
        <>
            <div className="row g-3 mb-3">
                <div className={colClass}>
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: '#4ade80' }}>本月收入</div>
                            <div className="fs-5 fw-bold">NT$ {Number(income).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className={colClass}>
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: '#f87171' }}>本月支出</div>
                            <div className="fs-5 fw-bold">NT$ {Number(expense).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className={colClass}>
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: balance >= 0 ? '#818cf8' : '#fbbf24' }}>本月結餘</div>
                            <div className="fs-5 fw-bold">NT$ {Number(balance).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                {hasBudget && (
                    <div className={colClass}>
                        <div className="card text-center" style={glassCard} title="本月收入扣除各分類已設定的預算上限">
                            <div className="card-body py-2">
                                <div className="fw-bold" style={{ color: free_to_spend >= 0 ? '#38bdf8' : '#fbbf24' }}>可自由花用</div>
                                <div className="fs-5 fw-bold">NT$ {Number(free_to_spend).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {accounts.length > 0 && (
                <div className="row g-2 mb-4">
                    {accounts.map(acc => {
                        const isCredit = acc.account_type === 'credit_card';
                        const label = isCredit && acc.balance < 0 ? '欠款' : isCredit ? '溢繳' : acc.name;
                        return (
                            <div className="col-auto" key={acc.id}>
                                <div className="card" style={glassCard}>
                                    <div className="card-body py-1 px-3">
                                        <div className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {acc.name}{isCredit && ` · ${label}`}
                                        </div>
                                        <div className="fw-bold" style={{ color: isCredit ? '#fbbf24' : (acc.balance >= 0 ? '#fff' : '#f87171') }}>
                                            NT$ {Number(Math.abs(acc.balance)).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default SummaryCard;
