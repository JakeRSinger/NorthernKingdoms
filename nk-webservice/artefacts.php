<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM m_artefacts");
    $artefacts = $stmt->fetchAll();
    echo json_encode($artefacts);
} catch (PDOException $e) {
    echo json_encode(["Error" => $e->getMessage()]);
}
?>
