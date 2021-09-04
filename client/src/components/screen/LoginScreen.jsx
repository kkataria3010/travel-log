import { useState, useEffect } from "react";
import { post } from "../../utils/requests";
import { Link,useHistory} from "react-router-dom";
import HomeButton from "../Extras/HomeButton";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const {data} = await post("/auth/login",{email,password})
      // console.log(data);    
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // console.log(history);
      history.push("/");
    } catch (error) {
      console.log("eror",error);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={loginHandler} className="login-screen__form" autoComplete="off">
        <h3 className="login-screen__title">Login</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Password:{" "}
            <Link to="/forgotpassword" className="login-screen__forgotpassword">
              Forgot Password?
            </Link>
          </label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            tabIndex={2}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>

        <span className="login-screen__subtext">
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
      <HomeButton/>
    </div>
  );
};

export default LoginScreen;