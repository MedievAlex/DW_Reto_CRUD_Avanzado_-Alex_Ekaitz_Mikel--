document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const parrafo = document.getElementById("mensaje");

      try {
        const response = await fetch("../../api/AddUser.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
          parrafo.innerText = result.message;
          parrafo.style.color = "green";
          localStorage.setItem("actualProfile", JSON.stringify(data.resultado));
          window.location.href = "main.html";
        } else if (response.status === 400) {
          parrafo.innerText = result.message;
          parrafo.style.color = "red";
        }
      } catch (error) {
        parrafo.innerText = "Error al crear el usuario.";
        parrafo.style.color = "red";
      }
    });
});
