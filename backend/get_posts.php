<?php
require_once 'db.php';

$mobile = isset($_GET['mobile']) ? trim($_GET['mobile']) : '';
$blood_group = isset($_GET['blood_group']) ? trim($_GET['blood_group']) : '';
$city = isset($_GET['city']) ? trim($_GET['city']) : '';

$where = [];
$params = [];

if (!empty($mobile)) {
    $where[] = "mobile = ?";
    $params[] = $mobile;
}
if (!empty($blood_group) && $blood_group !== 'All') {
    $where[] = "blood_group = ?";
    $params[] = $blood_group;
}
if (!empty($city)) {
    $where[] = "city LIKE ?";
    $params[] = "%$city%";
}

$sql = "SELECT * FROM posts";
if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY id DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $posts,
        'posts' => $posts
    ]);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
