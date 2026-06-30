#!/usr/bin/env bunx
import { ChildProcess, spawn } from "child_process";

// Get all extra arguments after the script name
const extraArgs = process.argv.slice(2);

// Start cloudflared tunnel
const cloudflared = spawn("bunx", ["--bun", "cloudflared", "tunnel", "--url", "localhost:8787"]);

let tunnelUrl = "";
let expoStarted = false;
let shuttingDown = false;
let expoProcess: ChildProcess | null = null;

// Spinner setup
const spinnerChars = ["|", "/", "-", "\\"];
let spinnerIndex = 0;

const spinnerInterval = setInterval(() => {
    if (!tunnelUrl) {
        process.stdout.write(`\rStarting tunnel... ${spinnerChars[spinnerIndex]}`);
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
    }
}, 100);

function startExpo() {
    if (!tunnelUrl || shuttingDown) return;

    console.log("Starting api...");

    const expoArgs = ["dev"];

    expoProcess = spawn("wrangler", expoArgs, {
        stdio: "inherit",
    });

    expoProcess.on("exit", (code, signal) => {
        if (shuttingDown) return;

        // Normal exit / manual stop
        if (signal === "SIGINT" || signal === "SIGTERM" || code === 0) {
            console.log("\nExpo stopped.");
            cloudflared.kill();
            process.exit(0);
        }

        // Crash detected → restart
        console.log(`\nExpo crashed (code ${code}). Restarting in 2 seconds...`);

        setTimeout(() => {
            startExpo();
        }, 2000);
    });
}

cloudflared.stderr.on("data", data => {
    const regex = /https:\/\/[^\s|]+\.trycloudflare\.com/;
    const match = data.toString().match(regex);

    if (match && !tunnelUrl) {
        tunnelUrl = match[0];

        clearInterval(spinnerInterval);
        process.stdout.write(`\rTunnel URL detected: ${tunnelUrl}\n`);

        if (!expoStarted) {
            expoStarted = true;
            startExpo();
        }
    }
});

cloudflared.on("exit", code => {
    if (!expoStarted) {
        clearInterval(spinnerInterval);
        console.error("\ncloudflared exited before providing a tunnel URL!");
        process.exit(code || 1);
    }
});

function shutdown(signal: NodeJS.Signals) {
    shuttingDown = true;

    if (expoProcess) {
        expoProcess.kill(signal);
    }

    cloudflared.kill(signal);
    process.exit();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
