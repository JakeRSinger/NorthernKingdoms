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
    $stmt = $pdo->query("SELECT location_id, location_type FROM m_location");
    $locations = $stmt->fetchAll();

    if ($locations)
    {
        // Return data & set response code
        http_response_code(200);
        echo json_encode($locations);
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
