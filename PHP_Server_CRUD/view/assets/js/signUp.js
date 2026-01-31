document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username")?.value || "";
    const password = document.getElementById("password")?.value || "";
    const password2 = document.getElementById("password2")?.value || "";
    const parrafo = document.getElementById("mensaje");

    if (!username.trim() || username.length < 3) {
      parrafo.innerText = "El usuario debe tener al menos 3 caracteres";
      parrafo.style.color = "red";
      return;
    }

    if (!password.trim() || password.length < 6) {
      parrafo.innerText = "La contraseña debe tener al menos 6 caracteres";
      parrafo.style.color = "red";
      return;
    }

    if (password !== password2) {
      parrafo.innerText = "Las contraseñas no coinciden";
      parrafo.style.color = "red";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("../../api/AddUser.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        parrafo.innerText = result.message;
        parrafo.style.color = "green";

        if (response.status === 201) {
          localStorage.setItem("actualProfile", JSON.stringify(result.data));
          setTimeout(() => {
            window.location.href = "menu.html";
          }, 1000);
        }
      } else {
        parrafo.innerText = result.message || "Error desconocido";
        parrafo.style.color = "red";

        setTimeout(() => {
          parrafo.innerText = "";
        }, 5000);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      parrafo.innerText = "Error de conexión. Inténtalo de nuevo.";
      parrafo.style.color = "red";
    }
  });
});
