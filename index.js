const Redis = require("ioredis");
const {setTimeout} = require("timers/promises");

function newRedisClient() {
    return new Redis('redis://localhost:6379');
}
const readClient = newRedisClient();
const writeClient = newRedisClient();
const separateRedisClient = process.argv.at(-1) !== '--same-connection';
async function main() {
    writeLoop("stream1", 2000);
    writeLoop("stream2", 500);
    writeLoop("stream3", 5000);

    readLoop("stream1", 1000);
    readLoop("stream2", 500);
    readLoop("stream3", 800);
}

async function readLoop(streamId, interval) {
    const redisClient = separateRedisClient ? newRedisClient() : readClient;
    let id = "0"
    while (true) {
        let t0 = new Date().getTime();
        let results = await redisClient.xread("BLOCK", interval, "STREAMS", streamId, id);
        let duration = (new Date().getTime() - t0);
        if (!results) {
            console.log(`[${streamId}] blocked during ${duration}ms. there was nothing to read`);
        } else {
            let maxDelay = 0;
            for (const msg of results[0][1]) {
                id = msg[0];
                const timestamp = new Date(msg[1][1]).getTime();
                maxDelay = Math.max((new Date().getTime() - timestamp), maxDelay);
            }
            console.log(`[${streamId}] blocked during ${duration}ms. there was ${results[0].length} entries to read, delayed=${maxDelay}ms`)
        }
    }
}

async function writeLoop(streamId, maxInterval) {
    const redisClient = separateRedisClient ? newRedisClient() : writeClient;
    await redisClient.del(streamId);
    while (true) {
        await redisClient.xadd(streamId, "*", "message", new Date().toISOString());
        await setTimeout(Math.random()*maxInterval)
    }
}


main().then(() => { console.log("done")})