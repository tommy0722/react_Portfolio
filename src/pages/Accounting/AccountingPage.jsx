import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Badge, Form } from 'react-bootstrap';
import SummaryCard from './SummaryCard';
import TransactionForm from './TransactionForm';
import TransferForm from './TransferForm';
import CategoryManager from './CategoryManager';
import AccountManager from './AccountManager';
import StatsPage from './StatsPage';
import { transactionAPI, categoryAPI, accountAPI, transferAPI } from '../../services/accountingService';

function AccountingPage() {
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [activePage, setActivePage] = useState('transactions');
    const [filterAccount, setFilterAccount] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loadingTx, setLoadingTx] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [sortKey, setSortKey] = useState('date');
    const [sortDir, setSortDir] = useState('desc');

    const fetchAccounts = useCallback(async () => {
        try {
            const res = await accountAPI.list();
            setAccounts(res.data);
        } catch {
            setAccounts([]);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await categoryAPI.list();
            setCategories(res.data);
        } catch {
            setCategories([]);
        }
    }, []);

    const fetchTransactions = useCallback(async () => {
        setLoadingTx(true);
        try {
            const params = { month };
            if (filterAccount) params.account = filterAccount;
            if (filterCategory) params.category = filterCategory;
            const res = await transactionAPI.list(params);
            setTransactions(res.data);
        } catch {
            setTransactions([]);
        } finally {
            setLoadingTx(false);
        }
    }, [month, filterAccount, filterCategory]);

    const fetchSummary = useCallback(async () => {
        setLoadingSummary(true);
        try {
            const res = await transactionAPI.summary({ month });
            setSummary(res.data);
        } catch {
            setSummary(null);
        } finally {
            setLoadingSummary(false);
        }
    }, [month]);

    const sortedTransactions = useMemo(() => {
        const getValue = (tx) => {
            if (sortKey === 'date') return tx.date;
            if (sortKey === 'type') return tx.type;
            if (sortKey === 'account') return tx.account?.name ?? '';
            if (sortKey === 'category') return tx.category?.name ?? '';
            if (sortKey === 'amount') return Number(tx.amount);
            return tx.date;
        };
        return [...transactions].sort((a, b) => {
            const va = getValue(a);
            const vb = getValue(b);
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [transactions, sortKey, sortDir]);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const handleMonthChange = useCallback((e) => {
        setMonth(e.target.value);
        setFilterAccount('');
        setFilterCategory('');
    }, []);

    useEffect(() => {
        fetchAccounts();
        fetchCategories();
    }, [fetchAccounts, fetchCategories]);

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, [fetchTransactions, fetchSummary]);

    const handleFormSubmit = async (data) => {
        try {
            if (editTarget) {
                await transactionAPI.update(editTarget.id, data);
            } else {
                await transactionAPI.create(data);
            }
            setShowForm(false);
            setEditTarget(null);
            fetchTransactions();
            fetchSummary();
        } catch {
            alert('儲存失敗');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此筆紀錄？')) return;
        try {
            await transactionAPI.remove(id);
            fetchTransactions();
            fetchSummary();
        } catch {
            alert('刪除失敗');
        }
    };

    const handleEdit = (tx) => {
        setEditTarget(tx);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditTarget(null);
        setShowForm(true);
    };

    const handleTransferSubmit = async (data) => {
        try {
            await transferAPI.create(data);
            setShowTransferForm(false);
            fetchSummary();
        } catch (err) {
            const msg = err?.response?.data
                ? Object.values(err.response.data).flat().join(' ')
                : '轉帳失敗，請重試';
            alert(msg);
        }
    };

    return (
        <div style={{ width: '95%', maxWidth: 960, margin: '0 auto', padding: '12px 8px' }}>
            <h1 className="h4 fw-bold mb-4 text-center">記帳系統</h1>

            <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
                <button className={`btn flex-fill ${activePage === 'transactions' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActivePage('transactions')} style={{ minWidth: 120 }}>
                    收支紀錄
                </button>
                <button className={`btn flex-fill ${activePage === 'accounts' ? 'btn-info' : 'btn-outline-info'}`} onClick={() => setActivePage('accounts')} style={{ minWidth: 120 }}>
                    帳戶管理
                </button>
                <button className={`btn flex-fill ${activePage === 'categories' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setActivePage('categories')} style={{ minWidth: 120 }}>
                    分類管理
                </button>
                <button className={`btn flex-fill ${activePage === 'stats' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setActivePage('stats')} style={{ minWidth: 120 }}>
                    統計圖表
                </button>
            </div>

            <div className="border rounded p-3 p-md-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.15)' }}>
                {activePage === 'transactions' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <label className="fw-bold mb-0">月份：</label>
                                <input
                                    type="month" className="form-control" style={{ width: 150, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                                    value={month} onChange={handleMonthChange}
                                />
                                <Form.Select
                                    value={filterAccount}
                                    onChange={e => setFilterAccount(e.target.value)}
                                    style={{ minWidth: 120, maxWidth: 180, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                                >
                                    <option value="">全部帳戶</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </Form.Select>
                                <Form.Select
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                    style={{ minWidth: 120, maxWidth: 180, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                                >
                                    <option value="">全部分類</option>
                                    <optgroup label="── 支出 ──">
                                        {categories.filter(c => c.type === 'expense').map(c => (
                                            <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} / ${c.name}` : c.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="── 收入 ──">
                                        {categories.filter(c => c.type === 'income').map(c => (
                                            <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} / ${c.name}` : c.name}</option>
                                        ))}
                                    </optgroup>
                                </Form.Select>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="primary" onClick={handleAdd}>+ 新增紀錄</Button>
                                <Button variant="outline-warning" onClick={() => setShowTransferForm(true)}>⇄ 轉帳</Button>
                            </div>
                        </div>

                        <SummaryCard summary={summary} loading={loadingSummary} />

                        {loadingTx ? (
                            <div className="text-center py-4">載入中...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center text-muted py-4">本月尚無紀錄</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-sm accounting-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <colgroup>
                                        <col style={{ width: 90 }} />
                                        <col style={{ width: 70 }} />
                                        <col style={{ width: 100 }} />
                                        <col style={{ width: 100 }} />
                                        <col style={{ width: 110 }} />
                                        <col />
                                        <col style={{ width: 110 }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            {[
                                                { key: 'date', label: '日期' },
                                                { key: 'type', label: '類型' },
                                                { key: 'account', label: '帳戶' },
                                                { key: 'category', label: '分類' },
                                                { key: 'amount', label: '金額' },
                                            ].map(col => (
                                                <th
                                                    key={col.key}
                                                    onClick={() => handleSort(col.key)}
                                                    style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                                                >
                                                    {col.label}{' '}
                                                    <span style={{ opacity: sortKey === col.key ? 1 : 0.3, fontSize: '0.75em' }}>
                                                        {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
                                                    </span>
                                                </th>
                                            ))}
                                            <th>備註</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedTransactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td>{tx.date}</td>
                                                <td>
                                                    <Badge bg={tx.type === 'income' ? 'success' : 'danger'}>
                                                        {tx.type === 'income' ? '收入' : '支出'}
                                                    </Badge>
                                                </td>
                                                <td>{tx.account?.name ?? '—'}</td>
                                                <td>{tx.category?.name ?? '—'}</td>
                                                <td>$ {Number(tx.amount).toLocaleString()}</td>
                                                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 0 }} title={tx.description || ''}>{tx.description || '—'}</td>
                                                <td>
                                                    <Button size="sm" variant="outline-light" className="me-1" onClick={() => handleEdit(tx)}>編輯</Button>
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(tx.id)}>刪除</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {activePage === 'accounts' && (
                    <AccountManager accounts={accounts} onRefresh={fetchAccounts} />
                )}

                {activePage === 'categories' && (
                    <CategoryManager categories={categories} onRefresh={fetchCategories} />
                )}

                {activePage === 'stats' && (
                    <StatsPage summary={summary} month={month} />
                )}
            </div>

            <TransactionForm
                show={showForm}
                onHide={() => { setShowForm(false); setEditTarget(null); }}
                onSubmit={handleFormSubmit}
                accounts={accounts}
                categories={categories}
                initial={editTarget}
            />

            <TransferForm
                show={showTransferForm}
                onHide={() => setShowTransferForm(false)}
                onSubmit={handleTransferSubmit}
                accounts={accounts}
            />
        </div>
    );
}

export default AccountingPage;
