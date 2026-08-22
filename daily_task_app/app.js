const writingRows = document.querySelector("#writing-rows");
const phraseList = document.querySelector("#phrase-list");
const selectedCount = document.querySelector("#selected-count");
const selectedPhrasesBox = document.querySelector("#selected-phrases");
const mirroredDrafts = document.querySelector("#mirrored-drafts");
const mirroredPhrases = document.querySelector("#mirrored-phrases");
const drillGrid = document.querySelector("#drill-grid");
const drillStatus = document.querySelector("#drill-status");
const missionPhraseBank = document.querySelector("#mission-phrase-bank");
const missionStatus = document.querySelector("#mission-status");
const writingStatus = document.querySelector("#writing-status");
const fullAnswer = document.querySelector("#full-answer");
const fullAnswerFeedback = document.querySelector("#full-answer-feedback");
const storyGaps = [...document.querySelectorAll("[data-story-slot]")];
const questSteps = [...document.querySelectorAll(".quest-step")];
const questTitle = document.querySelector("#quest-title");
const questCounter = document.querySelector("#quest-counter");
const questProgressFill = document.querySelector("#quest-progress-fill");
const prevStepButton = document.querySelector("#prev-step");
const nextStepButton = document.querySelector("#next-step");
const toggleTranslationButton = document.querySelector("#toggle-translation");
const translationCard = document.querySelector("#translation-card");
const copyButton = document.querySelector("#copy");
const promptBox = document.querySelector("#prompt");
const copyStatus = document.querySelector("#copy-status");
const repairBankBox = document.querySelector("#repair-bank");
const repairProgress = document.querySelector("#repair-progress");

const progressKey = "english-tutor-work-mindset-day-14";

const writingPool = [
  {
    ua: "Основна причина, чому я хочу завершити цей юніт, — ...",
    target: "The main reason I want to finish is...",
    wordBank: "main reason / want to finish / because",
    examples: [
      "The main reason I want to finish is that I want a complete result.",
      "I want to finish this because a complete cycle will teach me more.",
    ],
    requiredGroups: [["main", "reason", "because"], ["finish", "complete", "end"], ["want", "value", "teach"]],
    required: ["reason", "finish", "want"],
    suggestion: "Поясни, навіщо тобі завершувати повний цикл, а не лише починати.",
  },
  {
    ua: "Я не намагаюся пройти цей юніт ідеально; я намагаюся пройти його послідовно.",
    target: "I am not trying to...; I am trying to...",
    wordBank: "not trying to / perfectly / consistently / steadily",
    examples: [
      "I am not trying to finish this perfectly; I am trying to finish it consistently.",
      "My goal is not perfection. I want to keep moving steadily.",
    ],
    requiredGroups: [["not", "goal"], ["trying", "want"], ["perfectly", "perfection"], ["consistently", "steadily", "progress"]],
    required: ["trying", "perfectly", "consistently"],
    suggestion: "Порівняй ідеальне завершення з послідовним рухом.",
  },
  {
    ua: "Я хочу сформувати звичку доводити справи до кінця.",
    target: "I want to build a habit of...",
    wordBank: "build a habit / follow through / finish what I start",
    examples: [
      "I want to build a habit of following through.",
      "I want to develop the habit of finishing what I start.",
    ],
    requiredGroups: [["want", "aim", "hope"], ["build", "develop", "create"], ["habit"], ["follow", "finish", "complete"]],
    required: ["want", "build", "habit", "finish"],
    suggestion: "Назви не разовий результат, а поведінку, яку хочеш повторювати.",
  },
  {
    ua: "Справжня цінність цього юніта в тому, що я зможу використати пізніше.",
    target: "The real value is in...",
    wordBank: "real value / use later / apply in practice",
    examples: [
      "The real value is in what I can use later.",
      "This unit is valuable because I can apply what I learn later.",
    ],
    requiredGroups: [["real", "actual"], ["value", "valuable", "benefit"], ["use", "apply"], ["later", "future"]],
    required: ["value", "use", "later"],
    suggestion: "Зв'яжи навчання з тим, де воно стане корисним після цього юніта.",
  },
  {
    ua: "Я зазвичай втрачаю темп, коли не бачу швидкого результату.",
    target: "I tend to lose momentum when...",
    wordBank: "tend to / lose momentum / quick result",
    examples: [
      "I tend to lose momentum when I do not see a quick result.",
      "I usually lose momentum if progress is not visible soon.",
    ],
    requiredGroups: [["tend", "usually", "often"], ["lose", "lack"], ["momentum", "pace"], ["when", "if"], ["result", "progress"]],
    required: ["lose", "momentum", "result"],
    suggestion: "Назви конкретний момент, у якому ти зазвичай втрачаєш темп.",
  },
  {
    ua: "Завершення дасть мені доказ, що я можу дотримуватися довгого плану.",
    target: "Finishing this will give me evidence that...",
    wordBank: "finishing / evidence / stick to a plan",
    examples: [
      "Finishing this will give me evidence that I can stick to a long-term plan.",
      "A finished unit will show me that I can follow a plan over time.",
    ],
    requiredGroups: [["finish", "finished", "complete"], ["evidence", "proof", "show"], ["stick", "follow", "keep"], ["plan", "process"]],
    required: ["finish", "evidence", "plan"],
    suggestion: "Покажи, який доказ дасть завершення і про що він свідчитиме.",
  },
  {
    ua: "Я можу зменшити обсяг, не відмовляючись від головної цілі.",
    target: "I can reduce... without...",
    wordBank: "reduce the scope / without abandoning / main goal",
    examples: [
      "I can reduce the scope without abandoning the main goal.",
      "If necessary, I can make the task smaller without giving up the direction.",
    ],
    requiredGroups: [["reduce", "make", "lower"], ["scope", "task", "amount"], ["without"], ["abandoning", "giving", "losing"], ["goal", "direction"]],
    required: ["reduce", "scope", "without", "goal"],
    suggestion: "Опиши, як зменшити навантаження, не зламавши напрям.",
  },
  {
    ua: "Наступна контрольна точка покаже, чи працює цей підхід.",
    target: "The next checkpoint will show whether...",
    wordBank: "next checkpoint / show whether / approach works",
    examples: [
      "The next checkpoint will show whether this approach works.",
      "At the next review, I will see whether the method is helping me.",
    ],
    requiredGroups: [["next", "coming", "following"], ["checkpoint", "review", "test"], ["show", "tell", "reveal"], ["whether", "if"], ["works", "helps", "effective"]],
    required: ["checkpoint", "show", "works"],
    suggestion: "Назви майбутній момент, у якому ти перевіриш підхід.",
  },
  {
    ua: "Я хочу результат, який зможу показати на співбесіді.",
    target: "I want a result I can point to...",
    wordBank: "result / point to / interview",
    examples: [
      "I want a result I can point to in an interview.",
      "I want something practical that I can show during a job interview.",
    ],
    requiredGroups: [["want", "need", "aim"], ["result", "something", "project"], ["point", "show", "present"], ["interview", "job", "career"]],
    required: ["want", "result", "interview"],
    suggestion: "Опиши результат, який можна буде побачити або показати іншій людині.",
  },
  {
    ua: "Якщо я пропущу день, я можу продовжити, а не починати весь план спочатку.",
    target: "If I miss a day, I can...",
    wordBank: "miss a day / resume / restart the whole plan",
    examples: [
      "If I miss a day, I can resume instead of restarting the whole plan.",
      "Missing one day does not mean I have to start the entire plan again.",
    ],
    requiredGroups: [["miss", "skip", "lose"], ["day", "session"], ["resume", "continue", "return"], ["instead", "rather"], ["restart", "start", "begin"]],
    required: ["miss", "day", "resume", "restart"],
    suggestion: "Сформулюй план повернення після пропуску без драматичного перезапуску.",
  },
  {
    ua: "Мета — створити доказ, а не просто намір.",
    target: "The goal is to create evidence, not...",
    wordBank: "goal / create evidence / intention",
    examples: [
      "The goal is to create evidence, not just intentions.",
      "I want a visible result instead of another plan that stays in my head.",
    ],
    requiredGroups: [["goal", "aim", "point"], ["create", "make", "build"], ["evidence", "result", "proof"], ["not", "instead"], ["intention", "plan", "idea"]],
    required: ["goal", "create", "evidence", "not"],
    suggestion: "Протистав намір конкретному доказу, який можна перевірити.",
  },
];

const phraseGroups = [
  {
    title: "Основні: допоможуть зібрати відповідь",
    start: 1,
    items: [
      ["The main reason I want to finish is that I want a complete result.", "Основна причина, чому я хочу завершити, — я хочу отримати завершений результат.", "Пояснити головну причину"],
      ["I am not trying to finish this perfectly; I am trying to finish it consistently.", "Я не намагаюся завершити це ідеально; я намагаюся завершити це послідовно.", "Порівняти ідеал і послідовність"],
      ["I want to build a habit of following through.", "Я хочу сформувати звичку доводити справи до кінця.", "Назвати звичку"],
      ["The real value is in what I can use later.", "Справжня цінність у тому, що я зможу використати пізніше.", "Пояснити майбутню користь"],
      ["I tend to lose momentum when I do not see a quick result.", "Я зазвичай втрачаю темп, коли не бачу швидкого результату.", "Назвати причину втрати темпу"],
      ["Finishing this will give me evidence that I can stick to a long-term plan.", "Завершення дасть мені доказ, що я можу дотримуватися довгого плану.", "Показати цінність завершення"],
      ["I can reduce the scope without abandoning the main goal.", "Я можу зменшити обсяг, не відмовляючись від головної цілі.", "Описати адаптацію плану"],
      ["The next checkpoint will show whether this approach works.", "Наступна контрольна точка покаже, чи працює цей підхід.", "Назвати майбутню перевірку"],
      ["I want a result I can point to in an interview.", "Я хочу результат, на який зможу показати на співбесіді.", "Пов'язати результат із роботою"],
      ["If I miss a day, I can resume instead of restarting the whole plan.", "Якщо я пропущу день, я можу продовжити, а не починати весь план спочатку.", "Описати повернення після пропуску"],
    ],
  },
  {
    title: "Додаткові: скажи більше, якщо зможеш",
    start: 11,
    items: [
      ["The goal is to create evidence, not just intentions.", "Мета — створити доказ, а не просто намір.", "Відділити доказ від наміру"],
      ["I started this because I want a stronger working routine.", "Я почав це, бо хочу мати сильнішу робочу рутину.", "Пояснити старт"],
      ["The difficult part is not starting; it is returning consistently.", "Складна частина — не почати, а послідовно повертатися.", "Назвати справжню складність"],
      ["If I miss a day, I can resume instead of restarting the whole plan.", "Якщо я пропущу день, я можу продовжити, а не починати весь план спочатку.", "Описати відновлення"],
      ["This project is worth finishing because it compounds over time.", "Цей проєкт варто завершити, бо його користь накопичується з часом.", "Пояснити накопичувальний ефект"],
      ["I need a clear definition of done.", "Мені потрібне чітке визначення того, що означає завершити.", "Визначити фініш"],
      ["A smaller version is better than an abandoned version.", "Менша версія краща за покинуту версію.", "Порівняти адаптації"],
      ["I want to turn this into something I can show.", "Я хочу перетворити це на те, що зможу показати.", "Створити артефакт"],
      ["The next checkpoint will show whether this approach works.", "Наступна контрольна точка покаже, чи працює цей підхід.", "Підготувати перевірку"],
      ["I am building something that can support my future work.", "Я будую щось, що може підтримати мою майбутню роботу.", "Пов'язати юніт із кар'єрою"],
    ],
  },
  {
    title: "Для діалогу: якщо GPT попросить розвинути думку",
    start: 21,
    items: [
      ["The point is to make progress visible.", "Суть у тому, щоб зробити прогрес видимим.", "Повернутися до доказу"],
      ["I do not need another reset; I need a reliable next step.", "Мені не потрібен ще один перезапуск; мені потрібен надійний наступний крок.", "Відповісти на бажання почати спочатку"],
      ["Finishing will make the next decision easier.", "Завершення полегшить наступне рішення.", "Пояснити користь фінішу"],
      ["I can protect the main goal by removing low-value tasks.", "Я можу захистити головну ціль, прибравши задачі з низькою цінністю.", "Прибрати зайве"],
      ["I want to stay honest about what I can maintain.", "Я хочу чесно оцінювати, що зможу підтримувати.", "Визначити реалістичний темп"],
      ["The plan should survive a less productive week.", "План має витримувати менш продуктивний тиждень.", "Перевірити стійкість"],
      ["I am more interested in a usable result than a perfect process.", "Мене більше цікавить придатний результат, ніж ідеальний процес.", "Поставити користь вище ідеалу"],
      ["This is a test of follow-through, not a test of my worth.", "Це перевірка здатності доводити справи до кінця, а не моєї цінності.", "Відділити дію від самооцінки"],
      ["I can learn from the result even if the experiment fails.", "Я можу вчитися з результату, навіть якщо експеримент не вдасться.", "Зберегти користь невдалого тесту"],
      ["One completed cycle is more useful than another impressive plan.", "Один завершений цикл корисніший за ще один вражаючий план.", "Порівняти дію і планування"],
    ],
  },
];

