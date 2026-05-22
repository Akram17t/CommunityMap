const categoryCatalog = {
  pothole: {
    imageUrl: "/images/report-pothole.svg",
    titleStarts: [
      "Lubang besar di",
      "Aspal amblas di",
      "Permukaan jalan rusak di",
      "Jalan retak cukup parah di",
    ],
    issueDetails: [
      "lubangnya cukup dalam dan pengendara motor sering buang setang mendadak",
      "permukaan aspal sudah pecah dan makin melebar tiap habis hujan",
      "bagian tengah jalannya amblas jadi mobil sering ambil jalur kanan",
      "retakannya menyambung dan mulai memanjang ke lajur sebelah",
    ],
    impactDetails: [
      "Beberapa motor tadi pagi hampir jatuh saat kondisi ramai.",
      "Arus kendaraan jadi melambat karena semua orang menghindar di titik yang sama.",
      "Kalau malam cukup bahaya karena kontur jalannya tidak kelihatan jelas.",
      "Sudah mulai bikin antrean pendek pada jam berangkat kerja.",
    ],
    followUps: [
      "Belum ada penanda sama sekali di lokasi.",
      "Warga sekitar baru menaruh batu kecil sebagai tanda darurat.",
      "Saya lihat belum ada tindakan perbaikan dari petugas.",
      "Mohon dicek sebelum kerusakannya makin melebar.",
    ],
  },
  streetlight: {
    imageUrl: "/images/report-streetlight.svg",
    titleStarts: [
      "Lampu jalan mati di",
      "Penerangan redup di",
      "Tiang lampu bermasalah di",
      "Area gelap karena lampu mati di",
    ],
    issueDetails: [
      "beberapa titik lampu tidak menyala sama sekali sejak beberapa malam lalu",
      "penerangan jalannya redup dan bikin area tikungan susah terlihat",
      "satu deret lampu padam jadi ruas ini gelap total setelah magrib",
      "lampunya kadang berkedip lalu mati lagi sepanjang malam",
    ],
    impactDetails: [
      "Pejalan kaki dan pengendara jadi kurang nyaman lewat malam hari.",
      "Area ini cukup ramai warung malam jadi penerangan sangat dibutuhkan.",
      "Warga bilang titik ini rawan karena visibilitas menurun drastis.",
      "Motor sering melambat mendadak karena pandangan pendek.",
    ],
    followUps: [
      "Mohon dicek panel atau bohlamnya.",
      "Sudah hampir seminggu belum normal lagi.",
      "Tolong diprioritaskan karena dekat permukiman padat.",
      "Kalau bisa diperbaiki sebelum akhir pekan karena lalu lintas malam makin ramai.",
    ],
  },
  puddle: {
    imageUrl: "/images/report-puddle.svg",
    titleStarts: [
      "Genangan menghambat lalu lintas di",
      "Air tergenang di",
      "Genangan lebar di",
      "Saluran meluap ke jalan di",
    ],
    issueDetails: [
      "air selalu mengumpul di sisi kiri jalan setiap hujan singkat",
      "genangannya menutup sebagian lajur dan cukup dalam untuk motor",
      "drainase di titik ini kelihatannya tidak lancar jadi air lama surut",
      "ban kendaraan sering menyiprat karena kubangan memanjang",
    ],
    impactDetails: [
      "Pengendara motor jadi ambil jalur kanan dan bikin arus tersendat.",
      "Kalau truk lewat, airnya menyebar sampai ke trotoar.",
      "Banyak warga memilih memutar karena takut mesinnya kemasukan air.",
      "Permukaan jalan jadi licin dan rawan selip.",
    ],
    followUps: [
      "Kemungkinan saluran sampingnya perlu dibersihkan.",
      "Mohon dicek sebelum hujan besar datang lagi.",
      "Sudah beberapa hari pola genangannya sama.",
      "Warga sekitar bilang masalah ini sering berulang tiap sore.",
    ],
  },
  flood: {
    imageUrl: "/images/report-flood.svg",
    titleStarts: [
      "Banjir lokal memutus akses di",
      "Air meluap ke badan jalan di",
      "Titik rawan banjir kembali muncul di",
      "Ruas jalan tergenang berat di",
    ],
    issueDetails: [
      "air naik cukup cepat dan hampir menutup seluruh badan jalan",
      "luapan dari saluran besar masuk ke jalan utama saat hujan deras",
      "titik ini kembali banjir dan kendaraan kecil mulai kesulitan lewat",
      "genangan tingginya sudah melewati batas aman untuk motor matik",
    ],
    impactDetails: [
      "Akses warga sempat tersendat dan kendaraan kecil banyak putar balik.",
      "Mobil masih bisa lewat pelan, tapi motor kebanyakan memilih berhenti dulu.",
      "Beberapa rumah dan toko di sekitar mulai terganggu karena air meluber.",
      "Arus lalu lintas jadi tersendat panjang pada jam pulang kantor.",
    ],
    followUps: [
      "Mohon diprioritaskan karena ini jalur penghubung utama warga.",
      "Kalau hujan lanjutan kemungkinan air bisa naik lagi.",
      "Warga sekitar butuh penanganan saluran secepatnya.",
      "Tolong ditindaklanjuti karena titik ini sering berulang saat musim hujan.",
    ],
  },
  other: {
    imageUrl: "/images/report-road.svg",
    titleStarts: [
      "Marka dan permukaan jalan bermasalah di",
      "Akses jalan lingkungan terganggu di",
      "Kondisi jalan perlu perhatian di",
      "Fasilitas jalan rusak di",
    ],
    issueDetails: [
      "bahu jalan dan permukaannya tidak rata jadi kendaraan sering melambat mendadak",
      "marka sudah pudar dan pinggir jalannya mulai rontok",
      "permukaan jalan bergelombang dan cukup mengganggu kendaraan kecil",
      "akses keluar masuk lingkungan jadi kurang nyaman dipakai harian",
    ],
    impactDetails: [
      "Kalau ramai, kendaraan sering saling mengalah sampai bikin antrean pendek.",
      "Pengguna jalan baru biasanya kaget karena kondisinya tidak terbaca dari jauh.",
      "Warga sekitar bilang gangguan ini makin terasa pada jam sibuk.",
      "Mobil dan motor sama-sama harus ekstra pelan saat melintas.",
    ],
    followUps: [
      "Mohon ada pengecekan lapangan lebih detail.",
      "Belum ada pembatas atau rambu sementara di titik tersebut.",
      "Kalau bisa dibenahi sebelum kondisi tambah rusak.",
      "Saya laporkan supaya ada tindak lanjut sebelum makin mengganggu.",
    ],
  },
};

