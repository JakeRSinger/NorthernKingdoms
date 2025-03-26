<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

require 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "User not authenticated. Please log in."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT artefact_dig_site_no, COUNT(artefact_dig_site_no) as count
                                FROM m_artefact
                                GROUP BY artefact_dig_site_no;");
    $stmt->execute();
    $artefacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($artefacts) {
        http_response_code(200);
        echo json_encode($artefacts); // Return as an array
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No records found"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
