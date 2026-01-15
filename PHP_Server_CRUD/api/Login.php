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
  }

  if (empty($password)) {
    $errors[] = "Password is required";
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
  $user = $controller->loginUser($username, $password);

  if (is_null($user)) {
    $admin = $controller->loginAdmin($username, $password);

    if (is_null($admin)) {
      http_response_code(401);
      echo json_encode([
        'success' => false,
        'message' => 'Username or password are incorrect',
        'data' => []
      ], JSON_UNESCAPED_UNICODE);
      exit();
    } else {
      $_SESSION['admin_id'] = $admin['PROFILE_CODE'];
      $_SESSION['admin_username'] = $admin['USER_NAME'];
      unset($admin['PSWD']);

      http_response_code(200);
      echo json_encode([
        'success' => true,
        'message' => 'Admin logged in successfully',
        'data' => $admin
      ], JSON_UNESCAPED_UNICODE);
    }
  } else {
    $_SESSION['user_id'] = $user['PROFILE_CODE'];
    $_SESSION['username'] = $user['USER_NAME'];

    unset($user['PSWD']);

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'User logged in successfully',
      'data' => $user
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
