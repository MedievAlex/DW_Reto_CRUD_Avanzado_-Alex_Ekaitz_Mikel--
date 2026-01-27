document.addEventListener("DOMContentLoaded", async ()=>{
    //cargar_listas();
    const profile = get_profile();
    const rename = document.getElementsByClassName("rename");
    const listas =document.getElementById("listas");
    const deletelist = document.getElementsByClassName("delete");
    const corazon = document.getElementsByClassName("corazon");
    //EVENTOS LISTS
     Array.from(renameButtons).forEach((button, index) => {
        button.onclick = function() {
            const listItem = this.closest('.list');
            const nombreListDiv = listItem.querySelector('.nombreList'); 
            const oldname = nombreListDiv.textContent.trim();
            
            const newname = prompt("Introduce el nuevo nombre:", oldname);
            
            if (newname && newname.trim() !== "" && newname !== oldname) {
                const newnameTrimmed = newname.trim();
                const newlistcomprobation = get_list(newname);
                if(!newlistcomprobation){
                    update_list(newname, oldname);
                    /*listas.innerHTML = "";
                    cargar_listas();*/
                    nombreListDiv.textContent = newnameTrimmed;
                    //console.log(`Renombrando de '${oldname}' a '${newnameTrimmed}'`);
                }else{
                    alert("El nombre introducido ya existe.");
                }
            } else if (newname === null) {
                console.log("Cancelado");
            } else if (newname === oldname) {
                console.log("El nombre es el mismo");
            }
        };
    });
    Array.from(deleteButtons).forEach((button) => {
        button.onclick = function() {
            const listItem = this.closest('.list');
            const nombreListDiv = listItem.querySelector('.nombreList');
            const listName = nombreListDiv.textContent.trim();
            
            if (confirm(`¿Estás seguro de que quieres eliminar la lista "${listName}"?`)) {
                delete_list(list);
                 /*listas.innerHTML = "";
                cargar_listas();*/
                listItem.closest('li').remove();
                //console.log(`Lista "${listName}" eliminada`);
            }
        };
    });
    
    /*corazon.onclick() = function(){

    }*/
    deletelist.onclick = function () {
        if (!confirm("Are you sure you want to your list?")) return;
        const list = document.getElementById("nombreList").value;
        delete_list(list);
        /*listas.innerHTML = "";
        cargar_listas();*/
    };
});

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
async function cargar_listas(){
    const lists = await getlists();
    lists.array.forEach(list => {
        document.getElementById("listas") +=`
                    <li>
                        <div class="list">
                            <div id="nombreList">
                               ${list.name}
                            </div>
                            <div class="editIcon">
                                <img id="rename" src="../assets/img/icons/rename.png" />
                                <img id="delete" src="../assets/img/icons/delete.png" />
                            </div>
                        </div>
                    </li>`
    });
}