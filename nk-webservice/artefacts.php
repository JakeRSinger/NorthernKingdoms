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

// Get artefact ID from query parameter
$artefactSelected = isset($_GET['artefactSelected']) ? trim($_GET['artefactSelected']) : "";

try {
    // Case 1: Fetch all artefacts if no ID is provided
    if (empty($artefactSelected)) {
        $stmt = $pdo->prepare("SELECT * FROM m_artefact");
    } 
    // Case 2: Fetch specific artefacts matching the search query
    else {
        $stmt = $pdo->prepare("SELECT * FROM m_artefact WHERE artefact_id LIKE :artefactID");
        $artefactID = "%{$artefactSelected}%";
        $stmt->bindParam(':artefactID', $artefactID);
    }

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
