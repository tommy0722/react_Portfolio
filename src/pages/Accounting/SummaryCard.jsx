import React from 'react';

function SummaryCard({ summary, loading }) {
    if (loading) return <div className="text-center py-3">載入中...</div>;
    if (!summary) return null;

    const { income = 0, expense = 0, balance = 0, accounts = [] } = summary;

    const glassCard = { background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' };

    return (
        <>
            <div className="row g-3 mb-3">
                <div className="col-12 col-sm-4">
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: '#4ade80' }}>本月收入</div>
                            <div className="fs-5 fw-bold">NT$ {Number(income).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: '#f87171' }}>本月支出</div>
                            <div className="fs-5 fw-bold">NT$ {Number(expense).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="card text-center" style={glassCard}>
                        <div className="card-body py-2">
                            <div className="fw-bold" style={{ color: balance >= 0 ? '#818cf8' : '#fbbf24' }}>本月結餘</div>
                            <div className="fs-5 fw-bold">NT$ {Number(balance).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {accounts.length > 0 && (
                <div className="row g-2 mb-4">
                    {accounts.map(acc => (
                        <div className="col-auto" key={acc.id}>
                            <div className="card" style={glassCard}>
                                <div className="card-body py-1 px-3">
                                    <div className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>{acc.name}</div>
                                    <div className="fw-bold" style={{ color: acc.balance >= 0 ? '#fff' : '#f87171' }}>
                                        NT$ {Number(acc.balance).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default SummaryCard;
