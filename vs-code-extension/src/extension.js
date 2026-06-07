const vscode = require("vscode");

function getConfig() {
  const config = vscode.workspace.getConfiguration("cognitivePatternDecoder");
  return {
    serverUrl: config.get("serverUrl") || "http://localhost:5000",
    enabled: config.get("enabled") !== false
  };
}

function getLegacyBackendUrl() {
  const config = vscode.workspace.getConfiguration("cognitiveDecoder");
  return config.get("backendUrl", "http://localhost:5000");
}

let statusBar;
let sessionStartTime = Date.now();
let lastEditTime = Date.now();
let authToken = null;
let currentProjectId = null;
let typedChars = 0;
let backspaceCount = 0;
let pasteCount = 0;
let pasteCharacters = 0;
let saveCount = 0;
let fileSwitchCount = 0;
let cursorMoveCount = 0;
let pauseTimes = [];

function activate(context) {
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = "$(pulse) CPD: Connecting...";
  statusBar.tooltip = "Cognitive Pattern Decoder";
  statusBar.show();
  context.subscriptions.push(statusBar);

  authToken = context.globalState.get("authToken") || null;

  const loginCommand = vscode.commands.registerCommand("cognitiveDecoder.login", async () => {
    const { serverUrl } = getConfig();

    const email = await vscode.window.showInputBox({
      prompt: "Enter your email"
    });

    const password = await vscode.window.showInputBox({
      prompt: "Enter your password",
      password: true
    });

    if (!email || !password) {
      vscode.window.showErrorMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.token) {
        vscode.window.showErrorMessage("Login failed");
        return;
      }

      authToken = data.token;
      await context.globalState.update("authToken", authToken);

      statusBar.text = "$(circle-filled) CPD: Active";
      vscode.window.showInformationMessage("Login successful");
    } catch (error) {
      statusBar.text = "$(circle-outline) CPD: Disconnected";
      vscode.window.showErrorMessage("Cannot connect to backend");
    }
  });
  context.subscriptions.push(loginCommand);

  const selectProjectCommand = vscode.commands.registerCommand("cognitiveDecoder.selectProject", async () => {
    const projectId = await vscode.window.showInputBox({
      prompt: "Enter Project ID"
    });

    if (!projectId) {
      vscode.window.showErrorMessage("Project ID is required");
      return;
    }

    currentProjectId = projectId;
    vscode.window.showInformationMessage(`Project selected: ${projectId}`);
  });
  context.subscriptions.push(selectProjectCommand);

  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
    const now = Date.now();
    const pause = (now - lastEditTime) / 1000;
    if (pause > 0.5) pauseTimes.push(pause);
    lastEditTime = now;

    event.contentChanges.forEach((change) => {
      if (change.text === "") {
        backspaceCount += Math.abs(change.rangeLength);
      } else if (change.text.length > 50) {
        pasteCount++;
        pasteCharacters += change.text.length;
      } else {
        typedChars += change.text.length;
      }
    });
  }));

  context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(() => {
    saveCount++;
  }));

  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
    fileSwitchCount++;
  }));

  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => {
    cursorMoveCount++;
  }));

  const endSessionCommand = vscode.commands.registerCommand("cognitiveDecoder.endSession", async () => {
    if (!authToken || !currentProjectId) {
      vscode.window.showErrorMessage("Please login and select a project first");
      return;
    }

    const { serverUrl, enabled } = getConfig();
    if (!enabled) {
      vscode.window.showWarningMessage("Telemetry collection is disabled");
      return;
    }

    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const avgPause = pauseTimes.length === 0
      ? 0
      : pauseTimes.reduce((a, b) => a + b, 0) / pauseTimes.length;
    const typingSpeed = sessionTime > 0 ? typedChars / sessionTime : 0;

    const sessionData = {
      projectId: currentProjectId,
      typingSpeed: Number(typingSpeed.toFixed(2)),
      typedChars,
      backspaceCount,
      pasteCount,
      pasteCharacters,
      saveCount,
      fileSwitchCount,
      cursorMoveCount,
      avgPauseTime: Number(avgPause.toFixed(2)),
      sessionTime
    };

    const saved = await sendTelemetry(sessionData);
    if (saved) {
      vscode.window.showInformationMessage("Session saved securely");
    } else {
      vscode.window.showErrorMessage("Failed to save session");
    }

    sessionStartTime = Date.now();
    lastEditTime = Date.now();
    typedChars = 0;
    backspaceCount = 0;
    pasteCount = 0;
    pasteCharacters = 0;
    saveCount = 0;
    fileSwitchCount = 0;
    cursorMoveCount = 0;
    pauseTimes = [];
    currentProjectId = null;
  });
  async function sendTelemetry(payload) {
    const { serverUrl, enabled } = getConfig();
    if (!enabled) return false;

    const token = authToken || "";
    try {
      const response = await fetch(`${serverUrl}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        statusBar.text = "$(circle-filled) CPD: Active";
        return true;
      }

      statusBar.text = `$(circle-outline) CPD: Error ${response.status}`;
      return false;
    } catch (err) {
      statusBar.text = "$(circle-outline) CPD: Disconnected";
      return false;
    }
  }

  context.subscriptions.push(endSessionCommand);

  (async () => {
    const { serverUrl } = getConfig();
    try {
      const res = await fetch(serverUrl + "/health");
      if (res.ok) {
        statusBar.text = "$(circle-filled) CPD: Active";
      } else {
        statusBar.text = "$(circle-outline) CPD: Disconnected";
      }
    } catch {
      statusBar.text = "$(circle-outline) CPD: Disconnected";
    }
  })();
}

function deactivate() {
  statusBar?.dispose();
}

module.exports = {
  activate,
  deactivate
};