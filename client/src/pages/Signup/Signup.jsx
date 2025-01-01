import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import{ AuthContext} from "../../context/AuthContext";

import { api } from "../../utils/api";
import "./signup.css";

const Signup = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  let navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/user/register`, formData);
      console.log("Signup successful:", response.data);
      // Optionally handle the response here, like redirecting to a login page or showing a success message
    } catch (error) {
      console.error("There was an error with the signup:", error);
    }
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/user/login2`, {
        email: formData.email,
        password: formData.password,
      });
      console.log("Signin successful:", response.data);

      updateUser(response.data);
      localStorage.setItem("token",response.data.token)
      navigate("/");
    } catch (error) {
      console.error("There was an error with the signin:", error);
    }
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* Forms Container */}
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form className="sign-in-form" onSubmit={handleSubmitSignIn}>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            
          </form>

          {/* Sign Up Form */}
          <form className="sign-up-form" onSubmit={handleSubmitSignUp}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <input type="submit" value="Sign Up" className="btn solid" />
            <p className="social-text">Or Sign up with social platforms</p>
            
          </form>
        </div>
      </div>

      {/* Panels Container */}
      <div className="panels-container">
        {/* Left Panel */}
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              minus natus est.
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => setIsSignUpMode(true)}
            >
              Sign Up
            </button>
          </div>
          <img src="./img/log.svg" className="image" alt="" />
        </div>

        {/* Right Panel */}
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              minus natus est.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => setIsSignUpMode(false)}
            >
              Sign In
            </button>
          </div>
          <img src="./img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
