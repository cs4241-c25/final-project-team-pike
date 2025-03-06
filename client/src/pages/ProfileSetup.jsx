import { useState } from "react";
import { Button, Card, TextField, Typography, IconButton, Box, Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProfileSVG from "../assets/profile.svg";


const BACKEND = "http://localhost:3000"

export default function ProfileSetup() {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    const handleDone = () => {
        if (name) {
            console.log("Sending "+JSON.stringify({name: name}))
            fetch(BACKEND+"/api/user/create", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({name: name}),
                credentials: "include"
            }).then((res) => {
                if (res.status === 200) {
                    navigate("/group-selection")
                }
                else if (res.status === 400) {
                    navigate("/home")
                }
                else if (res.status === 401) {
                    navigate("/") //redirect to login
                }
                else {
                    console.log(res.body)
                    setOpen(true);
                }

            })
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            {/* Navbar */}
            <Navbar/>
            <h1 className="pt-[150px] text-xl font-bold mb-6">Set up your profile</h1>
            <img src={ProfileSVG} alt="Profile Setup Illustration" className=" mb-8 w-100 h-100"/>


            <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert severity="error" onClose={() => setOpen(false)}>
                    Server Error
                </Alert>
            </Snackbar>

            <div className="w-full flex justify-center">
                <Card className="p-10 shadow-xl w-full max-w-3xl text-center rounded-3xl border border-gray-200 bg-white">
                    <Box className="space-y-6 w-full">
                        {/* Name Input */}
                        <TextField
                            className="!mb-8"
                            label="Enter your name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

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