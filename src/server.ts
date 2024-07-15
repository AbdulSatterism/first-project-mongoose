import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/superAdmin';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

// it's for asynchronous code
process.on('unhandledRejection', () => {
  console.log('unhandledRejection is detected shout down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// Promise.reject();

// its for synchronous
process.on('uncaughtException', () => {
  console.log('uncaughtException is detected shout down..');
  process.exit(1);
});

// console.log(x);
