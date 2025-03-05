import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

export default function Navbar() {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: "#f8f9fa" }}>
            <Toolbar className="flex justify-center">
                <div className="flex space-x-4">
                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "transparent", // Ensures no default background
                            border: "none",
                            outline: "none",
                            transition: "color 0.3s ease-in-out",
                            "&:hover": { color: "#ec4899", backgroundColor: "transparent" }, // Prevents grey hover effect
                            "&:focus": { outline: "none", border: "none", backgroundColor: "transparent" }
                        }}
                        component={Link}
                        to="/profile-setup"
                    >
                        Profile
                    </Button>

                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            transition: "color 0.3s ease-in-out",
                            "&:hover": { color: "#ec4899", backgroundColor: "transparent" },
                            "&:focus": { outline: "none", border: "none", backgroundColor: "transparent" }
                        }}
                        component={Link}
                        to="/chores"
                    >
                        Chores
                    </Button>

                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            transition: "color 0.3s ease-in-out",
                            "&:hover": { color: "#ec4899", backgroundColor: "transparent" },
                            "&:focus": { outline: "none", border: "none", backgroundColor: "transparent" }
                        }}
                        component={Link}
                        to="/expense-tracker"
                    >
                        Expenses
                    </Button>

                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            transition: "color 0.3s ease-in-out",
                            "&:hover": { color: "#ec4899", backgroundColor: "transparent" },
                            "&:focus": { outline: "none", border: "none", backgroundColor: "transparent" }
                        }}
                        component={Link}
                        to="/grocery-tracker"
                    >
                        Groceries
                    </Button>

                    <Button
                        sx={{
                            color: "black",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            transition: "color 0.3s ease-in-out",
                            "&:hover": { color: "#ec4899", backgroundColor: "transparent" },
                            "&:focus": { outline: "none", border: "none", backgroundColor: "transparent" }
                        }}
                        href="http://localhost:3000/logout"
                    >
                        Logout
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}
