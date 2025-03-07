import { useState, useEffect } from "react";
import { Typography, Button, TextField, Box } from "@mui/material";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:3000/api/groceries";

export default function GroceryTracker() {
    const [groceries, setGroceries] = useState([]);
    const [form, setForm] = useState({ item: "", quantity: "" });

    // Fetch groceries from the backend
    useEffect(() => {
        const fetchGroceries = async () => {
            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch groceries");
                const data = await response.json();
                setGroceries(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroceries();
    }, []);

    // Add a grocery item
    const addItem = async () => {
        if (!form.item || !form.quantity) return;

        const newItem = {
            name: form.item,
            quantity: parseInt(form.quantity, 10), // Ensure quantity is a number
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newItem),
            });
            if (!response.ok) throw new Error("Failed to add item");
            const addedItem = await response.json();
            setGroceries([...groceries, addedItem]);
            setForm({ item: "", quantity: "" });
        } catch (error) {
            console.error(error);
        }
    };

    // Delete a grocery item
    const removeItem = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete item");
            setGroceries(groceries.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            <Navbar />
            <h1 className="text-3xl font-bold mb-20">Grocery Tracker 🛒</h1>

            {/* Grocery Input Form */}
            <Box className="p-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h6" className="font-semibold mb-7">Add a Grocery Item</Typography>
                <TextField
                    label="Item Name"
                    fullWidth
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                    className="mb-6"
                />
                <TextField
                    label="Quantity"
                    fullWidth
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="mb-6"
                />
                <Button
                    variant="contained"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full transition"
                    onClick={addItem}
                >
                    Add to Grocery List
                </Button>
            </Box>

            {/* Grocery List */}
            <Box className="p-6 mt-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h5" className="font-semibold mb-4">Grocery List</Typography>
                {groceries.length === 0 ? (
                    <Typography variant="body1" className="text-gray-500">No items yet. Add some!</Typography>
                ) : (
                    groceries.map((item) => (
                        <Box key={item.id} className="flex justify-between items-center p-2 border-b">
                            <Typography variant="body1">{item.name} - {item.quantity}</Typography>
                            <Button
                                variant="contained"
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                                onClick={() => removeItem(item.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    ))
                )}
            </Box>
        </div>
    );
}