// Day 11 content is kept as one finite, unique pool. The legacy declarations above remain
// as historical scaffolding, but this day's page uses only the pool below.
const day11WritingPool = [
  {
    ua: "Я працюю краще, коли моє тіло готове до роботи.",
    target: "I work better when...",
    wordBank: "work better / body / ready to work",
    examples: [
      "I work better when my body is ready to work.",
      "My work improves when I am physically ready to begin.",
    ],
    requiredGroups: [["work"], ["better", "improves"], ["when"], ["body", "physically"], ["ready", "prepared"]],
    required: ["work", "better", "when", "body", "ready"],
    suggestion: "Пов'яжи якість роботи з достатньою фізичною готовністю, а не з ідеальним настроєм.",
  },
  {
    ua: "Перед початком я перевіряю свій рівень енергії.",
    target: "Before I start, I...",
    wordBank: "before I start / check / energy level",
    examples: [
      "Before I start, I check my energy level.",
      "I check my energy before I begin working.",
    ],
    requiredGroups: [["before"], ["start", "begin"], ["check"], ["energy"]],
    required: ["before", "start", "check", "energy"],
    suggestion: "Скажи, що саме ти перевіряєш перед роботою і навіщо.",
  },
  {
    ua: "Поганий сон ускладнює зосередження.",
    target: "Poor sleep makes it harder to...",
    wordBank: "poor sleep / makes it harder / focus",
    examples: [
      "Poor sleep makes it harder to focus.",
      "When I sleep badly, concentrating becomes more difficult.",
    ],
    requiredGroups: [["sleep"], ["harder", "difficult"], ["focus", "concentrating"]],
    required: ["sleep", "harder", "focus"],
    suggestion: "Покажи причинно-наслідковий зв'язок: поганий сон -> важче зосередитися.",
  },
  {
    ua: "Коротка прогулянка допомагає мені прокинутися.",
    target: "A short walk helps me...",
    wordBank: "short walk / helps me / wake up",
    examples: [
      "A short walk helps me wake up.",
      "Taking a brief walk makes me feel more alert.",
    ],
    requiredGroups: [["short", "brief"], ["walk"], ["helps", "makes"], ["wake", "alert"]],
    required: ["walk", "helps", "wake"],
    suggestion: "Назви маленьку фізичну дію та її ефект на стан перед роботою.",
  },
  {
    ua: "Мені не потрібна ідеальна енергія, щоб почати.",
    target: "I do not need... to begin.",
    wordBank: "do not need / perfect energy / begin",
    examples: [
      "I do not need perfect energy to begin.",
      "I can start even when my energy is not perfect.",
    ],
    requiredGroups: [["not", "can"], ["need", "start"], ["perfect"], ["energy"], ["begin", "start"]],
    required: ["need", "perfect", "energy", "begin"],
    suggestion: "Відділи достатній стан від ідеального: почати можна без максимального заряду.",
  },
  {
    ua: "Я часто плутаю низьку енергію з відсутністю дисципліни.",
    target: "I sometimes confuse... with...",
    wordBank: "sometimes confuse / low energy / lack of discipline",
    examples: [
      "I sometimes confuse low energy with a lack of discipline.",
      "I often mistake low energy for a discipline problem.",
    ],
    requiredGroups: [["sometimes", "often"], ["confuse", "mistake"], ["low", "energy"], ["discipline"]],
    required: ["confuse", "energy", "discipline"],
    suggestion: "Порівняй фізичний стан із моральною оцінкою себе через конструкцію confuse X with Y.",
  },
  {
    ua: "Коли я втомлений, я спочатку перевіряю сон і рух.",
    target: "When I feel tired, I first check...",
    wordBank: "when I feel tired / first check / sleep and movement",
    examples: [
      "When I feel tired, I first check my sleep and movement.",
      "If I feel tired, I start by checking whether I have slept and moved enough.",
    ],
    requiredGroups: [["when", "if"], ["tired"], ["first", "start"], ["check"], ["sleep", "moved", "movement"]],
    required: ["tired", "first", "check", "sleep"],
    suggestion: "Побудуй порядок дій: стан -> перша перевірка -> два фізичні фактори.",
  },
  {
    ua: "Я можу перевірити одну фізичну зміну замість того, щоб вгадувати.",
    target: "I can test... instead of...",
    wordBank: "can test / physical change / instead of guessing",
    examples: [
      "I can test one small physical change instead of guessing.",
      "Instead of guessing, I can test one physical change and observe the result.",
    ],
    requiredGroups: [["can", "test"], ["physical"], ["change"], ["instead"], ["guess", "observe"]],
    required: ["test", "physical", "change", "instead"],
    suggestion: "Протистав припущення маленькому експерименту, який можна перевірити.",
  },
  {
    ua: "Мій контрольний список має бути достатньо простим для використання.",
    target: "My checklist should be...",
    wordBank: "checklist / should be / simple enough to use",
    examples: [
      "My checklist should be simple enough to use.",
      "I need a checklist that is easy to follow on an ordinary day.",
    ],
    requiredGroups: [["checklist"], ["should", "need"], ["simple", "easy"], ["use", "follow"]],
    required: ["checklist", "simple", "use"],
    suggestion: "Опиши вимогу до системи: вона має бути настільки простою, щоб ти реально нею користувався.",
  },
  {
    ua: "Я хочу порівняти, як почуваюся до і після перезавантаження.",
    target: "I want to compare... before and after...",
    wordBank: "want to compare / feel / before and after / reset",
    examples: [
      "I want to compare how I feel before and after the reset.",
      "I will compare my energy before the reset with how I feel afterward.",
    ],
    requiredGroups: [["want", "will"], ["compare"], ["feel", "energy"], ["before"], ["after", "afterward"], ["reset"]],
    required: ["compare", "before", "after", "reset"],
    suggestion: "Сформулюй простий спосіб виміряти ефект: стан до -> фізична зміна -> стан після.",
  },
  {
    ua: "Мета — знайти надійну умову для початку роботи.",
    target: "The goal is to find...",
    wordBank: "goal / find / reliable condition / start work",
    examples: [
      "The goal is to find a reliable condition for starting work.",
      "I want to identify a simple condition that helps me start working.",
    ],
    requiredGroups: [["goal", "want", "identify"], ["find", "identify"], ["reliable", "simple"], ["condition"], ["start", "working"]],
    required: ["goal", "find", "condition", "start"],
    suggestion: "Заверши відповідь не обіцянкою ідеального стану, а умовою, яку можна повторити.",
  },
];

const day11PhraseGroups = [
  {
    title: "Основні: зберуть відповідь",
    start: 1,
    items: [
      ["I work better when my body is ready enough to begin.", "Я працюю краще, коли моє тіло достатньо готове, щоб почати.", "Назвати мінімальний стан"],
      ["I do not need perfect energy to start.", "Мені не потрібна ідеальна енергія, щоб почати.", "Відділити достатній стан від ідеального"],
      ["Before I start, I check my energy level.", "Перед початком я перевіряю свій рівень енергії.", "Назвати першу перевірку"],
      ["Poor sleep makes it harder to focus.", "Поганий сон ускладнює зосередження.", "Пояснити фізичну причину"],
      ["A short walk helps me wake up.", "Коротка прогулянка допомагає мені прокинутися.", "Назвати корисний рух"],
      ["I sometimes confuse low energy with a lack of discipline.", "Я іноді плутаю низьку енергію з відсутністю дисципліни.", "Показати головну помилку інтерпретації"],
      ["I can test one small physical change.", "Я можу перевірити одну маленьку фізичну зміну.", "Запропонувати експеримент"],
      ["I want to compare how I feel before and after.", "Я хочу порівняти, як почуваюся до і після.", "Назвати спосіб перевірки"],
      ["The goal is to find a reliable starting condition.", "Мета — знайти надійну умову для початку.", "Сформулювати результат"],
      ["My body gives me information, not a verdict.", "Моє тіло дає мені інформацію, а не вирок.", "Сформулювати особистий інсайт"],
    ],
  },
  {
    title: "Додаткові: розвинь думку",
    start: 11,
    items: [
      ["I tend to work worse after a poor night's sleep.", "Я зазвичай працюю гірше після поганого нічного сну.", "Описати свій патерн"],
      ["Light and fresh air help me feel more alert.", "Світло і свіже повітря допомагають мені почуватися бадьоріше.", "Додати два фактори"],
      ["I notice when my body needs a reset.", "Я помічаю, коли моєму тілу потрібне перезавантаження.", "Помітити сигнал"],
      ["I do not need to feel amazing before I begin.", "Мені не потрібно почуватися чудово перед початком.", "Знизити вимогу до стану"],
      ["Movement can make the first step easier.", "Рух може полегшити перший крок.", "Пояснити користь руху"],
      ["I can test one change instead of making a theory.", "Я можу перевірити одну зміну замість того, щоб будувати теорію.", "Порівняти тест і здогадку"],
      ["My checklist should be simple enough to use.", "Мій список перевірки має бути достатньо простим для використання.", "Описати вимогу до системи"],
      ["I want to compare my state before and after the reset.", "Я хочу порівняти свій стан до і після перезавантаження.", "Підготувати вимірювання"],
      ["The next useful action matters more than a perfect mood.", "Наступна корисна дія важливіша за ідеальний настрій.", "Повернутися до дії"],
      ["A small physical reset can give me useful evidence.", "Маленьке фізичне перезавантаження може дати мені корисний доказ.", "Пов'язати дію з доказом"],
    ],
  },
  {
    title: "Для діалогу: якщо захочеш розгорнути тему",
    start: 21,
    items: [
      ["I am trying to separate a physical problem from an emotional one.", "Я намагаюся відділити фізичну проблему від емоційної.", "Розрізнити причини"],
      ["If my energy is low, I can make the first task smaller.", "Якщо моя енергія низька, я можу зменшити першу задачу.", "Застосувати умову"],
      ["What matters is whether the reset helps me act.", "Важливо, чи допомагає перезавантаження мені діяти.", "Поставити дію вище відчуття"],
      ["I can build a routine around evidence.", "Я можу побудувати рутину на основі доказів.", "Пояснити принцип системи"],
      ["My body gives me a signal, but I still choose the next action.", "Моє тіло дає мені сигнал, але наступну дію все одно обираю я.", "Поєднати інформацію і відповідальність"],
      ["A reliable start is better than an impressive plan.", "Надійний старт кращий за вражаючий план.", "Порівняти практичність і масштаб"],
      ["I want a system that works on ordinary days.", "Я хочу систему, яка працює у звичайні дні.", "Визначити критерій системи"],
      ["I can learn more from one small test than from guessing for an hour.", "Я можу дізнатися більше з одного маленького тесту, ніж із годинних здогадок.", "Захистити експеримент"],
      ["The reset is useful only if it leads to a real action.", "Перезавантаження корисне лише тоді, коли веде до реальної дії.", "Зв'язати стан із роботою"],
      ["I am looking for a condition I can repeat, not a feeling I can chase.", "Я шукаю умову, яку можу повторити, а не відчуття, за яким можу ганятися.", "Сформулювати зрілий критерій"],
    ],
  },
];

writingPool.splice(0, writingPool.length, ...day11WritingPool);
phraseGroups.splice(0, phraseGroups.length, ...day11PhraseGroups);

