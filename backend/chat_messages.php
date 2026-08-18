<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user_phone = isset($_GET['user_phone']) ? trim($_GET['user_phone']) : '';
    $partner_mobile = isset($_GET['partner_mobile']) ? trim($_GET['partner_mobile']) : '';
    $partner_name = isset($_GET['partner_name']) ? trim($_GET['partner_name']) : 'Hospital';

    if (empty($user_phone) || empty($partner_mobile)) {
        echo json_encode(['status' => 'error', 'message' => 'User phone and partner mobile are required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM chat_messages WHERE user_phone = ? AND partner_mobile = ? ORDER BY id ASC");
        $stmt->execute([$user_phone, $partner_mobile]);
        $messages = $stmt->fetchAll();

        if (empty($messages)) {
            $stmtInsert = $pdo->prepare("INSERT INTO chat_messages (user_phone, partner_mobile, partner_name, sender, text, timestamp) VALUES (?, ?, ?, 'partner', ?, ?)");
            $greeting = "Hello! Thank you for contacting $partner_name. How can we help you regarding blood requirement?";
            $timeStr = date('h:i A');
            $stmtInsert->execute([$user_phone, $partner_mobile, $partner_name, $greeting, $timeStr]);

            $stmt->execute([$user_phone, $partner_mobile]);
            $messages = $stmt->fetchAll();
        }

        echo json_encode([
            'status' => 'success',
            'data' => $messages,
            'messages' => $messages
        ]);
    } catch (\PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    if (isset($input['clear']) && $input['clear'] === true) {
        $user_phone = trim($input['user_phone'] ?? '');
        $partner_mobile = trim($input['partner_mobile'] ?? '');
        
        $stmt = $pdo->prepare("DELETE FROM chat_messages WHERE user_phone = ? AND partner_mobile = ?");
        $stmt->execute([$user_phone, $partner_mobile]);

        echo json_encode(['status' => 'success', 'message' => 'Chat cleared']);
        exit();
    }

    $user_phone = trim($input['user_phone'] ?? '');
    $partner_mobile = trim($input['partner_mobile'] ?? '');
    $partner_name = trim($input['partner_name'] ?? 'Hospital');
    $sender = trim($input['sender'] ?? 'user');
    $text = trim($input['text'] ?? '');
    $timestamp = trim($input['timestamp'] ?? date('h:i A'));

    if (empty($user_phone) || empty($partner_mobile) || empty($text)) {
        echo json_encode(['status' => 'error', 'message' => 'Message text is required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chat_messages (user_phone, partner_mobile, partner_name, sender, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_phone, $partner_mobile, $partner_name, $sender, $text, $timestamp]);

        $stmtThread = $pdo->prepare("INSERT INTO chat_threads (user_phone, partner_mobile, partner_name, last_message) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE last_message = VALUES(last_message)");
        $stmtThread->execute([$user_phone, $partner_mobile, $partner_name, $text]);

        echo json_encode([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);
    } catch (\PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>
