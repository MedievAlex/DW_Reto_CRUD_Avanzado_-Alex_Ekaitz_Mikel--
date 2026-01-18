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
      $list = htmlspecialchars(trim($_GET['list'] ?? ''), ENT_QUOTES, 'UTF-8');

      if (empty($list)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'List name is required',
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
      $list = htmlspecialchars(trim($_POST['list'] ?? ''), ENT_QUOTES, 'UTF-8');

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        $errors[] = "Videogame ID is required and must be numeric";
      }

      if (empty($list)) {
        $errors[] = "List name is required";
      }

      if (strlen($list) > 100) {
        $errors[] = "List name is too long (max 100 characters)";
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
          $errors[] = "Profile ID is required and must be numeric";
        }
      } else {
        $profile_code = $userData['id'];
      }

      $old_list = htmlspecialchars(trim($data['old_list'] ?? ''), ENT_QUOTES, 'UTF-8');
      $new_list = htmlspecialchars(trim($data['new_list'] ?? ''), ENT_QUOTES, 'UTF-8');

      if (empty($old_list)) {
        $errors[] = "Old list name is required";
      }

      if (empty($new_list)) {
        $errors[] = "New list name is required";
      }

      if (strlen($new_list) > 100) {
        $errors[] = "New list name is too long (max 100 characters)";
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

      $existingList = $controller->get_list($profile_code, $old_list);

      if (!$existingList) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'List not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!isAdmin() && $existingList[0]['PROFILE_CODE'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only update your own lists',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->update_list($profile_code, $old_list, $new_list);

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
      $list = htmlspecialchars(trim($_GET['list'] ?? ''), ENT_QUOTES, 'UTF-8');
      $videogame_code = $_GET['vcode'] ?? null;

      if (empty($list)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'List name is required',
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
            'message' => 'Profile ID is required and must be numeric',
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

      if (!isAdmin() && $existingList[0]['PROFILE_CODE'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only delete your own lists',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!empty($videogame_code)) {
        if (!is_numeric($videogame_code)) {
          http_response_code(400);
          echo json_encode([
            'success' => false,
            'message' => 'Videogame ID must be numeric',
            'data' => []
          ], JSON_UNESCAPED_UNICODE);
          exit();
        }

        $result = $controller->delete_game_list($profile_code, $videogame_code, $list);
        $message = 'Game removed from list successfully';
      } else {
        $result = $controller->delete_list($profile_code, $list);
        $message = 'List deleted successfully';
      }

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => $message,
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Operation could not be completed',
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
