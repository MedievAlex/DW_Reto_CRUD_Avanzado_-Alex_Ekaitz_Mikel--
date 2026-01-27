document.addEventListener("DOMContentLoaded", async () => {
  /******************************************************************************************************
   *****************************************VARIABLE DECLARATION*****************************************
   ******************************************************************************************************/

  //Loading the current user from localstorage, can be admin or user this is checked later
  const profile = await get_profile();

  /* ----------HOME---------- */
  const homeBtn = document.getElementById("adjustData");

  /* ----------USER POPUP---------- */
  const modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  const changePwdBtn = document.getElementById("changePwdBtn");
  const saveBtnUser = document.getElementById("saveBtnUser");

  /* ----------ADMIN POPUP---------- */
  const modifyAdminPopup = document.getElementById("modifyAdminPopup");
  const closeAdminSpan = document.getElementsByClassName("close")[0];
  const changePwdBtnAdmin = document.getElementById("changePwdBtnAdmin");
  const adminTableModal = document.getElementById("adminTableModal");
  const modifyAdminBtn = document.getElementById("modifySelfButton");
  const saveBtnAdmin = document.getElementById("saveBtnAdmin");

  /* ----------SHARED ELEMENTS---------- */
  const changePwdModal = document.getElementById("changePasswordModal");
  const deleteBtn = document.getElementById("deleteBtn");
  const closePasswordSpan =
    document.getElementsByClassName("closePasswordSpan")[0];
  const closeWindow = document.getElementById("logoutIcon");

  /******************************************************************************************************
   ****************************************BUTTON FUNCTIONALITIES****************************************
   ******************************************************************************************************/

  /* ----------HOME---------- */
  //Opens a popup depending on if the profile is a user or admin
  homeBtn.onclick = function () {
    if (profile && profile.type === "user") {
      /*console.log("ES USUARIO (type: 'user')");
      console.log("CARD_NO disponible?:", profile.CARD_NO !== undefined);
      console.log("GENDER disponible?:", profile.GENDER !== undefined);*/

      document.getElementById("message").innerHTML = "";
      profile = get_profile();
      openModifyUserPopup(profile);
    } else if (profile && profile.type === "admin") {
      /*console.log(" ES ADMINISTRADOR (type: 'admin')");
      console.log("CURRENT_ACCOUNT disponible?:",profile.CURRENT_ACCOUNT !== undefined,);*/
      profile = get_profile();
      refreshAdminTable();
      adminTableModal.style.display = "block";
      deleteBtn.style.display = "none";
    } else {
      // Intentar deducir por propiedades existentes (para compatibilidad)
      if (profile && profile.CARD_NO !== undefined) {
        //console.log(" Detectado por CARD_NO - Asumiendo usuario");
        document.getElementById("message").innerHTML = "";
        openModifyUserPopup(profile);
      } else if (profile && profile.CURRENT_ACCOUNT !== undefined) {
        //console.log(" Detectado por CURRENT_ACCOUNT - Asumiendo admin");
        refreshAdminTable();
        adminTableModal.style.display = "block";
        deleteBtn.style.display = "none";
      } else {
        alert(
          "Lo sentimos, no se pudo cargar la información de tu cuenta. Por favor, recarga la página o contacta con soporte.",
        );
      }
    }
  };
  
  closeWindow.onclick = function () {
    logout();
  };

  /* ----------USER POPUP---------- */
  changePwdBtn.onclick = function () {
    changePwdModal.style.display = "block";
    resetPasswordModal();
  };

  saveBtnUser.onclick = function () {
    modifyUser();
  };

  /* ----------ADMIN POPUP---------- */
  closeAdminSpan.onclick = function () {
    adminTableModal.style.display = "none";
  };

  changePwdBtnAdmin.onclick = function () {
    changePwdModal.style.display = "block";
    resetPasswordModal();
  };

  modifyAdminBtn.onclick = function () {
    openModifyAdminPopup();
  };

  saveBtnAdmin.onclick = function () {
    modifyAdmin();
  };

  /* ----------SHARED ELEMENTS---------- */
  deleteBtn.onclick = function () {
    delete_user(profile.PROFILE_CODE);
  };

  closePasswordSpan.onclick = function () {
    changePwdModal.style.display = "none";
  };

  //If a popup is clicked outside of the actual area, automatically close the popup
  window.onclick = function (event) {
    if (event.target == adminTableModal) {
      adminTableModal.style.display = "none";
    } else if (event.target == modifyUserPopup) {
      modifyUserPopup.style.display = "none";
    } else if (event.target == modifyAdminPopup) {
      modifyAdminPopup.style.display = "none";
    } else if (event.target == changePwdModal) {
      changePwdModal.style.display = "none";
    }
  };

  //Change password popup functionality, inside this initial on document loaded method as it relies on the
  //form existing even though it isnt shown to be able to listen to it, if it isnt inside this on document
  //loaded method an error occurs as it tries to listen to the form before it is loaded
  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      document.getElementById("messageOldPassword").innerHTML = "";
      document.getElementById("messageWrongPassword").innerHTML = "";
      document.getElementById("message").innerHTML = "";

      let actualProfile = profile;


      const profile_code = actualProfile.PROFILE_CODE;
      const userPassword = actualProfile.PSWD;
      const password = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword =document.getElementById("confirmNewPassword").value;

      let hasErrors = false;

      if (userPassword != password) {
        document.getElementById("messageOldPassword").innerHTML =
          "That is not your current password";
        hasErrors = true;
        //console.log("CURRENT PASSWORD: ", userPassword);
        //console.log("INPUT: ", password);
      }

      if (userPassword == newPassword) {
        document.getElementById("messageWrongPassword").innerHTML =
          "Password used before, try another one";
        hasErrors = true;
      }

      if (newPassword != confirmPassword) {
        document.getElementById("messageWrongPassword").innerHTML =
          "The passwords are not the same";
        hasErrors = true;
      }

      if (!hasErrors) {
        try {
          const response = await fetch("../../api/ModifyPassword.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              profile_code: profile_code,
              password: newPassword,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            actualProfile.PSWD = newPassword;
            document.getElementById("messageSuccessPassword").innerHTML =
              "Password correctly changed";
            if (["CARD_NO"] in profile) {
              console.log("IS A USER");
              localStorage.setItem("actualUser", JSON.stringify(actualProfile));
            } else if (["CURRENT_ACCOUNT"] in profile) {
              console.log("IS AN ADMIN");
              localStorage.setItem(
                "actualProfile",
                JSON.stringify(actualProfile),
              );
            }

            setTimeout(() => {
              document.getElementById("messageSuccessPassword").innerHTML = ""; // clean the modified message
              document.getElementById("changePasswordForm").reset(); // clean all the fields
            }, 3000);
          } else {
            document.getElementById("messageSuccessPassword").innerHTML =
              result.message;
            document.getElementById("messageSuccessPassword").style.color =
              "red";
          }
        } catch (error) {
          //DEBUG console.log(error);
        }
      }
    });
});

