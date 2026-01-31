window.addEventListener("sessionVerified", async () => {
  let profile = await get_profile();
  document.getElementById("adjustDataID").innerHTML = profile.USER_NAME;
  await load_lists();
});

let todasLasListas = [];
let listaSeleccionada = null;
let nombreListaActual = null;

function setup_event_listeners() {
  const renameButtons = document.querySelectorAll(".rename");
  const deleteButtons = document.querySelectorAll(".delete");
  const listDivs = document.querySelectorAll(".list");

  listDivs.forEach((listDiv) => {
    listDiv.onclick = async function (event) {
      if (event.target.closest(".rename") || event.target.closest(".delete")) {
        return;
      }

      const nombreListDiv = this.querySelector(".nombreList");
      const listName = nombreListDiv.textContent.trim();

      if (listaSeleccionada && listaSeleccionada !== this) {
        listaSeleccionada.style.fontWeight = "normal";
      }

      this.style.fontWeight = "bold";
      listaSeleccionada = this;
      nombreListaActual = listName;

      await show_games_from_list(listName);
    };
  });

  renameButtons.forEach((button) => {
    button.onclick = async function (event) {
      event.stopPropagation();
      const listItem = this.closest(".list");
      const nombreListDiv = listItem.querySelector(".nombreList");
      const oldname = nombreListDiv.textContent.trim();

      const newname = prompt("Introduce el nuevo nombre:", oldname);

      if (newname && newname.trim() !== "" && newname !== oldname) {
        const newnameTrimmed = newname.trim();

        let exists = false;

        for (let i = 0; i < todasLasListas.length; i++) {
          const lista = todasLasListas[i];
          if (lista.L_NAME.toLowerCase() === newnameTrimmed.toLowerCase()) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          await update_list(newnameTrimmed, oldname);
          nombreListDiv.textContent = newnameTrimmed;

          for (let i = 0; i < todasLasListas.length; i++) {
            if (todasLasListas[i].L_NAME === oldname) {
              todasLasListas[i].L_NAME = newnameTrimmed;
              break;
            }
          }

          if (oldname === nombreListaActual) {
            nombreListaActual = newnameTrimmed;
          }

          if (listaSeleccionada === listItem) {
            await show_games_from_list(newnameTrimmed);
          }
        } else {
          alert("El nombre introducido ya existe.");
        }
      }
    };
  });

  deleteButtons.forEach((button) => {
    button.onclick = async function (event) {
      event.stopPropagation();
      const listItem = this.closest(".list");
      const nombreListDiv = listItem.querySelector(".nombreList");
      const listName = nombreListDiv.textContent.trim();

      if (
        confirm(`¿Estás seguro de que quieres eliminar la lista "${listName}"?`)
      ) {
        await delete_list(listName);
        listItem.closest("li").remove();

        for (let i = 0; i < todasLasListas.length; i++) {
          if (todasLasListas[i].L_NAME === listName) {
            todasLasListas.splice(i, 1);
            break;
          }
        }

        if (listaSeleccionada === listItem) {
          listaSeleccionada = null;
          nombreListaActual = null;

          const nuevaPrimeraLista = document.querySelector(".list");
          if (nuevaPrimeraLista) {
            nuevaPrimeraLista.click();
          } else {
            clean_games();
          }
        }
      }
    };
  });
}

function setup_game_buttons() {
  const addToListButtons = document.querySelectorAll(".addToList");
  addToListButtons.forEach((button) => {
    button.onclick = async function (event) {
      event.stopPropagation();
      const gameDiv = this.closest(".game");
      const gameId = gameDiv.dataset.gameId;
      const gameName = gameDiv.querySelector(".gameTitle h3").textContent;

      await manage_add_game(gameId, gameName);
    };
  });

  const removeFromListButtons = document.querySelectorAll(".removeFromList");
  removeFromListButtons.forEach((button) => {
    button.onclick = async function (event) {
      event.stopPropagation();
      const gameDiv = this.closest(".game");
      const gameId = gameDiv.dataset.gameId;
      const gameName = gameDiv.querySelector(".gameTitle h3").textContent;

      if (
        confirm(
          `¿Estás seguro de que quieres eliminar "${gameName}" de la lista "${nombreListaActual}"?`,
        )
      ) {
        await delete_game_from_list(nombreListaActual, gameId);
        await show_games_from_list(nombreListaActual);
      }
    };
  });
}

