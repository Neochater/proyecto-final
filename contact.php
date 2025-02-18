<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // Validate inputs
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo "Por favor, completa todos los campos.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor, introduce un email válido.";
        exit;
    }

    // Email configuration
    $to = "gamevault.info.vault@gmail.com";
    $email_subject = "Nuevo mensaje de contacto: $subject";
    $email_body = "Has recibido un nuevo mensaje.\n\n".
                  "Detalles:\n\n".
                  "Nombre: $name\n".
                  "Email: $email\n".
                  "Asunto: $subject\n".
                  "Mensaje:\n$message";
    $headers = "From: $email\n";
    $headers .= "Reply-To: $email";

    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        http_response_code(200);
        echo "¡Mensaje enviado con éxito!";
    } else {
        http_response_code(500);
        echo "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.";
    }
} else {
    http_response_code(403);
    echo "Acceso denegado";
}
?>