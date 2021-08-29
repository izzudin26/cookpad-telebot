import TelegramBot from "node-telegram-bot-api";
import { token } from "./credential";
import { find, getRecipe } from "./webservice";

const bot: TelegramBot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Selamat Datang di BOT Cookpad");
  bot.sendMessage(
    chatId,
    "Untuk Mencari makanan gunakan perintah /cari nama makanan"
  );
  bot.sendMessage(chatId, "Untuk Mencari resep gunakan perintah /resep kode");
});

bot.onText(/\/cari (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "mohon tunggu! sedang mencari data masakan 🍔");

  const food: string = match![1];
  try {
    let foods = await find(food);
    foods.forEach((food, i) => {
      bot.sendPhoto(
        chatId,
        food.imageUrl.replace("/128x176cq50", "/680x482cq70"),
        { caption: `${food.title} \nKode Resep: ${food.recipeId}` }
      );
    });
  } catch (error) {
    await bot.sendMessage(
      chatId,
      "Terjadi kesalahan pengambilan data mohon ulangi perintah"
    );
  }
});

bot.onText(/\/resep (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Mohon Tunggu! sedang memuat resep");

  const recipeId: string = match![1];
  try {
    let recipe = await getRecipe(recipeId);
    const ingredements: string = recipe.ingredements.map((ingredement: string) => `•${ingredement}`).join("\n")
    const steps: string = recipe.steps.map((step: string) => `•${step.trim()}`).join("\n")
    await bot.sendPhoto(chatId, recipe.imageUrl, {caption: 
      `*${recipe.title}*\n\nBahan-bahan:\n${ingredements}\n\nLangkah-langkah:\n${steps}`
    , parse_mode: "Markdown"});
  } catch (error) {
    await bot.sendMessage(
      chatId,
      "Terjadi kesalahan pengambilan data mohon ulangi perintah"
    );
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id
  if (
    msg.text!.split(" ")[0] != "/cari" &&
    msg.text!.split(" ")[0] != "/resep" &&
    msg.text!.split(" ")[0] != "/start"
  ) {
    bot.sendMessage(chatId, "Format Perintah salah !");
    bot.sendMessage(
      chatId,
      "Untuk Mencari makanan gunakan perintah /cari nama makanan \nUntuk Mencari resep gunakan perintah /resep kode"
    );
  }
});
