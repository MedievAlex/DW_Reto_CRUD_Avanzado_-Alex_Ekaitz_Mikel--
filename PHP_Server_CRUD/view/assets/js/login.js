document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("../../api/Login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok) {
          if (typeof result.data === 'object') {
            localStorage.setItem("actualProfile", JSON.stringify(result.data));
          } else {
            localStorage.setItem("actualProfile", result.data);
          }
          window.location.href = "main.html";
        } else if (response.status === 403) {
          alert(result.message);
        } else {
          alert("Error: " + (result.message || "Error desconocido"));
        }
      } catch (error) {
        console.error("Error completo en login:", error);
        alert("Error de conexión. Por favor, inténtalo de nuevo.");
      }
    });
});