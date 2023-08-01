const crypto = require("crypto");

// Create a digest of the data passed in
// Sample input: { "name": "John Doe", "age": 30 }
// Sample output: { "digest": "b45cffe084dd3d20d928bee85e7b0f21" }
function createDigest(data, digestAlgorithm, digestEncoding) {
	// Create a digest of the data
	const hash = crypto
		.createHash(digestAlgorithm)
		.update(JSON.stringify(data))
		.digest(digestEncoding);

	// Return the digest as the response
	return { digest: hash };
}

module.exports = {
	createDigest,
};
