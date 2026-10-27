import React from "react";
import withAuth from "../utils/withAuth";

export default function HomeComponent() {
    return (
        <div>
            HomeComponent
        </div>
    )
}

export default withAuth(HomeComponent);