window.addEventListener("sessionVerified", async () => {
  let profile = await get_profile();
  document.getElementById("adjustDataID").innerHTML = profile.USER_NAME;
  create_cards();
});

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
    alert("Errorr al obtener los juegos");
  }
}

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
    let juegosSinPlataforma = 0;
    games.forEach((game) => {
      const nombre = game.V_NAME || "Sin nombre";
      const imagen = game.V_NAME.replace(/ /g, "").toLowerCase();
      const pegi = game.V_PEGI || "PEGI ?";
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
                            <button title="Añadir a mis juegos">
                                <img class="corazon" src="../assets/img/icons/red_heart.png" />
                            </button>
                        </div>
                    </div>
                </div>
      `;
      let contenedorId = null;
      if (plataforma.includes("PC")) {
        contenedorId = "PC";
      } else if (plataforma.includes("NINTENDO")) {
        contenedorId = "NINTENDO";
      } else if (plataforma.includes("XBOX")) {
        contenedorId = "XBOX";
      } else if (plataforma.includes("PLAYSTATION")) {
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
