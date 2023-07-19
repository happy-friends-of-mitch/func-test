# Megatterのバックエンド
## 環境
```
npm i
```

```local.settings.json
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "",
    "MYSQL_HOST":"",
    "MYSQL_USER":"",
    "MYSQL_PASSWORD":"",
    "MYSQL_DB":"",
    "languageWorkers__node__arguments": "",
    "AZURE_STORAGE_ACCOUNT_NAME": "",
    "AZURE_STORAGE_CONNECTION_STRING":"",
    "AZURE_STORAGE_CONTAINER_NAME": ""
  }
```
上記の環境変数を設定

## debug
Postmanを使用

Gettriger
http://localhost:7071/api/GetTrigger?thread_id=