const regionCatalog = [
  {
    district: "Kota Serang",
    province: "Banten",
    area: "Sumurpecung",
    lat: -6.1203,
    lon: 106.1503,
    streets: ["Jl. Jenderal Sudirman", "Jl. Trip Jamaksari", "Jl. Samaun Bakri"],
    landmark: "dekat Pasar Rau",
  },
  {
    district: "Kota Cilegon",
    province: "Banten",
    area: "Jombang",
    lat: -6.0165,
    lon: 106.0552,
    streets: ["Jl. Ahmad Yani", "Jl. KH Yasin Beji", "Jl. Letjen R. Suprapto"],
    landmark: "sekitar akses terminal kota",
  },
  {
    district: "Kabupaten Tangerang",
    province: "Banten",
    area: "Cikupa",
    lat: -6.2361,
    lon: 106.5118,
    streets: ["Jl. Raya Serang", "Jl. Arya Jaya Santika", "Jl. Citra Raya Boulevard"],
    landmark: "dekat akses pergudangan",
  },
  {
    district: "Kota Tangerang Selatan",
    province: "Banten",
    area: "Pamulang",
    lat: -6.3428,
    lon: 106.7384,
    streets: ["Jl. Siliwangi", "Jl. Raya Pamulang", "Jl. Surya Kencana"],
    landmark: "sekitar putaran balik utama",
  },
  {
    district: "Jakarta Pusat",
    province: "DKI Jakarta",
    area: "Cempaka Putih",
    lat: -6.1817,
    lon: 106.8663,
    streets: ["Jl. Ahmad Yani", "Jl. Percetakan Negara", "Jl. Letjen Suprapto"],
    landmark: "dekat halte bus",
  },
  {
    district: "Jakarta Barat",
    province: "DKI Jakarta",
    area: "Kebon Jeruk",
    lat: -6.1699,
    lon: 106.7591,
    streets: ["Jl. Kebon Raya", "Jl. Panjang", "Jl. Perjuangan"],
    landmark: "dekat flyover",
  },
  {
    district: "Jakarta Timur",
    province: "DKI Jakarta",
    area: "Duren Sawit",
    lat: -6.2196,
    lon: 106.8996,
    streets: ["Jl. Melati Raya", "Jl. Raya Kalimalang", "Jl. Pondok Kelapa Raya"],
    landmark: "di depan deretan bengkel",
  },
  {
    district: "Jakarta Utara",
    province: "DKI Jakarta",
    area: "Kelapa Gading",
    lat: -6.1501,
    lon: 106.9041,
    streets: ["Jl. Boulevard Raya", "Jl. Pegangsaan Dua", "Jl. Gading Kirana"],
    landmark: "sekitar akses ruko dan apartemen",
  },
  {
    district: "Jakarta Selatan",
    province: "DKI Jakarta",
    area: "Kebayoran Baru",
    lat: -6.2389,
    lon: 106.8121,
    streets: ["Jl. Wolter Monginsidi", "Jl. Wijaya II", "Jl. Senopati"],
    landmark: "dekat pusat kuliner malam",
  },
  {
    district: "Kota Bekasi",
    province: "Jawa Barat",
    area: "Bekasi Timur",
    lat: -6.2615,
    lon: 106.9732,
    streets: ["Jl. Chairil Anwar", "Jl. HM Joyomartono", "Jl. Ir. H. Juanda"],
    landmark: "sekitar terminal kota",
  },
  {
    district: "Kota Bogor",
    province: "Jawa Barat",
    area: "Tanah Sareal",
    lat: -6.595,
    lon: 106.806,
    streets: ["Jl. KH Sholeh Iskandar", "Jl. Raya Pajajaran", "Jl. Veteran"],
    landmark: "dekat pusat grosir",
  },
  {
    district: "Kota Depok",
    province: "Jawa Barat",
    area: "Margonda",
    lat: -6.3924,
    lon: 106.8228,
    streets: ["Jl. Margonda Raya", "Jl. Juanda", "Jl. Siliwangi"],
    landmark: "dekat akses kampus",
  },
  {
    district: "Kota Bandung",
    province: "Jawa Barat",
    area: "Antapani",
    lat: -6.9175,
    lon: 107.6191,
    streets: ["Jl. AH Nasution", "Jl. Terusan Jakarta", "Jl. Purwakarta"],
    landmark: "dekat lampu merah besar",
  },
  {
    district: "Kota Cimahi",
    province: "Jawa Barat",
    area: "Cimahi Tengah",
    lat: -6.8722,
    lon: 107.5426,
    streets: ["Jl. Jenderal Amir Machmud", "Jl. Gatot Subroto", "Jl. HMS Mintareja"],
    landmark: "sekitar jalur kendaraan berat",
  },
  {
    district: "Kota Sukabumi",
    province: "Jawa Barat",
    area: "Cikole",
    lat: -6.9241,
    lon: 106.9274,
    streets: ["Jl. Siliwangi", "Jl. Bhayangkara", "Jl. RE Martadinata"],
    landmark: "di jalur menuju stasiun",
  },
  {
    district: "Kota Cirebon",
    province: "Jawa Barat",
    area: "Kejaksan",
    lat: -6.7063,
    lon: 108.557,
    streets: ["Jl. Kartini", "Jl. Cipto Mangunkusumo", "Jl. Dr. Wahidin"],
    landmark: "dekat pusat oleh-oleh",
  },
  {
    district: "Kabupaten Karawang",
    province: "Jawa Barat",
    area: "Telukjambe",
    lat: -6.3227,
    lon: 107.3376,
    streets: ["Jl. Interchange Karawang Barat", "Jl. Ahmad Yani", "Jl. Tuparev"],
    landmark: "sekitar akses kawasan industri",
  },
  {
    district: "Kabupaten Garut",
    province: "Jawa Barat",
    area: "Tarogong Kidul",
    lat: -7.2279,
    lon: 107.9087,
    streets: ["Jl. Patriot", "Jl. Ahmad Yani", "Jl. Suherman"],
    landmark: "dekat simpang pasar",
  },
  {
    district: "Kabupaten Tasikmalaya",
    province: "Jawa Barat",
    area: "Singaparna",
    lat: -7.3524,
    lon: 108.1112,
    streets: ["Jl. Raya Timur Singaparna", "Jl. Garut-Tasik", "Jl. Paseh"],
    landmark: "di depan kantor kecamatan",
  },
  {
    district: "Kota Semarang",
    province: "Jawa Tengah",
    area: "Banyumanik",
    lat: -7.0051,
    lon: 110.4381,
    streets: ["Jl. Setiabudi", "Jl. Prof. Soedarto", "Jl. Ngesrep Timur"],
    landmark: "dekat akses kampus",
  },
  {
    district: "Kota Surakarta",
    province: "Jawa Tengah",
    area: "Banjarsari",
    lat: -7.5696,
    lon: 110.8284,
    streets: ["Jl. Ahmad Yani", "Jl. Adi Sucipto", "Jl. Letjen Suprapto"],
    landmark: "sekitar stasiun",
  },
  {
    district: "Kota Tegal",
    province: "Jawa Tengah",
    area: "Margadana",
    lat: -6.8694,
    lon: 109.1403,
    streets: ["Jl. Kolonel Sugiono", "Jl. KS Tubun", "Jl. Teuku Umar"],
    landmark: "di jalur logistik kota",
  },
  {
    district: "Kabupaten Banyumas",
    province: "Jawa Tengah",
    area: "Purwokerto Selatan",
    lat: -7.4304,
    lon: 109.2478,
    streets: ["Jl. Gerilya", "Jl. Jenderal Soedirman", "Jl. Raya Baturraden"],
    landmark: "dekat rumah sakit",
  },
  {
    district: "Kabupaten Cilacap",
    province: "Jawa Tengah",
    area: "Kesugihan",
    lat: -7.6754,
    lon: 109.0267,
    streets: ["Jl. Raya Kesugihan", "Jl. Gatot Subroto", "Jl. Tentara Pelajar"],
    landmark: "sekitar jalur truk besar",
  },
  {
    district: "Kabupaten Kebumen",
    province: "Jawa Tengah",
    area: "Pejagoan",
    lat: -7.6767,
    lon: 109.6531,
    streets: ["Jl. HM Sarbini", "Jl. Ronggowarsito", "Jl. Tentara Pelajar"],
    landmark: "dekat akses pasar induk",
  },
  {
    district: "Kabupaten Magelang",
    province: "Jawa Tengah",
    area: "Mertoyudan",
    lat: -7.5195,
    lon: 110.2307,
    streets: ["Jl. Magelang-Yogyakarta", "Jl. Mayor Unus", "Jl. Soekarno Hatta"],
    landmark: "di depan pusat perbelanjaan",
  },
  {
    district: "Kabupaten Kudus",
    province: "Jawa Tengah",
    area: "Jati",
    lat: -6.8048,
    lon: 110.8405,
    streets: ["Jl. Lingkar Selatan", "Jl. AKBP Agil Kusumadya", "Jl. Kudus-Jepara"],
    landmark: "dekat akses pabrik",
  },
  {
    district: "Kabupaten Pati",
    province: "Jawa Tengah",
    area: "Margorejo",
    lat: -6.754,
    lon: 111.038,
    streets: ["Jl. Pati-Kudus", "Jl. Panglima Sudirman", "Jl. Diponegoro"],
    landmark: "sekitar jalur antar-kabupaten",
  },
  {
    district: "Kabupaten Pekalongan",
    province: "Jawa Tengah",
    area: "Kajen",
    lat: -7.0314,
    lon: 109.5897,
    streets: ["Jl. Raya Kajen", "Jl. Mandurorejo", "Jl. Raya Karanganyar"],
    landmark: "dekat kompleks perkantoran",
  },
  {
    district: "Kota Yogyakarta",
    province: "DI Yogyakarta",
    area: "Umbulharjo",
    lat: -7.7956,
    lon: 110.3695,
    streets: ["Jl. Kusumanegara", "Jl. Veteran", "Jl. Menteri Supeno"],
    landmark: "dekat area kuliner malam",
  },
  {
    district: "Kabupaten Sleman",
    province: "DI Yogyakarta",
    area: "Depok",
    lat: -7.747,
    lon: 110.3554,
    streets: ["Jl. Kaliurang", "Jl. Ring Road Utara", "Jl. Affandi"],
    landmark: "sekitar jalur mahasiswa",
  },
  {
    district: "Kabupaten Bantul",
    province: "DI Yogyakarta",
    area: "Banguntapan",
    lat: -7.8174,
    lon: 110.4227,
    streets: ["Jl. Wonosari", "Jl. Imogiri Timur", "Jl. Karangsari"],
    landmark: "dekat akses permukiman padat",
  },
  {
    district: "Kota Surabaya",
    province: "Jawa Timur",
    area: "Wonokromo",
    lat: -7.2892,
    lon: 112.7344,
    streets: ["Jl. Ahmad Yani", "Jl. Raya Darmo", "Jl. Jagir Wonokromo"],
    landmark: "dekat akses mall",
  },
  {
    district: "Kabupaten Sidoarjo",
    province: "Jawa Timur",
    area: "Buduran",
    lat: -7.4478,
    lon: 112.7183,
    streets: ["Jl. Jenggolo", "Jl. Raya Buduran", "Jl. Pahlawan"],
    landmark: "di jalur menuju kawasan industri",
  },
  {
    district: "Kota Malang",
    province: "Jawa Timur",
    area: "Lowokwaru",
    lat: -7.9666,
    lon: 112.6326,
    streets: ["Jl. Soekarno Hatta", "Jl. MT Haryono", "Jl. Borobudur"],
    landmark: "sekitar deretan kos dan warung",
  },
  {
    district: "Kabupaten Jember",
    province: "Jawa Timur",
    area: "Sumbersari",
    lat: -8.1724,
    lon: 113.7001,
    streets: ["Jl. Kalimantan", "Jl. Gajah Mada", "Jl. Jawa"],
    landmark: "di depan pasar sore",
  },
  {
    district: "Kabupaten Banyuwangi",
    province: "Jawa Timur",
    area: "Giri",
    lat: -8.2192,
    lon: 114.3691,
    streets: ["Jl. Adi Sucipto", "Jl. Basuki Rahmat", "Jl. Brawijaya"],
    landmark: "sekitar jalur menuju pelabuhan",
  },
  {
    district: "Kota Probolinggo",
    province: "Jawa Timur",
    area: "Mayangan",
    lat: -7.7543,
    lon: 113.2159,
    streets: ["Jl. Suroyo", "Jl. Panglima Sudirman", "Jl. Raya Panglima"],
    landmark: "dekat akses pelabuhan dan pasar kota",
  },
  {
    district: "Kota Kediri",
    province: "Jawa Timur",
    area: "Mojoroto",
    lat: -7.8169,
    lon: 112.0114,
    streets: ["Jl. Ahmad Yani", "Jl. Joyoboyo", "Jl. Hasanuddin"],
    landmark: "dekat jembatan penghubung kota",
  },
  {
    district: "Kabupaten Madiun",
    province: "Jawa Timur",
    area: "Jiwan",
    lat: -7.6298,
    lon: 111.5239,
    streets: ["Jl. Raya Solo", "Jl. Panglima Sudirman", "Jl. Raya Jiwan"],
    landmark: "sekitar simpang kendaraan antarkota",
  },
];

