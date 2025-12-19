export function resetPasswordModal() {
  document.getElementById("changePasswordForm").reset();
  document.getElementById("messageOldPassword").innerHTML = "";
  document.getElementById("messageWrongPassword").innerHTML = "";
  document.getElementById("message").innerHTML = "";
}

export async function delete_user(id) {
  if (!confirm("Are you sure you want to delete your account?")) return;

  const response = await fetch(
    `../../api/DeleteUser.php?id=${encodeURIComponent(id)}`
  );

  const result = await response.json();

  if (response.ok) {
    window.location.href = "login.html";
  }
}