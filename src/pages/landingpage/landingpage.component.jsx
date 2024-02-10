import React from "react";
import "./landingpage.styles.scss"
import Navbar from "../../components/navbar/navbar.component";
import { Divider } from "@mui/material";

const LandingPage = () => {
    return(
        <div className="landing-page">
            <Navbar/>
            <Divider/>
        </div>
    );
};

export default LandingPage;