async function manage_add_game(gameId, gameName) {
  const nombreLista = prompt(
    `Introduce el nombre de la lista donde añadir "${gameName}":`,
  );

  if (!nombreLista || nombreLista.trim() === "") {
    return;
  }

  const nombreTrimmed = nombreLista.trim();
  const listaExiste = todasLasListas.find(
    (lista) => lista.L_NAME.toLowerCase() === nombreTrimmed.toLowerCase(),
  );

  if (!listaExiste) {
    if (!confirm(`La lista "${nombreTrimmed}" no existe. ¿Quieres crearla?`)) {
      return;
    }
  }

  const resultado = await create_list(nombreTrimmed, gameId);
  if (!resultado) return;

  const mensaje = listaExiste
    ? `Juego añadido a la lista "${nombreTrimmed}" correctamente`
    : `Lista "${nombreTrimmed}" creada y juego añadido correctamente`;

  alert(mensaje);

  if (!listaExiste) {
    await load_lists();
  }

  if (nombreTrimmed === nombreListaActual) {
    await show_games_from_list(nombreListaActual);
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
    return result.data;
  } else {
    alert("Error al obtener el profile");
  }
}

async function get_lists() {
  try {
    const response = await fetch("../../api/Lists.php", {
      credentials: "include",
    });

    if (response.status === 404) {
      return [];
    }

    const result = await response.json();

    if (response.ok) {
      return result.data;
    } else {
      alert("Error al obtener las listas.");
      return [];
    }
  } catch (error) {
    console.error("Error en get_lists:", error.message);
    alert("Error de conexión al obtener las listas.");
    return [];
  }
}

async function get_list(list) {
  try {
    if (!list) {
      return null;
    }
    const response = await fetch(
      `../../api/List.php?list=${encodeURIComponent(list)}`,
      {
        credentials: "include",
      },
    );

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Error al obtener la lista");
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error en get_list:", error.message);
    return null;
  }
}

