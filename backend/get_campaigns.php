<?php
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM campaigns ORDER BY id DESC");
    $campaigns = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $campaigns,
        'campaigns' => $campaigns
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
