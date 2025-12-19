import { openModifyUserPopup } from './modules/userPopup.js';
import { refreshAdminTable, openModifyAdminPopup, modifyAdmin, delete_user_admin } from './modules/adminPopup.js';
import { resetPasswordModal, delete_user } from './modules/shared.js';

document.addEventListener("DOMContentLoaded", async () => {
  /******************************************************************************************************
   *****************************************VARIABLE DECLARATION*****************************************
   ******************************************************************************************************/

  // Loading the current user from localstorage, can be admin or user this is checked later
  let profile = JSON.parse(localStorage.getItem("actualProfile"));

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
  const closePasswordSpan = document.getElementsByClassName("closePasswordSpan")[0];

  /******************************************************************************************************
   ****************************************BUTTON FUNCTIONALITIES****************************************
   ******************************************************************************************************/

  /* ----------HOME---------- */
  // Opens a popup depending on if the profile is a user or admin
  homeBtn.onclick = function () {
    if (["CARD_NO"] in profile) {
      profile = JSON.parse(localStorage.getItem("actualProfile"));
      document.getElementById("message").innerHTML = "";
      openModifyUserPopup(profile);
    } else if (["CURRENT_ACCOUNT"] in profile) {
      refreshAdminTable();
      adminTableModal.style.display = "block";
      // Hide delete button in user popups as admin can delete directly from table
      deleteBtn.style.display = "none";
    }
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
    delete_user(profile["PROFILE_CODE"]);
  };

  closePasswordSpan.onclick = function () {
    changePwdModal.style.display = "none";
  };

  // If a popup is clicked outside of the actual area, automatically close the popup
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

  // Change password form event listener
  document.getElementById("changePasswordForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    document.getElementById("messageOldPassword").innerHTML = "";
    document.getElementById("messageWrongPassword").innerHTML = "";
    document.getElementById("message").innerHTML = "";

    let actualProfile;

    if (["CARD_NO"] in profile) {
      actualProfile = JSON.parse(localStorage.getItem("actualUser"));
    } else if (["CURRENT_ACCOUNT"] in profile) {
      actualProfile = JSON.parse(localStorage.getItem("actualProfile"));
    }

    const profile_code = actualProfile["PROFILE_CODE"];
    const userPassword = actualProfile["PSWD"];
    const password = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmNewPassword").value;

    let hasErrors = false;

    if (userPassword != password) {
      document.getElementById("messageOldPassword").innerHTML = "That is not your current password";
      hasErrors = true;
    }

    if (userPassword == newPassword) {
      document.getElementById("messageWrongPassword").innerHTML = "Password used before, try another one";
      hasErrors = true;
    }

    if (newPassword != confirmPassword) {
      document.getElementById("messageWrongPassword").innerHTML = "The passwords are not the same";
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
          document.getElementById("messageSuccessPassword").innerHTML = "Password correctly changed";
          if (["CARD_NO"] in profile) {
            localStorage.setItem("actualUser", JSON.stringify(actualProfile));
          } else if (["CURRENT_ACCOUNT"] in profile) {
            localStorage.setItem("actualProfile", JSON.stringify(actualProfile));
          }

          setTimeout(() => {
            document.getElementById("messageSuccessPassword").innerHTML = "";
            document.getElementById("changePasswordForm").reset();
          }, 3000);
        } else {
          document.getElementById("messageSuccessPassword").innerHTML = result.message;
          document.getElementById("messageSuccessPassword").style.color = "red";
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
});

// Exportar funciones que necesitan ser accesibles globalmente
window.openModifyUserPopup = openModifyUserPopup;
window.delete_user_admin = delete_user_admin;