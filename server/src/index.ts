import express from "express";
import cors from "cors";
import onboardingRouter from "./routes/onboarding.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", onboardingRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`LLA server listening on port ${port}`);
});
