const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment-timezone");
const axios = require("axios");
const short = require("short-uuid");
const crypto = require("crypto");
const md5 = require("md5");
const { formatmoney } = require("../resources/lib/function");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function cekWaktu() {
  const waktuSekarang = new Date();
  const tahun = waktuSekarang.getFullYear();
  let bulan = waktuSekarang.getMonth() + 1; // Bulan dimulai dari 0, jadi perlu ditambah 1
  bulan = bulan < 10 ? "0" + bulan : bulan; // Menambahkan leading zero jika bulan kurang dari 10
  let tanggal = waktuSekarang.getDate();
  tanggal = tanggal < 10 ? "0" + tanggal : tanggal; // Menambahkan leading zero jika tanggal kurang dari 10
  let jam = waktuSekarang.getHours();
  jam = jam < 10 ? "0" + jam : jam; // Menambahkan leading zero jika jam kurang dari 10
  let menit = waktuSekarang.getMinutes();
  menit = menit < 10 ? "0" + menit : menit; // Menambahkan leading zero jika menit kurang dari 10
  let detik = waktuSekarang.getSeconds();
  detik = detik < 10 ? "0" + detik : detik; // Menambahkan leading zero jika detik kurang dari 10
  return `${tahun}-${bulan}-${tanggal} ${jam}:${menit}:${detik}`;
}
async function saveDataTransactions(
  buyer,
  ref_id,
  date,
  produk,
  kode,
  username,
  methode,
  target,
  harga,
  harga_jual,
  harga_modal,
  status,
  caption
) {
  const trxFilePath = path.join(
    __dirname,
    "../resources/database/transaction.json"
  );
  const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, "utf8"));
  const newTransactionData = {
    buyer: buyer,
    ref_id: ref_id,
    date: date,
    produk: produk,
    kode: kode,
    username: username,
    methode: methode,
    target: target,
    harga: harga,
    harga_jual: harga_jual,
    harga_modal: harga_modal,
    status: status,
    caption: caption,
  };
  trxUserData.push(newTransactionData);
  fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), "utf8");
}
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
const prod = path.join(__dirname, "../resources/database/pascabayar.json");
const { userOrdersPasca } = require("../resources/lib/session");
const { hitungHargaRole } = require("../resources/lib/function");
const products = JSON.parse(fs.readFileSync(prod, "utf-8"));
function filterProducts(brand, category) {
  return products.filter(
    (product) => product.brand === brand && product.category === category
  );
}

// Fungsi untuk membuat tombol produk dengan pagination
function createProductButtons(filteredProducts, page = 1) {
  const pageSize = 15;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Ambil produk berdasarkan halaman
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Buat tombol produk
  const productButtons = paginatedProducts.map((product) =>
    Markup.button.callback(
      product.product_name,
      `DETAILPRODUKPASCA_${product.buyer_sku_code}`
    )
  );

  // Tambahkan tombol navigasi jika ada lebih banyak data
  const navigationButtons = [];
  if (startIndex > 0) {
    navigationButtons.push(
      Markup.button.callback("⬅️ Sebelumnya", `PAGE_${page - 1}`)
    );
  }
  if (endIndex < filteredProducts.length) {
    navigationButtons.push(
      Markup.button.callback("➡️ Selanjutnya", `PAGE_${page + 1}`)
    );
  }

  return Markup.inlineKeyboard([
    ...productButtons.map((button) => [button]), // Tombol produk per baris
    navigationButtons, // Tombol navigasi di baris terakhir
  ]);
}

function getCategories() {
  const categories = products.map((product) => product.category);
  return [...new Set(categories)]; // Menghapus duplikasi
}

function getTypeByCategory(category, brand) {
  const brands = products
    .filter(
      (product) => product.category === category && product.brand === brand
    )
    .map((product) => product.type);
  return [...new Set(brands)]; // Menghapus duplikasi
}
// Fungsi untuk membagi tombol menjadi baris dengan maksimal 4 tombol
function splitButtons(buttons, maxPerRow = 2) {
  const rows = [];
  for (let i = 0; i < buttons.length; i += maxPerRow) {
    rows.push(buttons.slice(i, i + maxPerRow));
  }
  return rows;
}

