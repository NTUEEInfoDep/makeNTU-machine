export const decodeJWT = (token: string): Record<string, any> | null => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null; // Invalid JWT format
  }
  const payload = Buffer.from(parts[1], "base64").toString("utf-8");
  return JSON.parse(payload);
};
