const express = require('express');
const redis = require('redis');
const mysql = require('mysql2');
const util = require('util');

const app = express();

// MySQL bağlantısı
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0671',
  database: 'blog_db'
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
  } else {
    console.log('MySQL veritabanına bağlandı!');
  }
});

// MySQL sorgularını promisify etme
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

// Redis istemcisi oluşturma
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379
});

// Redis istemcisinin bağlantı ve hata olaylarını dinleme
redisClient.on('connect', () => {
  console.log('Redis istemcisi bağlandı!');
});

redisClient.on('error', (err) => {
  console.error('Redis İstemcisi Hatası:', err);
});

// Blog verisi alma endpoint'i
app.get('/blogs/:blog_id', async (req, res) => {
  try {
    const { blog_id } = req.params;

    // 1. Redis'ten veri okuma
    redisClient.get(`blogs:${blog_id}`, async (err, blogData) => {
      if (err) {
        console.error('Redis Hatası:', err);
        throw err;
      }

      if (blogData) {
        console.log('Veri Redis\'ten:', blogData);
        res.json(JSON.parse(blogData)); 
        return; // Veri Redis'te bulunursa çık
      }

      // 2. Redis'te yoksa, MySQL'den sorgula
      const result = await query('SELECT * FROM blogs WHERE blog_id = ?', [blog_id]);

      if (result.length === 0) {
        res.status(404).send('Blog yazısı bulunamadı');
        return;
      }

      const blog = result[0];

      // 3. Veriyi Redis'e kaydet
      redisClient.set(`blogs:${blog_id}`, JSON.stringify(blog), (err) => {
        if (err) {
          console.error('Redis Hatası:', err);
          throw err;
        }
        console.log('Veri Redis\'e kaydedildi.');
      });

      res.json(blog);
    });
  } catch (err) {
    console.error('Sunucu Hatası:', err);
    res.status(500).send('Sunucu hatası');
  }
});

// Sunucuyu dinleme
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Uygulama kapatıldığında Redis istemcisini kapat
process.on('SIGINT', () => {
  console.log('Uygulama kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
    mysqlConnection.end();
    redisClient.quit(() => {
      console.log('Redis istemcisi kapatıldı');
      process.exit(0);
    });
  });
});
