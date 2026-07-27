const navbarPath =
    window.location.pathname.includes("/pages/")
    ? "../components/navbar.html"
    : "./components/navbar.html";

fetch(navbarPath)
.then(response => response.text())
.then(data => {

    document.getElementById("navbar").innerHTML = data;

    const nav = document.querySelector("#navbar nav");

    const dashboardLink = document.getElementById("dashboardLink");

    if (dashboardLink) {
        dashboardLink.style.display = "none";
    }

    fetch(`http://localhost:8080/checkAdmin`, {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            return { logged_in: false };
        }
        return response.json();
    })
    .then(json => {

        const loggedIn = json.logged_in === true;

        if (dashboardLink) {
            dashboardLink.style.display = loggedIn ? "inline-block" : "none";
        }

        if (loggedIn && nav && !document.getElementById("logoutBtn")) {
            const logoutBtn = document.createElement("button");

            logoutBtn.innerText = "Logout";
            logoutBtn.id = "logoutBtn";
            logoutBtn.onclick = logoutAdmin;

            nav.appendChild(logoutBtn);
        }

        if (!loggedIn && window.location.pathname.includes("dashboard.html")) {
            window.location.href = "/pages/login.html";
        }
    })
    .catch(error => {
        console.error("Navbar auth check failed:", error);

        if (window.location.pathname.includes("dashboard.html")) {
            window.location.href = "/pages/login.html";
        }
    });
});