// Fungsi untuk membuat tombol kategori
function createCategoryButtons() {
  const categories = getCategories();
  const buttons = categories.map((category) =>
    Markup.button.callback(category, `CATEGORYPASCA_${category}`)
  );
  return Markup.inlineKeyboard([
    ...splitButtons(buttons),
    [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")],
  ]);
}

function createTypeButtons(category) {
  const brands = getBrandsByCategory(category);
  const buttons = brands.map((brand) =>
    Markup.button.callback(brand, `BRANDPASCA_${category}_${brand}`)
  );
  return Markup.inlineKeyboard([
    ...splitButtons(buttons),
    [Markup.button.callback("⬅️ Back to Categories", "BACK_TO_CATEGORIES")],
  ]);
}
// Fungsi untuk mengirim tombol kategori
function sendCategoryButtons(ctx) {
  const inlineKeyboard = createCategoryButtons();

  ctx.editMessageText("Pilih kategori di bawah ini:", inlineKeyboard);
}

function getBrandsByCategory(category) {
  const brands = products
    .filter((product) => product.category === category)
    .map((product) => product.brand);
  return [...new Set(brands)]; // Menghapus duplikasi
}
function createBrandButtons(category) {
  const brands = getBrandsByCategory(category);
  const buttons = brands.map((brand) =>
    Markup.button.callback(brand, `BRANDPASCA_${category}_${brand}`)
  );
  return Markup.inlineKeyboard([
    ...splitButtons(buttons),
    [Markup.button.callback("⬅️ Back to Categories", "BACK_TO_CATEGORIES")],
  ]);
}

/**
 *
 * @param {*} bot
 * @param {*} cek
 * @param {*} register
 * @param {*} settings
 */
module.exports = (bot, sett, cek, register, settings) => {
  bot.command("cekk", (kris) => {
    console.log(userOrdersPasca[kris.from.id])
  })
  bot.action("PASCABAYAR", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);

    sendCategoryButtons(kris);
  });
  bot.action(/CATEGORYPASCA_(.+)/, (ctx) => {
    const category = ctx.match[1];
    function sendBrandButtons(ctx, category) {
      const inlineKeyboard = createBrandButtons(category);
      ctx.editMessageText(
        `Pilih brand untuk kategori "${category}":`,
        inlineKeyboard
      );
    }
    sendBrandButtons(ctx, category);
  });
  bot.action(/BRANDPASCA_(.+)_(.+)/, (ctx) => {
    const [category, brand] = ctx.match.slice(1);
    function getBrandsByCategory(category, brand) {
      const brands = products
        .filter(
          (product) => product.category === category && product.brand === brand
        )
        .map((product) => product.product_name);
      return [...new Set(brands)]; // Menghapus duplikasi
    }
    function createBrandButtons(brand, category) {
      const brands = getBrandsByCategory(category, brand);
      const buttons = brands.map((type) =>
        Markup.button.callback(type, `PRODUKPASCA_${category}_${brand}_${type}`)
      );
      return Markup.inlineKeyboard([
        ...splitButtons(buttons),
        [Markup.button.callback("⬅️ Back to Categories", "BACK_TO_CATEGORIES")],
      ]);
    }
    const inlineKeyboard = createBrandButtons(brand, category);
    ctx.editMessageText(`Pilih type "${brand}":`, inlineKeyboard);
  });
  bot.action("BACK_TO_CATEGORIES", (ctx) => {
    sendCategoryButtons(ctx);
  });
  bot.action(/PRODUKPASCA_(.+)_(.+)_(.+)/, (ctx) => {
    const [category, brand] = ctx.match.slice(1);
    function createProductButtons(filteredProducts) {
      // Buat tombol produk, satu per baris
      const productButtons = filteredProducts.map((product) => [
        Markup.button.callback(
          product.product_name,
          `DETAILPRODUKPASCA_${product.buyer_sku_code}`
        ),
      ]);

      // Tambahkan tombol Back di bagian bawah
      productButtons.push([
        Markup.button.callback("⬅️ Back", `BACK_TO_PREVIOUS_MENUPASCA`),
      ]);

      return Markup.inlineKeyboard(productButtons);
    }

    function sendProductButtons(ctx, filteredProducts) {
      const inlineKeyboard = createProductButtons(filteredProducts);
      ctx.editMessageText(
        "Pilih produk dari daftar di bawah ini:",

        inlineKeyboard
      );
    }
    const filteredProducts = products.filter(
      (product) =>
        product.category === category &&
        product.brand === brand
    );
    sendProductButtons(ctx, filteredProducts);
  });
  bot.action("BACK_TO_PREVIOUS_MENUPASCA", (ctx) => {
    sendCategoryButtons(ctx);
  });
  //  ====

  // Event handler untuk tombol produk
  bot.action(/^SELECTPASCA_(.+)$/, (ctx) => {
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
      ctx.editMessageText(
        "Halo kak silahkan pilih opsi di Bawah ini.",
        Markup.inlineKeyboard([
          [Markup.button.callback("DETAIL PRODUK", `DETAILPRODUKPASCA_${skuCode}`)],
          [Markup.button.callback("ORDER PRODUK", `SELECTORDERPASCA_${skuCode}`)],
          [
            Markup.button.callback(
              "KEMBALI",
              `PRODUKPASCA_${product.category}_${product.brand}_${product.type}`
            ),
          ],
        ])
      );
    } else {
      ctx.editMessageText("Produk tidak ditemukan.");
    }
  });
  bot.action(/^DETAILPRODUKPASCA_(.+)$/, (ctx) => {
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
      let pesan = ` DETAIL PRODUK

Produk: ${product.product_name}
Kode: ${product.buyer_sku_code}
Status: 
Admin: ${Number(product.admin + product.commission)}
Desc: ${product.desc}

Untuk Melakukan Cek Tagihan silahkan Klik Opsi CEK TAGIHAN`;
      ctx.editMessageText(
        pesan,
        Markup.inlineKeyboard([
          [Markup.button.callback("CEK TAGIHAN", `SELECTORDERPASCA_${skuCode}`)],
          [
            Markup.button.callback(
              "KEMBALI",
              `PRODUKPASCA_${product.category}_${product.brand}_${product.type}`
            ),
          ],
        ])
      );
    } else {
      ctx.editMessageText("Produk tidak ditemukan.");
    }
  });
  bot.action(/^SELECTORDERPASCA_(.+)$/, (ctx) => {
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
      if (Number(cek("saldo", ctx.from.id)) < Number(product.price))
        return ctx.editMessageText(
          "Saldo Anda tidak cukup untuk melakukan top-up"
        );
      userOrdersPasca[ctx.from.id] = {
        product,
        status: "waiting_for_target_number", // Status untuk menunggu nomor target
        tagihan: "",
        username: "", 
        reff: ""
      };
      ctx.editMessageText(
        "Silakan kirimkan nomor tujuan untuk top-up.",
        Markup.inlineKeyboard([
          [Markup.button.callback("❌ Batalkan", "CANCEL_ORDER")],
        ])
      );
    } else {
      ctx.editMessageText("Produk tidak ditemukan.");
    }
  });
    async function checkStatusPasca(kode, username, refId, sign, costumerno) {
const requestData = {
    commands: 'status-pasca', 
    username: username,
    buyer_sku_code: kode,
    customer_no: costumerno,
    ref_id: refId,
    sign: sign
};
axios.post('https://api.digiflazz.com/v1/transaction', requestData)
    .then(response => {
        return response
    })
    .catch(error => {
        console.error('Error saat request:', error);
    });
 }
