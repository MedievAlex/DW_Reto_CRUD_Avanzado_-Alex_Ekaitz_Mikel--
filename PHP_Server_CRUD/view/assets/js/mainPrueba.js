document.addEventListener("DOMContentLoaded", async () => {
  let profile = get_profile();
  create_cards();
  //Cuestionarios

  //GAMES
  const obtenerJuegos = document.getElementById("btnvideojuegoobtener");
  const buscarjuego = document.getElementById("buscarjuego");
  const creategame = document.getElementById("creategame");
  const updatevideogame = document.getElementById("updatevideogame");
  const deletegame = document.getElementById("deletegame");
  //REVIEWS
  const getreviews = document.getElementById("getreviews");
  const getreview = document.getElementById("getreview");
  const createreview = document.getElementById("createreview");
  const updatereview = document.getElementById("updatereview");
  const deletereview = document.getElementById("deletereview");

  //EVENTOS JUEGOS
  obtenerJuegos.onclick = function () {
    get_all_videogames();
  };
  buscarjuego.onclick = function () {
    //let videogame_code = document.getElementById("");
    get_videogame(videogame_code);
  };
  creategame.onclick = function () {
    create_videogame(nombre, release, platform, pegi);
  };
  updatevideogame.onclick = function () {
    update_videogame(videogame_id, nombre, release, platform, pegi);
  };
  deletegame.onclick = function () {
    delete_videogame(videogame_id);
  };
  //EVENTOS REVIEWS
  getreviews.onclick = function () {
    get_all_reviews();
  };
  getreview.onclick = function () {
    get_review(videogame_code);
  };
  createreview.onclick = function () {
    create_review(videogame_code, score, description, date);
  };
  updatereview.onclick = function () {
    update_review(score, date, description);
  };
  deletereview.onclick = function () {
    delete_review(videogame_code);
  };
});

/*Metodos REVIEWS*/
async function get_all_reviews() {
  const response = await fetch("../../api/Reviews.php");
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener las reviews");
    return;
  }
}
async function get_review(videogame_code) {
  try {
    const response = await fetch(
      `/api/Review.php?vcode=${encodeURIComponent(videogame_code)}`,
    );
    const result = await response.json();
    console.log(result.data);
    if (!response.ok) {
      alert(data.message || "Error al obtener la review");
    }
    return result.data;
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

    const result = await response.json();
    console.log(result.data);
    if (!response.ok) {
      alert(result.message || "Error al crear la review");
      return result.data;
    }
    return result.data;
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
  console.log(result.data);
  if (response.ok) {
    alert("Se ha modificado la review correctamente");
  } else {
    alert("Error al modificar la review");
  }
  s;
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
  console.log(result.data);
  if (response.ok) {
    alert("Eliminada la review correctamente");
  } else {
    alert("Error al eliminar la review");
  }
}
/*Metodos VIDEOGAMES*/
async function get_all_videogames() {
  const response = await fetch("../../api/Videogames.php");
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    return result.data;
  } else {
    alert("Errorr al obtener los juegos");
  }
}
async function get_videogame(videogame_id) {
  const response = await fetch(
    `../../api/Videogame.php?id=${encodeURIComponent(videogame_id)}`,
  );
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener la review");
  }
}
async function create_videogame(nombre, release, platform, pegi) {
  try {
    const form = new FormData();
    form.append("name", nombre);
    form.append("release", release);
    form.append("platform", platform);
    form.append("pegi", pegi);
    const response = await fetch("../../api/Videogame.php", {
      method: "POST",
      body: form,
    });
    const result = await response.json();
    console.log(result.data);
    if (!response.ok) {
      alert(resultt.message || "Error al crear el juego");
      return result;
    }
    return result.data;
  } catch (error) {
    console.error("Error en create_videogame:", error.message);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: [],
    };
  }
}
async function update_videogame(videogame_id, nombre, release, platform, pegi) {
  if (!nombre) {
    alert("el nombre del juego es obligatorio");
    return;
  }
  if (!platform) {
    alert("la plataforma del juego es obligatorio");
    return;
  }
  if (!pegi) {
    alert("el pegi del juego es obligatorio");
    return;
  }
  const form = new FormData();
  form.append("id", videogame_id);
  form.append("name", nombre);
  form.append("release", release);
  form.append("platform", platform);
  form.append("pegi", pegi);
  const response = await fetch("../../api/Videogame.php", {
    method: "PUT",
    body: new URLSearchParams(form),
  });
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    alert("Se ha modificado el juego correctamente");
  } else {
    alert("Error al mopdificar el juego");
  }
}
async function delete_videogame(videogame_id) {
  if (!confirm("Are you sure you want to delete this game?")) return;
  const response = await fetch(
    `../../api/Review.php?id=${encodeURIComponent(videogame_id)}`,
    {
      method: "DELETE",
    },
  );
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    alert("Eliminada el juego correctamente");
  } else {
    alert("Error eliminado el juego.");
  }
}


