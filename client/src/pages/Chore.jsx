import { useState, useEffect } from "react";
import { AddCircleOutline } from "@mui/icons-material";
// import Layout from "../components/Layout";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TextField, Typography, Paper } from "@mui/material";


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/woah", { credentials: "include" });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleAddChore = () => {
        setChores((prev) => ({
            ...prev,
            [newChore.category]: [...(prev[newChore.category] || []), newChore],
        }));
        setShowForm(false);
        setNewChore({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });
    };

    const updateStatus = (category, index, status) => {
        const updatedChores = { ...chores };
        updatedChores[category][index].status = status;
        setChores(updatedChores);
    };

    return (
            <div className="w-screen min-h-screen bg-white flex flex-col items-center px-4 py-8 pt-[150px]">
                {/* Main Content */}
                <div className="flex w-full max-w-5xl gap-6 text-black">
                    {/* Sidebar */}
                    <aside className="w-1/4 p-6 border-r border-white">
                        <h2 className="text-xl font-bold mb-6">Categories</h2>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`w-full py-3 px-5 text-left rounded-lg transition font-medium transform duration-200 ease-in-out 
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
                        <h2 className="text-3xl font-bold mb-6">{selectedCategory} Chores</h2>

                        {/* Inline Chore Form - Appears When "Add Chore" is Clicked */}
                        {showForm && (

                            <Paper elevation={3} className="p-6 rounded-lg mb-6">
                                <Typography variant="h5" className="font-bold text-pink-400 mb-4">
                                    Add a Chore
                                </Typography>

                                {/* Task Name Input */}
                                <TextField
                                    label="Task Name"
                                    fullWidth
                                    variant="outlined"
                                    value={newChore.name}
                                    onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                                    className="mb-3"
                                />

                                {/* Deadline Input */}
                                <TextField
                                    label="Deadline"
                                    type="datetime-local"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={newChore.deadline}
                                    onChange={(e) => setNewChore({ ...newChore, deadline: e.target.value })}
                                    className="mb-3"
                                />

                                {/* Assign To Input */}
                                <TextField
                                    label="Assign To"
                                    fullWidth
                                    variant="outlined"
                                    value={newChore.assignee}
                                    onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })}
                                    className="mb-3"
                                />
                            <FormControl fullWidth className="mb-3">
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
                                    <button
                                        className="bg-gray-300 text-red-600 px-4 py-2 rounded-lg hover:bg-gray-400 hover:scale-110 transition-all font-medium"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className= "bg-gray-300 text-white px-4 py-2 rounded-lg hover:bg-gray-400 hover:scale-110 transition-all font-medium"
                                        onClick={handleAddChore}
                                    >
                                        Save
                                    </button>
                                </div>
                            </Paper>
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
                                                className="bg-gray-100 text-green-600 px-4 py-2 rounded-lg hover:bg-gray-400 hover:scale-110 transition-all font-medium"
                                                onClick={() => updateStatus(selectedCategory, index, "Done")}
                                            >
                                                Done
                                            </button>
                                            <button
                                                className="bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-gray-400 hover:scale-110 transition-all font-medium"
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
