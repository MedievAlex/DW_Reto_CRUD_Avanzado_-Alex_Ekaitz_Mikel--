<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once '../Config/Session.php';
require_once '../controller/controller.php';

requireLogin();

parse_str(file_get_contents('php://input'), $data);

$profile_code = trim($data['profile_code'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$telephone = trim($data['telephone'] ?? '');
$name = trim($data['name'] ?? '');
$surname = trim($data['surname'] ?? '');
$gender = trim($data['gender'] ?? '');
$card_no = trim($data['card_no'] ?? '');

try {
  $userData = getUserData();
  
  // Debug: verificar estructura de userData
  error_log("UserData en ModifyUser.php: " . json_encode($userData));

  $errors = [];

  if (empty($profile_code) || !is_numeric($profile_code)) {
    $errors[] = "Profile code is required and must be numeric";
  }
  if (empty($email)) $errors[] = "Email is required";
  if (empty($username)) $errors[] = "Username is required";
  if (empty($telephone)) $errors[] = "Phone is required";
  if (empty($name)) $errors[] = "Name is required";
  if (empty($surname)) $errors[] = "Surname is required";
  if (empty($gender)) $errors[] = "Gender is required";
  if (empty($card_no)) $errors[] = "Card number is required";

  if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
  }

  if (!empty($username)) {
    if (strlen($username) < 3) {
      $errors[] = "Username must be at least 3 characters long";
    }
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
      $errors[] = "Username can only contain letters, numbers, underscores and hyphens";
    }
  }

  if (!empty($telephone)) {
    $cleanPhone = str_replace(' ', '', $telephone);
    if (!preg_match('/^\+?[0-9]{9,15}$/', $cleanPhone)) {
      $errors[] = "Invalid phone number format";
    }
  }

  if (!empty($name) && strlen($name) < 2) {
    $errors[] = "Name must be at least 2 characters long";
  }
  if (!empty($surname) && strlen($surname) < 2) {
    $errors[] = "Surname must be at least 2 characters long";
  }

  $validGenders = ['Man', 'Female', 'Other'];
  if (!empty($gender) && !in_array($gender, $validGenders)) {
    $errors[] = "Invalid gender value. Must be: Man, Female, or Other";
  }

  if (!empty($card_no)) {
    $cleanCard = str_replace(' ', '', $card_no);
    if (!preg_match('/^[0-9]{16}$/', $cleanCard)) {
      $errors[] = "Card number must be 16 digits";
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

  // Verificar permisos - MODIFICADO para nueva estructura
  $currentUserType = $userData['type'] ?? null;
  $currentUserId = $userData['id'] ?? null;
  
  // Si no es admin y no está modificando su propio perfil
  if ($currentUserType !== 'admin' && $currentUserId != $profile_code) {
    http_response_code(403);
    echo json_encode([
      'success' => false,
      'message' => 'You can only modify your own profile',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
    exit();
  }

  $controller = new controller();
  $modify = $controller->modifyUser($email, $username, $telephone, $name, $surname, $gender, $card_no, $profile_code);

  if ($modify) {
    // Actualizar datos en sesión si es el usuario actual
    if ($currentUserId == $profile_code) {
      // Para usuario normal
      if ($currentUserType === 'user') {
        $_SESSION['username'] = $username;
        
        // Si queremos actualizar más datos en sesión
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $name;
        
        // También actualizar los datos en $userData['Data'] si existe
        if (isset($userData['Data']) && is_array($userData['Data'])) {
          $userData['Data']['EMAIL'] = $email;
          $userData['Data']['USER_NAME'] = $username;
          $userData['Data']['TELEPHONE'] = $telephone;
          $userData['Data']['NAME'] = $name;
          $userData['Data']['SURNAME'] = $surname;
          $userData['Data']['GENDER'] = $gender;
          $userData['Data']['CARD_NO'] = $card_no;
        }
      }
      // Para admin
      elseif ($currentUserType === 'admin') {
        $_SESSION['admin_username'] = $username;
        $_SESSION['admin_email'] = $email;
      }
    }

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'message' => 'User profile updated successfully',
      'data' => []
    ], JSON_UNESCAPED_UNICODE);
  } else {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'Error updating user profile',
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