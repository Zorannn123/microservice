import React from "react";
import dashboardImage from "../assets/food.jpg"
import { Navbar } from "../Navbar/Navbar";

export const Dashboard = () => {

    return (
        <>
            <Navbar />
            <div style={{ display: "flex" }}>
                <img src={dashboardImage} alt="Dashboard" style={{ width: '100%', height: '100%', marginTop: "50px" }} />
            </div>
        </>
    );
};