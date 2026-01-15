<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

try {
  $errors = [];

  if (empty($username)) {
    $errors[] = "Username is required";
  } elseif (strlen($username) < 3) {
    $errors[] = "Username must be at least 3 characters long";
  }

  if (empty($password)) {
    $errors[] = "Password is required";
  } elseif (strlen($password) < 6) {
    $errors[] = "Password must be at least 6 characters long";
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

  $controller = new controller();
  $user = $controller->create_user($username, $password);

  if ($user) {
    $_SESSION['user_id'] = $user['PROFILE_CODE'];
    $_SESSION['username'] = $username;

    unset($user['PSWD']);

    http_response_code(201);
    echo json_encode([
      'success' => true,
      'message' => 'User created successfully',
      'data' => $user
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(409);
    echo json_encode([
      'success' => false,
      'message' => 'Username already exists',
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

