import React, { useState, useEffect, useCallback } from 'react';
import { Button, Badge, Table, Form } from 'react-bootstrap';
import SummaryCard from './SummaryCard';
import TransactionForm from './TransactionForm';
import CategoryManager from './CategoryManager';
import AccountManager from './AccountManager';
import StatsPage from './StatsPage';
import { transactionAPI, categoryAPI, accountAPI } from '../../services/accountingService';

function AccountingPage() {
    const today = new Date();
    const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
    const [activePage, setActivePage] = useState('transactions');
    const [filterAccount, setFilterAccount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loadingTx, setLoadingTx] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

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
            const res = await transactionAPI.list(params);
            setTransactions(res.data);
        } catch {
            setTransactions([]);
        } finally {
            setLoadingTx(false);
        }
    }, [month, filterAccount]);

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

    return (
        <div style={{ width: '90%', maxWidth: 960, margin: '0 auto', padding: '20px' }}>
            <h1 className="h4 fw-bold mb-4 text-center">記帳系統</h1>

            <div className="mb-4 d-flex justify-content-around">
                <button className={`btn ${activePage === 'transactions' ? 'btn-primary' : 'btn-outline-primary text-dark'}`} onClick={() => setActivePage('transactions')} style={{ minWidth: 140 }}>
                    收支紀錄
                </button>
                <button className={`btn ${activePage === 'accounts' ? 'btn-info' : 'btn-outline-info text-dark'}`} onClick={() => setActivePage('accounts')} style={{ minWidth: 140 }}>
                    帳戶管理
                </button>
                <button className={`btn ${activePage === 'categories' ? 'btn-success' : 'btn-outline-success text-dark'}`} onClick={() => setActivePage('categories')} style={{ minWidth: 140 }}>
                    分類管理
                </button>
                <button className={`btn ${activePage === 'stats' ? 'btn-secondary' : 'btn-outline-secondary text-dark'}`} onClick={() => setActivePage('stats')} style={{ minWidth: 140 }}>
                    統計圖表
                </button>
            </div>

            <div className="border rounded p-4 shadow-sm bg-light text-dark">
                {activePage === 'transactions' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-bold mb-0">月份：</label>
                                <input
                                    type="month" className="form-control" style={{ width: 160 }}
                                    value={month} onChange={e => setMonth(e.target.value)}
                                />
                                <Form.Select
                                    value={filterAccount}
                                    onChange={e => setFilterAccount(e.target.value)}
                                    style={{ width: 150 }}
                                >
                                    <option value="">全部帳戶</option>
                                    {accounts.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </Form.Select>
                            </div>
                            <Button variant="primary" onClick={handleAdd}>+ 新增紀錄</Button>
                        </div>

                        <SummaryCard summary={summary} loading={loadingSummary} />

                        {loadingTx ? (
                            <div className="text-center py-4">載入中...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center text-muted py-4">本月尚無紀錄</div>
                        ) : (
                            <Table striped bordered hover responsive size="sm" className="text-dark">
                                <thead>
                                    <tr>
                                        <th>日期</th>
                                        <th>類型</th>
                                        <th>帳戶</th>
                                        <th>分類</th>
                                        <th className="text-end">金額</th>
                                        <th>備註</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td>{tx.date}</td>
                                            <td>
                                                <Badge bg={tx.type === 'income' ? 'success' : 'danger'}>
                                                    {tx.type === 'income' ? '收入' : '支出'}
                                                </Badge>
                                            </td>
                                            <td>{tx.account?.name ?? '—'}</td>
                                            <td>{tx.category?.name ?? '—'}</td>
                                            <td className="text-end">$ {Number(tx.amount).toLocaleString()}</td>
                                            <td>{tx.description || '—'}</td>
                                            <td>
                                                <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => handleEdit(tx)}>編輯</Button>
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(tx.id)}>刪除</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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
        </div>
    );
}

export default AccountingPage;
