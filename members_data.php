<?php
//error_reporting(E_ALL);            // 모든 에러 종류 보고
//ini_set('display_errors', 1);      // 에러 화면에 출력
//ini_set('display_startup_errors', 1); // 초기화 에러도 출력

// CORS 허용
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: https://tradinggear.co.kr"); // 또는 특정 도메인
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// OPTIONS 요청 처리 (사전 요청)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include './config/dbconn.php';

function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } elseif (is_string($mixed)) {
        // 문자 인코딩 확인 후 변환
        if (!mb_check_encoding($mixed, 'UTF-8')) {
            $mixed = mb_convert_encoding($mixed, 'UTF-8', 'auto');
        }
    }
    return $mixed;
}

$where = "";
if ($_POST['searchValue'] != "") {
	$where .= " and ".$_POST['searchType']." like '%".$_POST['searchValue']."%'";
}

$sql = "SELECT *, CAST(AES_DECRYPT(api_key, a.explain_set) AS CHAR) AS decrypted_api_key FROM tradinggear_member as a where 1=1 ".$where;
$result = $conn->query($sql);

$row = $result->fetch_all(MYSQLI_ASSOC);

// SQL 준비 및 실행
//$stmt = $conn->prepare("SELECT * FROM tradinggear_member where 1=1 ".$where);
//$stmt->execute();

// 결과 가져오기
//$result = $stmt->get_result();
//$data = $result->fetch_all(MYSQLI_ASSOC);  // 전체 row를 한 번에 연관배열로 가져옴

//ob_clean();  // 이전 출력 버퍼 제거 (필요한 경우)
$data = $row;

// UTF-8로 강제 변환
$data = utf8ize($data);

//echo json_encode($data);
//echo json_encode($row, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
if ($json = json_encode($data, JSON_UNESCAPED_UNICODE)) {
    echo $json;
} else {
    echo json_last_error_msg();
}
//echo $result->num_rows;
?>