<?php
/**
 * Simple SMTP Email Sender
 * Works with Gmail, Yahoo, Outlook, and most SMTP servers
 */

function sendEmailSMTP($to, $subject, $message, $from_email, $from_name, $reply_to = null) {
    $config = require 'email-config.php';
    
    if (!$config['smtp_enabled']) {
        // Fallback to PHP mail() function
        return sendEmailPHP($to, $subject, $message, $from_email, $from_name, $reply_to);
    }
    
    $reply_to = $reply_to ? $reply_to : $from_email;
    $smtp_host = $config['smtp_host'];
    $smtp_port = $config['smtp_port'];
    $smtp_username = $config['smtp_username'];
    $smtp_password = $config['smtp_password'];
    $smtp_secure = $config['smtp_secure'];
    
    if (empty($smtp_password)) {
        return ['success' => false, 'error' => 'SMTP password not configured. Please set up your email in email-config.php'];
    }
    
    // Create socket connection
    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
    if (!$socket) {
        return ['success' => false, 'error' => "Could not connect to SMTP server: $errstr ($errno)"];
    }
    
    // Read server greeting
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '220') {
        fclose($socket);
        return ['success' => false, 'error' => 'SMTP server error: ' . $response];
    }
    
    // Send EHLO
    fputs($socket, "EHLO " . $smtp_host . "\r\n");
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) == ' ') break;
    }
    
    // Start TLS if required
    if ($smtp_secure == 'tls') {
        fputs($socket, "STARTTLS\r\n");
        $response = fgets($socket, 515);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            return ['success' => false, 'error' => 'STARTTLS failed: ' . $response];
        }
        
        // Enable crypto
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        
        // Send EHLO again after TLS
        fputs($socket, "EHLO " . $smtp_host . "\r\n");
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ') break;
        }
    }
    
    // Authenticate
    fputs($socket, "AUTH LOGIN\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return ['success' => false, 'error' => 'AUTH LOGIN failed: ' . $response];
    }
    
    fputs($socket, base64_encode($smtp_username) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '334') {
        fclose($socket);
        return ['success' => false, 'error' => 'Username authentication failed'];
    }
    
    fputs($socket, base64_encode($smtp_password) . "\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '235') {
        fclose($socket);
        return ['success' => false, 'error' => 'Password authentication failed. Please check your SMTP credentials.'];
    }
    
    // Send MAIL FROM
    fputs($socket, "MAIL FROM: <" . $from_email . ">\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return ['success' => false, 'error' => 'MAIL FROM failed: ' . $response];
    }
    
    // Send RCPT TO
    fputs($socket, "RCPT TO: <" . $to . ">\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return ['success' => false, 'error' => 'RCPT TO failed: ' . $response];
    }
    
    // Send DATA
    fputs($socket, "DATA\r\n");
    $response = fgets($socket, 515);
    if (substr($response, 0, 3) != '354') {
        fclose($socket);
        return ['success' => false, 'error' => 'DATA command failed: ' . $response];
    }
    
    // Build email headers and body
    $email_headers = "From: " . $from_name . " <" . $from_email . ">\r\n";
    $email_headers .= "Reply-To: " . $reply_to . "\r\n";
    $email_headers .= "To: " . $to . "\r\n";
    $email_headers .= "Subject: " . $subject . "\r\n";
    $email_headers .= "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $email_headers .= "Content-Transfer-Encoding: 8bit\r\n";
    $email_headers .= "\r\n";
    
    // Send email content
    fputs($socket, $email_headers . $message . "\r\n.\r\n");
    $response = fgets($socket, 515);
    
    if (substr($response, 0, 3) != '250') {
        fclose($socket);
        return ['success' => false, 'error' => 'Email sending failed: ' . $response];
    }
    
    // Quit
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
    return ['success' => true];
}

function sendEmailPHP($to, $subject, $message, $from_email, $from_name, $reply_to = null) {
    $reply_to = $reply_to ? $reply_to : $from_email;
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: " . $from_name . " <" . $from_email . ">\r\n";
    $headers .= "Reply-To: " . $reply_to . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    $subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    
    if (@mail($to, $subject, $message, $headers)) {
        return ['success' => true];
    } else {
        return ['success' => false, 'error' => 'PHP mail() function failed'];
    }
}

