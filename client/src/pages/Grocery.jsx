import { useState } from 'react';
import './Grocery.css';

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
        <div className="container">
            <h1 className="title">Grocery Tracker</h1>

            {/* Add Grocery Form */}
            <div className="form-container">
                <input
                    className="input"
                    placeholder="Item Name"
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                />
                <input
                    className="input"
                    placeholder="Quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
                <div className="button-group">
                    <button className="button add-button" onClick={() => addItem("inventory")}>
                        Add to Inventory
                    </button>
                    <button className="button add-button" onClick={() => addItem("needed")}>
                        Add to Needed
                    </button>
                </div>
            </div>

            {/* Grocery Needed Table */}
            <h2>Grocery Needed</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {needed.map((g, index) => (
                    <tr key={index}>
                        <td>{g.item}</td>
                        <td>{g.quantity}</td>
                        <td>
                            <button className="button move-button" onClick={() => moveToInventory(index)}>
                                Move to Inventory
                            </button>
                            <button className="button remove-button" onClick={() => removeItem(index, "needed")}>
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Grocery Inventory Table */}
            <h2>Grocery Inventory</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map((g, index) => (
                    <tr key={index}>
                        <td>{g.item}</td>
                        <td>{g.quantity}</td>
                        <td>
                            <button className="button remove-button" onClick={() => removeItem(index, "inventory")}>
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}