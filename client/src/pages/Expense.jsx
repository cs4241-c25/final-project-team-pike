import { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: "", category: "", amount: "", payer: "" });
    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = useCallback(() => {
        fetch("http://localhost:3000/api/expenses", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error("Error fetching expenses:", error));
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const addExpense = () => {
        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = { ...form, amount: parseFloat(form.amount) };
            setExpenses([...updatedExpenses]);
            setEditIndex(null);
        } else {
            const newExpense = { ...form, amount: parseFloat(form.amount) };
            fetch("http://localhost:3000/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            })
                .then(() => {
                    fetchExpenses();
                    setForm({ description: "", category: "", amount: "", payer: "" });
                })
                .catch((error) => console.error("Error adding expense:", error));
        }
    };

    return (
        <div className="w-screen min-h-screen bg-white flex flex-col items-center px-4 py-8 pt-[150px]">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Expense Tracker 💰</h1>

            {/* Expense Form */}
            <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:flex-wrap md:gap-4">
                <TextField
                    className="w-full md:flex-1"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="flex flex-col md:flex-row md:w-full gap-2">
                    <TextField
                        className="flex-1"
                        label="New Category"
                        variant="outlined"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setCategories([...categories, newCategory])}
                    >
                        Add Category
                    </Button>
                </div>

                <FormControl className="w-full md:flex-1">
                    <InputLabel>Select Category</InputLabel>
                    <Select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        label="Select Category"
                    >
                        <MenuItem value="">Select Category</MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    className="w-full md:flex-1"
                    label="Amount"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />

                <TextField
                    className="w-full md:flex-1"
                    label="Payer"
                    variant="outlined"
                    fullWidth
                    value={form.payer}
                    onChange={(e) => setForm({ ...form, payer: e.target.value })}
                />

                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    className="md:w-1/3"
                    onClick={addExpense}
                >
                    {editIndex !== null ? "Save Expense" : "Add Expense"}
                </Button>
            </div>

            {/* Expenses Table (Scrollable on Mobile) */}
            <div className="w-full max-w-7xl mt-8 overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead>
                    <tr className="bg-gray-200 text-black">
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Payer</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="text-black">
                    {expenses.map((expense, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100 transition">
                            <td className="py-3 px-4">{expense.description}</td>
                            <td className="py-3 px-4">{expense.category}</td>
                            <td className="py-3 px-4">${expense.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">{expense.payer}</td>
                            <td className="py-3 px-4 flex flex-wrap gap-2">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => setEditIndex(index)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        setRemoveIndex(index);
                                        setShowRemovePrompt(true);
                                    }}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
