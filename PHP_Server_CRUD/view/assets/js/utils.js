function checkProfileType(profile) {
  if (["CARD_NO"] in profile) {
    return "USER";
  } else if (["CURRENT_ACCOUNT"] in profile) {
    return "ADMIN";
  }
  return "UNKNOWN";
}

function getActualProfile() {
  return JSON.parse(localStorage.getItem("actualProfile"));
}
function getActualUser() {
  return JSON.parse(localStorage.getItem("actualUser"));
}