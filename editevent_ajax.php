<?php
	session_start();
	header("Content-Type: application/json");

	// ensures user fills up input fields
	if(empty($_POST["editedeventname"])) {
		echo json_encode(array(
			"editEventSuccess" => false,
			"reason" => "Please choose an event name."
		));
		exit;
	}
	elseif($_POST["hr"] == "hr") {
		echo json_encode(array(
			"editEventSuccess" => false,
			"reason" => "Please select an hour option."
		));
		exit;
	}
	elseif($_POST["min"] == "min") {
		echo json_encode(array(
			"editEventSuccess" => false,
			"reason" => "Please select a minute option."
		));
		exit;
	}
	// checks token to guard against cross-site scripting
	elseif(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"editEventSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		require "calendardatabase.php";

		$eventid = $_POST["eventid"];
		$editedeventname = sprintf( "%s", htmlentities($_POST["editedeventname"], ENT_NOQUOTES));
		$hr = $_POST["hr"];
		$min = $_POST["min"];
		$ampm = $_POST["ampm"];
		$category = $_POST["category"];

		if($category=="none") {
			$stmt = $mysqli->prepare("UPDATE events SET event_name=?, hr=?, min=?, ampm=? WHERE event_id=?");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('sssss', $editedeventname, $hr, $min, $ampm, $eventid); 
		}
		else {
			$stmt = $mysqli->prepare("UPDATE events SET event_name=?, hr=?, min=?, ampm=?, category=? WHERE event_id=?");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('ssssss', $editedeventname, $hr, $min, $ampm, $category, $eventid); 
		} 
		$stmt->execute();
		$stmt->close();

		echo json_encode(array(
			"editEventSuccess" => true
		));
		exit;
	}
?>