const citizenProfiles = [
  ["Budi Santoso", "warga@email.com", "budisantoso"],
  ["Siti Rahma", "siti@email.com", "sitirahma"],
  ["Nadia Putri", "nadia@email.com", "nadiaputri"],
  ["Rizky Pratama", "rizky.pratama@email.com", "rizkypratama"],
  ["Aulia Safitri", "aulia.safitri@email.com", "auliasafitri"],
  ["Dimas Saputra", "dimas.saputra@email.com", "dimassaputra"],
  ["Farhan Maulana", "farhan.maulana@email.com", "farhanmaulana"],
  ["Intan Permata", "intan.permata@email.com", "intanpermata"],
  ["Galih Ramadhan", "galih.ramadhan@email.com", "galihramadhan"],
  ["Maya Lestari", "maya.lestari@email.com", "mayalestari"],
  ["Teguh Hidayat", "teguh.hidayat@email.com", "teguhhidayat"],
  ["Nabila Azzahra", "nabila.azzahra@email.com", "nabilaazzahra"],
  ["Yoga Prakoso", "yoga.prakoso@email.com", "yogaprakoso"],
  ["Putri Maharani", "putri.maharani@email.com", "putrimaharani"],
  ["Fajar Nugroho", "fajar.nugroho@email.com", "fajarnugroho"],
  ["Anisa Pertiwi", "anisa.pertiwi@email.com", "anisapertiwi"],
  ["Bagas Kurniawan", "bagas.kurniawan@email.com", "bagaskurniawan"],
  ["Citra Ayuningtyas", "citra.ayuningtyas@email.com", "citraayuningtyas"],
  ["Rama Saputro", "rama.saputro@email.com", "ramasaputro"],
  ["Lia Wulandari", "lia.wulandari@email.com", "liawulandari"],
  ["Dewi Anggraini", "dewi.anggraini@email.com", "dewianggraini"],
  ["Arif Setiawan", "arif.setiawan@email.com", "arifsetiawan"],
];