const day12WritingPool = [
  {
    ua: "Після поганого сну мені важче зосередитися.", target: "After a poor night's sleep, it is harder for me to...", wordBank: "after poor sleep / harder for me / focus",
    examples: ["After a poor night's sleep, it is harder for me to focus.", "When I sleep badly, I find it more difficult to concentrate."],
    requiredGroups: [["after", "when"], ["sleep"], ["harder", "difficult"], ["focus", "concentrate"]], required: ["sleep", "harder", "focus"], suggestion: "Побудуй причинний зв'язок: стан після сну -> що саме стає важчим."
  },
  {
    ua: "Денне світло допомагає мені відчути більшу бадьорість.", target: "Daylight helps me feel...", wordBank: "daylight / helps me feel / alert",
    examples: ["Daylight helps me feel more alert.", "Getting some daylight makes me feel more awake."],
    requiredGroups: [["daylight", "light"], ["helps", "makes"], ["alert", "awake"]], required: ["light", "helps", "alert"], suggestion: "Назви фізичний фактор і зміну стану, але не перебільшуй результат."
  },
  {
    ua: "Короткий рух може бути кращим першим кроком, ніж змушувати себе.", target: "A short movement break may be better than...", wordBank: "short movement break / better than / forcing myself",
    examples: ["A short movement break may be better than forcing myself to work immediately.", "Moving for a few minutes can be a better first step than pushing through blindly."],
    requiredGroups: [["short", "few"], ["movement", "moving"], ["better"], ["than"], ["forcing", "pushing"]], required: ["movement", "better", "than"], suggestion: "Порівняй короткий рух із механічним примусом себе."
  },
  {
    ua: "Я хочу перевірити, який фізичний важіль дає мені найкращий старт.", target: "I want to test which physical lever...", wordBank: "want to test / physical lever / best start",
    examples: ["I want to test which physical lever gives me the best start.", "I want to find out whether light, sleep, or movement helps me start most reliably."],
    requiredGroups: [["want", "find"], ["test", "find"], ["physical", "light", "sleep", "movement"], ["lever", "helps"], ["best", "reliably"], ["start"]], required: ["test", "physical", "start"], suggestion: "Сформулюй це як маленьке дослідження, а не як готовий висновок."
  },
  {
    ua: "Якщо я погано спав, я не вимагаю від себе ідеального темпу.", target: "If I sleep badly, I do not expect...", wordBank: "if I sleep badly / do not expect / perfect pace",
    examples: ["If I sleep badly, I do not expect a perfect pace from myself.", "When I have slept poorly, I lower the standard without abandoning the task."],
    requiredGroups: [["if", "when"], ["sleep", "slept"], ["not", "lower"], ["expect", "standard"], ["perfect", "task"]], required: ["sleep", "not", "perfect"], suggestion: "Покажи адаптацію стандарту без повної відмови від роботи."
  },
  {
    ua: "Перед роботою я можу вийти на денне світло на п'ять хвилин.", target: "Before work, I can... for five minutes.", wordBank: "before work / get outside / daylight / five minutes",
    examples: ["Before work, I can get outside into daylight for five minutes.", "I can spend five minutes outside in the daylight before I start working."],
    requiredGroups: [["before"], ["work"], ["outside", "daylight"], ["five", "minutes"]], required: ["before", "work", "daylight", "minutes"], suggestion: "Зроби важіль конкретним: дія, місце або умова і час."
  },
  {
    ua: "Після руху я перевірю, чи легше зробити першу задачу.", target: "After moving, I will check whether...", wordBank: "after moving / check whether / first task / easier",
    examples: ["After moving, I will check whether the first task feels easier.", "I will see if a short walk makes it easier to begin my first task."],
    requiredGroups: [["after", "walk"], ["moving", "move"], ["check", "see"], ["whether", "if"], ["first", "begin"], ["easier"]], required: ["moving", "check", "first", "easier"], suggestion: "Опиши не настрій, а перевірку впливу на конкретну першу задачу."
  },
  {
    ua: "Я не хочу будувати рутину на здогадках.", target: "I do not want to build a routine based on...", wordBank: "do not want / build a routine / guesses",
    examples: ["I do not want to build a routine based on guesses.", "I would rather test a routine than assume it will work."],
    requiredGroups: [["not", "rather"], ["want", "would"], ["build", "test"], ["routine"], ["guess", "assume"]], required: ["want", "routine", "guess"], suggestion: "Протистав здогадку перевірці, не роблячи з цього складну теорію."
  },
  {
    ua: "Один тест не доводить правило, але дає корисний сигнал.", target: "One test does not prove..., but it gives me...", wordBank: "one test / does not prove / useful signal",
    examples: ["One test does not prove a rule, but it gives me a useful signal.", "A single result is not proof, but it can tell me what to test next."],
    requiredGroups: [["one", "single"], ["test", "result"], ["not", "does"], ["prove", "proof"], ["signal", "tell"]], required: ["test", "not", "signal"], suggestion: "Сформулюй обережний висновок: один результат — це сигнал для наступного тесту, а не остаточна істина."
  },
  {
    ua: "Моя базова рутина має бути реальною для звичайного дня.", target: "My basic routine needs to be...", wordBank: "basic routine / needs to be / realistic / ordinary day",
    examples: ["My basic routine needs to be realistic for an ordinary day.", "I need a simple routine that I can maintain on a normal day."],
    requiredGroups: [["basic", "simple"], ["routine"], ["needs", "need"], ["realistic", "maintain"], ["ordinary", "normal"]], required: ["routine", "need", "realistic", "day"], suggestion: "Зв'яжи якість рутини з тим, чи можна її підтримувати у звичайний день."
  },
  {
    ua: "Найкращий важіль — той, який я можу повторювати.", target: "The best lever is the one I can...", wordBank: "best lever / the one / repeat",
    examples: ["The best lever is the one I can repeat.", "The most useful change is the one I can keep using on ordinary days."],
    requiredGroups: [["best", "useful"], ["lever", "change"], ["one"], ["repeat", "keep"]], required: ["best", "lever", "repeat"], suggestion: "Заверши відповідь критерієм: корисною є не найяскравіша, а повторювана зміна."
  },
];

const day12PhraseGroups = [
  { title: "Основні: зберуть відповідь", start: 1, items: [
    ["After a poor night's sleep, it is harder for me to focus.", "Після поганого сну мені важче зосередитися.", "Пояснити вплив сну"],
    ["Daylight helps me feel more alert.", "Денне світло допомагає мені почуватися бадьоріше.", "Назвати фізичний важіль"],
    ["A short movement break may be better than forcing myself.", "Коротка руханка може бути кращою, ніж змушувати себе.", "Порівняти рух і примус"],
    ["I want to test which physical lever gives me the best start.", "Я хочу перевірити, який фізичний важіль дає мені найкращий старт.", "Сформулювати тест"],
    ["If I sleep badly, I do not expect a perfect pace from myself.", "Якщо я погано спав, я не вимагаю від себе ідеального темпу.", "Адаптувати стандарт"],
    ["Before work, I can get outside into daylight for five minutes.", "Перед роботою я можу вийти на денне світло на п'ять хвилин.", "Зробити тест конкретним"],
    ["After moving, I will check whether the first task feels easier.", "Після руху я перевірю, чи перша задача відчувається легшою.", "Виміряти ефект"],
    ["I do not want to build a routine based on guesses.", "Я не хочу будувати рутину на здогадках.", "Відділити тест від припущення"],
    ["One test does not prove a rule, but it gives me a useful signal.", "Один тест не доводить правило, але дає корисний сигнал.", "Сформулювати обережний висновок"],
    ["My basic routine needs to be realistic for an ordinary day.", "Моя базова рутина має бути реальною для звичайного дня.", "Назвати критерій рутини"],
  ] },
  { title: "Додаткові: розвинь думку", start: 11, items: [
    ["I tend to underestimate the effect of poor sleep.", "Я схильний недооцінювати вплив поганого сну.", "Назвати сліпу зону"],
    ["Fresh air can make the first step feel less expensive.", "Свіже повітря може зробити перший крок менш важким.", "Пояснити ефект"],
    ["I can compare two different starting conditions.", "Я можу порівняти дві різні умови старту.", "Побудувати порівняння"],
    ["I am looking for a useful pattern, not a perfect explanation.", "Я шукаю корисний патерн, а не ідеальне пояснення.", "Залишити дослідження практичним"],
    ["A physical lever should lead to a real work action.", "Фізичний важіль має вести до реальної робочої дії.", "Пов'язати стан і роботу"],
    ["I can lower the standard without abandoning the task.", "Я можу знизити стандарт, не відмовляючись від задачі.", "Зберегти напрям"],
    ["The result will tell me what to test next.", "Результат покаже мені, що перевірити далі.", "Побудувати наступний крок"],
    ["I want to use evidence instead of judging my character.", "Я хочу використовувати докази, а не оцінювати свій характер.", "Змінити інтерпретацію"],
    ["Small changes are easier to repeat than heroic routines.", "Маленькі зміни легше повторювати, ніж героїчні рутини.", "Порівняти масштаб"],
    ["The best routine is one I can use when life is not perfect.", "Найкраща рутина — та, яку я можу використовувати, коли життя неідеальне.", "Перевірити стійкість"],
  ] },
  { title: "Для діалогу: якщо захочеш розгорнути тему", start: 21, items: [
    ["Sleep, light, and movement may work differently for me.", "Сон, світло і рух можуть працювати для мене по-різному.", "Не робити загальний висновок"],
    ["I need to test one variable at a time.", "Мені потрібно перевіряти одну змінну за раз.", "Зробити експеримент чистішим"],
    ["What matters is whether I start the next useful action.", "Важливо, чи починаю я наступну корисну дію.", "Визначити результат"],
    ["I can treat my energy as information rather than an excuse.", "Я можу сприймати свою енергію як інформацію, а не як виправдання.", "Збалансувати відповідальність"],
    ["A better start gives me access to the rest of the day.", "Кращий старт дає мені доступ до решти дня.", "Пов'язати старт із життям"],
    ["I do not need to optimize everything before I begin.", "Мені не потрібно оптимізувати все перед початком.", "Прибрати надмірне планування"],
    ["I can learn from a result without turning it into an identity.", "Я можу вчитися з результату, не перетворюючи його на оцінку себе.", "Відділити факт від самооцінки"],
    ["The experiment is useful even if it gives me a negative result.", "Експеримент корисний, навіть якщо дає негативний результат.", "Зберегти користь невдачі"],
    ["I want a physical reset that supports my work, not replaces it.", "Я хочу фізичне перезавантаження, яке підтримує мою роботу, а не замінює її.", "Не втекти в підготовку"],
    ["The next decision should be based on what I observed.", "Наступне рішення має ґрунтуватися на тому, що я спостерігав.", "Закрити цикл доказом"],
  ] },
];

writingPool.splice(0, writingPool.length, ...day12WritingPool);
phraseGroups.splice(0, phraseGroups.length, ...day12PhraseGroups);

