// Hay que cambiar logica de recogida de listas.

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once '../Config/Session.php';
require_once '../controller/controller.php';
require_once '../model/Listed.php';

requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

try {
  $controller = new controller();
  $userData = getUserData();

  switch ($method) {
    case 'GET':
      $profile_code = $userData['id'];
      $list = $_GET['list'] ?? null;

      if (empty($list)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Invalid list',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->get_list($profile_code, $list);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'List retrieved successfully',
          'data' => $result
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'List not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'POST':
      $errors = [];

      $profile_code = $userData['id'];
      $videogame_code = $_POST['vcode'] ?? '';
      $list = $_POST['list'] ?? '';

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        $errors[] = "Invalid videogame code";
      }

      if (empty($list)) {
        $errors[] = "Invalid list";
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

      $listed = new Listed($profile_code, $videogame_code, $list);
      $result = $controller->create_list($listed);

      if ($result) {
        http_response_code(201);
        echo json_encode([
          'success' => true,
          'message' => 'List created successfully',
          'data' => $result
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Error creating list',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'PUT':
      parse_str(file_get_contents('php://input'), $data);

      $errors = [];

      if (isAdmin() && isset($data['pcode'])) {
        $profile_code = $data['pcode'];

        if (empty($profile_code) || !is_numeric($profile_code)) {
          $errors[] = "Invalid profile code";
        }
      } else {
        $profile_code = $userData['id'];
      }

      $videogame_code = $data['vcode'];
      $list = $data['list'];

      if (empty($videogame_code) || !is_numeric($videogame_code)) $errors[] = "Invalid videogame ID";

      if (!empty($list)) {
        $errors[] = "Invalid list";
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

      $existingList = $controller->get_list($profile_code, $list);

      if (!$existingList) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'List not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!isAdmin() && $existingList['profile_code'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only update your own lists',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->update_list($profile_code, $list);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'List updated successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Error updating list',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'DELETE':
      $list = $_GET['list'] ?? null;

      if (empty($list)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Invalid list',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (isAdmin() && isset($_GET['pcode'])) {
        $profile_code = $_GET['pcode'];

        if (empty($profile_code) || !is_numeric($profile_code)) {
          http_response_code(400);
          echo json_encode([
            'success' => false,
            'message' => 'Invalid profile code',
            'data' => []
          ], JSON_UNESCAPED_UNICODE);
          exit();
        }
      } else {
        $profile_code = $userData['id'];
      }

      $existingList = $controller->get_list($profile_code, $list);

      if (!$existingList) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'List not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!isAdmin() && $existingList['profile_code'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only delete your own lists',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->delete_list($list);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'List deleted successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'List could not be deleted',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
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
