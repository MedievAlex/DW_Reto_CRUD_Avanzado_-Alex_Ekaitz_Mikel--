<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';

session_unset();
session_destroy();

http_response_code(200);
echo json_encode([
  'success' => true,
  'message' => 'Logged out successfully',
  'data' => []
], JSON_UNESCAPED_UNICODE);
