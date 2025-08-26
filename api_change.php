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

$where = " and id_email = '".$_POST['email']."'";
/*if ($_POST['searchValue'] != "") {
	$where .= " and ".$_POST['searchType']." like '%".$_POST['searchValue']."%'";
}*/

$sql = "SELECT *, CAST(AES_DECRYPT(api_key, a.explain_set) AS CHAR) AS decrypted_api_key, CAST(AES_DECRYPT(api_secret, a.explain_set) AS CHAR) AS decrypted_api_secret FROM tradinggear_member as a where 1=1 ".$where;
$result = $conn->query($sql);

$row = $result->fetch_all(MYSQLI_ASSOC);

// INSERT
$stmt = $conn->prepare("update tradinggear_member set api_key = AES_ENCRYPT(?, ?), api_secret = AES_ENCRYPT(?, ?), trading_center = ? where id_email = ?");
$stmt->bind_param("ssssss", $api_key, $api_key_key, $api_secret, $api_key_key, $tradingCenter, $id_email);
$api_key = $_POST['apiKey'];
$api_key_key = $row[0]['explain_set'];
$api_secret = $_POST['apiSecret'];
$tradingCenter = $_POST['tradingCenter'];
$id_email = $_POST['email'];
$stmt->execute();
?>