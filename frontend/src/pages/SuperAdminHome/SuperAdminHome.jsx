import { useState } from "react";
import {
  UserIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import "./superadminhome.css";
import MangementUsers from "../ManageUsers/ManageUsers";
import { logout } from "../../Redux/actions/authActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SuperAdminLogin from "../SuperUserLogin/SuperUserLogin";
import ManageAdmin from '../ManageAdmin/ManageAdmin'

const SuperAdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/superadminlogin");
  };

  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <h2>Welcome to the Dashboard</h2>;
      case "admins":
        return <ManageAdmin/>
      case "users":
        return <MangementUsers />;
      case "tasks":
        return <h2>Task Overview</h2>;
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
            title="Admins"
            icon={<UserIcon className="icon" />}
            isActive={activeTab === "admins"}
            onClick={() => setActiveTab("admins")}
          />
          <SidebarItem
            title="Users"
            icon={<UsersIcon className="icon" />}
            isActive={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <SidebarItem
            title="Tasks"
            icon={<ClipboardDocumentListIcon className="icon" />}
            isActive={activeTab === "tasks"}
            onClick={() => setActiveTab("tasks")}
          />
          <SidebarItem
            title="Logout"
            icon={<UserIcon className="icon" />} // optional
            isActive={false}
            onClick={handleLogout}
          />
        </nav>
      </aside>

      {/* Main Content */}
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
