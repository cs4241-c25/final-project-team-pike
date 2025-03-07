import { useState, useEffect } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [form, setForm] = useState({ description: "", amount: "", payer: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]);
    const [settledTransactions, setSettledTransactions] = useState([]);
    const [resolvedPayments, setResolvedPayments] = useState([]);
    const [showSettledTransactions, setShowSettledTransactions] = useState(false);

    // Sample list of users, this could come from API or context
    const users = [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Alice Johnson" },
    ];

    // Fetch Expenses from backend
    const fetchExpenses = async () => {
        try {
            const response = await fetch("/api/payments", { credentials: "include" });
            const data = await response.json();
            setExpenses(data);
            setDebts(data.filter(expense => !expense.paidOff)); // Only include unpaid debts
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    useEffect(() => {
        fetchExpenses(); // Fetch expenses on initial render
    }, []);

    // Add or Edit an Expense
    const addExpense = async () => {
        const newExpense = { ...form, amount: parseFloat(form.amount) };

        if (editIndex !== null) {
            const updatedExpenses = [...expenses];
            updatedExpenses[editIndex] = newExpense;
            setExpenses(updatedExpenses);
            setDebts(updatedExpenses.filter(expense => !expense.paidOff));
            setEditIndex(null);
        } else {
            setExpenses([...expenses, newExpense]);
            setDebts([...debts, newExpense]);
        }

        try {
            const response = await fetch("http://localhost:3000/api/payments/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    payerID: form.payer,
                    amountPaid: newExpense.amount,
                    description: newExpense.description,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding expense:", errorData.error);
            }
        } catch (error) {
            console.error("Error adding expense:", error);
        }

        setForm({ description: "", amount: "", payer: "" }); // Reset form
    };

    // Edit an Expense
    const editExpense = (index) => {
        setForm(debts[index]);
        setEditIndex(index);
    };

    // Remove an Expense
    const removeExpense = async (index) => {
        const expenseToRemove = debts[index];
        const updatedExpenses = expenses.filter((_, i) => i !== index);
        setExpenses(updatedExpenses);
        setDebts(updatedExpenses.filter(expense => !expense.paidOff));

        try {
            const response = await fetch(`http://localhost:3000/api/payments/delete/${expenseToRemove.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error removing expense:", errorData.error);
            }
        } catch (error) {
            console.error("Error removing expense:", error);
        }
    };

    // Settle all debts and show resolved payments
    const settleAllDebts = async () => {
        try {
            const paymentIDs = debts.map((debt) => debt.id);
            const response = await fetch("http://localhost:3000/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentIDs }),
                credentials: "include"
            });
            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error settling debts:", errorData.errors);
                return;
            }

            setSettledTransactions([...settledTransactions, ...debts]);
            setResolvedPayments([...resolvedPayments, ...debts]);
            setDebts([]);
        } catch (error) {
            console.error("Error settling debts:", error);
        }
    };

    // View past expenses
    const handleShowPastExpenses = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/payments/resolve", { credentials: "include" });
            const resolvedData = await response.json();
            setResolvedPayments(resolvedData);
            setShowSettledTransactions(true);
        } catch (error) {
            console.error("Error fetching resolved payments:", error);
        }
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

            {/* Split Screen for Tables */}
            <div className="w-full max-w-4xl mt-8 flex justify-between gap-8">
                {/* Settle These Table */}
                <div className="w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Settle These! 💳</h2>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-3 px-4 text-left">Description</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Payer</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {debts.map((debt, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">{debt.description}</td>
                                <td className="py-3 px-4">{`$${debt.amount.toFixed(2)}`}</td>
                                <td className="py-3 px-4">{debt.payer}</td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button
                                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                        onClick={() => editExpense(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        onClick={() => removeExpense(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Resolve Payments Button */}
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={settleAllDebts}
                    >
                        Resolve Your Payments
                    </button>
                </div>

                {/* Resolved Payments Table */}
                <div className="w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who owes who</h2>
                    {resolvedPayments.length === 0 ? (
                        <p className="text-black">No payments to resolve yet.</p>
                    ) : (
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="py-3 px-4 text-left">From</th>
                                <th className="py-3 px-4 text-left">To</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="text-black">
                            {resolvedPayments.map((transaction, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100 transition">
                                    <td className="py-3 px-4">{transaction.payer}</td>
                                    <td className="py-3 px-4">{transaction.receiver}</td>
                                    <td className="py-3 px-4">${transaction.amount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                    <button
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        onClick={handleShowPastExpenses}
                    >
                        View Past Expenses
                    </button>
                </div>
            </div>
        </div>
    );
}
