<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$patient_name = trim($input['patient_name'] ?? '');
$blood_group = trim($input['blood_group'] ?? '');
$units = (int)($input['units'] ?? 1);
$hospital = trim($input['hospital'] ?? '');
$city = trim($input['city'] ?? '');
$mobile = trim($input['mobile'] ?? '');
$urgency = trim($input['urgency'] ?? 'Normal');
$note = trim($input['note'] ?? '');
$latitude = isset($input['latitude']) ? (float)$input['latitude'] : null;
$longitude = isset($input['longitude']) ? (float)$input['longitude'] : null;

if (empty($patient_name) || empty($blood_group) || empty($hospital) || empty($mobile)) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields missing']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO posts (patient_name, blood_group, units, hospital, city, mobile, urgency, note, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$patient_name, $blood_group, $units, $hospital, $city, $mobile, $urgency, $note, $latitude, $longitude]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Blood request post created successfully',
        'post_id' => (int)$newId
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
