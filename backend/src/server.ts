import { createServer } from "http";
import app from "./index.js";

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

console.log(`🚀 Quran API Server starting...`);
console.log(`📖 Quran data loaded and cached`);
console.log(`🔗 Server running at http://${host}:${port}`);
console.log(`📚 API documentation: http://${host}:${port}/api`);

const server = createServer(async (req, res) => {
  const request = new Request(`http://${host}:${port}${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
  });

  try {
    const response = await app.fetch(request);
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    res.writeHead(response.status, headers);
    res.end(await response.text());
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`✅ Server listening on http://${host}:${port}`);
});
