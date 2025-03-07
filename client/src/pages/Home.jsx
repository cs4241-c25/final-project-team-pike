import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export default function Home() {
    const fullText = "Welcome to Choremate";
    const [displayText, setDisplayText] = useState("");
    const typingSpeed = 100; // Typing speed in ms

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayText((prevText) => fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getName = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/user", { credentials: "include" })
                const data = await response.json()
                localStorage.setItem("realName", data.realName)
            } catch (error) {
                if (error.response.status !== 401) {
                    console.error("Error fetching name:", error)
                }
            }
        }
            
        const getInviteCode = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/org/inviteCode", { credentials: "include" })
                const data = await response.json()
                localStorage.setItem("inviteCode", data.invite)
            } catch (error) {
                console.error("Error fetching invite code:", error)
            }
        }

        const populateLocalStorage = async () => {
            await getName()
            if (localStorage.getItem("realName") !== null) {
                await getInviteCode()
            }

            window.dispatchEvent(new Event("storage"));
        }
        populateLocalStorage()
    }, []);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white p-6 fixed inset-0">
            <Typography
                variant="h3"
                className="!mb-8 font-bold drop-shadow-lg text-center w-full text-3xl md:text-5xl leading-tight"
                style={{ fontFamily: "Helvetica Neue, sans-serif" }}
            >
                {displayText}
            </Typography>

            <Typography
                variant="h6"
                className="!mb-8 mt-4 drop-shadow-md text-center w-full italic text-gray-100"
            >
                Choremate is your ultimate roommate chore management solution.
                Effortlessly assign, track, and manage household tasks to keep your home organized and stress-free.
            </Typography>

            <Typography
                variant="body1"
                className="text-center w-full text-gray-200 max-w-lg leading-relaxed"
            >
                With Choremate, you can create shared task lists, set deadlines, and receive reminders—ensuring everyone does their part. Say goodbye to confusion and hello to a cleaner home!
            </Typography>
        </div>
    );
}