const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// publicフォルダを静的ファイルとして配信
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
