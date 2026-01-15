<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireAdmin();

try {
  $controller = new controller();
  $users = $controller->get_all_users();

  if ($users) {
    /*
        * El & sirve para referenciar el valor en memoria del elemento en cada iteración del bucle
        * Es decir, $user en lugar de ser una copia del elemento, es el propio elemento, permitiendo modificar el array original
        */
    foreach ($users as &$user) {
      unset($user['PSWD']);
    }
    unset($user); // Romper la referencia después del foreach por buena práctica

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'Users retrieved successfully',
      'data' => $users
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(404);
    echo json_encode([
      'success' => false,
      'message' => 'Users not found',
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
