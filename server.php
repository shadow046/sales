<?php
$server = http_create_server(function ($req, $res) {
    switch ($req->getUri()->getPath()) {
        case '/iclock/cdata':
            // Handle cdata requests
            break;
        case '/iclock/getrequest':
            // Handle getrequest requests
            break;
        case '/iclock/devicecmd':
            // Handle devicecmd requests
            break;
        default:
            $res->setStatusCode(404);
            $res->end();
            break;
    }
}, ['port' => $confHttpServerPortNoVal]);

if (!$server) {
    // Handle server creation failure
    exit(1);
}

// Start the server
http_server_start($server);

?>
