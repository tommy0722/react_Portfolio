import React, { useState } from 'react';
import { Button, Form, Badge } from 'react-bootstrap';
import { categoryAPI } from '../../services/accountingService';

const EMPTY = { name: '', type: 'expense', budget_limit: '' };

function BudgetEditor({ category, onRefresh }) {
    const [value, setValue] = useState(category.budget_limit ?? '');
    const [saving, setSaving] = useState(false);

    const handleBlur = async () => {
        const next = value === '' ? null : Number(value);
        if (next === (category.budget_limit ?? null)) return;
        setSaving(true);
        try {
            await categoryAPI.update(category.id, {
                name: category.name,
                type: category.type,
                parent: category.parent,
                budget_limit: next,
            });
            onRefresh();
        } catch {
            alert('預算更新失敗');
            setValue(category.budget_limit ?? '');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Form.Control
            type="number" min="0" step="1"
            placeholder="月度預算"
            value={value}
            disabled={saving}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            style={{ width: 110, height: 30, fontSize: '0.8rem', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}
        />
    );
}

function CategoryManager({ categories, onRefresh }) {
    const [mainForm, setMainForm] = useState(EMPTY);
    const [subForm, setSubForm] = useState({ name: '', parentId: '', budget_limit: '' });
    const [saving, setSaving] = useState(false);

    const roots = categories.filter(c => !c.parent);
    const childrenOf = (id) => categories.filter(c => c.parent === id);

    const selectedParent = categories.find(c => c.id === parseInt(subForm.parentId));

    const handleAddMain = async (e) => {
        e.preventDefault();
        if (!mainForm.name.trim()) return;
        setSaving(true);
        try {
            await categoryAPI.create({
                name: mainForm.name.trim(),
                type: mainForm.type,
                parent: null,
                budget_limit: mainForm.budget_limit === '' ? null : Number(mainForm.budget_limit),
            });
            setMainForm(EMPTY);
            onRefresh();
        } catch { alert('新增失敗'); }
        finally { setSaving(false); }
    };

    const handleAddSub = async (e) => {
        e.preventDefault();
        if (!subForm.name.trim() || !subForm.parentId) return;
        setSaving(true);
        try {
            await categoryAPI.create({
                name: subForm.name.trim(),
                type: selectedParent.type,
                parent: parseInt(subForm.parentId),
                budget_limit: subForm.budget_limit === '' ? null : Number(subForm.budget_limit),
            });
            setSubForm({ name: '', parentId: subForm.parentId, budget_limit: '' });
            onRefresh();
        } catch { alert('新增失敗'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (category) => {
        const kids = childrenOf(category.id);
        const affected = (category.transaction_count ?? 0) + kids.reduce((s, k) => s + (k.transaction_count ?? 0), 0);
        const kidsNote = kids.length > 0 ? `，${kids.length} 個子分類也會一併刪除` : '';
        const impact = affected > 0
            ? `共 ${affected} 筆交易紀錄的分類欄位會被清空（紀錄本身不會被刪除）${kidsNote}。`
            : `目前沒有任何交易紀錄使用這個分類${kidsNote}。`;
        if (!window.confirm(`確定刪除「${category.name}」？\n${impact}`)) return;
        try {
            await categoryAPI.remove(category.id);
            onRefresh();
        } catch { alert('刪除失敗'); }
    };

    return (
        <div>
            <h6 className="fw-bold mb-4">分類管理</h6>

            <div className="row g-4 mb-4">
                {/* 新增大分類 */}
                <div className="col-md-6">
                    <div className="card h-100" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                        <div className="card-header fw-semibold">新增大分類</div>
                        <div className="card-body">
                            <Form onSubmit={handleAddMain} className="d-flex flex-column gap-2">
                                <Form.Select
                                    value={mainForm.type}
                                    onChange={e => setMainForm(f => ({ ...f, type: e.target.value }))}
                                >
                                    <option value="expense">支出</option>
                                    <option value="income">收入</option>
                                </Form.Select>
                                <Form.Control
                                    placeholder="大分類名稱"
                                    value={mainForm.name}
                                    onChange={e => setMainForm(f => ({ ...f, name: e.target.value }))}
                                    maxLength={50}
                                />
                                {mainForm.type === 'expense' && (
                                    <Form.Control
                                        type="number" min="0" step="1"
                                        placeholder="月度預算上限（選填）"
                                        value={mainForm.budget_limit}
                                        onChange={e => setMainForm(f => ({ ...f, budget_limit: e.target.value }))}
                                    />
                                )}
                                <Button type="submit" variant="primary" disabled={saving}>新增大分類</Button>
                            </Form>
                        </div>
                    </div>
                </div>

                {/* 新增小分類 */}
                <div className="col-md-6">
                    <div className="card h-100" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                        <div className="card-header fw-semibold">新增小分類</div>
                        <div className="card-body">
                            <Form onSubmit={handleAddSub} className="d-flex flex-column gap-2">
                                <Form.Select
                                    value={subForm.parentId}
                                    onChange={e => setSubForm(f => ({ ...f, parentId: e.target.value }))}
                                >
                                    <option value="">選擇上層大分類</option>
                                    {roots.map(c => (
                                        <option key={c.id} value={c.id}>
                                            [{c.type === 'income' ? '收入' : '支出'}] {c.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control
                                    placeholder="小分類名稱"
                                    value={subForm.name}
                                    onChange={e => setSubForm(f => ({ ...f, name: e.target.value }))}
                                    maxLength={50}
                                    disabled={!subForm.parentId}
                                />
                                {selectedParent?.type === 'expense' && (
                                    <Form.Control
                                        type="number" min="0" step="1"
                                        placeholder="月度預算上限（選填）"
                                        value={subForm.budget_limit}
                                        onChange={e => setSubForm(f => ({ ...f, budget_limit: e.target.value }))}
                                    />
                                )}
                                <Button type="submit" variant="success" disabled={saving || !subForm.parentId}>新增小分類</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {/* 樹狀列表 */}
            {['expense', 'income'].map(t => {
                const topLevel = categories.filter(c => !c.parent && c.type === t);
                if (topLevel.length === 0) return null;
                return (
                    <div key={t} className="mb-4">
                        <div className="fw-bold mb-2">
                            <Badge bg={t === 'income' ? 'success' : 'danger'} className="me-2">
                                {t === 'income' ? '收入' : '支出'}
                            </Badge>
                        </div>
                        {topLevel.map(parent => (
                            <div key={parent.id} className="mb-1">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-2 rounded" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <span className="fw-semibold text-truncate" style={{ maxWidth: '40%' }}>{parent.name}</span>
                                    <div className="d-flex align-items-center gap-2">
                                        {t === 'expense' && <BudgetEditor category={parent} onRefresh={onRefresh} />}
                                        {parent.user && (
                                            <Button variant="outline-light" size="sm" onClick={() => handleDelete(parent)}>刪除</Button>
                                        )}
                                    </div>
                                </div>
                                {childrenOf(parent.id).map(child => (
                                    <div key={child.id} className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-3 py-2 ms-3 ms-sm-4 rounded mt-1" style={{ background: 'rgba(102,126,234,0.2)', color: '#fff', border: '1px solid rgba(102,126,234,0.3)' }}>
                                        <span className="text-truncate" style={{ maxWidth: '40%', color: 'rgba(255,255,255,0.8)' }}>└ {child.name}</span>
                                        <div className="d-flex align-items-center gap-2">
                                            {t === 'expense' && <BudgetEditor category={child} onRefresh={onRefresh} />}
                                            {child.user && (
                                                <Button variant="outline-light" size="sm" onClick={() => handleDelete(child)}>刪除</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default CategoryManager;
