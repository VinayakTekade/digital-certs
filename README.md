# Node.js Encryption Middleware Example

This repository contains an example Node.js application showcasing the implementation of a middleware for encrypting and decrypting HTTPS request payloads in JSON format. The middleware uses the Advanced Encryption Standard (AES) with the Cipher Block Chaining (CBC) mode for encryption and decryption.

## Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/VinayakTekade/digital-certs.git
```

2. Navigate to the project directory:

```
cd digital-certs.git
```

3. Install the required Node.js packages:

```
npm install
```
# Generate Self-Signed Certificates:

To enhance the security of the encryption and decryption process, we can use digital certificates in the encryptionMiddleware.js file. Digital certificates enable us to establish a secure communication channel between the client and the server, ensuring confidentiality and authenticity of the data.

In this example, we'll use self-signed digital certificates for simplicity. In a production environment, you should obtain valid certificates from a trusted Certificate Authority (CA). For this example, we'll generate self-signed certificates using OpenSSL.

1. Generate a private key

```
openssl genpkey -algorithm RSA -out privatekey.pem
```

2. Generate a certificate signing request (CSR)

```
openssl req -new -key privatekey.pem -out csr.pem
```

3. Generate a self-signed certificate valid for 1 year

```
openssl x509 -req -days 365 -in csr.pem -signkey privatekey.pem -out certificate.pem
```

4. Combine the private key and certificate into a single file (required by Node.js)

```
cat privatekey.pem certificate.pem > server.pem
```

5. Remove the intermediate files

```
rm privatekey.pem certificate.pem csr.pem
```

# Environment Variables
Go to utils directory and run keygen.js to get public key, private key and secret key. You can copy these values in to environment variables. The environment variables are defined in the following way
```
SECRET_KEY=<YOUR_ENCRYPTION_SECRET_KEY_GOES_HERE>
PUBLIC_KEY=<YOUR_SIGNING_PUBLIC_KEY_GOES_HERE>
PRIVATE_KEY=<YOUR_SIGNING_PRIVATE_KEY_GOES_HERE>
SIGNATURE_PROVIDER_ID=<YOUR_YOUR_SIGNATURE_PROVIDER_ID_GOES_HERE>
```
## Usage

The example application provides two API endpoints:

### Encrypt API:

-   URL: POST /encrypt
-   Description: Accepts a JSON payload and encrypts it using AES encryption and signs it.
-   Example usage with curl:

```
curl --location 'http://localhost:3000/encrypt' --header 'Content-Type: application/json' --data '{ "name": "John Doe", "age": 30 }'
```

### Decrypt API

-   URL: POST /decrypt
-   Description: Accepts the encrypted data and decrypts it using AES decryption and verifies it signature.
-   Example usage with curl:

```
curl --location 'http://localhost:4000/decrypt' \
--header 'Content-Type: application/json' \
--header 'Authorization: Signature signatureProviderId=test-signature-provider signature=IB5Y1LPAhlUttPVCZIIjQ5432SzWobO0ofqXwJxEpD9BS7nM7hvNxDBYnGd0Qv+bUH9Pe5WUh4aJVfhix9OS+TYfOoLuQij5EzsiqE1rBfkuF9GQWooRri6l2QfWhsiVTb9Rh841LXbWKpQIuv2RwRDeTUlSqEQKsSGzBKHbFGBD6JZk4TIklSWTLsJqtDnx5kb0wKipl3+kDyyINS9d68f8/mXyGTHP7Gc6ISwOVYLTJlFucvWiaQKquYyy/AG5ROGATLKTv5JXxz/viqFDZG0KZyQjUEgYklILRwO1UtYNK3a7j62sy6frXtVxCFuIfv4j+/9S/PJUwgrQ1a69tQ== signatureAlgorithm=SHA256 created=1690449311783 expires=1690452911783' \
--data '{
    "data": {
        "iv": "253d95d839050346d35f755cf4f6c5c1",
        "encryptedData": "e17d82335e67bce4e3bbc48699821d041d361c9b1de5631eac513a7fb9c829d4"
    }
}'
```


# Contributing

Contributions to this example project are welcome. Feel free to open issues or pull requests if you find any bugs or have suggestions for improvements.

# License

This example is open-source and available under the [MIT License](/LICENSE). You are free to use, modify, and distribute the code as per the terms of the license.
