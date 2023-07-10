source ./.env.cloud

(cd ./.output/server && zip -r -X "../server.zip" .)

yc serverless function version create \
  --function-name="$CLOUD_FUNCTION_NAME" \
  --runtime nodejs16 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 3s \
  --source-path ./.output/server.zip \
  --environment=`paste -s -d, .env.prod`
