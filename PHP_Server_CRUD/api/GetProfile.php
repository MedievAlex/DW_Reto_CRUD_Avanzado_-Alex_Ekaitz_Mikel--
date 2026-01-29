<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

try {
    $controller = new controller();

    if (isset($_GET['pcode'])) {
        $id = $_GET['pcode'];
    } else {
        $userData = getUserData();
        $id = $userData["id"];
    }

    $result = $controller->get_user($userData["id"]);

    if ($result) {
        unset($result['PSWD']);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => $result
        ], JSON_UNESCAPED_UNICODE);
    } else {
        $result = $controller->get_admin($userData["id"]);

        if ($result) {
            unset($result['PSWD']);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Admin retrieved successfully',
                'data' => $result
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Profile not found',
                'data' => []
            ], JSON_UNESCAPED_UNICODE);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'data' => []
    ], JSON_UNESCAPED_UNICODE);
}
