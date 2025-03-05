import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar";

import './index.css'
import Login from './pages/Login'
import Chore from "./pages/Chore.jsx";
import GroceryTracker from "./pages/Grocery.jsx";
import ExpenseTracker from "./pages/Expense.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import GroupSelection from "./pages/GroupSelection.jsx";
import JoinGroup from "./pages/JoinGroup.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/join-group" element={<JoinGroup />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/group-selection" element={<GroupSelection />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/chores" element={<Chore />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/grocery-tracker" element={<GroceryTracker />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