const day13WritingPool = [
  {
    ua: "Я часто тягнуся до швидкої винагороди, коли задача здається туманною.", target: "I often reach for a quick reward when...", wordBank: "often reach for / quick reward / task feels unclear",
    examples: ["I often reach for a quick reward when a task feels unclear.", "When a task is vague, I tend to look for something immediately enjoyable."],
    requiredGroups: [["often", "when"], ["reach", "tend", "look"], ["quick", "immediately"], ["reward", "enjoyable"], ["task"], ["unclear", "vague"]], required: ["reach", "quick", "reward"], suggestion: "Назви момент, коли туманна задача підштовхує тебе до легкої винагороди."
  },
  {
    ua: "Я відволікаюся не тому, що мені байдуже, а тому що швидка винагорода доступна.", target: "I get distracted not because..., but because...", wordBank: "get distracted / not because / but because / available",
    examples: ["I get distracted not because I do not care, but because quick rewards are available.", "The problem is not a lack of interest; immediate rewards are simply easier to access."],
    requiredGroups: [["distracted", "problem"], ["not", "lack"], ["because", "are"], ["quick", "immediate"], ["reward", "rewards"], ["available", "access"]], required: ["distracted", "because", "reward"], suggestion: "Використай контраст: причина не в байдужості, а в легкій доступності винагороди."
  },
  {
    ua: "Коли я перемикаюся на Telegram, я втрачаю темп, який уже набрав.", target: "When I switch to..., I...", wordBank: "when I switch to / lose momentum / break my focus",
    examples: ["When I switch to Telegram, I lose the momentum I had.", "Switching to Telegram breaks my focus before I notice it."],
    requiredGroups: [["when", "switching"], ["telegram"], ["lose", "breaks"], ["momentum", "focus"], ["had", "notice"]], required: ["telegram", "lose", "focus"], suggestion: "Покажи послідовність: перемикання відбувається першим, втрата фокусу — наслідок."
  },
  {
    ua: "Я кажу собі, що лише перевірю одне повідомлення.", target: "I tell myself I will only...", wordBank: "tell myself / will only / check one message",
    examples: ["I tell myself I will only check one message.", "I usually promise myself that I will be back in a minute."],
    requiredGroups: [["tell", "promise"], ["myself"], ["only", "minute"], ["check", "back"], ["message", "minute"]], required: ["tell", "myself", "only"], suggestion: "Зверни увагу на конструкцію tell myself + will: це думка, яку ти кажеш собі перед відволіканням."
  },
  {
    ua: "Швидка винагорода дає мені полегшення, але відкладає важливу роботу.", target: "A quick reward gives me..., but...", wordBank: "quick reward / gives me relief / delays important work",
    examples: ["A quick reward gives me relief, but it delays the work I actually care about.", "It feels good for a moment, but it makes the important task easier to postpone."],
    requiredGroups: [["quick", "feels"], ["reward", "good"], ["relief", "moment"], ["but"], ["delays", "postpone"], ["work", "task"]], required: ["reward", "but", "work"], suggestion: "Побудуй контраст: коротке полегшення зараз -> ціна для важливої роботи."
  },
  {
    ua: "Замість того щоб відкривати Telegram, я можу записати наступну фізичну дію.", target: "Instead of opening..., I can...", wordBank: "instead of opening / next physical action / write down",
    examples: ["Instead of opening Telegram, I can write down the next physical action.", "I can name the next action before I choose a quick reward."],
    requiredGroups: [["instead", "before"], ["opening", "choose"], ["telegram", "reward"], ["write", "name"], ["next", "action"]], required: ["instead", "next", "action"], suggestion: "Після instead of для дії використай -ing: instead of opening. Після can — базове дієслово: can write."
  },
  {
    ua: "Я можу зробити швидку винагороду менш доступною під час робочого блоку.", target: "I can make the quick reward less...", wordBank: "make less available / during a work block / add a barrier",
    examples: ["I can make the quick reward less available during a work block.", "I can add a small barrier between the urge and the app."],
    requiredGroups: [["make", "add"], ["quick", "urge"], ["less", "barrier"], ["available", "app"], ["during", "between"]], required: ["make", "less", "available"], suggestion: "Опиши зміну середовища, а не обіцянку бути сильнішим: зменшити доступність винагороди."
  },
  {
    ua: "Якщо я відкладу винагороду на десять хвилин, я матиму час почати задачу.", target: "If I delay the reward for..., I will...", wordBank: "if I delay / ten minutes / have time to start",
    examples: ["If I delay the reward for ten minutes, I will have time to start the task.", "I will give myself ten minutes of work before I decide what to do next."],
    requiredGroups: [["if", "before"], ["delay", "give"], ["reward", "work"], ["ten", "minutes"], ["start", "decide"], ["task", "next"]], required: ["delay", "minutes", "start"], suggestion: "Умовна конструкція: If + теперішній час, will + базова дія."
  },
  {
    ua: "Мені не потрібно прибирати всі винагороди; мені потрібно обрати, коли вони мені служать.", target: "I do not need to remove...; I need to...", wordBank: "do not need to remove / choose when / serves me",
    examples: ["I do not need to remove every reward; I need to choose when it serves me.", "The goal is not to ban entertainment, but to stop it from choosing for me."],
    requiredGroups: [["not", "goal"], ["remove", "ban"], ["reward", "entertainment"], ["need", "stop"], ["choose", "choosing"]], required: ["need", "reward", "choose"], suggestion: "Не роби висновок 'усе заборонити'. Побудуй зріле протиставлення: не прибрати, а керувати моментом."
  },
  {
    ua: "Я зрозумію, що експеримент допоміг, коли почну заплановану задачу до відкриття застосунку.", target: "I will know the experiment helped when...", wordBank: "know the experiment helped / start the planned task / before opening the app",
    examples: ["I will know the experiment helped when I start the planned task before opening the app.", "The test worked if I can notice the urge and still take the next useful action."],
    requiredGroups: [["know", "worked"], ["experiment", "test"], ["helped", "worked"], ["when", "if"], ["start", "take"], ["task", "action"]], required: ["experiment", "start", "task"], suggestion: "Назви поведінковий доказ: що ти зробиш до того, як відкриєш швидку винагороду."
  },
  {
    ua: "Найкраща система — не найсуворіша, а та, що працює, коли я втомився.", target: "The best system is not..., but...", wordBank: "best system / not the strictest / works when I am tired",
    examples: ["The best system is not the strictest one, but the one that works when I am tired.", "A useful system reduces the number of decisions I have to make."],
    requiredGroups: [["best", "useful"], ["system"], ["not", "reduces"], ["strictest", "decisions"], ["but", "when"], ["works", "make"]], required: ["system", "not", "works"], suggestion: "Заверши тему критерієм: система має працювати у втомленому стані, а не лише в ідеальний день."
  },
];

const day13PhraseGroups = [
  { title: "Основні: зберуть відповідь", start: 1, items: [
    ["I often reach for a quick reward when a task feels unclear.", "Я часто тягнуся до швидкої винагороди, коли задача здається туманною.", "Назвати тригер"],
    ["I get distracted not because I do not care, but because quick rewards are available.", "Я відволікаюся не тому, що мені байдуже, а тому що швидка винагорода доступна.", "Пояснити механізм без самоосуду"],
    ["When I switch to Telegram, I lose the momentum I had.", "Коли я перемикаюся на Telegram, я втрачаю вже набраний темп.", "Назвати особистий приклад"],
    ["I tell myself I will only check one message.", "Я кажу собі, що лише перевірю одне повідомлення.", "Показати типову виправдувальну думку"],
    ["A quick reward gives me relief, but it delays the work I actually care about.", "Швидка винагорода дає мені полегшення, але відкладає важливу для мене роботу.", "Показати коротку вигоду і ціну"],
    ["Instead of opening Telegram, I can write down the next physical action.", "Замість того щоб відкривати Telegram, я можу записати наступну фізичну дію.", "Замінити імпульс дією"],
    ["I can make the quick reward less available during a work block.", "Я можу зробити швидку винагороду менш доступною під час робочого блоку.", "Змінити середовище"],
    ["If I delay the reward for ten minutes, I will have time to start the task.", "Якщо я відкладу винагороду на десять хвилин, я матиму час почати задачу.", "Сформувати план 'якщо — то'"],
    ["I do not need to remove every reward; I need to choose when it serves me.", "Мені не потрібно прибирати всі винагороди; мені потрібно обирати, коли вони мені служать.", "Сформулювати зрілу позицію"],
    ["I will know the experiment helped when I start the planned task before opening the app.", "Я зрозумію, що експеримент допоміг, коли почну заплановану задачу до відкриття застосунку.", "Назвати доказ"],
  ] },
  { title: "Додаткові: розвинь думку", start: 11, items: [
    ["The immediate reward is real, but the delayed cost is easy to ignore.", "Швидка винагорода реальна, але відкладену ціну легко ігнорувати.", "Порівняти зараз і потім"],
    ["I am more vulnerable to distraction when the next action is vague.", "Я більш вразливий до відволікання, коли наступна дія нечітка.", "Пов'язати туманність і відволікання"],
    ["A visible next step can compete with an invisible reward.", "Видимий наступний крок може конкурувати з невидимою винагородою.", "Пояснити заміну"],
    ["I can notice the urge without obeying it immediately.", "Я можу помітити імпульс, не підкоряючись йому одразу.", "Відокремити сигнал від дії"],
    ["The difficult part is not knowing what matters; it is protecting the first minutes.", "Складність не в тому, щоб знати, що важливо, а в захисті перших хвилин.", "Сформулювати справжню проблему"],
    ["A small barrier can create enough time for a better choice.", "Маленький бар'єр може створити достатньо часу для кращого вибору.", "Пояснити роль середовища"],
    ["I want to replace the automatic choice with a deliberate one.", "Я хочу замінити автоматичний вибір обдуманим.", "Назвати напрям зміни"],
    ["I should measure whether I start, not whether I feel perfectly motivated.", "Мені варто вимірювати, чи я почав, а не чи відчуваю ідеальну мотивацію.", "Вибрати правильний показник"],
    ["The reward becomes less dangerous when I decide its place in the day.", "Винагорода стає менш небезпечною, коли я визначаю її місце в дні.", "Повернути собі вибір"],
    ["The point is to create a pause between the urge and the action.", "Мета — створити паузу між імпульсом і дією.", "Стиснути інсайт"],
  ] },
  { title: "Для діалогу: якщо захочеш розгорнути тему", start: 21, items: [
    ["I do not want to confuse immediate pleasure with a useful result.", "Я не хочу плутати миттєве задоволення з корисним результатом.", "Відділити приємне від корисного"],
    ["When I protect the first ten minutes, the task often feels less threatening.", "Коли я захищаю перші десять хвилин, задача часто здається менш загрозливою.", "Пояснити ефект старту"],
    ["I can keep entertainment without letting it choose my priorities.", "Я можу залишити розваги, не дозволяючи їм обирати мої пріоритети.", "Зберегти баланс"],
    ["The useful question is what I am avoiding by seeking a quick reward.", "Корисне питання — що я уникаю, шукаючи швидку винагороду.", "Поставити діагностичне питання"],
    ["I am testing a system, not trying to prove that I have perfect discipline.", "Я тестую систему, а не намагаюся довести, що маю ідеальну дисципліну.", "Зняти самоосуд"],
    ["The next action has to be clear enough to compete with the phone.", "Наступна дія має бути достатньо чіткою, щоб конкурувати з телефоном.", "Зробити дію конкретною"],
    ["A ten-minute delay is small enough to test and long enough to observe.", "Десятихвилинна затримка достатньо мала для тесту і достатньо довга для спостереження.", "Обґрунтувати масштаб"],
    ["I can learn from a failed experiment without turning it into a verdict about me.", "Я можу вчитися з невдалого експерименту, не перетворюючи його на вирок собі.", "Відділити результат від особистості"],
    ["A clear environment makes the better choice easier to repeat.", "Чітко організоване середовище полегшує повторення кращого вибору.", "Зв'язати умови і повторення"],
    ["My goal is not to remove every temptation but to make the next useful action easier.", "Моя мета — не прибрати кожну спокусу, а полегшити наступну корисну дію.", "Закрити розмову"],
  ] },
];

writingPool.splice(0, writingPool.length, ...day13WritingPool);
phraseGroups.splice(0, phraseGroups.length, ...day13PhraseGroups);

