import { useState } from "react";
import { Button, TextField, Typography, Box, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [inviteCode, setInviteCode] = useState(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    // Function to generate a 6-character alphanumeric code
    const generateInviteCode = () => {
        // TODO replace with a backend query
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setInviteCode(code);
        setCopied(false); // Reset copied state
    };

    // Function to copy invite code to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black p-6">
            {/* Title */}
            <Typography variant="h4" className="mb-6 font-bold text-center">
                Create a Roommate Group
            </Typography>

            {/* Group Name Input */}
            <TextField
                label="Group Name"
                variant="outlined"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                fullWidth
                sx={{
                    maxWidth: "400px",
                    marginBottom: "20px",
                }}
            />

            {/* Generate Invite Code Button */}
            <Button
                variant="contained"
                onClick={generateInviteCode}
                disabled={!groupName.trim()}
                sx={{
                    backgroundColor: "black !important",
                    color: "white !important",
                    padding: "12px 24px",
                    borderRadius: "999px",
                    fontWeight: "bold",
                    textTransform: "none",
                    width: "100%",
                    maxWidth: "400px",
                    marginBottom: "20px",
                    "&:hover": {
                        backgroundColor: "#ec4899 !important",
                    },
                }}
            >
                Generate Invite Code
            </Button>

            {/* Display Invite Code with Copy Functionality */}
            {inviteCode && (
                <Box className="flex items-center space-x-4 border p-4 rounded-lg bg-gray-100 shadow-md">
                    <Typography variant="h6" className="font-mono text-lg">
                        {inviteCode}
                    </Typography>
                    <IconButton onClick={copyToClipboard} color="primary">
                        <ContentCopyIcon />
                    </IconButton>
                    {copied && <Typography variant="body2" color="success">Copied!</Typography>}
                </Box>
            )}

            {/* Redirect to Home */}
            {inviteCode && (
                <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
                    sx={{
                        marginTop: "20px",
                        backgroundColor: "#4CAF50 !important",
                        color: "white !important",
                        padding: "12px 24px",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        textTransform: "none",
                        width: "100%",
                        maxWidth: "400px",
                        "&:hover": {
                            backgroundColor: "#388E3C !important",
                        },
                    }}
                >
                    Go to Home
                </Button>
            )}
        </div>
    );
}