/******************************************************************************************************
 ***********************************************METHODS************************************************
 ******************************************************************************************************/

/* ----------HOME---------- */
function openModifyUserPopup(profile) {
  console.log("openModifyUserPopup llamado con:", profile);

  if (!profile) {
    console.error("Perfil no definido");
    return;
  }

  document.getElementById("message").innerHTML = "";

  // Verifica que el modal existe
  let modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  if (!modifyUserPopup) {
    console.error("No se encontró el modal con id 'modifyUserPopupAdmin'");
    return;
  }

  // console.log("Modal encontrado:", modifyUserPopup);

  // Mapear los campos correctamente según lo que recibes
  const userData = profile;
  if (!userData) {
    console.error("Datos de usuario no definidos");
    return;
  }

  console.log("Datos del usuario mapeados:", userData);

  document.getElementById("usernameUser").value = userData.USER_NAME || "";
  document.getElementById("emailUser").value = userData.EMAIL || "";
  document.getElementById("phoneUser").value = userData.TELEPHONE || "";
  document.getElementById("firstNameUser").value = userData.NAME_ || "";
  document.getElementById("lastNameUser").value = userData.SURNAME || "";
  document.getElementById("genderUser").value = userData.GENDER || "Man";
  document.getElementById("cardNumberUser").value = userData.CARD_NO || "";

  // Muestra el modal
  console.log("Mostrando modal...");
  modifyUserPopup.style.display = "flex";

  // Verifica que se haya aplicado el estilo
  console.log("Estilo display actual:", modifyUserPopup.style.display);
}

