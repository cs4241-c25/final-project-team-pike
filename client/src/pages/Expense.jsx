import { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: "", category: "", amount: "", payer: "" });
    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [showRemovePrompt, setShowRemovePrompt] = useState(false);
    const [removeIndex, setRemoveIndex] = useState(null);

    // Fetch expenses from the backend
    const fetchExpenses = useCallback(() => {
        fetch("http://localhost:3000/api/expenses", { headers: { "x-username": "exampleUser" } })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched expenses:", data);
                setExpenses(data);
            })
            .catch((error) => console.error("Error fetching expenses:", error));
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // Add an expense
    const addExpense = () => {
        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = { ...form, amount: parseFloat(form.amount) };
            setExpenses([...updatedExpenses]); // Update the state
            setEditIndex(null);
        } else {
            const newExpense = { ...form, amount: parseFloat(form.amount) };
            fetch("http://localhost:3000/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-username": "exampleUser" },
                body: JSON.stringify(newExpense),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Added expense:", data);
                    fetchExpenses();
                    setForm({ description: "", category: "", amount: "", payer: "" }); // Reset form
                })
                .catch((error) => console.error("Error adding expense:", error));
        }
    };

    // Remove an expense
    const removeExpense = () => {
        fetch(`http://localhost:3000/api/expenses/${expenses[removeIndex].id}`, {
            method: "DELETE",
            headers: { "x-username": "exampleUser" },
        })
            .then(() => {
                console.log("Deleted expense ID:", expenses[removeIndex].id);
                fetchExpenses();
                setShowRemovePrompt(false);
                setRemoveIndex(null);
            })
            .catch((error) => console.error("Error deleting expense:", error));
    };

    // Add category
    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
    };

    // Edit expense
    const editExpense = (index) => {
        const expenseToEdit = expenses[index];
        setForm({
            description: expenseToEdit.description,
            category: expenseToEdit.category || "",
            amount: expenseToEdit.amount.toString(),
            payer: expenseToEdit.payer,
        });
        setEditIndex(index);
    };

    return (
        <div className="w-screen min-h-screen bg-white flex flex-col items-center px-4 py-8 pt-[150px]">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Expense Tracker 💰</h1>

            {/* Expense Form */}
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
                <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="New Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={addCategory}
                    >
                        Add Category
                    </button>
                </div>
                <FormControl fullWidth>
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

                <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Payer"
                    value={form.payer}
                    onChange={(e) => setForm({ ...form, payer: e.target.value })}
                />
                <button
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={addExpense}
                >
                    {editIndex !== null ? "Save Expense" : "Add Expense"}
                </button>
            </div>

            {/* Expenses Table */}
            <div className="w-full max-w-4xl mt-8">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
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
                            <td className="py-3 px-4 text-black">{expense.description}</td>
                            <td className="py-3 px-4 text-black">{expense.category}</td>
                            <td className="py-3 px-4 text-black">${expense.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-black">{expense.payer}</td>
                            <td className="py-3 px-4 flex gap-2">
                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => editExpense(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    onClick={() => {
                                        setRemoveIndex(index);
                                        setShowRemovePrompt(true);
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
        </div>
    );
}
