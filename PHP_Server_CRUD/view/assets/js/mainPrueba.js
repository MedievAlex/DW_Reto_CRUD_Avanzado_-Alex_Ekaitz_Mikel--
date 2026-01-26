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
  //LISTS
  const getlists = document.getElementById("getlists");
  const getlist = document.getElementById("getlist");
  const createlist = document.getElementById("createlist");
  const updatelist = document.getElementById("updatelist");
  const deletelist = document.getElementById("deletelist");
  const deletegamefromlist = document.getElementById("deletegamefromlist");

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
  //EVENTOS LISTS
  getlists.onclick = function () {
    get_lists();
  };
  getlist.onclick = function () {
    get_list(list);
  };
  createlist.onclick = function () {
    create_list(list, videogame_code);
  };
  updatelist.onclick = function () {
    update_list(new_list, old_list);
  };
  deletelist.onclick = function () {
    delete_list(list);
  };
  deletegamefromlist.onclick = function () {
    delete_game_from_list(list, videogame_id);
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
/*Metodos LISTS*/
async function get_lists() {
  const response = await fetch("../../api/Lists.php");
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener las listas.");
  }
}
async function get_list(list) {
  try {
    if (!list) {
      alert("El nombre de la lista es obligatorio");
    }
    const response = await fetch(
      `/api/List.php?list=${encodeURIComponent(list)}`,
    );

    const result = await response.json();
    console.log(result.data);
    if (!response.ok) {
      alert(result.message || "Error al obtener la lista");
    }
    return result.data;
  } catch (error) {
    console.error("Error en get_list:", error.message);
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
}
async function create_list(list, videogame_id) {
  try {
    if (!list) {
      alert("El nombre de la lista es obligatorio");
      return;
    }

    if (!videogame_id) {
      alert("El ID del videojuego es obligatorio");
      return;
    }
    const form = new FormData();
    form.append("list", list);
    form.append("vcode", videogame_id);
    const response = await fetch("../../api/List.php", {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    console.log(result.data);
    if (!response.ok) {
      alert(result.message || "Error al crear la lista");
      return result;
    }
    return result.data;
  } catch (error) {
    console.error("Error en create_list:", error.message);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: [],
    };
  }
}
async function update_list(new_list, old_list) {
  const form = new FormData();
  form.append("new_list", new_list);
  form.append("old_list", old_list);
  const response = await fetch("../../api/List.php", {
    method: "PUT",
    body: new URLSearchParams(form),
  });
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    alert("Se ha modificado la lista correctamente");
  } else {
    alert("Error al modificar la lista.");
  }
}
async function delete_list(list) {
  if (!confirm("Are you sure you want to delete this list?")) return;
  const response = await fetch(
    `../../api/List.php?list=${encodeURIComponent(list)}`,
    {
      method: "DELETE",
    },
  );
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    alert("Eliminada la lista correctamente");
  } else {
    alert("Error eliminado la lista.");
  }
}
async function delete_game_from_list(list, videogame_id) {
  const response = await fetch(
    `../../api/List.php?list=${encodeURIComponent(list)}&vcode=${encodeURIComponent(videogame_id)}`,
    {
      method: "DELETE",
    },
  );
  const result = await response.json();
  console.log(result.data);
  if (result.ok) {
    alert("Eliminado el juego de la lista correctamente");
  } else {
    alert("Error al eliminar el juego de la lista");
  }
}


async function get_profile() {
  const response = await fetch("../../api/CheckSession.php", {
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
    //console.log("Juegos obtenidos:", games);
    //console.log("Número de juegos:", games?.length);

    if (!games || games.length === 0) {
      //console.error("No se obtuvieron juegos");
      document.getElementById("PC").innerHTML =
        "<p>No hay juegos disponibles</p>";
      return;
    }
   //console.log(" Verificando contenedores...");
    const contenedores = ["PC", "NINTENDO", "XBOX", "PLAYSTATION"];
    contenedores.forEach((id) => {
      const elemento = document.getElementById(id);
      //console.log(`Contenedor ${id}:`, elemento ? "✅ Existe" : "❌ NO existe");
    });
    contenedores.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) elemento.innerHTML = "";
    });
    //let juegosProcesados = 0;
    let juegosSinPlataforma = 0;
    games.forEach((game, index) => {
      /*console.log(`\n--- Juego ${index + 1} ---`);
      console.log("Datos del juego:", game);
      console.log("Nombre:", game.V_NAME);
      console.log("Plataforma:", game.V_PLATAFORM);
      console.log("PEGI:", game.V_PEGI);
      console.log("Release:",game.V_RELEASE);*/
      const nombre =  game.V_NAME || "Sin nombre";
      const pegi =  game.V_PEGI || "PEGI ?";
      const release = game.V_RELEASE || "Fecha desconocida";
      const plataforma = game.V_PLATAFORM || "Plataforma desconocida";
      //console.log("Valores normalizados:", {nombre,plataforma,pegi,release,});
      const gameHTML = `
        <div class="game">
                    <div class="gameCover">
                        <img src="../assets/img/covers/LibraryOfRuina.png" />
                    </div>
                    <div class="heartIcon">
                        <img src="../assets/img/icons/red_heart.png" />
                    </div>
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
