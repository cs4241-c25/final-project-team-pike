import { createContext, useContext, useState } from "react";

// Create a Context
const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: "",
        initials: "",
    });

    // Function to update user info
    const updateUser = (name) => {
        const nameParts = name.split(" ");
        const initials = nameParts.length > 1
            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
            : nameParts[0][0].toUpperCase();

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
