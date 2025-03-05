import React, { Component } from "react";
import { createRoot } from "react-dom/client"; // ✅ Use createRoot instead of render
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( 
        <div>
            <HomePage />
            
        </div>
        );
    }
}

// Mount the App component properly
const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);
