const API_URL = "http://localhost:8080";


export async function getRestaurantWines(restaurantId) {
  const response = await fetch(`${API_URL}/getWines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant_id: Number(restaurantId),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to load the wine list.");
  }

  return response.json();
}