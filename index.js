const express = require("express");
const { encrypt, decrypt } = require("./helper_modules/encryptionModule");
const { sign, verify } = require("./helper_modules/signModule");

const app = express();
app.use(express.json());
require("dotenv").config();

// API to encrypt the request payload before processing
// The client will send the data in the request body
// The server will encrypt the data
// and sign it using the private key
app.post("/encrypt", (req, res, next) => {
	console.log("=====Running /encrypt API======");
	console.log("Headers initially --->", req.headers);
	// Assuming the request payload is in JSON format
	const data = req.body;
	const encryptedData = encrypt(data, "aes-256-cbc", "utf8", "hex");
	req.body = encryptedData;
	next();
});

app.use("/encrypt", (req, res) => {
	const signature = sign(
		req.body,
		process.env.SIGNATURE_PROVIDER_ID,
		"SHA256",
		"base64"
	);
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
		signature.keyId;

	console.log("Headers after signing--->", req.headers);

	res.json({
		data: req.body,
		signatureProviderId: signature.signatureProviderId,
		signatureAlgorithm: signature.signingAlgorithm,
		created: signature.created,
		expires: signature.exprires,
		keyId: signature.keyId,
	});
});

// API to decrypt the request payload before processing
// The client will send the encrypted data in the request body
// and the signature in the request header
// The server will verify the signature using the public key
// and decrypt the data
app.post("/decrypt", (req, res, next) => {
	console.log("=====Running /decrypt API======");
	// Extract the Authorization header from the request
	const authorizationHeader = req.headers["authorization"];
	console.log("Authorization Header --->", authorizationHeader);
	// Check if the Authorization header is present
	if (!authorizationHeader) {
		res.status(401);
		res.json({
			message: "Authorization Header is missing",
		});
	}
	// Verify the signature
	const isSignatureValid = verify(req.body.data, authorizationHeader);
	if (isSignatureValid) {
		console.log("Signature is valid");
		next();
	} else {
		res.status(401);
		res.json({
			message: "Invalid Signature",
		});
	}
});

app.use("/decrypt", (req, res) => {
	const { data } = req.body;
	// Check if the data is present
	if (!data) {
		res.status(400);
		res.json({
			message: "Data is missing",
		});
	}
	console.log("Data from body --->", data);
	const decryptedData = decrypt(data, "aes-256-cbc", "hex", "utf8");
	console.log("Decrypted Data --->", decryptedData);
	res.json(decryptedData);
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
