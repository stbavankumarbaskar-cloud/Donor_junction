<?php
require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$mobile = trim($input['mobile'] ?? '');
$donor_name = trim($input['donor_name'] ?? '');
$donation_date = trim($input['donation_date'] ?? date('Y-m-d'));
$certificate_code = trim($input['certificate_code'] ?? ('CERT-' . time()));
$certificate_url = trim($input['certificate_url'] ?? '');

if (empty($mobile) || empty($donor_name)) {
    echo json_encode(['status' => 'error', 'message' => 'Mobile number and donor name are required']);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO certificates (mobile, donor_name, donation_date, certificate_code, certificate_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$mobile, $donor_name, $donation_date, $certificate_code, $certificate_url]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Certificate added successfully',
        'certificate_id' => (int)$newId
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
