import TelegramBot from "node-telegram-bot-api";
import { token } from "./credential";
import { find, getRecipe } from "./webservice";

const bot = new TelegramBot(token, { polling: true });

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
  bot.sendMessage(chatId, "mohon tunggu Sedang mencari makanan 🍔");

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
  bot.sendMessage(chatId, "mohon tunggu Sedang mencari informasi makanan 🍔");

  const recipeId: string = match![1];
  try {
    let recipe = await getRecipe(recipeId);
    await bot.sendMessage(chatId, recipe.title);
    await bot.sendMessage(
      chatId,
      `Bahan Masakan: \n${recipe.ingredements.join("\n")}`
    );
    await bot.sendMessage(
      chatId,
      `Langkah-langkah memasak: \n${recipe.steps.join("\n")}`
    );
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
