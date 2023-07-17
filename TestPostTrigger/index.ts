import * as fs from 'fs';
import * as mysql from 'mysql2/promise';

interface ThreadInfo {
  thread_name: string;
}

async function registerThread(threadInfo: ThreadInfo): Promise<void> {
    try {
        const config = {
            host: process.env["MYSQL_HOST"],
            user: process.env["MYSQL_USER"],
            password: process.env["MYSQL_PASSWORD"],
            database: process.env["MYSQL_DB"],
            port: 3306,
            ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") }
        };

        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute(
            'INSERT INTO thread ( thread_name) VALUES (?)',
            [threadInfo.thread_name]
        );
        // コネクションを閉じる
        conn.end();

        console.log('threadテーブルにデータを登録しました。');
    } catch (error) {
        // エラーが発生した場合の処理
        console.log('データベースへの登録中にエラーが発生しました:', error.message);
        throw error; // エラーを再スローして呼び出し元に伝える
    }
}

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  try {
    // thread_idとthread_nameをリクエストボディから取得
    const thread_name: string = req.body.thread_name;

    // threadのテーブルにスレッド情報を登録
    const threadInfo: ThreadInfo = {  thread_name };
    await registerThread(threadInfo);

    // 入力完了を出力
    context.log('入力が完了しました。');
    context.res = {
      status: 200,
      body: "ok"
    };
  } catch (error) {
    // ハンドルされていないエラーをキャッチしてログに出力
    context.log('エラーが発生しました:', error.message);
    context.res = {
      status: 500,
      body: "Internal Server Error"
    };
  }
};
