import { useState, useEffect } from "react";
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ExpenseTracker() {
    const [form, setForm] = useState({ description: "", amountPaid: "", payer: "" });
    const [orgUsers, setOrgUsers] = useState([]);
    const [currentExpenses, setCurrentExpenses] = useState([]);
    const [pastExpenses, setPastExpenses] = useState([]);
    const [paymentResolutions, setPaymentResolutions] = useState([]);

    const fetchOrgUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/org/users", { credentials: "include" });
            const data = await response.json();
            setOrgUsers(data.users);
        } catch (error) {
            console.error("Error org users:", error);
        }
    }

    const fetchExpenses = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/payments", { credentials: "include" });
            const data = await response.json();
            setCurrentExpenses(data.filter(expense => !expense.paidOff));
            setPastExpenses(data.filter(expense => expense.paidOff));
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const fetchPaymentResolutions = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/payments/resolve", { credentials: "include" });
            const resolvedData = await response.json();
            setPaymentResolutions(resolvedData);
        } catch (error) {
            console.error("Error fetching payment resolutions:", error);
        }
    };

    useEffect(() => {
        fetchOrgUsers();
        fetchExpenses();
        fetchPaymentResolutions();
    }, []);

    const addExpense = async () => {
        const newExpense = { ...form, amountPaid: parseFloat(form.amountPaid) };
        
        try {
            const response = await fetch("http://localhost:3000/api/payments/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    payerName: form.payer,
                    amountPaid: newExpense.amountPaid,
                    description: newExpense.description,
                }),
                credentials: "include",
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding expense:", errorData.error);
            }
            fetchExpenses();
            fetchPaymentResolutions();
        } catch (error) {
            console.error("Error adding expense:", error);
        }

        setForm({ description: "", amountPaid: "", payer: "" });
    };

    const removeExpense = async (index) => {
        const expenseToRemove = currentExpenses[index];

        try {
            const response = await fetch(`http://localhost:3000/api/payments/delete/${expenseToRemove.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error removing expense:", errorData.error);
            }

            fetchExpenses();
            fetchPaymentResolutions();
        } catch (error) {
            console.error("Error removing expense:", error);
        }
    };

    const resolvePayments = async () => {
        try {
            const paymentIDs = currentExpenses.map((e) => e.id);
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

            fetchExpenses()
        } catch (error) {
            console.error("Error settling debts:", error);
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
                    value={form.amountPaid}
                    onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
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
                        {orgUsers.map((user, index) => ( 
                            <MenuItem key={index} value={user}>
                                {user}
                            </MenuItem>
                        ))}
                    </Select>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={addExpense}
                    >
                        Add Expense
                    </button>
                </FormControl>
            </div>

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
                            <th className="py-3 px-4 text-left">Modify</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {currentExpenses.map((e, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">{e.description}</td>
                                <td className="py-3 px-4">{`$${e.amountPaid.toFixed(2)}`}</td>
                                <td className="py-3 px-4">{e.realName}</td>
                                <td className="py-3 px-4 flex gap-2">
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
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            onClick={resolvePayments}
                        >
                            Resolve Your Payments
                        </button>
                    </div>
                </div>

                {/* Payment Resolutions Table */}
                <div className="w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who owes who</h2>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-3 px-4 text-left">From</th>
                            <th className="py-3 px-4 text-left">To</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {paymentResolutions.map((transaction, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">{transaction.from}</td>
                                <td className="py-3 px-4">{transaction.to}</td>
                                <td className="py-3 px-4">${transaction.amount}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Past Expenses Table */}
            {<div className="w-full max-w-4xl mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Expenses</h2>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-3 px-4 text-left">Description</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Payer</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {pastExpenses.map((expense, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">{expense.description}</td>
                                <td className="py-3 px-4">${expense.amountPaid}</td>
                                <td className="py-3 px-4">{expense.realName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>}
        </div>
    );
}
