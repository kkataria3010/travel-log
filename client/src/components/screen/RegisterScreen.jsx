import { useState,useEffect } from "react";
import { useHistory } from "react-router";
import { post } from "../../utils/requests";
import { Link } from "react-router-dom";
import HomeButton from "../Extras/HomeButton";
import "./RegisterScreen.css";

const randomColor = () =>{
  return "#"+Math.floor(Math.random()*16777215).toString(16);
}

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [color, setColor] = useState("");
  const history = useHistory();
  const registerHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await post(
        "/auth/register",
        {
          username,
          email,
          password,
          color,
        }
        );
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken",data.refreshToken);
        history.push("/");
    } catch (error) {
      // let message = error.response.data.error;
      // setError(message;
      // setError(error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  useEffect(() => {
    setColor(randomColor());
  }, []);
  return (
    <div className="register-screen">
      <form onSubmit={registerHandler} className="register-screen__form" autoComplete="off">
        <h3 className="register-screen__title">Register</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            required
            id="name"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword">Confirm Password:</label>
          <input
            type="password"
            required
            id="confirmpassword"
            autoComplete="true"
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">
            Marker Color:
          </label>
          <input
            type="color"
            required
            id="color"
            autoComplete="true"
            placeholder="Marker Color"
            onChange={(e) => setColor(e.target.value)}
            value={color}
            tabIndex={2}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <span className="register-screen__subtext">
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
      <HomeButton/>
    </div>
  );
};

export default RegisterScreen;