import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Box } from "@mui/material";
import RoommateSVG from "../assets/roommate.svg"; // Import the SVG file
import Confetti from "react-confetti"; // 🎉 Import the confetti effect
import { useWindowSize } from "react-use"; // Helps make confetti responsive

export default function JoinGroup() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState(["", "", "", "", "", ""]); // Now 6 characters
    const inputRefs = useRef([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize(); // Get screen size for confetti

    // Handle character entry
    const handleChange = (index, value) => {
        if (!/^[a-zA-Z0-9]?$/.test(value)) return; // Allow only letters and numbers
        const newCode = [...inviteCode];
        newCode[index] = value.toUpperCase(); // Convert to uppercase for consistency
        setInviteCode(newCode);

        // Move focus to next box if a character is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle Backspace to move back
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !inviteCode[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Convert array to string and validate
    const handleJoin = () => {
        const codeString = inviteCode.join("");
        if (codeString.length !== 6) {
            alert("Please enter a valid 6-character invite code.");
            return;
        }

        console.log("Joining with invite code:", codeString);

        // 🎉 Show confetti for 3 seconds
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
            navigate("/dashboard"); // Redirect after confetti
        }, 3000);
    };

    return (
        <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
            {/* 🎉 Confetti Effect */}
            {showConfetti && <Confetti width={width} height={height} />}

            {/* Enlarged SVG */}
            <img src={RoommateSVG} alt="Roommate Illustration" className="mb-8 w-44 h-44" />

            {/* Title in Helvetica Neue with Black Color */}
            <Typography
                variant="h4"
                className="!mb-8 font-bold text-center"
                style={{ fontFamily: "Helvetica Neue, sans-serif", color: "black" }}
            >
                Join a Roommate Group
            </Typography>

            <Typography variant="body1" className="!mb-8 text-center text-gray-600">
                Enter your 6-character invite code to join your roommate group.
            </Typography>

            {/* Invite Code Boxes */}
            <Box className="flex justify-center space-x-2 !mb-10">
                {inviteCode.map((char, index) => (
                    <input
                        key={index}
                        type="text"
                        value={char}
                        maxLength={1}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold text-black border border-gray-400 rounded-md outline-none uppercase focus:border-blue-500 transition"
                    />
                ))}
            </Box>

            {/* 🚀 Cool Join Button with Confetti Effect */}
            <Button
                variant="contained"
                onClick={handleJoin}
                disableElevation
                sx={{
                    backgroundColor: "black !important",
                    color: "white !important",
                    borderRadius: "999px",
                    padding: "12px 24px",
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    width: "100%",
                    maxWidth: "20rem",
                    transition: "all 0.3s ease-in-out",
                    border: "2px solid transparent",
                    "&:hover": {
                        backgroundColor: "#ec4899 !important",
                        color: "white !important",
                        border: "2px solid #ec4899",
                    },
                    "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                    },
                }}
            >
                🎉 Join Group
            </Button>
        </Container>
    );
}
