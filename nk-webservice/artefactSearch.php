<?php
session_start();
require 'db.php';

// Set CORS Policy
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "User not authenticated. Please log in."]);
    exit;
}

try {
    // Get search term
    $search = isset($_GET['search']) ? trim($_GET['search']) : "";

    // Prepare SQL query with LIKE wildcards correctly
    $stmt = $pdo->prepare("SELECT * FROM m_artefact
                                WHERE artefact_id LIKE :search 
                                OR artefact_dig_site_no LIKE :search
                                OR artefact_date_found LIKE :search
                                OR artefact_broad_subperiod LIKE :search
                                OR artefact_date_earliest LIKE :search
                                OR artefact_date_latest LIKE :search
                                OR artefact_classification LIKE :search
                                OR artefact_desc LIKE :search
                                OR artefact_weight LIKE :search
                                OR artefact_height LIKE :search
                                OR artefact_length LIKE :search
                                OR artefact_breadth LIKE :search
                                OR artefact_functional_group LIKE :search
                                OR artefact_material LIKE :search
                                OR artefact_decorative_style LIKE :search
                                OR artefact_location_id LIKE :search");

    // Bind the search term correctly
    $searchTerm = "%{$search}%";
    $stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);

    // Execute the query
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No records found"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
