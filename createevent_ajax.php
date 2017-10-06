<?php
	session_start();
	header("Content-Type: application/json");

	// ensures user fills up input fields
	if(empty($_POST["neweventname"])) {
		echo json_encode(array(
			"createEventSuccess" => false,
			"reason" => "Please choose an event name."
		));
		exit;
	}
	elseif($_POST["hr"] == "hr") {
		echo json_encode(array(
			"createEventSuccess" => false,
			"reason" => "Please select an hour option."
		));
		exit;
	}
	elseif($_POST["min"] == "min") {
		echo json_encode(array(
			"createEventSuccess" => false,
			"reason" => "Please select a minute option."
		));
		exit;
	}
	// checks token to guard against cross-site scripting
	elseif(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"createEventSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		
		require "calendardatabase.php";

		$creator = sprintf( "%s", htmlentities($_SESSION['username']));
		$neweventname = sprintf( "%s", htmlentities($_POST['neweventname'], ENT_NOQUOTES));
		$year = $_POST["year"];
		$month = $_POST["month"];
		$day = $_POST["day"];
		$hr = $_POST["hr"];
		$min = $_POST["min"];
		$ampm = $_POST["ampm"];
		$category = $_POST["category"];

		if($category=="none") {
			$stmt = $mysqli->prepare("INSERT INTO events (creator, event_name, year, month, day, hr, min, ampm) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('ssssssss', $creator, $neweventname, $year, $month, $day, $hr, $min, $ampm);
		}
		else {
			$stmt = $mysqli->prepare("INSERT INTO events (creator, event_name, year, month, day, hr, min, ampm, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('sssssssss', $creator, $neweventname, $year, $month, $day, $hr, $min, $ampm, $category);
		} 
		$stmt->execute();
		$stmt->close();

		echo json_encode(array(
			"createEventSuccess" => true,
		));
		exit;
	}
?>