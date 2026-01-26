const list = null;
const videogame_id = null;
const new_list = null;
const old_list = null;

async function get_lists() {
  const response = await fetch("../../api/Lists.php");
  const result = await response.json();
  return result.data;
}

async function get_list(list) {
  try {
    if (!list) {
      alert("El nombre de la lista es obligatorio");
    }
    const response = await fetch(
      `/api/List.php?list=${encodeURIComponent(list)}`
    );

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Error al obtener la lista");
    }
    return data;
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

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Error al crear la lista");
      return data;
    }
    return data;
  } catch (error) {
    console.error("Error en create_list:", error.message);
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: [],
    };
  }
}
// preguntar ekaitz por metodo put
//new URLSearchParams(formData)
async function update_list(new_list, old_list) {
    const form = new FormData();
    form.append("new_list", new_list);
    form.append("old_list", old_list);
    const response = await fetch("../../api/List.php", {
    method: "PUT",
    body: new URLSearchParams(form),
  });
    const result = await response.json();
    alert("Se ha modificado la lista correctamente");
}

async function delete_list(list) {
  if (!confirm("Are you sure you want to delete this list?")) return;
  const response = await fetch(`../../api/List.php?list=${encodeURIComponent(list)}`, {
    method: "DELETE",
  });
  const result = await response.json();
  alert("Eliminada la lista correctamente");
}
async function delete_game_from_list(list, videogame_id) {
    const response = await fetch(`../../api/List.php?list=${encodeURIComponent(list)}&vcode=${encodeURIComponent(videogame_id)}`, {
    method: "DELETE",
  });
  const result = await response.json();
  alert("Eliminado el juego de la lista correctamente");
}
