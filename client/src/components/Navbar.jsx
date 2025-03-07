import { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, Avatar, Menu, MenuItem, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSVG from "../assets/logo.svg";
import { useUser } from "../context/UserContext"; // Import user context

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useUser(); // Get user data (name, initials)

    // Open/close mobile menu
    const toggleMobileMenu = () => {
        setMobileOpen(!mobileOpen);
    };

    // Open/close Avatar dropdown menu
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const generateUserCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: "#f8f9fa" }}>
                <Toolbar className="flex justify-between items-center w-full max-w-6xl mx-auto px-4">
                    {/* Left Side - Logo & Brand Name */}
                    <Box className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={LogoSVG} alt="Choremate Logo" className="w-8 h-8" />
                            <span
                                className="inline-block bg-gradient-to-r from-[#EC407A] via-orange-400 to-pink-400 bg-clip-text text-transparent text-lg font-bold"
                                style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                            >
                                Choremate
                            </span>
                        </Link>
                    </Box>

                    {/* Center - Navigation Links */}
                    <Box className="hidden md:flex space-x-6 mx-auto">
                        <Button component={Link} to="/profile-setup" sx={{ color: "black", "&:hover": { color: "#ec4899" } }}>Profile</Button>
                        <Button component={Link} to="/chores" sx={{ color: "black", "&:hover": { color: "#ec4899" } }}>Chores</Button>
                        <Button component={Link} to="/expense-tracker" sx={{ color: "black", "&:hover": { color: "#ec4899" } }}>Expenses</Button>
                        <Button component={Link} to="/grocery-tracker" sx={{ color: "black", "&:hover": { color: "#ec4899" } }}>Groceries</Button>
                        <Button href="http://localhost:3000/logout" sx={{ color: "black", "&:hover": { color: "#ec4899" } }}>Logout</Button>
                    </Box>

                    {/* Right Side - Avatar */}
                    <Box className="flex items-center space-x-4">
                        {/* Avatar (Clickable with Dropdown) */}
                        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: "#ec4899", color: "white", fontWeight: "bold" }}>
                                {user.initials || "?"}
                            </Avatar>
                        </IconButton>
                        {/* Dropdown Menu */}
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem disabled>{user.name || "User"}</MenuItem>
                            <MenuItem disabled>Code: {generateUserCode()}</MenuItem>
                        </Menu>

                        {/* Mobile Menu Button */}
                        <IconButton className="md:hidden" onClick={toggleMobileMenu} sx={{ color: "black" }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer Menu */}
            <Drawer anchor="left" open={mobileOpen} onClose={toggleMobileMenu}>
                <List className="w-60">
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button component={Link} to="/profile-setup" sx={{ width: "100%", textAlign: "left", color: "black", "&:hover": { color: "#ec4899" } }}>Profile</Button>
                    </ListItem>
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button component={Link} to="/chores" sx={{ width: "100%", textAlign: "left", color: "black", "&:hover": { color: "#ec4899" } }}>Chores</Button>
                    </ListItem>
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button component={Link} to="/expense-tracker" sx={{ width: "100%", textAlign: "left", color: "black", "&:hover": { color: "#ec4899" } }}>Expenses</Button>
                    </ListItem>
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button component={Link} to="/grocery-tracker" sx={{ width: "100%", textAlign: "left", color: "black", "&:hover": { color: "#ec4899" } }}>Groceries</Button>
                    </ListItem>
                    <ListItem button onClick={toggleMobileMenu}>
                        <Button href="http://localhost:3000/logout" sx={{ width: "100%", textAlign: "left", color: "black", "&:hover": { color: "#ec4899" } }}>Logout</Button>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}
