// ==============================
// VARIABLES GLOBALES
// ==============================

let isLoading = false;
let heartButtonsInitialized = false;
let myGamesSet = new Set();

// ==============================
// EVENTO PRINCIPAL - SESIÓN VERIFICADA
// ==============================

window.addEventListener("sessionVerified", async () => {
  if (isLoading) return;
  isLoading = true;

  try {
    const profile = await get_profile();
    document.getElementById("adjustDataID").textContent = profile.USER_NAME;

    await loadMyGames();
    await create_cards();

    if (!heartButtonsInitialized) {
      setupHeartButtons();
      heartButtonsInitialized = true;
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar los datos");
  } finally {
    isLoading = false;
  }
});

// ==============================
// FUNCIONES DE PERFIL Y JUEGOS
// ==============================

async function get_profile() {
  const response = await fetch("../../api/GetProfile.php", {
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

async function get_all_videogames() {
  const response = await fetch("../../api/Videogames.php");
  const result = await response.json();
  if (response.ok) {
    return result.data;
  } else {
    alert("Error al obtener los juegos");
  }
}

// ==============================
// FUNCIONES DE "MY GAMES"
// ==============================

async function loadMyGames() {
  try {
    const response = await fetch(
      `../../api/List.php?list=${encodeURIComponent("MY GAMES")}`,
      { credentials: "include" },
    );

    if (response.status === 404) {
      myGamesSet.clear();
      return;
    }

    const result = await response.json();
    if (response.ok && result.data) {
      myGamesSet = new Set(result.data.map((item) => parseInt(item.V_CODE)));
    }
  } catch (error) {
    console.error("Error cargando 'MY GAMES':", error);
    myGamesSet.clear();
  }
}

async function toggleMyGames(gameId, heartButton) {
  try {
    gameId = parseInt(gameId);
    const isInMyGames = myGamesSet.has(gameId);

    if (isInMyGames) {
      const response = await fetch(
        `../../api/List.php?list=${encodeURIComponent("MY GAMES")}&vcode=${encodeURIComponent(gameId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();
      if (response.ok) {
        myGamesSet.delete(gameId);
        updateHeartIcon(heartButton, false);
      } else {
        alert(result.message || "Error al quitar el juego");
      }
    } else {
      const form = new FormData();
      form.append("list", "MY GAMES");
      form.append("vcode", gameId);

      const response = await fetch("../../api/List.php", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        myGamesSet.add(gameId);
        updateHeartIcon(heartButton, true);
      } else {
        alert(result.message || "Error al añadir el juego");
      }
    }
  } catch (error) {
    console.error("Error en toggleMyGames:", error);
    alert("Error de conexión con el servidor");
  }
}

function updateHeartIcon(img, isInMyGames) {
  const button = img.closest("button");

  if (isInMyGames) {
    img.classList.add("heart-selected");
    img.title = "Quitar de mis juegos";
    if (button) button.title = "Quitar de mis juegos";
  } else {
    img.classList.remove("heart-selected");
    img.title = "Añadir a mis juegos";
    if (button) button.title = "Añadir a mis juegos";
  }
}

// ==============================
// FUNCIÓN PARA CREAR CARDS
// ==============================

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

    games.forEach((game) => {
      const nombre = game.V_NAME || "Sin nombre";
      const imagen = game.V_NAME.replace(/ /g, "").toLowerCase();
      const pegi = game.V_PEGI || "PEGI ?";
      const release = game.V_RELEASE || "Fecha desconocida";
      const plataforma = game.V_PLATFORM || "";
      const gameId = game.V_CODE;

      const isInMyGames = myGamesSet.has(parseInt(gameId));
      const heartClass = isInMyGames ? "heart-selected" : "";
      const heartTitle = isInMyGames
        ? "Quitar de mis juegos"
        : "Añadir a mis juegos";

      const gameHTML = `
        <div class="game" data-game-id="${gameId}">
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
              <div class="gamePlatform">
                ${plataforma}
              </div>
            </div>
            <div class="heartIcon">
              <button title="${heartTitle}">
                <img class="corazon ${heartClass}" src="../assets/img/icons/red_heart.png" />
              </button>
            </div>
          </div>
        </div>
      `;

      let contenedorId = "PC";
      if (plataforma.includes("NINTENDO")) contenedorId = "NINTENDO";
      else if (plataforma.includes("XBOX")) contenedorId = "XBOX";
      else if (plataforma.includes("PLAYSTATION")) contenedorId = "PLAYSTATION";

      const contenedor = document.getElementById(contenedorId);
      if (contenedor) {
        contenedor.insertAdjacentHTML("beforeend", gameHTML);
      }
    });
  } catch (error) {
    console.error("ERROR al crear las cartas:", error);
    document.getElementById("PC").innerHTML = `
      <div class="error">
        <p>Error al cargar los juegos: ${error.message}</p>
        <button onclick="create_cards()">Reintentar</button>
      </div>
    `;
  }
}

// ==============================
// CONFIGURACIÓN DE BOTONES CORAZÓN
// ==============================

function setupHeartButtons() {
  document.addEventListener("click", async (event) => {
    if (event.target.closest(".heartIcon button")) {
      event.preventDefault();
      event.stopPropagation();

      const button = event.target.closest(".heartIcon button");
      const gameDiv = button.closest(".game");
      const gameId = gameDiv.dataset.gameId;
      const heartImg = button.querySelector(".corazon");

      await toggleMyGames(gameId, heartImg);
    }
  });
}
