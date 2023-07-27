const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const certificatePath = path.resolve(__dirname, "server.pem"); // Path to the combined private key and certificate

// Load the certificate and extract the public and private keys
const certificate = fs.readFileSync(certificatePath);
const publicKey = crypto.createPublicKey(certificate);
const privateKey = crypto.createPrivateKey(certificate);

function sign(data) {
	//sign the encrypted data
	const sign = crypto.createSign("SHA256");
	sign.update(JSON.stringify(data));
	sign.end();
	const signature = sign.sign(privateKey, "base64");
	const created = new Date().getTime();
	console.log("Signature created at --->", created);
	const exprires = new Date(created).getTime() + 1 * 60 * 60 * 1000; // 1 hour
	console.log("Signature expires at --->", exprires);
	const signatureProviderId = "test-signature-provider";
	console.log("Signature provider ID --->", signatureProviderId);
	const signingAlgorithm = "SHA256";
	return {
		signature,
		created,
		exprires,
		signatureProviderId,
		signingAlgorithm,
	};
}

function verify(data, authHeader) {
	//extract expiry from the Authorization header
	const expires = authHeader.split(" ")[5].split("=")[1];
	console.log("Expires from Authorization Header ---> ", expires);
	if (new Date().getTime()> expires) {
		console.log("Signature has expired");
		return false;
	}
	//extract the signature from the Authorization header
	const signature = authHeader.split(" ")[2].split("=")[1];
	console.log("Signature from Authorization Header ---> ", signature);
	//verify the signature
	const verify = crypto.createVerify("SHA256");
	verify.update(JSON.stringify(data));
	verify.end();
	const isSignatureValid = verify.verify(publicKey, signature, "base64");
	return isSignatureValid;
}

module.exports = {
	sign,
	verify,
};
