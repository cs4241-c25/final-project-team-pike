import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AddCircleOutline } from "@mui/icons-material";

export default function ChoreApp() {
    const [chores, setChores] = useState({});
    const [categories] = useState(["Cleaning", "Kitchen", "Trash", "Others"]);
    const [selectedCategory, setSelectedCategory] = useState("Cleaning");
    const [showModal, setShowModal] = useState(false);
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
        setChores(prev => ({
            ...prev,
            [newChore.category]: [...(prev[newChore.category] || []), newChore],
        }));
        setShowModal(false);
        setNewChore({ name: "", deadline: "", assignee: "", category: "Cleaning", status: "Not Completed" });
    };

    const updateStatus = (category, index, status) => {
        const updatedChores = { ...chores };
        updatedChores[category][index].status = status;
        setChores(updatedChores);
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            {/* Main Content */}
            <div className="flex w-full max-w-5xl gap-6">
                {/* Sidebar */}
                <aside className="w-1/4 p-6 border-r border-gray-300">
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
                        onClick={() => setShowModal(true)}
                    >
                        <AddCircleOutline /> Add Chore
                    </button>
                </aside>

                {/* Chores List */}
                <section className="w-3/4 p-6">
                    <h2 className="text-3xl font-bold mb-6">{selectedCategory} Chores</h2>

                    {chores[selectedCategory]?.length > 0 ? (
                        <div className="space-y-4">
                            {chores[selectedCategory].map((chore, index) => {
                                // ✅ Track button click state
                                const [clicked, setClicked] = useState(false);

                                return (
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

                                        {/* ✅ Buttons with Dynamic Click Effect */}
                                        <div className="flex gap-3">
                                            <button
                                                className={`px-4 py-2 rounded-lg transition font-medium 
                                        ${clicked ? "bg-pink-500 text-white" : "bg-pink-400 text-white hover:bg-pink-500"}`}
                                                onClick={() => {
                                                    updateStatus(selectedCategory, index, "Done");
                                                    setClicked(true);
                                                    setTimeout(() => setClicked(false), 300); // Reset after animation
                                                }}
                                            >
                                                Done
                                            </button>

                                            <button
                                                className={`px-4 py-2 rounded-lg transition font-medium 
                                        ${clicked ? "bg-pink-500 text-white" : "bg-gray-300 text-white hover:bg-gray-400"}`}
                                                onClick={() => {
                                                    updateStatus(selectedCategory, index, "Not Completed");
                                                    setClicked(true);
                                                    setTimeout(() => setClicked(false), 300);
                                                }}
                                            >
                                                Not Completed
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No chores yet. Add one!</p>
                    )}


                </section>
            </div>

            {/* Modal for Adding Chores */}
            {showModal && (
                <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-pink-400">Add a Chore</h2>

                        <input
                            type="text"
                            placeholder="Task Expense Tracker 💰"
                            value={newChore.name}
                            onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                            className="w-full mb-4 p-3 border rounded-lg bg-gray-100"
                        />

                        <input
                            type="datetime-local"
                            value={newChore.deadline}
                            onChange={(e) => setNewChore({ ...newChore, deadline: e.target.value })}
                            className="w-full mb-4 p-3 border rounded-lg bg-gray-100"
                        />

                        <input
                            type="text"
                            placeholder="Assign To"
                            value={newChore.assignee}
                            onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })}
                            className="w-full mb-4 p-3 border rounded-lg bg-gray-100"
                        />

                        <select
                            value={newChore.category}
                            onChange={(e) => setNewChore({ ...newChore, category: e.target.value })}
                            className="w-full mb-4 p-3 border rounded-lg bg-gray-100"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition font-medium"
                                onClick={handleAddChore}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
