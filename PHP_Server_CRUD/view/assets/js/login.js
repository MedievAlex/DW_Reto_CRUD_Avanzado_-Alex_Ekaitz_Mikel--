document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      let response = await login(username, password);

      if (response.status === 403) {
        if (response) {
          alert("Incorrect credentials.");
        } else {
          if (response["data"]) {
            let string = JSON.stringify(response["data"]);
            let user = JSON.parse(string);
            console.log(user);
            localStorage.setItem("actualProfile", string);
            window.location.href = "main.html";
          }
        }
      } else {
        console.log("Server error.");
      }
    });

  async function login(username, password) {
    const response = await fetch("../../api/Login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    let data = await response.json();

    return data;
  }
});
