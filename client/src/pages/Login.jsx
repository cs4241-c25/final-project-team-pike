import { useState, useEffect } from "react";
import { GitHub } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default function Login() {
    const fullText = "Welcome to Choremate";
    const [displayText, setDisplayText] = useState("");
    const typingSpeed = 100; // Adjust speed (in ms)
    const [user, setUser] = useState(null);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayText((prevText) => fullText.slice(0, i + 1)); // Slice from the original text
                i++;
            } else {
                clearInterval(interval);
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, []); // Empty dependency array to run effect only once

    // Check if user is already authenticated
    useEffect(() => {
        fetch("http://localhost:3000/api/user", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.github) {
                    setUser(data);
                    window.location.href = "/chores"; // Redirect to chores page if logged in
                }
            })
            .catch(() => setUser(null));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-[#f8f9fa] via-orange-400 to-pink-400 text-black p-6 fixed inset-0">
            <Typography
                variant="h3"
                className="!mb-8 font-bold drop-shadow-lg text-center w-full text-3xl md:text-5xl leading-tight"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
                {displayText}
            </Typography>



            <Typography
                variant="h6"
                className="!mb-8 mt-4 drop-shadow-md text-center w-full italic text-gray-700"
            >
                Manage chores effortlessly with your roommates
            </Typography>


            <Button
                variant="contained"
                href="http://localhost:3000/auth/github"
                sx={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "999px", // Makes it fully rounded
                    padding: "12px 24px",
                    fontSize: "1.125rem",
                    textTransform: "none", // Prevents uppercase transformation
                    width: "100%",
                    maxWidth: "20rem",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                        backgroundColor: "#ec4899", // Tailwind's pink-500
                        color: "white",
                    },
                }}
            >
                <GitHub sx={{ marginRight: "8px", color: "inherit" }} /> Log in with GitHub
            </Button>


        </div>
    );
}
