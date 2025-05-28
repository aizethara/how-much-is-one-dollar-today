// ────────────────────────────────────────────────────────────────────  Modules

const https = require('https');
const currencyCodes = require('currency-codes');

// ────────────────────────────────────────────────────────────────────  Api

const url = 'https://open.er-api.com/v6/latest/USD';

// ────────────────────────────────────────────────────────────────────  Date now

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const formattedDate = `${yyyy}-${mm}-${dd}`;
console.log('\nOn', formattedDate + ', the value of one dollar is:');

// ────────────────────────────────────────────────────────────────────  Currencies

const currencies = {};
for (const entry of currencyCodes.data) {
  currencies[entry.code] = entry.currency;
}

https.get(url, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const rates = json.rates;
      for (const [code, rate] of Object.entries(rates)) {
        const name = currencies[code] || code;
        console.log(`│ ${name.padEnd(30)} = ${rate}`);
      }
    } catch (err) {
      console.error('Parsing error:', err.message);
    }
  });
}).on('error', err => {
  console.error('HTTP request error:', err.message);
});
