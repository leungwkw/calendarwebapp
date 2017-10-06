<?php
	session_start();
	header("Content-Type: application/json");

	// array for storing categories that user has
	$categories = array();

	require "calendardatabase.php";

	$username = sprintf("%s", htmlentities($_SESSION['username']));

	$stmt = $mysqli->prepare("SELECT category FROM categories WHERE username=?"); 
	if(!$stmt) {
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit; 
	}
	$stmt->bind_param('s', $username);
	$stmt->execute();
	$stmt->bind_result($category);
	while($stmt->fetch()) {
		array_push($categories, $category);
	}
	$stmt->close();

	echo json_encode($categories);
?>