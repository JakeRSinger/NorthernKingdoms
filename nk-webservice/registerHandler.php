<!-- Change links. Only for testing. -->
<?php
include 'db.php'; // Include database connection

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $forename = $_POST['user_forename'];
    $surname = $_POST['user_surname'];
    $email = $_POST['user_email'];
    $password = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
    $admin_email = $_POST['admin_email'];
    $admin_password = $_POST['admin_password'];

    try {
        // Verify admin details
        $stmt = $pdo->prepare("SELECT user_id, user_password FROM m_user WHERE user_email = :email");
        $stmt->execute([':email' => $admin_email]);
        $admin = $stmt->fetch();

        // Check if admin exists and password is correct    
        if ($admin && password_verify($admin_password, $admin['user_password'])) {
            
            // Prepare the Insert statement
            $stmt = $pdo->prepare("INSERT INTO m_user (user_forename, user_surname, user_email, user_password) 
                                   VALUES (:forename, :surname, :email, :password)");

            // Bind parameters and execute
            $stmt->execute([
                ':forename' => $forename,
                ':surname' => $surname,
                ':email' => $email,
                ':password' => $password
            ]);

            // Redirect to login page after successful registration
            header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/login.html");
            exit();
        } else {
            // Redirect to registration page if admin authentication fails
            header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/register.html");
            exit();
        }
    } catch (PDOException $e) {
        echo "Database Error: " . $e->getMessage();
    }

    // Close the statement
    $stmt = null;
}
?>
