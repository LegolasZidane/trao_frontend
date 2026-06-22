import React, { Component } from "react";
import CreateTripForm from "../../components/CreateTripForm";
import ItineraryCard from "../../components/ItineraryCard";
import PackingList from "../../components/PackingList";

class Dashboard extends Component {
  state = {
    trips: [],
    selectedTrip: null,
    loading: true,
    error: "",
  };

  componentDidMount() {
    this.fetchTrips();
  }

  fetchTrips = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/trips/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch trips");
      }

      this.setState({
        trips: data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  fetchTripById = async (tripId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch trip");
      }

      this.setState({
        selectedTrip: data,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  handleTripCreated = (newTrip) => {
    this.setState((prevState) => ({
      trips: [newTrip, ...prevState.trips],
      selectedTrip: newTrip,
    }));
  };

  handleTripSelect = (tripId) => {
    this.fetchTripById(tripId);
  };

  render() {
    const { trips, selectedTrip, loading, error } = this.state;

    if (loading) {
      return <h2>Loading Dashboard...</h2>;
    }

    return (
      <div>
        <h1>AI Travel Planner Dashboard</h1>

        {error && <p>{error}</p>}

        <CreateTripForm onTripCreated={this.handleTripCreated} />

        <hr />

        <ItineraryCard
          trips={trips}
          selectedTrip={selectedTrip}
          onTripSelect={this.handleTripSelect}
          refreshTrip={this.fetchTripById}
        />

        <hr />

        <PackingList trip={selectedTrip} />
      </div>
    );
  }
}

export default Dashboard;
