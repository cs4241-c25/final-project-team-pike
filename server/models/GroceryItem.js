import mongoose from "mongoose";

const GroceryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addedBy: { type: String, required: true },
    assignedTo: { type: String },
    status: { type: String, enum: ["pending", "purchased"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, enum: ["Dairy", "Produce", "Meat", "Pantry", "Beverages", "Other"], required: true },
    recurrence: { type: String, enum: ["weekly", "monthly"], default: null },
    createdAt: { type: Date, default: Date.now },
    purchasedAt: { type: Date },
});

export default mongoose.model("GroceryItem", GroceryItemSchema);
