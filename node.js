const mineflayer = require('mineflayer');

const config = {
  host: 'donutsmp.net',
  username: 'nothign',
  version: '1.20.1',
  auth: 'microsoft',
  checkTimeoutInterval: 45000
};

let bot;
let retries = 0;
const MAX_RETRIES = 1000;
const RETRY_DELAY = 10_000; // 10 seconds

function startBot() {
  console.log(`🔌 Connecting... (Attempt ${retries + 1}/${MAX_RETRIES})`);

  bot = mineflayer.createBot(config);

  bot.once('login', () => {
    console.log('✅ Logged in as', bot.username);
    retries = 0;
  });

  bot.once('spawn', () => {
    bot.setControlState('sneak', true);
    console.log('🟢 Sneaking & AFK');
  
    // Send /queue economy after spawn
    bot.chat('/queue economy');
  });


  bot.on('end', (reason) => {
    console.log(`🔌 Disconnected: ${reason}`);
    reconnect();
  });

  bot.on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
    reconnect();
  });
}

function reconnect() {
  if (retries >= MAX_RETRIES) {
    console.log('❌ Max retries reached. Stopping...');
    return;
  }

  retries++;
  setTimeout(startBot, RETRY_DELAY);
}

// Start the bot
startBot();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  if (bot) bot.end('manual');
  process.exit();
});