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
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute(
            'SELECT thread_id, thread_name FROM thread  ORDER BY RAND()'
            );
            const thread = JSON.stringify(rows);
            // コネクションを閉じる
            conn.end();
            context.log(thread);
            context.log('thread.jsonにthreadテーブルのデータを出力しました。');
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: thread
            };
        };
