source ./env/.env.cloud

aws --profile yandex \
  s3 --endpoint-url=https://storage.yandexcloud.net \
  sync --size-only --delete ./.output/public s3://"$S3_BUCKET_ID"

aws --profile yandex \
  s3 --endpoint-url=https://storage.yandexcloud.net \
  cp ./.output/public/index.html s3://"$S3_BUCKET_ID"
