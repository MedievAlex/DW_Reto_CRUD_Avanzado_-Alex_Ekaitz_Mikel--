// ==============================
// VARIABLES PARA PERFIL
// ==============================

let profile = null;
let editingUser = null;
let isLoadingProfile = false;
let homeBtn = null;
let modifyUserPopup = null;
let changePwdBtn = null;
let saveBtnUser = null;
let modifyAdminPopup = null;
let closeAdminSpan = null;
let changePwdBtnAdmin = null;
let adminTableModal = null;
let modifyAdminBtn = null;
let saveBtnAdmin = null;
let changePwdModal = null;
let deleteBtn = null;
let closePasswordSpan = null;
let closeWindow = null;

// ==============================
// EVENTO PARA CARGAR PERFIL
// ==============================

window.addEventListener("sessionVerified", async () => {
  if (isLoadingProfile) return;
  isLoadingProfile = true;

  try {
    profile = await get_profile();
    document.getElementById("adjustDataID").innerHTML = profile.USER_NAME;
    initialize_dom_elements();
    setup_event_listeners();
  } catch (error) {
    console.error("Error al inicializar:", error);
    alert("Error al cargar la aplicación");
  } finally {
    isLoadingProfile = false;
  }
});

// ==============================
// INICIALIZACIÓN DE ELEMENTOS
// ==============================

function initialize_dom_elements() {
  homeBtn = document.getElementById("adjustData");
  modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  changePwdBtn = document.getElementById("changePwdBtn");
  saveBtnUser = document.getElementById("saveBtnUser");
  modifyAdminPopup = document.getElementById("modifyAdminPopup");
  closeAdminSpan = document.getElementsByClassName("close")[0];
  changePwdBtnAdmin = document.getElementById("changePwdBtnAdmin");
  adminTableModal = document.getElementById("adminTableModal");
  modifyAdminBtn = document.getElementById("modifySelfButton");
  saveBtnAdmin = document.getElementById("saveBtnAdmin");
  changePwdModal = document.getElementById("changePasswordModal");
  deleteBtn = document.getElementById("deleteBtn");
  closePasswordSpan = document.getElementsByClassName("closePasswordSpan")[0];
  closeWindow = document.getElementById("logoutIcon");
}

// ==============================
// CONFIGURACIÓN DE EVENTOS
// ==============================

