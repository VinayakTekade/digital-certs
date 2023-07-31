const crypto = require("crypto");

const uuid = require("uuid");

function sign(data, signatureProviderId, signingAlgorithm, signatureEncoding) {
	//sign the encrypted data
	const sign = crypto.createSign(signingAlgorithm);
	sign.update(JSON.stringify(data));
	sign.end();
	const signature = sign.sign(process.env.PRIVATE_KEY, signatureEncoding);
	//Generate unique ID for each signature using UUID
	const keyId = uuid.v4();
	//Set the time at which the signature was created
	const created = new Date().getTime();
	//Set the expiry time for the signature
	const exprires = new Date(created).getTime() + 1 * 60 * 60 * 1000; // 1 hour

	return {
		signature,
		created,
		keyId,
		exprires,
		signatureProviderId,
		signingAlgorithm,
		signatureEncoding,
	};
}

function verify(data, authHeader) {
	//extract expiry from the Authorization header and check if the signature has expired
	const expires = authHeader.split(" ")[6].split("=")[1];
	if (new Date().getTime() > expires) {
		console.log("Signature has expired");
		return false;
	}
	//extract the signature from the Authorization header
	const signature = authHeader.split(" ")[2].split("=")[1];

	//extract the signing algorithm from the Authorization header
	const signingAlgorithm = authHeader.split(" ")[4].split("=")[1];

	//extract the signature encoding from the Authorization header
	const signatureEncoding = authHeader.split(" ")[3].split("=")[1];

	//verify the signature
	const verify = crypto.createVerify(signingAlgorithm);
	verify.update(JSON.stringify(data));
	verify.end();
	const isSignatureValid = verify.verify(
		process.env.PUBLIC_KEY,
		signature,
		signatureEncoding
	);
	return isSignatureValid;
}

module.exports = {
	sign,
	verify,
};
