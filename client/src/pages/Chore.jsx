import { useState, useEffect } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function ChoreApp() {
    const [chores, setChores] = useState({});
    const [categories] = useState(["Cleaning", "Kitchen", "Trash", "Others"]);
    const [selectedCategory, setSelectedCategory] = useState("Cleaning");
    const [showForm, setShowForm] = useState(false);
    const [newChore, setNewChore] = useState({
        name: "",
        deadline: "",
        assignee: "",
        category: "Cleaning",
        status: "Not Completed",
    });

    const handleAddChore = async () => {
        const newChoreData = {
            title: newChore.name,
            assignee: newChore.assignee,
            status: newChore.status,
            type: newChore.category,
            schedule: newChore.deadline,
        };

        try {
            const response = await fetch("http://localhost:3000/api/tasks/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newChoreData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setChores((prev) => ({
                    ...prev,
                    [newChore.category]: [...(prev[newChore.category] || []), newChore],
                }));
                setShowForm(false);
                setNewChore({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });
            } else {
                alert(`Error: ${data.error || "An error occurred while adding the chore"}`);
            }
        } catch (error) {
            console.error("Error while adding chore:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="w-screen min-h-screen bg-white flex flex-col items-center justify-start pt-[150px]">
            {/* Main Content */}
            <div className="flex w-full max-w-5xl gap-6">
                {/* Sidebar */}
                <aside className="w-1/4 p-6 border-r border-gray-300">
                    <h2 className="text-xl font-bold mb-6 !text-black">Categories</h2>
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full py-3 px-5 text-left text-black rounded-lg transition font-medium transform duration-200 ease-in-out 
                                        ${
                                    selectedCategory === category
                                        ? "bg-pink-500 text-white scale-105"
                                        : "bg-gray-300 text-white hover:bg-pink-400 hover:text-white hover:scale-105"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <button
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-5 bg-pink-400 text-white rounded-lg transition hover:bg-pink-500 font-medium"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <AddCircleOutline /> Add Chore
                    </button>
                </aside>

                {/* Chores List */}
                <section className="w-3/4 p-6">
                    <h2 className="text-3xl font-bold mb-6 text-black">{selectedCategory} Chores</h2>

                    {/* Inline Chore Form - Appears When "Add Chore" is Clicked */}
                    {showForm && (
                        <div className="text-black bg-white p-6 rounded-lg shadow-md border mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-pink-400">Add a Chore</h2>

                            {/* MUI TextField for Task Name */}
                            <TextField
                                label="Task Name"
                                variant="outlined"
                                fullWidth
                                value={newChore.name}
                                onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                                className="!mb-5"
                            />

                            {/* MUI TextField for Deadline */}
                            <TextField
                                label="Deadline"
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={newChore.deadline}
                                onChange={(e) => setNewChore({ ...newChore, deadline: e.target.value })}
                                className="!mb-5"
                            />

                            {/* MUI TextField for Assignee */}
                            <TextField
                                label="Assign To"
                                variant="outlined"
                                fullWidth
                                value={newChore.assignee}
                                onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })}
                                className="!mb-5"
                            />

                            {/* MUI Select for Categories */}
                            <FormControl fullWidth variant="outlined" className="!mb-5">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newChore.category}
                                    onChange={(e) => setNewChore({ ...newChore, category: e.target.value })}
                                    label="Category"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outlined"
                                    color="!red"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddChore}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* List of Chores */}
                    {chores[selectedCategory]?.length > 0 ? (
                        <div className="space-y-4">
                            {chores[selectedCategory].map((chore, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-5 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition"
                                >
                                    <div>
                                        <p className="font-bold text-lg text-black">{chore.name}</p>
                                        <p className="text-sm text-gray-500">Assigned to: {chore.assignee}</p>
                                        <p className="text-sm text-gray-500">Due: {chore.deadline}</p>
                                        <p
                                            className={`text-sm font-bold ${
                                                chore.status === "Done" ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            Status: {chore.status}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-pink-400 text-white hover:bg-pink-500 transition font-medium"
                                            onClick={() => updateStatus(selectedCategory, index, "Done")}
                                        >
                                            Done
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-gray-300 text-white hover:bg-gray-400 transition font-medium"
                                            onClick={() => updateStatus(selectedCategory, index, "Not Completed")}
                                        >
                                            Not Completed
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No chores yet. Add one!</p>
                    )}
                </section>
            </div>
        </div>
    );
}