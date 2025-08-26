<?php
$input = '12345';         // 사용자가 입력한 비밀번호
$storedHash = '$2y$10$O2IU5rOf9IwAlcHM/k6OdewaEsbdEzQj7YgWKTDbrSJxaju4WlDMC'; // DB에 저장된 해시

if (password_verify($input, $storedHash)) {
    echo "비밀번호 일치!";
} else {
    echo "비밀번호 불일치!";
}
?>