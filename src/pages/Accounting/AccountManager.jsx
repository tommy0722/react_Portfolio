import React, { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { accountAPI } from '../../services/accountingService';

function AccountManager({ accounts, onRefresh }) {
    const [name, setName] = useState('');
    const [initialBalance, setInitialBalance] = useState('0');
    const [saving, setSaving] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        try {
            await accountAPI.create({ name: name.trim(), initial_balance: initialBalance });
            setName('');
            setInitialBalance('0');
            onRefresh();
        } catch {
            alert('新增失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此帳戶？相關交易紀錄的帳戶欄位將清空。')) return;
        try {
            await accountAPI.remove(id);
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
                <Button type="submit" variant="primary" disabled={saving}>新增</Button>
            </Form>

            <ListGroup>
                {accounts.length === 0 && (
                    <ListGroup.Item style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>尚無帳戶</ListGroup.Item>
                )}
                {accounts.map(acc => (
                    <ListGroup.Item key={acc.id} className="d-flex justify-content-between align-items-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                        <div>
                            <span className="fw-semibold">{acc.name}</span>
                            <span className="ms-3 small" style={{ color: 'rgba(255,255,255,0.6)' }}>初始餘額 $ {Number(acc.initial_balance).toLocaleString()}</span>
                        </div>
                        <Button variant="outline-light" size="sm" onClick={() => handleDelete(acc.id)}>刪除</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default AccountManager;
