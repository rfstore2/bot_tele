const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment-timezone");
const axios = require('axios')
const { formatmoney, formatMoney, expiredTime } = require("../resources/lib/function");
const { SessionDeposit, SaveSessionTrx } = require('../resources/lib/session')
const pathDeposit = path.join(__dirname, "../resources/database/deposit/")
const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
const kodetrx = path.join(__dirname, "../resources/database/kodetrx.json")
const kodun = path.join(__dirname, "../resources/database/kodeunik.json");
const depp = path.join(__dirname, "../resources/database/deposits.json")
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
async function Hahsjsjsjsjsj(kris, 
 opa,
 depo_id,
  nominal,
  total,
  unik,
  sett,
  cek,
  settings
) {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://gateway.okeconnect.com/api/mutasi/qris/${settings.okeconnect.merchant}/${settings.okeconnect.signature}`,
      headers: {},
    };
    const response = await axios(config);
    const data = response.data;
    const transaksi = data?.data || [];
    if (!Array.isArray(transaksi)) {
      throw new Error("Data transaksi tidak valid");
    }
    let found = false;
    const depositNumber = parseFloat(total);
    const now = new Date();
    for (const item of transaksi) {
      const amountNumber = parseFloat(item.amount);
      const transactionDate = new Date(item.date);
        const timeLimit = 25; // 5 menit
      const timeDifference = (now - transactionDate) / 1000 / 60;
      if (amountNumber === depositNumber) {
         
        found = true;
        const DepositAcc = parseFloat(nominal);
        sett("+saldo", kris.from.id, DepositAcc);
        const slo = cek("saldo", kris.from.id);
        let pesan = `📑〔 DEPOSIT SUKSES 〕📑

UserId: ${kris.from.id}
DepoID: ${depo_id}
Amount: ${nominal}
Unik: ${unik}
Total: ${total}
Saldo: ${cek("saldo", kris.from.id)}

Halo kak deposit anda berhasil`
       
        kris.reply(pesan)
        const trxFilePath = path.join(
          __dirname,
          "../resources/database/deposits.json"
        );
        const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, "utf8"));
        const newTransactionData = {
          buyer: kris.from.chat,
          status: "Berhasil",
          ref_id: depo_id,
          date: cekWaktu(),
          saldo_diterima: DepositAcc,
          total_bayar: depositNumber
        };
        trxUserData.push(newTransactionData);
        fs.writeFileSync(
          trxFilePath,
          JSON.stringify(trxUserData, null, 2),
          "utf8"
        );
        const userName = kris.from.username || kris.from.first_name;
        let ss = `💰 Deposit Baru Diterima!

👤 Nama Pengguna: ${userName}
🧷 ID Telegram: ${kris.from.id}
💸 Jumlah Deposit: ${formatmoney(nominal)}
⌛ Waktu Transaksi: ${cekWaktu()}

📌 Status: Berhasil`
      delete SessionDeposit[kris.from.id];
     kris.telegram.deleteMessage(kris.from.id, opa);     
     kris.telegram.sendMessage(settings.invoice, ss);     
    }
          
    }
    if (!found) {
      kris.answerCbQuery("Deposit Anda Masih Pending silahkan Melakukan pembayaran terlebih dahulu", {
        show_alert: true,
    });
    }
  } catch (error) {
    kris.answerCbQuery("Server sedang gangguan silahkan coba lagi nanti", {
      show_alert: true,
    })
      console.log(error)
    }
  }


