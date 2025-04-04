<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set CORS Policy
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

session_start(); 

require_once 'db.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorised
    echo json_encode(["message" => "User not logged in."]);
    exit;
}

try 
{
    // Read and decode JSON data
    $jsonData = file_get_contents("php://input");
    $data = json_decode($jsonData, true);

    if (!$data || !isset($data['locationType'])) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid request. LocationType is required."]);
        exit;
    }

    $locationType = $data['locationType'];

    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO m_location (location_type, location_last_edited) 
                           VALUES (:locationType, NOW())");
    $stmt->execute([':locationType' => $locationType]);

    echo json_encode(["message" => "Location added successfully."]);
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode(["message" => "Failed to add location.", "error" => $e->getMessage()]);
}