const day14WritingPool = [
  {
    ua: "Невеликий тиск іноді допомагає мені зосередитися, тоді як надмірний тиск мене блокує.", target: "A little pressure can..., whereas...", wordBank: "a little pressure / helps me focus / whereas too much pressure / freezes me",
    examples: ["A little pressure can help me focus, whereas too much pressure freezes me.", "Some pressure gives me direction, while excessive pressure makes it harder to act."],
    requiredGroups: [["little", "some"], ["pressure"], ["help", "gives"], ["focus", "direction"], ["whereas", "while"], ["much", "excessive"], ["freeze", "harder"]], required: ["pressure", "focus", "whereas"], suggestion: "Порівняй два види тиску в одному реченні: корисний і такий, що блокує."
  },
  {
    ua: "Коли я бачу конкретний наступний крок, тиск стає керованішим.", target: "When I can see..., pressure becomes...", wordBank: "when I can see / a clear next step / pressure becomes / manageable",
    examples: ["When I can see a clear next step, pressure becomes more manageable.", "Pressure feels easier to handle when the next action is visible."],
    requiredGroups: [["when"], ["see", "visible"], ["clear", "next"], ["step", "action"], ["pressure"], ["manageable", "easier"]], required: ["when", "pressure", "step"], suggestion: "Постав умову на початок, а потім покажи, як вона змінює відчуття тиску."
  },
  {
    ua: "Я завмираю не тому, що мені байдуже, а тому що задача здається загрозливою.", target: "I freeze not because..., but because...", wordBank: "freeze / not because I do not care / but because / task feels threatening",
    examples: ["I freeze not because I do not care, but because the task feels threatening.", "The problem is not a lack of interest; the task feels too uncertain to start."],
    requiredGroups: [["freeze", "problem"], ["not", "lack"], ["because", "interest"], ["but", "problem"], ["task"], ["threatening", "uncertain"]], required: ["freeze", "because", "task"], suggestion: "Відділи байдужість від страху або невизначеності за допомогою not because... but because..."
  },
  {
    ua: "Замість того щоб боротися з усім завданням, я можу назвати першу дію.", target: "Rather than..., I can...", wordBank: "rather than / solve the whole task / name / first action",
    examples: ["Rather than fighting the whole task, I can name the first action.", "Instead of trying to solve everything, I can choose one safe starting step."],
    requiredGroups: [["rather", "instead"], ["fighting", "trying", "solve"], ["whole", "everything"], ["task"], ["can"], ["name", "choose"], ["first", "starting"], ["action", "step"]], required: ["rather", "action", "task"], suggestion: "Після rather than назви дію у формі -ing, а після can — базове дієслово."
  },
  {
    ua: "Я хочу відповісти на тиск спокійною дією, а не новою хвилею планування.", target: "I want to respond to... rather than...", wordBank: "respond to pressure / with a calm action / rather than / more planning",
    examples: ["I want to respond to pressure with a calm action rather than more planning.", "I would rather take one clear step than create another complicated plan."],
    requiredGroups: [["want", "would"], ["respond", "take"], ["pressure", "step"], ["calm", "clear"], ["rather", "than"], ["planning", "plan"]], required: ["respond", "pressure", "rather"], suggestion: "Порівняй корисну реакцію з тією, яка лише створює ще більше планування."
  },
  {
    ua: "Поки я намагаюся передбачити весь результат, я не роблю першого кроку.", target: "While I am trying to..., I am not...", wordBank: "while I am trying to / predict the whole result / I am not taking / first step",
    examples: ["While I am trying to predict the whole result, I am not taking the first step.", "I lose time while I am trying to make the entire process certain."],
    requiredGroups: [["while"], ["trying", "predict"], ["whole", "entire"], ["result", "process"], ["not", "lose"], ["taking", "make"], ["first", "certain"]], required: ["while", "result", "step"], suggestion: "Покажи дві дії, які відбуваються одночасно: зайве передбачення і відсутність старту."
  },
  {
    ua: "Один повільний видих може дати мені секунду, щоб обрати реакцію.", target: "One slow breath can give me...", wordBank: "one slow breath / give me a second / choose / response",
    examples: ["One slow breath can give me a second to choose my response.", "A slow breath creates a small pause before I react automatically."],
    requiredGroups: [["one", "a"], ["slow", "small"], ["breath"], ["give", "creates"], ["second", "pause"], ["choose", "react"], ["response", "automatically"]], required: ["breath", "give", "response"], suggestion: "Назви маленький фізичний крок і те, що він дає тобі перед реакцією."
  },
  {
    ua: "Якщо тиск зростає, я спочатку зменшу задачу до двох хвилин.", target: "If pressure increases, I will first...", wordBank: "if pressure increases / reduce the task / two minutes / first step",
    examples: ["If pressure increases, I will first reduce the task to two minutes.", "When I feel overwhelmed, I will make the first action smaller instead of stopping."],
    requiredGroups: [["if", "when"], ["pressure", "overwhelmed"], ["increases", "feel"], ["will"], ["reduce", "make"], ["task", "action"], ["two", "smaller"], ["minutes", "first"]], required: ["pressure", "will", "task"], suggestion: "Умовна схема: If/When + ситуація, I will + базова дія."
  },
  {
    ua: "Я зрозумію, що перезавантаження допомогло, коли зможу назвати наступну дію.", target: "I will know the reset helped when...", wordBank: "know the reset helped / when I can name / next action",
    examples: ["I will know the reset helped when I can name the next action.", "The reset worked if I can start one clear step without more planning."],
    requiredGroups: [["know", "worked"], ["reset"], ["helped", "worked"], ["when", "if"], ["can", "start"], ["name", "start"], ["next", "one"], ["action", "step"]], required: ["reset", "when", "action"], suggestion: "Назви поведінковий доказ: що ти зможеш зробити після короткого перезавантаження."
  },
  {
    ua: "Мені не потрібно чекати, поки я заспокоюся; мені потрібно почати безпечну маленьку дію.", target: "I do not need to wait until...; I need to...", wordBank: "do not need to wait / until I feel calm / need to start / small safe action",
    examples: ["I do not need to wait until I feel calm; I need to start a small safe action.", "I can begin before the pressure disappears if the first step is manageable."],
    requiredGroups: [["not", "do"], ["need", "can"], ["wait", "begin"], ["until", "before"], ["calm", "pressure"], ["start", "begin"], ["small", "first"], ["safe", "manageable"], ["action", "step"]], required: ["need", "wait", "start"], suggestion: "Побудуй не вимогу дочекатися ідеального стану, а дозвіл почати маленьку дію."
  },
  {
    ua: "Корисний тиск дає напрям, тоді як паніка забирає вибір.", target: "Useful pressure gives..., whereas panic...", wordBank: "useful pressure / gives direction / whereas panic / takes away choice",
    examples: ["Useful pressure gives me direction, whereas panic takes away my sense of choice.", "Pressure can point me toward action, while panic makes every option feel impossible."],
    requiredGroups: [["useful", "pressure"], ["gives", "points"], ["direction", "action"], ["whereas", "while"], ["panic"], ["takes", "makes"], ["choice", "option"]], required: ["pressure", "direction", "panic"], suggestion: "Заверши відповідь власною теорією: який тиск допомагає, а який забирає вибір."
  },
];

const day14PhraseGroups = [
  { title: "Основні: зберуть відповідь", start: 1, items: [
    ["A little pressure can help me focus, whereas too much pressure freezes me.", "Невеликий тиск може допомогти мені зосередитися, тоді як надмірний тиск мене блокує.", "Порівняти два види тиску"],
    ["When I can see a clear next step, pressure becomes more manageable.", "Коли я бачу чіткий наступний крок, тиск стає керованішим.", "Показати роль ясності"],
    ["I freeze not because I do not care, but because the task feels threatening.", "Я завмираю не тому, що мені байдуже, а тому що задача здається загрозливою.", "Відділити страх від байдужості"],
    ["Rather than fighting the whole task, I can name the first action.", "Замість того щоб боротися з усією задачею, я можу назвати першу дію.", "Зменшити задачу"],
    ["I want to respond to pressure with a calm action rather than more planning.", "Я хочу відповідати на тиск спокійною дією, а не новим плануванням.", "Замінити планування дією"],
    ["While I am trying to predict the whole result, I am not taking the first step.", "Поки я намагаюся передбачити весь результат, я не роблю першого кроку.", "Назвати приховану затримку"],
    ["One slow breath can give me a second to choose my response.", "Один повільний видих може дати мені секунду, щоб обрати реакцію.", "Створити паузу"],
    ["If pressure increases, I will first reduce the task to two minutes.", "Якщо тиск зростає, я спочатку зменшу задачу до двох хвилин.", "Сформувати план дії"],
    ["I will know the reset helped when I can name the next action.", "Я зрозумію, що перезавантаження допомогло, коли зможу назвати наступну дію.", "Назвати доказ"],
    ["I do not need to wait until I feel calm; I need to start a small safe action.", "Мені не потрібно чекати, поки я заспокоюся; мені потрібно почати маленьку безпечну дію.", "Дозволити собі почати"],
  ] },
  { title: "Додаткові: розвинь думку", start: 11, items: [
    ["Useful pressure gives me direction, whereas panic takes away my sense of choice.", "Корисний тиск дає мені напрям, тоді як паніка забирає відчуття вибору.", "Сформулювати власну теорію"],
    ["The problem is not always pressure; sometimes it is an unclear next action.", "Проблема не завжди в тиску; іноді це нечітка наступна дія.", "Уточнити діагноз"],
    ["I can lower the emotional volume without abandoning the important task.", "Я можу зменшити емоційну гучність, не відмовляючись від важливої задачі.", "Знизити напруження"],
    ["A short pause helps me respond instead of reacting automatically.", "Коротка пауза допомагає мені відповідати, а не реагувати автоматично.", "Пояснити механізм"],
    ["I become more capable when I turn pressure into one visible decision.", "Я стаю спроможнішим, коли перетворюю тиск на одне видиме рішення.", "Перетворити стан на вибір"],
    ["I do not need to solve the whole problem before I can make progress.", "Мені не потрібно вирішити всю проблему, перш ніж я зможу просунутися.", "Послабити вимогу"],
    ["The first useful action is often smaller than the story in my head.", "Перша корисна дія часто менша за історію, яку я створив у голові.", "Порівняти уяву і дію"],
    ["When I name the risk clearly, it becomes easier to choose a proportionate response.", "Коли я чітко називаю ризик, мені легше обрати відповідну реакцію.", "Описати ризик"],
    ["I can treat pressure as information without letting it define my ability.", "Я можу сприймати тиск як інформацію, не дозволяючи йому визначати мою спроможність.", "Відділити стан від особистості"],
    ["The goal is not to feel nothing; it is to keep enough choice to act.", "Мета не в тому, щоб нічого не відчувати, а в тому, щоб зберегти достатньо вибору для дії.", "Закрити інсайт"],
  ] },
  { title: "Для діалогу: якщо захочеш розгорнути тему", start: 21, items: [
    ["I perform better when pressure has a clear deadline and a clear next step.", "Я працюю краще, коли тиск має чіткий дедлайн і чіткий наступний крок.", "Описати умови"],
    ["A deadline can mobilize me, but uncertainty can make me avoid the task.", "Дедлайн може мене мобілізувати, але невизначеність може змусити мене уникати задачі.", "Порівняти чинники"],
    ["What I need is not more motivation but a smaller entry point.", "Мені потрібна не більша мотивація, а менша точка входу.", "Сказати прямо"],
    ["I would rather make a rough start than wait for a perfect emotional state.", "Я краще зроблю чорновий старт, ніж чекатиму ідеального емоційного стану.", "Вибрати дію"],
    ["The pressure becomes useful when it points to a decision I can make today.", "Тиск стає корисним, коли вказує на рішення, яке я можу прийняти сьогодні.", "Пов'язати з днем"],
    ["If I cannot choose the outcome, I can still choose the next response.", "Якщо я не можу обрати результат, я все одно можу обрати наступну реакцію.", "Повернути контроль"],
    ["I want to build a reset that works on an ordinary difficult day.", "Я хочу створити перезавантаження, яке працює у звичайний складний день.", "Зробити практичним"],
    ["Instead of asking whether I feel ready, I can ask what is safe to start.", "Замість того щоб питати, чи я готовий, я можу спитати, з чого безпечно почати.", "Замінити питання"],
    ["The difference between pressure and panic is partly the amount of choice I can still feel.", "Різниця між тиском і панікою частково в тому, скільки вибору я ще відчуваю.", "Порівняти стани"],
    ["A useful reset should return me to action, not become another project.", "Корисне перезавантаження має повернути мене до дії, а не стати ще одним проєктом.", "Не втекти в підготовку"],
  ] },
];

writingPool.splice(0, writingPool.length, ...day14WritingPool);
phraseGroups.splice(0, phraseGroups.length, ...day14PhraseGroups);

const repairBank = [
  {
    id: "article-singular",
    label: "Артикль перед одним предметом",
    wrong: "I have idea / I built project",
    answer: "I have an idea. / I built a project.",
    ua: "У мене є ідея. / Я створив проєкт.",
    use: "коли говориш про один новий предмет або проєкт",
    source: "18-28 квітня",
  },
  {
    id: "try-to-verb",
    label: "Дієслово після try / want / need",
    wrong: "I try program it",
    answer: "I try to program it.",
    ua: "Я намагаюся це запрограмувати.",
    use: "коли пояснюєш, що намагаєшся зробити",
    source: "18 квітня",
  },
  {
    id: "it-helps",
    label: "It + дієслово із -s",
    wrong: "The bot help me / Cursor use it",
    answer: "The bot helps me. / Cursor uses it.",
    ua: "Бот допомагає мені. / Cursor використовує це.",
    use: "коли підмет — it, the bot, the project або Cursor",
    source: "18-22 квітня",
  },
  {
    id: "if-present",
    label: "Умова без will після if",
    wrong: "If I will miss a day, I can...",
    answer: "If I miss a day, I can resume.",
    ua: "Якщо я пропущу день, я можу продовжити.",
    use: "коли описуєш майбутню умову і її наслідок",
    source: "22-23 квітня",
  },
  {
    id: "it-takes",
    label: "Час займає takes",
    wrong: "It spends less than ten minutes.",
    answer: "It takes less than ten minutes.",
    ua: "Це займає менше десяти хвилин.",
    use: "коли кажеш, скільки часу потребує дія або процес",
    source: "2 травня",
  },
  {
    id: "regret-about",
    label: "Природна конструкція regret",
    wrong: "I feel regret of my financial status.",
    answer: "I regret my financial situation. / I feel bad about my financial situation.",
    ua: "Я шкодую про своє фінансове становище. / Мені погано через своє фінансове становище.",
    use: "коли пояснюєш неприємне відчуття або минуле рішення",
    source: "18 квітня",
  },
  {
    id: "meet-requirements",
    label: "Meet, а не rely, коли йдеться про критерії",
    wrong: "I do not rely on the requirements.",
    answer: "I do not meet the requirements.",
    ua: "Я не відповідаю вимогам.",
    use: "коли пояснюєш, що поки не відповідаєш критеріям",
    source: "22 квітня",
  },
  {
    id: "quality-of-life",
    label: "Природна фраза про якість життя",
    wrong: "I want to increase the level of my life.",
    answer: "I want to improve my quality of life.",
    ua: "Я хочу покращити якість свого життя.",
    use: "коли пояснюєш, навіщо тобі AI, робота або особистий проєкт",
    source: "2 травня",
  },
];

