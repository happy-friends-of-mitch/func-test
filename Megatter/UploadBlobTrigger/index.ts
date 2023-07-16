import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from "@azure/storage-blob";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger function processed a request.');

    // if (req.query.fileType || ((req.body && req.body.image) || req.body.fileType)) {
    if (req.body && req.body.image) {

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        // どのコンテナを使うかを決める
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // ファイル名を決める
        const blobName:string = 'image-' + Date.now().toString() + ".jpeg";
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Base64エンコードされたデータを取得する
        const data = req.body.image;
        if (data) {
            console.log("data is not null");
        }
        
        // Base64エンコードされたデータをblobにアップロードする
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