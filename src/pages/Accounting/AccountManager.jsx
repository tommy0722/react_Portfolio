import React, { useState } from 'react';
import { Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { accountAPI } from '../../services/accountingService';

const TYPE_LABEL = { cash: '現金', bank: '銀行', credit_card: '信用卡' };

function EditRow({ account, onDone }) {
    const [name, setName] = useState(account.name);
    const [initialBalance, setInitialBalance] = useState(String(account.initial_balance));
    const [accountType, setAccountType] = useState(account.account_type);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setSaving(true);
        try {
            await accountAPI.update(account.id, {
                name: name.trim(),
                initial_balance: initialBalance,
                account_type: accountType,
            });
            onDone(true);
        } catch {
            alert('更新失敗');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ListGroup.Item className="d-flex align-items-center gap-2 flex-wrap" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
            <Form.Control value={name} onChange={e => setName(e.target.value)} maxLength={50} style={{ minWidth: 140, maxWidth: 200 }} />
            <Form.Control type="number" step="1" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} style={{ minWidth: 100, maxWidth: 140 }} />
            <Form.Select value={accountType} onChange={e => setAccountType(e.target.value)} style={{ minWidth: 100, maxWidth: 140 }}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Form.Select>
            <Button size="sm" variant="primary" disabled={saving} onClick={handleSave}>儲存</Button>
            <Button size="sm" variant="outline-light" onClick={() => onDone(false)}>取消</Button>
        </ListGroup.Item>
    );
}

function AccountManager({ accounts, onRefresh }) {
    const [name, setName] = useState('');
    const [initialBalance, setInitialBalance] = useState('0');
    const [accountType, setAccountType] = useState('cash');
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        try {
            await accountAPI.create({ name: name.trim(), initial_balance: initialBalance, account_type: accountType });
            setName('');
            setInitialBalance('0');
            setAccountType('cash');
            onRefresh();
        } catch {
            alert('新增失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (acc) => {
        const impact = acc.transaction_count > 0
            ? `這個帳戶目前有 ${acc.transaction_count} 筆交易紀錄會被清空帳戶欄位（紀錄本身不會被刪除）。`
            : '這個帳戶目前沒有任何交易紀錄。';
        if (!window.confirm(`確定刪除帳戶「${acc.name}」？\n${impact}`)) return;
        try {
            await accountAPI.remove(acc.id);
            onRefresh();
        } catch {
            alert('刪除失敗');
        }
    };

    return (
        <div>
            <h6 className="fw-bold mb-3">帳戶管理</h6>
            <Form onSubmit={handleAdd} className="d-flex gap-2 mb-4 flex-wrap">
                <Form.Control
                    placeholder="帳戶名稱（如：台新、現金、Line Pay）"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={50}
                    className="flex-grow-1"
                    style={{ minWidth: 160 }}
                />
                <Form.Control
                    type="number" step="1" placeholder="初始餘額"
                    value={initialBalance}
                    onChange={e => setInitialBalance(e.target.value)}
                    style={{ minWidth: 100, maxWidth: 140 }}
                />
                <Form.Select value={accountType} onChange={e => setAccountType(e.target.value)} style={{ minWidth: 100, maxWidth: 140 }}>
                    {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Form.Select>
                <Button type="submit" variant="primary" disabled={saving}>新增</Button>
            </Form>

            <ListGroup>
                {accounts.length === 0 && (
                    <ListGroup.Item style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>尚無帳戶</ListGroup.Item>
                )}
                {accounts.map(acc => (
                    editingId === acc.id ? (
                        <EditRow key={acc.id} account={acc} onDone={(changed) => { setEditingId(null); if (changed) onRefresh(); }} />
                    ) : (
                        <ListGroup.Item key={acc.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                            <div>
                                <span className="fw-semibold">{acc.name}</span>
                                <Badge bg="secondary" className="ms-2">{TYPE_LABEL[acc.account_type] ?? '現金'}</Badge>
                                <span className="ms-3 small" style={{ color: 'rgba(255,255,255,0.6)' }}>初始餘額 NT$ {Number(acc.initial_balance).toLocaleString()}</span>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-light" size="sm" onClick={() => setEditingId(acc.id)}>編輯</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(acc)}>刪除</Button>
                            </div>
                        </ListGroup.Item>
                    )
                ))}
            </ListGroup>
        </div>
    );
}

export default AccountManager;
