const express = require("express");
const { encrypt, decrypt } = require("./encryptionModule");
const { sign, verify } = require("./signModule");

const app = express();
app.use(express.json());

// API to encrypt the request payload before processing
// The client will send the data in the request body
// The server will encrypt the data
// and sign it using the private key
app.post("/encrypt", (req, res, next) => {
	console.log("=====Running /encrypt API======");
	console.log("Headers initially --->", req.headers);
	// Assuming the request payload is in JSON format
	const data = req.body;
	const encryptedData = encrypt(data);
	req.body = encryptedData;
	next();
});

app.use("/encrypt", (req, res) => {
	const signature = sign(req.body);
	req.headers["Authorization"] =
		"Signature " +
		"signatureProviderId=" +
		signature.signatureProviderId +
		" signature=" +
		signature.signature +
		" signatureAlgorithm=" +
		signature.signingAlgorithm +
		" created=" +
		signature.created +
		" expires=" +
		signature.exprires;

	console.log("Headers after signing--->", req.headers);

	res.json({
		data: req.body,
		signatureProviderId: signature.signatureProviderId,
		signatureAlgorithm: signature.signingAlgorithm,
		created: signature.created,
		expires: signature.exprires,
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
	// Verify the signature
	const isSignatureValid = verify(req.body.data, authorizationHeader);
	if (isSignatureValid) {
		console.log("Signature is valid");
		next();
	} else {
		res.json({
			message: "Invalid Signature",
		});
	}
});

app.use("/decrypt", (req, res) => {
	const { data } = req.body;
	console.log("Data from body --->", data);
	const decryptedData = decrypt(data);
	console.log("Decrypted Data --->", decryptedData);
	res.json(decryptedData);
});

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Curl Command for Testing the Encrypt API
// curl --location 'http://localhost:3000/encrypt' \
// --header 'Content-Type: application/json' \
// --data '{ "name": "John Doe", "age": 30 }'

// Curl Command for Testing the Decrypt API
// curl --location 'http://localhost:3000/decrypt' \
// --header 'Content-Type: application/json' \
// --header 'x-signature: VgKe4ZRR8S0M8SpqLq/BEq2O7RwDK/rnPeN1L0pHjmYW/LpAWvW/tJiGW8Z9RHypDtQ3HIPpXwhmqVlVF/XTNfBrCOVpWhywPxs2PnL3g4lt550wXZ/qkqHWm9blkLXwLl1CmkdCk69708EyPCVxBjL9K/eMxl2hQlcF7L3uJvlmVLXhhRRQCVIqFOhCEd6k8hLToiuakUP1s/cEfievwGMdL4YnjdT+Pm+Ndj/CtNGrw96WS4umaxrzeWfhhQSwQFiUtLJ9Zr/67jHMo0ZnaudBmmcuXFqiBhsoV0LwQ/NJKkQbafeGG5XQlqQTosf5hMwu0PWoCUL5d0TlaASqtMqZ3lTkPuxG7Cg/wCFHTHKVOSGO2JVX4xlyKYGy68oYATFlWxT0353j5/a3CdLLMYSSz8XmmiEWHO8eZIyWfRTV1lnx5+haV3CX78YtDkcSJB2I161J42Z3Ey1YvNCW9vhxKRQ1VNf7s0CpNvNx/Ut+4IiMaYgew5MT2CgIjeMj+O5p0lcbdotvPT8jTFbvxaGxtnmlJf34G75IgAc66pQBdJ68htuhutIZWqCQhrHDR6LsgS8eJ9q1y6v7alo84cO0biFaA9+77IbeB1gMoqZiJxvfuux91q57LMCAVNkVyI3QpYvVYH0w3xjyfClw2Jx5TBEqD+W2WQRFzT7YZUs=' \
// --data '{
//     "data": {
//         "iv": "d9b40661c57844dd4f62b1284187d056",
//         "encryptedData": "6e2e764986dbb515a753839b6da07437897c89d5ae42235c390a1e75ca6e4438"
//     }
// }'
