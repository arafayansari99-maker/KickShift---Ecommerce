import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const [mode, port, basePath] = process.argv.slice(2);

if (!["build", "dev"].includes(mode) || !port || !basePath) {
  console.error(
    "Usage: node ../../scripts/run-vite.mjs <build|dev> <port> <base-path>",
  );
  process.exit(1);
}

const requireFromService = createRequire(
  path.join(process.cwd(), "package.json"),
);
const viteEntry = requireFromService.resolve("vite");
const viteCli = path.resolve(path.dirname(viteEntry), "../../bin/vite.js");
const viteArgs =
  mode === "build"
    ? ["build", "--config", "vite.config.ts"]
    : ["--config", "vite.config.ts", "--host", "0.0.0.0"];
const servicePort = mode === "dev" ? process.env.PORT || port : port;

const child = spawn(process.execPath, [viteCli, ...viteArgs], {
  cwd: process.cwd(),
  env: { ...process.env, PORT: servicePort, BASE_PATH: basePath },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error("Failed to start Vite:", error);
  process.exitCode = 1;
});

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
