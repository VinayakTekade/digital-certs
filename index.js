const express = require("express");
const { encrypt, decrypt } = require("./encryptionMiddleware");

const app = express();
app.use(express.json());

// API to encrypt the request payload before processing
app.post("/encrypt", (req, res) => {
	// Assuming the request payload is in JSON format
	const data = req.body;
	const encryptedData = encrypt(data);
	res.json({ encryptedData });
});

// API to decrypt the request payload before processing
app.post("/decrypt", (req, res) => {
	// Assuming the request payload is in JSON format and contains the encryptedData field
	const { encryptedData } = req.body;
	const decryptedData = decrypt(encryptedData);
	res.json(decryptedData);
});

// ... Define your routes and other middleware here ...

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


// Curl Command for Testing the Encrypt API
// curl --location 'http://localhost:3000/encrypt' --header 'Content-Type: application/json' --data '{ "name": "John Doe", "age": 30 }'

// Curl Command for Testing the Decrypt API
// curl --location 'http://localhost:3000/decrypt' --header 'Content-Type: application/json' \
// --data '{
//     "encryptedData": {
//         "iv": "97c7807b2451e58d4648cb5c0d3b29c3",
//         "encryptedData": "d0e6ea795d535b7f3e5cfc6b163fea2702db510e33d8701d5bced568749712696e75d9b4291d46819a84fa28169b274d"
//     }
// }'