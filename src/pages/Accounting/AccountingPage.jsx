import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Badge, Form, Alert } from 'react-bootstrap';
import SummaryCard from './SummaryCard';
import TransactionForm from './TransactionForm';
import TransferForm from './TransferForm';
import CategoryManager from './CategoryManager';
import AccountManager from './AccountManager';
import RecurringManager from './RecurringManager';
import StatsPage from './StatsPage';
import { transactionAPI, categoryAPI, accountAPI, transferAPI, recurringAPI } from '../../services/accountingService';

const NAV_ITEMS = [
    { key: 'transactions', label: '收支紀錄', variant: 'primary' },
    { key: 'recurring', label: '定期交易', variant: 'warning' },
    { key: 'accounts', label: '帳戶管理', variant: 'info' },
    { key: 'categories', label: '分類管理', variant: 'success' },
    { key: 'stats', label: '統計圖表', variant: 'secondary' },
];

function toCsvField(value) {
    const str = String(value ?? '');
    return `"${str.replace(/"/g, '""')}"`;
}

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
    const [recurring, setRecurring] = useState([]);
    const [dueRecurring, setDueRecurring] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loadingTx, setLoadingTx] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [sortKey, setSortKey] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkCategoryId, setBulkCategoryId] = useState('');

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

    const fetchRecurring = useCallback(async () => {
        try {
            const res = await recurringAPI.list();
            setRecurring(res.data);
        } catch {
            setRecurring([]);
        }
    }, []);

    const fetchDue = useCallback(async () => {
        try {
            const res = await recurringAPI.due();
            setDueRecurring(res.data);
        } catch {
            setDueRecurring([]);
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
            setSelectedIds([]);
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
        fetchRecurring();
        fetchDue();
    }, [fetchAccounts, fetchCategories, fetchRecurring, fetchDue]);

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
            fetchCategories();
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

    const handleAdd = useCallback(() => {
        setEditTarget(null);
        setShowForm(true);
    }, []);

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

    const handleCategoryClick = useCallback((categoryId) => {
        setFilterCategory(String(categoryId));
        setActivePage('transactions');
    }, []);

    const handleConfirmDue = async (id) => {
        try {
            await recurringAPI.confirm(id);
            fetchDue();
            fetchRecurring();
            fetchTransactions();
            fetchSummary();
        } catch {
            alert('確認失敗');
        }
    };

    const handleSkipDue = async (id) => {
        try {
            await recurringAPI.skip(id);
            fetchDue();
            fetchRecurring();
        } catch {
            alert('略過失敗');
        }
    };

    // ---- 批量操作 ----
    const allVisibleSelected = sortedTransactions.length > 0 && selectedIds.length === sortedTransactions.length;
    const toggleSelectAll = () => {
        setSelectedIds(allVisibleSelected ? [] : sortedTransactions.map(tx => tx.id));
    };
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`確定刪除選取的 ${selectedIds.length} 筆紀錄？`)) return;
        try {
            await Promise.all(selectedIds.map(id => transactionAPI.remove(id)));
            setSelectedIds([]);
            fetchTransactions();
            fetchSummary();
        } catch {
            alert('批量刪除失敗');
        }
    };

    const handleBulkCategoryChange = async () => {
        if (!bulkCategoryId) return;
        const targets = transactions.filter(tx => selectedIds.includes(tx.id));
        try {
            await Promise.all(targets.map(tx => transactionAPI.update(tx.id, {
                amount: tx.amount,
                type: tx.type,
                date: tx.date,
                description: tx.description,
                account_id: tx.account?.id ?? null,
                category_id: Number(bulkCategoryId),
            })));
            setSelectedIds([]);
            setBulkCategoryId('');
            fetchTransactions();
            fetchCategories();
        } catch {
            alert('批量改分類失敗');
        }
    };

    const handleExportCsv = () => {
        const header = ['日期', '類型', '帳戶', '分類', '金額', '備註'];
        const rows = sortedTransactions.map(tx => [
            tx.date,
            tx.type === 'income' ? '收入' : '支出',
            tx.account?.name ?? '',
            tx.category?.name ?? '',
            tx.amount,
            tx.description ?? '',
        ]);
        const csv = [header, ...rows].map(r => r.map(toCsvField).join(',')).join('\r\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `記帳_${month}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ---- 鍵盤快捷鍵：N 新增紀錄（Esc 由 Modal 本身處理） ----
    const handleAddRef = useRef(handleAdd);
    handleAddRef.current = handleAdd;
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== 'n' && e.key !== 'N') return;
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (activePage !== 'transactions') return;
            e.preventDefault();
            handleAddRef.current();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [activePage]);

    return (
        <div style={{ width: '96%', maxWidth: 1240, margin: '0 auto', padding: '12px 8px' }}>
            <h1 className="h4 fw-bold mb-3 text-center">記帳系統</h1>

            {dueRecurring.length > 0 && (
                <Alert variant="warning" className="mb-3">
                    <div className="fw-bold mb-2">⏰ 有 {dueRecurring.length} 筆定期交易待確認</div>
                    <div className="d-flex flex-column gap-2">
                        {dueRecurring.map(r => (
                            <div key={r.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <span>
                                    {r.description || (r.type === 'income' ? '收入' : '支出')} ・ NT$ {Number(r.amount).toLocaleString()} ・ 到期日 {r.next_due_date}
                                </span>
                                <div className="d-flex gap-2">
                                    <Button size="sm" variant="success" onClick={() => handleConfirmDue(r.id)}>確認記帳</Button>
                                    <Button size="sm" variant="outline-secondary" onClick={() => handleSkipDue(r.id)}>略過</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Alert>
            )}

            <div className="row g-3">
                {/* 左側：導覽 + 篩選 */}
                <div className="col-12 col-lg-3">
                    <div className="d-flex flex-column gap-2 mb-3">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.key}
                                className={`btn text-start ${activePage === item.key ? `btn-${item.variant}` : `btn-outline-${item.variant}`}`}
                                onClick={() => setActivePage(item.key)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {activePage === 'transactions' && (
                        <div className="border rounded p-3" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)' }}>
                            <Form.Label className="small fw-bold mb-1">月份</Form.Label>
                            <input
                                type="month" className="form-control mb-2"
                                style={{ background: 'var(--gb-darkgreen)', border: '1px solid var(--gb-bright)', color: 'var(--gb-bright)', colorScheme: 'dark' }}
                                value={month} onChange={handleMonthChange}
                            />
                            <Form.Label className="small fw-bold mb-1">帳戶</Form.Label>
                            <Form.Select
                                className="mb-2"
                                value={filterAccount}
                                onChange={e => setFilterAccount(e.target.value)}
                                style={{ background: 'var(--gb-darkgreen)', border: '1px solid var(--gb-bright)', color: 'var(--gb-bright)', colorScheme: 'dark' }}
                            >
                                <option value="">全部帳戶</option>
                                {accounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Label className="small fw-bold mb-1">分類</Form.Label>
                            <Form.Select
                                className="mb-3"
                                value={filterCategory}
                                onChange={e => setFilterCategory(e.target.value)}
                                style={{ background: 'var(--gb-darkgreen)', border: '1px solid var(--gb-bright)', color: 'var(--gb-bright)', colorScheme: 'dark' }}
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
                            <div className="d-flex flex-column gap-2">
                                <Button variant="primary" onClick={handleAdd}>+ 新增紀錄（N）</Button>
                                <Button variant="outline-warning" onClick={() => setShowTransferForm(true)}>⇄ 轉帳</Button>
                                <Button variant="outline-light" onClick={handleExportCsv} disabled={sortedTransactions.length === 0}>⬇ 匯出 CSV</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 右側：內容 */}
                <div className="col-12 col-lg-9">
                    <div className="border rounded p-3 p-md-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.15)' }}>
                        {activePage === 'transactions' && (
                            <>
                                <SummaryCard summary={summary} loading={loadingSummary} />

                                {selectedIds.length > 0 && (
                                    <div className="d-flex align-items-center flex-wrap gap-2 mb-3 p-2 rounded" style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.4)' }}>
                                        <span className="fw-semibold">已選取 {selectedIds.length} 筆</span>
                                        <Form.Select
                                            size="sm"
                                            style={{ maxWidth: 200 }}
                                            value={bulkCategoryId}
                                            onChange={e => setBulkCategoryId(e.target.value)}
                                        >
                                            <option value="">改分類為...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} / ${c.name}` : c.name}</option>
                                            ))}
                                        </Form.Select>
                                        <Button size="sm" variant="outline-light" disabled={!bulkCategoryId} onClick={handleBulkCategoryChange}>套用</Button>
                                        <Button size="sm" variant="outline-danger" onClick={handleBulkDelete}>刪除所選</Button>
                                        <Button size="sm" variant="link" className="text-light" onClick={() => setSelectedIds([])}>取消選取</Button>
                                    </div>
                                )}

                                {loadingTx ? (
                                    <div className="text-center py-4">載入中...</div>
                                ) : transactions.length === 0 ? (
                                    <div className="text-center text-muted py-4">本月尚無紀錄</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm accounting-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                            <colgroup>
                                                <col style={{ width: 36 }} />
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
                                                    <th>
                                                        <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} />
                                                    </th>
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
                                                        <td>
                                                            <input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => toggleSelect(tx.id)} />
                                                        </td>
                                                        <td>{tx.date}</td>
                                                        <td>
                                                            <Badge bg={tx.type === 'income' ? 'success' : 'danger'}>
                                                                {tx.type === 'income' ? '收入' : '支出'}
                                                            </Badge>
                                                        </td>
                                                        <td>{tx.account?.name ?? '—'}</td>
                                                        <td>{tx.category?.name ?? '—'}</td>
                                                        <td>NT$ {Number(tx.amount).toLocaleString()}</td>
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

                        {activePage === 'recurring' && (
                            <RecurringManager
                                recurring={recurring}
                                accounts={accounts}
                                categories={categories}
                                onRefresh={() => { fetchRecurring(); fetchDue(); }}
                            />
                        )}

                        {activePage === 'accounts' && (
                            <AccountManager accounts={accounts} onRefresh={fetchAccounts} />
                        )}

                        {activePage === 'categories' && (
                            <CategoryManager categories={categories} onRefresh={fetchCategories} />
                        )}

                        {activePage === 'stats' && (
                            <StatsPage
                                summary={summary}
                                month={month}
                                onCategoryClick={handleCategoryClick}
                            />
                        )}
                    </div>
                </div>
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
