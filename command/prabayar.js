const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment-timezone");
const axios = require("axios");
const short = require("short-uuid");
const crypto = require("crypto");
const md5 = require("md5");
const { formatmoney, hitungHargaRole } = require("../resources/lib/function");
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
  sn
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
    sn: sn,
  };
  trxUserData.push(newTransactionData);
  fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), "utf8");
}
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
const prod = path.join(__dirname, "../resources/database/produk.json");
const { userOrders } = require("../resources/lib/session");
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
      `DETAILPRODUK_${product.buyer_sku_code}`
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
function splitButtons(buttons, maxPerRow = 3) {
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
    Markup.button.callback(category, `CATEGORY_${category}`)
  );
  return Markup.inlineKeyboard([
    ...splitButtons(buttons),
    [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")],
  ]);
}

function createTypeButtons(category) {
  const brands = getBrandsByCategory(category);
  const buttons = brands.map((brand) =>
    Markup.button.callback(brand, `BRAND_${category}_${brand}`)
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
    Markup.button.callback(brand, `BRAND_${category}_${brand}`)
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
function toLvl(input) {
  if (typeof input === "number") {
    return input / 100 + 1;
  } else if (typeof input === "string") {
    const inputNumber = parseFloat(input.replace(",", "."));
    if (!isNaN(inputNumber)) {
      return inputNumber / 100 + 1;
    }
  }
  return "Masukan tidak valid";
}
module.exports = (bot, sett, cek, register, settings) => {
    const { createCanvas, loadImage, registerFont } = require("canvas");
async function createInvoice (kris, bot, pesan, invoiceNo, date, produk, kode, target, username, harga, sn){
  registerFont("./resources/assets/OpenSans-Regular.ttf", { family: 'OpenSans' });
  const canvas = createCanvas(1476, 2215);
  const ctx = canvas.getContext("2d");
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.closePath();
    ctx.fill();
  }
  const loadImageAsync = (src) =>
    new Promise((resolve, reject) => {
      loadImage(src)
        .then((image) => {
          resolve(image);
        })
        .catch(reject);
    });
      function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      let line = "";
      for (let i = 0; i < text.length; i++) {
          let testLine = line + text[i]; 
          let testWidth = ctx.measureText(testLine).width;
          
          if (testWidth > maxWidth && line.length > 0) {
              ctx.fillText(line, x, y);
              line = text[i]; // Pindahkan karakter ini ke baris baru
              y += lineHeight;
          } else {
              line = testLine;
          }
      }
      ctx.fillText(line, x, y);
  }
  
  Promise.all([loadImageAsync("./resources/assets/sn-prabayar.jpg")])
    .then(([backgroundImage]) => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      //=================
      ctx.fillStyle = "#000";
ctx.font = '50px "OpenSans"'
      ctx.fillText(invoiceNo, 657, 995);
      ctx.fillText(date, 657, 1095);
      ctx.fillText(produk, 657, 1194);
      ctx.fillText(kode, 657, 1300);
      ctx.fillText(target, 657, 1400);
      ctx.fillText(username, 657, 1494);
      ctx.fillText(formatmoney(harga), 657, 1590);
      const sna = sn; // ket /sn
       const maxWidth = 1000;
      const lineHeight = 50;
      const x = 250;
      const y = 1750;
      ctx.font = '46px "OpenSans'
      wrapText(ctx, sna, x, y, maxWidth, lineHeight);

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync("./invoice1.png", buffer);
     let cs = fs.readFileSync("./invoice1.png");
     bot.telegram.sendPhoto(
      kris.from.id,
      { source: cs }, // File atau URL foto
      {
        caption: pesan,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Customer Service",
                url: `${settings.ownerurl}`,
              },
            ],
          ],
        },
      }
    );
      fs.unlinkSync("./invoice1.png");
    })
    .catch((err) => {
      console.log(err);
    });
}
  bot.command("setprofit", (kris) => {
    const message = kris.message.text;
    const p = message.split(" ");
    const dataFile = path.join(__dirname, "../resources/database/profit.json")
    const data = JSON.parse(
      fs.readFileSync(dataFile)
    );
    if (
      p[1] === "Member" ||
      p[1] === "Silver" ||
      p[1] === "Gold" ||
      p[1] === "Agen"
    ) {
      const newValue = toLvl(p[2]);
      if (isNaN(newValue)) {
        return kris.reply("Harap masukkan angka yang valid.");
      }
      data.profit[p[2]] = newValue;
      data.output[p[2]] = p[2
                           
                           ] + "%";
      fs.writeFileSync(
        dataFile,
        JSON.stringify(data, null, 2)
      );
      kris.reply(
        `Profittt untuk tipe pengguna "${p[1]}" berhasil diupdate menjadi ${p[2]}%.`
      );
    } else {
      kris.reply(
        'Tipe pengguna tidak valid. Gunakan salah satu dari "Member", "Silver", "Gold", "Agen\n\nContoh Penggunaan\n.setprofit member 10(yaitu keuntungan 10%)'
      );
    }
  })
  bot.action("PRABAYAR", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);

    sendCategoryButtons(kris);
  });
  // Event handler untuk kategori
  bot.action(/CATEGORY_(.+)/, (ctx) => {
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
  bot.action(/BRAND_(.+)_(.+)/, (ctx) => {
    const [category, brand] = ctx.match.slice(1);
    function getBrandsByCategory(category, brand) {
      const brands = products
        .filter(
          (product) => product.category === category && product.brand === brand
        )
        .map((product) => product.type);
      return [...new Set(brands)]; // Menghapus duplikasi
    }
    function createBrandButtons(brand, category) {
      const brands = getBrandsByCategory(category, brand);
      const buttons = brands.map((type) =>
        Markup.button.callback(type, `PRODUK_${category}_${brand}_${type}`)
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
  bot.action(/PRODUK_(.+)_(.+)_(.+)/, (ctx) => {
    const [category, brand, type] = ctx.match.slice(1);
    function createProductButtons(filteredProducts) {
      // Buat tombol produk, satu per baris
      const productButtons = filteredProducts.map((product) => [
        Markup.button.callback(
          product.product_name,
          `DETAILPRODUK_${product.buyer_sku_code}`
        ),
      ]);

      // Tambahkan tombol Back di bagian bawah
      productButtons.push([
        Markup.button.callback("⬅️ Back", `BACK_TO_PREVIOUS_MENU`),
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
    const filteredProducts = products
        .filter((product) => product.category === category && product.brand === brand && product.type === type)
        .sort((a, b) => a.price - b.price); // Urutkan harga dari kecil ke besar
    sendProductButtons(ctx, filteredProducts);
  });
  bot.action("BACK_TO_PREVIOUS_MENU", (ctx) => {
    sendCategoryButtons(ctx);
  });
  //  ====

  // Event handler untuk tombol produk
  bot.action(/^SELECT_(.+)$/, (ctx) => {
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
      ctx.editMessageText(
        "Halo kak silahkan pilih opsi di Bawah ini.",
        Markup.inlineKeyboard([
          [Markup.button.callback("DETAIL PRODUK", `DETAILPRODUK_${skuCode}`)],
          [Markup.button.callback("ORDER PRODUK", `SELECTORDER_${skuCode}`)],
          [
            Markup.button.callback(
              "KEMBALI",
              `PRODUK_${product.category}_${product.brand}_${product.type}`
            ),
          ],
        ])
      );
    } else {
      ctx.editMessageText("Produk tidak ditemukan.");
    }
  });
  bot.action(/^DETAILPRODUK_(.+)$/, (ctx) => {
      const userId = ctx.from.id

      
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
        const harga = hitungHargaRole(cek, product.price, userId);
      let pesan = ` DETAIL PRODUK

Produk: ${product.product_name}
Kode: ${product.buyer_sku_code}
Status: 
Harga: ${formatmoney(harga)}
Desc: ${product.desc}

Untuk Melakukan Pesanan Silahkan Pilih Opsi ORDER PRODUK
`;
      ctx.editMessageText(
        pesan,
        Markup.inlineKeyboard([
          [Markup.button.callback("ORDER PRODUK", `SELECTORDER_${skuCode}`)],
          [
            Markup.button.callback(
              "KEMBALI",
              `PRODUK_${product.category}_${product.brand}_${product.type}`
            ),
          ],
        ])
      );
    } else {
      ctx.editMessageText("Produk tidak ditemukan.");
    }
  });
  bot.action(/^SELECTORDER_(.+)$/, (ctx) => {
    const skuCode = ctx.match[1];
    const product = products.find((p) => p.buyer_sku_code === skuCode);
    if (product) {
      const userId = ctx.from.id
      const harga = hitungHargaRole(cek, product.price, userId);
      if (Number(cek("saldo", ctx.from.id)) < Number(harga))
        return ctx.editMessageText(
          "Saldo Anda tidak cukup untuk melakukan transaksi"
        );
      userOrders[ctx.from.id] = {
        product,
        price: harga,
        username: '',
        status: "waiting_for_target_number", // Status untuk menunggu nomor target
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

  bot.action("CONFIRM_ORDER", (ctx) => {
    const userId = ctx.from.id;
    if (
      userOrders[userId] &&
      userOrders[userId].status === "waiting_for_confirmation"
    ) {
      const order = userOrders[userId];
      if (Number(cek("saldo", userId)) < Number(order.product.price)) {
        return ctx.reply(
          "Mohon maaf, saldo Anda tidak cukup untuk melakukan transaksi produk ini."
        );
      }
      if (cek("saldo", userId) === null) {
        return ctx.reply("Kamu tidak memiliki saldo, silahkan deposit.");
      }
      const kode = order.product.buyer_sku_code;
      const produk = order.product.product_name;
      const tujuan = order.targetNumber;
         const username = order.username;
      const reff = short.generate();
      const harga = Number(order.price);
      const waktu = cekWaktu();
      sett("-saldo", userId, harga);
      const signature = crypto
        .createHash("md5")
        .update(settings.digiflazz.username + settings.digiflazz.apikey + reff)
        .digest("hex");
      const config = {
        method: "POST",
        url: "https://api.digiflazz.com/v1/transaction",
        data: {
          username: settings.digiflazz.username,
          buyer_sku_code: kode,
          customer_no: tujuan,
          ref_id: reff,
          sign: signature,
        },
      };
      axios(config)
        .then(async (res) => {
          ctx.editMessageText("「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」");
          let status = res.data.data.status;
          while (status !== "Sukses") {
            await sleep(1000);
            let response = await axios(config);
            status = response.data.data.status;
            if (status == "Gagal") {
              sett("+saldo", userId, harga);
              console.log("Transaksi Gagal");
              saveDataTransactions(
                userId,
                reff,
                cekWaktu(),
                produk,
                kode,
                "-",
                "Saldo KRS-TOPUP",
                tujuan,
                harga,
                harga,
                response.data.data.price,
                response.data.data.sn,
                "Gagal",
                response.data.data.message
              );
              let gag = `═══════ ${settings.storename} ═══════ 
❌〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗚𝗔𝗚𝗔𝗟 〕❌

 User ID : ${userId}
══════════════════════
 𝘛𝘳𝘹 𝘐𝘋 : ${reff}
 Produk : ${produk}
 Tujuan : ${tujuan}
 Username : 
 Harga : ${formatmoney(harga)}
═══════ MESSAGE ════════  
${response.data.data.message}
══════════════════════
Maaf transaksi anda gagal
cobalah beberapa saat lagi atau
hubungi admin dengan cara klik
tombol dibawah ini
══════════════════════`;
              ctx.reply(
                gag,
                Markup.inlineKeyboard([
                  [
                    Markup.button.url(
                      "Customer Service",
                      `${settings.ownerurl}`
                    ),
                  ],
                ])
              );

              break;
            }
            if (status == "Sukses") {
              let ownn = `═══════ ${settings.storename} ═══════ 
✅〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗦𝗨𝗞𝗦𝗘𝗦 〕✅

 User ID : ${userId}
 Saldo User : ${formatmoney(cek("saldo", userId))}
══════════════════════
 𝘛𝘳𝘹 𝘐𝘋 : ${reff}
 Produk : ${produk}
 Tujuan : ${tujuan}
 Username : 
 Harga : ${formatmoney(harga)}
═════ SERIAL NUMBER ══════
${response.data.data.sn}
══════════════════════
 Terimakasih sudah bertransaksi di
 ${settings.storename}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;
              const keyboard = Markup.inlineKeyboard([
                [Markup.button.url("Chat User", `tg://user?id=${ctx.from.id}`)],
              ]);
              ctx.telegram.sendMessage(settings.invoice, ownn, {
                reply_markup: keyboard.reply_markup,
              });

              let date = cekWaktu();
              let gglx = `═══════ ${settings.storename} ═══════ 
✅〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗦𝗨𝗞𝗦𝗘𝗦 〕✅

 User ID : ${userId}
 Saldo User : ${formatmoney(cek("saldo", userId))}
══════════════════════
 𝘛𝘳𝘹 𝘐𝘋 : ${reff}
 Produk : ${produk}
 Tujuan : ${tujuan}
 Username : 
 Harga : ${formatmoney(harga)}
═════ SERIAL NUMBER ══════
${response.data.data.sn}
══════════════════════
 Terimakasih sudah bertransaksi di
 ${settings.storename}
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;

            createInvoice(ctx, bot, gglx, reff, date, produk, kode, tujuan, username, harga, response.data.data.sn)
              saveDataTransactions(
                userId,
                reff,
                date,
                produk,
                kode,
                "-",
                "Saldo KRS-TOPUP",
                tujuan,
                harga,
                harga,
                response.data.data.price,
                response.data.data.sn,
                "Sukses",
                response.data.data.message
              );

              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            console.error(error);
            saveDataTransactions(
              userId,
              reff,
              cekWaktu(),
              produk,
              kode,
              "-",
              "Saldo KRS-TOPUP",
              tujuan,
              harga,
              harga,
              error.response.data.data.price,
              error.response.data.data.sn,
              "Gagal",
              error.response.data.data.message
            );
            let ggl = `═══════ ${settings.storename} ═══════
❌〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗚𝗔𝗚𝗔𝗟 〕❌

 User ID : ${userId}
══════════════════════
 𝘛𝘳𝘹 𝘐𝘋 : ${reff}
 Produk : ${produk}
 Tujuan : ${tujuan}
 Username : 
 Harga : ${formatmoney(harga)}
═══════ MESSAGE ════════
${error.response.data.data.message}
══════════════════════
Maaf transaksi anda gagal
cobalah beberapa saat lagi atau
hubungi admin dengan cara klik
tombol dibawah ini
══════════════════════`;

            ctx.editMessageText(
              ggl,
              Markup.inlineKeyboard([
                [Markup.button.url("Customer Service", `${settings.ownerurl}`)],
              ])
            );
            sett("+saldo", userId, harga);
          }
        });

      delete userOrders[userId];
    } else {
      ctx.reply("Tidak ada pesanan yang perlu dikonfirmasi.");
    }
  });

  // Menangani pembatalan pesanan
  bot.action("CANCEL_ORDER", (ctx) => {
    const userId = ctx.from.id;

    // Mengecek jika user memiliki pesanan yang valid
    if (
      userOrders[userId] &&
      userOrders[userId].status === "waiting_for_confirmation"
    ) {
      // Membatalkan pesanan
      ctx.editMessageText("Pesanan Anda telah dibatalkan.");

      // Menghapus pesanan yang dibatalkan
      delete userOrders[userId];
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
