/**
 * Uploads the given text content to IPFS.
 * @param text The text content to upload.
 * @returns A Promise that resolves with the `URL` of the uploaded content.
 */
const uploadToIPFS = (text: string, files?: File[]): Promise<string> => {
    // TODO: Implementation details for uploading to IPFS go here @skyline9981
    console.log("README.md", text);
    files?.forEach(async file => {
        console.log(file.name, await file.text())
    });
    return Promise.resolve('https://example.com');
};



export { uploadToIPFS };
