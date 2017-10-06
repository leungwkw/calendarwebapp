<?php
	header("Content-Type: application/json");

	// ensures user fills up input fields
	if(empty($_POST["newusername"]) || empty($_POST["newpassword"]) || empty($_POST["retypepassword"])) {
		echo json_encode(array(
			"signUpSuccess" => false,
			"reason" => "Not all fields were filled. Please try again."
		));
		exit;
	}
	// ensures both passwords match
	elseif($_POST["newpassword"] != $_POST["retypepassword"]) {
		echo json_encode(array(
			"signUpSuccess" => false,
			"reason" => "Passwords do not match. Please try again."
		));
		exit;
	}
	// ensures desired username is of appropriate format
	elseif(!preg_match('/^[\w_\.\-]+$/', $_POST["newusername"])) {
		echo json_encode(array(
			"signUpSuccess" => false,
			"reason" => "Some characters in username are invalid. Please choose a different username."
		));
		exit;
	}
	else {
		$newusername = $_POST["newusername"];
		$cryptednewpassword = password_hash($_POST["newpassword"], PASSWORD_BCRYPT);

		require "calendardatabase.php";

		// checks database to see if desired username has already been taken
		$newusernameavailable = true;
		$stmt = $mysqli->prepare("SELECT username FROM users");
		if(!$stmt) {
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit; 
		}
		$stmt->execute();
    	$stmt->bind_result($userindatabase);
		while($stmt->fetch()) {
			if($userindatabase==$newusername) {
				$newusernameavailable = false;
				echo json_encode(array(
					"signUpSuccess" => false,
					"reason" => "Username already taken. Please choose another username."
				));
				exit;
			}
		}

		if ($newusernameavailable == true) {
			// at this point, verified that inputs are appropriate
			// and that desired username is available;
			// stores new user in database
			$stmt = $mysqli->prepare("INSERT INTO users (username, crypted_password) VALUES (?, ?)");
			if(!$stmt) {
				printf("Query Prep Failed: %s\n", $mysqli->error);
				exit; 
			}
			$stmt->bind_param('ss', $newusername, $cryptednewpassword); 
			$stmt->execute();
			$stmt->close();

			// once new user has been added to database,
			// starts new session with token
			session_start();
			$_SESSION["username"] = $newusername;
			$_SESSION["token"] = bin2hex(openssl_random_pseudo_bytes(32));

			echo json_encode(array(
				"signUpSuccess" => true,
				"currentUser" => sprintf("%s", htmlentities($newusername)), // sanitizing output
				"token" => $_SESSION['token']
			));
			exit;
		}
		
	}
?>