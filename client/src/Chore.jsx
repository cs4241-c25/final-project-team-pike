import { useState } from "react";
import "./Chore.css";

function App() {
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

    const updateStatus = (category, index, status) => {
        const updatedChores = { ...chores };
        updatedChores[category][index].status = status;
        setChores(updatedChores);
    };

    return (
        <div className="app">
            <header className="header">
                <h1 className="header-title">Choremates</h1>
                <nav className="nav-links">
                    <button>Dashboard</button>
                    <button>Expenses</button>
                    <button>Chores</button>
                    <button>Groceries</button>
                </nav>
            </header>

            <div className="main-container">
                {/* Left Section: Sidebar */}
                <div className="left-section">
                    <h2>Categories</h2>
                    <div className="sidebar">
                        {categories.map(category => (
                            <button key={category} onClick={() => setSelectedCategory(category)}>
                                {category}
                            </button>
                        ))}
                    </div>
                    <button className="add-chore-btn" onClick={() => setShowModal(true)}>Add Chore</button>
                </div>

                {/* Right Section: Chores List */}
                <div className="right-section">
                    <h2>{selectedCategory} Chores</h2>
                    <div className="chores-list">
                        {(chores[selectedCategory] || []).map((chore, index) => (
                            <div key={index} className="chore-item">
                                <div>
                                    <strong>{chore.name}</strong> - {chore.assignee} <br />
                                    <small>Due: {chore.deadline}</small> <br />
                                    <small>Status: <span className={chore.status === "Done" ? "status-text-done" : "status-text-not-done"}>{chore.status}</span></small>
                                </div>
                                <div className="status-buttons">
                                    <button
                                        className="status-done"
                                        onClick={() => updateStatus(selectedCategory, index, "Done")}
                                    >
                                        Done
                                    </button>
                                    <button
                                        className="status-not-done"
                                        onClick={() => updateStatus(selectedCategory, index, "Not Completed")}
                                    >
                                        Not Completed
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for Adding Chores */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add a Chore</h2>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newChore.name}
                            onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            value={newChore.deadline}
                            onChange={(e) => setNewChore({ ...newChore, deadline: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Assign To"
                            value={newChore.assignee}
                            onChange={(e) => setNewChore({ ...newChore, assignee: e.target.value })}
                        />
                        <select
                            value={newChore.category}
                            onChange={(e) => setNewChore({ ...newChore, category: e.target.value })}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={handleAddChore}>Save</button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
