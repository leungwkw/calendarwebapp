<?php
	session_start();
	header("Content-Type: application/json");

	// checks token to guard against cross-site scripting
	if(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"editEventSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		require "calendardatabase.php";

		$eventid = $_POST["eventid"];

		$stmt = $mysqli->prepare("DELETE FROM events WHERE event_id=?");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('s', $eventid); 
		$stmt->execute();
    	$stmt->close();

		echo json_encode(array(
			"deleteEventSuccess" => true
		));
		exit;
	}
?>