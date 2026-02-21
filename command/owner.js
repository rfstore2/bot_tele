module.exports = (bot, cek, settings) => {
  bot.command("ownermenu", (kris) => {
    const isCreator =  settings.owner == kris.from.id
   if (!isCreator) return;
    let pesan = `
⟬ OWNER MENU  ⟭ •
┆ » /addsaldo
┆ » /minsaldo
┆ » /listmember
┆ » /rekap
┆ » /digiflazz
┆ » /gettembakdata
┆ » /setrole
┆ » /backupon
┆ » /getip
╰──────────◇
`;
kris.reply(pesan)
   
  })
}