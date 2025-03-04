import { useState } from 'react';

export default function GroceryTracker() {
    const [inventory, setInventory] = useState([]);
    const [needed, setNeeded] = useState([]);
    const [form, setForm] = useState({ item: '', quantity: '' });

    const addItem = (listType) => {
        if (form.item && form.quantity) {
            const newItem = { item: form.item, quantity: parseInt(form.quantity) };
            if (listType === "inventory") {
                setInventory([...inventory, newItem]);
            } else {
                setNeeded([...needed, newItem]);
            }
            setForm({ item: '', quantity: '' });
        }
    };

    const moveToInventory = (index) => {
        const item = needed[index];
        setNeeded(needed.filter((_, i) => i !== index));
        setInventory([...inventory, item]);
    };

    const removeItem = (index, listType) => {
        if (listType === "inventory") {
            setInventory(inventory.filter((_, i) => i !== index));
        } else {
            setNeeded(needed.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Grocery Tracker</h1>

            {/* Add Grocery Form */}
            <div className="bg-white shadow-md p-6 rounded-lg mb-6 max-w-lg mx-auto">
                <input
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Item Name"
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                />
                <input
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
                <div className="flex space-x-2">
                    <button className="w-1/2 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => addItem("inventory")}>
                        Add to Inventory
                    </button>
                    <button className="w-1/2 px-4 py-2 bg-green-600 text-white rounded" onClick={() => addItem("needed")}>
                        Add to Needed
                    </button>
                </div>
            </div>

            {/* Grocery Needed Table */}
            <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-2">Grocery Needed</h2>
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">Item</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {needed.map((g, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-3">{g.item}</td>
                            <td className="p-3">{g.quantity}</td>
                            <td className="p-3 flex space-x-2">
                                <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => moveToInventory(index)}>
                                    Move to Inventory
                                </button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => removeItem(index, "needed")}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Grocery Inventory Table */}
            <div className="max-w-2xl mx-auto mt-6">
                <h2 className="text-xl font-semibold mb-2">Grocery Inventory</h2>
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3 text-left">Item</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inventory.map((g, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-3">{g.item}</td>
                            <td className="p-3">{g.quantity}</td>
                            <td className="p-3">
                                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => removeItem(index, "inventory")}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
