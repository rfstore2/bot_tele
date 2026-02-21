const { Telegraf, Markup } = require("telegraf");
const moment = require("moment-timezone");
const fs = require('fs')
const path = require('path')
const chokidar = require("chokidar");
const chalk = require('chalk')
const { formatmoney } = require("../resources/lib/function");
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
module.exports = (bot, settings, sett, cek, register) => {
  bot.command("start", (ctx) => {
    const chatId = ctx.from.id;
    if (cek("id", chatId) == null) return register(ctx, chatId);
    const userName = ctx.from.first_name || "Pengguna";
    let ss = `Saya adalah ${settings.bot_name} penjual pulsa dan kuota yang siap membantu Anda melakukan transaksi pembelian dengan mudah dan cepat. Berikut adalah beberapa layanan yang saya sediakan:

1. Beli Pulsa: Anda dapat membeli pulsa dengan berbagai nominal langsung melalui saya.
2. Beli Paket Data/Kuota: Tersedia berbagai pilihan paket data atau kuota internet dari berbagai provider.
3. Beli Voucher Game: Saya juga menyediakan voucher untuk game-game favorit Anda.
4. Top Up Games: Lakukan top up untuk berbagai game populer dengan cepat dan aman.
5. Masa Aktif: Anda bisa mengecek masa aktif pulsa dan kuota yang Anda miliki.
6. Token PLN: Mudah membeli token listrik PLN untuk kebutuhan sehari-hari.
7. Cek Tagihan: Lakukan pengecekan tagihan PPOB seperti listrik, PDAM, dan lainnya.
8. Histori Transaksi: Melihat histori transaksi pembelian yang telah Anda lakukan.


Untuk memulai, silakan pilih salah satu menu atau ketikkan pesanan Anda.

Selamat berbelanja!`;
ctx.reply(
  "Halo",
  Markup.keyboard([
    ["🛍️ Menu TopUp"],
    ["💰 Cek Saldo", "💳 Deposit"],
    ["📑 Riwayat Transaksi", "📑 Riwayat Deposit"],
  ])
    .resize()
    .oneTime()
);
    ctx.reply(ss
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