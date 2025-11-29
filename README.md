# BIモバイルツール（Next.js）

営業/CS/マネージャー向けのモバイルBIビュー（モック実装中）。

## 開発起動
```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3010
```

## トンネル（リモート確認）
- Cloudflare Quick Tunnel  
  ```bash
  cloudflared tunnel --url http://127.0.0.1:3010 --no-autoupdate --protocol http2 --edge-ip-version auto
  ```  
  `/tmp/cloudflared-3010.log` にURLが出力。終了は `pkill -f cloudflared`。  
- 直近URL（毎回変わるので要更新）：`https://wise-reward-steady-feels.trycloudflare.com`

## 主要ルート
- `/login`：メール＋ワンタイムコード（モック）。コードは常に `123456`。成功で `/tools` へ。
- `/tools`：ハブ。ダッシュボード/アドホック/運用/設定へ。
- `/`：ダッシュボード。期間/セグメント切替、共有リンク発行（モック）、クイックアクション、インサイト。
- `/adhoc`：期間・ディメンション切替のモック集計。
- `/ops` `/settings`：プレースホルダ。

## モックAPI
- `/api/dashboard`：`?period=7|30|90` `?segment=all|mobile|desktop`
- `/api/adhoc`：`?period=7|30|90` `?dimension=channel|device|region`
- `/api/stocks`：`?symbol=AAPL|MSFT|GOOG|SPY`
- `/api/auth/mock`：モック認証
- `/api/share`：共有リンクダミー発行

## 開発メモ
- ローカル「最近使った」を `localStorage` に保存（ハブで利用予定）。
- 共有/通知はモック。実装時はエンドポイントを差し替える。