/* ----------USER POPUP---------- */
async function modifyUser() {
  profile = await get_profile();

  const usuario = profile;

  const profile_code = usuario.PROFILE_CODE;
  const name = document.getElementById("firstNameUser").value;
  const surname = document.getElementById("lastNameUser").value;
  const email = document.getElementById("emailUser").value;
  const username = document.getElementById("usernameUser").value;
  const telephone = document.getElementById("phoneUser").value.replace(/\s/g, "");
  const gender = document.getElementById("genderUser").value;
  const card_no = document.getElementById("cardNumberUser").value;

  //DEBUG 
  console.log("Esto son los datos de los textfields" + profile_code,name,surname,email,username,telephone,gender,card_no);

  if (
    !name ||
    !surname ||
    !email ||
    !username ||
    !telephone ||
    !gender ||
    !card_no
  ) {
    document.getElementById("message").innerHTML =
      "You must fill all the fields";
    document.getElementById("message").style.color = "red";
    return;
  }

  //verify if there are changes in the fields
  function hasChanges() {
    let changes = false;

    if (
      name !== usuario.NAME_ ||
      surname !== usuario.SURNAME ||
      email !== usuario.EMAIL ||
      username !== usuario.USER_NAME ||
      telephone !== usuario.TELEPHONE ||
      gender !== usuario.GENDER ||
      card_no !== usuario.CARD_NO
    ) {
      changes = true;
    }
    return changes;
  }

  if (!hasChanges()) {
    document.getElementById("message").innerHTML = "No changes detected";
    document.getElementById("message").style.color = "red";
  } else {
    try {
      const form = new FormData();
      form.append("name",name);
      form.append("surname",surname);
      form.append("email",email);
      form.append("username",username);
      form.append("telephone", telephone);
      form.append("gender",gender);
      form.append("card_no",card_no);
      form.append("profile_code",profile_code);
      const response = await fetch(
        "../../api/ModifyUser.php",{
          method: "PUT",
          body: new URLSearchParams(form),
        }
      );
      const result = await response.json();
      //DEBUG console.log(data);

      if (response.ok) {
        document.getElementById("message").innerHTML = result.message;
        document.getElementById("message").style.color = "green";

        profile.NAME_ = name;
        profile.SURNAME = surname;
        profile.EMAIL = email;
        profile.USER_NAME = username;
        profile.TELEPHONE = telephone;
        profile.CARD_NO = card_no;
        profile.GENDER = gender;

        if (profile && profile.CURRENT_ACCOUNT !== undefined) {
          refreshAdminTable();
        }
      } else {
        document.getElementById("message").innerHTML = result.message;
        document.getElementById("message").style.color = "red";
      }
    } catch (error) {
      //DEBUG console.log(error);
    }
  }
}

/* ----------ADMIN POPUP---------- */
async function get_all_users() {
  const response = await fetch("../../api/GetAllUsers.php");
  const result = await response.json();

  return result.data;
}

async function delete_user_admin(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  const response = await fetch(
    `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`,
  );

  const result = await response.json();

  if (response.ok) {
    row = document.getElementById(`user${id}`);
    if (row) row.remove();
  }
}

async function refreshAdminTable() {
  let table = document.getElementById("adminTable");
  table.innerHTML = `<tr class="adminTableHead">
              <th>Username</th>
              <th>Card Number</th>
              <th></th>
            </tr>`;
  let users = await get_all_users();

  if (users) {
    users.forEach((user) => {
      const profile_id = user["PROFILE_CODE"];
      let row = adminTable.insertRow(1);
      row.className = "adminTableData";
      row.id = `user${profile_id}`;
      let username = row.insertCell(0);
      username.id = `${profile_id}Username`;
      let cardNo = row.insertCell(1);
      cardNo.id = `${profile_id}CardNo`;
      let buttons = row.insertCell(2);

      username.innerHTML = user["USER_NAME"];
      cardNo.innerHTML = user["CARD_NO"];
      buttons.innerHTML = `<div class="center-flex-div">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-small"
                  onclick='openModifyUserPopup(${user})'
                >
                  <path
                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                  />
                  <path
                    d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#ff5457"
                  class="size-small"
                  onclick="delete_user_admin(${user.PROFILE_CODE})" 
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>`;
    });
  } else {
    let row = adminTable.insertRow(1);
    row.className = "adminTableData";
    let username = row.insertCell(0);
    let accountNum = row.insertCell(1);
    let buttons = row.insertCell(2);

    accountNum.innerHTML = "No users available.";
  }
}

