import { useEffect, useState } from "react";
import { getGroceries, markAsPurchased } from "../api";

const GroceryList = () => {
    const [groceryItems, setGroceryItems] = useState([]);

    useEffect(() => {
        fetchGroceries();
    }, []);

    const fetchGroceries = async () => {
        const data = await getGroceries();
        setGroceryItems(data);
    };

    const handlePurchase = async (id) => {
        await markAsPurchased(id);
        fetchGroceries();
    };

    return (
        <div>
            <h2>Grocery List</h2>
            <ul>
                {groceryItems.map((item) => (
                    <li key={item._id}>
                        {item.name} ({item.priority})
                        {item.status === "pending" && (
                            <button onClick={() => handlePurchase(item._id)}>Purchased</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroceryList;
