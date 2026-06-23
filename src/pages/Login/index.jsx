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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2">
              Sign in to continue planning your trips
            </p>
          </div>

          {this.state.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {this.state.error}
            </div>
          )}

          <form onSubmit={this.handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={this.handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={this.state.loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {this.state.loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