function setup_event_listeners() {
  if (homeBtn) {
    homeBtn.onclick = function () {
      if (profile && profile.type === "user") {
        document.getElementById("message").innerHTML = "";
        openModifyUserPopup(profile);
      } else if (profile && profile.type === "admin") {
        refreshAdminTable();
        adminTableModal.style.display = "block";
        deleteBtn.style.display = "none";
      } else {
        if (profile && profile.CARD_NO !== undefined) {
          document.getElementById("message").innerHTML = "";
          openModifyUserPopup(profile);
        } else if (profile && profile.CURRENT_ACCOUNT !== undefined) {
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
  }

  if (closeWindow) {
    closeWindow.onclick = function () {
      logout();
    };
  }

  if (changePwdBtn) {
    changePwdBtn.onclick = function () {
      changePwdModal.style.display = "block";
      resetPasswordModal();
    };
  }

  if (saveBtnUser) {
    saveBtnUser.onclick = function () {
      modifyUser();
    };
  }

  if (closeAdminSpan) {
    closeAdminSpan.onclick = function () {
      adminTableModal.style.display = "none";
    };
  }

  if (changePwdBtnAdmin) {
    changePwdBtnAdmin.onclick = function () {
      changePwdModal.style.display = "block";
      resetPasswordModal();
    };
  }

  if (modifyAdminBtn) {
    modifyAdminBtn.onclick = function () {
      openModifyAdminPopup();
    };
  }

  if (saveBtnAdmin) {
    saveBtnAdmin.onclick = function () {
      modifyAdmin();
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = function () {
      delete_user(profile.PROFILE_CODE);
    };
  }

  if (closePasswordSpan) {
    closePasswordSpan.onclick = function () {
      changePwdModal.style.display = "none";
    };
  }

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

  const passwordForm = document.getElementById("changePasswordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      document.getElementById("messageOldPassword").innerHTML = "";
      document.getElementById("messageWrongPassword").innerHTML = "";
      document.getElementById("messageSuccessPassword").innerHTML = "";

      const actualProfile = editingUser || profile;
      const profile_code = actualProfile.PROFILE_CODE;
      const old_password = document.getElementById("currentPassword").value;
      const new_password = document.getElementById("newPassword").value;
      const confirmPassword =
        document.getElementById("confirmNewPassword").value;

      let hasErrors = false;

      if (new_password !== confirmPassword) {
        document.getElementById("messageWrongPassword").innerHTML =
          "The passwords are not the same";
        hasErrors = true;
      }

      if (new_password.length < 6) {
        document.getElementById("messageWrongPassword").innerHTML =
          "Password must be at least 6 characters long";
        hasErrors = true;
      }

      if (old_password === new_password) {
        document.getElementById("messageWrongPassword").innerHTML =
          "New password must be different from current password";
        hasErrors = true;
      }

      if (!hasErrors) {
        try {
          const form = new FormData();
          form.append("profile_code", profile_code);
          form.append("old_password", old_password);
          form.append("new_password", new_password);

          const response = await fetch("../../api/ModifyPassword.php", {
            method: "PUT",
            body: new URLSearchParams(form),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            document.getElementById("messageSuccessPassword").innerHTML =
              result.message;
            document.getElementById("messageSuccessPassword").style.color =
              "green";

            setTimeout(() => {
              document.getElementById("messageSuccessPassword").innerHTML = "";
              document.getElementById("changePasswordForm").reset();
              changePwdModal.style.display = "none";
            }, 3000);
          } else {
            document.getElementById("messageSuccessPassword").innerHTML =
              result.message || "Error updating password";
            document.getElementById("messageSuccessPassword").style.color =
              "red";
          }
        } catch (error) {
          console.error("Error changing password:", error);
          document.getElementById("messageSuccessPassword").innerHTML =
            "Connection error";
          document.getElementById("messageSuccessPassword").style.color = "red";
        }
      }
    });
  }
}

// ==============================
// GESTIÓN DE POPUP DE USUARIO
// ==============================

function openModifyUserPopup(userProfile) {
  if (!userProfile) {
    console.error("Perfil no definido");
    return;
  }

  document.getElementById("message").innerHTML = "";

  if (!modifyUserPopup) {
    console.error("No se encontró el modal con id 'modifyUserPopupAdmin'");
    return;
  }

  const userData = userProfile;
  if (!userData) {
    console.error("Datos de usuario no definidos");
    return;
  }

  document.getElementById("usernameUser").value = userData.USER_NAME || "";
  document.getElementById("emailUser").value = userData.EMAIL || "";
  document.getElementById("phoneUser").value = userData.TELEPHONE || "";
  document.getElementById("firstNameUser").value = userData.NAME_ || "";
  document.getElementById("lastNameUser").value = userData.SURNAME || "";
  document.getElementById("genderUser").value = userData.GENDER || "Man";
  document.getElementById("cardNumberUser").value = userData.CARD_NO || "";

  modifyUserPopup.style.display = "flex";
}

async function modifyUser() {
  const usuario = editingUser || profile;

  const profile_code = usuario.PROFILE_CODE;
  const name = document.getElementById("firstNameUser").value.trim();
  const surname = document.getElementById("lastNameUser").value.trim();
  const email = document.getElementById("emailUser").value.trim();
  const username = document.getElementById("usernameUser").value.trim();
  const telephone = document
    .getElementById("phoneUser")
    .value.replace(/\s/g, "");
  const gender = document.getElementById("genderUser").value;
  const card_no = document
    .getElementById("cardNumberUser")
    .value.replace(/\s/g, "");

  console.log(
    "Datos a enviar:",
    profile_code,
    name,
    surname,
    email,
    username,
    telephone,
    gender,
    card_no,
  );

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

  function hasChanges() {
    return (
      name !== usuario.NAME_ ||
      surname !== usuario.SURNAME ||
      email !== usuario.EMAIL ||
      username !== usuario.USER_NAME ||
      telephone !== usuario.TELEPHONE ||
      gender !== usuario.GENDER ||
      card_no !== usuario.CARD_NO
    );
  }

  if (!hasChanges()) {
    document.getElementById("message").innerHTML = "No changes detected";
    document.getElementById("message").style.color = "red";
  } else {
    try {
      const form = new FormData();
      form.append("profile_code", profile_code);
      form.append("email", email);
      form.append("username", username);
      form.append("telephone", telephone);
      form.append("name", name);
      form.append("surname", surname);
      form.append("gender", gender);
      form.append("card_no", card_no);

      const response = await fetch("../../api/ModifyUser.php", {
        method: "PUT",
        body: new URLSearchParams(form),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        document.getElementById("message").innerHTML = result.message;
        document.getElementById("message").style.color = "green";

        if (profile.PROFILE_CODE === profile_code) {
          profile.NAME_ = name;
          profile.SURNAME = surname;
          profile.EMAIL = email;
          profile.USER_NAME = username;
          profile.TELEPHONE = telephone;
          profile.CARD_NO = card_no;
          profile.GENDER = gender;
        }

        if (profile && profile.CURRENT_ACCOUNT !== undefined) {
          await refreshAdminTable();
        }
      } else {
        document.getElementById("message").innerHTML =
          result.message || "Error updating profile";
        document.getElementById("message").style.color = "red";
      }
    } catch (error) {
      console.error("Error modifying user:", error);
      document.getElementById("message").innerHTML = "Connection error";
      document.getElementById("message").style.color = "red";
    }
  }
}

// ==============================
// GESTIÓN DE POPUP DE ADMIN
// ==============================

async function openModifyAdminPopup() {
  document.getElementById("messageAdmin").innerHTML = "";

  if (!profile) {
    console.error("No se pudo obtener el perfil");
    return;
  }

  const usuario = profile;

  document.getElementById("usernameAdmin").value = usuario.USER_NAME;
  document.getElementById("emailAdmin").value = usuario.EMAIL;
  document.getElementById("phoneAdmin").value = usuario.TELEPHONE;
  document.getElementById("firstNameAdmin").value = usuario.NAME_;
  document.getElementById("lastNameAdmin").value = usuario.SURNAME;
  document.getElementById("profileCodeAdmin").value = usuario.PROFILE_CODE;
  document.getElementById("currentAccountAdmin").value =
    usuario.CURRENT_ACCOUNT;

  modifyAdminPopup.style.display = "flex";
}

async function modifyAdmin() {
  const usuario = profile;

  const profile_code = usuario.PROFILE_CODE;
  const name = document.getElementById("firstNameAdmin").value.trim();
  const surname = document.getElementById("lastNameAdmin").value.trim();
  const email = document.getElementById("emailAdmin").value.trim();
  const username = document.getElementById("usernameAdmin").value.trim();
  const telephone = document
    .getElementById("phoneAdmin")
    .value.replace(/\s/g, "");
  const current_account = document
    .getElementById("currentAccountAdmin")
    .value.replace(/\s/g, "");

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

  function hasChanges() {
    return (
      name !== usuario.NAME_ ||
      surname !== usuario.SURNAME ||
      email !== usuario.EMAIL ||
      username !== usuario.USER_NAME ||
      telephone !== usuario.TELEPHONE ||
      current_account !== usuario.CURRENT_ACCOUNT
    );
  }

  if (!hasChanges()) {
    document.getElementById("messageAdmin").innerHTML = "No changes detected";
    document.getElementById("messageAdmin").style.color = "red";
  } else {
    try {
      const form = new FormData();
      form.append("profile_code", profile_code);
      form.append("email", email);
      form.append("username", username);
      form.append("telephone", telephone);
      form.append("name", name);
      form.append("surname", surname);
      form.append("current_account", current_account);

      const response = await fetch("../../api/ModifyAdmin.php", {
        method: "PUT",
        body: new URLSearchParams(form),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        document.getElementById("messageAdmin").innerHTML = result.message;
        document.getElementById("messageAdmin").style.color = "green";

        profile.NAME_ = name;
        profile.SURNAME = surname;
        profile.EMAIL = email;
        profile.USER_NAME = username;
        profile.TELEPHONE = telephone;
        profile.CURRENT_ACCOUNT = current_account;
      } else {
        document.getElementById("messageAdmin").innerHTML =
          result.message || "Error updating profile";
        document.getElementById("messageAdmin").style.color = "red";
      }
    } catch (error) {
      console.error("Error modifying admin:", error);
      document.getElementById("messageAdmin").innerHTML = "Connection error";
      document.getElementById("messageAdmin").style.color = "red";
    }
  }
}

// ==============================
// FUNCIONES DE API PARA ADMIN
// ==============================

async function get_all_users() {
  try {
    const response = await fetch("../../api/GetAllUsers.php");
    const result = await response.json();

    if (response.ok && result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Error getting users:", error);
    return null;
  }
}

async function delete_user_admin(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(
      `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();

    if (response.ok && result.success) {
      const row = document.getElementById(`user${id}`);
      if (row) row.remove();
      alert(result.message || "User deleted successfully");
    } else {
      alert(result.message || "Error deleting user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Connection error");
  }
}

async function refreshAdminTable() {
  const table = document.getElementById("adminTable");
  table.innerHTML = `<tr class="adminTableHead">
    <th>Username</th>
    <th>Card Number</th>
    <th></th>
  </tr>`;

  const users = await get_all_users();

  if (users && users.length > 0) {
    users.forEach((user) => {
      const profile_id = user["PROFILE_CODE"];
      const row = table.insertRow(1);
      row.className = "adminTableData";
      row.id = `user${profile_id}`;

      const username = row.insertCell(0);
      username.id = `${profile_id}Username`;

      const cardNo = row.insertCell(1);
      cardNo.id = `${profile_id}CardNo`;

      const buttons = row.insertCell(2);

      username.innerHTML = user["USER_NAME"];
      cardNo.innerHTML = user["CARD_NO"];
      buttons.innerHTML = `<div class="center-flex-div">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-small"
          onclick='openUserModalWithId(${user.PROFILE_CODE})'
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
    const row = table.insertRow(1);
    row.className = "adminTableData";
    const cell = row.insertCell(0);
    cell.colSpan = 3;
    cell.style.textAlign = "center";
    cell.innerHTML = "No users available.";
  }
}

// ==============================
// FUNCIONES DE API
// ==============================

async function openUserModalWithId(profileCode) {
  try {
    const response = await fetch(
      `../../api/GetProfile.php?pcode=${encodeURIComponent(profileCode)}`,
    );
    const result = await response.json();

    if (response.ok && result.data) {
      editingUser = result.data;
      openModifyUserPopup(editingUser);
    } else {
      alert("Error al cargar datos del usuario");
    }
  } catch (error) {
    console.error("Error cargando usuario:", error);
    alert("Error de conexión");
  }
}

function resetPasswordModal() {
  const form = document.getElementById("changePasswordForm");
  if (form) form.reset();

  document.getElementById("messageOldPassword").innerHTML = "";
  document.getElementById("messageWrongPassword").innerHTML = "";
  document.getElementById("messageSuccessPassword").innerHTML = "";
}

async function delete_user(id) {
  if (!confirm("Are you sure you want to delete your account?")) return;

  try {
    const response = await fetch(
      `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    );

    const result = await response.json();

    if (response.ok && result.success) {
      alert("Account deleted successfully");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Error deleting account");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Connection error");
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

async function get_profile() {
  try {
    const response = await fetch("../../api/GetProfile.php", {
      method: "GET",
      credentials: "include",
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return null;
  }
}
