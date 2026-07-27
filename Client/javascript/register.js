function register_admin() {
    
    // getting values from html 
    var restaurant_id = Number(document.getElementById("restaurant_id").value);
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if (!validateRegistration(restaurant_id,username,password)) {
        return;
    }
    // object sent to Flask backend
    var entry = {
        restaurant_id: restaurant_id,
        username: username,
        password: password
    };

     // Send POST request to Flask backend with method, body preventing browser from caching and telling flask its JSON data
    fetch(`http://localhost:8080/addAdmin`, {
        method: "POST",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })

    // Check response from Flask
    .then(function(response) {
        if (response.status !==200) {
            console.log(`response status was not 200: ${response.status}`);
            return response.json();
        }
        console.log("received new admin user")
        // had to return in order to use the next .then function
        return response.json()
    })

    .then(function(json) {
        console.log(json);
        document.getElementById("message").innerHTML = json.message || json.error;

        if(json.message){
            // clearing fields
            document.getElementById("registerForm").reset();

            // redirect to dashboard page    
            window.location.href = "login.html";
        }

    });

}