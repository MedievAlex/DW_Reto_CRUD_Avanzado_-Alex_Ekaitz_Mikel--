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

      if (empty($profile_code) || !is_numeric($profile_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Profile ID is required and must be numeric',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame ID is required and must be numeric',
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
        $errors[] = "Videogame ID is required and must be numeric";
      }

      if (empty($score) || !is_numeric($score)) {
        $errors[] = "Score is required and must be numeric";
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
          'data' => $result
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
      $videogame_code = $_GET['id'] ?? null;
      parse_str(file_get_contents('php://input'), $data);

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame ID is required and must be numeric',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $errors = [];

      if (isAdmin() && isset($data['pcode'])) {
        $profile_code = $data['pcode'];

        if (empty($profile_code) || !is_numeric($profile_code)) {
          $errors[] = "Profile ID is required and must be numeric";
        }
      } else {
        $profile_code = $userData['id'];
      }

      $score = $data['score'] ?? '';
      $description = $data['description'] ?? '';
      $date = $data['date'] ?? '';

      if (empty($score) || !is_numeric($score)) {
        $errors[] = "Score is required and must be numeric";
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

      $existingReview = $controller->get_review($profile_code, $videogame_code);

      if (!$existingReview) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Review not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!isAdmin() && $existingReview['profile_code'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only update your own reviews',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $review = new Review($profile_code, $videogame_code, $score, $description, $date);
      $result = $controller->update_review($review);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Review updated successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Error updating review',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      }
      break;

    case 'DELETE':
      $videogame_code = $_GET['id'] ?? null;

      if (empty($videogame_code) || !is_numeric($videogame_code)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Videogame ID is required and must be numeric',
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

      $existingReview = $controller->get_review($profile_code, $videogame_code);

      if (!$existingReview) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Review not found',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      if (!isAdmin() && $existingReview['profile_code'] != $userData['id']) {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Forbidden - You can only delete your own reviews',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
        exit();
      }

      $result = $controller->delete_review($profile_code, $videogame_code);

      if ($result) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'Review deleted successfully',
          'data' => []
        ], JSON_UNESCAPED_UNICODE);
      } else {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'Review could not be deleted',
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
