<?php
// Basit form handler - güvenlik amaçlı minimal sanitizasyon.
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  http_response_code(405);
  echo 'Yöntem izin verilmiyor.';
  exit;
}
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
if(!$name || !$email || !$message){
  echo "Lütfen tüm alanları doldurun.";
  exit;
}
// Basit e-posta doğrulama
if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
  echo "Geçersiz e-posta adresi.";
  exit;
}
$to = 'mertdrgtt27@gmail.com';
$subject = "Yeni iletişim mesajı: " . $name;
$body = "İsim: $name\nE-posta: $email\n\nMesaj:\n$message";
$headers = "From: $name <$email>\r\n";
// mail() fonksiyonu XAMPP'de ek SMTP yapılandırması gerektirebilir.
$sent = mail($to, $subject, $body, $headers);
if($sent){
  echo "Teşekkürler, mesajınız gönderildi.";
}else{
  // Log the error for debugging (mail() may fail if no SMTP is configured)
  $err = error_get_last();
  $logDir = __DIR__ . '/logs';
  if(!is_dir($logDir)) @mkdir($logDir, 0755, true);
  $logFile = $logDir . '/mail.log';
  $msg = date('c') . " - Mail send failed. to={$to}, from={$email}, error=" . ($err['message'] ?? 'unknown') . "\n";
  @file_put_contents($logFile, $msg, FILE_APPEND);
  echo "Mesaj gönderilemedi. Sunucu loglarına yazıldı. Lütfen doğrudan e-posta gönderin: mertdrgtt27@gmail.com";
}
?>