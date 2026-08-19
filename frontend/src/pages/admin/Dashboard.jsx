import { useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {PieChart, Pie, Tooltip, Legend} from "recharts";
import { getDashboard } from "../../api/adminApi";

// https://www.geeksforgeeks.org/reactjs/create-a-donut-chart-using-recharts-in-reactjs/
function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);
  useEffect(function () {

      getDashboard()
        .then(function (data) {
          setDashboard(data);
        })
        .catch(function (error) {
          setValidationError(error.message);
        });
    }, []);

    if (!dashboard) {
      return <p>Loading dashboard...</p>;
    }

    // Uses the values returned from the Flask dashboard API.
    const availabilityData = [
      {
        name: "Available",
        value: dashboard.available_wines,
        fill: "#5f8f68"
      },
      {
        name: "Unavailable",
        value: dashboard.unavailable_wines,
        fill: "#a6535d"
      }
    ];

    return (
    <section>

      <h1>Dashboard</h1>
        {currentUser && (
          <p>Role: {currentUser.role}</p>
        )}


      <div className="dashboard-grid">

        <article className="dashboard-card">

          <h2>Wine Availability</h2>

          <PieChart width={280} height={250}>

            <Pie
              data={availabilityData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              label
            />

            <Tooltip />
            <Legend />
          </PieChart>
          <p className="dashboard-card-value">
            Total Wines = 
            {dashboard.available_wines}
            <br />
            Available Wines = 
            {dashboard.available_wines}
            <br />
            Unavailable wines =
            {dashboard.unavailable_wines}


          </p>

        </article>

      </div>


      {validationError && (
        <p>{validationError}</p>
      )}

    </section>
  );
}


export default Dashboard;