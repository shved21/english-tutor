const dayZero = {
  day: 0,
  topic: 'Kickoff and first speaking practice',
  question: 'What helps me start speaking English?',
  focus: 'First speaking attempt and setup',
  artifact: 'Start the learning environment and try a short conversation',
  evidence: 'A first speaking note and a clear next step'
};

const topicUk = [
  'Старт і перша розмовна практика',
  'Прокрастинація — це система, а не риса характеру',
  'Види відкладання',
  'Справжня ціна відкладання',
  'Уникання і уявлення про себе',
  'Підсумок діагностики',
  'Цінності важливіші за настрій',
  'Відповідальність без самопокарання',
  'Майбутній я як реальна людина',
  'Маленькі обіцянки',
  'Підсумок домовленості про дії',
  'Стан тіла і робота',
  'Сон, світло і рух',
  'Дофамін і швидкі винагороди',
  'Стрес: допомагає чи паралізує',
  'Підсумок протоколу енергії',
  'Автоматичні думки',
  'Думка — не факт',
  'Перфекціонізм як приховане уникання',
  'Дія попри дискомфорт',
  'Підсумок теми уникання',
  'Мотивація — ненадійний початок',
  'Плани у форматі «якщо — то»',
  'Наступна фізична дія',
  'Вхід у задачу за дві хвилини',
  'Підсумок сценаріїв старту',
  'Як зменшити тертя',
  'Залишкова увага після перемикання',
  'Цифровий шум',
  'Як увійти у фокус',
  'Підсумок: захист протоколу уваги',
  'Результат проти видимості роботи',
  'Конкретні результати',
  'Планування без надмірного планування',
  'Зворотний зв’язок через дію',
  'Оновлення статусу на роботі',
  'Що робити після пропущеного дня',
  'Сором і повернення до роботи',
  'Відпочинок чи уникання',
  'Як відновити довіру до себе',
  'Підсумок теми відновлення',
  'Особиста система роботи',
  'Пріоритети й компроміси',
  'Показники без зайвого тиску',
  'Як пояснити свою систему на роботі',
  'Підсумок особистої системи',
  'Складні дні',
  'Ідентичність і амбіції',
  'Інструкція для себе',
  'План після завершення курсу',
  'Фінальний захист'
];

const questionUk = [
  'Що допомагає мені почати говорити англійською?',
  'Що саме відбувається, коли я відкладаю справу?',
  'Який тип відкладання я використовую найчастіше?',
  'Чого мені коштує прокрастинація?',
  'Що ця задача може відкрити про мене?',
  'Чому я відкладаю справи?',
  'Що варто робити, навіть коли я не почуваюся готовим?',
  'На що я справді можу вплинути?',
  'Що моє майбутнє «я» порадило б почати зараз?',
  'Яку маленьку обіцянку я зможу виконати навіть під стресом?',
  'Чому варто завершити цей курс?',
  'Який мінімальний стан потрібен мені для корисної роботи?',
  'Що з фізичних чинників найкраще допомагає мені почати?',
  'Яка швидка винагорода відволікає мене від роботи?',
  'Коли тиск допомагає, а коли заважає?',
  'Як я готую тіло й розум до роботи?',
  'Які думки запускають уникання?',
  'Які факти підтримують або спростовують цю думку?',
  'Коли я ховаюся за високими стандартами якості?',
  'На основі якої цінності я можу діяти попри дискомфорт?',
  'Чого я насправді уникаю?',
  'Чому не варто чекати мотивації?',
  'Що я зроблю, якщо з’явиться опір?',
  'Якою є наступна фізична дія в цій задачі?',
  'Як зробити початок достатньо малим?',
  'Як почати, перш ніж з’явиться відчуття готовності?',
  'Як зробити правильну дію простішою?',
  'Чому перемикання між задачами дорого коштує?',
  'Який цифровий канал найбільше забирає увагу?',
  'Який мій особистий спосіб входу у фокус?',
  'Чи можу я захистити свій протокол уваги під тиском?',
  'Що виглядає продуктивним, але не дає результату?',
  'Який видимий результат має дати ця задача?',
  'Коли планування стає униканням?',
  'Який зворотний зв’язок я отримаю через дію?',
  'Що я зробив, що завадило і що робитиму далі?',
  'Як я повернуся після пропуску без зайвої драми?',
  'Як полагодити систему без нападок на себе?',
  'Як зрозуміти, що мені потрібен відпочинок, а не втеча?',
  'Як відновити довіру маленькими підтвердженими кроками?',
  'Як відновлюватися і продовжувати працювати?',
  'Як працює моя система від ідеї до результату?',
  'Від чого мені варто відмовитися зараз?',
  'Як вимірювати поступ без зайвого тиску?',
  'Як я поясню свою робочу систему на співбесіді?',
  'Яка моя особиста система роботи?',
  'Як працювати, коли умови складні?',
  'Якою людиною я поступово стаю?',
  'Що я порадив би собі перед складною роботою?',
  'Як підтримувати систему ще 30 днів?',
  'Як починати складні справи за низької мотивації?'
];

