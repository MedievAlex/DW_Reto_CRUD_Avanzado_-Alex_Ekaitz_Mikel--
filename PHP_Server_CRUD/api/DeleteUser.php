<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

$id = $_GET['id'] ?? null;

try {
  $userData = getUserData();

  if (empty($id) || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'User ID is required and must be numeric',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  if (!isAdmin() && $id != $userData['id']) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'Forbidden - You can only delete your own account',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  $controller = new controller();
  $result = $controller->delete_user($id);

  if ($result) {
    if ($id == $userData['id']) {
      session_destroy();
    }

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'User deleted successfully',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(404);
    echo json_encode([
      'success' => false,
      'message' => 'User not found or could not be deleted',
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
