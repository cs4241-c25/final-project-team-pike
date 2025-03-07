import { useState } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: "", category: "", amount: "", payer: "" });
    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]);
    const [settledTransactions, setSettledTransactions] = useState([]);
    const [showSettledTransactions, setShowSettledTransactions] = useState(false);

    // Sample list of users, this could come from API or context
    const users = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Alice Johnson" },
    ];

    // Add or Edit an Expense
    const addExpense = () => {
        const newExpense = { ...form, amount: parseFloat(form.amount) };

        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = newExpense;
            setExpenses(updatedExpenses);
            setDebts(updatedExpenses);
            setEditIndex(null);
        } else {
            setExpenses([...expenses, newExpense]);
            setDebts([...debts, newExpense]);
        }

        setForm({ description: "", category: "", amount: "", payer: "" }); // Reset form
    };

    // Edit an Expense
    const editExpense = (index) => {
        setForm(debts[index]);
        setEditIndex(index);
    };

    // Remove an Expense
    const removeExpense = (index) => {
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(updatedExpenses);
        setDebts(updatedExpenses);
    };

    // Add Category
    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
    };

    // Settle all debts
    const settleAllDebts = () => {
        setSettledTransactions([...settledTransactions, ...debts]);
        setDebts([]);
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

                <FormControl fullWidth>
                    <InputLabel>Select Payer</InputLabel>
                    <Select
                        value={form.payer}
                        onChange={(e) => setForm({ ...form, payer: e.target.value })}
                        label="Select Payer"
                    >
                        <MenuItem value="">Select Payer</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.name}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <button
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    onClick={addExpense}
                >
                    {editIndex !== null ? "Save Expense" : "Add Expense"}
                </button>
            </div>

            {/* Debts That Need to Be Settled */}
            <div className="w-full max-w-4xl mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Settle These! 💳</h2>
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
                    {debts.map((debt, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100 transition">
                            <td className="py-3 px-4">{debt.description}</td>
                            <td className="py-3 px-4">{debt.category}</td>
                            <td className="py-3 px-4">${debt.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">{debt.payer}</td>
                            <td className="py-3 px-4">
                                <button
                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg mr-2"
                                    onClick={() => editExpense(index)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg"
                                    onClick={() => removeExpense(index)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={settleAllDebts}
            >
                Settle All Debts
            </button>

            <button
                className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                onClick={() => setShowSettledTransactions(!showSettledTransactions)}
            >
                {showSettledTransactions ? "Hide Settled Transactions" : "View Settled Transactions"}
            </button>
        </div>
    );
}
