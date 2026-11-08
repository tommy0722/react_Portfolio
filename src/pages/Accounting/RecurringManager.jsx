import React, { useState } from 'react';
import { Button, Form, Badge, ListGroup } from 'react-bootstrap';
import { recurringAPI } from '../../services/accountingService';

const DEFAULT_FORM = {
    type: 'expense', amount: '', description: '',
    frequency: 'monthly', start_date: '', end_date: '',
    account_id: '', category_id: '',
};

const FREQUENCY_LABEL = { daily: '每日', weekly: '每週', monthly: '每月', yearly: '每年' };

function RecurringManager({ recurring, accounts, categories, onRefresh }) {
    const [form, setForm] = useState({ ...DEFAULT_FORM, start_date: new Date().toISOString().slice(0, 10) });
    const [saving, setSaving] = useState(false);

    const filteredCategories = categories.filter(c => c.type === form.type);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value, ...(name === 'type' ? { category_id: '' } : {}) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.start_date) return;
        setSaving(true);
        try {
            await recurringAPI.create({
                ...form,
                account_id: form.account_id || null,
                category_id: form.category_id || null,
                end_date: form.end_date || null,
            });
            setForm({ ...DEFAULT_FORM, start_date: new Date().toISOString().slice(0, 10) });
            onRefresh();
        } catch {
            alert('新增失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('確定刪除此定期交易設定？（已產生的紀錄不會被刪除）')) return;
        try {
            await recurringAPI.remove(id);
            onRefresh();
        } catch {
            alert('刪除失敗');
        }
    };

    return (
        <div>
            <h6 className="fw-bold mb-3">定期交易</h6>
            <p className="small mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                到期時不會自動記帳，會出現在上方「待確認」清單，由你確認後才正式寫入。
            </p>

            <div className="card mb-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                <div className="card-header fw-semibold">新增定期交易</div>
                <div className="card-body">
                    <Form onSubmit={handleSubmit} className="row g-2 align-items-end">
                        <div className="col-6 col-md-2">
                            <Form.Select name="type" value={form.type} onChange={handleChange}>
                                <option value="expense">支出</option>
                                <option value="income">收入</option>
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-2">
                            <Form.Control type="number" min="1" step="1" name="amount" placeholder="金額" value={form.amount} onChange={handleChange} required />
                        </div>
                        <div className="col-6 col-md-2">
                            <Form.Select name="account_id" value={form.account_id} onChange={handleChange}>
                                <option value="">不指定帳戶</option>
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-2">
                            <Form.Select name="category_id" value={form.category_id} onChange={handleChange}>
                                <option value="">無分類</option>
                                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-2">
                            <Form.Select name="frequency" value={form.frequency} onChange={handleChange}>
                                {Object.entries(FREQUENCY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-2">
                            <Button type="submit" variant="primary" disabled={saving} className="w-100">新增</Button>
                        </div>
                        <div className="col-6 col-md-3">
                            <Form.Label className="small mb-1">起始日期</Form.Label>
                            <Form.Control type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
                        </div>
                        <div className="col-6 col-md-3">
                            <Form.Label className="small mb-1">結束日期（選填）</Form.Label>
                            <Form.Control type="date" name="end_date" value={form.end_date} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-6">
                            <Form.Label className="small mb-1">備註</Form.Label>
                            <Form.Control type="text" name="description" placeholder="例如：Netflix 訂閱" maxLength={255} value={form.description} onChange={handleChange} />
                        </div>
                    </Form>
                </div>
            </div>

            <ListGroup>
                {recurring.length === 0 && (
                    <ListGroup.Item style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                        尚無定期交易設定
                    </ListGroup.Item>
                )}
                {recurring.map(r => (
                    <ListGroup.Item key={r.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                        <div>
                            <Badge bg={r.type === 'income' ? 'success' : 'danger'} className="me-2">{r.type === 'income' ? '收入' : '支出'}</Badge>
                            <span className="fw-semibold">{r.description || '（無備註）'}</span>
                            <span className="ms-2 small" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                NT$ {Number(r.amount).toLocaleString()} ・ {FREQUENCY_LABEL[r.frequency]} ・ 下次 {r.next_due_date}
                                {!r.is_active && ' ・ 已結束'}
                            </span>
                        </div>
                        <Button variant="outline-light" size="sm" onClick={() => handleDelete(r.id)}>刪除</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default RecurringManager;
