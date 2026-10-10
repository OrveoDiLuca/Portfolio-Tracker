const fs = require('fs');

fs.mkdirSync('src/environments', { recursive: true });

const content = `export const environment = {
  production: true,
  coingeckoApiKey: '${process.env.COINGECKO_API_KEY || ''}'
};
`;

fs.writeFileSync('src/environments/environment.ts', content);
console.log('environment.ts generado');