// Published detail translations exist for every day that can currently be opened.
const detailsUk = [
  ['Перша розмова й налаштування', 'Підготувати середовище для навчання та спробувати коротку розмову', 'Нотатка про першу розмову й наступний крок'],
  ['Я схильний… коли…', 'Почати карту причин прокрастинації', 'Початкова розповідь на 60–90 секунд і текст на 120 слів'],
  ['Це здається…, але насправді…', 'Розподілити три відкладені задачі за типами', 'Три чіткі категорії відкладання'],
  ['Речення про причину й наслідок', 'Чесно описати ціну однієї відкладеної задачі', 'Абзац про наслідки'],
  ['Можливо, я уникаю… тому що…', 'Зіставити одну задачу зі страхом, статусом або невизначеністю', 'Особиста карта уникання'],
  ['Структура історії та логічні зв’язки', 'Завершити першу версію карти причин', 'Розповідь на 90 секунд і текст на 120 слів'],
  ['Навіть коли…, я все одно можу…', 'Назвати п’ять цінностей, які мають скеровувати дії', 'Коротка розповідь про цінності'],
  ['Можу, не можу, варто, не зобов’язаний', 'Обрати одну зону роботи, на яку справді можна вплинути', 'Реалістичне формулювання відповідальності'],
  ['Майбутні форми й пояснення причин', 'Написати короткий лист від себе через рік', 'Голосова нотатка від майбутнього себе'],
  ['Я можу взяти на себе зобов’язання…', 'Створити одну щоденну обіцянку на десять хвилин', 'Обіцянка, яку реально виконати'],
  ['Причини, приклади й результати', 'Завершити особисту домовленість про дії', 'Двохвилинна розповідь і текст на 150 слів'],
  ['Я працюю краще, коли…', 'Створити базовий перелік умов для енергії', 'Пояснення корисного стану'],
  ['Порівняльні конструкції', 'Перевірити одну дію перед початком роботи', 'Порівняння й один експеримент'],
  ['Мене тягне до… тому що…', 'Проаналізувати три цикли швидкої винагороди', 'Пояснення відволікання'],
  ['Тоді як; у той час як; замість того щоб', 'Створити спосіб відновитися перед складною роботою', 'Порівняння двох станів і спосіб відновлення'],
  ['Переказ тексту й пояснення протоколу', 'Завершити протокол енергії', 'Двохвилинне пояснення протоколу'],
  ['Я кажу собі, що…', 'Зібрати десять думок, які запускають уникання', 'Огляд повторюваних думок'],
  ['Фрази для порівняння і наведення доказів', 'Заповнити таблицю: думка, докази, альтернатива', 'Відповідь із опорою на докази'],
  ['Достатньо добре, щоб…', 'Визначити прийнятну версію однієї задачі', 'Рішення про достатню якість'],
  ['Я можу відчувати… і все одно…', 'Попрацювати 10–25 хвилин попри дискомфорт', 'Історія про дію з дискомфортом'],
  ['Історія, порівняння та пояснення', 'Завершити карту уникання', 'Трихвилинна розповідь і карта'],
  ['Раніше я думав…, але тепер…', 'Назвати дії, які можна почати без мотивації', 'Відповідь про старе й нове переконання'],
  ['Якщо…, то я…', 'Написати десять сценаріїв початку за опору', 'Бібліотека сценаріїв старту'],
  ['Інфінітив для вираження мети', 'Переписати п’ять нечітких задач як фізичні дії', 'Список конкретних дій'],
  ['Замість…, я можу…', 'Спробувати початок тривалістю дві хвилини', 'Пояснення змін до й після'],
  ['Структура «проблема — рішення»', 'Завершити бібліотеку сценаріїв «якщо — то»', 'Трихвилинна відповідь про проблему й рішення'],
  ['Я можу зменшити тертя, якщо…', 'Прибрати три перепони для роботи', 'Огляд робочих перешкод'],
  ['Причина, наслідок і приклади', 'Провести один робочий блок без перемикання', 'Експеримент із фокусом'],
  ['Я втрачаю фокус, коли…', 'Прибрати або заблокувати один цифровий канал', 'Пояснення цифрової межі'],
  ['Спершу…, потім…, після цього…', 'Створити ритуал початку на три–п’ять хвилин', 'Пояснення послідовності'],
  ['Захист позиції, визнання слабкого місця й опис перевірки', 'Підготувати короткий захист протоколу уваги', 'Відповідь у форматі дебатів і реальна п’ятихвилинна перевірка']
];

