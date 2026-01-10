<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
  $controller = new controller();

  switch ($method) {
    case 'GET':
      $id = $_GET['id'] ?? null;
      $videogame = $controller->get_videogame($id);

      if ($videogame) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Videogame retrieved successfully',
          'data' => $videogame
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'POST':
      try {
      } catch (Exception $e) {
        $message = $e->getMessage();
        if (
          strpos($message, 'already exists') !== false
        ) {
          http_response_code(409);
        } else {
          http_response_code(500);
        }

        echo json_encode([
          'success' => false,
          'message' => $message,
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'PUT':

      break;

    case 'DELETE':

      break;

    default:
      http_response_code(405);
      echo json_encode([
        'success' => false,
        'message' => 'Method not allowed',
        'data' => []
      ], JSON_UNESCAPED_UNICODE);
      break;
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Server error: ' . $e->getMessage(),
    'data' => []
  ], JSON_UNESCAPED_UNICODE);
}
