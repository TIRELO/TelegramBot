const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

// Inicialização do bot do Telegram
const token = '6621341744:AAF4ZrCzPur8xoM2SrRYvVtTSYxSsEgQQ_Y';
const bot = new TelegramBot(token, { polling: true });

// Inicialização do cliente Prisma
const prisma = new PrismaClient();

// Evento de mensagem
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Olá! Por favor, envie seu email.');
});

// Evento de recebimento de email
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const email = msg.text;

  // Verifica se o email é válido
  if (!isValidEmail(email)) {
    return bot.sendMessage(chatId, 'Email inválido. Por favor, tente novamente.');
  }

  try {
    // Salva o email no banco de dados
    await prisma.user.create({
      data: {
        email: email
      }
    });
    bot.sendMessage(chatId, 'Email salvo com sucesso! Obrigado.');
  } catch (error) {
    console.error('Erro ao salvar o email:', error);
    bot.sendMessage(chatId, 'Ocorreu um erro ao salvar o email. Por favor, tente novamente mais tarde.');
  }
});

// Função para validar o formato do email
function isValidEmail(email) {
  // Implemente sua lógica de validação de email aqui
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
