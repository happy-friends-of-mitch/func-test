import * as fs from 'fs';
import * as mysql from 'mysql2/promise';
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from "@azure/storage-blob";

interface MegaInfo {
    img_url :string;
    thread_id: number;
    reply_id: number; 
  }
async function registerMega(MegaInfo: MegaInfo): Promise<void> {
  try {
    const config = {
      host: process.env["MYSQL_HOST"],
      user: process.env["MYSQL_USER"],
      password: process.env["MYSQL_PASSWORD"],
      database: process.env["MYSQL_DB"],
      port: 3306,
      ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") }
    };
   
    console.log("img_upload")
    const conn = await mysql.createConnection(config);
    const [rows, fields] = await conn.execute(
      'INSERT INTO mega ( img_url,reply_id,thread_id) VALUES ( ?, ?, ?)',
      [ MegaInfo.img_url,MegaInfo.reply_id,MegaInfo.thread_id]
    );

    console.log('megaテーブルにデータを登録しました。');
  } catch (error) {
    // エラーが発生した場合の処理
    console.log('データベースへの登録中にエラーが発生しました:', error.message);
    throw error; // エラーを再スローして呼び出し元に伝える
  }
}

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    // どのコンテナを使うかを決める
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const fileType:string = req.body.fileType;
    // ファイル名を決める
    const blobName:string = 'image-' + Date.now().toString() + "."+fileType;
    // const blobName:string = 'image-' + Date.now().toString() + ".jpeg";
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Base64エンコードされたデータを取得する
    const data:string = req.body.base64;
    if (data) {
        console.log("data is not null");
    }
    
    // Base64エンコードされたデータをblobにアップロードする
    const imageData = Buffer.from(data, 'base64');
    await blockBlobClient.upload(imageData, imageData.length);
    // thread_idとthread_nameをリクエストボディから取得
    const img_url: string = blobName;
    const reply_id: number = Number(req.body.reply_id);
    const thread_id: number = Number(req.body.thread_id);
    // const img_url: string = blobName;
    // const reply_id: number = 1;
    // const thread_id: number = 1;

    // megaのテーブルにスレッド情報を登録
    const megaInfo: MegaInfo = { img_url,reply_id , thread_id};
    await registerMega(megaInfo);

    // 入力完了を出力
    console.log('入力が完了しました。');
    context.res = {
      status: 200,
      body: "Image&table uploaded"
    };
  } catch (error) {
    // ハンドルされていないエラーをキャッチしてログに出力
    console.log('エラーが発生しました:', error.message);
    context.res = {
      status: 500,
      body: "Internal Server Error"
    };
  }
};