async function create_list(list, videogame_id) {
  try {
    if (!list) {
      alert("El nombre de la lista es obligatorio");
      return null;
    }

    if (!videogame_id) {
      alert("El ID del videojuego es obligatorio");
      return null;
    }

    const form = new FormData();
    form.append("list", list);
    form.append("vcode", videogame_id);

    const response = await fetch("../../api/List.php", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const result = await response.json();

    if (response.status === 409) {
      alert("El juego ya existe en esta lista");
      return null;
    }

    if (!response.ok) {
      alert(result.message || "Error al crear/añadir a la lista");
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error en create_list:", error.message);
    alert("Error de conexión con el servidor");
    return null;
  }
}

async function update_list(new_list, old_list) {
  const form = new FormData();
  form.append("new_list", new_list);
  form.append("old_list", old_list);

  const response = await fetch("../../api/List.php", {
    method: "PUT",
    body: new URLSearchParams(form),
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    alert("Se ha modificado la lista correctamente");
  } else {
    alert("Error al modificar la lista.");
  }
}

async function delete_list(list) {
  const response = await fetch(
    `../../api/List.php?list=${encodeURIComponent(list)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  const result = await response.json();
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
      credentials: "include",
    },
  );
  const result = await response.json();
  if (response.ok) {
    alert("Eliminado el juego de la lista correctamente");
  } else {
    alert("Error al eliminar el juego de la lista");
  }
}

async function load_lists() {
  try {
    const lists = await get_lists();
    const container = document.getElementById("listas");

    todasLasListas = lists || [];

    if (!lists?.length) {
      container.innerHTML = "<p>No hay listas disponibles</p>";
      clean_games();
      return;
    }

    container.innerHTML = lists
      .map(
        (list) => `
      <li>
        <div class="list">
          <div class="nombreList">${list.L_NAME}</div>
          <div class="editIcon">
            <img class="rename" src="../assets/img/icons/rename.png" />
            <img class="delete" src="../assets/img/icons/delete.png" />
          </div>
        </div>
      </li>
    `,
      )
      .join("");

    setup_event_listeners();
    document.querySelector(".list")?.click();
  } catch (error) {
    console.error("Error al cargar listas:", error);
    document.getElementById("listas").innerHTML = `
      <div class="error">
        <p>Error al cargar las listas: ${error.message}</p>
        <button onclick="load_lists()">Reintentar</button>
      </div>
    `;
  }
}

async function get_games_from_list(listName) {
  try {
    if (!listName) {
      return null;
    }

    const response = await fetch(
      `../../api/List.php?list=${encodeURIComponent(listName)}`,
      {
        credentials: "include",
      },
    );

    if (response.status === 404) {
      return [];
    }

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Error al obtener los juegos de la lista");
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error("Error en get_games_from_list:", error.message);
    return [];
  }
}

async function get_game_by_id(gameId) {
  try {
    if (!gameId) {
      return null;
    }
    const response = await fetch(
      `../../api/Videogame.php?id=${encodeURIComponent(gameId)}`,
      {
        credentials: "include",
      },
    );

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("Error al obtener el juego:", result.message);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Error en get_game_by_id:", error.message);
    return null;
  }
}

async function show_games_from_list(listName) {
  try {
    const juegosIds = await get_games_from_list(listName);
    const listGamesSection = document.querySelector(".listGames");

    if (!listGamesSection) return;

    if (!juegosIds || juegosIds.length === 0) {
      listGamesSection.innerHTML = "<p>No hay juegos en esta lista</p>";
      return;
    }

    listGamesSection.innerHTML = "<p>Cargando juegos...</p>";

    const juegosCompletos = [];

    for (let i = 0; i < juegosIds.length; i++) {
      const juegoId = juegosIds[i];
      if (juegoId && juegoId.V_CODE) {
        const juegoCompleto = await get_game_by_id(juegoId.V_CODE);
        if (juegoCompleto) {
          juegosCompletos.push(juegoCompleto);
        }
      }
    }

    if (juegosCompletos.length === 0) {
      listGamesSection.innerHTML = "<p>No se pudieron cargar los juegos</p>";
      return;
    }

    let gamesHTML = "";

    juegosCompletos.forEach((game) => {
      if (!game || !game.V_NAME) {
        return;
      }

      const nombre = game.V_NAME;
      const imagenNombre = nombre.replace(/ /g, "").toLowerCase();
      const pegi = game.V_PEGI || "PEGI ?";
      const release = game.V_RELEASE || "Fecha desconocida";
      const gameId = game.V_CODE;

      gamesHTML += `
        <div class="game listGame" data-game-id="${gameId}">
          <div class="gameCover">
            <img src="../assets/img/covers/${imagenNombre}.png" alt="${nombre}" />
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
            <div class="listGameActions">
              <button class="removeFromList" title="Eliminar de esta lista">
                <img class="deleteIcon" src="../assets/img/icons/delete.png" alt="Eliminar" />
              </button>
              <button class="addToList" title="Añadir a otra lista">
                <img class="corazon" src="../assets/img/icons/red_heart.png" alt="Añadir a lista" />
              </button>
            </div>
          </div>
        </div>
      `;
    });

    listGamesSection.innerHTML = gamesHTML;
    setup_game_buttons();
  } catch (error) {
    console.error("Error al mostrar juegos de lista:", error);
    const listGamesSection = document.querySelector(".listGames");
    if (listGamesSection) {
      listGamesSection.innerHTML =
        "<p>Error al cargar los juegos de la lista</p>";
    }
  }
}

function clean_games() {
  const listGamesSection = document.querySelector(".listGames");
  if (listGamesSection) {
    listGamesSection.innerHTML = "";
  }
}
