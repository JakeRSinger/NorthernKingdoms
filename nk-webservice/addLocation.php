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
    // Read POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['locationType'])) {
        echo json_encode(["message" => "Invalid request."]);
        exit;
    }

    $locationType = $data['locationType'];


    // Insert to database
    $stmt =$pdo->prepare("INSERT INTO m_location (location_type, location_last_edited) 
                                VALUES :locationType, NOW();");
    $stmt->execute([':locationType' => $locationType]);
    
    echo json_encode(["message" => "Location added."]);
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode(["message" => "Failed to add location."]);
}