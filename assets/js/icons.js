/*
 * Kodla — çizgi tabanlı SVG ikon seti (24x24, stroke = currentColor)
 * Bileşen ve bölüm ikonları burada tanımlanır; yeni bir anahtar ekleyip
 * bölüm verisinde "icon" veya "parts" içinde kullanabilirsin.
 */
window.KODLA = window.KODLA || { chapters: [] };

KODLA.icons = {
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  board: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="5" height="4" rx="1"/><path d="M13 8h6M13 11h6M5 16h14"/><circle cx="18.5" cy="14.5" r=".6"/>',
  usb: '<path d="M12 2v14"/><path d="M8 6l4-4 4 4"/><rect x="8" y="16" width="8" height="6" rx="1.5"/><path d="M10 19h.01M14 19h.01"/>',
  breadboard: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 12h20"/><path d="M6 7.5h.01M9 7.5h.01M12 7.5h.01M15 7.5h.01M18 7.5h.01M6 16.5h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01M18 16.5h.01"/>',
  led: '<path d="M8 13V9a4 4 0 0 1 8 0v4"/><path d="M6 13h12"/><path d="M10 13v8M14 13v6"/><path d="M4 5l2 1.5M20 5l-2 1.5M12 1.5v1.5"/>',
  rgb: '<circle cx="9" cy="9" r="5"/><circle cx="15" cy="9" r="5"/><circle cx="12" cy="15" r="5"/>',
  resistor: '<path d="M2 12h4l1.5-4 3 8 3-8 3 8 1.5-4h4"/>',
  wire: '<path d="M4 20c0-8 16-8 16-16"/><circle cx="4" cy="20" r="1.6"/><circle cx="20" cy="4" r="1.6"/>',
  button: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="12" r="4"/>',
  traffic: '<rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="7" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="17" r="1.6"/>',
  pot: '<circle cx="12" cy="11" r="7"/><path d="M12 11l3.5-3.5"/><path d="M8 21v-3M12 21v-3M16 21v-3"/>',
  ldr: '<circle cx="12" cy="12" r="5"/><path d="M9 10.5c1 1 2 -1 3 0s2 -1 3 0M9 13.5c1 1 2 -1 3 0s2 -1 3 0"/><path d="M3 3l3 3M21 3l-3 3M12 1v2"/>',
  buzzer: '<circle cx="10" cy="12" r="7"/><circle cx="10" cy="12" r="1.5"/><path d="M19 8a6 6 0 0 1 0 8M21.5 5.5a10 10 0 0 1 0 13"/>',
  sensor: '<rect x="5" y="3" width="14" height="13" rx="2"/><circle cx="12" cy="9.5" r="3"/><path d="M8 16v5M12 16v5M16 16v5"/>',
  dht: '<rect x="5" y="2" width="14" height="15" rx="2"/><path d="M8 6h8M8 9h8M8 12h8"/><path d="M9 17v5M12 17v5M15 17v5"/>',
  ultrasonic: '<rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 4h4"/>',
  pir: '<path d="M5 16a7 7 0 0 1 14 0z"/><rect x="4" y="16" width="16" height="4" rx="1"/><path d="M9 11.5h.01M12 10h.01M15 11.5h.01"/>',
  gas: '<path d="M12 2c2 4 6 5.5 6 11a6 6 0 0 1-12 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-6 1-9z"/>',
  soil: '<path d="M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 12c0-3-2-5-5-5 0 3 2 5 5 5z"/><path d="M12 12v4"/><path d="M3 16h18M5 20h2M11 20h2M17 20h2"/>',
  thermo: '<path d="M14 14.5V4a2 2 0 0 0-4 0v10.5a4 4 0 1 0 4 0z"/><path d="M12 10v7"/>',
  rain: '<path d="M7 15a4 4 0 0 1-.5-8A6 6 0 0 1 18 8a3.5 3.5 0 0 1-.5 7z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
  ir: '<rect x="3" y="8" width="7" height="8" rx="2"/><path d="M13 9c2 1 2 5 0 6M16 7c3.5 2 3.5 8 0 10M19 5c5 3 5 11 0 14"/>',
  tilt: '<path d="M4 20h16"/><rect x="8" y="5" width="6" height="11" rx="2" transform="rotate(-20 11 10.5)"/><circle cx="10.5" cy="12.5" r="1.2"/>',
  joystick: '<path d="M6 17h12l1.5 4h-15z"/><path d="M12 17V8"/><circle cx="12" cy="5" r="3"/>',
  lcd: '<rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="14" height="8" rx="1"/><path d="M7 11h4M7 13.5h7"/>',
  oled: '<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="6" y="7" width="12" height="8" rx="1"/><path d="M8 18h.01M10.5 18h.01M13.5 18h.01M16 18h.01"/>',
  segment: '<path d="M8 4h8M17 5l-1 6M16 13l-1 6M7 20h8M6 19l1-6M7 11l1-6M8 12h8"/>',
  matrix: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 7.5h.01M12 7.5h.01M16.5 7.5h.01M7.5 12h.01M12 12h.01M16.5 12h.01M7.5 16.5h.01M12 16.5h.01M16.5 16.5h.01"/>',
  servo: '<rect x="3" y="9" width="14" height="10" rx="2"/><circle cx="8" cy="9" r="3"/><path d="M8 9l10-5"/><path d="M17 12h4M17 16h4"/>',
  stepper: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4"/>',
  motor: '<rect x="2" y="7" width="15" height="10" rx="3"/><path d="M17 12h5"/><path d="M6 7v10M13 7v10"/>',
  driver: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v-2M12 4v-2M17 4v-2M7 22v-2M12 22v-2M17 22v-2"/><path d="M8 12l3-3v6l3-3"/>',
  relay: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15l4-5 2 3 4-5"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="8" r="1"/>',
  remote: '<rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="7" r="1.6"/><path d="M10 12h.01M14 12h.01M10 15h.01M14 15h.01M10 18h.01M14 18h.01"/>',
  keypad: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M12 19h.01"/>',
  rfid: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M6 12h.01"/><path d="M18 9a4 4 0 0 1 0 6M20.5 6.5a8 8 0 0 1 0 11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bluetooth: '<path d="M7 7l10 10-5 5V2l5 5L7 17"/>',
  sd: '<path d="M6 2h9l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 6v3M11 6v3M14 6v3"/>',
  battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 10v4"/><path d="M6 12h4M8 10v4"/>',
  pump: '<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/><path d="M4 21h16"/>',
  car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/>',
  plant: '<path d="M12 10c0-4 3-7 7-7 0 4-3 7-7 7zM12 13c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/><path d="M12 10v6"/><path d="M7 16h10l-1.5 6h-7z"/>',
  robot: '<rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V3M10 3h4"/><circle cx="9.5" cy="12" r="1.2"/><circle cx="14.5" cy="12" r="1.2"/><path d="M2 12v3M22 12v3M9 21h6"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  // Arayüz ikonları
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  plug: '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
  layers: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  package: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  top: '<path d="M12 19V5M6 11l6-6 6 6"/>'
};

KODLA.icon = function (name, cls) {
  var body = KODLA.icons[name] || KODLA.icons.chip;
  return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
};
