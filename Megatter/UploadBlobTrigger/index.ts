import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ContainerClient, HttpRequestBody } from "@azure/storage-blob";

const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require('@azure/identity');  
const { v1: uuidv1 } = require("uuid");
// require("dotenv").config();


// blobにbase64の画像データをアップロードする
async function uploadBlob(value:HttpRequestBody) {
  try {
    console.log("Azure Blob storage v12 - JavaScript quickstart sample");
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
    
    if (!accountName) throw Error('Azure Storage accountName not found');

    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw Error('Azure Storage Connection string not found');
    }
    if (!AZURE_STORAGE_CONTAINER_NAME) {
      throw Error('Azure Storage Container name not found');
    }

    // Create the BlobServiceClient object with connection string
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
  
    const containerName:String = AZURE_STORAGE_CONTAINER_NAME;  
  
    console.log('\nCreating container...');
    console.log('\t', containerName);
  
    // コンテナへの参照を取得する。
    const containerClient:ContainerClient = blobServiceClient.getContainerClient(containerName);

    // blobのコンテナをアップロード
    // Create a unique name for the blob
    const blobName:string = uuidv1() + ".jpeg";
  
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
    // Display blob name and url
    console.log(
      `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    );
  
    // Upload data to the blob
    const data = value;
    // const uploadBlobResponse = await blockBlobClient.uploadData(data, {
    //     blobHTTPHeaders: { blobContentType: 'image/jpeg' },
    //   });
    // console.log(
    //   `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    // );
  } catch (err: any) {
    console.log(`Error: ${err.message}`);
  }
}



const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const imgValue:HttpRequestBody = (req.query.img || (req.body && req.body.img));
    
    uploadBlob(imgValue)
    .then(() => console.log('done'))
    .catch((ex) => console.log(ex.message));
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "success"
    };

};

export default httpTrigger;