import React, { Component } from "react";

class ItineraryCard extends Component {
  state = {
    title: "",
    description: "",
    estimatedCostUSD: "",
    timeOfDay: "Morning",
    feedback: "",
    error: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addActivity = async (dayNumber) => {
    const { selectedTrip, refreshTrip } = this.props;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${selectedTrip._id}/day/${dayNumber}/activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: this.state.title,
            description: this.state.description,
            estimatedCostUSD: Number(this.state.estimatedCostUSD),
            timeOfDay: this.state.timeOfDay,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await refreshTrip(selectedTrip._id);

      this.setState({
        title: "",
        description: "",
        estimatedCostUSD: "",
        timeOfDay: "Morning",
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  deleteActivity = async (dayNumber, activityId) => {
    const { selectedTrip, refreshTrip } = this.props;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${selectedTrip._id}/day/${dayNumber}/activity/${activityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await refreshTrip(selectedTrip._id);
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  regenerateDay = async (dayNumber) => {
    const { selectedTrip, refreshTrip } = this.props;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/trips/${selectedTrip._id}/day/${dayNumber}/regenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            feedback: this.state.feedback,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await refreshTrip(selectedTrip._id);

      this.setState({
        feedback: "",
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  render() {
    const { trips, selectedTrip, onTripSelect } = this.props;

    return (
      <div>
        <h2>My Trips</h2>

        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <button onClick={() => onTripSelect(trip._id)}>
                {trip.destination}
              </button>
            </li>
          ))}
        </ul>

        {!selectedTrip && <p>Select a trip to view itinerary.</p>}

        {selectedTrip && (
          <div>
            <h2>{selectedTrip.destination}</h2>

            <p>Duration: {selectedTrip.durationDays} days</p>

            <p>Budget: {selectedTrip.budgetTier}</p>

            {selectedTrip.itinerary.map((day) => (
              <div
                key={day.dayNumber}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                <h3>Day {day.dayNumber}</h3>

                {day.activities.map((activity) => (
                  <div
                    key={activity._id}
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    <h4>{activity.title}</h4>

                    <p>{activity.description}</p>

                    <p>Time: {activity.timeOfDay}</p>

                    <p>Cost: ${activity.estimatedCostUSD}</p>

                    <button
                      onClick={() =>
                        this.deleteActivity(day.dayNumber, activity._id)
                      }
                    >
                      Delete Activity
                    </button>
                  </div>
                ))}

                <hr />

                <h4>Add Activity</h4>

                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                />

                <br />

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />

                <br />

                <input
                  type="number"
                  name="estimatedCostUSD"
                  placeholder="Cost"
                  value={this.state.estimatedCostUSD}
                  onChange={this.handleChange}
                />

                <br />

                <select
                  name="timeOfDay"
                  value={this.state.timeOfDay}
                  onChange={this.handleChange}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>

                <br />
                <br />

                <button onClick={() => this.addActivity(day.dayNumber)}>
                  Add Activity
                </button>

                <hr />

                <h4>Regenerate Day</h4>

                <textarea
                  name="feedback"
                  placeholder="Give feedback..."
                  value={this.state.feedback}
                  onChange={this.handleChange}
                />

                <br />

                <button onClick={() => this.regenerateDay(day.dayNumber)}>
                  Regenerate Day
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ItineraryCard;
