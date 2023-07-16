import { AzureFunction, Context, HttpRequest } from "@azure/functions"

interface bodyInfo {
    body: {
        base64 :string;
        fileType: string;
        thread_id: number;
        reply_id: number; 
    }
}

const httpTrigger: AzureFunction = async function (context: Context, req: bodyInfo): Promise<void> {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);

    if (req.body && (req.body.base64 && req.body.fileType && (typeof req.body.reply_id)=="number" && req.body.thread_id)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "All True!!"
        };
    }
    else {
        context.res = {
            status: 400,
            body: "パラメータが上手くわたっていません"
        };
    }

};

export default httpTrigger;