import { useState } from "react";
import { Button, Card, TextField, Avatar, Box, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProfileSVG from "../assets/profile.svg";
import { useUser } from "../context/UserContext.jsx"; // Import the context

const BACKEND = "http://localhost:3000";

export default function ProfileSetup() {
    const [name, setName] = useState("");
    const { updateUser } = useUser(); // Get update function from context
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleDone = () => {
        if (name) {
            fetch(BACKEND + "/api/user/create", {
                method: "POST",
                body: JSON.stringify({ realName: name }),
                credentials: "include"
            }).then((res) => {
                if (res.status === 200) {
                    updateUser(name); // ✅ Store initials globally
                    navigate("/group-selection");
                } else {
                    setOpen(true);
                }
            });
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
                    <Box className="space-y-6 w-full">
                        {/* Avatar + Name Input Row (Same Line) */}
                        <Box className="flex items-center space-x-4 w-full">
                            {/* Circular Avatar with Initials (Stored Globally) */}
                            <Avatar sx={{ bgcolor: "#ec4899", color: "white", fontWeight: "bold", width: 48, height: 48 }}>
                                {name
                                    ? name.split(" ").map((word) => word[0].toUpperCase()).join("").slice(0, 2)
                                    : ""}
                            </Avatar>


                            {/* Name Input */}
                            <TextField
                                className="flex-grow"
                                label="Enter your name"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Box>

                        {/* Done Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleDone}
                            disabled={!name}
                            className="py-3 text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                        >
                            Done
                        </Button>
                    </Box>
                </Card>
            </div>
        </div>
    );
}
