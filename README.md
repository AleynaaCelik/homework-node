# homework-node

![homework](https://github.com/AleynaaCelik/homework-node/assets/77541289/cd45471c-dfad-46ea-9a53-ef437bba4243)

Ödevim bazı adımları içermektedir bunlar ;

1. MySQL Veritabanı Bağlantısı:

mysqlConnection = mysql.createConnection({...}): Bu satır, mysql modülünü kullanarak MySQL veritabanına bir bağlantı kurar. Bağlantı kurmak için sağlanan bağlantı parametreleri (host, kullanıcı, parola, veritabanı) kullanılır.


2. MySQL Sorgusunun Promise'a Dönüştürülmesi:

query = util.promisify(mysqlConnection.query).bind(mysqlConnection): Bu satır, asenkron mysqlConnection.query() yöntemini util.promisify() kullanarak promise tabanlı bir işlev haline getirir. Bu, asenkron veritabanı işlemlerini ele almayı kolaylaştırır.


3. Redis İstemcisi Oluşturma:

redisClient = redis.createClient({...}): Bu satır, redis modülünü kullanarak Redis önbelleğine bir bağlantı oluşturur. Bağlantı kurmak için sağlanan bağlantı parametreleri (host, port) kullanılır.


4. Redis Bağlantı Olay İşleme:

redisClient.on('connect', () => {...}): Bu olay dinleyici, Redis bağlantısı başarıyla kurulduğunda tetiklenir. Bağlantının aktif olduğunu gösteren bir mesajı kaydeder.

redisClient.on('error', (err) => {...}): Bu olay dinleyici, Redis bağlantısıyla ilgili bir hata oluştuğunda tetiklenir. Hata mesajını konsola kaydeder.

5. Blog Yazısı Veri Alma Uç Noktası:

app.get('/blog/:blog_id', async (req, res) => {...}): Bu rota işleyicisi, blog yazısı verilerini almak için GET isteklerini işleyen bir uç nokta (/blog/:blog_id) tanımlar. :blog_id parametresi, alınacak blog yazısının kimliğini yakalar.


6. Verileri Redis'ten Alma:

const blogData = await redisClient.get(blog:${blog_id});: Bu satır, blog verilerini blog:${blog_id} anahtarı kullanarak Redis önbelleğinden almaya çalışır. Veriler Redis'te bulunursa, JSON formatından ayrıştırılır ve res.json() kullanarak JSON yanıtı olarak gönderilir.


7. Veriler Redis'te Bulunmazsa MySQL'den Alma:

if (!blogData) { ... }: Blog verileri Redis'te bulunmazsa bu kod bloğu yürütülür. Blog verilerini query() işlevini kullanarak MySQL veritabanından alır. Blog yazısı veritabanında bulunmazsa 404 "Bulunamadı" hatası gönderilir.
