import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h1>AI Travel Planner</h1>

      <p>
        Generate personalized travel itineraries based on destination, budget,
        duration, and interests.
      </p>

      {token ? (
        <Link to="/dashboard">
          <button>Go to Dashboard</button>
        </Link>
      ) : (
        <>
          <Link to="/register">
            <button>Get Started</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}

      <hr />

      <h2>Features</h2>

      <ul>
        <li>AI-generated travel plans</li>
        <li>Budget-aware itineraries</li>
        <li>Interest-based recommendations</li>
        <li>Manage and update trips</li>
      </ul>
    </div>
  );
}

export default Home;
