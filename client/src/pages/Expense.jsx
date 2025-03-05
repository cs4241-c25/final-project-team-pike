import { useState } from "react";
import Navbar from "../components/Navbar";
import {
    Button,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    InputAdornment,
} from "@mui/material";

export default function Expense() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        description: "",
        category: "",
        amount: "",
        payer: "",
    });
    const [showRemovePrompt, setShowRemovePrompt] = useState(false);
    const [removeIndex, setRemoveIndex] = useState(null);

    // Extract unique payers from existing expenses
    const payers = [...new Set(expenses.map((expense) => expense.payer))];

    const addExpense = () => {
        if (form.description && form.category && form.amount && form.payer) {
            setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
            setForm({ description: "", category: "", amount: "", payer: "" });
        }
    };

    const removeExpense = () => {
        setExpenses(expenses.filter((_, i) => i !== removeIndex));
        setShowRemovePrompt(false);
        setRemoveIndex(null);
    };

    return (
        <div
            className="fixed inset-0 flex flex-col items-center w-full min-h-screen text-center p-6 bg-white text-black pt-[150px]">
            <Navbar/>
            <h2 className="text-3xl font-bold mb-6">Expense Tracker 💰</h2>

            {/* Add Expense Form */}
            <div className="p-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h5" className="!mb-4 font-semibold">Add an Expense</Typography>
                <div className="flex flex-col gap-3">
                    <TextField
                        label="Description"
                        fullWidth
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                    <Select
                        fullWidth
                        value={form.category}
                        onChange={(e) => setForm({...form, category: e.target.value})}
                        displayEmpty
                        sx={{textAlign: "left"}} // Left-aligns placeholder
                    >
                        <MenuItem value="" disabled>Category</MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category}>{category}</MenuItem>
                        ))}
                    </Select>

                    {/* Amount Field with Dollar Sign Prefix */}
                    <TextField
                        label="Amount"
                        type="number"
                        fullWidth
                        value={form.amount}
                        onChange={(e) => setForm({...form, amount: e.target.value})}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />

                    <Select
                        fullWidth
                        value={form.payer}
                        onChange={(e) => setForm({...form, payer: e.target.value})}
                        displayEmpty
                        sx={{textAlign: "left"}} // Left-aligns placeholder
                    >
                        <MenuItem value="" disabled>Payer</MenuItem>
                        {payers.map((payer, index) => (
                            <MenuItem key={index} value={payer}>{payer}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" color="success" fullWidth onClick={addExpense}>
                        Add Expense
                    </Button>
                </div>
            </div>

            {/* Expense Table */}
            <div className="p-6 mt-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h5" className="!mb-4 font-semibold">Expenses</Typography>
                <Table className="!mb-5">
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
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            setRemoveIndex(index);
                                            setShowRemovePrompt(true);
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {expenses.length === 0 && (
                    <Typography variant="body1" className="text-gray-500 mt-4">
                        No expenses yet. Add some!
                    </Typography>
                )}
            </div>

            {/* Confirm Deletion Dialog */}
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
