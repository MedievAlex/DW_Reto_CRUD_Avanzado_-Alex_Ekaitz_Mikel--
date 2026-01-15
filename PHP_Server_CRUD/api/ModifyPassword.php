<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

$input = json_decode(file_get_contents('php://input'), true);
$profile_code = trim($input['profile_code'] ?? '');
$old_password = trim($input['old_password'] ?? '');
$new_password = trim($input['new_password'] ?? '');

try {
  $errors = [];

  if (empty($profile_code)) $errors[] = "Profile code is required";
  if (empty($old_password)) $errors[] = "Old password is required";
  if (empty($new_password)) $errors[] = "New password is required";

  if (!empty($new_password) && strlen($new_password) < 6) {
    $errors[] = "New password must be at least 6 characters long";
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

  if ($_SESSION['profile_code'] !== $profile_code) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'You can only modify your own password',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  $controller = new controller();
  $username = $_SESSION['username'];

  if ($_SESSION['user_type'] === 'admin') {
    $user = $controller->loginAdmin($username, $current_password);
  } else {
    $user = $controller->loginUser($username, $current_password);
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

  $modify = $controller->modifyPassword($profile_code, $new_password);

  if ($modify) {
    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'Password modified correctly',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'Error modifying the password',
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
