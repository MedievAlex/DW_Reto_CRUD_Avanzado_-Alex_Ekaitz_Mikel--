<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

try {
    $controller = new controller();
    $type = $controller->checkUser($username, $password);

    if ($type) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User type',
            'data' => [
                'type' => 'admin'
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else if (!$type) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User type',
            'data' => [
                'type' => 'user'
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'There was an error when processing the profile.',
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
