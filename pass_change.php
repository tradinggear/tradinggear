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

// INSERT
$stmt = $conn->prepare("update tradinggear_member set pwd = ? where id_email = ?");
$stmt->bind_param("ss", $hash, $id_email);
// 해시 생성 (BCRYPT 알고리즘, 솔트 자동 포함)
$pwd = $_POST['pwd'];
$hash = password_hash($pwd, PASSWORD_DEFAULT);
$id_email = $_POST['email'];
$stmt->execute();
?>