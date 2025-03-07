import { useState } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ description: "", category: "", amount: "", payer: "" });
    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]); // List of unsettled debts
    const [settledTransactions, setSettledTransactions] = useState([]); // List of past paid transactions
    const [showSettledTransactions, setShowSettledTransactions] = useState(false); // Toggle for past expenses

    // Commented out API calls
    /*
    const fetchExpenses = useCallback(() => {
        fetch("http://localhost:3000/api/expenses", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error("Error fetching expenses:", error));
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);
    */

    // Add an expense
    const addExpense = () => {
        const newExpense = { ...form, amount: parseFloat(form.amount) };

        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = newExpense;
            setExpenses(updatedExpenses);
            setEditIndex(null);
        } else {
            setExpenses([...expenses, newExpense]);
            setDebts([...debts, newExpense]); // Simultaneously add to debts table
        }

        setForm({ description: "", category: "", amount: "", payer: "" }); // Reset form
    };

    // Add category
    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
    };

    // Remove expense (commented out API call)
    /*
    const removeExpense = (index) => {
        fetch(`http://localhost:3000/api/expenses/${expenses[index].id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(() => {
                const updatedExpenses = expenses.filter((_, i) => i !== index);
                setExpenses(updatedExpenses);
            })
            .catch((error) => console.error("Error deleting expense:", error));
    };
    */

    // Settle all debts (currently only clearing UI)
    const settleAllDebts = () => {
        setSettledTransactions([...settledTransactions, ...debts]); // Move debts to settled transactions
        setDebts([]); // Clear unsettled debts
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
                    </tr>
                    </thead>
                    <tbody className="text-black">
                    {debts.map((debt, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100 transition">
                            <td className="py-3 px-4">{debt.description}</td>
                            <td className="py-3 px-4">{debt.category}</td>
                            <td className="py-3 px-4">${debt.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">{debt.payer}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Settle All Debts Button */}
            <button
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={settleAllDebts}
            >
                Settle All Debts
            </button>

            {/* Toggle Button for Viewing Settled Transactions */}
            <button
                className="mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                onClick={() => setShowSettledTransactions(!showSettledTransactions)}
            >
                {showSettledTransactions ? "Hide Settled Transactions" : "View Settled Transactions"}
            </button>

            {/* Settled Transactions Section */}
            {showSettledTransactions && settledTransactions.length > 0 && (
                <div className="w-full max-w-4xl mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settled Transactions ✅</h2>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-3 px-4 text-left">Description</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {settledTransactions.map((txn, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">{txn.description}</td>
                                <td className="py-3 px-4">${txn.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
