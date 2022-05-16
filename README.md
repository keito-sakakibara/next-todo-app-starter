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
