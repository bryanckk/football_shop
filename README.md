##Tugas 3

Jawaban Pertanyaan:
1. Jelaskan mengapa kita memerlukan data delivery dalam pengimplementasian sebuah platform?
Jawab:
Kita memerlukan data delivery dalam pengimplementasi sebuah platform karena platform modern sebenarnya terdiri dari banyak komponen yang terpisah dan harus bisa saling berkomunikasi. Komponen tersebut bisa berupa tampilan depan (atau disebut front end) yang dilihat dan dipakai oleh user, logika di sisi server, aplikasi mobile, sampai layanan web. Data delivery berfungsi sebagai penghubung agar semua bagian ini bisa bertukar informasi secara real-time dengan format yang terstandarisasi. Selain itu, data delivery juga sangat penting untuk menghubungkan platform dengan layanan pihak ketiga, misalnya sistem pembayaran. Tanpa mekanisme pengiriman data yang baik, setiap komponen akan berjalan sendiri-sendiri dan platform tidak bisa bekerja sebagai satu kesatuan.

2. Menurutmu, mana yang lebih baik antara XML dan JSON? Mengapa JSON lebih populer dibandingkan XML?
Jawab:
Jujur sebenarnya awalnya saya tidak tahu apa itu XML dan JSON karena awalnya saya hanya ikutan plek ketiplek tutorial. Akan tetapi saya bersyukur karena adanya tugas ini saya jadi belajar secara actual. Setelah membaca-baca saya sendiri sepertinya lebih prefer JSON karena alasan yang akan dijelaskan dibawah ini. Selaras dengan itu, berikut adalah alasan JSON lebih populer dari XML:
- Struktur & Sintaks. XML berbasis tag seperti HTML. Verbose, panjang, dan lebih sulit dibaca manusia. Sementara itu, JSON berbasis objek/array. Ringkas, lebih natural untuk programmer.
- Kemudahan Parsing. XML perlu parser khusus (DOM, SAX, lxml, dll). Parsing lebih berat. Sementara JSON hampir semua bahasa pemrograman punya parser bawaan. Parsing lebih cepat dan ringan.
- Dukungan Data. XML bagus untuk data kompleks, mendukung atribut, namespaces, komentar, bahkan validasi dengan DTD/XSD. Sementara itu, JSON lebih sederhana, cukup untuk 90% kasus (objek, array, string, number, boolean, null).
- Ukuran File. XML lebih besar karena tag pembuka-penutup. Sementara itu, JSON lebih kecil sehingga lebih efisien untuk API/web.

3. Jelaskan fungsi dari method is_valid() pada form Django dan mengapa kita membutuhkan method tersebut?
Jawab:
Dalam django, method is_valid() pada sebuah form berfungsi untuk memeriksa apakah data yang dikirimkan melalui form memenuhi aturan validasi yang telah ditentukan. Ketika is_valid() dipanggil, django akan menjalankan proses validasi, seperti memastikan tipe data sesuai, field yang bersifat wajib tidak kosong, serta memeriksa validasi tambahan yang ditentukan oleh developer di method clean() atau clean_<field>(). Jika semua validasi terpenuhi, is_valid() akan mengembalikan nilai True dan data bersih (cleaned data) dapat diakses melalui atribut form.cleaned_data. Sebaliknya, jika ada kesalahan, ia akan mengembalikan False dan detail error dapat diakses melalui form.errors. Dengan demikian, is_valid() penting karena menjamin data yang diterima aplikasi aman, sesuai format, dan siap diproses lebih lanjut tanpa menimbulkan error atau inkonsistensi.

4. Mengapa kita membutuhkan csrf_token saat membuat form di Django? Apa yang dapat terjadi jika kita tidak menambahkan csrf_token pada form Django? Bagaimana hal tersebut dapat dimanfaatkan oleh penyerang?
Jawab:
CSRF token pada dasarnya merupakan mekanisme utama Django untuk mencegah serangan Cross-Site Request Forgery. Misalnya, ketika seorang pengguna telah melakukan autentikasi pada sebuah layanan seperti media sosial atau situs e-commerce kemudian tanpa sengaja mengunjungi halaman berbahaya di tab lain, halaman tersebut dapat mencoba mengirimkan permintaan atas nama pengguna. Karena permintaan tersebut dibarengi cookie sesi pengguna, server mungkin menganggapnya sah. CSRF token berfungsi sebagai kode rahasia satu kali yang hanya diketahui oleh browser pengguna dan server Django; setiap kali Django merender form, server menyertakan token unik tersembunyi, dan token ini harus disertakan saat form disubmit. Situs berbahaya tidak memiliki akses ke token ini, sehingga permintaan palsu yang dikirim tanpa token yang valid akan ditolak oleh server. Oleh karena itu, tidak menyertakan CSRF token pada form berarti membuka celah keamanan yang memungkinkan penyerang melakukan aksi berbahaya atas nama pengguna yang sedang masuk.