let currentStep = 0;
let writingCursor = 0;
let drillCursor = 0;
let phraseItems = [];
let drilledAnswers = new Set();
let missionPhraseUses = new Map();
let missionCardMatches = new Map();

const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const wordCoverage = (value, expected) => {
  const actual = new Set(normalize(value).split(" ").filter(Boolean));
  const words = normalize(expected).split(" ").filter((word) => word.length > 2);
  if (!words.length) return 0;
  return words.filter((word) => actual.has(word)).length / words.length;
};

const includesRequired = (value, item) => {
  const actualWords = normalize(value).split(" ").filter(Boolean);
  const groups = item.requiredGroups || item.required.map((part) => [part]);
  return groups.every((group) => group.some((part) => matchesExpectedWord(actualWords, part)));
};

const editDistance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;

    for (let column = 1; column <= right.length; column += 1) {
      const saved = previous[column];
      const cost = left[row - 1] === right[column - 1] ? 0 : 1;
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + cost,
      );
      diagonal = saved;
    }
  }

  return previous[right.length];
};

const baseFormContextWords = new Set([
  "to", "can", "could", "may", "might", "must", "will", "would", "shall", "should",
  "do", "does", "did", "dont", "doesnt", "didnt",
]);

const semanticVariants = {
  includes: ["include", "contains", "contain", "has", "have", "names", "name"],
  action: ["step", "task"],
  time: ["duration", "minutes", "minute"],
  proof: ["evidence", "record", "recording"],
  promise: ["commitment"],
  supports: ["support", "helps", "help"],
};

const isValidBaseForm = (words, index, expected) => {
  if (!expected.endsWith("s") || expected.length < 5) return false;
  const base = expected.slice(0, -1);
  if (words[index] !== base) return false;
  const previous = words[index - 1];
  if (baseFormContextWords.has(previous)) return true;
  return ["i", "you", "we", "they"].includes(previous);
};

const matchesExpectedWord = (words, expected) => {
  const normalizedExpected = normalize(expected);
  const variants = [normalizedExpected, ...(semanticVariants[normalizedExpected] || [])];
  return words.some((word, index) => variants.some((variant) =>
    word === variant || isValidBaseForm(words, index, variant),
  ));
};

const findWordTypo = (value, item) => {
  const actualWords = normalize(value).split(" ").filter(Boolean);
  const groups = item.requiredGroups || item.required.map((part) => [part]);

  for (const group of groups) {
    if (group.some((part) => matchesExpectedWord(actualWords, part))) continue;

    for (const expectedWord of group) {
      const expected = normalize(expectedWord);
      if (matchesExpectedWord(actualWords, expected) || expected.length < 4) continue;

      const closeWord = actualWords.find(
        (actual, index) => !isValidBaseForm(actualWords, index, expected)
          && Math.abs(actual.length - expected.length) <= 1
          && editDistance(actual, expected) <= 1,
      );

      if (closeWord) {
        let explanation = `У слові \`${closeWord}\` є маленька помилка. Потрібно: \`${expected}\`.`;
        if (expected.endsWith("ed")) explanation = `Тут потрібна форма із закінченням \`-ed\`: вона показує завершену дію або минулий час.`;
        else if (expected.endsWith("ing")) explanation = `Тут потрібна форма із закінченням \`-ing\`: вона використовується після відповідної форми \`be\` або в цій конструкції.`;
        else if (expected.endsWith("s")) explanation = `Тут потрібна форма множини або форма третьої особи із закінченням \`-s\`.`;
        return `Майже правильно: ти написав “${closeWord}”, а потрібно “${expected}”. ${explanation}`;
      }
    }
  }

  return "";
};

