import { useState } from "react";
import { Button, Card, TextField, Typography, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AttachFile } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
import Navbar from "../components/Navbar.jsx"; // Import the icon


export default function ProfileSetup() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDone = () => {
        if (name && image) {
            navigate("/group-selection");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full min-h-screen bg-white text-black pt-150px">
            <Navbar/>
            <Card className="p-10 shadow-xl w-full max-w-3xl text-center rounded-3xl border border-gray-200 bg-white">
                <div className="flex justify-center items-center relative w-full">
                    <Typography variant="h5" className="font-bold !mb-8">
                        Set Up Your Profile
                    </Typography>
                </div>

                <Box className="space-y-6 w-full">
                    {/* Name Input */}
                    <TextField className={"!mb-8"}
                        label="Enter your name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* File Upload Section (Icon NEXT to text) */}
                    <div className="flex items-center justify-center border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                            <IconButton color="primary" size="small">
                                <AttachFile fontSize="small" />
                            </IconButton>
                            <Typography className="text-gray-700 text-base">Choose File</Typography>
                        </label>
                    </div>

                    {/* Profile Image Preview */}
                    {image && (
                        <img
                            src={image}
                            alt="Profile Preview"
                            className="w-40 h-40 rounded-full mx-auto border border-gray-300 shadow-md"
                        />
                    )}

                    {/* Done Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDone}
                        disabled={!name || !image}
                        className="py-3 text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Done
                    </Button>
                </Box>
            </Card>
        </div>
    );
}
