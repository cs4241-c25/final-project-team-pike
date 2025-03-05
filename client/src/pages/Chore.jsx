// src/pages/Chore.jsx
import { useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Chore() {
    const [chores, setChores] = useState({});
    const [categories] = useState(["Cleaning", "Kitchen", "Trash", "Others"]);
    const [selectedCategory, setSelectedCategory] = useState("Cleaning");
    const [showModal, setShowModal] = useState(false);
    const [newChore, setNewChore] = useState({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });

    const handleAddChore = () => {
        setChores(prev => ({
            ...prev,
            [newChore.category]: [...(prev[newChore.category] || []), newChore]
        }));
        setShowModal(false);
        setNewChore({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });
    };

    return (
        <div className="bg-gray-100 min-h-screen pt-20 p-6">
            <Navbar />
            <div className="flex gap-6">
                <Card className="w-1/4 p-4 shadow-md">
                    <Typography variant="h6">Categories</Typography>
                    {categories.map(category => (
                        <Button key={category} fullWidth variant={selectedCategory === category ? "contained" : "outlined"} className="my-2" onClick={() => setSelectedCategory(category)}>
                            {category}
                        </Button>
                    ))}
                    <Button className="mt-4" variant="contained" color="secondary" startIcon={<AddCircleOutline />} onClick={() => setShowModal(true)}>
                        Add Chore
                    </Button>
                </Card>
                <Card className="flex-grow p-4 shadow-md">
                    <Typography variant="h6" className="mb-3">{selectedCategory} Chores</Typography>
                    {chores[selectedCategory]?.map((chore, index) => (
                        <Card key={index} className="mb-2 flex justify-between items-center p-4 bg-gray-50 shadow-sm">
                            <div>
                                <Typography variant="subtitle1" className="font-semibold">{chore.name}</Typography>
                                <Typography variant="body2" className="text-gray-500">{chore.assignee} - Due: {chore.deadline}</Typography>
                            </div>
                            <Button variant="outlined" color={chore.status === "Done" ? "success" : "error"}>{chore.status}</Button>
                        </Card>
                    ))}
                </Card>
            </div>
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogTitle>Add a Chore</DialogTitle>
                <DialogContent className="flex flex-col gap-3">
                    <TextField label="Task Name" value={newChore.name} onChange={(e) => setNewChore({ ...newChore, name: e.target.value })} fullWidth />
                    <TextField label="Deadline" type="datetime-local" value={newChore.deadline} onChange={(e) => setNewChore({ ...newChore, deadline: e.target.value })} fullWidth />
                    <TextField label="Assign To" value={newChore.assignee} onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })} fullWidth />
                    <Select value={newChore.category} onChange={(e) => setNewChore({ ...newChore, category: e.target.value })} fullWidth>
                        {categories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)} color="error">Cancel</Button>
                    <Button onClick={handleAddChore} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
