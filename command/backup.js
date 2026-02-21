const telegraf = require("telegraf");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const cron = require("node-cron");

const settingsFile = path.resolve("./resources/Admin/settings.json");
let settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"));

async function sendBackup(ctx) {
    try {
        const filePath = path.join(__dirname, "../resources/database/backup.zip");
        if (!fs.existsSync(filePath)) {
            return ctx.reply("File backup.zip tidak ditemukan!");
        }

        await ctx.telegram.sendDocument(settings.invoice, {
            source: fs.createReadStream(filePath),
            filename: `backup-${new Date().getDate()}${new Date().toLocaleString(
                "en-US",
                { month: "short" }
            )}${new Date().getFullYear()}.zip`,
        });
    } catch (err) {
        console.error("Error saat mengirim backup:", err);
        ctx.reply("Gagal mengirim backup.");
    }
}

async function createBackup(ctx) {
    const PathCommand = path.join(__dirname, "../command");
    const PathResources = path.join(__dirname, "../resources");
    const pathMain = path.join(__dirname, "../main.js");
    const pathPackage = path.join(__dirname, "../package.json");
    const zipFile = path.join(__dirname, "../resources/database/backup.zip");

    // **Hapus backup lama sebelum membuat ZIP baru**
    if (fs.existsSync(zipFile)) {
        fs.unlinkSync(zipFile);
    }

    const output = fs.createWriteStream(zipFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log("Backup berhasil dibuat:", zipFile);
            resolve();
        });

        archive.on("error", (err) => {
            reject(err);
        });

        archive.pipe(output);

        archive.directory(PathCommand, "command");
        
        // **Hanya masukkan subfolder penting dari `resources`**
        archive.directory(path.join(PathResources, "Admin"), "resources/Admin");
        archive.directory(path.join(PathResources, "Configs"), "resources/Configs");

        archive.file(pathMain, { name: "main.js" });
        archive.file(pathPackage, { name: "package.json" });

        archive.finalize();
    });
}

// **Command bot untuk membuat backup**
async function sendBackupbot(ctx) {
    console.log("Memulai proses backup...");
    
    cron.schedule('21 20 * * *', async () => {
        try {
            await createBackup(ctx);
            await sendBackup(ctx);
        } catch (err) {
            console.error("Error saat membuat backup:", err);
            ctx.reply("Gagal membuat backup.");
        }
    });
    
}

module.exports = { sendBackupbot };
