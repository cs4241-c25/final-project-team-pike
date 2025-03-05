// src/pages/GroupSelection.jsx
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "@mui/material";

export default function GroupSelection() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <Card className="p-6 shadow-md w-full max-w-md text-center rounded-lg">
                <Typography variant="h5" className="mb-4">Join or Create a Roommate Group</Typography>
                <div className="space-y-4">
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate("/join-group")}
                    >
                        Join a Roommate Group
                    </Button>
                    <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/create-group")}>
                        Create a Roommate Group
                    </Button>
                </div>
            </Card>
        </div>
    );
}