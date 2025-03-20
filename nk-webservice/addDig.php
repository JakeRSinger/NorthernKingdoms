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
    $jsonData = file_get_contents("php://input");
    $data = json_decode($jsonData, true);

    // Debug: Log received data
    error_log("Received JSON: " . json_encode($data));

    if (!$data || !isset($data['digSiteNo']) || !isset($data['digTown']) || !isset($data['digCounty'])) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid request. Dig Details Required."]);
        exit;
    }

    $digSiteNo = $data['digSiteNo'];
    $digTown = $data['digTown'];
    $digCounty = $data['digCounty'];

    // Insert into database
    $stmt = $pdo->prepare("INSERT INTO m_dig (dig_site_no, dig_town, dig_county) 
                           VALUES (:digSiteNo, :digTown, :digCounty)");
    $stmt->execute([
        ':digSiteNo' => $digSiteNo,
        ':digTown' => $digTown,
        ':digCounty' => $digCounty
    ]);

    echo json_encode(["message" => "Dig site added successfully."]);
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode(["message" => "Failed to add dig site.", "error" => $e->getMessage()]);
}
