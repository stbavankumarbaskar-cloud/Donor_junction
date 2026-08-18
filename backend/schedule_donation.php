<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$user_mobile = trim($input['user_mobile'] ?? $input['mobile'] ?? '');
$donor_name = trim($input['donor_name'] ?? $input['name'] ?? '');
$blood_group = trim($input['blood_group'] ?? 'O+');
$center_name = trim($input['center_name'] ?? $input['hospital'] ?? '');
$donation_date = trim($input['donation_date'] ?? $input['date'] ?? '');
$time_slot = trim($input['time_slot'] ?? $input['time'] ?? '');
$notes = trim($input['notes'] ?? '');

if (empty($user_mobile) || empty($donor_name) || empty($center_name)) {
    echo json_encode(['status' => 'error', 'message' => 'Required scheduling details missing']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO schedule_donations (user_mobile, donor_name, blood_group, center_name, donation_date, time_slot, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_mobile, $donor_name, $blood_group, $center_name, $donation_date, $time_slot, $notes]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Donation appointment scheduled successfully',
        'schedule_id' => (int)$newId
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
