document.addEventListener("DOMContentLoaded", async () => {
  await cargar_Reviews();
});

async function get_all_reviews() {
  const response = await fetch("../../api/Reviews.php");
  const result = await response.json();
  return result.data;
}
async function get_review(videogame_code) {
  try {
    const response = await fetch(
      `/api/Review.php?vcode=${encodeURIComponent(videogame_code)}`,
    );
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Error al obtener la review");
    }
    return data;
  } catch (error) {
    console.error("Error obteniendo review:", error.message);
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}
async function create_review(videogame_code, score, description, date) {
  try {
    if (!score) {
      alert("la puntuacion del juego es obligatorio");
      return;
    }
    if (!description) {
      alert("la descripcion de su experencia en el juego es obligatorio");
      return;
    }

    if (!videogame_code) {
      alert("El ID del videojuego es obligatorio");
      return;
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

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Error al crear la review");
      return data;
    }
    return data;
  } catch (error) {
    console.error("Error en create_review:", error.message);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: [],
    };
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
  const result = await response.json();
  alert("Se ha modificado la review correctamente");
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
    console.log(result.data);
    return result.data;
  } else {
    alert("Error al obtener la review");
  }
}
//falta arreglar lo de el nombre del juego mas lo del profile
async function cargar_Reviews() {
  const reviews = await get_all_reviews();
  const container = document.getElementById("reviews");

  for (const review of reviews) {
    const game = await get_videogame(review.V_CODE);
    const profile = "asanchez";
    //const profile = await get_profile(review.PROFILE_CODE);

    container.innerHTML += `
            <div class="gameReview">
                <div class="reviewUser">
                    <div class="reviewUserName">
                        ${profile}
                    </div>
                    <div class="reviewDate">
                        ${review.R_DATE}
                    </div>
                </div>
                <div class="reviewData">
                    <div class="reviewTopData">
                        <div>${game.V_NAME}</div>
                        <div>${review.R_SCORE}</div>
                    </div>
                    <div class="reviewBottomData">
                        <p>${review.R_DESCRIPTION}</p> 
                    </div>
                </div>
            </div>`;
  }
}
