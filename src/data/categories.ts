import type { Project } from './types';

export const CATEGORIES: [string, RegExp][] = [
  ['Cloud & Backend', /aws|cloud|backend|serverless|docker|microservice|\bgo\b|node\.?js|express|mongodb|postgres|full-?stack|online platform/i],
  ['Embedded & Firmware', /firmware|embedded|microcontroller|\bmcu\b|stm32|nordic|esp32|\bc prog|c\/c\+\+|nrf/i],
  ['PCB & Hardware', /pcb|altium|eagle|circuit|solder|hardware|wristwatch|wearable|sensor/i],
  ['Wireless', /bluetooth|wi-?fi|lorawan|thread|wireless|mesh|rf\b/i],
  ['FPGA & Digital', /fpga|verilog|computer arch|accelerat/i],
  ['Mobile & Frontend', /flutter|mobile|frontend|angular|\bgui\b|astro|tailwind|website/i],
  ['Research & Teaching', /teaching|research|laborator|published|paper|workflow|mechanic/i],
];

export const FEATURED = new Set(['BarIoT', 'LoRaWAN Health V2', 'Wootch']);

export function categoriesOf(p: Project): string[] {
  const text = `${p.title} ${p.tags.join(' ')} ${p.shortSummary}`;
  const cats = CATEGORIES.filter(([, re]) => re.test(text)).map(([n]) => n);
  return cats.length ? cats : ['Research & Teaching'];
}

export function relatedProjects(all: Project[], index: number, n = 3) {
  const mine = new Set(categoriesOf(all[index]));
  return all
    .map((p, i) => ({ p, i, score: categoriesOf(p).filter((c) => mine.has(c)).length }))
    .filter((x) => x.i !== index && x.score > 0)
    .sort((a, b) => b.score - a.score || Math.abs(a.i - index) - Math.abs(b.i - index))
    .slice(0, n);
}
