<?php
    session_start();
    include("db.php");

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST['username'];
        $password = $_POST['password'];

        try {
            $stmt = $pdo->prepare("SELECT user_id, user_password FROM m_user WHERE user_email = :username");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();

            // Check if a user with this email exists
            if ($stmt->rowCount() === 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                // Verify the entered password against the hashed password in the database
                if (password_verify($password, $row['user_password'])) {
                    $_SESSION['user_email'] = $username;
                    $_SESSION['user_id'] = $row['user_id'];

                    echo $_SESSION['user_id'];
                    
                    if ($row["user_id"] === 1) {
                        header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/register.html");
                        exit();
                    }
                    else {
                        // Redirect after setting session variables
                        header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/index.html?loggedIn=true");
                        exit();
                    }

                } else {
                    header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/login.html?error=invalid");
                    exit();
                }
            } else {
                header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/login.html?error=notfound");
                exit();
            }
        } catch (PDOException $e) {
            header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/login.html?error=databaseError");
            exit();
        }
    }

