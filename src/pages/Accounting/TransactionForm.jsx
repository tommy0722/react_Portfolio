import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DEFAULT_FORM = { type: 'expense', amount: '', date: '', account_id: '', category_id: '', description: '' };

function TransactionForm({ show, onHide, onSubmit, accounts, categories, initial }) {
    const [form, setForm] = useState(DEFAULT_FORM);

    useEffect(() => {
        if (initial) {
            setForm({
                type: initial.type,
                amount: initial.amount,
                date: initial.date,
                account_id: initial.account?.id ?? '',
                category_id: initial.category?.id ?? '',
                description: initial.description ?? '',
            });
        } else {
            setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
        }
    }, [initial, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'type' ? { category_id: '' } : {}),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            account_id: form.account_id || null,
            category_id: form.category_id || null,
        });
    };

    const filtered = categories.filter(c => c.type === form.type);
    const roots = filtered.filter(c => !c.parent);
    const childrenOf = (id) => filtered.filter(c => c.parent === id);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{initial ? '編輯紀錄' : '新增紀錄'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>類型</Form.Label>
                        <Form.Select name="type" value={form.type} onChange={handleChange} required>
                            <option value="expense">支出</option>
                            <option value="income">收入</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>帳戶</Form.Label>
                        <Form.Select name="account_id" value={form.account_id} onChange={handleChange}>
                            <option value="">不指定帳戶</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>金額</Form.Label>
                        <Form.Control
                            type="number" name="amount" min="1" step="1"
                            value={form.amount} onChange={handleChange} required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>日期</Form.Label>
                        <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>分類</Form.Label>
                        <Form.Select name="category_id" value={form.category_id} onChange={handleChange}>
                            <option value="">無分類</option>
                            {roots.map(parent => {
                                const subs = childrenOf(parent.id);
                                return subs.length > 0 ? (
                                    <optgroup key={parent.id} label={parent.name}>
                                        {subs.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </optgroup>
                                ) : (
                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>備註</Form.Label>
                        <Form.Control
                            type="text" name="description" maxLength={255}
                            value={form.description} onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>取消</Button>
                    <Button variant="primary" type="submit">儲存</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default TransactionForm;
