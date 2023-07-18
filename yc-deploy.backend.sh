rollup -c

source ./.env.cloud

(cd ./.output/temp/server-to-zip && zip -r -X "../server.zip" .)

yc serverless function version create \
  --function-name="$CLOUD_FUNCTION_NAME" \
  --runtime nodejs16 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 3s \
  --source-path ./.output/temp/server.zip \
  --environment=`paste -s -d, .env.prod`

rm -rf ./.output/temp
