module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

        const mysql = require('mysql2/promise');
        const fs = require('fs');
        const exsist = fs.existsSync("DigiCertGlobalRootCA.crt.pem")
        context.log(exsist)
        context.log(process.env["MYSQL_HOST"])
        var config =
        {
            host: process.env["MYSQL_HOST"],
            user: process.env["MYSQL_USER"],
            password: process.env["MYSQL_PASSWORD"],
            database: process.env["MYSQL_DB"],
            port: 3306,
            ssl: {ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
        };
        // frontからリクエストがthread_idの飛んできたらそのthread_idのmegaテーブルからimg_url,reply_id,thread_id,threadテーブルからthread_nameをJSONファイルとして出力
        if (req.query.thread_id || (req.body && req.body.thread_id)) {
            const thread_id = (req.query.thread_id || req.body.thread_id);
            context.log(thread_id);
            const conn = await mysql.createConnection(config);
            const [rows, fields] = await conn.execute(
                'SELECT thread_id, thread_name FROM thread WHERE thread_id = ? ORDER BY thread_id',
                [thread_id]
                );
                const thread = JSON.stringify(rows);
                context.log(thread);
                context.log('thread.jsonにthreadテーブルのデータを出力しました。');
        // threadテーブルからthread_idとthread_nameをJSONファイルとして出力
        const conn2 = await mysql.createConnection(config);
        const [rows2, fields2] = await conn.execute(
            'SELECT thread_id, thread_name FROM thread ORDER BY thread_id'
            );
            const thread2 = JSON.stringify(rows);
            context.log(thread);
            context.log('thread.jsonにthreadテーブルのデータを出力しました。');
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: thread2
        };
        }
        //例外処理を書いてください
        else {
            context.log('thread_idがありません。');
            context.res = {
                status: 500,
                body: "thread_idがありません。"
            };
        }
    }