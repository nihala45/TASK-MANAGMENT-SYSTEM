import { useState } from "react";
import {
  UserIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";


import { logout } from "../../Redux/actions/authActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ManageTask from "../ManageTasks/ManageTasks";



const SuperAdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <h2>Welcome to the Dashboard</h2>;
    
      case "tasks":
        return <ManageTask/>
      case "logout":
        return <h2>Welcome to the Dashboard</h2>;
      default:
        return <h2>Welcome</h2>;
    }
  };

  return (
    <div className="full-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Super Admin</div>
        <nav className="nav-menu">
          <SidebarItem
            title="Dashboard"
            icon={<HomeIcon className="icon" />}
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
      
          <SidebarItem
            title="Tasks"
            icon={<ClipboardDocumentListIcon className="icon" />}
            isActive={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          />
          <SidebarItem
            title="Logout"
            icon={<UserIcon className="icon" />}
            isActive={false}
            onClick={handleLogout}
          />
        </nav>
      </aside>


      <main className="main-area">
        <div className="main-card">
          {renderContent()}
          <p>Here is the content for the "{activeTab}" tab.</p>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ title, icon, isActive, onClick }) => (
  <button onClick={onClick} className={`nav-item ${isActive ? "active" : ""}`}>
    {icon}
    <span>{title}</span>
  </button>
);

export default SuperAdminHome;