5. Jelaskan bagaimana cara kamu mengimplementasikan checklist di atas secara step-by-step (bukan hanya sekadar mengikuti tutorial).
Jawab:
Sama seperti tugas sebelumnya saya rasa saya perlu disclaimer bahwa saya sebenarnya hanya mengikuti step by step tutorial. Akan tetapi, kali ini saya coba membaca dan akhirnya saya mulai mengerti gambaran umum bagaimana Django bekerja dan apa sebenarnya yang sedang kita lakukan setiap tutorial. Tentu pertama-tama saya mengikuti implementasi skeleton sebagai kerangka views pada tutorial. Lalu, saya membuat form input data yang kemudian menampilkan data football shop milik saya pada HTML. Selanjutnya saya menambahkan beberapa function untuk bisa mengembalikan data dalam bentuk XML dan JSON termasuk berdasarkan ID. Terakhir, sesuai instruksi terakhir pada tugas ini, saya menggunakan Postman untuk melakukan screenshot yang saya kumpulkan pada drive dibawah ini.

6. Apakah ada feedback untuk asdos di tutorial 2 yang sudah kalian kerjakan?
Jawab:
Tidak ada, seperti kemarin menurut saya tutorialnya seru dan sangat step by step.

Terakhir, berikut adalah drive SS Postman milik saya: https://drive.google.com/drive/folders/13E87qiXbQdVgBJlCyybz3GbPY7x8mOSo?usp=sharing

---

##Tugas 2
https://bryan-christopher-footballshop.pbp.cs.ui.ac.id/
(Tautan yang ada di search bar ketika button "View Project" ditekan)

Jawaban Pertanyaan:
1. Jelaskan bagaimana cara kamu mengimplementasikan checklist di atas secara step-by-step (bukan hanya sekadar mengikuti tutorial).
Jawab:
Pertama-tama saya harus menyebutkan bahwa saya mengikuti step by step dari tutorial 0 dan tutorial 1 yang berada pada website PBP, sehingga cara step-by-step milik saya tentu akan sangat mirip dengan yang ada di kedua tutorial tersebut. Hal pertama yang saya lakukan yaitu membuat direktori baru dengan nama Tugas2 lalu membuat virtual environment, menyiapkan dependencies dan membuat proyek django. Saya membuat proyek django dengan nama football_shop (saya baru sadar sekarang betapa sulitnya membedakan antara football_news dari tutorial 0 dan football_shop dari tugas 2 ini ketika projectnya bersebelahan). Lalu, saya melakukan konfigurasi environment variables dan proyek sesuai instruksi pada tutorial 0. Akan tetapi, kali ini saya tidak lupa mengganti schema menjadi tugas_individu. Sekarang aplikasi django sudah bisa berfungsi meskipun belum menampilkan apa-apa. Selanjutnya saya membuat repositori baru di Github dan menghubungkan folder Tugas2 saya ke repositori tersebut. Kemudian barulah saya membuat project baru dan melakukan deployment melalui PWS.

Saya juga mengikuti instruksi dari tutorial 1 sebagai guidance saya untuk membuat MVT pada aplikasi django saya. Pertama-tama saya membuat aplikasi main dalam project football_shop. Kemudian saya membuat file main.html yang berisikan tulisan nama shop saya dan identitas saya sebagai pembuat. Langkah selanjutnya adalah mengubah file models.py yang ada di main. Disini saya melakukan penambahan atribut wajib (name, price, description, thumbnail, category, dan is_featured). Diluar atribut wajib saya juga menambahkan atribut stock dan juga rating (hal ini karena saya rasa kedua atribut ini menjadi sangat penting dalam pengalaman saya online shopping). Tidak lupa saya melakukan migrasi model setiap ada perubahan pada models. Lalu, saya menghubungkan View dengan Template sesuai dengan instruksi pada tutorial 1. Terakhir, saya melakukan konfigurasi routing url. 

