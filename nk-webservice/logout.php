<!DOCTYPE html>
<html lang="en">
<head>

</head>
<body>
    <script>
        sessionStorage.clear();
    </script>
    
    <?php
        session_start();
        session_unset();
        session_destroy();

        header("Location: https://20.108.25.134/NorthernKingdoms/nk-site/index.html");
    ?>
</body>
</html>