const reporterVoices = [
  "Saya laporkan karena tadi pagi lewat sini dan kondisinya cukup mengganggu,",
  "Barusan saya cek di lokasi dan menurut saya ini perlu cepat ditangani,",
  "Saya isi laporan ini setelah melihat kondisinya berulang beberapa hari terakhir,",
  "Waktu berangkat kerja saya sempat lihat langsung titik ini dan memang bermasalah,",
  "Saya dapat info dari warga sekitar lalu saya cek sendiri, ternyata kondisinya memang seperti itu,",
];

function makeUuid(namespace, index) {
  return `00000000-0000-4000-8000-${namespace}${index
    .toString(16)
    .padStart(10, "0")}`;
}

const demoUsers = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    username: "budisantoso",
    fullName: "Budi Santoso",
    email: "warga@email.com",
    password: "password",
    role: "citizen",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    username: "adminpusat",
    fullName: "Admin DPU Pusat",
    email: "admin@dpu.go.id",
    password: "password",
    role: "admin",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    username: "sitirahma",
    fullName: "Siti Rahma",
    email: "siti@email.com",
    password: "password",
    role: "citizen",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    username: "nadiaputri",
    fullName: "Nadia Putri",
    email: "nadia@email.com",
    password: "password",
    role: "citizen",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    username: "adminbarat",
    fullName: "Admin Wilayah Barat",
    email: "barat@dpu.go.id",
    password: "password",
    role: "admin",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    username: "admintimur",
    fullName: "Admin Wilayah Timur",
    email: "timur@dpu.go.id",
    password: "password",
    role: "admin",
  },
  ...citizenProfiles.slice(3).map(([fullName, email, username], index) => ({
    id: makeUuid("10", index + 1),
    username,
    fullName,
    email,
    password: "password",
    role: "citizen",
  })),
];

