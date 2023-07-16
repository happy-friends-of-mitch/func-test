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
        // threadテーブルからthread_idとthread_nameをJSONファイルとして出力
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute(
            'SELECT thread_id, thread_name FROM thread  ORDER BY thread_id'
            );
            const thread = JSON.stringify(rows);
            context.log(thread);
            context.log('thread.jsonにthreadテーブルのデータを出力しました。');
        //megaテーブルからimg_url,reply_id,thread_id,threadテーブルからthread_nameをJSONファイルとして出力
        const [rows2, fields2] = await conn.execute(
            'SELECT mega.img_url, mega.reply_id, mega.thread_id, thread.thread_name FROM mega INNER JOIN thread ON mega.thread_id = thread.thread_id ORDER BY id DESC'
        // 'SELECT mega.img_url, mega.reply_id, mega.thread_id, thread.thread_name FROM mega INNER JOIN thread ON mega.thread_id = thread.thread_id'
        );
        const mega = JSON.stringify(rows2);
        context.log('mega.jsonにmegaテーブルのデータを出力しました。');  
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: mega
        };
    }
