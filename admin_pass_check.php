<?php
// CORS 허용
header("Access-Control-Allow-Origin: https://tradinggear.co.kr"); // 또는 특정 도메인
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// OPTIONS 요청 처리 (사전 요청)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include './config/dbconn.php';

$sql = "SELECT * FROM tradinggear_admin where id_email = '".$_POST['email']."'";
$result = $conn->query($sql);

$row = $result->fetch_array(MYSQLI_ASSOC);

//echo $row['pwd'];

$input = $_POST['pwd'];         // 사용자가 입력한 비밀번호
$storedHash = $row['pwd']; // DB에 저장된 해시
/*
echo $input."<Br/>";
echo $storedHash."<Br/>";
echo $sql."<br/>";
echo password_verify($input, $storedHash)."<br/>";
$hash = password_hash($input, PASSWORD_DEFAULT)."<br/>";
echo $hash;
*/
$arraySet = array();
if (password_verify($input, $storedHash)) {
	//$arraySet['nickName'] = $row['nick_name'];
	//$arraySet['status'] = "ok";	
    echo "ok|@|".$row['nick_name']."|@|";
} else {
	//$arraySet['nickName'] = $row['nick_name'];
	//$arraySet['status'] = "wrong";		
    //echo "wrong|@|".$input."|@|".$storedHash;
	echo "wrong|@|";
}

//echo $arraySet;
//echo $result->num_rows;
?>