<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once '../Config/Session.php';
require_once '../controller/controller.php';
require_once '../model/Review.php';

requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

try {
  $controller = new controller();
  $userData = getUserData();

  switch ($method) {
    case 'GET':
      $profile_code = $_GET['pcode'] ?? null;
      $videogame_code = $_GET['vcode'] ?? null;

      if (empty($profile_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Profile code is required',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!is_numeric($profile_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Invalid profile code',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (empty($videogame_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame code is required',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!is_numeric($videogame_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Invalid videogame code',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $review = $controller->get_review($profile_code, $videogame_code);

      if ($review) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Review retrieved successfully',
          'data' => $review
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Review not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'POST':
      $errors = [];

      $profile_code = $userData['id'];
      $videogame_code = $_POST['vcode'] ?? '';
      $score = $_POST['score'] ?? '';
      $description = $_POST['description'] ?? '';
      $date = $_POST['date'] ?? '';

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        $errors[] = "Invalid videogame code";
      }

      if (empty($score) || !is_numeric($score)) {
        $errors[] = "Invalid score";
      }

      if (!empty($date)) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
          $errors[] = "Invalid date format. Use YYYY-MM-DD";
        }
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

      $review = new Review($profile_code, $videogame_code, $score, $description, $date);
      $result = $controller->create_review($review);

      if ($result) {
        http_response_code(201);
        echo json_encode([
          'success' => true,
          'message' => 'Review created successfully',
          'data' => ['id' => $result]
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Error creating review',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'PUT':
      $id = $_GET['id'] ?? null;
      parse_str(file_get_contents('php://input'), $data);

      if (empty($id)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame ID is required',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $errors = [];

      $name = $data['name'] ?? '';
      $release = $data['release'] ?? '';
      $platformStr = $data['platform'] ?? '';
      $pegiStr = $data['pegi'] ?? '';

      if (empty($name)) $errors[] = "Name is required";
      if (empty($release)) $errors[] = "Release date is required";
      if (empty($platformStr)) $errors[] = "Platform is required";
      if (empty($pegiStr)) $errors[] = "PEGI rating is required";

      $platform = Platform::tryFrom($platformStr);
      if (!$platform) {
        $validPlatforms = array_map(fn($case) => $case->name, Platform::cases());
        $errors[] = "Invalid platform. Must be: " . implode(', ', $validPlatforms);
      }

      $pegi = Pegi::tryFrom($pegiStr);
      if (!$pegi) {
        $validPegi = array_map(fn($case) => $case->name, Pegi::cases());
        $errors[] = "Invalid PEGI. Must be: " . implode(', ', $validPegi);
      }

      if (!empty($release)) {
        $dateObj = DateTime::createFromFormat('Y-m-d', $release);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $release) {
          $errors[] = "Invalid date format. Use YYYY-MM-DD";
        }
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

      $videogame = new Videogame($name, $release, $platform, $pegi);
      $result = $controller->update_videogame($id, $videogame);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Videogame updated successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Error updating videogame',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'DELETE':
      requireAdmin();

      $id = $_GET['id'] ?? null;

      if (empty($id)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame ID is required',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->delete_videogame($id);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Videogame deleted successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame not found or could not be deleted',
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
