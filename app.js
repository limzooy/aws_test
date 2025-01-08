const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 80;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: '127.0.0.1', // EC2에서는 내부 IP 사용
  user: 'root',      // MySQL 사용자 이름
  password: 'root',  // MySQL 비밀번호
  database: 'stock'  // 데이터베이스 이름
});

// MySQL 연결 확인
db.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패:', err.message);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, AWS EC2! Node.js 서버가 MySQL과 연결되었습니다.');
});

// 주식 데이터 조회 라우트
app.get('/stocks', (req, res) => {
  const query = 'SELECT * FROM stock_data ORDER BY timestamp DESC LIMIT 50';

  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err.message);
      return res.status(500).json({ error: '데이터를 불러오지 못했습니다.' });
    }
    res.json(results);
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
