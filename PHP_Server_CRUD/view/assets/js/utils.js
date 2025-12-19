export function checkProfileType(profile) {
  if (["CARD_NO"] in profile) {
    return "USER";
  } else if (["CURRENT_ACCOUNT"] in profile) {
    return "ADMIN";
  }
  return "UNKNOWN";
}

export function getActualProfile() {
  return JSON.parse(localStorage.getItem("actualProfile"));
}

export function getActualUser() {
  return JSON.parse(localStorage.getItem("actualUser"));
}