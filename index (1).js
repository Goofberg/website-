const http = require('https');

const externalFunction = (userId, userName, message) => {
    // Your external function logic here
    console.log(`User ${userName} (ID: ${userId}) sent the message: ${message}`);
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Text Input</title>
            </head>
            <body>
                <h1>Enter a message:</h1>
                <form id="messageForm" onsubmit="sendMessage(event)">
                    <input type="text" id="messageInput" placeholder="Type your message">
                    <button type="submit">Send</button>
                </form>
                <script>
                    async function getUserIp() {
                        try {
                            const response = await fetch('https://httpbin.org/ip');
                            const data = await response.json();
                            return data.origin;
                        } catch (error) {
                            console.error('Error fetching user IP:', error);
                            return 'Unknown';
                        }
                    }

                    function sendMessage(event) {
                        event.preventDefault();
                        
                        // Get user information
                        const userInfo = {
                            userAgent: navigator.userAgent,
                            location: 'User location not available', // You can enhance this based on user permissions
                        };
                        
                        const userIp = await getUserIp();
                        const message = document.getElementById('messageInput').value;
                        fetch('/api/sendMessage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userIp, userInfo, message }),
                        })
                        .then(response => response.json())
                        .then(data => console.log(data));
                    }
                </script>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else if (req.url === '/api/sendMessage' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);
            externalFunction(data.userIp, data.userInfo, data.message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Message received!' }));
        });
    }
});

server.listen(4059, () => {
    console.log('Server is running on port 4059');
});