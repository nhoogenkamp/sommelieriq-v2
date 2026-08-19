import { useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {PieChart, Pie, Tooltip, Legend,BarChart, Bar, XAxis, YAxis,ResponsiveContainer} from "recharts";
import { getDashboard } from "../../api/adminApi";

// https://www.geeksforgeeks.org/reactjs/create-a-donut-chart-using-recharts-in-reactjs/
// https://stacknotice.com/blog/recharts-react-data-visualization-2026 for bar chart
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

    const wineTypeData = dashboard.wine_types.map(function (wine) {
      return {
        name: wine.wine_type,
        value: wine.total
      };
    });

    return (
    <section>

      <h1>Dashboard</h1>
        {currentUser && (
          <p>Role: {currentUser.role}</p>
        )}


      <div className="dashboard-grid">

        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/admin/restaurants/${restaurantId}/wines/availability`
            )
          }
        >
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
            Total Wines = {' '}
            {dashboard.total_wines}
            <br />
            Available Wines = {' '}
            {dashboard.available_wines}
            <br />
            Unavailable wines ={' '}
            {dashboard.unavailable_wines}


          </p>

        </article>


        <article className="dashboard-card"
          onClick={() =>
            navigate(
              `/admin/restaurants/${restaurantId}/wines/availability`
            )
          }
        >

          <h2>Wine Collection</h2>

          <div className="dashboard-chart">

            <ResponsiveContainer width="100%" height={350}>

              <BarChart
                layout="vertical"
                data={wineTypeData}
              >

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#8b3a4a"
                  radius={[0, 4, 4, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </article>

        {currentUser &&
          ["owner", "manager"].includes(currentUser.role) && (
            <article className="dashboard-card">
              <h2>Users</h2>

              <h2 className="dashboard-card-value">
                Total Users ={" "}
                {dashboard.total_users}
              </h2>
              {dashboard.users.map(function (user) {
                return (
                  <p key={user.role}>
                    {user.role} = {user.total}
                  </p>
                );
              })}

              <button
                type="button" className="wine-update-button"
                onClick={() =>
                  navigate(
                    `/admin/restaurants/${restaurantId}/users/add`
                  )
                }
              >
                Add a new User
              </button>
            </article>

        )}        
      </div>


      {validationError && (
        <p>{validationError}</p>
      )}

    </section>
  );
}


export default Dashboard;