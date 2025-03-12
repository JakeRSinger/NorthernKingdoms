<!-- Chanage links. Only for testing. -->
<?php
include 'db.php'; // Include database connection

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $forename = $_POST['user_forename'];
    $surname = $_POST['user_surname'];
    $email = $_POST['user_email'];
    $password = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
    $admin_email = ($_POST['admin_email']);
    $admin_password = password_hash($_POST['admin_password'], PASSWORD_DEFAULT);

    // Verify admin details
    $stmt = $pdo->prepare("SELECT user_id 
                            FROM m_user 
                            WHERE user_email = :email 
                            AND user_password = :password");

    // Bind parameters and execute
    $stmt->execute([
                    ':email' => $admin_email,
                    ':password' => $admin_password]);

    $user = $stmt->fetch();

    // Execute the query
    try {
        // Verify admin details before insertion
        if ($user == 1 ) {

            // Prepare the Insert statement
            $stmt = $pdo->prepare("INSERT INTO m_user (user_forename, user_surname, user_email, user_password
                                    VALUES (:forename, :surname, :email, :password)");

            // Bind parameters and execute
            $stmt->execute([':forename' => $forename,
                            ':surname'=> $surname,
                            ':email' => $email,
                            ':password' => $password]);
        
            header("Location: https://comp-server.uhi.ac.uk/~21011375/nk-site/login.html");
        }
        else {
            header("Location: https://comp-server.uhi.ac.uk/~21011375/nk-site/register.html");
        }

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    // Close the statement
    $stmt = null;
}
