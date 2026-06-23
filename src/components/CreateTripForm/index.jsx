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
      <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Trip</h2>

        <p className="text-gray-500 text-sm mb-6">
          Generate a personalized travel itinerary with AI.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={this.handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Destination
            </label>

            <input
              type="text"
              name="destination"
              value={destination}
              onChange={this.handleChange}
              placeholder="e.g. Paris"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Duration (Days)
            </label>

            <input
              type="number"
              name="durationDays"
              value={durationDays}
              onChange={this.handleChange}
              min="1"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Budget Tier
            </label>

            <select
              name="budgetTier"
              value={budgetTier}
              onChange={this.handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Interests
            </label>

            <input
              type="text"
              name="interests"
              value={interests}
              onChange={this.handleChange}
              placeholder="Food, Museums, Shopping"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-400 mt-1">
              Separate interests with commas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Trip"}
          </button>
        </form>
      </div>
    );
  }
}

export default CreateTripForm;