2. Buatlah bagan yang berisi request client ke web aplikasi berbasis Django beserta responnya dan jelaskan pada bagan tersebut kaitan antara urls.py, views.py, models.py, dan berkas html.
Jawaban:
Maaf saya tidak tahu cara insert image disini, jadi ini bagan versi teks yang sumbernya berasal dari image berikut yang saya temukan di Google (https://drive.google.com/file/d/1TI0q1youSsWX9m-FVAmlZupZ1xkeL4bJ/view?usp=sharing)
   User 
   │ Request
   ▼
   URLconf (urls.py) → routing
   │
   ▼
   Views (views.py)
   │   ▲
   │   │ Query
   ▼   │ Respon Data
   Models (models.py)
   │
   ▼
   Database
   │
   ▼
   Template (HTML) → hasil render
   │
   ▼
   User (Halaman tampil di browser)

   Adapun korelasi antara urls.py, views.py, models.py dan berkas html dapat dijelaskan sebagai berikut:
   Pertama-tama saat ada request masuk ke server django dari user, request itu melewati urls untuk diarahkan ke fungsi views yang sudah dibuat oleh developer (dalam kasus ini kita). Jika proses tersebut membutuhkan data dari database, views akan mengirimkan query melalui models, lalu database memberikan kembali hasil query tersebut ke views. Setelah semua proses selesai, hasilnya dimasukkan ke dalam template HTML yang telah disiapkan, kemudian HTML tersebut dikirimkan kembali ke pengguna sebagai respons dan ditampilkan pada browser.


3. Jelaskan peran settings.py dalam proyek Django!
Jawab:
Jika membaca file settings.py yang diberikan pada tutorial, secara general saya berpendapat bahwa file settings.py berfungsi sebagai pusat pengaturan jalannya aplikasi django yang sudah kita buat (sama seperti namanya). Semua pengaturan  seperti database, aplikasi yang terpasang, middleware, hingga lokasi template dan static files didefinisikan di dalamnya. File ini juga menyimpan pengaturan keamanan seperti ALLOWED_HOSTS yang kita ganti pada tutorial. Ada juga opsi untuk debug dan deployment. Pada bagian bawah file juga terlihat settings.py mengatur bahasa dan ona waktu pengguna. Oleh karena itu, dapat disimpulkan bahwa file settings.py adalah tempat untuk menyesuaikan pengaturan proyek django agar sesuai dengan kebutuhan kita sebagai pihak pengembang.


4. Bagaimana cara kerja migrasi database di Django?
Jawab:
Pada esensinya, migrasi merupakan mekanisme untuk menyelaraskan perubahan model dengan struktur tabel basis data. Hal ini membuat setiap perubahan pada models.py seperti penambahan, pengurangan atau perubahan atribut mengharuskan adanya migrasi agar struktur tabel ikut menyesuaikan. Cara kerja migrasi database di django dimulai ketika kita membuat atau mengubah model pada berkas models.py. Perubahan ini tidak langsung mengubah database, sehingga perlu dibuat file migrasi terlebih dahulu dengan perintah python manage.py makemigrations. File migrasi berisi instruksi perubahan yang akan dilakukan pada struktur tabel database, misalnya menambah kolom baru atau menghapus field tertentu. Setelah itu, perintah python manage.py migrate dijalankan untuk menerapkan instruksi tersebut ke dalam database sehingga strukturnya sesuai dengan model yang sudah kita ubah.

5. Menurut Anda, dari semua framework yang ada, mengapa framework Django dijadikan permulaan pembelajaran pengembangan perangkat lunak?
Jawab: 
Dari pengalaman saya sendiri, framework Django disajikan sebagai permulaan pembelajaran pengembangan software karena framework ini terstruktur secara rapih dan juga cenderung lebih mudah dipahami oleh pemula. Apalagi dengan penggunaan bahasa python yang notabene sudah terkenal sebagai bahasa pemrograman paling ramah pemula. Secara keseluruhan menurut saya Django memberikan kita kemudahan sehingga bisa langsung fokus membuat web tanpa harus install atau konfigurasi banyak hal tambahan.

6. Apakah ada feedback untuk asisten dosen tutorial 1 yang telah kamu kerjakan sebelumnya?
Jawab: 
Secara general tidak ada feedback. Saya cukup mengerti untuk tutorial 0 dan tutorial 1 ketika first run. Sekarang saya sudah melakukannya 2 kali dengan mengerjakan tugas ini sehingga itu membuat saya menjadi semakin mengerti.