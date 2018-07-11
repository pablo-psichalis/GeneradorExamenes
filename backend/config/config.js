require('dotenv').config({ path: './.env' });
const args = process.argv.slice(2);


const arg_localDb = args[0] ? (args[0] === 'true' ? true : false) : (process.env.LOCAL_DB === 'true' ? true : false);
const arg_token_secret = args[1] ? args[1] : process.env.TOKEN_SECRET;
const arg_remoteDbUri = args[2] ? args[2] : process.env.REMOTE_DB_URI;;

module.exports = {
  TOKEN_SECRET: arg_token_secret,
  DB_URI: arg_localDb ? 'mongodb://localhost/GenEx' : arg_remoteDbUri,
};
