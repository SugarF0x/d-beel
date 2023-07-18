VAR_VALUE=$(yc iam create-token)

cat .env.local | sed 's/\(YDB_ACCESS_TOKEN_CREDENTIALS=\)\(.*\)/\1'"$VAR_VALUE"'/' > .env.local.updated
rm .env.local
mv .env.local.updated .env.local
