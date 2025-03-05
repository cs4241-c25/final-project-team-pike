// src/pages/ProfileSetup.jsx
import { useState } from "react";
import { Button, Card, TextField, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AttachFile } from "@mui/icons-material";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-12">
            <Typography variant="h4" className="mb-8 font-semibold text-gray-800 text-center">Set Up Your Profile</Typography>

            <Card className="p-12 shadow-xl w-full max-w-2xl text-center rounded-3xl border border-gray-200 bg-white">
                <div className="space-y-8">
                    <TextField
                        label="Enter your name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="flex flex-col items-center justify-center border border-gray-300 p-3 rounded-lg cursor-pointer hover:bg-gray-100 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer py-2">
                            <IconButton color="primary" size="small">
                                <AttachFile fontSize="small" />
                            </IconButton>
                            <Typography className="text-gray-700 text-sm">Choose File</Typography>
                        </label>
                    </div>

                    {image && <img src={image} alt="Profile Preview" className="w-32 h-32 rounded-full mx-auto border border-gray-300 shadow-md" />}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleDone}
                        disabled={!name || !image}
                        className="py-4 text-lg rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Done
                    </Button>
                </div>
            </Card>
        </div>
    );
}
