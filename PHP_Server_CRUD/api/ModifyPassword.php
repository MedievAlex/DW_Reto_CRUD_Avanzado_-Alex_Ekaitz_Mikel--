<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

parse_str(file_get_contents('php://input'), $data);

$profile_code = trim($data['profile_code'] ?? '');
$old_password = trim($data['old_password'] ?? '');
$new_password = trim($data['new_password'] ?? '');

try {
  $userData = getUserData();

  $errors = [];

  if (empty($profile_code) || !is_numeric($profile_code)) {
    $errors[] = "Profile code is required and must be numeric";
  }

  if (empty($new_password)) $errors[] = "New password is required";

  if (!empty($new_password) && strlen($new_password) < 6) {
    $errors[] = "New password must be at least 6 characters long";
  }

  if ($userData['id'] == $profile_code && empty($old_password)) {
    $errors[] = "Current password is required when changing your own password";
  }

  if (!empty($old_password) && !empty($new_password) && $old_password === $new_password) {
    $errors[] = "New password must be different from current password";
  }

  if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => implode(', ', $errors),
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  if (!isAdmin() && $userData['id'] != $profile_code) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'You can only modify your own password',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  $controller = new controller();

  if ($userData['id'] == $profile_code) {
    $username = $userData['username'];

    if ($userData['type'] === 'admin') {
      $user = $controller->loginAdmin($username, $old_password);
    } else {
      $user = $controller->loginUser($username, $old_password);
    }

    if (is_null($user)) {
      http_response_code(403);
      echo json_encode([
        'success' => false,
        'message' => 'Current password is incorrect',
        'data' => []
      ], JSON_UNESCAPED_UNICODE);
      exit();
    }
  }

  $modify = $controller->modifyPassword($profile_code, $new_password);

  if ($modify) {
    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'Password updated successfully',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'Error updating password',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Server error: ' . $e->getMessage(),
    'data' => []
  ], JSON_UNESCAPED_UNICODE);

}
