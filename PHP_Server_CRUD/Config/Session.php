<?php
require_once '../controller/controller.php';
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

function isLoggedIn()
{
  return isset($_SESSION['user_id']) || isset($_SESSION['admin_id']);
}

function requireLogin()
{
  if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'message' => 'Unauthorized - Please login',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }
}

function isAdmin()
{
  return isset($_SESSION['admin_id']);
}

function requireAdmin()
{
  if (!isAdmin()) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'Forbidden - Admin access required',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }
}

function getUserData()
{
   $controller = new controller();
  if (isset($_SESSION['admin_id'])) {
    $admindata = $controller->get_complete_admin_data($_SESSION['admin_id']);
    return [
      'type' => 'admin',
      'id' => $_SESSION['admin_id'],
      'data' => $admindata ?? null
    ];
  } elseif (isset($_SESSION['user_id'])) {
    $userdata = $controller->get_complete_user_data($_SESSION['user_id']);
    return [
      'type' => 'user',
      'id' => $_SESSION['user_id'],
      'data' => $userdata ?? null
    ];
  }
  return null;
}