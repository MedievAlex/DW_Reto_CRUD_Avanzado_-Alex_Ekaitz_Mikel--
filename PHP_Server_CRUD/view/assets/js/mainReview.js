// ==============================
// VARIABLES GLOBALES
// ==============================

let isLoadingReviews = false;

// ==============================
// EVENTO PARA CARGAR REVIEWS
// ==============================

window.addEventListener("sessionVerified", async () => {
  if (isLoadingReviews) return;
  isLoadingReviews = true;

  try {
    let profile = await get_profile();
    document.getElementById("adjustDataID").innerHTML = profile.USER_NAME;
    await cargar_Reviews();
  } catch (error) {
    console.error("Error al cargar reviews:", error);
    alert("Error al cargar las reviews");
  } finally {
    isLoadingReviews = false;
  }
});

// ==============================
// FUNCIONES DE API PARA REVIEWS
// ==============================

async function get_all_reviews() {
  const response = await fetch("../../api/Reviews.php");
  const result = await response.json();
  return result.data || [];
}

async function get_review(videogame_code) {
  try {
    const response = await fetch(
      `../../api/Review.php?vcode=${encodeURIComponent(videogame_code)}`,
    );
    const result = await response.json();
    if (!response.ok) {
      alert(result.message || "Error al obtener la review");
      return [];
    }
    return result.data || [];
  } catch (error) {
    console.error("Error obteniendo review:", error.message);
    return [];
  }
}

async function create_review(videogame_code, score, description, date) {
  try {
    if (!score) {
      alert("la puntuacion del juego es obligatorio");
      return [];
    }
    if (!description) {
      alert("la descripcion de su experencia en el juego es obligatorio");
      return [];
    }

    if (!videogame_code) {
      alert("El ID del videojuego es obligatorio");
      return [];
    }

    const form = new FormData();
    form.append("vcode", videogame_code);
    form.append("score", score);
    form.append("description", description);
    form.append("date", date);

    const response = await fetch("../../api/Review.php", {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.message || "Error al crear la review");
      return [];
    }
    return result.data || [];
  } catch (error) {
    console.error("Error en create_review:", error.message);
    return [];
  }
}

async function update_review(score, date, description) {
  if (!score) {
    alert("la puntuacion del juego es obligatorio");
    return;
  }
  if (!description) {
    alert("la descripcion de su experencia en el juego es obligatorio");
    return;
  }
  const form = new FormData();
  form.append("score", score);
  form.append("description", description);
  form.append("date", date);
  const response = await fetch("../../api/Review.php", {
    method: "PUT",
    body: new URLSearchParams(form),
  });

  if (!response.ok) {
    alert("Error al modificar la review.");
  } else {
    alert("Se ha modificado la review correctamente");
  }
}

async function delete_review(videogame_code) {
  if (!confirm("Are you sure you want to delete this review?")) return;
  const response = await fetch(
    `../../api/Review.php?id=${encodeURIComponent(videogame_code)}`,
    {
      method: "DELETE",
    },
  );
  const result = await response.json();
  alert("Eliminada la review correctamente");
}

async function get_videogame(videogame_id) {
  const response = await fetch(
    `../../api/Videogame.php?id=${encodeURIComponent(videogame_id)}`,
  );
  const result = await response.json();
  if (response.ok) {
    return result.data || [];
  } else {
    alert("Error al obtener el videojuego");
    return [];
  }
}

async function get_profile(profilecode = null) {
  const url = profilecode
    ? `../../api/GetProfile.php?pcode=${encodeURIComponent(profilecode)}`
    : "../../api/GetProfile.php";

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    return result.data || [];
  } else {
    alert("Error al obtener el profile");
    return [];
  }
}

// ==============================
// CARGA Y GESTIÓN DE REVIEWS
// ==============================

async function cargar_Reviews() {
  try {
    const reviews = await get_all_reviews();
    const container = document.getElementById("reviews");

    container.innerHTML = "";

    for (const review of reviews) {
      const gameData = await get_videogame(review.V_CODE);
      const profileData = await get_profile(review.PROFILE_CODE);

      const game = gameData.length > 0 ? gameData[0] : null;
      const profile = profileData.length > 0 ? profileData[0] : null;

      const reviewHTML = `
        <div class="gameReview">
          <div class="reviewUser">
            <div class="reviewUserName">
              ${profile ? profile.USER_NAME : "Usuario desconocido"}
            </div>
            <div class="reviewDate">
              ${review.R_DATE}
            </div>
          </div>
          <div class="reviewData">
            <div class="reviewTopData">
              <div>${game ? game.V_NAME : "Juego desconocido"}</div>
              <div>${review.R_SCORE}/10</div>
            </div>
            <div class="reviewBottomData">
              <p>${review.R_DESCRIPTION}</p>
            </div>
          </div>
        </div>`;

      container.insertAdjacentHTML("beforeend", reviewHTML);
    }
  } catch (error) {
    console.error("Error al cargar reviews:", error);
    const container = document.getElementById("reviews");
    if (container) {
      container.innerHTML = `
        <div class="error">
          <p>Error al cargar las reviews: ${error.message}</p>
          <button onclick="cargar_Reviews()">Reintentar</button>
        </div>
      `;
    }
  }
}
