<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$input = json_decode(file_get_contents('php://input'), true);
$profile_code = $input['profile_code'] ?? '';
$password = $input['password'] ?? '';

try {
    $controller = new controller();
    $modify = $controller->modifyPassword($profile_code, $password);

    if ($modify) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Password modified correctly',
            'data' => []
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error modifying the password',
            'data' => []
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'data' => []
    ], JSON_UNESCAPED_UNICODE);
}
