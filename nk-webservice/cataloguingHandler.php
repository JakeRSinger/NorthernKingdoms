<?php
session_start(); // Start session
require 'db.php'; // Include database connection

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not authenticated. Please log in."]);
    exit;
}

// Get logged-in user ID from session
$artefact_edited_by = $_SESSION['user_id'];

try {
    // Collect form data
    $artefact_id = $_POST['artefact_id'] ?? null; // Artefact ID (if updating)
    $artefact_date_found = $_POST['artefact_date_found'] ?? null;
    $artefact_broad_subperiod = $_POST['artefact_broad_subperiod'] ?? null;
    $artefact_date_earliest = $_POST['artefact_date_earliest'] ?? null;
    $artefact_date_latest = $_POST['artefact_date_latest'] ?? null;
    $artefact_classification = $_POST['artefact_classification'] ?? null;
    $artefact_desc = $_POST['artefact_desc'] ?? null;
    $artefact_weight = $_POST['artefact_weight'] ?? null;
    $artefact_height = $_POST['artefact_height'] ?? null;
    $artefact_length = $_POST['artefact_length'] ?? null;
    $artefact_breadth = $_POST['artefact_breadth'] ?? null;
    $artefact_functional_group = $_POST['artefact_functional_group'] ?? null;
    $artefact_material = $_POST['artefact_material'] ?? null;
    $artefact_decorative_style = $_POST['artefact_decorative_style'] ?? null;
    $artefact_location_id = $_POST['artefact_location_id'] ?? null;
    $artefact_dig_site_no = $_POST['artefact_dig_site_no'] ?? null;

    // Validate required fields
    if (!$artefact_date_found || !$artefact_classification || !$artefact_desc || !$artefact_location_id || !$artefact_dig_site_no) {
        echo json_encode(["error" => "Missing required fields."]);
        exit;
    }

    // Check if the artefact already exists
    if ($artefact_id && $artefact_id != "0") {
        // Update existing artefact
        $stmt = $pdo->prepare("
            UPDATE m_artefact SET
                artefact_date_found = :date_found,
                artefact_broad_subperiod = :broad_subperiod,
                artefact_date_earliest = :date_earliest,
                artefact_date_latest = :date_latest,
                artefact_classification = :classification,
                artefact_desc = :description,
                artefact_weight = :weight,
                artefact_height = :height,
                artefact_length = :length,
                artefact_breadth = :breadth,
                artefact_functional_group = :functional_group,
                artefact_material = :material,
                artefact_decorative_style = :decorative_style,
                artefact_location_last_changed = NOW(),
                artefact_location_id = :location_id,
                artefact_dig_site_no = :dig_site_no,
                artefact_edited_by = :edited_by
            WHERE artefact_id = :artefact_id
        ");

        $stmt->execute([
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
            ':location_id' => $artefact_location_id,
            ':dig_site_no' => $artefact_dig_site_no,
            ':edited_by' => $artefact_edited_by,
            ':artefact_id' => $artefact_id
        ]);

        echo json_encode(["success" => "Artefact successfully updated."]);

    } else {
        // Insert new artefact
        $stmt = $pdo->prepare("
            INSERT INTO m_artefact (
                artefact_date_found, artefact_broad_subperiod, artefact_date_earliest, artefact_date_latest, 
                artefact_classification, artefact_desc, artefact_weight, artefact_height, 
                artefact_length, artefact_breadth, artefact_functional_group, artefact_material, 
                artefact_decorative_style, artefact_location_last_changed, artefact_location_id, 
                artefact_dig_site_no, artefact_edited_by
            ) VALUES (
                :date_found, :broad_subperiod, :date_earliest, :date_latest, 
                :classification, :description, :weight, :height, 
                :length, :breadth, :functional_group, :material, 
                :decorative_style, NOW(), :location_id, 
                :dig_site_no, :edited_by
            )
        ");

        $stmt->execute([
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
            ':location_id' => $artefact_location_id,
            ':dig_site_no' => $artefact_dig_site_no,
            ':edited_by' => $artefact_edited_by
        ]);

        echo json_encode(["success" => "Artefact successfully catalogued."]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
