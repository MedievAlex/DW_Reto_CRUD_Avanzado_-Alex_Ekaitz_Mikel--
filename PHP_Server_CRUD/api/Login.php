<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

// DEBUG: Verificar si recibimos datos
$rawInput = file_get_contents('php://input');
error_log("Raw input recibido: " . $rawInput);

$data = json_decode($rawInput, true);
error_log("Datos decodificados: " . print_r($data, true));

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

error_log("Username: $username, Password: $password");

try {
    $controller = new controller();
    
    // DEBUG: Verificar qué devuelven los métodos
    $user = $controller->loginUser($username, $password);
    error_log("Resultado loginUser: " . print_r($user, true));
    
    if (is_null($user)) {
        $admin = $controller->loginAdmin($username, $password);
        error_log("Resultado loginAdmin: " . print_r($admin, true));

        if (is_null($admin)) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'message' => 'Username or password are incorrect',
                'data' => null
            ], JSON_UNESCAPED_UNICODE);
        } else {
            $_SESSION['admin_id'] = $admin['id'] ?? '';
            $_SESSION['admin_username'] = $admin['username'] ?? '';
            $_SESSION['user_type'] = 'admin';


            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Admin logged correctly',
                'data' => $admin
            ], JSON_UNESCAPED_UNICODE);
        }
    } else {
        $_SESSION['user_id'] = $user['id'] ?? '';
        $_SESSION['username'] = $user['username'] ?? '';
        $_SESSION['user_type'] = 'user';


        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'User logged correctly',
            'data' => $user
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    error_log("Error en Login.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'data' => null
    ], JSON_UNESCAPED_UNICODE);
}