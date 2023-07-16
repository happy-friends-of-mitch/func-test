import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && (req.body.image && req.body.fileType && req.body.replay_id && req.body.thread_id)) {
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