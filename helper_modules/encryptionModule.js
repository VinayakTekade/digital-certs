const crypto = require("crypto");


// Encrypt the data passed in using AES-256-CBC algorithm
// Sample input: { "name": "John Doe", "age": 30 }
// Sample output: {
//     "encryptedData": {
//         "iv": "00948389a6120ce46baceb2ecdf68bf5",
//         "encryptedData": "14aa3793c8b661d45f7f008555c009b0e26f2446f414e9580f94c7848311260d"
//     }
// }
function encrypt(data, encryptionAlgorithm, intputEncoding, outputEncoding) {
	// Generate a random IV (Initialization Vector) for each encryption
	const iv = crypto.randomBytes(16);

	// Create a new cipher using the secret key
	const cipher = crypto.createCipheriv(
		encryptionAlgorithm,
		Buffer.from(process.env.SECRET_KEY),
		iv
	);

	// Encrypt the data passed in
	let encrypted = cipher.update(JSON.stringify(data), intputEncoding, outputEncoding);

	// Indicate that we are done with the encryption
	encrypted += cipher.final(outputEncoding);
	return {
		iv: iv.toString(outputEncoding), // Convert IV to string and include it in the output for decryption later
		encryptedData: encrypted,
	};
}

// Decrypt the data passed in using AES-256-CBC algorithm
// Sample input: {
//     "encryptedData": {
//         "iv": "00948389a6120ce46baceb2ecdf68bf5",
//         "encryptedData": "14aa3793c8b661d45f7f008555c009b0e26f2446f414e9580f94c7848311260d"
//     }
// }
// Sample output: { "name": "John Doe", "age": 30 }
function decrypt(encryptedData, encryptionAlgorithm, intputEncoding, outputEncoding) {
	// Create a decipher using the secret key and the IV we generated earlier
	const decipher = crypto.createDecipheriv(
		encryptionAlgorithm,
		Buffer.from(process.env.SECRET_KEY),
		Buffer.from(encryptedData.iv, intputEncoding)
	);

	// Decrypt the data passed in
	let decrypted = decipher.update(encryptedData.encryptedData, intputEncoding, outputEncoding);

	// Indicate that we are done with the decryption
	decrypted += decipher.final(outputEncoding);

	// Parse the decrypted data to JSON format
	return JSON.parse(decrypted);
}

module.exports = {
	encrypt,
	decrypt,
};
