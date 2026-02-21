const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require('chalk')
const moment = require("moment-timezone");
const { formatmoney } = require("../resources/lib/function");
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
module.exports = (bot, cek, register) => {
  bot.hears("💰 Cek Saldo", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    var pesan = `
──「 INFORMASI AKUN USER  」───

Username: ${userName}
Id: ${chatId}
Role: ${cek("role", chatId)}
Saldo: ${formatmoney(cek("saldo", chatId))}

Berikut ini detail informasi akun anda
    `;
kris.reply(pesan)
  });
};
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});