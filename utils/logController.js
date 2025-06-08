const Logs = require("../models/Logs");
const levels = ['INFO', 'WARN', 'ERROR'];
const services = ['auth', 'payments', 'notifications'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateLog() {
    const log = new Logs({
        level: getRandom(levels),
        service: getRandom(services),
        message: `Random message for ${Date.now()}`
    });

    await log.save();
}

module.exports = () => setInterval(generateLog, 1000);
