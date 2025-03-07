import { createContext, useContext, useState } from "react";

// Create a Context
const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: "",
        initials: "",
    });

    // ✅ Accept both `name` & `initials` (Instead of computing initials inside)
    const updateUser = ({ name, initials }) => {
        setUser({ name, initials });
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use user context
export function useUser() {
    return useContext(UserContext);
}
