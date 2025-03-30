<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start(); // Start session
require 'db.php'; // Include database connection


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

// Check if data is received
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST)) {
    echo json_encode(["error" => "No POST data received."]);
    exit;
}

$artefact_edited_by = $_SESSION['user_id'];

try {
    $required_fields = [
        'artefact_id', 'artefact_date_found', 'artefact_broad_subperiod', 'artefact_date_earliest', 'artefact_date_latest', 
        'artefact_classification', 'artefact_desc', 'artefact_weight', 'artefact_height', 'artefact_length', 'artefact_breadth', 
        'artefact_functional_group', 'artefact_material', 'artefact_decorative_style', 'artefact_location_id', 'artefact_dig_site_no'
    ];
    
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            echo json_encode(["error" => "Missing required field: $field"]);
            exit;
        }
    }
    
    $numeric_fields = ['artefact_weight', 'artefact_height', 'artefact_length', 'artefact_breadth'];
    foreach ($numeric_fields as $field) {
        if (!is_numeric($_POST[$field])) {
            echo json_encode(["error" => "$field must be a numeric value"]);
            exit;
        }
    }
    
    extract($_POST);
    
    $checkStmt = $pdo->prepare("SELECT COUNT(artefact_id) AS count, artefact_location_last_changed, artefact_location_id 
                                        FROM m_artefact 
                                        WHERE artefact_id = :artefact_id 
                                        AND artefact_dig_site_no = :dig_site
                                        GROUP BY artefact_id, artefact_dig_site_no, artefact_location_last_changed, artefact_location_id;
");
    $checkStmt->execute([':artefact_id' => $artefact_id,
                                ':dig_site' => $artefact_dig_site_no]);
    $row = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    $artefact_location_last_changed = ( $row && $row['artefact_location_id'] == $artefact_location_id) ? $row['artefact_location_last_changed'] : date('Y-m-d H:i:s');
    
    if ($row['count'] > 0) {
        $stmt = $pdo->prepare("UPDATE m_artefact SET
            artefact_date_found = :date_found, artefact_broad_subperiod = :broad_subperiod,
            artefact_date_earliest = :date_earliest, artefact_date_latest = :date_latest,
            artefact_classification = :classification, artefact_desc = :description,
            artefact_weight = :weight, artefact_height = :height, artefact_length = :length,
            artefact_breadth = :breadth, artefact_functional_group = :functional_group,
            artefact_material = :material, artefact_decorative_style = :decorative_style,
            artefact_location_last_changed = :location_last_changed,
            artefact_location_id = :location_id, artefact_edited_by = :edited_by
            WHERE artefact_id = :artefact_id
            AND artefact_dig_site_no = :dig_site_no");
    } else {
        $stmt = $pdo->prepare("INSERT INTO m_artefact (
            artefact_id, artefact_date_found, artefact_broad_subperiod, artefact_date_earliest,
            artefact_date_latest, artefact_classification, artefact_desc, artefact_weight,
            artefact_height, artefact_length, artefact_breadth, artefact_functional_group,
            artefact_material, artefact_decorative_style, artefact_location_last_changed,
            artefact_location_id, artefact_dig_site_no, artefact_edited_by)
            VALUES (
            :artefact_id, :date_found, :broad_subperiod, :date_earliest, :date_latest,
            :classification, :description, :weight, :height, :length, :breadth,
            :functional_group, :material, :decorative_style, :location_last_changed, :location_id,
            :dig_site_no, :edited_by)");
    }
    
    $stmt->execute([
        ':artefact_id' => $artefact_id, 
        ':date_found' => $artefact_date_found,
        ':broad_subperiod' => $artefact_broad_subperiod, 
        ':date_earliest' => $artefact_date_earliest,
        ':date_latest' => $artefact_date_latest, 
        ':classification' => $artefact_classification,
        ':description' => $artefact_desc, 
        ':weight' => $artefact_weight,
        ':height' => $artefact_height, 
        ':length' => $artefact_length, 
        ':breadth' => $artefact_breadth,
        ':functional_group' => $artefact_functional_group, 
        ':material' => $artefact_material,
        ':decorative_style' => $artefact_decorative_style,
        ':location_last_changed' => $artefact_location_last_changed,
        ':location_id' => $artefact_location_id, 
        ':dig_site_no' => $artefact_dig_site_no,
        ':edited_by' => $artefact_edited_by
    ]);
    
    // Image upload
    if (isset($_FILES['artefact_image']) && $_FILES['artefact_image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = "/var/www/html/NorthernKingdoms/uploads/$artefact_dig_site_no/";
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        
        $imageName = basename($_FILES['artefact_image']['name']);
        $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));
        
        if (!in_array($imageExtension, ['jpg', 'jpeg', 'png'])) {
            echo json_encode(["error" => "Invalid file type. Only JPG, JPEG, PNG allowed."]);
            exit;
        }
        
        $uniqueFilename = "$artefact_id-" . time() . ".$imageExtension";
        $imagePath = $uploadDir . $uniqueFilename;  // Full server path
        $dbImagePath = "/NorthernKingdoms/uploads/$artefact_dig_site_no/$uniqueFilename";  // Relative path for DB storage
        
        
        if (move_uploaded_file($_FILES['artefact_image']['tmp_name'], $imagePath)) {
            $stmt = $pdo->prepare("UPDATE m_artefact SET artefact_image = :image_path WHERE artefact_id = :artefact_id AND artefact_dig_site_no = :dig_site_no");
            $stmt->execute([':image_path' => $dbImagePath,
                                     ':artefact_id' => $artefact_id,
                                     ':dig_site_no' => $artefact_dig_site_no]);
        } else {
            echo json_encode(["error" => "Failed to upload image."]);
            exit;
        }
    }
    
    echo json_encode(["success" => "Artefact successfully catalogued/updated."]);
    
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit;
}
?>
