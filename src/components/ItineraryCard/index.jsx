import React, { Component } from "react";

class ItineraryCard extends Component {
  state = {
    activityForms: {},
    feedbackForms: {},
    error: "",
    regeneratingDay: null,
    loadingAction: false,
  };

  handleActivityChange = (dayNumber, e) => {
    const { name, value } = e.target;

    this.setState((prev) => ({
      activityForms: {
        ...prev.activityForms,
        [dayNumber]: {
          ...prev.activityForms[dayNumber],
          [name]: value,
        },
      },
    }));
  };

  handleFeedbackChange = (dayNumber, e) => {
    this.setState((prev) => ({
      feedbackForms: {
        ...prev.feedbackForms,
        [dayNumber]: e.target.value,
      },
    }));
  };

  getActivityForm = (dayNumber) => {
    return (
      this.state.activityForms[dayNumber] || {
        title: "",
        description: "",
        estimatedCostUSD: "",
        timeOfDay: "Morning",
      }
    );
  };

  addActivity = async (dayNumber) => {
    const { selectedTrip, refreshTrip } = this.props;
    if (!selectedTrip?._id) return;

    const form = this.getActivityForm(dayNumber);
    const token = localStorage.getItem("token");

    try {
      this.setState({ loadingAction: true });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${selectedTrip._id}/days/${dayNumber}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            estimatedCostUSD: Number(form.estimatedCostUSD),
            timeOfDay: form.timeOfDay,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await refreshTrip(selectedTrip._id);

      this.setState((prev) => ({
        activityForms: {
          ...prev.activityForms,
          [dayNumber]: {
            title: "",
            description: "",
            estimatedCostUSD: "",
            timeOfDay: "Morning",
          },
        },
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loadingAction: false });
    }
  };

  deleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await this.props.refreshTrips();

      if (this.props.selectedTrip?._id === tripId) {
        this.props.onTripSelect(null);
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  deleteActivity = async (dayNumber, activityId) => {
    const { selectedTrip, refreshTrip } = this.props;
    if (!selectedTrip?._id) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${selectedTrip._id}/days/${dayNumber}/activities/${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await refreshTrip(selectedTrip._id);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  regenerateDay = async (dayNumber) => {
    const { selectedTrip, refreshTrip } = this.props;
    if (!selectedTrip?._id) return;

    const token = localStorage.getItem("token");
    const feedback = this.state.feedbackForms[dayNumber] || "";

    this.setState({ regeneratingDay: dayNumber });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${selectedTrip._id}/days/${dayNumber}/regenerate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await refreshTrip(selectedTrip._id);

      this.setState((prev) => ({
        feedbackForms: {
          ...prev.feedbackForms,
          [dayNumber]: "",
        },
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ regeneratingDay: null });
    }
  };

  render() {
    const { trips, selectedTrip, onTripSelect } = this.props;

    return (
      <div className="space-y-6">
        {/* TRIP SELECTOR (UNCHANGED UI) */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Trips</h2>

          {trips.length === 0 ? (
            <p className="text-gray-500">
              No trips yet. Create one to get started.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {trips.map((trip) => (
                <div key={trip._id} className="flex items-center gap-2">
                  <button
                    onClick={() => onTripSelect(trip._id)}
                    className="
                      px-5 py-3
                      rounded-xl
                      border border-slate-300
                      bg-white
                      font-medium
                      text-slate-700
                      shadow-sm
                      cursor-pointer
                      transition-all duration-200
                      hover:bg-blue-50
                      hover:border-blue-400
                      hover:text-blue-700
                      hover:shadow-md
                      hover:-translate-y-1
                      active:translate-y-0
                    "
                  >
                    ✈️ {trip.destination}
                  </button>

                  <button
                    onClick={() => this.deleteTrip(trip._id)}
                    className="
                      px-3 py-2
                      rounded-lg
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      text-sm
                      shadow-sm
                      transition-all
                      hover:-translate-y-0.5
                    "
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NO TRIP SELECTED */}
        {!selectedTrip && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Select a trip
            </h3>
            <p className="text-gray-500 mt-2">
              Choose a trip above to view the itinerary.
            </p>
          </div>
        )}

        {/* SELECTED TRIP */}
        {selectedTrip && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedTrip.destination}
              </h2>

              <div className="flex gap-6 mt-3 text-gray-600">
                <span>📅 {selectedTrip.durationDays} Days</span>
                <span>💰 {selectedTrip.budgetTier}</span>
              </div>
            </div>

            {/* DAYS */}
            {selectedTrip.itinerary.map((day) => {
              const form = this.getActivityForm(day.dayNumber);

              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <h3 className="text-2xl font-bold mb-5">
                    Day {day.dayNumber}
                  </h3>

                  {/* ACTIVITIES */}
                  <div className="space-y-4 mb-6">
                    {day.activities.map((activity) => (
                      <div
                        key={activity._id}
                        className="border rounded-xl p-4 bg-slate-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {activity.title}
                            </h4>
                            <p className="text-gray-600 mt-1">
                              {activity.description}
                            </p>

                            <div className="flex gap-4 mt-3 text-sm text-gray-500">
                              <span>🕒 {activity.timeOfDay}</span>
                              <span>💵 ${activity.estimatedCostUSD}</span>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              this.deleteActivity(day.dayNumber, activity._id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ADD ACTIVITY */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-lg mb-4">Add Activity</h4>

                    <div className="space-y-3">
                      <input
                        type="text"
                        name="title"
                        placeholder="Activity Title"
                        value={form.title}
                        onChange={(e) =>
                          this.handleActivityChange(day.dayNumber, e)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                      />

                      <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) =>
                          this.handleActivityChange(day.dayNumber, e)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                      />

                      <input
                        type="number"
                        name="estimatedCostUSD"
                        placeholder="Estimated Cost"
                        value={form.estimatedCostUSD}
                        onChange={(e) =>
                          this.handleActivityChange(day.dayNumber, e)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                      />

                      <select
                        name="timeOfDay"
                        value={form.timeOfDay}
                        onChange={(e) =>
                          this.handleActivityChange(day.dayNumber, e)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                      </select>

                      <button
                        onClick={() => this.addActivity(day.dayNumber)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                      >
                        Add Activity
                      </button>
                    </div>
                  </div>

                  {/* REGENERATE */}
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-semibold text-lg mb-4">
                      Regenerate Day
                    </h4>

                    <textarea
                      name="feedback"
                      placeholder="Tell AI what you'd like changed..."
                      value={this.state.feedbackForms[day.dayNumber] || ""}
                      onChange={(e) =>
                        this.handleFeedbackChange(day.dayNumber, e)
                      }
                      rows="4"
                      className="w-full border rounded-lg px-4 py-3"
                    />

                    <button
                      onClick={() => this.regenerateDay(day.dayNumber)}
                      disabled={this.state.regeneratingDay === day.dayNumber}
                      className="
                        mt-3 bg-emerald-600 hover:bg-emerald-700
                        text-white px-5 py-2 rounded-lg
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      {this.state.regeneratingDay === day.dayNumber ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Regenerating...
                        </span>
                      ) : (
                        "Regenerate Day"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default ItineraryCard;
