<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

$id = $_GET['id'] ?? '';

try {
  $controller = new controller();
  $result = $controller->delete_user($id);

  if ($result) {
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
      'message' => 'User not found',
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