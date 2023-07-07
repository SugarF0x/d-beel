aws --profile yandex \
  s3 --endpoint-url=https://storage.yandexcloud.net \
  cp --recursive ./.output/public s3://d-beel.sugar-fox.ru
