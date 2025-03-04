import { useState } from "react";
import { Link } from 'react-router-dom';

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
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Choremates</h1>
                <nav className="space-x-4">
                    <Link to="/" className="px-4 py-2 bg-white text-blue-600 rounded shadow">Login</Link>
                    <Link to="/chores" className="px-4 py-2 bg-white text-blue-600 rounded shadow">Chores</Link>
                    <Link to="/expense-tracker" className="px-4 py-2 bg-white text-blue-600 rounded shadow">Expenses</Link>
                    <Link to="/grocery-tracker" className="px-4 py-2 bg-white text-blue-600 rounded shadow">Groceries</Link>
                </nav>
            </header>
            <div className="flex">
                <aside className="w-1/4 bg-gray-200 p-4 space-y-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                        >
                            {category}
                        </button>
                    ))}
                </aside>
                <main className="flex-1 p-6">
                    <h2 className="text-xl font-semibold mb-4">{selectedCategory} Chores</h2>
                    <ul className="space-y-2">
                        {chores[selectedCategory].map((chore, index) => (
                            <li key={index} className="p-3 bg-white rounded shadow">
                                <strong>{chore.name}</strong> - {chore.assignee} (Due: {chore.deadline})
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow">Add Chore</button>
                </main>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add a Chore</h2>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newChore.name}
                            onChange={(e) => setNewChore({...newChore, name: e.target.value})}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="datetime-local"
                            value={newChore.deadline}
                            onChange={(e) => setNewChore({...newChore, deadline: e.target.value})}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Assign To"
                            value={newChore.assignee}
                            onChange={(e) => setNewChore({...newChore, assignee: e.target.value})}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <select
                            value={newChore.category}
                            onChange={(e) => setNewChore({...newChore, category: e.target.value})}
                            className="w-full p-2 border rounded mb-4"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <div className="flex justify-between">
                            <button onClick={handleAddChore} className="px-4 py-2 bg-blue-600 text-white rounded shadow">Save</button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded shadow">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