bot.action("BAYAR_TAGIHAN", (ctx) => {
  const userId = ctx.from.id;
    if (
      userOrdersPasca[userId] &&
      userOrdersPasca[userId].status === "Bayar_Tagihan"
    ) {
      const order = userOrdersPasca[userId];
      if (cek("saldo", userId) === null) {
        return ctx.reply("Kamu tidak memiliki saldo, silahkan deposit.");
      }
      const kode = order.product.buyer_sku_code;
      const produk = order.product.product_name;
      const tujuan = order.targetNumber;
      const reff = order.reff
      const harga = Number(order.tagihan)
      if (cek("saldo", userId) < harga)
        return ctx.editMessageText(
          "Saldo anda Kurang silahkan deposit terlebih dahulu"
        );
      sett("-saldo", userId, harga);
      let signature = crypto
        .createHash("md5")
        .update(settings.digiflazz.username + settings.digiflazz.apikey + reff)
        .digest("hex");
      var config = {
        method: "POST", // Set the HTTP method to POST
        url: "https://api.digiflazz.com/v1/transaction", // Set the target URL
        data: {
          commands: "pay-pasca",
          username: settings.digiflazz.username,
          buyer_sku_code: kode,
          customer_no: tujuan,
          ref_id: reff,
          sign: signature,
        }, 
      };
        axios(config)
    .then(async res => {
    ctx.editMessageText(`「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」`)
        let status = res.data.data.status;  
        console.log(status)        
            console.log(checkStatusPasca(kode, settings.digiflazz.username, reff, signature, tujuan))
    while (status !== 'Sukses') {
    await sleep(1000); 
     
    status = response.data.data.status; 
    }
  })
    }
});
    
    bot.command("statt", async (kris) => {
    let signature = crypto
        .createHash("md5")
        .update(settings.digiflazz.username + settings.digiflazz.apikey + '75ZhEUuHjL8rYA7XpotZ42')
        .digest("hex");
    var config = {
        method: "POST", // Set the HTTP method to POST
        url: "https://api.digiflazz.com/v1/transaction", // Set the target URL
        data: {
          commands: "status-pasca",
          username: settings.digiflazz.username,
          buyer_sku_code: 'bpjs',
          customer_no: '8888802077117582',
          ref_id: '75ZhEUuHjL8rYA7XpotZ42',
          sign: signature,
        }, 
      };
        axios(config)
     .then(async res => {
            console.log(res)
    }) 
});
  bot.action("CONFIRM_ORDERPASCA", (ctx) => {
    const userId = ctx.from.id;
    if (
      userOrdersPasca[userId] &&
      userOrdersPasca[userId].status === "Bayar_Tagihan"
    ) {
      const order = userOrdersPasca[userId];
      if (cek("saldo", userId) === null) {
        return ctx.reply("Kamu tidak memiliki saldo, silahkan deposit.");
      }
      const kode = order.product.buyer_sku_code;
      const produk = order.product.product_name;
      const tujuan = order.targetNumber;
      const reff = order.reff
      const harga = hitungHargaRole(
        cek,
        Number(order.product.admin), userId
      );
      const signature = crypto
        .createHash("md5")
        .update(settings.digiflazz.username + settings.digiflazz.apikey + reff)
        .digest("hex");
      var config = {
        method: "POST", // Set the HTTP method to POST
        url: "https://api.digiflazz.com/v1/transaction", // Set the target URL
        data: {
          commands: "inq-pasca",
          username: settings.digiflazz.username,
          buyer_sku_code: kode,
          customer_no: tujuan,
          ref_id: reff,
          sign: signature,
        },
      };
      axios(config)
        .then(function (response) {
          ctx.editMessageText("Transakasi Pending Mohon Di tunggu");
          if (response.data.data.status == "Gagal") {
            delete userOrdersPasca[userId];
            let pesan = `◇─◇──◇ ${settings.storename} ◇──◇─◇ 
❌ Transaksi Gagal ❌

User: ${userId}
Produk: ${produk}
Kode: ${kode}
Target: ${tujuan}
Reff: ${reff}
Type: Cek Tagihan

Message: ${response.data.data.message}`;
            ctx.reply(pesan);
          }
          if (response.data.data.status === "Sukses") {
           
              userOrdersPasca[userId].status = 'Bayar_Tagihan'
              userOrdersPasca[userId].username =
              response.data.data.customer_name;
            const tag = Number(response.data.data.selling_price) + Number(harga)
            userOrdersPasca[userId].tagihan = tag;
              console.log(userOrdersPasca[userId])
            let pesan = `◇─◇──◇ ${settings.storename} ◇──◇─◇ 
 Transaksi Sukses 
Nama Pelanggan : ${response.data.data.customer_name} 
ID Pelanggan : ${response.data.data.customer_no}
Total Lembar Tagihan : ${response.data.data.desc.lembar_tagihan}
Total Tagihan : Rp${tag}
Harga Asli : Rp${response.data.data.price}
Admin : ${harga}
Sisa Saldo : Rp${formatmoney(cek("saldo", userId))}
SUDAH TERMASUK ADMIN`;
 const confirmButton = Markup.inlineKeyboard([
   [Markup.button.callback("✅ Bayar Tagihan", "BAYAR_TAGIHAN")],
   [Markup.button.callback("❌ Batalkan", "BATALKAN_TAGIHAN")],
 ]);
 ctx.reply(pesan, confirmButton);
          }
        })
        .catch(function (error) {
          delete userOrdersPasca[userId];
          console.log(error);
          ctx.editMessageText("Terjadi kesalahan saat memproses permintaan. Silahkan hubungi Costumer Service Untuk mendapatkan bantuan");
        });
    } else {
      ctx.reply("Tidak ada pesanan yang perlu dikonfirmasi.");
    }
    
  }
);
  bot.action("CANCEL_ORDERpass", (ctx) => {
    const userId = ctx.from.id;

    // Mengecek jika user memiliki pesanan yang valid
    if (
      userOrdersPasca[userId] &&
      userOrdersPasca[userId].status === "waiting_for_confirmation"
    ) {
      // Membatalkan pesanan
      ctx.editMessageText("Pesanan Anda telah dibatalkan.");

      // Menghapus pesanan yang dibatalkan
      delete userOrdersPasca[userId];
    } else {
      ctx.editMessageText("Tidak ada pesanan yang perlu dibatalkan.");
    }
  });
  bot.action("BATALKAN_TAGIHAN", (ctx) => {
    const userId = ctx.from.id;

    // Mengecek jika user memiliki pesanan yang valid
    if (
      userOrdersPasca[userId] &&
      userOrdersPasca[userId].status === "Bayar_Tagihan"
    ) {
      // Membatalkan pesanan
      ctx.editMessageText("Pesanan Anda telah dibatalkan.");

      // Menghapus pesanan yang dibatalkan
      delete userOrdersPasca[userId];
    } else {
      ctx.editMessageText("Tidak ada pesanan yang perlu dibatalkan.");
    }
  });
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});