const adminUsers = demoUsers.filter((user) => user.role === "admin");
const citizenUsers = demoUsers.filter((user) => user.role === "citizen");
const statuses = ["new", "verified", "in_progress", "resolved"];
const categorySlugs = Object.keys(categoryCatalog);

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function addDays(date, days) {
  return addHours(date, days * 24);
}

function formatIso(date) {
  return date.toISOString();
}

function buildReportLogs(status, createdAt, adminId, logOffset, district) {
  const logs = [
    {
      id: makeUuid("30", logOffset),
      nextStatus: "new",
      note: `Laporan warga dari ${district} diterima sistem.`,
      updatedBy: null,
      createdAt: formatIso(createdAt),
    },
  ];

  if (status === "verified" || status === "in_progress" || status === "resolved") {
    logs.push({
      id: makeUuid("30", logOffset + 1),
      previousStatus: "new",
      nextStatus: "verified",
      note: "Lokasi, foto, dan kategori laporan sudah diverifikasi petugas.",
      updatedBy: adminId,
      createdAt: formatIso(addHours(createdAt, 8)),
    });
  }

  if (status === "in_progress" || status === "resolved") {
    logs.push({
      id: makeUuid("30", logOffset + 2),
      previousStatus: "verified",
      nextStatus: "in_progress",
      note: "Tim lapangan dijadwalkan turun untuk penanganan awal.",
      updatedBy: adminId,
      createdAt: formatIso(addDays(createdAt, 1)),
    });
  }

  if (status === "resolved") {
    logs.push({
      id: makeUuid("30", logOffset + 3),
      previousStatus: "in_progress",
      nextStatus: "resolved",
      note: "Penanganan selesai dan ruas jalan dinyatakan aman dilalui kembali.",
      updatedBy: adminId,
      createdAt: formatIso(addDays(createdAt, 3)),
    });
  }

  return logs;
}

