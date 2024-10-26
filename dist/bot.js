"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTelegramBot = initTelegramBot;
const supabaseDb_1 = require("./supabaseDb");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
function initTelegramBot() {
    // Initialize the Telegram bot
    const bot = new node_telegram_bot_api_1.default(process.env.MY_BOT_TOKEN, { polling: true });
    // set action for Start command - /start
    bot.onText(/\/start/, (msg) => __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        // Ensure msg.from is not undefined otherwise do not respond
        if (!msg.from) {
            yield bot.sendMessage(chatId, 'Something went wrong.......');
            return; // Exit if msg.from is undefined
        }
        const telegramId = msg.from.id;
        // console.log("-telegramId=", telegramId);
        const userName = msg.from.username;
        const gameUrl = `https://bucolic-centaur-38bb0c.netlify.app?username=${userName}&telegramId=${telegramId}`;
        try {
            // Check if the user is already in the Supabase DB
            const { data: existingUser, error } = yield supabaseDb_1.supabase
                .from('users')
                .select('*')
                .eq('telegramId', telegramId)
                .single(); // Get a single record/User
            // PGRST116 error occur when no rows found
            if (error && error.code !== 'PGRST116') {
                throw error;
            }
            console.log("ExistingUser.......", existingUser);
            if (!existingUser) {
                // Insert new user into the Supabase DB
                const { error: insertError } = yield supabaseDb_1.supabase
                    .from('users')
                    .insert([
                    {
                        telegramId: telegramId,
                        userName: userName,
                        balance: 0
                    },
                ]);
                if (insertError) {
                    yield bot.sendMessage(chatId, 'Error adding you to the database.');
                    throw insertError;
                }
                //const gameUrl = `https://premnarayanp.github.io/chat-app?username=${userName}&userId=${telegramId}`;
                yield bot.sendMessage(chatId, `Welcome, ${userName}! Click the button below to start the game.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Play Game', web_app: { url: gameUrl } }
                            ]
                        ]
                    }
                });
            }
            else {
                // If user exists, send a welcome back message with game link
                yield bot.sendMessage(chatId, `Welcome back, ${userName}! Click the button below to continue playing.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Play Game', web_app: { url: gameUrl } }
                            ]
                        ]
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
            yield bot.sendMessage(chatId, 'Something went wrong.');
        }
    }));
}
