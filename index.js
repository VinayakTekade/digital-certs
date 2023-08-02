const express = require("express");
const {
	encrypt,
	decrypt,
	encryptUsingPublicKey,
	decryptUsingPrivateKey,
} = require("./helper_modules/encryptionModule");
const { sign, verify } = require("./helper_modules/signModule");
const { createDigest } = require("./helper_modules/hashingModule");

const app = express();
app.use(express.json());
require("dotenv").config();

// API to encrypt the request payload before processing
// The client will send the data in the request body
// The server will encrypt the data
app.post("/encrypt", (req, res, next) => {
	console.log("=====Running /encrypt API======");
	// Assuming the request payload is in JSON format
	const data = req.body;
	// Check if the data is present
	if (!data) {
		res.status(400);
		res.json({
			message: "Data is missing",
			success: false,
		});
	}
	// Encrypt the data
	const encryptedData = encrypt(data, "aes-256-cbc", "utf8", "hex");
	req.body = encryptedData;
	res.json({
		data: encryptedData,
	});
});

// API to decrypt the request payload before processing
// The client will send the encrypted data in the request body
// and decrypt the data
app.post("/decrypt", (req, res) => {
	const { data } = req.body;
	// Check if the data is present
	if (!data) {
		res.status(400);
		res.json({
			message: "Data is missing",
		});
	}
	// Decrypt the data
	const decryptedData = decrypt(data, "aes-256-cbc", "hex", "utf8");
	res.json(decryptedData);
});

// API to sign the request payload before processing
// The client will send the data in the request body
// THe server will encrypt the data using the public key

app.post("/encryptUsingPublicKey", (req, res) => {
	console.log("=====Running /encryptUsingPublicKey API======");
	// Assuming the request payload is in JSON format
	const data = req.body;
	// Check if the data is present
	if (!data) {
		res.status(400);
		res.json({
			message: "Data is missing",
			success: false,
		});
	}
	// Encrypt the data
	const encryptedData = encryptUsingPublicKey(data, "utf8", "base64");
	req.body = encryptedData;
	res.json({
		data: encryptedData,
	});
});

// API to decrypt the request payload before processing
// The client will send the encrypted data in the request body
// and decrypt the data using the private key
app.post("/decryptUsingPrivateKey", (req, res) => {
	console.log("=====Running /decryptUsingPrivateKey API======");
	// Assuming the request payload is in JSON format
	const data = req.body.data;
	// Check if the data is present
	if (!data) {
		res.status(400);
		res.json({
			message: "Data is missing",
			success: false,
		});
	}
	// Decrypt the data
	const decryptedData = decryptUsingPrivateKey(data, "base64", "utf8");
	res.json({
		data: decryptedData,
	});
});

// API to sign the request payload before processing
// The client will send the data in the request body
// The server will sign the data using the private key
// and send the signature in the request header
app.post("/sign", (req, res) => {
	console.log("=====Running /sign API======");
	// sign the request body
	const signature = sign(
		req.body,
		process.env.SIGNATURE_PROVIDER_ID,
		"SHA256",
		"base64"
	);
	console.log("Signature --->", signature);
	// Generate the digest of the request body
	const digest = createDigest(req.body, "SHA256", "hex");

	// Set Authorization header with the signature, digest and other details
	req.headers["Authorization"] =
		"Signature" +
		" signatureProviderId=" +
		signature.signatureProviderId +
		" signature=" +
		signature.signature +
		" signatureEncoding=" +
		signature.signatureEncoding +
		" signatureAlgorithm=" +
		signature.signingAlgorithm +
		" created=" +
		signature.created +
		" expires=" +
		signature.exprires +
		" keyId=" +
		signature.keyId +
		" digest=" +
		digest.digest;

	console.log("Authorization Header --->", req.headers["Authorization"]);

	res.json({
		data: req.body,
	});
});

// API to verify the signature of the request payload before processing
// The client will send the data in the request body
// and the signature in the request header
// The server will verify the signature using the public key
app.post("/verify", (req, res, next) => {
	console.log("=====Running /verify API======");
	// Extract the Authorization header from the request
	const authorizationHeader = req.headers["authorization"];
	console.log("Authorization Header --->", authorizationHeader);
	// Check if the Authorization header is present
	if (!authorizationHeader) {
		res.status(401);
		res.json({
			message: "Authorization Header is missing",
			success: false,
		});
	}
	// Verify the signature
	const isSignatureValid = verify(req.body, authorizationHeader);
	if (isSignatureValid) {
		console.log("Signature is valid");
		res.json({
			message: "Signature is valid",
			success: true,
		});
	} else {
		res.status(401);
		res.json({
			message: "Invalid Signature",
			success: false,
		});
	}
});

