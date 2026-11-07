import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DEFAULT_FORM = {
    from_account_id: '',
    to_account_id: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
};

function TransferForm({ show, onHide, onSubmit, accounts }) {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setForm({ ...DEFAULT_FORM, date: new Date().toISOString().slice(0, 10) });
            setError('');
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.from_account_id || !form.to_account_id) return;
        if (String(form.from_account_id) === String(form.to_account_id)) {
            setError('轉出與轉入帳戶不可相同');
            return;
        }
        onSubmit({
            from_account_id: Number(form.from_account_id),
            to_account_id: Number(form.to_account_id),
            amount: Number(form.amount),
            date: form.date,
            description: form.description,
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered className="text-dark">
            <Modal.Header closeButton>
                <Modal.Title>帳戶轉帳</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger py-2" style={{ fontSize: '0.85rem' }}>{error}</div>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>轉出帳戶</Form.Label>
                        <Form.Select name="from_account_id" value={form.from_account_id} onChange={handleChange} required>
                            <option value="">請選擇</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>轉入帳戶</Form.Label>
                        <Form.Select name="to_account_id" value={form.to_account_id} onChange={handleChange} required>
                            <option value="">請選擇</option>
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
                        <Form.Label>備註</Form.Label>
                        <Form.Control
                            type="text" name="description" maxLength={255}
                            value={form.description} onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>取消</Button>
                    <Button variant="primary" type="submit">確認轉帳</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default TransferForm;
