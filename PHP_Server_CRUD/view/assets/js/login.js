document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username")?.value || "";
      const password = document.getElementById("password")?.value || "";
      const parrafo = document.getElementById("mensaje");

      const formaData = new FormData();
      formaData.append("username", username);
      formaData.append("password", password);

      try {
        const response = await fetch("../../api/Login.php", {
          method: "POST",
          body: formaData,
        });

        const rawResponse = await response.text();
        const result = JSON.parse(rawResponse);

        if (response.ok) {
          parrafo.innerText = result.message || "Inicio de sesión exitoso";
          parrafo.style.color = "green";

          if (typeof result.data === "object") {
            localStorage.setItem("actualProfile", JSON.stringify(result.data));
          } else {
            localStorage.setItem("actualProfile", result.data);
          }

          setTimeout(() => {
            window.location.href = "menu.html";
          }, 1000);
        } else if (response.status === 403) {
          parrafo.innerText = result.message || "Credenciales incorrectas";
          parrafo.style.color = "red";

          setTimeout(() => {
            parrafo.innerText = "";
          }, 5000);
        } else {
          parrafo.innerText = result.message || "Error desconocido";
          parrafo.style.color = "red";

          setTimeout(() => {
            parrafo.innerText = "";
          }, 5000);
        }
      } catch (error) {
        console.error("Error completo en login:", error);
        parrafo.innerText = "Error de conexión. Por favor, inténtalo de nuevo.";
        parrafo.style.color = "red";
      }
    });
});
