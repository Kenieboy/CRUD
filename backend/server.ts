import app from "./src/app.ts";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
