<?php
	header("Content-Type: application/json");

	// ensures user fills up input fields
	if(empty($_POST["usernameinput"]) || empty($_POST["passwordinput"])) {
		echo json_encode(array(
			"signInSuccess" => false,
			"reason" => "Not all fields were filled. Please try again."
		));
		exit;
	}
	else {
		require "calendardatabase.php";

		$usernameinput = sprintf("%s", htmlentities($_POST["usernameinput"]));
		$passwordinput = sprintf("%s", htmlentities($_POST["passwordinput"]));

		$stmt = $mysqli->prepare("SELECT COUNT(*), crypted_password FROM users WHERE username=?");
		$stmt->bind_param('s', $usernameinput);
		$stmt->execute();

		$stmt->bind_result($count, $pwd_hash);
		$stmt->fetch();

		// verifying password input
		if($count==1 && password_verify($passwordinput, $pwd_hash)) {
			session_start();
			$_SESSION['username'] = $usernameinput;
			$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
			
			echo json_encode(array(
				"signInSuccess" => true,
				"currentUser" => sprintf("%s", htmlentities($usernameinput)), // sanitizing output
				"token" => $_SESSION['token']
			));
			exit;
		}
		else {
			echo json_encode(array(
				"signInSuccess" => false,
				"reason" => "Invalid credentials. Please try again."
			));
			exit;
		}
	}
?>