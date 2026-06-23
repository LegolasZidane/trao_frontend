import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import CreateTripForm from "../../components/CreateTripForm";
import ItineraryCard from "../../components/ItineraryCard";
import PackingList from "../../components/PackingList";

class Dashboard extends Component {
  state = {
    trips: [],
    selectedTrip: null,
    loading: true,
    error: "",
    logout: false,
  };

  componentDidMount() {
    this.fetchTrips();
  }

  fetchTrips = async () => {
    const token = localStorage.getItem("token");

    this.setState({ loading: true });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
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
    if (!tripId) {
      this.setState({ selectedTrip: null });
      return;
    }

    this.fetchTripById(tripId);
  };

  handleLogout = () => {
    localStorage.removeItem("token");

    this.setState({
      logout: true,
    });
  };

  togglePacked = async (itemId) => {
    const { selectedTrip } = this.state;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${selectedTrip._id}/packing/${itemId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedTrip = await response.json();

      if (!response.ok) {
        throw new Error(updatedTrip.message);
      }

      this.setState({
        selectedTrip: updatedTrip,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  render() {
    const { trips, selectedTrip, loading, error, logout } = this.state;

    if (logout) {
      return <Navigate to="/login" replace />;
    }

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <h2 className="text-2xl font-semibold text-gray-700">
            Loading Dashboard...
          </h2>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Travel Planner
              </h1>

              <p className="text-gray-500 mt-1">
                Plan, manage and organize your trips.
              </p>
            </div>

            <button
              onClick={this.handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Create Trip */}
            <div className="lg:col-span-3">
              <CreateTripForm onTripCreated={this.handleTripCreated} />
            </div>

            {/* Itinerary */}
            <div className="lg:col-span-6">
              <ItineraryCard
                trips={trips}
                selectedTrip={selectedTrip}
                onTripSelect={this.handleTripSelect}
                refreshTrip={this.fetchTripById}
                refreshTrips={this.fetchTrips}
              />
            </div>

            {/* Packing List */}
            <div className="lg:col-span-3">
              <PackingList
                trip={selectedTrip}
                togglePacked={this.togglePacked}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
