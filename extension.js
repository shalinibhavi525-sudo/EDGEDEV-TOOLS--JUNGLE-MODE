const vscode = require('vscode');

let isEdgeModeEnabled = false;
let statusBarItem;

function activate(context) {
    console.log('Edge Dev Tools: Refined & Active.');

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'edge-dev.status';
    context.subscriptions.push(statusBarItem);
    
    updateStatusBar();

    context.subscriptions.push(
        vscode.commands.registerCommand('edge-dev.enable', enableEdgeMode),
        vscode.commands.registerCommand('edge-dev.disable', disableEdgeMode),
        vscode.commands.registerCommand('edge-dev.status', showStatus)
    );

    const config = vscode.workspace.getConfiguration('edge-dev');
    if (config.get('autoEnable')) enableEdgeMode();
}

async function enableEdgeMode() {
    isEdgeModeEnabled = true;
    const workspaceConfig = vscode.workspace.getConfiguration();

    try {
        // Elite Hardening: Killing background noise
        await workspaceConfig.update('telemetry.telemetryLevel', 'off', true);
        await workspaceConfig.update('extensions.autoUpdate', false, true);
        await workspaceConfig.update('update.mode', 'manual', true);
        await workspaceConfig.update('git.autofetch', false, true);
        await workspaceConfig.update('typescript.disableAutomaticTypeAcquisition', true, true);

        updateStatusBar();
        vscode.window.showInformationMessage('Protocol Engaged: System Hardened for Edge Environments.');
    } catch (error) {
        vscode.window.showErrorMessage(`Optimization Failed: ${error.message}`);
    }
}

async function disableEdgeMode() {
    isEdgeModeEnabled = false;
    const workspaceConfig = vscode.workspace.getConfiguration();
    await workspaceConfig.update('telemetry.telemetryLevel', 'all', true);
    await workspaceConfig.update('extensions.autoUpdate', true, true);
    updateStatusBar();
    vscode.window.showInformationMessage('Protocol Deactivated: Restoring Standard Latency.');
}

function showStatus() {
    const panel = vscode.window.createWebviewPanel('edgeDevStatus', 'System Status', vscode.ViewColumn.One, {});
    panel.webview.html = getStatusHTML();
}

function getStatusHTML() {
    const status = isEdgeModeEnabled ? 'HARDENED' : 'STANDARD';
    const gold = "#C5A059";
    const espresso = "#1A1412";
    const cream = "#F5F5DC";

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400&display=swap');
            
            body {
                background-color: #0F0F0F;
                color: ${cream};
                font-family: 'Inter', sans-serif;
                padding: 40px;
                line-height: 1.6;
                letter-spacing: 0.5px;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #2C2C2C;
                padding: 40px;
                background: linear-gradient(145deg, #161616, #0F0F0F);
            }

            header {
                border-bottom: 1px solid ${gold};
                padding-bottom: 20px;
                margin-bottom: 30px;
                text-align: center;
            }

            h1 {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                color: ${gold};
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 4px;
            }

            .status-box {
                text-align: center;
                margin: 30px 0;
            }

            .badge {
                padding: 10px 25px;
                border: 1px solid ${gold};
                color: ${gold};
                font-size: 12px;
                letter-spacing: 3px;
                font-weight: bold;
            }

            .feature-grid {
                margin-top: 40px;
            }

            .feature-item {
                margin-bottom: 20px;
                padding-left: 15px;
                border-left: 1px solid #333;
            }

            .feature-item h3 {
                font-size: 14px;
                color: ${gold};
                text-transform: uppercase;
                margin-bottom: 5px;
            }

            .feature-item p {
                font-size: 13px;
                color: #888;
                margin: 0;
            }

            .footer-note {
                margin-top: 60px;
                font-size: 11px;
                color: #555;
                text-align: center;
                font-style: italic;
                border-top: 1px solid #222;
                padding-top: 20px;
            }

            .highlight { color: ${gold}; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>Edge Dev Tools</h1>
                <p style="font-size: 10px; letter-spacing: 2px; color: #666;">EST. 2024 | TRIPURA JUNGLE BASE</p>
            </header>

            <div class="status-box">
                <span class="badge">${status} MODE</span>
            </div>

            <div class="feature-grid">
                <div class="feature-item">
                    <h3>Network Hardening</h3>
                    <p>Telemetry and background pings have been <span class="highlight">silenced</span>.</p>
                </div>
                <div class="feature-item">
                    <h3>Resource Conservation</h3>
                    <p>Auto-updates and fetch cycles paused for <span class="highlight">bandwidth integrity</span>.</p>
                </div>
                <div class="feature-item">
                    <h3>Environment</h3>
                    <p>Designed for high-latency, limited-resource <span class="highlight">edge nodes</span>.</p>
                </div>
            </div>

            <div class="footer-note">
                "In the absence of connectivity, we find clarity." <br>
                Crafted by Shambhavi Singh 
            </div>
        </div>
    </body>
    </html>
    `;
}

function updateStatusBar() {
    statusBarItem.text = isEdgeModeEnabled ? '$(shield) Edge: Hardened' : '$(zap) Edge: Standard';
    statusBarItem.color = isEdgeModeEnabled ? "#C5A059" : undefined;
    statusBarItem.show();
}

function deactivate() {}

module.exports = { activate, deactivate };
