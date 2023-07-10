source ./.env.cloud

yc serverless api-gateway update --id "$API_GATEWAY_ID" --spec=yc.api-gateway.yaml
