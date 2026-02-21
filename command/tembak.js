const axios = require("axios");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { Markup } = require("telegraf");
const { formatmoney } = require("../resources/lib/function");
const moment = require('moment-timezone')
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const { hitungHargaRolePaket } = require('../resources/lib/function')
const products = JSON.parse(fs.readFileSync('./resources/database/tembakdata.json', "utf-8"));
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
const { userOrdersPaket } = require("../resources/lib/session");
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
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    let metrics;
    let testWidth;
    for (let n = 0; n < words.length; n++) {
      testLine = line + words[n] + " ";
      metrics = ctx.measureText(testLine);
      testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
  Promise.all([loadImageAsync("./resources/assets/sn-akrab.jpg")])
    .then(([backgroundImage]) => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      //=================
      ctx.fillStyle = "#000";
ctx.font = '50px "OpenSans"'
      ctx.fillText(invoiceNo, 655, 992);
      ctx.fillText(date, 655, 1092);
      ctx.fillText(produk, 655, 1193);
      ctx.fillText(target, 655, 1295);
      ctx.fillText(formatmoney(harga), 655, 1394);
      const sna = sn; // ket /sn
      const maxWidth = 700;
      const lineHeight = 50;
      const x = 655;
      const y = 1495;
      ctx.font = '50px "OpenSans"'
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
  bot.command("gettembakdata", (kris) => {
  const axios = require('axios');
  const FormData = require('form-data');
  const fs = require('fs');
  const requestUrl = 'https://panel.khfy-store.com/api/khfy_v2/member/list_paket_v1';
  const DATABASE_FILE = './resources/database/tembakdata.json';

  // Membuat instance FormData dan menambahkan data
  const form = new FormData();
  form.append('token', '70b00bb0-893a-11ef-9dcc-539834b1bff7');

  // Mengirim request POST menggunakan FormData
  async function fetchAndUpdateData() {
    try {
      const response = await axios.post(requestUrl, form, {
        headers: {
          ...form.getHeaders(), // Menambahkan header FormData yang diperlukan
        },
      });

      if (response.data.status === true) {
        const updatedData = JSON.stringify(response.data.data, null, 2);
        fs.writeFileSync(DATABASE_FILE, updatedData, 'utf-8');
        kris.reply('Data berhasil diperbarui di database.json');
      } else {
        kris.reply("Gagal mengambil produk");
      }
    } catch (error) {
      console.error('Gagal memperbarui data:', error.response ? error.response.data : error.message);
    }
  }

  fetchAndUpdateData();
});

    bot.action("TEMBAK_DATA", (ctx) => {
      const [category, brand, type] = ctx.match.slice(1);
      function createProductButtons(filteredProducts) {
        const productButtons = filteredProducts.map((product) => [
          Markup.button.callback(
            product.nama,
            `DETAILPRODUKPAKET_${product.package_id}`
          ),
        ]);
        productButtons.push([
          Markup.button.callback("⬅️ Back", `BACK_TO_PREVIOUS_MENU`),
        ]);
        productButtons.push([
          Markup.button.callback("🛒 Cek Stok", `STOK_PAKET`), // Tombol baru untuk cek stok
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
          product.brand === brand &&
          product.type === type
      );
  
      sendProductButtons(ctx, filteredProducts);
    });
 bot.action("STOK_PAKET", (kris) => {
  const requestUrl = "https://panel.khfy-store.com/api/api-xl-v7/cek_stock_akrab";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    Origin: "https://panel.khfy-store.com",
    Referer: "https://panel.khfy-store.com/paket_data.html",
  };

  async function checkStock() {
    try {
      const response = await axios.post(requestUrl, null, { headers });

      const { status, message } = response.data;

      if (status && message) {
        const formatted = `📦 *Stok Paket Akrab:*\n\n${message.trim()}`;

        kris.editMessageText(formatted, {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [Markup.button.callback("⬅️ Back", "TEMBAK_DATA")],
          ]),
        });
      } else {
        kris.editMessageText("❌ Tidak ada data stok tersedia.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      kris.editMessageText("❌ Gagal mengambil data stok.");
    }
  }

  checkStock();
});
     bot.action(/^DETAILPRODUKPAKET_(.+)$/, (ctx) => {
        const skuCode = ctx.match[1];
        const product = products.find((p) => p.package_id === skuCode);
        if (product) {
          const userId = ctx.from.id;
          const harga = hitungHargaRolePaket(settings, cek, product.harga, userId, product.nama);
          let pesan = ` DETAIL PRODUK
    
    Produk: ${product.nama}
    Kode: ${product.package_id}
    Status: 
    Harga: ${formatmoney(harga)}
    Desc: ${product.deskripsi}
    
    Untuk Melakukan Pesanan Silahkan Pilih Opsi ORDER PRODUK
    `;
          ctx.editMessageText(
            pesan,
            Markup.inlineKeyboard([
              [Markup.button.callback("ORDER PRODUK", `SELECTORDERPAKET_${skuCode}`)],
              [
                Markup.button.callback(
                  "KEMBALI",
                  `TEMBAK_DATA`
                ),
              ],
            ])
          );
        } else {
          ctx.editMessageText("Produk tidak ditemukan.");
        }
      });
      bot.action(/^SELECTORDERPAKET_(.+)$/, (ctx) => {
        const skuCode = ctx.match[1];
        const product = products.find((p) => p.package_id === skuCode);
        if (product) {
          const userId = ctx.from.id;
          const harga = hitungHargaRolePaket(settings, cek, product.harga, userId, product.nama);
          if (Number(cek("saldo", ctx.from.id)) < Number(harga))
            return ctx.editMessageText(
              "Saldo Anda tidak cukup untuk melakukan transaksi"
            );
  
            userOrdersPaket[userId] = {
            product,
            harga: harga,
            status: "waiting_for_target_number", 
          };
          ctx.editMessageText(
            "Silakan kirimkan nomor tujuan",
            Markup.inlineKeyboard([
              [Markup.button.callback("❌ Batalkan", "CANCEL_ORDER")],
            ])
          );
        } else {
          ctx.editMessageText("Produk tidak ditemukan.");
        }
      });
      bot.action("CANCEL_ORDER_PAKET", (ctx) => {
        const userId = ctx.from.id;
        if (
          userOrdersPaket[userId] &&
          userOrdersPaket[userId].status === "waiting_for_confirmation"
        ) {
          ctx.editMessageText("Pesanan Anda telah dibatalkan.");
          delete userOrdersPaket[userId];
        } else {
          ctx.editMessageText("Tidak ada pesanan yang perlu dibatalkan.");
        }
      });
  
    bot.action("CONFIRM_ORDER_PAKET", (ctx) => {
  const userId = ctx.from.id;
  if (
    userOrdersPaket[userId] &&
    userOrdersPaket[userId].status === "waiting_for_confirmation"
  ) {
    const order = userOrdersPaket[userId];
    const harga = Number(order.harga);
    if (Number(cek("saldo", userId)) < Number(order.harga)) {
      return ctx.reply(
        "Mohon maaf, saldo Anda tidak cukup untuk melakukan transaksi produk ini."
      );
    }
    if (cek("saldo", userId) === null) {
      return ctx.reply("Kamu tidak memiliki saldo, silahkan deposit terlebih dahulu");
    }
    sett("-saldo", userId, harga);
    ctx.editMessageText('「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」')

    const axios = require('axios');
    const FormData = require('form-data'); // Import FormData
    const chalk = require('chalk');
    
    const form = new FormData();
    form.append('token', '70b00bb0-893a-11ef-9dcc-539834b1bff7');
    form.append('package_id', order.product.package_id);
    form.append('msisdn', order.targetNumber);

    const config = {
      method: 'post',
      url: 'https://panel.khfy-store.com/api/khfy_v2/member/buy_v1_no_otp',
      headers: {
        ...form.getHeaders(), // Menggunakan headers dari FormData
        'Authorization': 'Bearer 70b00bb0-893a-11ef-9dcc-539834b1bff7',
      },
      data: form,
    };

    axios(config)
      .then(response => {
        if (response.data.status === true) {
          let ownn = `═══════ ${settings.storename} ═══════ 
✅〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗦𝗨𝗞𝗦𝗘𝗦 〕✅
                
User ID : ${userId}
Username: @${ctx.from.username}
Saldo User : ${formatmoney(cek("saldo", userId))}
══════════════════════
𝘛𝘳𝘩 𝘐𝘋 : ${response.data.data.trx_id}
Produk : ${response.data.data.package_name}
Tujuan : ${order.targetNumber}
Harga : ${formatmoney(harga)}
═════ SERIAL NUMBER ══════
${response.data.data.parent}
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

          let gglx = `═══════ ${settings.storename} ═══════ 
✅〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗦𝗨𝗞𝗦𝗘𝗦 〕✅
                
User ID : ${userId}
Saldo User : ${formatmoney(cek("saldo", userId))}
══════════════════════
𝘛𝘳𝘩 𝘐𝘋 : ${response.data.data.trx_id}
Produk : ${response.data.data.package_name}
Tujuan : ${order.targetNumber}
Username : 
Harga : ${formatmoney(harga)}
═════ SERIAL NUMBER ══════
${response.data.data.parent}
══════════════════════
Terimakasih sudah bertransaksi di
${settings.storename}

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`;

          createInvoice(
            ctx,
            bot,
            gglx,
            response.data.data.trx_id,
            cekWaktu(),
            response.data.data.package_name,
            order.product.package_id,
            order.targetNumber,
            '-',
            harga,
            response.data.data.parent
          );

          saveDataTransactions(
            userId,
            response.data.data.trx_id,
            cekWaktu(),
            response.data.data.package_name,
            order.product.package_id,
            "-",
            "Saldo KRS-TOPUP",
            order.targetNumber,
            harga,
            harga,
            response.data.data.harga,
            response.data.data.parent,
            "Sukses",
            'Sukses'
          );
        } else {
          sett("+saldo", userId, harga);
          let gag = `═══════ ${settings.storename} ═══════ 
❌〔 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗚𝗔𝗚𝗔𝗟 〕❌
                
User ID : ${userId}
══════════════════════
𝘛𝘳𝘩 𝘐𝘋 : 
Produk : ${order.product.nama}
Tujuan : ${order.targetNumber}
Username : 
Harga : ${formatmoney(harga)}
═══════ MESSAGE ════════  
${response.data.message}
══════════════════════
Maaf transaksi anda gagal
cobalah beberapa saat lagi atau
hubungi admin dengan cara klik
tombol dibawah ini
══════════════════════`;

          ctx.reply(
            gag,
            Markup.inlineKeyboard([
              [Markup.button.url("Customer Service", `${settings.ownerurl}`)],
            ])
          );
        }
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });

    delete userOrdersPaket[userId];
  } else {
    ctx.reply("Tidak ada pesanan yang perlu dikonfirmasi.");
  }
});

}