async function get_profile() {
  const response = await fetch("../../api/GetProfile.php", {
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener el profile");
  }
}
/*CREACION DE ELEMENTOS */
async function create_cards() {
  try {
    const games = await get_all_videogames();

    if (!games || games.length === 0) {
      document.getElementById("PC").innerHTML =
        "<p>No hay juegos disponibles</p>";
      return;
    }
    const contenedores = ["PC", "NINTENDO", "XBOX", "PLAYSTATION"];
    contenedores.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.innerHTML = "";
    });
    //let juegosProcesados = 0;
    let juegosSinPlataforma = 0;
    games.forEach(game => {
      const nombre =  game.V_NAME || "Sin nombre";
      const imagen = game.V_NAME.replace(/ /g,"").toLowerCase();
      const pegi =  game.V_PEGI || "PEGI ?";
      const release = game.V_RELEASE || "Fecha desconocida";
      const plataforma = game.V_PLATFORM || "Plataforma desconocida";
      const gameHTML = `
                  <div class="game">
                    <div class="gameCover">
                        <img src="../assets/img/covers/${imagen}.png" />
                    </div>
                    <div class="data">
                        <div class="gameData">
                            <div class="gameTitle">
                                <h3>${nombre}</h3>
                            </div>
                            <div class="gamePEGI">
                                ${pegi}
                            </div>
                            <div class="gameRelease">
                                Release: ${release}
                            </div>
                        </div>
                        <div class="heartIcon">
                            <img class="corazon" src="../assets/img/icons/red_heart.png" />
                        </div>
                    </div>
                </div>
      `;
      let contenedorId = null;
      if (plataforma.includes("PC")) {
        contenedorId = "PC";
      } else if (
        plataforma.includes("NINTENDO")) {
        contenedorId = "NINTENDO";
      } else if (plataforma.includes("XBOX")) {
        contenedorId = "XBOX";
      } else if (
        plataforma.includes("PLAYSTATION")) {
        contenedorId = "PLAYSTATION";
      } else {
        console.error(
          ` Plataforma no reconocida: "${plataforma}" para "${nombre}"`,
        );
        contenedorId = "PC"; 
        juegosSinPlataforma++;
      }
      const contenedor = document.getElementById(contenedorId);
      if (contenedor) {
        contenedor.innerHTML += gameHTML;
        //juegosProcesados++;
        //console.log(` Añadido a ${contenedorId}: "${nombre}"`);
      } else {
        console.error(
          ` Contenedor ${contenedorId} no encontrado para "${nombre}"`,
        );
      }
    });
  } catch (error) {
    console.error(" ERROR al crear las cartas:", error);
    document.getElementById("PC").innerHTML = `
      <div class="error">
        <p>Error al cargar los juegos: ${error.message}</p>
        <button onclick="create_cards()">Reintentar</button>
      </div>
    `;
  }
}
