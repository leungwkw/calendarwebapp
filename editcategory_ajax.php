<?php
	session_start();
	header("Content-Type: application/json");

	// ensures user fills up input field
	if(empty($_POST["editedcategoryname"])) {
		echo json_encode(array(
			"editCatSuccess" => false,
			"reason" => "Please choose a name for the category."
		));
		exit;
	}
	// checks token to guard against cross-site scripting
	elseif(!hash_equals($_SESSION['token'], $_POST['token']) || !isset($_SESSION["token"]) || !isset($_POST["token"])) {
		echo json_encode(array(
			"editCatSuccess" => false,
			"reason" => "Request forgery detected."
		));
		exit;
	}
	else {
		require "calendardatabase.php";

		$editedcategoryname = sprintf("%s", htmlentities($_POST["editedcategoryname"], ENT_NOQUOTES));
		$originalcategoryname = sprintf("%s", htmlentities($_POST["originalcategoryname"], ENT_NOQUOTES));
		$username = sprintf( "%s", htmlentities($_SESSION['username']));

		// checks database to see if desired category name already exists
		$editedcategorynameavailable = true;
		$stmt = $mysqli->prepare("SELECT category FROM categories WHERE username=?");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->bind_param('s', $username);
		$stmt->execute();
    	$stmt->bind_result($categoryindatabase);
		while($stmt->fetch()) {
			if($categoryindatabase==$editedcategoryname) {
				$newcategorynameavailable = false;
				echo json_encode(array(
					"editCatSuccess" => false,
					"reason" => "Category name already taken. Please choose another name."
				));
				exit;
			}
		}

		if ($editedcategorynameavailable == true) {
			// at this point, verified that desired category name is available;
			// stores new category in database
			$stmt = $mysqli->prepare("UPDATE categories SET category=? WHERE category=? AND username=?");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('sss', $editedcategoryname, $originalcategoryname, $username);
			$stmt->execute();
			$stmt->close();

			echo json_encode(array(
				"editCatSuccess" => true
			));
			exit;
		}
		
	}
?>