// storing link in .env https://vite.dev/guide/env-and-mode
const API_URL = import.meta.env.VITE_FLASK_API;

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