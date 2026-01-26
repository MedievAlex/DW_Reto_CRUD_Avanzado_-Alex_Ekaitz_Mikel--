const videogame_id = null;
const videogame = null;
const name = null;
const release = null;
const platform = null;
const pegi = null;

async function get_all_videogames() {
  const response = await fetch("../../api/Videogames.php");
  const result = await response.json();
  return result.data;
}
async function get_videogame(videogame_id) {
  const response = await fetch(
    `../../api/Videogame.php?id=${encodeURIComponent(videogame_id)}`,
  );
  const result = await response.json();
  return result.data;
}
async function create_videogame(name, release, platform, pegi) {
  try {
    const form = new FormData();
    form.append("name",name);
    form.append("release",release);
    form.append("platform",platform);
    form.append("pegi",pegi);
    const response = await fetch("../../api/Videogame.php", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Error al crear el juego");
      return data;
    }
    return data;
  } catch (error) {
    console.error("Error en create_videogame:", error.message);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: [],
    };
  }
}
async function update_videogame(videogame_id, name, release, platform, pegi) {
if (!name) {
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
  form.append("name", name);
  form.append("release", release);
  form.append("platform", platform);
  form.append("pegi", pegi);
  const response = await fetch("../../api/Videogame.php", {
    method: "PUT",
    body: new URLSearchParams(form),
  });
  const result = await response.json();
  alert("Se ha modificado el juego correctamente");

}
async function delete_videogame(videogame_id) {
    if (!confirm("Are you sure you want to delete this game?")) return;
  const response = await fetch(
    `../../api/Review.php?id=${encodeURIComponent(videogame_id)}`,
    {
      method: "DELETE",
    }
  );
  const result = await response.json();
  alert("Eliminada el juego correctamente");
}
