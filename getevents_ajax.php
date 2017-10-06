<?php
	session_start();
	header("Content-Type: application/json");

	// array that will store all the events in current month
	$events = array();

	require "calendardatabase.php";

	$creator = sprintf("%s", htmlentities($_SESSION['username']));
	$year = $_POST["year"];
	$month = $_POST["month"];

	// sorting events in chronological order
	$stmt = $mysqli->prepare("SELECT event_id, event_name, day, hr, min, ampm, category FROM events WHERE creator=? AND year=? AND month=? ORDER BY day, ampm, FIELD(hr, \"12\", \"1\", \"2\", \"3\", \"4\", \"5\", \"6\", \"7\", \"8\", \"9\", \"10\", \"11\"), min"); 
	if(!$stmt) {
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit; 
	}
	$stmt->bind_param('sss', $creator, $year, $month);
	$stmt->execute();
	$stmt->bind_result($eventId, $eventname, $day, $hr, $min, $ampm, $category);
	while($stmt->fetch()) {
		array_push($events, array(
			"eventId" => $eventId,
			"eventName" => sprintf("%s", htmlentities($eventname)),
			"day" => $day,
			"hr" => sprintf("%s", htmlentities($hr)),
			"min" => sprintf("%s", htmlentities($min)),
			"ampm" => sprintf("%s", htmlentities($ampm)),
			"category" => $category
		));
	}
	$stmt->close();

	echo json_encode(array(
		"events" => $events
	));
?>