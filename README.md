# playwright-sandbox
クロスブラウザで描画に差がないか確認するやつ

```bash
$ yarn ts-node src/app.ts
url https://google.com
0.46: images/google.com-chromium.png - images/google.com-firefox.png
0.91: images/google.com-chromium.png - images/google.com-webkit.png
1.2: images/google.com-firefox.png - images/google.com-webkit.png
```