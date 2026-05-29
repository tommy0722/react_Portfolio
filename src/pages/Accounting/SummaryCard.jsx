import React from 'react';

function SummaryCard({ summary, loading }) {
    if (loading) return <div className="text-center py-3">載入中...</div>;
    if (!summary) return null;

    const { income = 0, expense = 0, balance = 0, accounts = [] } = summary;

    return (
        <>
            <div className="row g-3 mb-3">
                <div className="col-4">
                    <div className="card text-center border-success text-dark">
                        <div className="card-body py-2">
                            <div className="text-success fw-bold">本月收入</div>
                            <div className="fs-5 fw-bold">$ {Number(income).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card text-center border-danger text-dark">
                        <div className="card-body py-2">
                            <div className="text-danger fw-bold">本月支出</div>
                            <div className="fs-5 fw-bold">$ {Number(expense).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className={`card text-center text-dark ${balance >= 0 ? 'border-primary' : 'border-warning'}`}>
                        <div className="card-body py-2">
                            <div className={`fw-bold ${balance >= 0 ? 'text-primary' : 'text-warning'}`}>本月結餘</div>
                            <div className="fs-5 fw-bold">$ {Number(balance).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {accounts.length > 0 && (
                <div className="row g-2 mb-4">
                    {accounts.map(acc => (
                        <div className="col-auto" key={acc.id}>
                            <div className="card border-secondary text-dark">
                                <div className="card-body py-1 px-3">
                                    <div className="small text-muted">{acc.name}</div>
                                    <div className={`fw-bold ${acc.balance >= 0 ? 'text-dark' : 'text-danger'}`}>
                                        $ {Number(acc.balance).toLocaleString()}
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
