import { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";


function Dashboard() {
  const { currentUser } = useContext(AuthContext);

  console.log(currentUser);

  return (
    <main>
      <h1>Dashboard</h1>

      {currentUser && (
        <p>Role: {currentUser.role}</p>
      )}
    </main>
  );
}

export default Dashboard;