import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export default function Home() {
    const fullText = "Welcome to Choremates";
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

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
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
                Choremates is your ultimate roommate chore management solution.
                Effortlessly assign, track, and manage household tasks to keep your home organized and stress-free.
            </Typography>

            <Typography
                variant="body1"
                className="text-center w-full text-gray-200 max-w-lg leading-relaxed"
            >
                With Choremates, you can create shared task lists, set deadlines, and receive reminders—ensuring everyone does their part. Say goodbye to confusion and hello to a cleaner home!
            </Typography>
        </div>
    );
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
