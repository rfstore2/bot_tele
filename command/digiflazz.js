const axios = require("axios");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { Markup } = require("telegraf");
const md5 = require('md5')
const { formatmoney } = require("../resources/lib/function");

// Path ke file JSON
const datafile = path.join(__dirname, "../resources/database/produk.json");
let dataProduk = [];
if (fs.existsSync(datafile)) {
  dataProduk = JSON.parse(fs.readFileSync(datafile, "utf-8"));
}
const uss = path.join(__dirname, "../resources/database/users.json");
let dataUser = [];
if (fs.existsSync(uss)) {
  dataUser = JSON.parse(fs.readFileSync(uss, "utf-8"));
}
const datafilepasca = path.join(
  __dirname,
  "../resources/database/pascabayar.json"
);
let dataProdukPasca = [];
if (fs.existsSync(datafilepasca)) {
  dataProdukPasca = JSON.parse(fs.readFileSync(datafilepasca, "utf-8"));
}
module.exports = (bot, cek, sett, settings) => {
  bot.command("getip", (kris) => {
    const os = require('os')
    const isCreator = settings.owner == kris.from.id;
    if (!isCreator) return;
    function getServerIP() {
      const networkInterfaces = os.networkInterfaces();
      for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
          if (net.family === "IPv4" && !net.internal) {
            return net.address;
          }
        }
      }
      return "Tidak ditemukan IP server"; 
    }
    const serverIP = getServerIP();
    kris.reply(`IP Server: ${serverIP}`);
  })
  bot.command("setrole", (kris)=> {
    const isCreator = settings.owner == kris.from.id;
    if (!isCreator) return;
    const message = kris.message.text
    const id = message.split(" ")[1];
    const role = message.split(" ")[2]
      if (!id || !role) return kris.reply("Contoh format: /setrole id Role");
    if (role === "Member" || role === "Silver" || role === "Gold" || role === "Agen") {
    sett("role", id, role)
    kris.reply(`Role berhasil di ubah menjadi ${cek("role", id)}`)
    } else {
      kris.reply("Format Role Itu hanya ada: Member, Silver, Gold, Agen, Silahkan sesuaikan dengan role yang ada")
    }
  })
      bot.action("SALDO_DIGIFLAZZ", (kris) => {
          const isCreator = settings.owner == kris.from.id;
    if (!isCreator) return kris.reply("Fitur hanya bisa digunakan oleh owner");
          let third = "depo";
          let hash = crypto
            .createHash("md5")
            .update(settings.digiflazz.username + settings.digiflazz.apikey + third)
            .digest("hex");

          var config = {
            method: "POST", // Set the HTTP method to POST
            url: "https://api.digiflazz.com/v1/cek-saldo", // Set the target URL
            data: {
              cmd: "deposit",
              username: settings.digiflazz.username,
              sign: hash,
            },
          };

          axios(config).then(function (response) {
            if (response.data.data) {
              kris.reply(`*「 CEK SALDO DIGIFLAZ 」*

› STATUS DIGIFLAZZ : *TERHUBUNG*
› SALDO SERVER : *${formatmoney(response.data.data.deposit)}*\n`);
            } else {
              kris.reply(`*「 AKUN DIGIFLAZZ 」*\n
*Server Terputus Mohon Untuk Mengecek Providernya Kembali*.\n`);
            }
          });
     })
  bot.command("digiflazz", (kris) => {
    const isCreator =  settings.owner == kris.from.id
   if (!isCreator) return
     kris.reply(
      'Silahkan pilih opsi berikut ini',
      Markup.inlineKeyboard([
        [Markup.button.callback("Cek Saldo Digiflazz", "SALDO_DIGIFLAZZ")],
        [
          Markup.button.callback("Get Prabayar", "GET_PRABAYAR"),
          Markup.button.callback("Get Pascabayar", "GET_PASCABAYAR"),
        ],
      ])
  )
  });

  bot.action("GET_PRABAYAR", (kris) => {
    // Membuat hash untuk Digiflazz
    let code = "pricelist";
    let hasho = crypto
      .createHash("md5")
      .update(settings.digiflazz.username + settings.digiflazz.apikey + code)
      .digest("hex");

    // Konfigurasi permintaan ke API Digiflazz
    const config = {
      method: "POST",
      url: "https://api.digiflazz.com/v1/price-list",
      data: {
        cmd: "prepaid",
        username: settings.digiflazz.username,
        sign: hasho,
      },
    };

    // Mengirim permintaan ke API
    axios(config)
      .then((response) => {
        if (response.data && response.data.data) {
          // Menyimpan data ke file JSON
          const newData = response.data.data;
          dataProduk = newData; // Update dataProduk dengan data baru
          fs.writeFileSync(
            datafile,
            JSON.stringify(dataProduk, null, 2),
            "utf-8"
          );
          kris.editMessageText("Berhasil menyimpan produk ke dalam database.");
        } else {
          throw new Error("Data produk tidak ditemukan di response API.");
        }
      })
      .catch((error) => {
        // Penanganan error
        const errorMsg =
          error.response?.data?.msg || error.message || "Unknown error";
        console.log(errorMsg);
        kris.editMessageText(
          `Gagal menyimpan produk ke dalam database karena: ${errorMsg}`
        );
      });
  });
  bot.action("GET_PASCABAYAR", (kris) => {
    // Membuat hash untuk Digiflazz
    let code = "pricelist";
    let hasho = crypto
      .createHash("md5")
      .update(settings.digiflazz.username + settings.digiflazz.apikey + code)
      .digest("hex");

    // Konfigurasi permintaan ke API Digiflazz
    const config = {
      method: "POST",
      url: "https://api.digiflazz.com/v1/price-list",
      data: {
        cmd: "pasca",
        username: settings.digiflazz.username,
        sign: hasho,
      },
    };

    // Mengirim permintaan ke API
    axios(config)
      .then((response) => {
        if (response.data && response.data.data) {
          // Menyimpan data ke file JSON
          const newData = response.data.data;
          dataProdukPasca = newData; // Update dataProduk dengan data baru
          fs.writeFileSync(
            datafilepasca,
            JSON.stringify(dataProdukPasca, null, 2),
            "utf-8"
          );
          kris.editMessageText("Berhasil menyimpan produk ke dalam database.");
        } else {
          throw new Error("Data produk tidak ditemukan di response API.");
        }
      })
      .catch((error) => {
        // Penanganan error
        const errorMsg =
          error.response?.data?.msg || error.message || "Unknown error";
        console.log(errorMsg);
        kris.editMessageText(
          `Gagal menyimpan produk ke dalam database karena: ${errorMsg}`
        );
      });
  });
  bot.command("addsaldo", (kris) => {
    const isCreator =  settings.owner == kris.from.id
   if (!isCreator) return kris.reply(
      "Halo Owner Ini adalah menu Digiflazz")
    const message = kris.message.text;
   const id = message.split(" ")[1];
    const saldo = message.split(" ")[2]
       if (!id || !saldo) return kris.reply('contoh /minsaldo id saldo')
    const nom = Number(saldo);
    sett("+saldo", id, nom)
    kris.reply(`Berhasil Menambah Saldo Sebesar ${saldo} Saldo Sekarang: ${cek("saldo", id)}`)
    
  })
  bot.command("listmember", async (ctx) => {
    const isCreator = Number(settings.owner) === Number(ctx.from.id);
    if (!isCreator) return ctx.reply('Fitur hanya bisa di gunakan oleh owner')
    if (dataUser.length === 0) {
        return ctx.reply("Daftar user kosong.");
    }

    let message = "==== LIST USER ====\n";

    // Proses pengecekan username untuk setiap user ID
    for (const user of dataUser) {
        try {
            // Mendapatkan informasi user dari Telegram
            const userInfo = await ctx.telegram.getChat(user.id);

            // Menambahkan informasi user ke pesan
            message += `› ID: ${user.id}\n`;
            message += `› Username: @${userInfo.username || "Tidak Ada"}\n`;
            message += `› Saldo: ${user.saldo}\n`;
            message += `› Role: ${user.role}\n`;
            message += "› ========\n\n";
        } catch (error) {
            // Jika terjadi error, tambahkan pesan error untuk user tersebut
            message += `› ID: ${user.id}\n`;
            message += `› Username: Gagal mendapatkan username (${error.message})\n`;
            message += `› Saldo: ${user.saldo}\n`;
            message += `› Role: ${user.role}\n`;
            message += "› ========\n\n";
        }
    }

    // Mengirim pesan daftar pengguna
    ctx.reply(message);
});

  bot.command("minsaldo", (kris) => {
    const isCreator = settings.owner == kris.from.id;
     if (!isCreator) return kris.reply(
      "Halo Owner Ini adalah menu Digiflazz")
    const message = kris.message.text;
    const id = message.split(" ")[1];
    const saldo = message.split(" ")[2];
    if (!id || !saldo) return kris.reply('contoh /minsaldo id saldo')
    const nom = Number(saldo)
    console.log(nom, id)
    sett("-saldo", id, nom);
    kris.reply(
      `Berhasil Mengurangi Saldo Sebesar ${saldo} Saldo Sekarang: ${cek(
        "saldo",
        id
      )}`
    );
 
  });
};
