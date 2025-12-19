export function openModifyUserPopup(actualProfile) {
  document.getElementById("message").innerHTML = "";
  localStorage.setItem("actualUser", JSON.stringify(actualProfile));

  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    gender: actualProfile.GENDER,
    card_no: actualProfile.CARD_NO,
  };

  document.getElementById("usernameUser").value = usuario.username;
  if (usuario.email) {
    document.getElementById("emailUser").value = usuario.email;
    document.getElementById("phoneUser").value = usuario.telephone;
    document.getElementById("firstNameUser").value = usuario.name;
    document.getElementById("lastNameUser").value = usuario.surname;
    document.getElementById("genderUser").value = usuario.gender;
    document.getElementById("cardNumberUser").value = usuario.card_no;
  }

  let modifyUserPopup = document.getElementById("modifyUserPopupAdmin");
  modifyUserPopup.style.display = "flex";
}

export async function modifyUser() {
  const actualProfile = JSON.parse(localStorage.getItem("actualUser"));

  const usuario = {
    profile_code: actualProfile.PROFILE_CODE,
    password: actualProfile.PSWD,
    email: actualProfile.EMAIL,
    username: actualProfile.USER_NAME,
    telephone: actualProfile.TELEPHONE,
    name: actualProfile.NAME_,
    surname: actualProfile.SURNAME,
    gender: actualProfile.GENDER,
    card_no: actualProfile.CARD_NO,
  };

  const profile_code = usuario.profile_code;
  const name = document.getElementById("firstNameUser").value;
  const surname = document.getElementById("lastNameUser").value;
  const email = document.getElementById("emailUser").value;
  const username = document.getElementById("usernameUser").value;
  const telephone = document.getElementById("phoneUser").value.replace(/\s/g, "");
  const gender = document.getElementById("genderUser").value;
  const card_no = document.getElementById("cardNumberUser").value;

  if (!name || !surname || !email || !username || !telephone || !gender || !card_no) {
    document.getElementById("message").innerHTML = "You must fill all the fields";
    document.getElementById("message").style.color = "red";
    return;
  }

  function hasChanges() {
    let changes = false;

    if (
      name !== usuario.name ||
      surname !== usuario.surname ||
      email !== usuario.email ||
      username !== usuario.username ||
      telephone !== usuario.telephone ||
      gender !== usuario.gender ||
      card_no !== usuario.card_no
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
      const response = await fetch(
        `../../api/ModifyUser.php?profile_code=${encodeURIComponent(
          profile_code
        )}&name=${encodeURIComponent(name)}&surname=${encodeURIComponent(
          surname
        )}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(
          username
        )}&telephone=${encodeURIComponent(
          telephone
        )}&gender=${encodeURIComponent(gender)}&card_no=${encodeURIComponent(
          card_no
        )}`
      );
      const result = await response.json();

      if (response.ok) {
        document.getElementById("message").innerHTML = result.message;
        document.getElementById("message").style.color = "green";

        actualProfile.NAME_ = name;
        actualProfile.SURNAME = surname;
        actualProfile.EMAIL = email;
        actualProfile.USER_NAME = username;
        actualProfile.TELEPHONE = telephone;
        actualProfile.CARD_NO = card_no;
        actualProfile.GENDER = gender;

        localStorage.setItem("actualUser", JSON.stringify(actualProfile));

        if (["CURRENT_ACCOUNT"] in JSON.parse(localStorage.getItem("actualProfile"))) {
          if (typeof refreshAdminTable === 'function') {
            refreshAdminTable();
          }
        } else {
          localStorage.setItem("actualProfile", JSON.stringify(actualProfile));
        }
      } else {
        document.getElementById("message").innerHTML = result.message;
        document.getElementById("message").style.color = "red";
      }
    } catch (error) {
      console.error(error);
    }
  }
}