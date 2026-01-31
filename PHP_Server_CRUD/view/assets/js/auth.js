const LOGIN_PAGE = "login.html";
const SIGNUP_PAGE = "signup.html";
const PUBLIC_PAGES = [LOGIN_PAGE, SIGNUP_PAGE];
const PRIVATE_PAGES = ["main.html", "menu.html", "reviews.html", "lists.html"];
const currentPage = window.location.pathname.split("/").pop();

async function comprobarSession() {
  try {
    const response = await fetch("../../api/CheckSession.php", {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      if (document.getElementById("contenido")) {
        document.getElementById("contenido").style.display = "block";
      }

      if (PUBLIC_PAGES.includes(currentPage)) {
        window.location.href = "menu.html";
      }
    } else {
      if (PRIVATE_PAGES.includes(currentPage)) {
        window.location.href = LOGIN_PAGE;
      }
    }
  } catch (error) {
    console.error("Error comprobando sesión:", error);

    if (PRIVATE_PAGES.includes(currentPage)) {
      window.location.href = LOGIN_PAGE;
    }
  }
}

if (PUBLIC_PAGES.includes(currentPage) || PRIVATE_PAGES.includes(currentPage)) {
  comprobarSession();
}
