function login_admin() {
    
    // getting values from html 
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // validating login in validation.js
    if (!validateLogin(username,password)) {
        return;
    }

    // object sent to Flask backend
    var entry = {
        username: username,
        password: password
    };

     // Send POST request to Flask backend with method, body preventing browser from caching and telling flask its JSON data
    fetch(`http://localhost:8080/adminLogin`, {
        method: "POST",
        credentials: "include",
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
            document.getElementById("loginForm").reset();
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
            document.getElementById("loginForm").reset();

            // redirect to dashboard page    
            window.location.href = "dashboard.html";
        }

    });

}