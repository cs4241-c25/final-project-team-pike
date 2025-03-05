import { useState } from "react";
import { Button, Card, TextField, Typography, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AttachFile } from "@mui/icons-material";
import Navbar from "../components/Navbar.jsx";
import ProfileSVG from "../assets/profile.svg";

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
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            {/* Navbar */}
            <Navbar/>
            <h1 className="pt-[150px] text-xl font-bold mb-6">Set up your profile</h1>
            <img src={ProfileSVG} alt="Profile Setup Illustration" className=" mb-8 w-100 h-100"/>


            <div className=" w-full flex justify-center">
                <Card
                    className="p-10 shadow-xl w-full max-w-3xl text-center rounded-3xl border border-gray-200 bg-white">

                    <Box className="space-y-6 w-full">
                        {/* Name Input */}
                        <TextField
                            className="!mb-8"
                            label="Enter your name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        {/* File Upload Section */}
                        <div
                            className="flex items-center justify-center border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-100 w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer">
                                <IconButton color="primary" size="small">
                                    <AttachFile fontSize="small"/>
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
        </div>
    );
}
