<?php
    // Include email sending functions
    require_once 'send-email.php';
    
    // Only process POST requests.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["name"]));
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = trim($_POST["email"]);
        $phone = isset($_POST["phone"]) ? strip_tags(trim($_POST["phone"])) : "";
        $service = isset($_POST["service"]) ? strip_tags(trim($_POST["service"])) : "";
        $message = trim($_POST["message"]);

        // Validate required fields
        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo "Please fill in all required fields.";
            exit;
        }

        // Validate email format - accepts any valid email (Gmail, Yahoo, Outlook, etc.)
        // First sanitize, then validate
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo "Please provide a valid email address.";
            exit;
        }

        // Load email configuration
        $config = require 'email-config.php';
        $recipient = $config['recipient_email'];
        $from_email = $config['from_email'];
        $from_name = $config['from_name'];

        // Build the email subject.
        $subject = "New Contact Form Submission from " . $name;

        // Build the email content.
        $email_content = "New Contact Form Submission\n\n";
        $email_content .= "Name: " . $name . "\n";
        $email_content .= "Email: " . $email . "\n";
        if (!empty($phone)) {
            $email_content .= "Phone: " . $phone . "\n";
        }
        if (!empty($service)) {
            $email_content .= "Service: " . $service . "\n";
        }
        $email_content .= "\nMessage:\n" . $message . "\n";

        // Send the email using SMTP or PHP mail()
        $result = sendEmailSMTP($recipient, $subject, $email_content, $from_email, $from_name, $email);

        if ($result['success']) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            echo "Thank You! Your message has been sent. We'll get back to you soon.";
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            $error_message = isset($result['error']) ? $result['error'] : "Something went wrong and we couldn't send your message.";
            
            // Provide helpful error message
            if (strpos($error_message, 'password') !== false || strpos($error_message, 'authentication') !== false) {
                echo "Email configuration error. Please check email-config.php and ensure SMTP credentials are set up correctly.";
            } else {
                echo "Oops! " . $error_message . " Please try again later or contact us directly at " . $recipient;
            }
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo "There was a problem with your submission, please try again.";
    }

?>