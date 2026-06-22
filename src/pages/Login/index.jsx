import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

class Login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    error: "",
    redirect: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      this.setState({
        loading: true,
        error: "",
      });

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      this.setState({
        redirect: true,
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div>
        <h1>Login</h1>

        {this.state.error && <p>{this.state.error}</p>}

        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
          />

          <button type="submit" disabled={this.state.loading}>
            {this.state.loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    );
  }
}

export default Login;
