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
	return signature;
}

function verify(data, signature) {
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
