<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$mobile = trim($input['mobile'] ?? '');
$otp = trim($input['otp'] ?? '');

if (empty($mobile)) {
    echo json_encode(['status' => 'error', 'message' => 'Mobile number is required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = ? LIMIT 1");
    $stmt->execute([$mobile]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found. Please register first.']);
        exit();
    }

    echo json_encode([
        'status' => 'success',
        'is_registered' => true,
        'message' => 'OTP verified successfully',
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'mobile' => $user['mobile'],
            'email' => $user['email'] ?? '',
            'blood_group' => $user['blood_group'] ?? 'O+',
            'city' => $user['city'] ?? 'Chennai',
            'profile_image' => $user['profile_image'] ?? null
        ]
    ]);
} catch (\PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
