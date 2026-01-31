window.addEventListener("sessionVerified", async () => {
  let profile = await get_profile();
  document.getElementById("adjustDataID").innerHTML = profile.USER_NAME;
  await cargar_listas();
});

let todasLasListas = [];
let listaSeleccionada = null;

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

      await mostrar_juegos_de_lista(listName);
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

          if (listaSeleccionada === listItem) {
            await mostrar_juegos_de_lista(newnameTrimmed);
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

          const nuevaPrimeraLista = document.querySelector(".list");
          if (nuevaPrimeraLista) {
            nuevaPrimeraLista.click();
          } else {
            limpiar_juegos();
          }
        }
      }
    };
  });
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
  const response = await fetch("../../api/Lists.php", {
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener las listas.");
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
      credentials: "include",
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
    credentials: "include",
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
  const response = await fetch(
    `../../api/List.php?list=${encodeURIComponent(list)}`,
    {
      method: "DELETE",
      credentials: "include",
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
      credentials: "include",
    },
  );
  const result = await response.json();
  console.log(result.data);
  if (response.ok) {
    alert("Eliminado el juego de la lista correctamente");
  } else {
    alert("Error al eliminar el juego de la lista");
  }
}

async function cargar_listas() {
  try {
    const lists = await get_lists();
    const container = document.getElementById("listas");

    todasLasListas = lists || [];

    if (!lists || lists.length === 0) {
      container.innerHTML = "<p>No hay listas disponibles</p>";
      limpiar_juegos();
      return;
    }

    container.innerHTML = "";

    lists.forEach((list) => {
      container.innerHTML += `
        <li>
          <div class="list">
            <div class="nombreList">
              ${list.L_NAME}
            </div>
            <div class="editIcon">
              <img class="rename" src="../assets/img/icons/rename.png" />
              <img class="delete" src="../assets/img/icons/delete.png" />
            </div>
          </div>
        </li>`;
    });

    setup_event_listeners();

    const primeraLista = document.querySelector(".list");
    if (primeraLista) {
      primeraLista.click();
    }
  } catch (error) {
    console.error("Error al cargar listas:", error);
    document.getElementById("listas").innerHTML = `
      <div class="error">
        <p>Error al cargar las listas: ${error.message}</p>
        <button onclick="cargar_listas()">Reintentar</button>
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

async function mostrar_juegos_de_lista(listName) {
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

      gamesHTML += `
        <div class="game">
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
            <div class="heartIcon">
              <img class="corazon" src="../assets/img/icons/red_heart.png" />
            </div>
          </div>
        </div>
      `;
    });

    listGamesSection.innerHTML = gamesHTML;
  } catch (error) {
    console.error("Error al mostrar juegos de lista:", error);
    const listGamesSection = document.querySelector(".listGames");
    if (listGamesSection) {
      listGamesSection.innerHTML =
        "<p>Error al cargar los juegos de la lista</p>";
    }
  }
}

function limpiar_juegos() {
  const listGamesSection = document.querySelector(".listGames");
  if (listGamesSection) {
    listGamesSection.innerHTML = "";
  }
}
