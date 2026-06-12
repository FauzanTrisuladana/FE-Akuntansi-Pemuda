import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  // Timezone untuk server functions
  date: {
    timezone: "Asia/Jakarta",
  },
});