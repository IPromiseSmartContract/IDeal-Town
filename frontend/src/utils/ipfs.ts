import * as IPFS from 'ipfs-core'

/**
 * If you change the create() config , you may see this error message: 
 * Error uploading file: Error: no valid addresses were provided for transports [@libp2p/webrtc-star, @libp2p/websockets, libp2p/circuit-relay-v1]
 * The solution is in this link: https://github.com/ipfs/js-ipfs/issues/2779 
*/
const node = await IPFS.create()

/**
 * Get the data from the IPFS hash
 * @param text the hash of the data you want to get
 * @returns A promise that resolves with the data you got from the IPFS
 */
const getDataFromIPFS = async (text: string): Promise<string> => {
    const stream = node.cat(text)
    const decoder = new TextDecoder()
    let data = ''

    for await (const chunk of stream) {
        // chunks of data are returned as a Uint8Array, convert it back to a string
        data += decoder.decode(chunk, { stream: true })
    };
    return Promise.resolve(data);
}
/**
 * Uploads the given text content to IPFS.
 * @param text The text content to upload.
 * @returns A Promise that resolves with the `URL` of the uploaded content.
 */
const uploadToIPFS = async (text: string): Promise<string> => {
    const result = node.add(text)
    const hash = (await result).cid.toString()
    console.log("hash:", hash)
    const url = 'https://ipfs.io/ipfs/' + hash
    console.log("url:", url)

    const proposal = (await getDataFromIPFS(hash)).toString()
    console.log("proposal:", proposal)

    return Promise.resolve(url);
};



export { uploadToIPFS };
