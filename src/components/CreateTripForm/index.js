import React, { Component } from "react";

class CreateTripForm extends Component {
  state = {
    destination: "",
    durationDays: "",
    budgetTier: "Low",
    interests: "",
    loading: false,
    error: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    this.setState({
      loading: true,
      error: "",
    });

    try {
      const response = await fetch("http://localhost:5000/api/trips/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination: this.state.destination,
          durationDays: Number(this.state.durationDays),
          budgetTier: this.state.budgetTier,
          interests: this.state.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate trip");
      }

      console.log(data);

      // optional parent callback
      if (this.props.onTripCreated) {
        this.props.onTripCreated(data);
      }

      this.setState({
        destination: "",
        durationDays: "",
        budgetTier: "Low",
        interests: "",
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  render() {
    const { destination, durationDays, budgetTier, interests, loading, error } =
      this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Create Trip</h2>

        {error && <p>{error}</p>}

        <div>
          <label>Destination</label>
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={this.handleChange}
            required
          />
        </div>

        <div>
          <label>Duration (Days)</label>
          <input
            type="number"
            name="durationDays"
            value={durationDays}
            onChange={this.handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>Budget Tier</label>
          <select
            name="budgetTier"
            value={budgetTier}
            onChange={this.handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Interests (comma separated)</label>
          <input
            type="text"
            name="interests"
            value={interests}
            onChange={this.handleChange}
            placeholder="Food, Museums, Shopping"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Trip"}
        </button>
      </form>
    );
  }
}

export default CreateTripForm;
