import { useState } from "react";
import "./App.css";

function App() {
    const [chores, setChores] = useState({
        Cleaning: [],
        Kitchen: [],
        Trash: [],
        Others: []
    });
    const [selectedCategory, setSelectedCategory] = useState("Cleaning");
    const [showModal, setShowModal] = useState(false);
    const [newChore, setNewChore] = useState({ name: "", deadline: "", assignee: "", category: "Cleaning" });

    const categories = ["Cleaning", "Kitchen", "Trash", "Others"];

    const handleAddChore = () => {
        setChores({
            ...chores,
            [newChore.category]: [...chores[newChore.category], newChore]
        });
        setShowModal(false);
        setNewChore({ name: "", deadline: "", assignee: "", category: "Cleaning" });
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
                    <button>Messages</button>
                </nav>
            </header>
            <div className="content">
                <div className="sidebar">
                    {categories.map(category => (
                        <button key={category} onClick={() => setSelectedCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>
                <div className="chores-list">
                    <h2>{selectedCategory} Chores</h2>
                    <ul>
                        {chores[selectedCategory].map((chore, index) => (
                            <li key={index}>
                                <strong>{chore.name}</strong> - {chore.assignee} (Due: {chore.deadline})
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={() => setShowModal(true)}>Add Chore</button>
            </div>
            {showModal && (
                <div className="modal">
                    <h2>Add a Chore</h2>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newChore.name}
                        onChange={(e) => setNewChore({...newChore, name: e.target.value})}
                    />
                    <input
                        type="datetime-local"
                        value={newChore.deadline}
                        onChange={(e) => setNewChore({...newChore, deadline: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Assign To"
                        value={newChore.assignee}
                        onChange={(e) => setNewChore({...newChore, assignee: e.target.value})}
                    />
                    <select
                        value={newChore.category}
                        onChange={(e) => setNewChore({...newChore, category: e.target.value})}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <button onClick={handleAddChore}>Save</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default App;
