<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user_phone = isset($_GET['user_phone']) ? trim($_GET['user_phone']) : '';
    if (empty($user_phone)) {
        echo json_encode(['status' => 'error', 'message' => 'User phone is required']);
        exit();
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM chat_threads WHERE user_phone = ? ORDER BY updated_at DESC");
        $stmt->execute([$user_phone]);
        $threads = $stmt->fetchAll();

        if (empty($threads)) {
            $stmtInsert = $pdo->prepare("INSERT INTO chat_threads (user_phone, partner_mobile, partner_name, partner_type, last_message) VALUES (?, '044-28290200', 'Apollo Blood Center', 'hospital', 'Welcome to Apollo Blood Center! How can we assist your blood donation today?')");
            $stmtInsert->execute([$user_phone]);

            $stmt = $pdo->prepare("SELECT * FROM chat_threads WHERE user_phone = ? ORDER BY updated_at DESC");
            $stmt->execute([$user_phone]);
            $threads = $stmt->fetchAll();
        }

        echo json_encode([
            'status' => 'success',
            'data' => $threads,
            'threads' => $threads
        ]);
    } catch (\PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $user_phone = trim($input['user_phone'] ?? '');
    $partner_mobile = trim($input['partner_mobile'] ?? '');
    $partner_name = trim($input['partner_name'] ?? '');
    $partner_type = trim($input['partner_type'] ?? 'hospital');
    $last_message = trim($input['last_message'] ?? 'Chat started');

    if (empty($user_phone) || empty($partner_mobile)) {
        echo json_encode(['status' => 'error', 'message' => 'User phone and partner mobile are required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chat_threads (user_phone, partner_mobile, partner_name, partner_type, last_message) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE last_message = VALUES(last_message), partner_name = VALUES(partner_name)");
        $stmt->execute([$user_phone, $partner_mobile, $partner_name, $partner_type, $last_message]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Chat thread updated'
        ]);
    } catch (\PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
