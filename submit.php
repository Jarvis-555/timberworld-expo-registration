<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data)) {
    respond(400, ['success' => false, 'message' => 'Invalid form submission.']);
}

// Honeypot field: bots often fill hidden fields.
if (!empty($data['website'])) {
    respond(200, ['success' => true]);
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Enter your full name and a valid email address.']);
}

$scriptUrl = 'https://script.google.com/macros/s/AKfycbyOyVw4XXtEOzki5pv5q-DgIOmMVWxZbyKG7Vl0Dz5r6g7sWfdaPLxsYhAvZ_W1ToCk/exec';
if (strpos($scriptUrl, 'https://script.google.com/macros/s/') !== 0 || substr($scriptUrl, -5) !== '/exec') {
    respond(500, ['success' => false, 'message' => 'The registration database connection has not been configured.']);
}

$allowed = ['name','email','phone','company','interest','source','campaign','landingPage'];
$payload = [];
foreach ($allowed as $key) {
    $value = trim((string)($data[$key] ?? ''));
    $payload[$key] = mb_substr($value, 0, 1000);
}
$payload['website'] = '';

$ch = curl_init($scriptUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($payload),
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 25,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded']
]);

$responseBody = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($responseBody === false || $curlError !== '') {
    error_log('TWL expo Apps Script transport error: ' . $curlError);
    respond(502, ['success' => false, 'message' => 'We could not reach the registration database. Please try again.']);
}

$result = json_decode((string)$responseBody, true);
if ($httpCode < 200 || $httpCode >= 300 || !is_array($result) || empty($result['success'])) {
    error_log('TWL expo Apps Script response: ' . substr((string)$responseBody, 0, 1000));
    respond(502, ['success' => false, 'message' => 'The database did not confirm your registration. Please try again.']);
}

respond(200, ['success' => true, 'message' => 'Registration saved.']);
?>
