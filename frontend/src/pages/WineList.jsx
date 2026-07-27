import { useParams } from "react-router-dom";

// function to show react-dom information params: https://www.w3schools.com/React/showreact.asp?filename=demo_react_router_params
function WineList() {
  const { restaurantId } = useParams();

  return (
    <main>
      <h1>Wine List</h1>
      <p>Restaurant ID: {restaurantId}</p>
    </main>
  );
}

export default WineList;