import 'dotenv/config';
import { app } from './app.js';
import { initDatabase } from './database/initDatabase.js';

const port = Number(process.env.PORT ?? 4000);

await initDatabase();
app.listen(port, () => console.log(`GritSkool API listening on port ${port}`));
