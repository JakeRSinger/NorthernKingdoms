<?php

    $host = "20.108.25.134";
    $dbName = "NorthernKingdoms";
    $username = "Admin_21011375";
    $password = 'Th3@dm1nPas5';


    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbName", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
        echo "Connection Failed: ". $e->getMessage();
    }
?>