## 開発環境
- Docker
- yarn

## バックエンドの開発環境セットアップ
```
cd backend
```

初期化
```
make init
```

コンテナ起動後、curlでレスポンスが帰って来ることを確認
```
docker-compose up -d

curl --request GET \
  --url http://localhost:8888/healthz
```

## フロントエンドの開発環境セットアップ
```
cd frontend
```

初期化
```
yarn
```

起動後、`http://localhost:3333`にアクセスしてHello Next.jsが表示されていればOK
```
yarn dev
```

## APIの仕様
`backend/openapi.json`に記載

またサーバー起動後、下記curlでOpenAPIを取得可能
```
curl --request GET \
  --url http://localhost:8888/api/swagger/json \
  --header 'x-hasura-admin-secret: secret'
```

リクエスト時には`x-hasura-admin-secret`ヘッダーに`secret`指定する必要がある
