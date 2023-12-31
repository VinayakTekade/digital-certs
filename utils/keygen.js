// Use this file to generate a public/private key pair and a secret key. Then copy these values to the .env file.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const certificatePath = path.resolve(__dirname, "../server.pem"); // Path to the combined private key and certificate

// Load the certificate and extract the public and private keys
const certificate = fs.readFileSync(certificatePath);
const publicKey = crypto.createPublicKey(certificate);
const privateKey = crypto.createPrivateKey(certificate);

// Print the public and private keys in string format
// Copy these values to the .env file as PUBLIC_KEY and PRIVATE_KEY
console.log(
	"Public Key --->",
	publicKey.export({ type: "spki", format: "pem" })
);
console.log(
	"Private Key --->",
	privateKey.export({ type: "pkcs8", format: "pem" })
);

// Generate a random secret key
function generateSecretKey(length) {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let secretKey = "";

	// Generate a random string of the specified length
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		secretKey += charset[randomIndex];
	}

	return secretKey;
}

const secretKeyLength = 32; // You can adjust the length as needed
const secretKey = generateSecretKey(secretKeyLength); // Replace with your desired fixed secret key if needed

// Print the secret key in string format
// Copy this value to the .env file as SECRET_KEY
console.log("Secret Key --->", secretKey);