challengeDays[29] = {
  ...challengeDays[29],
  topic: 'Debating My Attention Protocol',
  question: 'Can I defend my attention protocol under pressure?',
  focus: 'Defend a position, admit a weak point, and describe a test',
  artifact: 'Prepare a short defense of the attention protocol',
  evidence: 'A debated answer and a real five-minute focus test'
};

// Use the actual saved lesson titles for the most recent five days.
Object.assign(challengeDays[25], {
  topic: 'Protecting Attention',
  question: 'How do I protect my attention when work feels fragile?'
});
Object.assign(challengeDays[26], {
  topic: 'Protecting a Focus Block',
  question: 'How do I protect a focus block without ignoring real priorities?'
});
Object.assign(challengeDays[27], {
  topic: 'Returning After an Interruption',
  question: 'How do I recover focus after an unavoidable interruption?'
});
Object.assign(challengeDays[28], {
  topic: 'Entering Focus With a Start Ritual',
  question: 'What is my personal protocol for entering focus?'
});
topicUk[25] = 'Як захистити увагу, коли робота дається важко';
topicUk[26] = 'Як захистити блок фокусної роботи й не ігнорувати важливе';
topicUk[27] = 'Як повернути фокус після неминучого переривання';
topicUk[28] = 'Вхід у фокус через ритуал початку';
topicUk[29] = 'Захищаю свій протокол уваги';

const today = publicProgress.currentDay;
const allDays = [dayZero, ...challengeDays];
const lessonPages = new Map([
  [14, './daily_task_app/index.html'],
  [20, './daily_task_app/archive/index.html?day=20'],
  [22, './daily_task_app/archive/index.html?day=22'],
  [23, './daily_task_app/archive/index.html?day=23'],
  [24, './daily_task_app/archive/index.html?day=24'],
  [25, './daily_task_app/archive/index.html?day=25'],
  [26, './daily_task_app/archive/index.html?day=26'],
  [27, './daily_task_app/archive/index.html?day=27'],
  [28, './daily_task_app/archive/index.html?day=28'],
  [29, './daily_task_app/archive/index.html?day=29'],
  [30, './daily_task_app/day30/index.html']
]);
const list = document.getElementById('day-list');
const dialog = document.getElementById('day-dialog');
const closeButton = document.getElementById('close-dialog');
let lastTrigger = null;

