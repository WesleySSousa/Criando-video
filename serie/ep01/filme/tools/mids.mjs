import fs from 'fs'; const d = JSON.parse(fs.readFileSync(new URL('../shots.json', import.meta.url))); const want = process.argv.slice(2).map(Number);
console.log(d.shots.filter(s => !want.length || want.includes(s.n)).map(s => ((s.t0 + s.t1) / 2).toFixed(2)).join(' '));
