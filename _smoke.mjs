import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:5173');
console.log('TITLE:', await p.title());
console.log('BODY:', (await p.innerText('body')).slice(0, 200));
await b.close();
