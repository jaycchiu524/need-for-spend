#!/bin/sh

echo -n "Running database migrations"
for i in {1..5}
do
  sleep 1
  echo -n "."
done
echo ""

if [ "$1" = "dev" ]; then
  yarn workspace server prisma migrate dev
else
  yarn workspace server prisma migrate deploy
fi

# Hand off to the CMD
# cf https://stackoverflow.com/questions/42857897/execute-a-script-before-cmd
exec "$@"
