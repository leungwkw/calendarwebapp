<?php
	session_start();
	header("Content-Type: application/json");

	// ensures user fills up input field
	if(empty($_POST["newcategoryname"])) {
		echo json_encode(array(
			"newCatSuccess" => false,
			"reason" => "Please choose a name for the category."
		));
		exit;
	}
	// checks token to guard against cross-site scripting
	elseif(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"newCatSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		
		require "calendardatabase.php";

		$newcategoryname = sprintf("%s", htmlentities($_POST["newcategoryname"], ENT_NOQUOTES));
		$username = sprintf( "%s", htmlentities($_SESSION['username']));

		// checks database to see if desired category name already exists
		$newcategorynameavailable = true;
		$stmt = $mysqli->prepare("SELECT category FROM categories WHERE username=?");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('s', $username);
		$stmt->execute();
    	$stmt->bind_result($categoryindatabase);
		while($stmt->fetch()) {
			if($categoryindatabase==$newcategoryname) {
				$newcategorynameavailable = false;
				echo json_encode(array(
					"newCatSuccess" => false,
					"reason" => "You already have a category by that name. Please choose another name."
				));
				exit;
			}
		}

		if ($newcategorynameavailable == true) {
			// at this point, verified that desired category name is available;
			// stores new category in database
			$stmt = $mysqli->prepare("INSERT INTO categories (category, username) VALUES (?, ?)");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('ss', $newcategoryname, $username); 
			$stmt->execute();
			$stmt->close();

			echo json_encode(array(
				"newCatSuccess" => true
			));
			exit;
		}
	}
?>