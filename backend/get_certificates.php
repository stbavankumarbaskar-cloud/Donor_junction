<?php
require_once 'db.php';

$mobile = isset($_GET['mobile']) ? trim($_GET['mobile']) : '';

try {
    if (!empty($mobile)) {
        $stmt = $pdo->prepare("SELECT * FROM certificates WHERE mobile = ? ORDER BY id DESC");
        $stmt->execute([$mobile]);
    } else {
        $stmt = $pdo->query("SELECT * FROM certificates ORDER BY id DESC");
    }
    $certificates = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $certificates,
        'certificates' => $certificates
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
