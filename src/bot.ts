import { supabase } from './supabaseDb';
import TelegramBot from 'node-telegram-bot-api';

export function initTelegramBot() {
    // Initialize the Telegram bot
    const bot = new TelegramBot(process.env.MY_BOT_TOKEN!, { polling: true });


    // set action for Start command - /start
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;

        // Ensure msg.from is not undefined otherwise do not respond
        if (!msg.from) {
            await bot.sendMessage(chatId, 'Something went wrong.......');
            return; // Exit if msg.from is undefined
        }

        const telegramId = msg.from.id;
        // console.log("-telegramId=", telegramId);
        const userName = msg.from.username;
        const gameUrl = `https://bucolic-centaur-38bb0c.netlify.app?username=${userName}&telegramId=${telegramId}`;

        try {
            // Check if the user is already in the Supabase DB
            const { data: existingUser, error } = await supabase
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
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            telegramId: telegramId,
                            userName: userName,
                            balance: 0
                        },
                    ]);

                if (insertError) {
                    await bot.sendMessage(chatId, 'Error adding you to the database.');
                    throw insertError;
                }


                await bot.sendMessage(chatId, `Welcome, ${userName}! Click the button below to start the game.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Play Game', web_app: { url: gameUrl } }
                            ]
                        ]
                    }
                });
            } else {
                // If user exists, send a welcome back message with game link
                await bot.sendMessage(chatId, `Welcome back, ${userName}! Click the button below to continue playing.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Play Game', web_app: { url: gameUrl } }
                            ]
                        ]
                    }
                });


            }
        } catch (err) {
            console.error(err);
            await bot.sendMessage(chatId, 'Something went wrong.');
        }
    });


}