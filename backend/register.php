<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$name = trim($input['name'] ?? '');
$mobile = trim($input['mobile'] ?? '');
$email = trim($input['email'] ?? '');
$blood_group = trim($input['blood_group'] ?? 'O+');
$city = trim($input['city'] ?? 'Chennai');
$password = trim($input['password'] ?? '123456');

if (empty($name) || empty($mobile)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and mobile number are required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE mobile = ? LIMIT 1");
    $stmt->execute([$mobile]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'Mobile number already registered']);
        exit();
    }

    $stmt = $pdo->prepare("INSERT INTO users (name, mobile, email, blood_group, city, password) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $mobile, $email, $blood_group, $city, $password]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'user' => [
            'id' => (int)$newId,
            'name' => $name,
            'mobile' => $mobile,
            'email' => $email,
            'blood_group' => $blood_group,
            'city' => $city
        ]
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
