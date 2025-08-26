<?php
	$host = 'localhost';
	$user = 'root';
	$pass = 'Pa$$w0rd123';
	$dbname = 'tradinggear';

	$conn = new mysqli($host, $user, $pass, $dbname);
	if ($conn->connect_error) {
		die("연결 실패: " . $conn->connect_error);
	}
?>