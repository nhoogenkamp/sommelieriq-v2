function logoutAdmin() {
    fetch(`http://localhost:8080/logout`, {
        method: "POST",
        credentials: "include"
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        console.log(json);

        window.location.href = "/pages/login.html";
    });
}