function pickUpvoterIds(reporterId, count, offset) {
  const eligible = citizenUsers.filter((user) => user.id !== reporterId);
  const safeCount = Math.max(0, Math.min(count, eligible.length));
  const upvoters = [];

  for (let index = 0; index < safeCount; index += 1) {
    const user = eligible[(offset + index) % eligible.length];
    upvoters.push(user.id);
  }

  return upvoters;
}

function buildDescription(categorySlug, region, street, index) {
  const category = categoryCatalog[categorySlug];
  const voice = reporterVoices[index % reporterVoices.length];
  const issue = category.issueDetails[index % category.issueDetails.length];
  const impact = category.impactDetails[(index + 1) % category.impactDetails.length];
  const followUp = category.followUps[(index + 2) % category.followUps.length];

  return `${voice} di ${street}, ${region.area}, ${region.district}, ${region.province}, ${issue}. Titiknya ${region.landmark}. ${impact} ${followUp}`;
}

const demoReports = regionCatalog.map((region, index) => {
  const categorySlug = categorySlugs[index % categorySlugs.length];
  const category = categoryCatalog[categorySlug];
  const reporter = citizenUsers[index % citizenUsers.length];
  const admin = adminUsers[index % adminUsers.length];
  const status = statuses[(index * 2) % statuses.length];
  const street = region.streets[index % region.streets.length];
  const createdAt = new Date(
    Date.UTC(
      2026,
      4,
      20 - (index % 35),
      6 + (index % 10),
      (index * 13) % 60,
      0,
    ),
  );
  const reportId = makeUuid("20", index + 1);
  const logs = buildReportLogs(
    status,
    createdAt,
    admin.id,
    index * 4 + 1,
    region.district,
  );
  const upvoteCount = Math.min(
    citizenUsers.length - 1,
    3 + (index % 8) + (status === "resolved" ? 2 : 0),
  );
  const referenceCode = `RPT-2026-${String(index + 1).padStart(4, "0")}`;

  return {
    id: reportId,
    referenceCode,
    reporterId: reporter.id,
    categorySlug,
    title: `${category.titleStarts[index % category.titleStarts.length]} ${street}`,
    description: buildDescription(categorySlug, region, street, index),
    latitude: region.lat,
    longitude: region.lon,
    address: `${street} No. ${12 + ((index * 9) % 70)}, ${region.area}, ${region.district}, ${region.province}`,
    district: region.district,
    status,
    isVerified: status !== "new",
    upvoteCount,
    createdAt: formatIso(createdAt),
    updatedAt: logs[logs.length - 1].createdAt,
    image: {
      id: makeUuid("21", index + 1),
      imageUrl: category.imageUrl,
      storageKey: `reports/${referenceCode}/cover.svg`,
      alt: `${category.titleStarts[index % category.titleStarts.length]} ${region.district}`,
    },
    logs,
    upvoterIds: pickUpvoterIds(reporter.id, upvoteCount, index),
  };
});

module.exports = {
  demoUsers,
  demoReports,
};
