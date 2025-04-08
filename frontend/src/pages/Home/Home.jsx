import React, { useState, useEffect } from "react";
import "./home.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/actions/authActions";
import api from "../../api";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("Pending");
    const [report, setReport] = useState("");
    const [hours, setHours] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log('this is good or not')

    const user = useSelector(state => state.auth.user); 
    console.log(user)


 

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get("/api/admin/tasks/");
                console.log(res,"gggggggggggggggggggggggggggggggggggggggggggggg,",user)
                const assignedTasks = res.data.filter(task => task.assigned_to === user?.user_id);
                setTasks(assignedTasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!selectedTask) return;

        try {
            await api.put(`/api/tasks/${selectedTask.id}/`, {
                status,
                completion_report: report,
                worked_hours: hours,
                assigned_to: user.id,
            });

            alert("Task updated successfully");

            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t.id === selectedTask.id
                        ? { ...t, status, completion_report: report, worked_hours: hours }
                        : t
                )
            );
        } catch (err) {
            console.error("Failed to update task:", err.response?.data || err.message);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="task-container">
            <h2>Your Assigned Tasks</h2>

            <select
                className="task-selector"
                onChange={(e) => {
                    const taskId = parseInt(e.target.value);
                    const task = tasks.find(t => t.id === taskId);
                    setSelectedTask(task);
                    if (task) {
                        setStatus(task.status || "Pending");
                        setReport(task.completion_report || "");
                        setHours(task.worked_hours || "");
                    }
                }}
            >
                <option value="">-- Select a Task --</option>
                {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                        {task.title}
                    </option>
                ))}
            </select>

            {selectedTask && (
                <>
                    <div className="task"><label>Title:</label><p>{selectedTask.title}</p></div>
                    <div className="task"><label>Description:</label><p>{selectedTask.description}</p></div>
                    <div className="task"><label>Assigned To:</label><p>{user?.username} (You)</p></div>
                    <div className="task"><label>Due Date:</label><p>{selectedTask.due_date}</p></div>

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
                        <textarea className="input" placeholder="Write your report..." value={report} onChange={(e) => setReport(e.target.value)}></textarea>
                    </div>

                    <div className="task">
                        <label>Worked Hours:</label>
                        <input type="number" className="input" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
                    </div>

                    <button className="submit-button" onClick={handleSubmit}>Submit Task Report</button>
                </>
            )}

            <button onClick={handleLogout} className="button1">Logout</button>
        </div>
    );
};

export default Home;
