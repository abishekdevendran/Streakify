import { REDIS_URL } from "$env/static/private";
import { createClient } from "redis"

const client = createClient({
    url: REDIS_URL,
});

client.on("error", function (err) {
    throw err;
});
await client.connect()

export default client
