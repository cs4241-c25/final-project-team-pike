import { useState, useEffect, useCallback } from "react";
import { Typography, Button, TextField, Switch, FormControlLabel, Box } from "@mui/material";
import Navbar from "../components/Navbar";

export default function GroceryTracker() {
    const [inventory, setInventory] = useState([]);
    const [needed, setNeeded] = useState([]);
    const [form, setForm] = useState({ item: "", quantity: "" });
    const [isNeededView, setIsNeededView] = useState(true);

    // ✅ Fetch groceries from backend (Runs on mount & when an item is added/removed)
    const fetchGroceries = useCallback(() => {
        fetch("/api/groceries", { headers: { "x-username": "exampleUser" } })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched groceries:", data);
                setInventory(data.filter((item) => item.listType === "inventory"));
                setNeeded(data.filter((item) => item.listType === "needed"));
            })
            .catch((error) => console.error("Error fetching groceries:", error));
    }, []);

    useEffect(() => {
        fetchGroceries();
    }, [fetchGroceries]);

    // ✅ Add a grocery item
    const addItem = () => {
        if (!form.item || !form.quantity) return;

        const newItem = {
            name: form.item,
            description: "",
            quantity: parseInt(form.quantity),
            location: "",
            notes: "",
            listType: isNeededView ? "needed" : "inventory",
        };

        fetch("/api/groceries", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-username": "exampleUser" },
            body: JSON.stringify(newItem),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Added item:", data);
                fetchGroceries(); // ✅ Refresh list after adding an item
                setForm({ item: "", quantity: "" }); // Reset form
            })
            .catch((error) => console.error("Error adding item:", error));
    };

    // ✅ Move an item from "Needed" to "Inventory"
    const moveToInventory = (id) => {
        fetch(`/api/groceries/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-username": "exampleUser" },
            body: JSON.stringify({ listType: "inventory" }),
        })
            .then((response) => response.json())
            .then((updatedItem) => {
                console.log("Moved item to inventory:", updatedItem);
                fetchGroceries(); // ✅ Refresh list after moving an item
            })
            .catch((error) => console.error("Error moving item:", error));
    };

    // ✅ Delete a grocery item
    const removeItem = (id) => {
        fetch(`/api/groceries/${id}`, { method: "DELETE", headers: { "x-username": "exampleUser" } })
            .then(() => {
                console.log("Deleted item ID:", id);
                fetchGroceries(); // ✅ Refresh list after deletion
            })
            .catch((error) => console.error("Error deleting item:", error));
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            <Navbar/>
            <h1 className="text-3xl font-bold !mb-20 pt-[150px]">Grocery Tracker 🛒</h1>

            {/* ✅ Toggle Switch */}
            <Box className="mb-6">
                <FormControlLabel
                    control={
                        <Switch
                            checked={isNeededView}
                            onChange={() => setIsNeededView(!isNeededView)}
                            color="primary"
                        />
                    }
                    label={isNeededView ? "Viewing Needed Items" : "Viewing Inventory"}
                />
            </Box>

            {/* ✅ Grocery Input Form */}
            <Box className="p-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h6" className="font-semibold !mb-7 justify-left">Add a Grocery Item</Typography>
                <TextField
                    label="Item Name"
                    fullWidth
                    value={form.item}
                    onChange={(e) => setForm({...form, item: e.target.value})}
                    className="!mb-6"
                />
                <TextField
                    label="Quantity"
                    fullWidth
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    className="!mb-6"
                />
                <Button
                    variant="contained"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg w-full transition"
                    onClick={addItem}
                >
                    {isNeededView ? "Add to Needed" : "Add to Inventory"}
                </Button>
            </Box>

            {/* ✅ Grocery List */}
            <Box className="p-6 mt-6 w-full max-w-3xl border border-gray-300 rounded-lg">
                <Typography variant="h5" className="font-semibold mb-4">
                    {isNeededView ? "Grocery Needed" : "Grocery Inventory"}
                </Typography>
                {(isNeededView ? needed : inventory).length === 0 ? (
                    <Typography variant="body1" className="text-gray-500">No items yet. Add some!</Typography>
                ) : (
                    (isNeededView ? needed : inventory).map((item) => (
                        <Box key={item.id} className="flex justify-between items-center p-2 border-b">
                            <Typography variant="body1">{item.name} - {item.quantity}</Typography>
                            <Box className="flex space-x-2">
                                {/* ✅ Move button (only for "Needed") */}
                                {isNeededView && (
                                    <Button
                                        variant="contained"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                                        onClick={() => moveToInventory(item.id)}
                                    >
                                        Move to Inventory
                                    </Button>
                                )}
                                {/* ✅ Delete button */}
                                <Button
                                    variant="contained"
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </div>
    );
}