// Start the server
const port = 4000; // Replace with your desired port number
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Curl Command for Testing the Encrypt API
// curl --location 'http://localhost:4000/encrypt' \
// --header 'Content-Type: application/json' \
// --data '{ "name": "John Doe", "age": 30 }'

// Curl Command for Testing the Decrypt API
// curl --location 'http://localhost:4000/decrypt' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Signature signatureProviderId=test-signature-provider signature=IB5Y1LPAhlUttPVCZIIjQ5432SzWobO0ofqXwJxEpD9BS7nM7hvNxDBYnGd0Qv+bUH9Pe5WUh4aJVfhix9OS+TYfOoLuQij5EzsiqE1rBfkuF9GQWooRri6l2QfWhsiVTb9Rh841LXbWKpQIuv2RwRDeTUlSqEQKsSGzBKHbFGBD6JZk4TIklSWTLsJqtDnx5kb0wKipl3+kDyyINS9d68f8/mXyGTHP7Gc6ISwOVYLTJlFucvWiaQKquYyy/AG5ROGATLKTv5JXxz/viqFDZG0KZyQjUEgYklILRwO1UtYNK3a7j62sy6frXtVxCFuIfv4j+/9S/PJUwgrQ1a69tQ== signatureAlgorithm=SHA256 created=1690449311783 expires=1690452911783' \
// --data '{
//     "data": {
//         "iv": "253d95d839050346d35f755cf4f6c5c1",
//         "encryptedData": "e17d82335e67bce4e3bbc48699821d041d361c9b1de5631eac513a7fb9c829d4"
//     }
// }'

// Curl Command for Testing the Encrypt Using Public Key API
// curl --location 'http://localhost:4000/encryptUsingPublicKey' \
// --header 'Content-Type: application/json' \
// --data '{ "name": "John Doe", "age": 30 }'

// Curl Command for Testing the Decrypt Using Private Key API
// curl --location 'http://localhost:4000/decryptUsingPrivateKey' \
// --header 'Content-Type: application/json' \
// --data '{
//     "data": "Q8Mkp/U3eUIWfAvnrCZWBqtXRiIcbATqCuSGzW2seW9CA2ju1kvQWHnXFEc5/cFAzXCWW4jhkZVuQzLDAzV0XXekcyI5RU261Nswkl8PZ8VADuZ61IqfgEePckW4mCrbFc+CRGkVwFwG1GB5nwTdtqGGL4PsQex07mqZPbrW52MCyhrz3Uopq3qY/QfADczQ9efqUhozN3lXcc5IZdgC6JZH6696n5JTdZWx6TfR2cMXN2Im40SeWZ0jrFZ1nxh3qWd3iooUfMVhre4cdHzs41pXmLNzVK4fKArFD1DmP7K7KpwxQP3cs5eT35i72vsdris+CbjiKLs8d14L7jCFjQ=="
// }'

// Curl Command for Testing the Sign API
// curl --location 'http://localhost:4000/sign' \
// --header 'Content-Type: application/json' \
// --data '{ "name": "John Doe", "age": 30 }'

// Curl Command for Testing the Verify API
// curl --location 'http://localhost:4000/verify' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Signature signatureProviderId=test-signature-provider signature=NDnIHyO0Q0CJtDB9TZSanJb7hhlXNmAjliadA6pkBVqYrAEMTmslj+2iVMAc7dBqvgcege0wkzyNxvgRUmz0tPJIMcLDId4G7RozSNdwFC5+hMjwPK93yulDW8Nyvn4uN+UsC6hN/Ayi0UHMLqDcRoDmzzrQw9RlxAHykuPieq9fFOPbSbeAh+N9/S+1HQZd37WbKejgIhjS5vRkj7+jlmhumPE/eMIa/DKwPA2zhjwxKd7XF1kZ7NWbI+A79tT+YCGAr1LbeOedMh36x2VDBrRp1+vjWUo2G5MHnWDHJMwiC0j/4WxATC0GJiCI8JxtZEwKmF1OKLlLsksYOm7POQ== signatureEncoding=base64 signatureAlgorithm=SHA256 created=1690865162817 expires=1690868762817 keyId=af34cb4c-1a00-4e46-baf7-54ec9c23fab4 digest=ebc3210d859a1e9df6693af750bdf0cbcd3934abd34fe25942519678caafb7af' \
// --data '{
//     "name": "John Doe",
//     "age": 30
// }'
