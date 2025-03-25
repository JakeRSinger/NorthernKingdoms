<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

require 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not authenticated. Please log in."]);
    exit;
}

try {

    // Get ID
    $artefactSelected = isset($_GET['artefactSelected']) ? trim($_GET['artefactSelected']) : "";

    $stmt = $pdo->prepare("SELECT * FROM m_artefact WHERE artefact_id LIKE :artefactID");

    $artefactID = "%{$artefactSelected}%";
    $stmt->bindParam(':artefactID', $artefactID, PDO::PARAM_STR);

    $stmt->execute();
    $artefacts = $stmt->fetchAll();

    if ($artefacts)
    {
        // Return data & set response code
        http_response_code(200);
        echo json_encode($artefacts);
    }
    else {
        // Handle case where no data was found
        http_response_code(404);
        echo json_encode(["Error" => "No records found"]);
    }
    
} catch (PDOException $e) {
    echo json_encode(["Error" => $e->getMessage()]);
}
?>
