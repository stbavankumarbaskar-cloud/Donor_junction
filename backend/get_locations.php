<?php
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM locations ORDER BY id ASC");
    $locations = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $locations,
        'locations' => $locations
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
