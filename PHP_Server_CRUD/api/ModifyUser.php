<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../controller/controller.php';

$profile_code = $_GET['profile_code'] ?? '';
$email = $_GET['email'] ?? '';
$username = $_GET['username'] ?? '';
$telephone = $_GET['telephone'] ?? '';
$name = $_GET['name'] ?? '';
$surname = $_GET['surname'] ?? '';
$gender = $_GET['gender'] ?? '';
$card_no = $_GET['card_no'] ?? '';

try {
    $controller = new controller();
    $modify = $controller->modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code);

    if ($modify) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User modified correctly',
            'data' => []
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error modifying the user',
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
