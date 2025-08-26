<?php
//error_reporting(E_ALL);            // 모든 에러 종류 보고
//ini_set('display_errors', 1);      // 에러 화면에 출력
//ini_set('display_startup_errors', 1); // 초기화 에러도 출력

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

//$sql = "SELECT * FROM users";
//$result = $conn->query($sql);

$sql = "SELECT * FROM tradinggear_member where id_email = '".$_POST['email']."'";
$result = $conn->query($sql);

if($result->num_rows > 0) {
	return;
	exit;
}

// INSERT
$stmt = $conn->prepare("INSERT INTO tradinggear_member (id_email, pwd, full_name, nick_name, trading_center, grade, api_key, explain_set) VALUES (?, ?, ?, ?, ?, ?, AES_ENCRYPT(?, ?), ?)");
$stmt->bind_param("sssssisss", $id_email, $hash, $full_name, $nick_name, $trading_center, $grade, $api_key, $api_key_key, $explain);
$id_email = $_POST['email'];
$pwd = $_POST['password'];
// 해시 생성 (BCRYPT 알고리즘, 솔트 자동 포함)
$hash = password_hash($pwd, PASSWORD_DEFAULT);
$full_name = $_POST['fullName'];
$nick_name = $_POST['nickName'];
$trading_center = $_POST['tradingCenter'];
$grade = 1;
$api_key = $_POST['apiKey'];
$api_key_key = $hash;
$explain = $hash;
$stmt->execute();
?>