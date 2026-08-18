<?php
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM blogs ORDER BY id DESC");
    $blogs = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $blogs,
        'blogs' => $blogs
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
