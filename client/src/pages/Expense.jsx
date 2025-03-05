// src/pages/ExpenseTracker.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Card, Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: '', category: '', amount: '', payer: '' });
    const [newCategory, setNewCategory] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [showRemovePrompt, setShowRemovePrompt] = useState(false);
    const [removeIndex, setRemoveIndex] = useState(null);

    const addExpense = () => {
        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = { ...form, amount: parseFloat(form.amount) };
            setExpenses(updatedExpenses);
            setEditIndex(null);
        } else {
            setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
        }
        setForm({ description: '', category: '', amount: '', payer: '' });
    };

    const removeExpense = () => {
        setExpenses(expenses.filter((_, i) => i !== removeIndex));
        setShowRemovePrompt(false);
        setRemoveIndex(null);
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen pt-20 p-6">
            <Navbar />
            <div className="flex flex-col items-center gap-6">
                <Card className="w-full max-w-lg p-6 shadow-md">
                    <Typography variant="h6" className="mb-4">Add Expense</Typography>
                    <TextField label="Description" fullWidth className="mb-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <div className="flex gap-3 mb-3">
                        <TextField label="New Category" className="flex-1" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                        <Button variant="contained" color="primary" onClick={addCategory}>Add</Button>
                    </div>
                    <Select fullWidth className="mb-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                    <TextField label="Amount" type="number" fullWidth className="mb-3" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                    <TextField label="Payer" fullWidth className="mb-3" value={form.payer} onChange={(e) => setForm({ ...form, payer: e.target.value })} />
                    <Button variant="contained" color="success" fullWidth onClick={addExpense}>{editIndex !== null ? "Save Expense" : "Add Expense"}</Button>
                </Card>

                <Card className="w-full max-w-3xl p-6 shadow-md">
                    <Typography variant="h6" className="mb-4">Expenses</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payer</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                    <TableCell>{expense.payer}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="warning" onClick={() => setForm(expense)}>Edit</Button>
                                        <Button variant="outlined" color="error" className="ml-2" onClick={() => { setRemoveIndex(index); setShowRemovePrompt(true); }}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            <Dialog open={showRemovePrompt} onClose={() => setShowRemovePrompt(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to remove this expense?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRemovePrompt(false)} color="secondary">Cancel</Button>
                    <Button onClick={removeExpense} variant="contained" color="error">Remove</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
