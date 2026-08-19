<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$mobile = trim($input['mobile'] ?? '');

if (empty($mobile)) {
    echo json_encode(['status' => 'error', 'message' => 'Mobile number is required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = ? LIMIT 1");
    $stmt->execute([$mobile]);
    $user = $stmt->fetch();

    if ($user) {
        // Old number: User exists, generate random 4-digit OTP
        $otp = str_pad((string)rand(1000, 9999), 4, '0', STR_PAD_LEFT);
        
        echo json_encode([
            'status' => 'success',
            'exists' => true,
            'is_registered' => true,
            'otp' => $otp,
            'message' => 'OTP sent successfully',
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
    } else {
        // New number: User does NOT exist, send to register page
        echo json_encode([
            'status' => 'success',
            'exists' => false,
            'is_registered' => false,
            'message' => 'Mobile number not registered. Please register.'
        ]);
    }
} catch (\PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection error: ' . $e->getMessage()
    ]);
}
?>