let timers = {};
function deleteTransaction(chatId, depo_id) {
  // Periksa apakah transaksi dengan chatId ada
  if (timers[chatId] && timers[chatId][depo_id]) {
    clearTimeout(timers[chatId][depo_id]); // Hentikan timer
    delete timers[chatId][depo_id]; // Hapus transaksi spesifik berdasarkan depo_id

    // Jika semua transaksi untuk chatId sudah habis, hapus chatId
    if (Object.keys(timers[chatId]).length === 0) {
      delete timers[chatId];
    }

    console.log(
      `Transaksi dengan ID ${depo_id} untuk Chat ID ${chatId} berhasil dihapus.`
    );
  } else {
    console.log(
      `Transaksi dengan ID ${depo_id} untuk Chat ID ${chatId} tidak ditemukan.`
    );
  }
}
async function handleExpired(depositId, ctx) {
  if (SessionDeposit[depositId]) {
      console.log(`Deposit ${depositId} telah expired.`);
      ctx.reply(`⚠️ Deposit dengan ID ${depositId} telah expired karena tidak dilakukan pembayaran.`);
      await ctx.deleteMessage(SessionDeposit[ctx.from.id].transactionDetails.opa);
            delete SessionDeposit[depositId];
  }
}
function getCurrentTimePlusFiveMinutes() {
  const now = new Date();
  return new Date(now.getTime() + 5 * 60000).toISOString();
}
function isDateExceeded(date) {
  const currentTime = new Date();
  const transactionTime = new Date(date);
  const differenceInMinutes = (currentTime - transactionTime) / 60000;
  return differenceInMinutes > 5;
}
function getNextKodeUnik(nominal) {
  let transaksiData = JSON.parse(
    fs.readFileSync(kodetrx)
  );
  let kodeUnikList = transaksiData.kode_unik.filter(
    (item) => item.nominal === nominal
  );
  if (kodeUnikList.length >= 10000) {
    kodeUnikList.sort((a, b) => new Date(a.date) - new Date(b.date));
    let kodeUnikToReuse = kodeUnikList[0].kode_unik;
    transaksiData.kode_unik = transaksiData.kode_unik.filter(
      (item) => item.kode_unik !== kodeUnikToReuse
    );
    fs.writeFileSync(
      kodetrx,
      JSON.stringify(transaksiData)
    );
    return kodeUnikToReuse;
  }
  let lastKodeUnik =
    kodeUnikList.length > 0
      ? Math.max(...kodeUnikList.map((item) => item.kode_unik))
      : 0;
  return lastKodeUnik + 1;
}
function addTransaction(userid, kodeUnik, nominal, status = "pending") {
  let transaksiData = JSON.parse(
    fs.readFileSync(kodetrx)
  );
  transaksiData.kode_unik.push({
    buyer: userid,
    kode_unik: kodeUnik,
    nominal: nominal,
    status: status,
    date: getCurrentTimePlusFiveMinutes(),
  });
  fs.writeFileSync(
    kodetrx,
    JSON.stringify(transaksiData)
  );
}
module.exports = (bot, sett, cek, register, settings) => {
   bot.command("ceksesss", (kris) => {
       console.log(SessionDeposit[kris.from.id])
   })
  bot.hears("💳 Deposit", (kris) => {
    const chatId = kris.from.id;
        if (SessionDeposit[chatId]) {
      kris.reply(`Silahkan Selesaikan Deposit Sebelumnya atau batalkan Deposit.`);
      return;
      }  
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    var pesan = `──「 CARA DEPOSIT ${settings.storename} 」─── 
     
Untuk melakukan deposit saldo dengan mudah dan cepat, 
ikuti langkah-langkah berikut:

Cara Deposit Otomatis :
1. Ketikan kepada bot : /deposit nomonal
	(contoh: /deposit 10000)
2. Bot akan otomatis memberikan Qris Otomatis
3. Gunakan aplikasi e-wallet/m-banking Anda untuk melakukan pembayaran sesuai dengan total bayar.
4. Dilarang transfer melebihi batas waktu transfer (Qris otomatis hanya berlaku selama 15 menit, setelah melewati batas waktu lebih itu deposit akan expired dan anda perlu memasukan data kembali).
5. Deposit Otomatis Dikenakan Fee.
    `;
    kris.reply(pesan);
  });
 bot.action("BATALDEPOSIT", (kris) => {
 var opa = SessionDeposit[kris.from.id].transactionDetails.opa;  
 
     function showTransaction(userId) {
          if (SessionDeposit[userId]) {
         kris.reply(`Deposit Dengan TrxId: ${SessionDeposit[userId].transactionDetails.depo_id} telah di batalkan`)
          delete SessionDeposit[userId];
         kris.telegram.deleteMessage(kris.from.id, opa);       
          } else {
            kris.reply(`Tidak ada Deposit yang sedang berlangsung`);
          }
        }
        showTransaction(kris.from.id)
 })
  bot.action("CECHKSTATUSDEPO", (kris) => {
    if (SessionDeposit[kris.from.id]) {
    var nominal = SessionDeposit[kris.from.id].transactionDetails.amount;    
    var unik = SessionDeposit[kris.from.id].transactionDetails.unik;  
   var total = SessionDeposit[kris.from.id].transactionDetails.total;  
   var depo_id = SessionDeposit[kris.from.id].transactionDetails.depo_id;      
  var opa = SessionDeposit[kris.from.id].transactionDetails.opa;   
    Hahsjsjsjsjsj(
      kris,
      opa,
      depo_id,
      nominal,
      total,
      unik,
      sett,
      cek,
      settings
    );
    } else {
    kris.reply("Tidak ada transaksi yang sedang berlangsung");
  }
  })
    bot.command("deposit", (kris) => {
    const chatId = kris.from.id;
    const userName = kris.from.username || kris.from.first_name;
    if (cek("id", chatId) == null) return register(kris, chatId);
    const QRCode = require("qrcode");
    const Jimp = require("jimp");
    const fs = require("fs");
    const message = kris.message.text;
    const nom = message.split(" ")[1];

    const { pad, toCRC16, dataQris } = require("../resources/lib/qris");
    const mt = `
──「 CARA DEPOSIT ${settings.storename} 」─── 
     
Untuk melakukan deposit saldo dengan mudah dan cepat, 
ikuti langkah-langkah berikut:

Cara Deposit Otomatis :
1. Ketikan kepada bot : /deposit nomonal
	(contoh: /deposit 10000)
2. Bot akan otomatis memberikan Qris Otomatis
3. Gunakan aplikasi e-wallet/m-banking Anda untuk melakukan pembayaran sesuai dengan total bayar.
4. Dilarang transfer melebihi batas waktu transfer (Qris otomatis hanya berlaku selama 15 menit, setelah melewati batas waktu lebih itu deposit akan expired dan anda perlu memasukan data kembali).
5. Deposit Otomatis Dikenakan Fee.`;

    if (!nom) return kris.reply(mt);

    kris.reply("Silahkan Tunggu Qris sedang di buat Mohon Bersabar");

    function getExpiredTime() {
      const now = new Date();
      const expiredTime = new Date(now.getTime() + 5 * 60 * 1000); // Tambah 5 menit
      return expiredTime.toLocaleString("en-GB", { timeZone: "Asia/Jakarta" });
    }

    const expiredTimeText = getExpiredTime();
    const nominal = Number(nom);
    const feee = 0.007;
    const fee = formatMoney(nominal * feee);
    const kode_unik = getNextKodeUnik(nominal);
    addTransaction(kris.from.id, kode_unik, nominal, "pending");
    const depo_id = require("crypto")
      .randomBytes(5)
      .toString("hex")
      .toUpperCase();
    const unik = Number(kode_unik);
    const total = unik + nominal + Number(fee);
    const kok = total;
    const saldo_diterima = Number(nominal + unik);
    let qris = settings.dataqris;
    let nominalStr = kok.toString();
    let qris2 = qris.slice(0, -4);
    let replaceQris = qris2.replace("010211", "010212");
    let pecahQris = replaceQris.split("5802ID");
    let uang = "54" + pad(nominalStr.length) + nominalStr;
    uang += "5802ID";
    let output = pecahQris[0].trim() + uang + pecahQris[1].trim();
    output += toCRC16(output);

    QRCode.toFile(
      "tmp.png",
      output,
      { margin: 2, scale: 8.9 },
      async function (err, url) {
        if (err) console.log(err);
        let data = dataQris(qris);
        var text = data.merchantName;
        const ssss = path.join(__dirname, "../resources/assets/tamplate.png");
        var qr = await Jimp.read("tmp.png");
        Jimp.read(ssss, async (err, image) => {
          if (err) console.log(err);
                  image
            .composite(qr, 304, 304)
            .write(`${pathDeposit}${depo_id}.jpg`, async () => {
              fs.unlinkSync("tmp.png");
              global.cs = fs.readFileSync(`${pathDeposit}${depo_id}.jpg`);
              const teks = `🛍️ Invoice Deposit\n\n` +
              `\`\`\`${depo_id}\`\`\`\n\n` +
              `Details Payment:\n` +
              `- Amount Deposit: ${nominal}\n` +
              `- Payment Method: Qris\n` +
              `- Note: Deposit ${settings.storename}\n` +
              `- Valid Time: 15 Minutes\n\n` +
              `⚠️ Lakukan Pembayaran Sebelum \n${expiredTime()} Sejumlah ${formatmoney(total)}\n` +
              `Tekan Button Cek Payment Jika Deposit mengalami Bug\n\n` +
              `Cara Melakukan Pembayaran:\n` +
              `1. Buka Aplikasi Ewalletmu (Gopay / Dana)\n` +
              `2. Pastikan Saldo Cukup\n` +
              `3. Pilih Opsi QRIS\n` +
              `4. Scan QR Code yang ada di atas, lalu bayar\n` +
              `5. Kemudian klik Cek Status`;
              const sentMessage = await kris.replyWithPhoto({ source: cs }, {
                caption: teks,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Cek Status", callback_data: "CECHKSTATUSDEPO" }, { text: "Batal Deposit", callback_data: "BATALDEPOSIT"}],
                        [
                          {
                            text: "Costumer Service",
                            url: `${settings.ownerurl}`,
                          },
                        ],
                    ],
                },
            });
           
              const expirationTime = 15 * 60 * 1000; 
              const timer = setTimeout(() => {
                  handleExpired(kris.from.id, kris);
              }, expirationTime);
      SaveSessionTrx(
        kris.from.id,
        depo_id,
        saldo_diterima,
        unik,
        total,
        sentMessage.message_id,
        timer
      );
              

             fs.unlinkSync(`${pathDeposit}${depo_id}.jpg`);
            });
        });
      }
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
