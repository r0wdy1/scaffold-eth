export async function pinJSONToIPFS(data) {
    const axios = require('axios')
    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + process.env.REACT_APP_PINATA_JWT
        },
        data : data
    };
    const res = await axios(config);
    return "https://ipfs.io/ipfs/" + res.data.IpfsHash; // TODO: make gate configurable
}