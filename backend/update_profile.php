<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$mobile = trim($input['mobile'] ?? '');
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$blood_group = trim($input['blood_group'] ?? '');
$city = trim($input['city'] ?? '');
$profile_image = trim($input['profile_image'] ?? '');

if (empty($mobile)) {
    echo json_encode(['status' => 'error', 'message' => 'Mobile number is required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = ? LIMIT 1");
    $stmt->execute([$mobile]);
    $existing = $stmt->fetch();

    if ($existing) {
        $updateFields = [];
        $params = [];

        if (!empty($name)) { $updateFields[] = "name = ?"; $params[] = $name; }
        if (!empty($email)) { $updateFields[] = "email = ?"; $params[] = $email; }
        if (!empty($blood_group)) { $updateFields[] = "blood_group = ?"; $params[] = $blood_group; }
        if (!empty($city)) { $updateFields[] = "city = ?"; $params[] = $city; }
        if (!empty($profile_image)) { $updateFields[] = "profile_image = ?"; $params[] = $profile_image; }

        if (!empty($updateFields)) {
            $params[] = $mobile;
            $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE mobile = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE mobile = ? LIMIT 1");
        $stmt->execute([$mobile]);
        $updatedUser = $stmt->fetch();

        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $updatedUser
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
