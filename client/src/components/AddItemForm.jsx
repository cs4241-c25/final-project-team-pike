import { useState } from "react";
import { addGroceryItem } from "../api";

const AddItemForm = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Other");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addGroceryItem({ name, category });
        setName("");
        onAdd();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Dairy">Dairy</option>
                <option value="Produce">Produce</option>
                <option value="Meat">Meat</option>
                <option value="Pantry">Pantry</option>
                <option value="Beverages">Beverages</option>
                <option value="Other">Other</option>
            </select>
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;
