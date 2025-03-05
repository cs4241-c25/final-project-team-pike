import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import RoommateSVG from "../assets/roommate.svg";

export default function GroupSelection() {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black overflow-y-auto">
            <Navbar/>
            {/* Title: No extra spacing */}
            <img src={RoommateSVG} alt="Roommate Illustration" className="!mb-12 w-44 h-44"/>

            {/*<Typography variant="h4" className="font-bold text-center pt-150px !mb-8">*/}
            {/*    Join or Create a Roommate Group*/}
            {/*</Typography>*/}

            {/* Card Container with Full Width & Centered */}
           <div className="space-y-6">
                    {/* Join Button */}
                    <Button
                        className={"!mb-8"}
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("/join-group")}
                        sx={{
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: "999px",
                            padding: "14px 28px",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            textTransform: "none",
                            transition: "all 0.3s ease-in-out",
                            border: "2px solid transparent",
                            "&:hover": {
                                backgroundColor: "#ec4899",
                                border: "2px solid #ec4899",
                            },
                            "&:active": {
                                backgroundColor: "#ec4899",
                                transform: "scale(0.95)",
                            },
                            "&:focus": {
                                outline: "none",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Join a Roommate Group
                    </Button>

                    {/* Create Button */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate("/create-group")}
                        sx={{
                            borderColor: "#ec4899",
                            color: "#ec4899",
                            borderRadius: "999px",
                            padding: "14px 28px",
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            textTransform: "none",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                backgroundColor: "#ec4899",
                                color: "white",
                            },
                            "&:active": {
                                transform: "scale(0.95)",
                            },
                            "&:focus": {
                                outline: "none",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Create a Roommate Group
                    </Button>
                </div>
        </div>
    );
}
