import { useState } from 'react';

export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: '', category: '', amount: '', payer: '' });
    const [newCategory, setNewCategory] = useState('');
    const [editIndex, setEditIndex] = useState(null); // New state to track the index of the expense being edited
    const [showRemovePrompt, setShowRemovePrompt] = useState(false); // To show remove confirmation
    const [removeIndex, setRemoveIndex] = useState(null); // Index of the expense to remove

    const addExpense = () => {
        if (editIndex !== null) {
            // Update the expense if editing
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = { ...form, amount: parseFloat(form.amount) };
            setExpenses(updatedExpenses);
            setEditIndex(null); // Reset the edit index after saving
        } else {
            // Add new expense
            setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
        }
        setForm({ description: '', category: '', amount: '', payer: '' });
    };

    const removeExpense = () => {
        // Remove the expense from the list
        const updatedExpenses = expenses.filter((_, i) => i !== removeIndex);
        setExpenses(updatedExpenses);
        setShowRemovePrompt(false); // Close the remove confirmation
        setRemoveIndex(null); // Reset the index
    };

    const cancelRemove = () => {
        setShowRemovePrompt(false); // Close the remove confirmation without removing
        setRemoveIndex(null); // Reset the index
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const editExpense = (index) => {
        const expenseToEdit = expenses[index];
        setForm({
            description: expenseToEdit.description,
            category: expenseToEdit.category,
            amount: expenseToEdit.amount.toString(),
            payer: expenseToEdit.payer,
        });
        setEditIndex(index); // Set the index to indicate we're editing this expense
    };

    return (
        <div className="container">
            <h1 className="title">Expense Tracker</h1>
            <div className="form-container">
                <input
                    className="input"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="add-category">
                    <input
                        className="input"
                        placeholder="New Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button className="button add-category-button" onClick={addCategory}>
                        Add Category
                    </button>
                </div>
                <select
                    className="select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <input
                    className="input"
                    placeholder="Amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Payer"
                    value={form.payer}
                    onChange={(e) => setForm({ ...form, payer: e.target.value })}
                />
                <button className="button add-expense-button" onClick={addExpense}>
                    {editIndex !== null ? 'Save Expense' : 'Add Expense'}
                </button>
            </div>

            {/* Remove Expense Confirmation Section */}
            {showRemovePrompt && (
                <div className="remove-prompt">
                    <h2>Are you sure you want to remove this expense?</h2>
                    <button className="button confirm-remove" onClick={removeExpense}>
                        Yes, Remove
                    </button>
                    <button className="button cancel-remove" onClick={cancelRemove}>
                        No, Cancel
                    </button>
                </div>
            )}

            {/* Expenses Table */}
            <table className="table">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Payer</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {expenses.map((expense, index) => (
                    <tr key={index}>
                        <td>{expense.description}</td>
                        <td>{expense.category}</td>
                        <td>${expense.amount.toFixed(2)}</td>
                        <td>{expense.payer}</td>
                        <td className="table-actions">
                            <button
                                className="button edit-button"
                                onClick={() => editExpense(index)} // Edit button
                            >
                                Edit
                            </button>
                            <button
                                className="button remove-button"
                                onClick={() => {
                                    setRemoveIndex(index); // Set the index of the expense to remove
                                    setShowRemovePrompt(true); // Show remove confirmation
                                }}
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

/*dxhs*/