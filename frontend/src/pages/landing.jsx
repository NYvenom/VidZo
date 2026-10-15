import React from "react";
import { Link } from "react-router-dom";
import "../App.css"

export default function LandingPage() {
    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>VidZo</h2>
                </div>
                <div className="navList">
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role="button">
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">

            </div>
        </div>
    )
}