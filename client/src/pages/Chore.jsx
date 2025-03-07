import { useState, useEffect } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";

export default function TaskApp() {
    const [tasks, setTasks] = useState({});
    const [categories] = useState(["Cleaning", "Kitchen", "Trash", "Others"]);
    const [selectedCategory, setSelectedCategory] = useState("Cleaning");
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({
        name: "",
        deadline: "",
        assignee: "",
        category: "Cleaning",
        status: "Not Completed",
    });
    const [users, setUsers] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [loading, setLoading] = useState(true);  // Add loading state

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://localhost:3000/api/org/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const usersData = await response.json();
                console.log("Fetched users:", usersData);  // Debugging line
                setUsers(usersData);  // Assuming usersData is an array of user objects
            } catch (error) {
                console.error(error);
                alert("Error fetching users");
            } finally {
                setLoading(false);  // Set loading to false after fetching
            }
        };

        const fetchTaskTypes = async () => {
            try {
                const response = await fetch("https://localhost:3000/api/org/tasktypes");
                if (!response.ok) {
                    throw new Error("Failed to fetch task types");
                }
                const taskTypesData = await response.json();
                setTaskTypes(taskTypesData);  // Assuming taskTypesData is an array of task type objects
            } catch (error) {
                console.error(error);
                alert("Error fetching task types");
            }
        };

        fetchUsers();
        fetchTaskTypes();
    }, []);

    const handleAddTask = async () => {
        const validCategories = ["CLEANING", "KITCHEN", "TRASH", "OTHERS"];
        const newTaskData = {
            title: newTask.name,
            assignee: newTask.assignee,
            type: validCategories.includes(newTask.category.toUpperCase()) ? newTask.category.toUpperCase() : "OTHERS",
            schedule: newTask.deadline,
        };

        try {
            const response = await fetch("http://localhost:3000/api/tasks/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTaskData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server responded with error:", errorData);
                throw new Error(errorData.error || "An error occurred while adding the task");
            }

            setTasks((prev) => ({
                ...prev,
                [newTask.category]: [...(prev[newTask.category] || []), newTask],
            }));

            setShowForm(false);
            setNewTask({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });
        } catch (error) {
            console.error("Fetch request failed:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="w-screen min-h-screen bg-white flex flex-col items-center justify-start pt-[150px]">
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
                                    ${selectedCategory === category ? "bg-pink-500 text-white scale-105" : "bg-gray-300 text-black hover:bg-pink-400 hover:text-white hover:scale-105"}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <button
                        className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-5 bg-pink-400 text-white rounded-lg transition hover:bg-pink-500 font-medium"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <AddCircleOutline /> Add Task
                    </button>
                </aside>

                {/* Tasks List */}
                <section className="w-3/4 p-6">
                    <h2 className="text-3xl font-bold mb-6 text-black">{selectedCategory} Tasks</h2>

                    {/* Inline Task Form */}
                    {showForm && (
                        <div className="text-black bg-white p-6 rounded-lg shadow-md border mb-6">
                            <h2 className="text-2xl font-bold mb-4 text-pink-400">Add a Task</h2>

                            <TextField
                                label="Task Name"
                                variant="outlined"
                                fullWidth
                                value={newTask.name}
                                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                className="!mb-5"
                            />

                            <TextField
                                label="Deadline"
                                type="datetime-local"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={newTask.deadline}
                                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                className="!mb-5"
                            />

                            {/* Assign To Dropdown */}
                            <FormControl fullWidth variant="outlined" className="!mb-5">
                                <InputLabel>Assign To</InputLabel>
                                <Select
                                    value={newTask.assignee}
                                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                                    label="Assign To"
                                >
                                    {loading ? (
                                        <MenuItem disabled>Loading...</MenuItem>
                                    ) : (
                                        users.map((user) => (
                                            <MenuItem key={user.github} value={user.github}>
                                                {user.realName}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            {/* Task Category Dropdown */}
                            <FormControl fullWidth variant="outlined" className="!mb-5">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                    label="Category"
                                >
                                    {taskTypes.map((taskType) => (
                                        <MenuItem key={taskType.id} value={taskType.name}>
                                            {taskType.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <div className="flex justify-end gap-3">
                                <Button variant="outlined" color="error" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleAddTask}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* List of Tasks */}
                    {tasks[selectedCategory]?.length > 0 ? (
                        <div className="space-y-4">
                            {tasks[selectedCategory].map((task, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-5 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition"
                                >
                                    <div>
                                        <p className="font-bold text-lg text-black">{task.name}</p>
                                        <p className="text-sm text-gray-500">Assigned to: {task.assignee}</p>
                                        <p className="text-sm text-gray-500">Due: {task.deadline}</p>
                                        <p
                                            className={`text-sm font-bold ${task.status === "Completed" ? "text-green-600" : "text-red-600"}`}
                                        >
                                            Status: {task.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No tasks yet. Add one!</p>
                    )}
                </section>
            </div>
        </div>
    );
}
