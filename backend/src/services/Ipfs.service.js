//Class for ipfs sending
import { create } from "ipfs-http-client";

const ipfs = create("https://ipfs.infura.io:5001");

class IPFSSerice {
    async ipfsUpload(imageJSON) {
        const files = [{
            path: "/",
            content: JSON.stringify(imageJSON),
        },];

        const result = await ipfs.addAll(files);

        for await (const item of result) {
            return item;
        }
    }
}

export default new IPFSSerice();
