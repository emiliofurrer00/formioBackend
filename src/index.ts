import { createApp } from "./app";
import "dotenv/config";

const PORT = Number(process.env.PORT || 3001);
const app = createApp();

app.listen(PORT, "0.0.0.0", () => console.log(`API listening on PORT ${PORT}`));

