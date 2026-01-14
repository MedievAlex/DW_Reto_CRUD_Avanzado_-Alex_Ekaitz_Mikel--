<?php
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
  if (isset($_SESSION['admin_id'])) {
    return [
      'type' => 'admin',
      'id' => $_SESSION['admin_id'],
      'username' => $_SESSION['admin_username'] ?? null
    ];
  } elseif (isset($_SESSION['user_id'])) {
    return [
      'type' => 'user',
      'id' => $_SESSION['user_id'],
      'username' => $_SESSION['username'] ?? null
    ];
  }
  return null;
}