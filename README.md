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