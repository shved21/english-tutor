const $ = (selector, root = document) => root.querySelector(selector);
const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined && text !== '') el.textContent = String(text); return el; };
const paragraph = (parent, text, className = '', lang = '') => { if (!text) return null; const p = make('p', className, text); if (lang) p.lang = lang; parent.append(p); return p; };
function details(parent, label, values, className = '') {
  if (!values?.length) return;
  const box = make('details', `details ${className}`.trim());
  box.append(make('summary', '', label));
  const body = make('div', 'details-body');
  values.forEach(value => paragraph(body, value));
  box.append(body); parent.append(box);
}
function section(parent, number, title) {
  const box = make('section', 'lesson-section'); box.id = `step-${number}`;
  box.append(make('p', 'section-kicker', `Крок ${number} / 8`), make('h2', '', title));
  parent.append(box); return box;
}
function list(parent, items, render) {
  const ol = make('ol', 'card-list');
  items.forEach((item, index) => { const li = make('li', 'item-card'); render(li, item, index); ol.append(li); });
  parent.append(ol);
}
function renderLesson(lesson) {
  document.title = `День ${lesson.day} · ${lesson.title} · English Tutor`;
  $('#lesson-day').textContent = `ДЕНЬ ${String(lesson.day).padStart(2, '0')} / 50 · ЗБЕРЕЖЕНИЙ УРОК`;
  $('#lesson-title').textContent = lesson.title;
  $('#lesson-subtitle').textContent = lesson.question;
  const nav = $('#step-nav'), content = $('#lesson-content');
  const names = ['Контекст і текст','Чотири речення','Активні фрази','Діалог','Власна відповідь','Репетиція','Voice','Підсумок'];
  names.forEach((name, index) => { const a = make('a', '', `${index + 1} · ${name}`); a.href = `#step-${index + 1}`; nav.append(a); });

  let box = section(content, 1, 'Контекст і текст');
  (lesson.model || []).forEach(text => paragraph(box, text, 'english', 'en'));
  details(box, 'Повний український переклад', lesson.translation || []);
  if (lesson.sources?.length) details(box, 'Джерела й межі висновку', lesson.sources.map(item => `${item.label || item.title || ''}: ${item.status || ''} ${item.url || ''}`));

  box = section(content, 2, 'Чотири речення');
  paragraph(box, 'Переклади опори англійською. Збережено навчальні цілі та можливі варіанти відповіді.', 'muted');
  list(box, (lesson.writing || []).slice(0, 4), (li, item) => {
    paragraph(li, item.ua); paragraph(li, `Конструкція: ${item.target || '—'}`, 'target'); paragraph(li, `Опора: ${item.wordBank || '—'}`, 'learning-cue'); details(li, 'Можливі варіанти', item.examples || []);
  });
  if ((lesson.writing || []).length > 4) details(box, 'Додаткові речення', (lesson.writing || []).slice(4).map(item => `${item.ua} · ${item.target || ''}`));

  const active = new Set(lesson.defaultSelected || []);
  const selected = (lesson.phrases || []).filter(item => active.has(item.id));
  box = section(content, 3, 'Активні фрази');
  const phraseGrid = make('div', 'phrase-list');
  selected.forEach(item => { const card = make('article', 'phrase-card'); card.append(make('strong', '', item.en)); paragraph(card, item.ua, 'learning-cue'); phraseGrid.append(card); });
  box.append(phraseGrid);
  details(box, 'Додаткові фрази уроку', (lesson.phrases || []).filter(item => !active.has(item.id)).map(item => `${item.en} — ${item.ua}`));

  box = section(content, 4, 'Діалог із фразами');
  list(box, selected, (li, item) => { paragraph(li, item.practice?.questionUa || item.question || item.ua); paragraph(li, `Опора: ${item.practice?.hint || item.hint || item.en}`, 'learning-cue'); details(li, 'Приклад відповіді', item.practice?.examples || item.examples || []); });

  box = section(content, 5, 'Власна відповідь');
  paragraph(box, lesson.question, 'english', 'en');
  list(box, lesson.answerGuide || [], (li, item) => { li.append(make('strong', '', item.label || 'Частина відповіді')); paragraph(li, item.cue); paragraph(li, item.starter, 'target', 'en'); details(li, 'Підказка й приклади', [item.hint, ...(item.examples || [])].filter(Boolean)); });

  box = section(content, 6, 'Коротка репетиція');
  paragraph(box, lesson.speakingGuide?.questionUa); paragraph(box, 'Відповідь на 60–90 секунд спирається на ці смислові опори.', 'muted');
  list(box, lesson.speakingGuide?.anchors || [], (li, item) => { li.append(make('strong', '', item.label || 'Опора')); paragraph(li, item.cue); paragraph(li, item.starter, 'target', 'en'); });

  box = section(content, 7, 'Розмова у Voice');
  paragraph(box, 'Розмова відбувається окремо в ChatGPT Voice. Нижче — збережений запит цього уроку.', 'muted');
  if (lesson.voiceTemplate) details(box, 'Показати повний запит для Voice', [lesson.voiceTemplate]);

  box = section(content, 8, 'Підсумок');
  paragraph(box, 'Після реальної сесії запиши власні речення, виправлену версію, результат Voice і доказ практичної дії. Перегляд цього матеріалу не зараховує виконання.');
  if (lesson.repairs?.length) details(box, 'Фрази для повторення', lesson.repairs.map(item => `${item.answer || item.en || ''} — ${item.ua || ''}`));
}
async function start() {
  const day = new URLSearchParams(location.search).get('day');
  try {
    const response = await fetch('./lessons.json');
    if (!response.ok) throw new Error('Не вдалося завантажити матеріали уроків.');
    const data = await response.json();
    const lesson = data.lessons?.[day];
    if (!lesson) throw new Error(`Повного збереженого уроку для дня ${day || '—'} тут немає.`);
    renderLesson(lesson);
  } catch (error) { $('#lesson-content').append(make('p', 'error', error.message)); }
}
start();
