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
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$telephone = trim($data['telephone'] ?? '');
$name = trim($data['name'] ?? '');
$surname = trim($data['surname'] ?? '');
$current_account = trim($data['current_account'] ?? '');

try {
  $userData = getUserData();

  $errors = [];

  if (empty($profile_code) || !is_numeric($profile_code)) {
    $errors[] = "Profile code is required and must be numeric";
  }
  if (empty($email)) $errors[] = "Email is required";
  if (empty($username)) $errors[] = "Username is required";
  if (empty($telephone)) $errors[] = "Phone is required";
  if (empty($name)) $errors[] = "Name is required";
  if (empty($surname)) $errors[] = "Surname is required";
  if (empty($current_account)) $errors[] = "Current account is required";

  if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
  }

  if (!empty($username)) {
    if (strlen($username) < 3) {
      $errors[] = "Username must be at least 3 characters long";
    }
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
      $errors[] = "Username can only contain letters, numbers, underscores and hyphens";
    }
  }

  if (!empty($telephone)) {
    $cleanPhone = str_replace(' ', '', $telephone);
    if (!preg_match('/^\+?[0-9]{9,15}$/', $cleanPhone)) {
      $errors[] = "Invalid phone number format";
    }
  }

  if (!empty($name) && strlen($name) < 2) {
    $errors[] = "Name must be at least 2 characters long";
  }
  if (!empty($surname) && strlen($surname) < 2) {
    $errors[] = "Surname must be at least 2 characters long";
  }

  if (!empty($current_account)) {
    $cleanAccount = str_replace(' ', '', $current_account);
    if (strlen($cleanAccount) < 10 || strlen($cleanAccount) > 34) {
      $errors[] = "Invalid account number format";
    }
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

  if ($userData['id'] != $profile_code) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'You can only modify your own profile',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  $controller = new controller();
  $modify = $controller->modifyAdmin($email, $username, $telephone, $name, $surname, $current_account, $profile_code);

  if ($modify) {
    $_SESSION['admin_username'] = $username;

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'Admin profile updated successfully',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'Error updating admin profile',
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