const findGrammarIssue = (value) => {
  const words = normalize(value).split(" ").filter(Boolean);
  const originalWords = value.trim().split(/\s+/).filter(Boolean);

  const repeated = words.find((word, index) => word === words[index - 1]);
  if (repeated) return `Слово “${repeated}” повторюється. Прибери один повтор.`;

  const toIndex = words.indexOf("to");
  if (toIndex >= 0 && words[toIndex + 1]?.endsWith("ing")) {
    return `Після “to” потрібна базова форма дієслова: “to ${words[toIndex + 1].replace(/ing$/, "") || "speak"}”.`;
  }

  const numberWords = new Set(["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]);
  const numberIndex = words.findIndex((word) => numberWords.has(word));
  if (numberIndex >= 0) {
    const adjectiveSuffixes = ["ed", "ing", "ful", "ive", "al", "ous", "able", "ible", "ic", "y"];
    let nounIndex = numberIndex + 1;
    while (words[nounIndex] && adjectiveSuffixes.some((suffix) => words[nounIndex].endsWith(suffix))) {
      nounIndex += 1;
    }
    const noun = words[nounIndex];
    const nextWord = words[nounIndex + 1];
    const functionWords = new Set(["a", "an", "the", "and", "or", "but", "for", "of", "on", "in", "to", "with", "without"]);
    const isCompoundModifier = nextWord && !functionWords.has(nextWord);
    if (noun && !noun.endsWith("s") && !isCompoundModifier && !["information", "advice", "work", "evidence", "English".toLowerCase()].includes(noun)) {
      return `Після “${words[numberIndex]}” зазвичай потрібна множина: “${noun}s”. Перевір, чи це злічуваний іменник.`;
    }
  }

  const didIndex = words.indexOf("did");
  if (didIndex >= 0 && words[didIndex + 1]?.match(/(ed|s)$/)) {
    return `Після “did” потрібна базова форма дієслова: “did ${words[didIndex + 1].replace(/(ed|s)$/, "") || "go"}”.`;
  }

  const auxiliaryIndex = words.findIndex((word) => ["am", "is", "are"].includes(word));
  if (auxiliaryIndex >= 0 && words[auxiliaryIndex + 1] && !words[auxiliaryIndex + 1].endsWith("ing")) {
    const next = words[auxiliaryIndex + 1];
    const looksLikeVerb = new Set(["speak", "work", "start", "write", "learn", "build", "keep", "feel", "try", "practice", "practise", "record", "promise", "choose", "trust"]);
    if (looksLikeVerb.has(next)) {
      return `Після “${words[auxiliaryIndex]}” тут потрібна форма “${next}ing” або інша конструкція. Перевір: “${words[auxiliaryIndex]} ${next}ing”.`;
    }
  }

  if (originalWords.length >= 3 && !/^[A-Za-z]/.test(originalWords[0])) {
    return "Почни речення з англійського слова з великої літери.";
  }

  return "";
};

const hasSubject = (value) => {
  const firstClause = normalize(value).split(" ").filter(Boolean).slice(0, 5);
  return firstClause.some((word) => /^(i|you|we|they|he|she|it|this|that|the|a|an|one|my|your|our|their|keeping|taking|when|if|today|tomorrow)$/.test(word));
};

const issueFeedback = (draft, issue) => `Твоя версія: “${draft}”\nЩо змінити: ${issue}\nСпробуй ще раз.`;

const meaningfulWords = (value) =>
  normalize(value)
    .split(" ")
    .filter((word) => word.length > 2)
    .filter((word) => !["the", "and", "for", "with", "that", "this", "from"].includes(word));

const missingWords = (value, expected) => {
  const actual = new Set(meaningfulWords(value));
  return [...new Set(meaningfulWords(expected).filter((word) => !actual.has(word)))].slice(0, 3);
};

const validateSentence = (value, item) => {
  const text = value.trim();
  const words = normalize(text).split(" ").filter(Boolean);
  const grammarIssue = findGrammarIssue(text);
  const wordTypo = findWordTypo(text, item);

  if (!text) return { ok: false, message: "Напиши англійську версію." };
  if (item.examples.some((example) => normalize(example) === normalize(text))) {
    return { ok: true, message: "Готово. Це одна з хороших версій. Скажи її вголос." };
  }
  if (grammarIssue) return { ok: false, message: issueFeedback(text, grammarIssue) };
  if (wordTypo) return { ok: false, message: issueFeedback(text, wordTypo) };
  if (words.length < 6) return { ok: false, message: issueFeedback(text, "Речення поки надто коротке. Додай повну думку з підметом і дієсловом.") };
  if (!hasSubject(text)) return { ok: false, message: issueFeedback(text, "Почни з підмета або чіткої умови: I / this / the promise / when... .") };
  if (!includesRequired(text, item)) {
    const groups = item.requiredGroups || item.required.map((part) => [part]);
    const missing = groups
      .filter((group) => !group.some((part) => matchesExpectedWord(words, part)))
      .map((group) => group.join(" / "));
    return { ok: false, message: issueFeedback(text, `Бракує змістової частини: ${missing.join(", ")}. Орієнтир конструкції: ${item.target}.`) };
  }

  return { ok: true, message: "Готово. Скажи цю версію вголос." };
};

const getSelectedPhrases = () => phraseItems.filter((item) => item.checkbox.checked);

const getPracticePhrases = () => {
  const selected = getSelectedPhrases();
  return selected.length ? selected : phraseItems.slice(0, 10);
};

const renderMissionPhraseBank = () => {
  if (!missionPhraseBank) return;
  const phrases = getPracticePhrases();
  missionPhraseBank.innerHTML = phrases.length
    ? phrases.map((item) => `<span class="mission-phrase"><strong>${item.answer}</strong><small>${item.ua}</small></span>`).join("")
    : `<span class="empty-state">Спочатку вибери фрази у попередньому кроці.</span>`;
};

const updateMissionStatus = () => {
  if (!missionStatus) return;
  const uses = [...missionPhraseUses.values()].reduce((total, count) => total + count, 0);
  const distinct = missionPhraseUses.size;
  missionStatus.textContent = uses >= 6
    ? `Готово: ${uses} використань, ${distinct} різних фраз активовано.`
    : `Прогрес: ${uses} / 6 використань. Різних фраз: ${distinct}.`;
  missionStatus.classList.toggle("complete", uses >= 6);
};

const updateMirrors = () => {
  const drafts = [...document.querySelectorAll(".writing-input")]
    .map((input) => input.value.trim())
    .filter(Boolean);

  mirroredDrafts.innerHTML = drafts.length
    ? drafts.slice(-8).map((text) => `<p>${text}</p>`).join("")
    : `<p class="empty-state">Заповнені речення з'являться тут автоматично.</p>`;

  const selected = getSelectedPhrases();
  selectedCount.textContent = `${selected.length} вибрано`;
  const phraseHtml = selected.length
    ? selected.map((item) => `<p><span>${item.answer}</span><small>${item.ua}</small></p>`).join("")
    : `<p class="empty-state">Вибери 5-8 фраз для сьогоднішньої відповіді.</p>`;
  selectedPhrasesBox.innerHTML = phraseHtml;
  mirroredPhrases.innerHTML = phraseHtml;
};

const takeWritingItems = (cursor, amount) =>
  writingPool.slice(cursor, Math.min(cursor + amount, writingPool.length));

const updateWritingAvailability = () => {
  const remaining = Math.max(0, writingPool.length - writingCursor);
  if (writingStatus) {
    writingStatus.textContent = remaining
      ? `Ще доступно: ${remaining} речення.`
      : `Сьогодні все — усі ${writingPool.length} доступні речення відкриті.`;
    writingStatus.classList.toggle("complete", remaining === 0);
  }
  document.querySelectorAll("[data-more-writing]").forEach((button) => {
    button.disabled = remaining === 0;
  });
};

const appendWritingRows = (amount) => {
  const items = takeWritingItems(writingCursor, amount);
  items.forEach((item) => {
    const row = document.createElement("article");
    row.className = "writing-row";
    row.innerHTML = `
      <div class="row-copy">
        <strong>${item.ua}</strong>
        <details class="writing-hint">
          <summary>Показати підказку</summary>
          <div class="hint-content">
            <small>Конструкція: ${item.target}</small>
            <small class="word-bank-line">Опорні слова: ${item.wordBank}</small>
          </div>
        </details>
      </div>
      <input class="writing-input" type="text" autocomplete="off" aria-label="${item.ua}">
      <button type="button" class="check-writing">Перевірити</button>
      <details>
        <summary>Можливі хороші версії</summary>
        <div class="example-versions">
          ${item.examples.map((example, index) => `<p><span>${index === 0 ? "Прямо" : "Інакше"}</span>${example}</p>`).join("")}
        </div>
      </details>
      <p class="feedback writing-feedback" aria-live="polite"></p>
    `;
    const input = row.querySelector(".writing-input");
    const feedback = row.querySelector(".writing-feedback");
    const examples = row.querySelector("details");
    const runCheck = () => {
      const result = validateSentence(input.value, item);
      feedback.textContent = result.message;
      feedback.classList.toggle("ok", result.ok);
      feedback.classList.toggle("almost", !result.ok);
      examples.hidden = result.ok;
      updateMirrors();
    };
    input.addEventListener("input", () => {
      updateMirrors();
      feedback.textContent = "";
      feedback.classList.remove("ok", "almost");
      examples.hidden = false;
    });
    row.querySelector(".check-writing").addEventListener("click", runCheck);
    writingRows.appendChild(row);
    writingCursor += 1;
  });
  updateWritingAvailability();
};

const renderPhrases = () => {
  phraseList.innerHTML = "";
  phraseItems = [];
  phraseGroups.forEach((group) => {
    const article = document.createElement("article");
    article.className = group.start === 1 ? "tier must" : "tier";
    article.innerHTML = `<h3>${group.title}</h3><ol start="${group.start}"></ol>`;
    const list = article.querySelector("ol");
    group.items.forEach(([answer, ua, role], index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label>
          <input type="checkbox" ${group.start === 1 && index < 8 ? "checked" : ""}>
          <strong>${answer}</strong>
          <small>${ua}</small>
        </label>
      `;
      const checkbox = li.querySelector("input");
      const phraseItem = { answer, ua, use: role, checkbox };
      phraseItems.push(phraseItem);
      checkbox.addEventListener("change", () => {
        updateMirrors();
        renderMissionPhraseBank();
        renderDrills(0, true);
      });
      list.appendChild(li);
    });
    phraseList.appendChild(article);
  });
  updateMirrors();
  renderMissionPhraseBank();
};

const validateDrill = (value, item) => {
  const text = value.trim();
  const grammarIssue = findGrammarIssue(text);
  const expected = item.answer;
  const coverage = wordCoverage(text, expected);
  if (!text) return { ok: false, message: "Напиши англійську фразу." };
  if (grammarIssue) return { ok: false, message: issueFeedback(text, grammarIssue) };
  if (normalize(text) === normalize(expected)) return { ok: true, message: "Точно. Скажи фразу вголос двічі." };
  if (coverage >= 0.75) return { ok: true, message: "Валідно для speaking. Можеш додати пропущені слова з відповіді." };
  const missing = missingWords(text, expected);
  if (missing.length) {
    return { ok: false, message: issueFeedback(text, `У версії бракує змістової частини: “${missing.join(", ")}”. Додай її у правильне місце, не копіюючи всю відповідь.`) };
  }
  return { ok: false, message: issueFeedback(text, "Зміст уже близький. Перебудуй порядок слів навколо підмета, дієслова і головної дії.") };
};

const phraseGlossary = {
  alert: "бадьорий / уважний",
  assume: "припускати",
  abandon: "відмовлятися від",
  action: "дія",
  based: "заснований на",
  begin: "починати",
  break: "перерва",
  condition: "умова / стан",
  concentrate: "зосереджуватися",
  compare: "порівнювати",
  evidence: "доказ / підтвердження",
  focus: "зосереджуватися",
  forcing: "змушування / змушуючи",
  guesses: "здогадки",
  lever: "важіль, чинник впливу",
  maintain: "підтримувати",
  movement: "рух",
  ordinary: "звичайний",
  outcome: "результат",
  pattern: "закономірність",
  poor: "поганий",
  proof: "доказ",
  realistic: "реалістичний",
  reliably: "надійно / стабільно",
  repeat: "повторювати",
  reset: "перезавантаження / коротке відновлення",
  routine: "рутина / звичний порядок дій",
  signal: "сигнал",
  sleep: "сон",
  standard: "стандарт / вимога до себе",
  test: "перевіряти / тест",
  variable: "змінна",
  pressure: "тиск / напруження",
  freeze: "завмирати / блокуватися",
  focus: "зосереджуватися",
  manageable: "такий, з яким можна впоратися",
  threatening: "загрозливий",
  respond: "відповідати / реагувати обдумано",
  response: "реакція / відповідь",
  rather: "радше / замість цього",
  predict: "передбачати",
  breath: "видих / подих",
  panic: "паніка",
  direction: "напрям",
  choice: "вибір",
  calm: "спокійний / спокій",
  stress: "стрес",
};

const phraseStopWords = new Set([
  "a", "an", "the", "and", "or", "but", "as", "at", "by", "for", "from", "if", "in", "into",
  "me", "my", "of", "on", "one", "so", "than", "that", "to", "up", "when", "with", "without",
  "will", "would", "can", "could", "may", "might", "should", "do", "does", "did", "not", "i", "it",
  "is", "are", "was", "were", "be", "been", "being", "more", "most", "enough", "very", "this", "what",
]);

const phraseWordHelp = (answer) => {
  const words = [...new Set(normalize(answer).split(" "))]
    .filter((word) => word.length > 3 && !phraseStopWords.has(word) && phraseGlossary[word])
    .slice(0, 4);
  return words.length
    ? words.map((word) => `<span><strong>${word}</strong> — ${phraseGlossary[word]}</span>`).join("")
    : "Складні слова розкриваються через переклад фрази нижче.";
};

const phraseGrammarHelp = (answer) => {
  const text = normalize(answer);
  if (text.includes("whereas") || text.includes("while")) {
    return "<strong>Whereas</strong> і <strong>while</strong> з'єднують два контрастні стани в одному реченні. Після них потрібні підмет і дієслово: <em>whereas too much pressure freezes me</em>.";
  }
  if (text.includes("rather than")) {
    return "Після <strong>rather than</strong>, коли порівнюємо дії, природно ставити форму <strong>-ing</strong>: <em>rather than fighting</em>. Після <strong>can</strong> — базове дієслово: <em>can name</em>.";
  }
  if (text.includes("not because") || text.includes("but because")) {
    return "Конструкція <strong>not because..., but because...</strong> виправляє хибну причину й дає точнішу. Після <em>because</em> став речення з підметом і дієсловом.";
  }
  if (text.includes("while i am")) {
    return "Після <strong>while</strong> можна показати дію, яка триває в цей момент: <em>while I am trying...</em>. Друга частина показує, що через це не відбувається.";
  }
  if (text.includes("if pressure")) {
    return "У плані <strong>If + теперішній час, I will + базова дія</strong>: <em>If pressure increases, I will reduce...</em>. Не став <em>will</em> одразу після <em>if</em>.";
  }
  if (text.includes("may be better than")) {
    return "Після <strong>may</strong> ставимо базову форму: <em>may be</em>. Після <strong>than</strong>, коли порівнюємо дії, природно використовувати форму на <strong>-ing</strong>: <em>than forcing</em>.";
  }
  if (text.includes("helps me")) {
    return "У конструкції <strong>helps me + дія</strong> після <em>me</em> йде базова форма: <em>helps me feel</em>, не <em>helps me feels</em>. Закінчення <strong>-s</strong> уже є в <em>helps</em>.";
  }
  if (text.includes("want to")) {
    return "Після <strong>want</strong> потрібна конструкція <strong>to + базова форма</strong>: <em>want to test</em>, <em>want to find</em>.";
  }
  if (text.includes("can ")) {
    return "Після модального дієслова <strong>can</strong> ставимо базову форму без <em>to</em> і без <strong>-s</strong>: <em>can repeat</em>, <em>can compare</em>.";
  }
  if (text.includes("will ")) {
    return "Після <strong>will</strong> ставимо базову форму дієслова: <em>will check</em>, <em>will compare</em>, не <em>will checks</em>.";
  }
  if (text.includes("after ")) {
    return "Після <strong>after</strong>, якщо далі йде дія без окремого підмета, використовуй форму <strong>-ing</strong>: <em>after moving</em>.";
  }
  if (text.includes("before ")) {
    return "<strong>Before</strong> ставимо перед часом або дією: <em>before work</em>, <em>before I start</em>. Після <em>before I</em> потрібні підмет і дієслово.";
  }
  if (text.includes("instead of") || text.includes("without")) {
    return "Після <strong>instead of</strong> або <strong>without</strong>, коли називаємо дію, природно використовувати форму <strong>-ing</strong>: <em>instead of guessing</em>, <em>without abandoning</em>.";
  }
  if (text.includes("does not") || text.includes("one test")) {
    return "Підмет <strong>one test</strong> — однина, тому в теперішньому часі: <em>does not prove</em>, але <em>it gives</em>. Після <em>does not</em> дієслово повертається до базової форми.";
  }
  if (text.includes("needs to be")) {
    return "<strong>Routine</strong> — однина, тому <em>needs</em>. Після <strong>needs to</strong> ставимо базову форму: <em>needs to be</em>.";
  }
  if (text.includes("the one i can")) {
    return "У частині <strong>the one I can...</strong> після <em>can</em> потрібна базова форма: <em>can repeat</em>, не <em>can repeats</em>.";
  }
  return "Спочатку назви підмет, потім дію, а далі уточнення. Перевір, чи після модального дієслова або <em>to</em> стоїть базова форма.";
};

const phraseStructureHelp = (answer) => {
  const text = normalize(answer);
  if (text.includes("may be better than")) return "A + may be + кращий варіант + than + дія-ing";
  if (text.includes("helps me")) return "Фактор + helps me + дія";
  if (text.includes("want to")) return "I want to + дія + що саме";
  if (text.includes("can ")) return "Підмет + can + дія + деталь";
  if (text.includes("will ")) return "Підмет + will + дія + результат";
  if (text.includes("after ")) return "After + дія-ing, + підмет + will + дія";
  if (text.includes("before ")) return "Before + час/підмет + дія, + основна дія";
  if (text.includes("instead of") || text.includes("without")) return "дія + instead of/without + дія-ing";
  if (text.includes("does not") || text.includes("one test")) return "Один тест + does not + дія, but + it + дія-s";
  if (text.includes("needs to be")) return "Один предмет + needs to be + характеристика";
  return "Підмет + дієслово + головна думка + уточнення";
};

const renderPhraseSupport = (item) => `
  <details class="drill-help">
    <summary>Підказка до цієї фрази</summary>
    <div class="drill-help-content">
      <p><strong>Що ця фраза робить у відповіді:</strong> ${item.use.toLowerCase()}.</p>
      <p><strong>Зміст:</strong> ${item.ua}</p>
      <p><strong>Складні слова:</strong></p>
      <div class="word-help">${phraseWordHelp(item.answer)}</div>
      <p><strong>Граматика:</strong> ${phraseGrammarHelp(item.answer)}</p>
      <p><strong>Каркас:</strong> <code>${phraseStructureHelp(item.answer)}</code></p>
    </div>
  </details>
`;

const activationCue = (item) => `Напиши нове речення про себе: ${item.use.toLowerCase()}. Зміни деталі, але збережи корисний мовний каркас.`;

const validateActivation = (value, item) => {
  const text = value.trim();
  const grammarIssue = findGrammarIssue(text);
  const coverage = wordCoverage(text, item.answer);
  if (!text) return { ok: false, message: "Напиши нове речення про власну ситуацію." };
  if (grammarIssue) return { ok: false, message: issueFeedback(text, grammarIssue) };
  if (normalize(text).split(" ").filter(Boolean).length < 7) {
    return { ok: false, message: issueFeedback(text, "Додай повну думку: хто або що, дія, і конкретна деталь ситуації.") };
  }
  if (coverage < 0.35) {
    const anchor = meaningfulWords(item.answer).slice(0, 3).join(", ");
    return { ok: false, message: issueFeedback(text, `У новому реченні має залишитися ядро цієї конструкції. Спробуй зберегти частину на кшталт “${anchor}” і зміни лише власні деталі.`) };
  }
  return { ok: true, message: "Добре. Це вже друге, нове використання фрази. Скажи речення вголос двічі." };
};

const renderDrills = (amount = 5, reset = false) => {
  const source = getPracticePhrases();
  if (reset) {
    drillGrid.innerHTML = "";
    drillCursor = 0;
    drilledAnswers = new Set();
    amount = Math.min(5, source.length || 5);
  }
  const unseen = source.filter((item) => !drilledAnswers.has(item.answer));
  const items = unseen.slice(0, amount);
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "drill-card";
    card.innerHTML = `
      <div class="drill-stage"><span>4.1</span><strong>Згадай фразу</strong></div>
      <p>${item.ua}</p>
      <input class="drill-input" type="text" autocomplete="off" aria-label="${item.ua}">
      <div class="drill-actions">
        <button type="button" class="check-drill">Перевірити</button>
        <button type="button" class="reveal-answer">Показати відповідь</button>
      </div>
      ${renderPhraseSupport(item)}
      <p class="answer-key" hidden>${item.answer}</p>
      <p class="feedback drill-feedback" aria-live="polite"></p>
      <div class="phrase-activation">
        <div class="drill-stage"><span>4.2</span><strong>Перенеси в нову ситуацію</strong></div>
        <p class="activation-cue">${activationCue(item)}</p>
        <input class="activation-input" type="text" autocomplete="off" aria-label="Нове речення для фрази">
        <button type="button" class="check-activation">Перевірити нове речення</button>
        <p class="feedback activation-feedback" aria-live="polite"></p>
      </div>
    `;
    const input = card.querySelector(".drill-input");
    const feedback = card.querySelector(".drill-feedback");
    const activationInput = card.querySelector(".activation-input");
    const activationFeedback = card.querySelector(".activation-feedback");
    const answer = card.querySelector(".answer-key");
    const runCheck = () => {
      const result = validateDrill(input.value, item);
      feedback.textContent = result.message;
      feedback.classList.toggle("ok", result.ok);
      feedback.classList.toggle("almost", !result.ok);
    };
    card.querySelector(".check-drill").addEventListener("click", runCheck);
    input.addEventListener("input", () => {
      feedback.textContent = "";
      feedback.classList.remove("ok", "almost");
    });
    card.querySelector(".reveal-answer").addEventListener("click", () => {
      answer.hidden = !answer.hidden;
    });
    card.querySelector(".check-activation").addEventListener("click", () => {
      const result = validateActivation(activationInput.value, item);
      activationFeedback.textContent = result.message;
      activationFeedback.classList.toggle("ok", result.ok);
      activationFeedback.classList.toggle("almost", !result.ok);
    });
    activationInput.addEventListener("input", () => {
      activationFeedback.textContent = "";
      activationFeedback.classList.remove("ok", "almost");
    });
    drillGrid.appendChild(card);
    drilledAnswers.add(item.answer);
    drillCursor += 1;
  });
  const remaining = source.filter((item) => !drilledAnswers.has(item.answer)).length;
  if (drillStatus) {
    drillStatus.textContent = remaining
      ? `Ще доступно: ${remaining} фраз без повторення.`
      : `Сьогодні все — кожна вибрана фраза вже пройшла обидві частини.`;
    drillStatus.classList.toggle("complete", remaining === 0);
  }
  document.querySelectorAll("[data-more-drills]").forEach((button) => {
    button.disabled = remaining === 0;
  });
};

const updateStoryPreview = () => {
  storyGaps.forEach((gap) => {
    const slot = gap.dataset.storySlot;
    const card = document.querySelectorAll(".story-slot")[Number(slot) - 1];
    const value = card?.querySelector(".qa-input")?.value.trim();
    gap.textContent = value ? `${slot}. ${value}` : slot;
    gap.classList.toggle("is-filled", Boolean(value));
  });
};

const qaGroupMatches = (text, group) => group.split("|").some((alternative) => {
  const normalizedAlternative = normalize(alternative);
  return normalizedAlternative.includes(" ")
    ? text.includes(normalizedAlternative)
    : new Set(text.split(" ").filter(Boolean)).has(normalizedAlternative);
});

const checkQa = (card) => {
  const input = card.querySelector(".qa-input");
  const feedback = card.querySelector(".qa-feedback");
  const text = normalize(input.value);
  const grammarIssue = findGrammarIssue(input.value);
  const groups = (card.dataset.qaGroups || "").split(";").filter(Boolean);
  const labels = (card.dataset.qaLabels || "").split(";").filter(Boolean);
  const missingIndex = groups.findIndex((group) => !qaGroupMatches(text, group));
  let message = "";
  let ok = false;

  if (!input.value.trim()) message = "Напиши одне англійське речення з підказкою до цього слоту.";
  else if (grammarIssue) message = issueFeedback(input.value.trim(), grammarIssue);
  else if (text.split(" ").filter(Boolean).length < 6) message = issueFeedback(input.value.trim(), "Речення поки надто коротке. Додай повну думку з підметом і дієсловом.");
  else if (missingIndex >= 0) {
    const label = labels[missingIndex] || "потрібну частину думки";
    const direction = card.dataset.qaPattern || "Повернися до цільової конструкції й додай цю частину своїми словами.";
    message = issueFeedback(input.value.trim(), `У цьому реченні ще бракує: ${label}. Орієнтир, не готова відповідь: ${direction}`);
  } else {
    ok = true;
    message = "Готово. Це хороша версія для цієї історії. Тепер скажи її вголос і переходь до наступного слоту.";
  }

  feedback.textContent = message;
  feedback.className = `feedback qa-feedback ${ok ? "ok" : "almost"}`;
  updateStoryPreview();
};

const validateFullAnswer = () => {
  const text = fullAnswer.value.trim();
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const selected = getSelectedPhrases().map((item) => item.answer);
  const used = selected.filter((phrase) => wordCoverage(text, phrase) >= 0.45).length;
  let message = "";
  let ok = false;

  if (!text) message = "Напиши 5-7 речень зі своїх перевірених слотів перед Voice.";
  else if (sentences.length < 5) message = "Мало речень. Збери історію з моменту тиску, блокування, пояснення, першої дії та доказу.";
  else if (!/\b(pressure|stress|panic|freeze|focus|task|action|reset|deadline)\b/i.test(text)) message = "Не видно сьогоднішньої теми. Додай думку про pressure, stress, freeze, focus, task або reset.";
  else if (!/\b(whereas|while|rather|because|if|then|so|but|when|instead|not)\b/i.test(text)) message = "З'єднай думки через whereas, while, rather than, because, if, but або when.";
  else if (used < 3) message = "Додай хоча б 3 вибрані фрази зі свого набору.";
  else {
    ok = true;
    message = "Валідно для GPT Voice. Тепер скажи 60 секунд без читання моделі.";
  }

  fullAnswerFeedback.textContent = message;
  fullAnswerFeedback.classList.toggle("ok", ok);
  fullAnswerFeedback.classList.toggle("almost", !ok);
};

const checkMission = (card, index) => {
  const input = card.querySelector(".mission-input");
  const feedback = card.querySelector(".mission-feedback");
  const text = input.value.trim();
  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const grammarIssue = findGrammarIssue(text);
  const matches = getPracticePhrases().filter((item) => wordCoverage(text, item.answer) >= 0.35);
  const previous = missionCardMatches.get(index) || [];
  previous.forEach((item) => {
    const count = missionPhraseUses.get(item.answer) || 0;
    if (count <= 1) missionPhraseUses.delete(item.answer);
    else missionPhraseUses.set(item.answer, count - 1);
  });
  missionCardMatches.delete(index);

  let message = "";
  let ok = false;
  if (!text) message = "Напиши 2-3 англійські речення для цієї ситуації.";
  else if (grammarIssue) message = issueFeedback(text, grammarIssue);
  else if (sentences.length < 2) message = issueFeedback(text, "Додай ще одне речення: спочатку опиши ситуацію, потім поясни свою дію або результат.");
  else if (matches.length < 2) message = issueFeedback(text, `У відповіді поки видно ${matches.length} фрази з набору. Встав ще ${2 - matches.length} різні фрази й зміни деталі під цю ситуацію.`);
  else {
    ok = true;
    missionCardMatches.set(index, matches);
    matches.forEach((item) => missionPhraseUses.set(item.answer, (missionPhraseUses.get(item.answer) || 0) + 1));
    message = `Добре. У цій ситуації використано ${matches.length} різні фрази. Скажи відповідь уголос, а потім переходь до наступної ситуації.`;
  }
  feedback.textContent = message;
  feedback.className = `feedback mission-feedback ${ok ? "ok" : "almost"}`;
  updateMissionStatus();
};

const showStep = (index) => {
  currentStep = Math.max(0, Math.min(index, questSteps.length - 1));
  questSteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === currentStep));
  questTitle.textContent = questSteps[currentStep].dataset.taskTitle || "Задача";
  questCounter.textContent = `${currentStep + 1} / ${questSteps.length}`;
  questProgressFill.style.width = `${((currentStep + 1) / questSteps.length) * 100}%`;
  prevStepButton.disabled = currentStep === 0;
  nextStepButton.disabled = currentStep === questSteps.length - 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const repairStateKey = `${progressKey}-repairs`;

const getUsedRepairs = () => {
  if (typeof localStorage === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(repairStateKey) || "[]"));
  } catch {
    return new Set();
  }
};

const renderRepairBank = () => {
  if (!repairBankBox) return;
  const used = getUsedRepairs();
  repairBankBox.innerHTML = repairBank.map((item) => `
    <article class="repair-item ${used.has(item.id) ? "is-done" : ""}">
      <div class="repair-item-main">
        <span class="repair-label">${item.label}</span>
        <strong>${item.answer}</strong>
        <small>${item.ua}</small>
        <p>Для цього дня: ${item.use}.</p>
        <details>
          <summary>Яку помилку це ремонтує?</summary>
          <p><span class="bad">Було:</span> ${item.wrong}<br><span class="repair-source">Зафіксовано: ${item.source}</span></p>
        </details>
      </div>
      <label class="repair-check"><input type="checkbox" data-repair-id="${item.id}" ${used.has(item.id) ? "checked" : ""}> Вжив у Voice</label>
    </article>
  `).join("");

  const updateRepairProgress = () => {
    const selected = [...repairBankBox.querySelectorAll("[data-repair-id]:checked")].map((input) => input.dataset.repairId);
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(repairStateKey, JSON.stringify(selected));
      } catch {
        // Local file origins may reject storage; the exercise still works for this session.
      }
    }
    repairProgress.textContent = `${selected.length} / ${repairBank.length} активовано`;
    repairBankBox.querySelectorAll(".repair-item").forEach((item) => {
      const checkbox = item.querySelector("[data-repair-id]");
      item.classList.toggle("is-done", checkbox.checked);
    });
  };

  repairBankBox.querySelectorAll("[data-repair-id]").forEach((input) => input.addEventListener("change", updateRepairProgress));
  updateRepairProgress();
};

document.querySelectorAll("[data-more-writing]").forEach((button) => {
  button.addEventListener("click", () => appendWritingRows(Number(button.dataset.moreWriting)));
});

document.querySelectorAll("[data-more-drills]").forEach((button) => {
  button.addEventListener("click", () => renderDrills(Number(button.dataset.moreDrills)));
});

document.querySelectorAll(".check-qa").forEach((button) => {
  button.addEventListener("click", () => checkQa(button.closest(".qa-card")));
});

document.querySelectorAll(".check-mission").forEach((button, index) => {
  button.addEventListener("click", () => checkMission(button.closest(".mission-card"), index));
});

document.querySelector("#check-full-answer")?.addEventListener("click", validateFullAnswer);

prevStepButton?.addEventListener("click", () => showStep(currentStep - 1));
nextStepButton?.addEventListener("click", () => showStep(currentStep + 1));

toggleTranslationButton?.addEventListener("click", () => {
  translationCard.hidden = !translationCard.hidden;
  toggleTranslationButton.textContent = translationCard.hidden ? "Показати переклад" : "Сховати переклад";
});

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(promptBox.value);
    copyStatus.textContent = "Промпт скопійовано.";
  } catch {
    promptBox.select();
    document.execCommand("copy");
    copyStatus.textContent = "Промпт скопійовано.";
  }
});

appendWritingRows(10);
renderPhrases();
renderDrills(5, true);
updateMissionStatus();
renderRepairBank();
showStep(0);

if (typeof globalThis !== "undefined" && globalThis.__qa) {
  globalThis.__qa.takeWritingItems = takeWritingItems;
}
