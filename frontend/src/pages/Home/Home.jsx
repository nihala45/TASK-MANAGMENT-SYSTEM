import React, { useState, useEffect } from "react";
import "./home.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/actions/authActions";
import axios from "axios";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("Pending");
    const [report, setReport] = useState("");
    const [hours, setHours] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const user = useSelector(state => state.auth.user); 
    
   
    return (
        <div className="task-container">
            <h2>Your Task Details</h2>

            <select className="task-selector" onChange={(e) => {
                const taskId = e.target.value;
                const task = tasks.find(t => t.id === parseInt(taskId));
                setSelectedTask(task);
            }}>
                {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                        {task.title}
                    </option>
                ))}
            </select>

            {selectedTask && (
                <>
                    <div className="task">
                        <label>Title:</label>
                        <p>{selectedTask.title}</p>
                    </div>

                    <div className="task">
                        <label>Description:</label>
                        <p>{selectedTask.description}</p>
                    </div>

                    <div className="task">
                        <label>Assigned To:</label>
                        <p>{selectedTask.assigned_to}</p>
                    </div>

                    <div className="task">
                        <label>Due Date:</label>
                        <p>{selectedTask.due_date}</p>
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
                </>
            )}

            <button onClick={handleLogout} className="button1">Logout</button>
        </div>
    );
};

export default Home;
