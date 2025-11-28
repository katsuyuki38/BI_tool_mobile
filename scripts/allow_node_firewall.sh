#!/bin/bash
set -euo pipefail

FIREWALL_BIN="/usr/libexec/ApplicationFirewall/socketfilterfw"
NODE_BIN="${NODE_BIN:-/opt/homebrew/bin/node}"

echo "[info] Allowing Node.js binary in macOS firewall"
echo "       Node binary: ${NODE_BIN}"

sudo "$FIREWALL_BIN" --add "$NODE_BIN"
sudo "$FIREWALL_BIN" --unblockapp "$NODE_BIN"

# Optional: disable stealth mode to allow inbound discovery on LAN
sudo "$FIREWALL_BIN" --setstealthmode off

# Uncomment the following line only if一時的にファイアウォールをOFFにして疎通確認したい場合
# sudo "$FIREWALL_BIN" --setglobalstate off

echo "[info] Current firewall state"
sudo "$FIREWALL_BIN" --getglobalstate
sudo "$FIREWALL_BIN" --listapps

echo "[done] Firewall rule updated. If疎通しない場合はVPNの「ローカルネットワークを許可」をONにしてください。"
