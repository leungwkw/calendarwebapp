<?php
	session_start();
	header("Content-Type: application/json");

	// checks token to guard against cross-site scripting
	if(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"deleteCatSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		require "calendardatabase.php";

		$username = sprintf( "%s", htmlentities($_SESSION['username']));
		$category = $_POST["category"];

		$stmt = $mysqli->prepare("DELETE FROM categories WHERE username = ? AND category = ?");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('ss', $username, $category); 
		$stmt->execute();
    	$stmt->close();

		echo json_encode(array(
			"deleteCatSuccess" => true
		));
		exit;
	}
?>