function openModifyAdminPopup() {
  document.getElementById("messageAdmin").innerHTML = "";
  const actualProfile = get_profile();
  let modifyAdminPopup = document.getElementById("modifyAdminPopup");

  const usuario = actualProfile;

  //DEBUG console.log("User username: ", usuario.username);
  /*console.log("Esto son los datos de los textfields" + usuario.PROFILE_CODE,usuario.NAME_,usuario.SURNAME,usuario.EMAIL,
    usuario.USER_NAME,usuario.TELEPHONE, usuario.CURRENT_ACCOUNT);*/

  document.getElementById("usernameAdmin").value = usuario.USER_NAME;
  document.getElementById("emailAdmin").value = usuario.EMAIL;
  document.getElementById("phoneAdmin").value = usuario.TELEPHONE ;
  document.getElementById("firstNameAdmin").value = usuario.NAME_ ;
  document.getElementById("lastNameAdmin").value = usuario.SURNAME ;
  document.getElementById("profileCodeAdmin").value = usuario.PROFILE_CODE;
  document.getElementById("currentAccountAdmin").value =usuario.CURRENT_ACCOUNT;

  modifyAdminPopup.style.display = "flex";
}

async function modifyAdmin() {
  const actualProfile = await get_profile();

  const usuario = actualProfile;

  const profile_code = usuario.PROFILE_CODE;
  const name = document.getElementById("firstNameAdmin").value;
  const surname = document.getElementById("lastNameAdmin").value;
  const email = document.getElementById("emailAdmin").value;
  const username = document.getElementById("usernameAdmin").value;
  const telephone = document
    .getElementById("phoneAdmin")
    .value.replace(/\s/g, ""); //remove spaces
  const current_account = document.getElementById("currentAccountAdmin").value;

  /*DEBUG console.log(
    "Esto son los datos de los textfields" + profile_code,
    name,
    surname,
    email,
    username,
    telephone,
    current_account
  );*/

  if (
    !name ||
    !surname ||
    !email ||
    !username ||
    !telephone ||
    !current_account
  ) {
    document.getElementById("messageAdmin").innerHTML =
      "You must fill all the fields";
    document.getElementById("messageAdmin").style.color = "red";
    return;
  }

  //verify if there are changes in the fields
  function hasChanges() {
    let changes = false;

    if (
      name !== usuario.NAME_ ||
      surname !== usuario.SURNAME ||
      email !== usuario.EMAIL ||
      username !== usuario.USER_NAME ||
      telephone !== usuario.TELEPHONE ||
      current_account !== usuario.CURRENT_ACCOUNT
    ) {
      changes = true;
    }
    return changes;
  }

  if (!hasChanges()) {
    document.getElementById("messageAdmin").innerHTML = "No changes detected";
    document.getElementById("messageAdmin").style.color = "red";
  } else {
    try {
      const response = await fetch(
        `../../api/ModifyAdmin.php?profile_code=${encodeURIComponent(
          profile_code,
        )}&name=${encodeURIComponent(name)}&surname=${encodeURIComponent(
          surname,
        )}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(
          username,
        )}&telephone=${encodeURIComponent(
          telephone,
        )}&current_account=${encodeURIComponent(current_account)}`,
      );

      const result = await response.json();
      //DEBUG console.log(data);

      if (response.ok) {
        document.getElementById("messageAdmin").innerHTML = result.message;
        document.getElementById("messageAdmin").style.color = "green";

        actualProfile.NAME_ = name;
        actualProfile.SURNAME = surname;
        actualProfile.EMAIL = email;
        actualProfile.USER_NAME = username;
        actualProfile.TELEPHONE = telephone;
        actualProfile.CURRENT_ACCOUNT = current_account;


      } else {
        document.getElementById("messageAdmin").innerHTML = result.message;
        document.getElementById("messageAdmin").style.color = "red";
      }
    } catch (error) {
      //DEBUG console.log(error);
    }
  }
}

/* ----------SHARED ELEMENTS---------- */
function resetPasswordModal() {
  document.getElementById("changePasswordForm").reset();
  document.getElementById("messageOldPassword").innerHTML = "";
  document.getElementById("messageWrongPassword").innerHTML = "";
  document.getElementById("message").innerHTML = "";
}

async function delete_user(id) {
  if (!confirm("Are you sure you want to your account?")) return;

  const response = await fetch(
    `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`,
  );

  //const result = await response.json();

  if (response.ok) {
    window.location.href = "login.html";
  }
}

async function logout() {
  try {
    const response = await fetch("../../api/Logout.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.success) {
      window.location.href = "login.html";
    } else {
      console.error("Error en logout:", result.message);
      alert("Error al cerrar sesión: " + result.message);
    }
  } catch (error) {
    console.error("Error completo en logout:", error);
    alert("Error de conexión al cerrar sesión.");
  }
}
// Asegúrate de que la función esté definida antes de usarla
async function get_profile() {
  try {
    const response = await fetch("../../api/GetProfile.php", {
      method: "GET",
      credentials: "include",
    });
    const result = await response.json();
    console.log("Perfil obtenido:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return null;
  }
}
