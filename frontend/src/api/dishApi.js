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

// Updates one dish.
export function updateDish(entry) {
  return fetch(`${API_URL}/updateDish`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error || json.errors);
        }

        return json;
      });
    });
}

// Gets all sauces for the logged-in restaurant.
export function getAllSauces() {
  return fetch(`${API_URL}/getAllSauces`, {
    method: "GET",
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


// Updates one sauce.
export function updateSauce(entry) {
  return fetch(`${API_URL}/updateSauce`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error || json.errors);
        }

        return json;
      });
    });
}

// Generate AI dish profiles before uploading it to DB.
export function uploadDishesAI(entry) {
  return fetch(`${API_URL}/uploadDishesAI`, {
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