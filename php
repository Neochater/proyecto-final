<?php
// Configuración general
define('SITE_NAME', 'GameVault');
define('SITE_URL', 'http://localhost:8000');
define('ADMIN_EMAIL', 'gamevault.info.vault@gmail.com');

// Configuración de base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'gamevault');

// Configuración de sesión
session_start();

// Funciones de utilidad
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function require_login() {
    if (!is_logged_in()) {
        header('Location: ' . SITE_URL . '/login.php');
        exit;
    }
}

function send_email($to, $subject, $message) {
    $headers = "From: " . ADMIN_EMAIL . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $message, $headers);
}

function generate_token() {
    return bin2hex(random_bytes(32));
}

function verify_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Manejo de errores
function custom_error_handler($errno, $errstr, $errfile, $errline) {
    $error_message = date('Y-m-d H:i:s') . ": [$errno] $errstr in $errfile on line $errline\n";
    error_log($error_message, 3, "error.log");
    
    if (ini_get('display_errors')) {
        printf("<pre>Error: %s\n File: %s\n Line: %d</pre>", $errstr, $errfile, $errline);
    }
    
    return true;
}

set_error_handler("custom_error_handler");

// Configuración de zona horaria
date_default_timezone_set('Europe/Madrid');

// Variables globales
$GLOBALS['errors'] = array();
$GLOBALS['messages'] = array();

// Función para añadir mensajes de error
function add_error($message) {
    $GLOBALS['errors'][] = $message;
}

// Función para añadir mensajes de éxito
function add_message($message) {
    $GLOBALS['messages'][] = $message;
}

// Función para mostrar mensajes
function display_messages() {
    if (!empty($GLOBALS['errors'])) {
        foreach ($GLOBALS['errors'] as $error) {
            echo "<div class='error-message'>$error</div>";
        }
    }
    
    if (!empty($GLOBALS['messages'])) {
        foreach ($GLOBALS['messages'] as $message) {
            echo "<div class='success-message'>$message</div>";
        }
    }
}

// Inicialización de token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = generate_token();
}

?>