import React, { useState } from "react";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/token";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/actions/authActions";
import api from "../../api";

const Form = ({ route, method }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted");

    if (method === "userRegister" && password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const data = {
      username,
      password,
      ...(method === "userRegister" && { email, phone })
    };

    console.log("Sending data:", data);

    try {
      const res = await api.post(route, data);
      console.log("API response:", res.data);

      if (method === "userLogin") {
        const { access, refresh, is_superuser } = res.data;

        if (!access || !refresh) {
          alert("Login failed. Invalid credentials or missing tokens.");
          return;
        }

        localStorage.clear();
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh);
        localStorage.setItem("admin", is_superuser);
        dispatch(login(res.data));
        alert("Login successful");
        navigate("/");
      } else {
        alert("Registered successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);

      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const firstKey = Object.keys(errorData)[0];
        const errorMessage = Array.isArray(errorData[firstKey])
          ? errorData[firstKey][0]
          : errorData[firstKey];

        alert(errorMessage || "An error occurred. Please try again.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {method === "userLogin" ? (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Login</h2>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
            className="input"
            placeholder="Username"
          />

          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="input"
            placeholder="Password"
          />

          <button type="submit" className="submit-button" disabled={Loading}>
            {Loading ? "Logging in..." : "Login"}
          </button>

          <p>
            Create an account <Link to="/register">Register</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Register</h2>

          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
            className="input"
            placeholder="Username"
          />

          <label>Email:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="input"
            placeholder="Email"
          />

          <label>Phone:</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            required
            className="input"
            placeholder="Phone"
          />

          <label>Password:</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="input"
            placeholder="Password"
          />

          <label>Confirm Password:</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            className="input"
            placeholder="Confirm Password"
          />

          <button type="submit" className="submit-button" disabled={Loading}>
            {Loading ? "Registering..." : "Register"}
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Form;