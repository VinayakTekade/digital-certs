const crypto = require("crypto");

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
