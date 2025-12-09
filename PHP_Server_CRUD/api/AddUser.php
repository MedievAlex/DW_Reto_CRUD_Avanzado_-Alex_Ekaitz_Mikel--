<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../controller/controller.php';
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$pswd = $input['pswd'] ?? '';

try {
    $controller = new controller();
    $user = $controller->create_user($username, $pswd);

    if ($user) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error creating user',
            'data' => []
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'data' => []
    ], JSON_UNESCAPED_UNICODE);
}
