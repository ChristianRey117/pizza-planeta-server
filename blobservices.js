const _blobService = require('@azure/storage-blob');

const blobService = _blobService.BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=cs710032000dda411cc;AccountKey=oEfje6qvbAHRKBZIg5r9r7NtyUW4DIaCWgOn5tMCnW7BHhKjX5aBSa5PzHQDSeFAZhp+D3FADf4D+ASt0ToVVA==;EndpointSuffix=core.windows.net")
const containerClient = blobService.getContainerClient("pizza-planeta");


const updloadImage = async (blobName, buffer)=>{
    await containerClient.getBlockBlobClient(blobName).uploadData(buffer);
    console.log('imagen subida--->', blobName);
}

const deleteImage = async (blobName) =>{
    const response = await containerClient.getBlockBlobClient(blobName).deleteIfExists();
    console.log(response);
}


module.exports = {updloadImage, deleteImage}