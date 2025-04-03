// home.jsx
import React, { useState } from "react";
import "./home.css";

const Home = () => {
    const [status, setStatus] = useState("Pending");
    const [report, setReport] = useState("");
    const [hours, setHours] = useState("");

    const handleSubmit = () => {
        alert(`Task Submitted!\nStatus: ${status}\nReport: ${report}\nWorked Hours: ${hours}`);
    };

    return (
        <div className="task-container">
            <h2>Your Task Details</h2>

            <div className="task">
                <label>Title:</label>
                <p>Design Homepage</p>
            </div>

            <div className="task">
                <label>Description:</label>
                <p>Create a modern homepage design using HTML and CSS.</p>
            </div>

            <div className="task">
                <label>Assigned To:</label>
                <p>John Doe</p>
            </div>

            <div className="task">
                <label>Due Date:</label>
                <p>August 5, 2024</p>
            </div>

            <div className="task">
                <label>Status:</label>
                <select className="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div className="task">
                <label>Completion Report:</label>
                <textarea 
                    className="input" 
                    placeholder="Write a report..." 
                    value={report} 
                    onChange={(e) => setReport(e.target.value)}
                ></textarea>
            </div>

            <div className="task">
                <label>Worked Hours:</label>
                <input 
                    type="number" 
                    className="input" 
                    placeholder="Enter hours worked" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                />
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit Report
            </button>
        </div>
    );
};

export default Home;
