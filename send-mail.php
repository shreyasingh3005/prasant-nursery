<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

$name     = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$phone    = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$service  = filter_input(INPUT_POST, 'service', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$area     = filter_input(INPUT_POST, 'area', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?: 'Not provided';
$location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?: 'Not provided';
$message  = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS) ?: 'No extra notes';

if (empty($name) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and Phone required']);
    exit;
}

$to = "info@prashantnursery.in";
$subject = "New Website Enquiry: " . $name . " [" . $service . "]";
$body = "Name: " . $name . "\nPhone: " . $phone . "\nService: " . $service . "\nArea/Quantity: " . $area . "\nLocation: " . $location . "\nMessage:\n" . $message;
$headers = "From: noreply@prashantnursery.in\r\n";
@mail($to, $subject, $body, $headers);

echo json_encode(['status' => 'success', 'message' => 'Enquiry recorded']);
