import crypto from "crypto";

// generate 32 bytes → AES-256
const key = crypto.randomBytes(32).toString("hex");

console.log("ENCRYPTION_KEY=" + key);
