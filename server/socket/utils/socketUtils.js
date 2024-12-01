import CryptoJS from "crypto-js";

export const decryptUserId = (encryptedUserId) => {
  if (!encryptedUserId) {
    throw new Error("Encrypted User ID is required for decryption");
  }

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey || typeof secretKey !== "string") {
    throw new Error("Invalid secret key");
  }

  try {
    const decodedData = atob(encryptedUserId);

    const bytes = CryptoJS.AES.decrypt(decodedData, secretKey);
    const decryptedUserId = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedUserId) {
      throw new Error("Decryption failed. Decrypted data is empty or invalid.");
    }

    return decryptedUserId;
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Decryption failed");
  }
};

export const encryptUserId = (userId) => {
  if (!userId) {
    throw new Error("User ID is required for encryption");
  }
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey || typeof secretKey !== "string") {
    throw new Error("Invalid secret key");
  }
  try {
    const encryptedUserId = CryptoJS.AES.encrypt(userId, secretKey).toString();
    const base64Encoded = btoa(encryptedUserId);
    return base64Encoded;
  } catch (error) {
    console.error("Error during encryption:", error);
    throw new Error("Encryption failed");
  }
};
