const API_URL = import.meta.env.VITE_FLASK_API;

// Delete a dish
export function deleteDish(entry) {
  return fetch(`${API_URL}/deleteDish`, {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}

// Gets all dishes for one restaurant.
export function getDishes(restaurantId) {
  return fetch(`${API_URL}/getDishes`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}

// Uploading sauces
export function uploadSauces(entry) {
  return fetch(`${API_URL}/uploadSauces`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {

          // Builds one error message from all row errors.
          if (json.errors) {
            let message = "";

            json.errors.forEach(function (row) {
              message += `Row ${row.row}: ${row.errors.join(", ")}\n`;
            });

            throw new Error(message);
          }

          throw new Error(json.error);
        }

        return json;
      });
    });
}