function node(tag, className, value) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (value !== undefined) item.textContent = value;
  return item;
}
function ratingFor(day) {
  const value = publicProgress.ratings[day];
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10 ? value : null;
}
function stateFor(day) {
  if (day === 0 || day > today) return 'locked';
  if (day === today) return 'current';
  return 'available';
}
function stateText(state) {
  return {locked:'Закрито', current:'Поточний', available:'Відкрито'}[state];
}
function visualStateFor(day, state) {
  if (state === 'locked') return 'locked';
  const rating = ratingFor(day);
  if (rating !== null) return rating >= 7 ? 'good' : 'poor';
  return publicProgress.selfReportedCompletedDays.includes(day) ? 'done' : 'incomplete';
}
function completedCount() {
  return allDays.filter(lesson => lesson.day > 0 && (
    publicProgress.selfReportedCompletedDays.includes(lesson.day) || ratingFor(lesson.day) !== null
  )).length;
}
function render() {
  const fragment = document.createDocumentFragment();
  for (const lesson of allDays) {
    const state = stateFor(lesson.day);
    const visualState = visualStateFor(lesson.day, state);
    const row = node('button', `day-row is-${visualState}`);
    row.type = 'button';
    row.dataset.day = String(lesson.day);
    row.disabled = state === 'locked';
    const numberLabel = lesson.day === 0 ? 'Старт' : `День ${lesson.day}`;
    const rating = ratingFor(lesson.day);
    const qualityLabel = rating === null ? '' : ` Оцінка ${rating} з 10.`;
    row.setAttribute('aria-label', `${numberLabel}. ${lesson.topic}. ${topicUk[lesson.day]}. ${stateText(state)}.${qualityLabel}`);
    const index = node('span','day-index', lesson.day === 0 ? 'СТАРТ' : '');
    if (lesson.day !== 0) index.append(node('strong','',String(lesson.day).padStart(2,'0')));
    const title = node('span','day-title');
    title.append(node('strong','',lesson.topic),node('small','',topicUk[lesson.day]));
    row.append(index,title);
    if (rating !== null) row.append(node('span','day-grade',`${rating}/10`));
    row.append(node('span','day-arrow',state === 'locked' ? '🔒' : '↗'));
    fragment.append(row);
  }
  list.append(fragment);
  const count = completedCount();
  const progressBar = document.querySelector('.route-track');
  progressBar.setAttribute('aria-valuenow', String(count));
  progressBar.querySelector('span').style.width = `${count / 50 * 100}%`;
}
function setText(id, value) { document.getElementById(id).textContent = value; }
function openDay(day, trigger) {
  const lesson = allDays[day];
  if (!lesson || day > today) return;
  lastTrigger = trigger || null;
  const hasFullLesson = lessonPages.has(day);
  setText('detail-day', `ДЕНЬ ${String(day).padStart(2,'0')} · ${hasFullLesson ? 'ПЛАН УРОКУ' : 'МАТЕРІАЛ НЕ ЗНАЙДЕНО'}`);
  setText('detail-title', lesson.topic);
  setText('detail-translation', topicUk[day]);
  document.getElementById('detail-grid').hidden = !hasFullLesson;
  setText('detail-question', `${lesson.question}\n${questionUk[day]}`);
  setText('detail-focus', `${lesson.focus}\n${detailsUk[day][0]}`);
  setText('detail-artifact', `${lesson.artifact}\n${detailsUk[day][1]}`);
  setText('detail-evidence', `${lesson.evidence}\n${detailsUk[day][2]}`);
  setText('detail-note', hasFullLesson
    ? 'Це короткий опис із програми. Натисни «Відкрити повний урок», щоб перейти до всіх восьми кроків. Перегляд не зараховує проходження.'
    : 'У цій Git-версії не збережено повний матеріал уроку. Замість нього не показую скорочений план.');
  const actions = document.getElementById('dialog-actions');
  actions.replaceChildren();
  if (hasFullLesson) {
    const link = node('a','', day === 14 ? 'Відкрити повний урок ↗' : 'Відкрити повний урок ↗');
    link.href = lessonPages.get(day);
    actions.append(link);
  }
  const close = node('button','', 'Закрити');
  close.type = 'button';
  close.addEventListener('click', () => dialog.close());
  actions.append(close);
  dialog.showModal();
}

list.addEventListener('click', event => {
  const button = event.target.closest('button[data-day]');
  if (button && !button.disabled) {
    const day = Number(button.dataset.day);
    if (lessonPages.has(day)) window.location.href = lessonPages.get(day);
    else openDay(day, button);
  }
});
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => lastTrigger?.focus());
render();
