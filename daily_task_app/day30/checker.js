/*
 * Conservative, offline support for the September pilot.
 * This is a small pattern checker, not an AI grammar/meaning assessment.
 * Unknown paraphrases are saved and never block the learner.
 * UI callers must invoke check only after an explicit user action.
 */
(function (root) {
  "use strict";

  const contractions = {
    "can't": "can not", "cannot": "can not", "won't": "will not",
    "don't": "do not", "doesn't": "does not", "didn't": "did not",
    "isn't": "is not", "aren't": "are not", "wasn't": "was not",
    "weren't": "were not", "haven't": "have not", "hasn't": "has not",
    "hadn't": "had not", "couldn't": "could not", "wouldn't": "would not",
    "shouldn't": "should not", "mustn't": "must not", "needn't": "need not",
    "i'm": "i am", "you're": "you are", "we're": "we are", "they're": "they are",
    "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have",
    "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
    "we'll": "we will", "they'll": "they will", "it'll": "it will"
  };

  // Function words, meaning-sensitive pairs and ordinary words that must not
  // become an alleged typo just because an example contains a nearby word.
  // An incomplete lexicon is another reason unknown sentences get review.
  const protectedWords = new Set((`
    a an the and or but if then than as so because although while until unless
    before after during since when whenever where wherever how what whatever
    why which who whom whose that this these those each every either neither
    all any some no not never none nothing nobody nowhere without only just
    now know knew new not nor can cant cannot could will would shall should
    must may might ought need needs needed want wants wanted wish wishes wished
    do does did done doing be am is are was were been being have has had having
    i you he she it we they me him her us them my your his its our their mine
    yours hers ours theirs myself yourself himself herself itself ourselves
    yourselves themselves to of in on at by for from with into onto out off up
    down over under above below through across between among about against
    more most less least much many few several both other another same different
    one two three four five six seven eight nine ten first last next past future
    yesterday today tomorrow soon late later early once twice again always often
    usually sometimes rarely still yet already almost also even ever here there
    away back well better best bad worse worst good nice fine right wrong true
    false real sure unsure ready tired tried hard easy busy free full empty
    hungry angry sad glad calm warm cold hot old young big small long short
    slow fast high low new safe save same some start starts started starting
    stop stops stopped stopping stay stays stayed staying star stars state states
    take takes took taken taking make makes made making get gets got getting
    give gives gave given giving go goes went gone going come comes came coming
    leave leaves left leaving live lives lived living love loves loved loving
    like likes liked liking lose loses lost losing loose choose chose chosen
    work works worked working word words walk walks walked walking talk talks
    talked talking tell tells told telling sell sells sold selling set sets sit
    sits sat sitting send sends sent sending spend spends spent spending
    read reads reading write writes wrote written writing ride rides rode
    ridden riding try tries trying cry cries cried crying tie ties tied tying
    lie lies lied lying light might night fight right sight tight
    help helps helped helping keep keeps kept keeping feel feels felt feeling
    need needs needed needing think thinks thought thinking plan plans planned
    planning play plays played playing pay pays paid paying say says said saying
    wait waits waited waiting wear wears wore worn war ward hard yard card care
    time times timer timed timing type types typed typing task tasks desk desks
    minute minutes hour hours day days week weeks month months year years
    focus focused focuses focusing first firm form from farm fear fair fare
    clear unclear clean mean means meant meaning kind mind find found fine
    phone phones home homes hope hopes hoped hoping cope copes coped coping
    look looks looked looking lock locks locked locking book books booked booking
    learn learns learned learnt learning earn earns earned earning
    use uses used using useful useless uselessly usefuly rest rests rested resting
    test tests tested testing text texts draft drafts write writer written
    record records recorded recording report reports reported reporting
    avoid avoids avoided avoiding delay delays delayed delaying begin begins began
    begun beginning finish finishes finished finishing complete completed completing
    speak speaks spoke spoken speaking promise promises promised promising
    proof prove proves proved proven evidence result results reason reasons
    relief relieve stress stressed stressful anxiety anxious action actions
    intention intentions emotion emotions emotional problem problems practice
    practise practiced practised purpose progress pressure mistake mistakes
    important unimportant possible impossible positive negative enough too
    buy buys bought buying bring brings brought bringing build builds built building
    move moves moved moving remove removes removed removing push pulls pull pushed
    open opens opened opening close closes closed closing allow allowed avoid
    happy unhappy sleep sleeps slept sleeping slip slips slipped slipping
    break breaks broke broken breaking brake brakes bread broad board bored
    accept accepts accepted accepting except expect expects expected expecting
    effect affect cause causes caused causing cost costs cast casts
    hire hires hired hiring fire fires fired firing file files filed filing
    English Ukrainian message messages answer answers question questions
  `).toLowerCase().trim().split(/\s+/));

  function tokens(value) {
    return String(value ?? "").normalize("NFKC").toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\b[a-z]+(?:'[a-z]+)?\b/g, word => contractions[word] || word)
      .match(/[\p{L}\p{N}]+(?:'[\p{L}]+)?/gu) || [];
  }

  function equal(a, b) {
    return a.length === b.length && a.every((part, index) => part === b[index]);
  }

  function oneEdit(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length === b.length) {
      const differences = [];
      for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) differences.push(i);
      if (differences.length === 1) return true;
      return differences.length === 2 && differences[1] === differences[0] + 1 &&
        a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]];
    }
    const short = a.length < b.length ? a : b;
    const long = a.length < b.length ? b : a;
    let i = 0;
    while (i < short.length && short[i] === long[i]) i += 1;
    return short.slice(i) === long.slice(i + 1);
  }

  function formRelated(a, b) {
    const forms = word => new Set([
      `${word}s`, `${word}es`, `${word}ed`, `${word}ing`,
      word.endsWith("e") ? `${word}d` : "",
      word.endsWith("e") ? `${word.slice(0, -1)}ing` : "",
      word.endsWith("y") ? `${word.slice(0, -1)}ies` : "",
      word.endsWith("y") ? `${word.slice(0, -1)}ied` : ""
    ]);
    return forms(a).has(b) || forms(b).has(a);
  }

  // Directional: a is the learner's token, b the prepared token.
  // Short words, real words and grammatical endings never get fuzzy matching.
  function near(a, b) {
    const left = String(a ?? "").toLowerCase();
    const right = String(b ?? "").toLowerCase();
    if (left === right) return true;
    if (!/^[a-z]{4,}$/.test(left) || !/^[a-z]{4,}$/.test(right)) return false;
    if (protectedWords.has(left) || formRelated(left, right)) return false;
    return oneEdit(left, right);
  }

  function supportedMatch(actual, expected, knownWords) {
    if (actual.length !== expected.length) return null;
    const changes = [];
    for (let i = 0; i < actual.length; i += 1) {
      if (actual[i] === expected[i]) continue;
      if (knownWords.has(actual[i]) || !near(actual[i], expected[i])) return null;
      changes.push({ from: actual[i], to: expected[i] });
    }
    return changes;
  }

  function revision(fragment, change, why, issue) {
    return {
      status: "revise", ok: false, issue,
      message: `Твоя версія: \`${fragment}\`\nЩо змінити: ${change}\nЧому: ${why}\nСпробуй ще раз.`
    };
  }

  const baseForms = Object.freeze({
    starts: "start", started: "start", starting: "start",
    stops: "stop", stopped: "stop", stopping: "stop",
    works: "work", worked: "work", working: "work",
    tries: "try", tried: "try", trying: "try",
    helps: "help", helped: "help", helping: "help",
    uses: "use", used: "use", using: "use",
    writes: "write", wrote: "write", written: "write", writing: "write",
    says: "say", said: "say", saying: "say",
    shows: "show", showed: "show", shown: "show", showing: "show",
    speaks: "speak", spoke: "speak", spoken: "speak", speaking: "speak",
    goes: "go", went: "go", gone: "go", going: "go",
    does: "do", did: "do", done: "do", doing: "do",
    makes: "make", made: "make", making: "make",
    takes: "take", took: "take", taken: "take", taking: "take",
    learns: "learn", learned: "learn", learnt: "learn", learning: "learn",
    plans: "plan", planned: "plan", planning: "plan",
    finishes: "finish", finished: "finish", finishing: "finish",
    avoids: "avoid", avoided: "avoid", avoiding: "avoid",
    delays: "delay", delayed: "delay", delaying: "delay",
    feels: "feel", felt: "feel", feeling: "feel",
    spends: "spend", spent: "spend", spending: "spend",
    needs: "need", needed: "need", needing: "need",
    wants: "want", wanted: "want", wanting: "want",
    tests: "test", tested: "test", testing: "test",
    records: "record", recorded: "record", recording: "record",
    clarifies: "clarify", clarified: "clarify", clarifying: "clarify",
    understands: "understand", understood: "understand", understanding: "understand",
    compares: "compare", compared: "compare", comparing: "compare",
    reduces: "reduce", reduced: "reduce", reducing: "reduce",
    simplifies: "simplify", simplified: "simplify", simplifying: "simplify",
    checks: "check", checked: "check", checking: "check",
    explains: "explain", explained: "explain", explaining: "explain",
    improves: "improve", improved: "improve", improving: "improve",
    changes: "change", changed: "change", changing: "change",
    answers: "answer", answered: "answer", answering: "answer",
    asks: "ask", asked: "ask", asking: "ask",
    describes: "describe", described: "describe", describing: "describe",
    prepares: "prepare", prepared: "prepare", preparing: "prepare",
    decides: "decide", decided: "decide", deciding: "decide",
    chooses: "choose", chose: "choose", chosen: "choose", choosing: "choose",
    finds: "find", found: "find", finding: "find",
    builds: "build", built: "build", building: "build",
    remembers: "remember", remembered: "remember", remembering: "remember",
    forgets: "forget", forgot: "forget", forgotten: "forget", forgetting: "forget",
    includes: "include", included: "include", including: "include",
    removes: "remove", removed: "remove", removing: "remove",
    completes: "complete", completed: "complete", completing: "complete",
    begins: "begin", began: "begin", begun: "begin", beginning: "begin",
    expects: "expect", expected: "expect", expecting: "expect",
    notices: "notice", noticed: "notice", noticing: "notice",
    switches: "switch", switched: "switch", switching: "switch",
    rests: "rest", rested: "rest", resting: "rest",
    waits: "wait", waited: "wait", waiting: "wait",
    practises: "practise", practised: "practise", practising: "practise",
    practices: "practice", practiced: "practice", practicing: "practice",
    proves: "prove", proved: "prove", proven: "prove", proving: "prove"
  });

  for (const [form, base] of Object.entries(baseForms)) {
    protectedWords.add(form);
    protectedWords.add(base);
  }

  function grammarIssue(parts) {
    const subjects = new Set(["i", "you", "he", "she", "it", "we", "they"]);
    const modals = new Set(["can", "could", "will", "would", "should", "must", "may", "might"]);
    const bareVerbs = new Set(Object.values(baseForms));
    const gerunds = Object.fromEntries(Object.entries(baseForms).filter(([form]) => form.endsWith('ing')).map(([form, base]) => [base, form]));
    // Only a clear verb + object pattern: noun phrases such as "instead of
    // work", "instead of a long post" and "instead of test results" stay valid.
    for (let i = 0; i < parts.length - 3; i += 1) {
      if (parts[i] !== 'instead' || parts[i + 1] !== 'of') continue;
      const verb = parts[i + 2], next = parts[i + 3];
      if (gerunds[verb] && ['my','your','his','her','our','their','the','a','an','all'].includes(next)) {
        return revision(parts.slice(i, i + 4).join(' '), `\`${verb}\` → \`${gerunds[verb]}\``,
          'Тут після «instead of» стоїть дія з об’єктом. Для цієї дії потрібна форма з -ing; іменник після «instead of» теж можливий.', 'gerund-after-preposition');
      }
    }
    for (let i = 1; i < parts.length - 1; i += 1) {
      // A noun subject can also precede a modal. Exclude determiners so a
      // noun "can" in "the can" does not become a modal by accident.
      if (!subjects.has(parts[i - 1]) && ['a','an','the','my','your','this','that'].includes(parts[i - 1])) continue;
      const modal = modals.has(parts[i]);
      const auxiliary = ["do", "does", "did"].includes(parts[i]) && parts[i + 1] === "not";
      if (!modal && !auxiliary) continue;
      let verbIndex = i + 1;
      if (parts[verbIndex] === "not") verbIndex += 1;
      const verb = parts[verbIndex];
      if (modal && verb === "to" && bareVerbs.has(parts[verbIndex + 1])) {
        return revision(parts.slice(i, verbIndex + 2).join(" "),
          `\`${parts[i]} to\` → \`${parts[i]}\` + дієслово`,
          `Після «${parts[i]}» дія йде без «to»: наприклад, «${parts[i]} + start». Це форма конструкції, а не описка.`, "modal-to");
      }
      // Punctuation-separated adjuncts are excluded by the caller. An -ing
      // form directly after a modal in the same clause needs a base verb.
      if (baseForms[verb]) {
        return revision(parts.slice(i, verbIndex + 1).join(" "),
          `\`${verb}\` → \`${baseForms[verb]}\``,
          modal ? `Після «${parts[i]}» потрібна початкова форма дієслова без закінчення.` :
            `Після «${parts[i]} not» потрібна початкова форма: час уже передає «${parts[i]}».`, "verb-after-auxiliary");
      }
    }
    return null;
  }

  function withoutNegation(parts) {
    const plain = [];
    const positions = [];
    for (let i = 0; i < parts.length; i += 1) {
      if (["do", "does", "did"].includes(parts[i]) && parts[i + 1] === "not") continue;
      if (parts[i] === "not") positions.push(plain.length);
      else plain.push(parts[i]);
    }
    return { plain, positions };
  }

  function contradiction(actual, expected) {
    const left = withoutNegation(actual);
    const right = withoutNegation(expected);
    if (equal(left.plain, right.plain) && !equal(left.positions, right.positions)) {
      const wantedNegative = right.positions.length > left.positions.length;
      const shifted = right.positions.length === left.positions.length;
      const actualNot = actual.indexOf("not");
      const expectedNot = expected.indexOf("not");
      const location = actualNot >= 0 ? actualNot : Math.max(0, expectedNot - 1);
      return revision(actual.slice(Math.max(0, location - 1), location + 3).join(" "),
        shifted ? "перенеси заперечення до тієї дії, яку заперечує українське речення" :
          wantedNegative ? "додай заперечення до цієї дії" : "прибери заперечення з цієї дії",
        "У цій майже однаковій версії заперечення змінює заданий сенс. Звір, що саме відбувається, а що — ні.", "negation");
    }
    if (actual.length !== expected.length) return null;
    const differences = actual.map((word, index) => word === expected[index] ? -1 : index).filter(index => index >= 0);
    if (differences.length === 1) {
      const index = differences[0];
      if ((actual[index] === "before" && expected[index] === "after") ||
          (actual[index] === "after" && expected[index] === "before")) {
        return revision(actual.slice(Math.max(0, index - 1), index + 3).join(" "),
          `\`${actual[index]}\` → \`${expected[index]}\``,
          "«Before» означає «до», а «after» — «після». Тут порядок подій змінився.", "event-order");
      }
    }
    return null;
  }

  function hasPhrase(actual, phrase) {
    const candidate = tokens(phrase);
    if (!candidate.length || candidate.length > actual.length) return false;
    for (let i = 0; i <= actual.length - candidate.length; i += 1) {
      if (candidate.every((word, offset) => actual[i + offset] === word || near(actual[i + offset], word))) return true;
    }
    return false;
  }

  function isConcreteTarget(value) {
    const target = typeof value === "string" ? value.trim() : "";
    if (!target || !/[a-z]/i.test(target)) return false;
    // Targets that describe a construction are instructions, not answers.
    // A literal target sentence is always a valid short answer even when an
    // authored example adds an optional clause or detail.
    return !/(?:\.\.\.|…|\+|\{\{|\}\}|\[[^\]]*\]|\b(?:object|noun|verb|clause|purpose|action|situation)\b)/i.test(target);
  }

  function matchesTargetPattern(actual, value) {
    const target = typeof value === "string" ? value.trim() : "";
    if (!/(?:\.\.\.|…)/.test(target) || /(?:\+|\{\{|\}\}|\[[^\]]*\])/.test(target)) return false;
    const startsWithGap = /^(?:\.\.\.|…)/.test(target);
    const endsWithGap = /(?:\.\.\.|…)$/.test(target);
    const rawSegments = target.split(/(?:\.\.\.|…)/);
    const segments = rawSegments.map(tokens);
    const gapCount = Math.max(0, segments.length - 1);
    const literalCount = segments.reduce((sum, segment) => sum + segment.length, 0);
    if (actual.length < literalCount + gapCount) return false;
    let cursor = 0;
    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      if (!segment.length) continue;
      const needsGap = index > 0 || startsWithGap;
      const minimum = cursor + (needsGap ? 1 : 0);
      let found = -1;
      for (let at = minimum; at <= actual.length - segment.length; at += 1) {
        if (segment.every((word, offset) => actual[at + offset] === word)) { found = at; break; }
      }
      if (found < 0 || (index === 0 && !startsWithGap && found !== 0)) return false;
      cursor = found + segment.length;
    }
    if (!endsWithGap) {
      const tail = segments.filter(segment => segment.length).at(-1) || [];
      if (!tail.length || cursor !== actual.length) return false;
    } else if (cursor >= actual.length) return false;
    return true;
  }

  function check(value, item = {}) {
    const sentence = String(value ?? "").trim();
    const actual = tokens(sentence);
    if (!actual.length) {
      return revision("поки порожньо", "напиши власну спробу англійською",
        "Спочатку потрібна твоя думка. Можна почати з короткого речення.", "empty");
    }
    const examples = (Array.isArray(item.examples) ? item.examples : []).filter(value => typeof value === "string" && tokens(value).length);
    const concreteTarget = isConcreteTarget(item.target) ? item.target.trim() : "";
    const alternatives = concreteTarget ? [concreteTarget, ...examples] : examples;
    const unique = new Set();
    const accepted = alternatives.filter(value => {
      const key = tokens(value).join(" ");
      if (!key || unique.has(key)) return false;
      unique.add(key);
      return true;
    });
    const prepared = accepted.map(tokens);
    const concepts = Array.isArray(item.concepts) ? item.concepts : [];
    const knownWords = new Set(prepared.flat().concat(concepts.flatMap(concept => (concept.alternatives || []).flatMap(tokens))));

    // Prepared alternatives outrank all heuristics.
    for (let index = 0; index < prepared.length; index += 1) {
      if (equal(actual, prepared[index])) {
        return { status: "accepted", ok: true, message: "Зміст підходить. Скажи свою версію вголос.", matchedExample: index, notes: [] };
      }
    }
    if (item.sentenceRequired && actual.length < 2) {
      return revision(sentence, `розгорни ці слова в речення${item.target || item.starter ? ` за конструкцією «${item.target || item.starter}»` : ': назви, хто виконує дію і що саме робить'}`,
        'У цій вправі потрібно передати задану думку повним реченням. Окремого слова або початку ще недостатньо.', 'unfinished-sentence');
    }
    // A near-copy with reversed meaning has a higher priority than form issues.
    for (const expected of prepared) {
      const issue = contradiction(actual, expected);
      if (issue) return issue;
    }
    // Punctuation is irrelevant for answer matching but can separate a valid
    // parenthetical from the main clause. Do not join it for grammar rules.
    for (const segment of sentence.split(/[.,;:!?—–()“”"]+/)) {
      const grammar = grammarIssue(tokens(segment));
      if (grammar) return grammar;
    }

    if (matchesTargetPattern(actual, item.target)) {
      return {
        status: "accepted", ok: true,
        message: "Конструкція підходить і змінна частина заповнена. Звір зміст із українською реплікою та скажи свою версію вголос.",
        notes: []
      };
    }

    for (let index = 0; index < prepared.length; index += 1) {
      const changes = supportedMatch(actual, prepared[index], knownWords);
      if (changes) {
        return {
          status: "accepted", ok: true, matchedExample: index,
          message: "Думка зрозуміла. Дрібна описка не заважає — можеш йти далі.",
          notes: changes.map(change => `«${change.from}» → «${change.to}». Переписувати через це не потрібно.`)
        };
      }
    }
    const missing = concepts.filter(concept => !(concept.alternatives || []).some(phrase => hasPhrase(actual, phrase)));
    const guidance = missing.find(concept => typeof concept.guidance === "string" && concept.guidance.trim())?.guidance;
    return {
      status: "review", ok: true,
      message: "Цю версію збережено для змістової перевірки в розмові. Можеш йти далі.",
      notes: guidance ? [`Для самоперевірки: ${guidance} Це запитання, а не знайдена помилка.`] : [],
      missingConcepts: missing.map(concept => concept.label).filter(Boolean)
    };
  }

  const api = Object.freeze({ check, tokens, near, isConcreteTarget, matchesTargetPattern });
  root.PilotChecker = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(globalThis);
