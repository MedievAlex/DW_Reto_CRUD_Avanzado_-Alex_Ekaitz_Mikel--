<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

try {
    $controller = new controller();
    $users = $controller->get_all_users();

    if ($users) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => $users
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
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
