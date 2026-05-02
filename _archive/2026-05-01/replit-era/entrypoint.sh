#!/bin/sh
set -e

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "ERROR: TELEGRAM_BOT_TOKEN environment variable is not set" >&2
  exit 1
fi

mkdir -p /root/.clawdbot
cat > /root/.clawdbot/clawdbot.json <<EOF
{
  "telegram": {
    "bot_username": "@ArchieOS_Bot",
    "botToken": "${TELEGRAM_BOT_TOKEN}"
  }
}
EOF

exec clawdbot "$@"
