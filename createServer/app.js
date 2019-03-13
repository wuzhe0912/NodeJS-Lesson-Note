// 載入 http 模組(該模組為 node 預設)
let http = require('http');

// 開啟一個 web server
// request => 用於使用者讀取到網站時，接收到相關資料
// response => 收到資料時，回傳給使用者
http.createServer((request, response) => {
  // 200 指資料回傳成功
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.write('Hello Pitt');
  response.end()
}).listen(8080);
// .listen => 開啟一個監聽的 port