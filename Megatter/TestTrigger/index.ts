import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from "@azure/storage-blob";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger function processed a request.');

    // if (req.query.fileType || ((req.body && req.body.image) || req.body.fileType)) {
    if (req.body && req.body.image) {

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // const fileType:string =  "."+req.query.fileType;
        // const fileType:string =  ".jpeg";
        const blobName:string = 'image-' + Date.now().toString() + ".jpeg";
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // const fs = require('fs');

        // // Base64エンコードされたデータを取得する
        // const filePath = './TestTrigger/b64.txt';

        // // ファイルを非同期で読み込む
        // fs.readFile(filePath, 'utf8', async (err, data) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     const base64Data = data;
        //     console.log(base64Data);
        //     // Base64エンコードされたデータを取得する
        //     const imageData = Buffer.from(base64Data, 'base64');
        //     await blockBlobClient.upload(imageData, imageData.length);
        //     context.res = {
        //         // status: 200, /* Defaults to 200 */
        //         body: "Image uploaded"
        //     };
        // });
        // Base64エンコードされたデータを取得する
        // const imageData = Buffer.from(req.body.image, 'base64');
        const data = req.body.image;
        if (data) {
            console.log("data is not null");
        }
        const imageData = Buffer.from(data, 'base64');
        await blockBlobClient.upload(imageData, imageData.length);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Image uploaded"
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an image in the request body"
        };
    }

};

export default httpTrigger;