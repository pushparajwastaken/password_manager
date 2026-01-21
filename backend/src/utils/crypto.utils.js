import crypto from "crypto";

export const deriveKey = (masterPassword, salt) => {
  return crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");
};
export const encrypt = (password, key) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return {
    cipherText: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
};
export const decrypt = (cipherText, key, iv, authTag) => {
  if (!cipherText || !iv || !authTag) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(cipherText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
