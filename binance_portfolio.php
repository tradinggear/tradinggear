<?php
error_reporting(E_ALL);            // 모든 에러 종류 보고
ini_set('display_errors', 1);      // 에러 화면에 출력
ini_set('display_startup_errors', 1); // 초기화 에러도 출력

// CORS 허용
header("Access-Control-Allow-Origin: https://tradinggear.co.kr"); // 또는 특정 도메인
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// OPTIONS 요청 처리 (사전 요청)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
require $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';

use WebSocket\Client;

$apiKey = "ymF4F1O0hpre20XGYzxpLyKiOZ9e0uofi4v5cT1DhOqxuBoZLOYi4nZVWj3M2Eql";
$apiSecret = "EiMOZzYKiyZWrI0HIfbtPbD39Gd236sL4q6QalK2syMXhtrZrSS26hxerL2VlCbx";

// 1️⃣ ListenKey 발급
$ch = curl_init("https://fapi.binance.com/fapi/v1/listenKey");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-MBX-APIKEY: $apiKey"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
$listenKeyResponse = curl_exec($ch);
curl_close($ch);

print_r($listenKeyResponse);

$data = json_decode($listenKeyResponse, true);
$listenKey = $data['listenKey'] ?? null;

if (!$listenKey) {
    die("❌ ListenKey 발급 실패\n");
}

echo "✅ ListenKey: $listenKey\n";

// 2️⃣ 웹소켓 연결
$wsUrl = "wss://fstream.binance.com/ws/$listenKey";
$client = new Client($wsUrl);

echo "✅ WebSocket 연결 완료, 실시간 포지션 수신 대기...\n";

while (true) {
    $message = $client->receive();
    $json = json_decode($message, true);

    if (isset($json['e']) && $json['e'] === 'ACCOUNT_UPDATE') {
        $positions = $json['a']['P'] ?? [];

        $portfolio = [];
        foreach ($positions as $idx => $p) {
            $qty = abs(floatval($p['pa']));
            if ($qty == 0) continue;

            $markPrice = floatval($p['mp']);
            $entryPrice = floatval($p['ep']);
            $evaluationAmount = $markPrice * $qty;
            $profit = ($markPrice - $entryPrice) * $qty * (floatval($p['pa']) > 0 ? 1 : -1);
            $profitRate = $entryPrice > 0 ? ($profit / ($entryPrice * $qty)) * 100 : 0;

            $portfolio[] = [
                'id' => $idx + 1,
                'symbol' => $p['s'],
                'currentPrice' => $markPrice,
                'averagePrice' => $entryPrice,
                'quantity' => $qty,
                'evaluationAmount' => $evaluationAmount,
                'profit' => $profit,
                'profitRate' => $profitRate,
                'state' => $profit > 0 ? 'profit' : ($profit < 0 ? 'loss' : 'neutral'),
            ];
        }

        // 3️⃣ 결과 출력 (또는 DB 저장, API 응답 등)
        echo "📡 포트폴리오 갱신:\n";
        echo json_encode($portfolio, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    }
}

?>