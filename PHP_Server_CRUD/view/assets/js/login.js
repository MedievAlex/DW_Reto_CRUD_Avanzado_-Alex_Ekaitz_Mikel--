document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const response = await fetch("../../api/Login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();

        localStorage.setItem("actualProfile", result.data);
        window.location.href = "main.html";
      } else if (response.status === 403) {
        alert("Incorrect credentials.");
      } else if (response.status === 500) {
        console.log("Server error.");
      }
    });
});
