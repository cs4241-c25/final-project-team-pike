import { useState } from "react";
import { Button, Card, TextField, Typography, Avatar, Box, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProfileSVG from "../assets/profile.svg";

const BACKEND = "http://localhost:3000";

export default function ProfileSetup() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleDone = () => {
        if (name.trim()) {
            fetch(BACKEND + "/api/user/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
                credentials: "include"
            }).then((res) => {
                if (res.status === 200) {
                    navigate("/group-selection");
                } else if (res.status === 400) {
                    navigate("/home");
                } else if (res.status === 401) {
                    navigate("/"); // Redirect to login
                } else {
                    console.log(res.body);
                    setOpen(true);
                }
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "NumpadEnter") {
            e.preventDefault();
            handleDone();
        }
    };



    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            <Navbar />
            <h1 className="pt-[150px] text-xl font-bold mb-6">Set up your profile</h1>
            <img src={ProfileSVG} alt="Profile Setup Illustration" className="mb-8 w-100 h-100" />

            <div className="w-full flex justify-center">
                <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                    <Alert severity="error" onClose={() => setOpen(false)}>
                        Server Error
                    </Alert>
                </Snackbar>

                <Card className="p-10 shadow-xl w-full max-w-3xl text-center rounded-3xl border border-gray-200 bg-white">
                    <Box className="flex items-center space-x-4 w-full mb-6">
                        {/* Avatar Icon */}
                        <Avatar sx={{ bgcolor: "#ec4899", color: "white", fontWeight: "bold", width: 56, height: 56 }}>
                            {name.trim()
                                ? name
                                    .split(" ")
                                    .filter((word) => word.length > 0)
                                    .map((word) => word[0].toUpperCase())
                                    .slice(0, 2)
                                    .join("")
                                : ""}
                        </Avatar>

                        {/* Name Input Field */}
                        <TextField
                            className="flex-1"
                            label="Enter your name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown} // 🔥 Supports Enter Key
                        />
                    </Box>

                    {/* Done Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDone}
                        disabled={!name.trim()}
                        className="py-3 text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Done
                    </Button>
                </Card>
            </div>
        </div>
    );
}
