const LOGIN_PAGE = "login.html";
const SIGNUP_PAGE = "signup.html";
const PUBLIC_PAGES = [LOGIN_PAGE, SIGNUP_PAGE];
const PRIVATE_PAGES = ["main.html", "menu.html", "reviews.html", "lists.html"];
const currentPage = window.location.pathname.split("/").pop();

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logoutLink");

  if (logoutLink) {
    logoutLink.addEventListener("click", logout);
  }
});

if (PUBLIC_PAGES.includes(currentPage) || PRIVATE_PAGES.includes(currentPage)) {
  comprobarSession();
}

async function comprobarSession() {
  try {
    const response = await fetch("../../api/CheckSession.php", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      if (PUBLIC_PAGES.includes(currentPage)) {
        window.location.href = "menu.html";
      } else if (PRIVATE_PAGES.includes(currentPage)) {
        document.body.style.visibility = "visible";
        window.dispatchEvent(new Event("sessionVerified"));
      }
    } else {
      if (PRIVATE_PAGES.includes(currentPage)) {
        window.location.href = LOGIN_PAGE;
      } else {
        document.body.style.visibility = "visible";
      }
    }
  } catch (error) {
    console.error("Error comprobando sesión:", error);

    if (PRIVATE_PAGES.includes(currentPage)) {
      window.location.href = LOGIN_PAGE;
    } else {
      document.body.style.visibility = "visible";
    }
  }
}

async function logout(event) {
  if (event) event.preventDefault();

  await fetch("../../api/Logout.php", {
    method: "GET",
    credentials: "include",
  });

  window.location.href = LOGIN_PAGE;
}
