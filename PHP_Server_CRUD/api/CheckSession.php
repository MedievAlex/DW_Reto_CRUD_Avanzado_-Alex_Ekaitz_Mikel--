<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';

if (isLoggedIn()) {
  $userData = getUserData();
  http_response_code(200);
  echo json_encode([
    'success' => true,
    'message' => 'Session active',
    'data' => $userData
  ], JSON_UNESCAPED_UNICODE);
} else {
  http_response_code(401);
  echo json_encode([
    'success' => false,
    'message' => 'No active session',
    'data' => []
  ], JSON_UNESCAPED_UNICODE);
}