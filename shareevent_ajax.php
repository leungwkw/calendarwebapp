<?php
	session_start();
	header("Content-Type: application/json");

	// ensures user fills up input field
	if(empty($_POST["usertosharewith"])) {
		echo json_encode(array(
			"shareEventSuccess" => false,
			"reason" => "Please choose a user to share the event with."
		));
		exit;
	}
	// prevents user from sharing event with himself
	elseif($_POST["usertosharewith"] == $_SESSION["username"]) {
		echo json_encode(array(
			"shareEventSuccess" => false,
			"reason" => "Cannot share event with self."
		));
		exit;
	}
	// checks token to guard against cross-site scripting
	elseif(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"shareEventSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		
		require "calendardatabase.php";

		$eventid = $_POST["eventid"];
		$usertosharewith = sprintf("%s", htmlentities($_POST["usertosharewith"]));

		// checks if other user that current user wants to share event with actually exists
		$userexists = false;
		$stmt = $mysqli->prepare("SELECT username FROM users");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->execute();
    	$stmt->bind_result($userindatabase);
		while($stmt->fetch()) {
			if($userindatabase==$usertosharewith) {
				$userexists = true;
			}
		}
		if($userexists==false) {
			echo json_encode(array(
				"shareEventSuccess" => false,
				"reason" => "No such user exists."
			));
			exit;
		}

		// if other user does indeed exist,
		// creates a duplicate event for that user
		$stmt = $mysqli->prepare("SELECT event_name, year, month, day, hr, min, ampm FROM events WHERE event_id=?"); 
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('s', $eventid);
		$stmt->execute();
		$stmt->bind_result($eventname, $year, $month, $day, $hr, $min, $ampm);
		$stmt->fetch();
		$stmt->close();

		$stmt = $mysqli->prepare("INSERT INTO events (creator, event_name, year, month, day, hr, min, ampm) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('ssssssss', $usertosharewith, $eventname, $year, $month, $day, $hr, $min, $ampm);
		$stmt->execute();
		$stmt->close();

		echo json_encode(array(
			"shareEventSuccess" => true,
		));
		exit;
	}
?>