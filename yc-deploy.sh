(cd ./.output/server && zip -r -X "../server.zip" .)

yc serverless function version create \
  --function-name=d-beel-api \
  --runtime nodejs16 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 3s \
  --source-path ./.output/server.zip \
  --environment=`paste -s -d, .env.prod`

aws --profile yandex \
  s3 --endpoint-url=https://storage.yandexcloud.net \
  cp --recursive ./.output/public s3://d-beel.sugar-fox.ru
