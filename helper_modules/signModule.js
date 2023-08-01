const crypto = require("crypto");
const uuid = require("uuid");

//Sign the data passed in using RSA-SHA256 algorithm
//Sample input: { "name": "John Doe", "age": 30 }
//Sample output:
// {
// 	signature: 'NDnIHyO0Q0CJtDB9TZSanJb7hhlXNmAjliadA6pkBVqYrAEMTmslj+2iVMAc7dBqvgcege0wkzyNxvgRUmz0tPJIMcLDId4G7RozSNdwFC5+hMjwPK93yulDW8Nyvn4uN+UsC6hN/Ayi0UHMLqDcRoDmzzrQw9RlxAHykuPieq9fFOPbSbeAh+N9/S+1HQZd37WbKejgIhjS5vRkj7+jlmhumPE/eMIa/DKwPA2zhjwxKd7XF1kZ7NWbI+A79tT+YCGAr1LbeOedMh36x2VDBrRp1+vjWUo2G5MHnWDHJMwiC0j/4WxATC0GJiCI8JxtZEwKmF1OKLlLsksYOm7POQ==',
// 	created: 1690865583303,
// 	keyId: 'e832fcf0-5b76-4a19-8f6e-15b4165875ca',
// 	exprires: 1690869183303,
// 	signatureProviderId: 'test-signature-provider',
// 	signingAlgorithm: 'SHA256',
// 	signatureEncoding: 'base64'
//   }
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

	console.log(data);
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
