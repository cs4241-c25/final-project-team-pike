import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"

import './index.css'
import Login from './Login.jsx'
import Chore from './Chore.jsx'
import GroceryTracker from './Grocery.jsx'
import ExpenseTracker from './Expense.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path="/chores" element={<Chore />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/grocery-tracker" element={<GroceryTracker />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
