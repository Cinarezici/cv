const { spawn } = require('child_process');

const mcp = spawn('npx', ['-y', '@21st-dev/magic@latest'], {
    env: { ...process.env, API_KEY: '2c69a15c3a9b3a935fdbde428671610a8495a8d6fe5824d2147d6f68d0aaa0da' },
    stdio: ['pipe', 'pipe', 'inherit']
});

mcp.stdout.on('data', (data) => {
    const messages = data.toString().split('\n').filter(Boolean);
    for (const msg of messages) {
        try {
            const parsed = JSON.parse(msg);
            console.log('Received:', JSON.stringify(parsed, null, 2));
            if (parsed.id === 1) {
                process.exit(0);
            }
        } catch (e) { }
    }
});

const req = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
};

mcp.stdin.write(JSON.stringify(req) + '\n');

setTimeout(() => {
    console.log("Timeout");
    process.exit(0);
}, 5000);
