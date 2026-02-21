const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require('chalk')
const moment = require("moment-timezone");
const { formatmoney } = require("../resources/lib/function");
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
module.exports = (bot, cek, register, settings) => {
  bot.hears("📑 Riwayat Deposit", (kris) => {
    const pathfile = path.join(__dirname, "../resources/database/deposits.json")
  });
  bot.command("rekap", (kris) => {
     const filePath = path.join(__dirname, "../resources/database/transaction.json")
     try {
       const fileData = fs.readFileSync(filePath, "utf8");
       const allUserData = JSON.parse(fileData);

       if (allUserData.length === 0) {
         return reply("Tidak Ditemukan Data Transaksi");
       }
       const buyerMap = new Map();
       let overallTotalHarga = 0;
       let overallTotalHargaModal = 0;
       let overallTotalProfit = 0;
       let overallTotalTransactions = 0;
       allUserData.forEach((data) => {
         const buyerWithoutSuffix = kris.from.id
         overallTotalHarga += parseFloat(data.harga);
         overallTotalTransactions += 1;

         // Calculate totalHargaModal as the sum of harga_modal for each transaction
         const hargaModal = parseFloat(data.harga_modal);
         overallTotalHargaModal += isNaN(hargaModal) ? 0 : hargaModal;

         // Calculate profit for each transaction
         const profit =
           parseFloat(data.harga) - (isNaN(hargaModal) ? 0 : hargaModal);
         overallTotalProfit += profit;

         // Check if buyer is already in the map
         if (buyerMap.has(buyerWithoutSuffix)) {
           // Update existing buyer's total transactions, total harga, total harga modal, and total profit
           const buyerInfo = buyerMap.get(buyerWithoutSuffix);
           buyerInfo.totalTransactions += 1;
           buyerInfo.totalHarga += parseFloat(data.harga);
           buyerInfo.totalHargaModal += isNaN(hargaModal) ? 0 : hargaModal;
           buyerInfo.totalProfit += profit;
         } else {
           // Add new buyer to the map
           buyerMap.set(buyerWithoutSuffix, {
             totalTransactions: 1,
             totalHarga: parseFloat(data.harga),
             totalHargaModal: isNaN(hargaModal) ? 0 : hargaModal,
             totalProfit: profit,
           });
         }
       });

       const sortedBuyerList = Array.from(buyerMap).sort(
         (a, b) => b[1].totalProfit - a[1].totalProfit
       );
       const formattedOverallTotalHarga = new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
       }).format(overallTotalHarga);
       const formattedOverallTotalHargaModal = new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
       }).format(overallTotalHargaModal);
       const formattedOverallTotalProfit = new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
       }).format(overallTotalProfit);
       const buyerList = sortedBuyerList.map(([buyer, info]) => {
         const formattedTotalHarga = new Intl.NumberFormat("id-ID", {
           style: "currency",
           currency: "IDR",
         }).format(info.totalHarga);
         const formattedTotalHargaModal = new Intl.NumberFormat("id-ID", {
           style: "currency",
           currency: "IDR",
         }).format(info.totalHargaModal);
         const formattedTotalProfit = new Intl.NumberFormat("id-ID", {
           style: "currency",
           currency: "IDR",
         }).format(info.totalProfit);

         return `> User : ${buyer}\n> Total Transaksi : ${info.totalTransactions}\n> Omset : ${formattedTotalHarga}\n> Modal : ${formattedTotalHargaModal}\n> Profit : ${formattedTotalProfit}\n`;
       });
       const replyMessage = `*[ REKAP TRANSAKSI MEMBER ]*\n\nTotal Transaksi : ${overallTotalTransactions}\nOmset:  ${formattedOverallTotalHarga}\nModal : ${formattedOverallTotalHargaModal}\nProfit : ${formattedOverallTotalProfit}\n\n${buyerList.join(
         "\n"
       )}`;

       kris.reply(replyMessage);
     } catch (error) {
       console.error("Error reading the transaction history file:", error);
       kris.reply("Error, Tidak dapat membaca data");
     }
  })
  bot.hears("📑 Riwayat Transaksi", (kris) => {
    const pathfile = path.join(__dirname, "../resources/database/transaction.json")
     try {
       const fileData = fs.readFileSync(pathfile, "utf8");
       const allUserData = JSON.parse(fileData);
       const userData = allUserData.filter((data) => data.buyer === kris.from.id);
       if (userData.length === 0) {
         return reply(
           "Kamu belum memiliki riwayat transaksi. Jika ingin melakukan transaksi silahkan ketik .menu"
         );
       }
       let totalHarga = 0;
       let totalTransactions = userData.length;
       userData.forEach((data) => {
         totalHarga += parseFloat(data.harga);
       });
       const historyText = userData.map((data, index) => {
         const formattedHarga = new Intl.NumberFormat("id-ID", {
           style: "currency",
           currency: "IDR",
         }).format(data.harga);
         return `#Transaksi Ke-${index + 1}:\n> Produk : ${
           data.produk
         }\n> Reff ID : ${data.ref_id}\n> Tujuan: ${
           data.tujuan
         }\n> Harga: ${formattedHarga}\n> Waktu: ${data.date} | ${
           data.jam
         }\n> Invoice: _${data.sn}_\n`;
       });
       const formattedTotalHarga = new Intl.NumberFormat("id-ID", {
         style: "currency",
         currency: "IDR",
       }).format(totalHarga);
       const replyMessage = `*[ RIWAYAT TRANSAKSI ]*

*Total Transaksi:* ${totalTransactions}
*Jumlah Transaksi:* ${formattedTotalHarga}

${historyText.join("\n")}`;

       kris.reply(replyMessage);
     } catch (error) {
       console.error("Error reading the transaction history file:", error);
       kris.reply("Ada Masalah ketika membaca data, silahkan hubungi owner.");
     }
  });
  bot.action('TOPUPMENU', (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    var pesan = `${settings.storename}
Halo Kak 👋 ${userName} ${ucapanWaktu}

──•❉ ${settings.storename} ❉•──
𝐍𝐚𝐦𝐚 : ${userName}
𝐍𝐨𝐦𝐨𝐫 : ${chatId}
𝐒𝐚𝐥𝐝𝐨 : ${formatmoney(cek("saldo", chatId))}
𝐑𝐨𝐥𝐞 : ${cek("role", chatId)}
${settings.storename}
    `;
    kris.reply(
      pesan,
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Prabayar", "PRABAYAR"),
          Markup.button.callback("Pascabayar", "PASCABAYAR"),
        ],
        [ Markup.button.callback("Paket Akrab", "TEMBAK_DATA")],
        [Markup.button.url("Contact Owner", settings.ownerurl)],
      ])
    );
  });
  bot.hears("🛍️ Menu TopUp", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    var pesan = `${settings.storename}
Halo Kak 👋 ${userName} ${ucapanWaktu}

──•❉ ${settings.storename} ❉•──
𝐍𝐚𝐦𝐚 : ${userName}
𝐍𝐨𝐦𝐨𝐫 : ${chatId}
𝐒𝐚𝐥𝐝𝐨 : ${formatmoney(cek("saldo", chatId))}
𝐑𝐨𝐥𝐞 : ${cek("role", chatId)}
${settings.storename}
    `;
    kris.reply(
      pesan,
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Prabayar", "PRABAYAR"),
          Markup.button.callback("Pascabayar", "PASCABAYAR"),
        ],
        [ Markup.button.callback("Paket Akrab", "TEMBAK_DATA")],
        [Markup.button.url("Contact Owner", settings.ownerurl)],
      ])
    );
  });
  bot.action("BACK_TO_MENU", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    var pesan = `${settings.storename}
Halo Kak 👋 ${userName} ${ucapanWaktu}

──•❉ ${settings.storename} ❉•──
𝐍𝐚𝐦𝐚 : ${userName}
𝐍𝐨𝐦𝐨𝐫 : ${chatId}
𝐒𝐚𝐥𝐝𝐨 : ${formatmoney(cek("saldo", chatId))}
𝐑𝐨𝐥𝐞 : ${cek("role", chatId)}
${settings.storename}
    `;
    kris.editMessageText(
      pesan,
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Prabayar", "PRABAYAR"),
          Markup.button.callback("Pascabayar", "PASCABAYAR"),
        ],
        [ Markup.button.callback("Paket Akrab", "TEMBAK_DATA")],
        [Markup.button.url("Contact Owner", settings.ownerurl)],
      ])
    );
  });
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});