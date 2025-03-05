import { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSVG from "../assets/logo.svg";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: "#f8f9fa" }}>
                <Toolbar className="flex justify-between w-full max-w-6xl mx-auto px-4">
                    {/* Logo / Brand Name */}
                    <Link to="/" className="flex items-center space-x-2 hidden md:flex">
                        {/* Logo */}
                        <img src={LogoSVG} alt="Choremate Logo" className="w-8 h-8" />

                        {/* Gradient Text */}
                        <span
                            className="inline-block bg-gradient-to-r from-[#EC407A] via-orange-400 to-pink-400 bg-clip-text text-transparent text-lg font-bold"
                            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                        >
        Choremate
    </span>
                    </Link>


                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className="hidden md:flex space-x-6">
                        <Button
                            component={Link}
                            to="/profile-setup"
                            sx={{
                                color: "black",
                                backgroundColor: "transparent",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Profile
                        </Button>

                        <Button
                            component={Link}
                            to="/chores"
                            sx={{
                                color: "black",
                                backgroundColor: "transparent",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Chores
                        </Button>

                        <Button
                            component={Link}
                            to="/expense-tracker"
                            sx={{
                                color: "black",
                                backgroundColor: "transparent",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Expenses
                        </Button>

                        <Button
                            component={Link}
                            to="/grocery-tracker"
                            sx={{
                                color: "black",
                                backgroundColor: "transparent",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Groceries
                        </Button>

                        <Button
                            href="http://localhost:3000/logout"
                            sx={{
                                color: "black",
                                backgroundColor: "transparent",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button (Hidden on Desktop) */}
                    <IconButton className="md:hidden ml-auto" onClick={toggleMobileMenu} sx={{ color: "black" }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer Menu */}
            <Drawer anchor="left" open={mobileOpen} onClose={toggleMobileMenu}>
                <List className="w-60">
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button
                            component={Link}
                            to="/profile-setup"
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                color: "black",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Profile
                        </Button>
                    </ListItem>

                    <ListItem button onClick={toggleMobileMenu}>
                        <Button
                            component={Link}
                            to="/chores"
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                color: "black",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Chores
                        </Button>
                    </ListItem>

                    <ListItem button onClick={toggleMobileMenu}>
                        <Button
                            component={Link}
                            to="/expense-tracker"
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                color: "black",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Expenses
                        </Button>
                    </ListItem>

                    <ListItem button onClick={toggleMobileMenu}>
                        <Button
                            component={Link}
                            to="/grocery-tracker"
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                color: "black",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Groceries
                        </Button>
                    </ListItem>

                    <ListItem button onClick={toggleMobileMenu}>
                        <Button
                            href="http://localhost:3000/logout"
                            sx={{
                                width: "100%",
                                textAlign: "left",
                                color: "black",
                                transition: "color 0.3s ease-in-out",
                                "&:hover": { color: "#ec4899" },
                            }}
                        >
                            Logout
                        </Button>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}