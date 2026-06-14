import { useState, useEffect, useRef } from "react";

/* ============================================================
   LA CATA A CIEGAS — Пульт ведущего  /host
   La Ciudad de los Sentidos · лингвистический детектив
   Архитектура утверждена 31 мая 2026
   Данные 10 глаголов вшиты из Истории-маяк + страниц глаголов
   ============================================================ */

// ---- Палитра (утверждена) ----
const C = {
  cream: "#FAF3E6",
  creamDeep: "#F3E8D2",
  card: "#FFFFFF",
  ink: "#3D2B1F",
  inkSoft: "#6B5544",
  gold: "#C9A24B",
  goldDeep: "#A67C2E",
  goldSoft: "#EBD9A8",
  raspberry: "#A81B3E",
  raspberryDeep: "#7E1430",
  emerald: "#16795B",
  emeraldDeep: "#0F5E47",
  line: "#E6D6B8",
};

const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

// ---- Данные глаголов (мини-история ES+RU с подсветкой глагола + досье) ----
const VERBS = [
  {
    key: "desayunar", emoji: "☕", inf: "desayunar", ru: "завтракать", scene: "Escena 1",
    storyEs: "Cada mañana, antes de que el Palacio de Caramelo despierte, el Gran Jefe Alcalde **desayuna** solo en su terraza favorita. Hoy **desayuna** con una taza de café negro y una torre de tostadas con caramelo dorado. Mientras **desayuna**, mira la ciudad que lentamente abre los ojos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Desayuna"], ["¿Dónde?", "En su terraza favorita"], ["¿Cuándo?", "Cada mañana, a las seis y media"], ["¿Con quién?", "Solo"], ["¿Qué come/bebe?", "Café negro y tostadas con caramelo dorado"], ["¿Qué hace a la vez?", "Mira la ciudad que despierta"], ["¿Y después?", "Llegan las mejores ideas"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"sí", n34:"sí", n35:"sí" },
  },
  {
    key: "caminar", emoji: "🚶", inf: "caminar", ru: "идти / гулять", scene: "Escena 2",
    storyEs: "Después del desayuno, el Gran Jefe Alcalde **camina** por los pasillos del Palacio de Caramelo. Él **camina** despacio, con las manos detrás de la espalda. El Jefe **camina** cada mañana exactamente veinte minutos. Mientras **camina**, encuentra una idea nueva.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Camina"], ["¿Dónde?", "Por los pasillos del palacio"], ["¿Cuándo?", "Cada mañana, después del desayuno"], ["¿Con quién?", "Solo"], ["¿Cómo camina?", "Despacio, con las manos detrás de la espalda"], ["¿Cuánto dura?", "Exactamente veinte minutos"], ["¿Y después?", "Llega una idea nueva"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"no", n25:"sí", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"no", n32:"no", n33:"no", n34:"no", n35:"sí" },
  },
  {
    key: "cantar", emoji: "🎵", inf: "cantar", ru: "петь", scene: "Escena 3",
    storyEs: "Cada mañana, a las siete en punto, los tres ayudantes del Jefe se reúnen en la Cocina Mágica. Ellos siempre **cantan** juntos una canción de trabajo. Mientras **cantan**, el caramelo en las ollas comienza a brillar más fuerte. El Jefe escucha desde su despacho y sonríe.",
    dossier: [["¿Quién?", "Los tres ayudantes del Jefe"], ["¿Qué hacen?", "Cantan"], ["¿Dónde?", "En la Cocina Mágica"], ["¿Cuándo?", "Cada mañana, a las siete en punto"], ["¿Con quién?", "Los tres juntos"], ["¿Qué cantan?", "«La melodía del caramelo dorado»"], ["¿Cuánto dura?", "Exactamente 5 minutos"], ["¿Qué pasa a la vez?", "El caramelo en las ollas brilla más fuerte"], ["¿Quién escucha?", "El Jefe, desde su despacho"]],
    answers: { n11:"no", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"sí", n32:"sí", n33:"no", n34:"no", n35:"no" },
  },
  {
    key: "mirar", emoji: "👁", inf: "mirar", ru: "смотреть", scene: "Escena 4",
    storyEs: "Desde la terraza del Palacio, el Gran Jefe Alcalde **mira** la ciudad cada mañana. Él **mira** con calma, sin prisa. Hoy **mira** las nubes, **mira** los ayudantes que caminan por el mercado, **mira** el río de caramelo. Cuando **mira** así, en silencio, entiende todo lo que necesita.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Mira"], ["¿Dónde?", "Desde la terraza del palacio"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Solo, en silencio"], ["¿Qué mira?", "Las nubes, los ayudantes, el río de caramelo"], ["¿Cómo mira?", "Con calma, sin prisa"], ["¿Y después?", "Entiende todo lo que necesita para el día"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"sí", n21:"no", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"sí", n34:"no", n35:"sí" },
  },
  {
    key: "buscar", emoji: "🔍", inf: "buscar", ru: "искать", scene: "Escena 5",
    storyEs: "Cada mañana, después de mirar la ciudad, el Jefe **busca** ideas nuevas para el menú. Él **busca** en su libro de recetas. Hoy **busca** un ingrediente especial — algo que nunca ha usado. **Busca** en los armarios dorados, **busca** en las cajas secretas del sótano. Al final lo encuentra.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Busca"], ["¿Qué busca?", "Un ingrediente especial, nuevo"], ["¿Dónde busca?", "El libro de recetas, los armarios, las cajas del sótano"], ["¿Cuándo?", "Cada mañana, después de mirar la ciudad"], ["¿Con quién?", "Solo"], ["¿Cómo termina?", "Siempre encuentra — sabe dónde mirar"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"sí", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
  },
  {
    key: "escuchar", emoji: "🎧", inf: "escuchar", ru: "слушать", scene: "Escena 6",
    storyEs: "Cada mañana, después de buscar ideas, el Jefe **escucha** los sonidos del Palacio. Se sienta en su sillón, cierra los ojos y **escucha** en silencio absoluto. Hoy **escucha** el caramelo que burbujea, el viento, los pasos de los ayudantes. **Escucha** durante diez minutos exactos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Escucha"], ["¿Dónde?", "En su sillón favorito"], ["¿Cuándo?", "Cada mañana, después de buscar ideas"], ["¿Con quién?", "Solo, en silencio absoluto"], ["¿Qué escucha?", "El caramelo que burbujea, el viento, los pasos"], ["¿Cuánto dura?", "Exactamente diez minutos"], ["¿Y después?", "Sabe qué falta en el palacio hoy"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"sí", n24:"no", n25:"no", n26:"no", n27:"no", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"sí" },
  },
  {
    key: "hablar", emoji: "🗣", inf: "hablar", ru: "говорить", scene: "Escena 7",
    storyEs: "El Gran Jefe Alcalde **habla** mucho. **Habla** con sus ayudantes cada mañana en la gran sala. **Habla** claro y despacio. Hoy **habla** sobre el menú especial del día. **Habla** durante quince minutos sin parar. Sus ayudantes escuchan y toman notas.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Habla"], ["¿Dónde?", "En la gran sala del palacio"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Con sus ayudantes"], ["¿De qué habla?", "Del menú especial del día"], ["¿Cuánto dura?", "Quince minutos sin parar"], ["¿Y los ayudantes?", "Escuchan y toman notas en cuadernos dorados"]],
    answers: { n11:"sí", m1:"no", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"no", n22:"no", n23:"no", n24:"sí", n25:"no", n26:"no", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"no", n33:"no", n34:"no", n35:"no" },
  },
  {
    key: "preparar", emoji: "👨‍🍳", inf: "preparar", ru: "готовить", scene: "Escena 8",
    storyEs: "Después de hablar con sus ayudantes, el Jefe **prepara** el plato especial del día. Hoy **prepara** una tarta de caramelo con pétalos de azúcar dorado. **Prepara** todo con cuidado, con su cucharón de oro y su varilla de cristal. **Prepara** este plato durante una hora exacta.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Prepara"], ["¿Qué prepara?", "Una tarta de caramelo con pétalos de azúcar dorado"], ["¿Dónde?", "Sobre la mesa de mármol blanco"], ["¿Cuándo?", "Después de hablar con los ayudantes"], ["¿Con quién?", "Solo (los ayudantes observan en silencio)"], ["¿Con qué?", "Cucharón de oro y varilla de cristal"], ["¿Cuánto dura?", "Exactamente una hora"], ["¿Qué hace a la vez?", "Canta en voz baja"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"no", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"sí" },
  },
  {
    key: "comprar", emoji: "🛒", inf: "comprar", ru: "покупать", scene: "Escena 9",
    storyEs: "Una vez a la semana, el Jefe va al mercado de caramelo a **comprar** ingredientes frescos. **Compra** siempre lo mismo: caramelo líquido, azúcar dorado y especias mágicas. Hoy **compra** algo nuevo — polvo de caramelo plateado. **Compra** con una lista en la mano, rápido y sin dudar.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Compra"], ["¿Dónde?", "En el mercado de caramelo"], ["¿Cuándo?", "Una vez a la semana"], ["¿Con quién?", "Solo"], ["¿Qué compra normalmente?", "Caramelo líquido, azúcar dorado, especias mágicas"], ["¿Qué compra hoy de nuevo?", "Una bolsa de polvo de caramelo plateado"], ["¿A quién compra?", "Al señor Dulce, en el rincón secreto del mercado"], ["¿Cómo compra?", "Rápido, con una lista en la mano"]],
    answers: { n11:"sí", m1:"sí", n12:"no", n13:"no", n14:"sí", n15:"sí", n16:"no", n21:"sí", n22:"sí", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"sí", n28:"no", n29:"no", n31:"sí", n32:"no", n33:"no", n34:"no", n35:"no" },
  },
  {
    key: "trabajar", emoji: "⚙️", inf: "trabajar", ru: "работать", scene: "Escena 10",
    storyEs: "En el Palacio de Caramelo, todos **trabajan** juntos. El Jefe **trabaja** desde las siete de la mañana hasta las tres de la tarde. Hoy todos **trabajan** en el gran banquete del viernes. El Jefe **trabaja** en la cocina; los ayudantes **trabajan** en la sala de decoración.",
    dossier: [["¿Quién?", "El Jefe y todos los ayudantes"], ["¿Qué hacen?", "Trabajan"], ["¿Dónde trabaja el Jefe?", "En la cocina principal"], ["¿Dónde los ayudantes?", "En la sala de decoración"], ["¿Cuándo?", "Hoy — en el banquete del viernes"], ["¿Con quién?", "Todos juntos"], ["¿En qué trabajan?", "Flores de azúcar y velas de caramelo"], ["¿Cuánto dura?", "De las siete a las tres de la tarde"], ["¿Y después?", "El resultado siempre es perfecto"]],
    answers: { n11:"sí", m1:"no", n12:"sí", n13:"sí", n14:"no", n15:"sí", n16:"sí", n21:"sí", n22:"no", n23:"no", n24:"no", n25:"no", n26:"sí", n27:"no", n28:"sí", n29:"no", n31:"no", n32:"sí", n33:"no", n34:"no", n35:"no" },
  },
];

// ---- Вопросы детективов (тот же список, что в симуляторе) ----
const QUESTIONS = [
  { id: "n11", cat: "quien", q: "¿El Jefe hace esto?" },
  { id: "m1",  cat: "quien", q: "¿El Jefe hace esto solo?" },
  { id: "n12", cat: "quien", q: "¿Los ayudantes también hacen esto?" },
  { id: "n13", cat: "donde", q: "¿Esto pasa dentro del palacio?" },
  { id: "n14", cat: "donde", q: "¿Esto pasa fuera del palacio?" },
  { id: "n32", cat: "donde", q: "¿Esto ocurre en la cocina?" },
  { id: "n33", cat: "donde", q: "¿Esto ocurre en la terraza?" },
  { id: "n15", cat: "cuando", q: "¿Esto pasa por la mañana?" },
  { id: "n16", cat: "cuando", q: "¿Esto ocurre todos los días?" },
  { id: "n31", cat: "cuando", q: "¿Esto dura menos de quince minutos?" },
  { id: "n21", cat: "como", q: "¿Se necesitan las manos para esto?" },
  { id: "n22", cat: "como", q: "¿Se necesitan los ojos para esto?" },
  { id: "n23", cat: "como", q: "¿Se necesitan los oídos para esto?" },
  { id: "n24", cat: "como", q: "¿Se necesita la voz para esto?" },
  { id: "n25", cat: "como", q: "¿Se necesitan las piernas para esto?" },
  { id: "n26", cat: "como", q: "¿Se necesita un objeto o instrumento para esto?" },
  { id: "n27", cat: "como", q: "¿Se necesita dinero para esto?" },
  { id: "n28", cat: "detalles", q: "¿Esto produce un sonido?" },
  { id: "n29", cat: "detalles", q: "¿Después de esto llega una idea nueva?" },
  { id: "n34", cat: "detalles", q: "¿El Jefe come o bebe algo durante esto?" },
  { id: "n35", cat: "detalles", q: "¿Hay silencio durante esto?" },
];
const CATS = [
  { id: "quien",    icon: "👤", es: "¿QUIÉN?" },
  { id: "donde",    icon: "📍", es: "¿DÓNDE?" },
  { id: "cuando",   icon: "🕐", es: "¿CUÁNDO?" },
  { id: "como",     icon: "✋", es: "¿CÓMO/CON QUÉ?" },
  { id: "detalles", icon: "🔎", es: "DETALLES" },
];

// ---- Персистентность (localStorage) ----
const STORE_KEY = "host_state_v1";
function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
function loadState() {
  try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : null; }
  catch (e) { return null; }
}

// ---- Латинский квадрат ролей: каждый 1×Канон, 1×Фантазия, 3×Детектив ----
function rolesForRound(order, r) {
  const n = order.length;            // число игроков в раунде (3..7)
  const canon = order[r % n];
  const fantasy = order[(r + 1) % n];
  const detectives = order.filter((p) => p !== canon && p !== fantasy);
  return { canon, fantasy, detectives };
}

// Подсветка глагола: текст с **глагол** → выделенные span
function Highlighted({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} style={{ color: C.goldDeep, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

// ---- Блочная обёртка с цветной полосой слева ----
function Block({ stripe, children, style }) {
  return (
    <div style={{
      background: C.card, borderRadius: 14, overflow: "hidden",
      boxShadow: "0 2px 10px rgba(61,43,31,0.08)", border: `1px solid ${C.line}`,
      display: "flex", marginBottom: 16, ...style,
    }}>
      <div style={{ width: 7, background: stripe, flexShrink: 0 }} />
      <div style={{ padding: "16px 18px", flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function Btn({ children, onClick, bg = C.gold, color = "#fff", disabled, big, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#D8CBB4" : bg, color, border: "none", borderRadius: big ? 12 : 10,
      padding: big ? "14px 22px" : "10px 16px", fontSize: big ? 18 : 15, fontWeight: 600, cursor: disabled ? "default" : "pointer",
      fontFamily: SERIF, transition: "transform .08s", ...style,
    }}>{children}</button>
  );
}

// ---- Таймер подготовки между раундами ----
const PREP_DEFAULT = 300; // 5:00 максимум
const PREP_MIN_LEFT = 120; // когда осталось ≤2:00 → прошёл минимум 3:00
function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function chime() {
  try {
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination);
    o.type = "sine"; o.frequency.value = 660; g.gain.value = 0.0001;
    o.start(); g.gain.exponentialRampToValueAtTime(0.12, a.currentTime + 0.05);
    setTimeout(() => { o.frequency.value = 880; }, 180);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.7);
    setTimeout(() => { o.stop(); a.close(); }, 800);
  } catch (e) { /* звук недоступен — не критично */ }
}

export default function HostConsole() {
  const [phase, setPhase] = useState("setup"); // setup | game | final
  const [players, setPlayers] = useState(["", "", "", "", ""]);
  const [chosen, setChosen] = useState([]); // keys of selected verbs (max 5)
  const [order, setOrder] = useState([]); // индексы игроков в порядке ротации (3..7), собирается при старте
  const [roundOrder, setRoundOrder] = useState([]); // активный порядок ТЕКУЩЕГО раунда (без ушедших); пересобирается только в startGame/nextRound — текущий раунд стабилен
  const [round, setRound] = useState(0); // 0..4
  const [qCount, setQCount] = useState(0); // вопросов задано в текущем раунде (0..27)
  const [scores, setScores] = useState({}); // index -> points
  const [solved, setSolved] = useState(false); // глагол этого раунда раскрыт/угадан
  const [turnIdx, setTurnIdx] = useState(0); // чей ход: индекс детектива в раунде (0..2)
  const [banner, setBanner] = useState("");
  const [askWho, setAskWho] = useState(false); // показать выбор детектива
  const [tg, setTg] = useState(null); // текст рассылки
  const [copied, setCopied] = useState("");
  const [prepActive, setPrepActive] = useState(false);
  const [prepLeft, setPrepLeft] = useState(PREP_DEFAULT);
  // --- Комната живой игры (Zoom) ---
  const [room, setRoom] = useState(() => { try { return JSON.parse(localStorage.getItem("host_room_v1")) || null; } catch (e) { return null; } });
  const [roomBusy, setRoomBusy] = useState(false);
  const [roomErr, setRoomErr] = useState("");
  const [rolesSent, setRolesSent] = useState(null); // {n, ok, msg} — статус отправки ролей раунда на пульты
  // широкий экран (ноутбук) → трёхколоночный режим; узкий — мобильная колонка как раньше
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1100);
  useEffect(() => {
    const onR = () => setWide(window.innerWidth >= 1100);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const loaded = useRef(false);

  // загрузка состояния
  useEffect(() => {
    const s = loadState();
    if (s) {
      setPhase(s.phase); setPlayers(s.players); setChosen(s.chosen);
      setOrder(s.order); setRound(s.round); setQCount(s.qCount);
      setScores(s.scores); setSolved(s.solved); setTurnIdx(s.turnIdx || 0);
      setRoundOrder(s.roundOrder && s.roundOrder.length ? s.roundOrder : s.order);
    }
    loaded.current = true;
  }, []);
  // сохранение
  useEffect(() => {
    if (!loaded.current) return;
    saveState({ phase, players, chosen, order, roundOrder, round, qCount, scores, solved, turnIdx });
  }, [phase, players, chosen, order, roundOrder, round, qCount, scores, solved, turnIdx]);

  // тик таймера подготовки
  useEffect(() => {
    if (!prepActive) return;
    if (prepLeft <= 0) {
      setPrepActive(false); chime();
      setBanner("¡Empezamos! Подготовка завершена — детективы задают вопросы.");
      return;
    }
    const t = setTimeout(() => setPrepLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [prepActive, prepLeft]);

  // --- Комната: создание, опрос, действия ---
  async function api(payload) {
    const r = await fetch("/api/game", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return r.json();
  }
  async function createRoom() {
    setRoomBusy(true); setRoomErr("");
    try {
      const d = await api({ action: "create" });
      if (d.ok) { setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game)); }
      else setRoomErr(d.error || "Не получилось создать комнату");
    } catch (e) { setRoomErr("Сеть недоступна: " + e); }
    setRoomBusy(false);
  }
  function closeRoom() { setRoom(null); setRoomErr(""); try { localStorage.removeItem("host_room_v1"); } catch (e) {} }
  async function kickPlayer(pid) {
    if (!room) return;
    const d = await api({ action: "kick", code: room.code, playerId: pid });
    if (d.ok) { setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game)); }
  }
  function fillFromRoom() {
    if (!room) return;
    const names = (room.players || []).map((p) => p.name).slice(0, 7);
    // минимум 3 слота для удобства ввода, иначе ровно сколько вошло (до 7)
    setPlayers(names.length >= 3 ? names : [...names, ...Array(3 - names.length).fill("")]);
  }
  // опрос комнаты раз в 2 сек: в настройке (вход игроков) и во время игры (лента вопросов)
  useEffect(() => {
    if (!room) return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/game?code=${room.code}`);
        const d = await r.json();
        if (d.ok) { setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game)); }
      } catch (e) { /* временный сбой сети — не страшно */ }
    }, 2000);
    return () => clearInterval(t);
  }, [room && room.code, phase]);

  // детективы спрашивают со своих пультов → счёт вопросов и очередь приходят из комнаты
  useEffect(() => {
    if (!room || phase !== "game" || !room.round) return;
    if (room.round.n !== round + 1) return;
    const sq = (room.round.asked || []).length;
    const st = room.round.turnIdx || 0;
    if (st !== turnIdx) setTurnIdx(st);
    if (sq !== qCount) {
      setQCount(sq);
      if (sq === 9) setBanner("Круг 1 завершён — детективы не угадали. Переходим к Кругу 2.");
      else if (sq === 18) setBanner("Круг 2 завершён. Финальный Круг 3.");
      else if (sq === 27) setBanner("Вопросы закончились. Если глагол не угадан — свидетели получают потолок +6.");
    }
  }, [room, phase, round, qCount, turnIdx]);

  function startPrep() { setPrepLeft(PREP_DEFAULT); setPrepActive(true); }

  // --- Роли на пульты игроков: имя в списке игры → playerId в комнате ---
  function roomPid(name) {
    if (!room || !name) return null;
    const p = (room.players || []).find((x) => x.name.trim().toLowerCase() === String(name).trim().toLowerCase());
    return p ? p.id : null;
  }
  // Игрок вышел НАВСЕГДА (флаг left на room.players по имени). Отличается от eliminated (выбыл в одном раунде).
  function isLeft(name) {
    if (!room || !name) return false;
    const p = (room.players || []).find((x) => x.name.trim().toLowerCase() === String(name).trim().toLowerCase());
    return !!(p && p.left);
  }
  // Ведущая отмечает ушедшего (страховка, если у игрока не нажалось). Тот же серверный action leave.
  async function leaveByHost(name) {
    const pid = roomPid(name);
    if (!room || !pid) return;
    if (!window.confirm(`Отметить, что ${name} вышел(а) из игры? Со следующего раунда не участвует, очки сохранятся.`)) return;
    try { await api({ action: "leave", code: room.code, playerId: pid }); } catch (e) {}
  }
  async function pushRoles(roundIdx, ordArg) {
    if (!room) return; // игра без комнаты — ручной режим, ничего не шлём
    const ord = ordArg && ordArg.length ? ordArg : (roundOrder && roundOrder.length ? roundOrder : order);
    const rr = rolesForRound(ord, roundIdx);
    const vk = chosen.length ? chosen[roundIdx % chosen.length] : "";
    setRolesSent({ n: roundIdx + 1, ok: false, msg: "отправляю..." });
    try {
      const d = await api({
        action: "start_round", code: room.code, round: roundIdx + 1, verbKey: vk,
        roles: {
          canon: roomPid(players[rr.canon]),
          fantasy: roomPid(players[rr.fantasy]),
          canonName: players[rr.canon],
          fantasyName: players[rr.fantasy],
          detectives: rr.detectives.map((i) => roomPid(players[i])).filter(Boolean),
        },
      });
      if (d.ok) setRolesSent({ n: roundIdx + 1, ok: true, msg: "" });
      else setRolesSent({ n: roundIdx + 1, ok: false, msg: d.error || "не получилось" });
    } catch (e) { setRolesSent({ n: roundIdx + 1, ok: false, msg: "сеть недоступна" }); }
  }

  const verbByKey = (k) => VERBS.find((v) => v.key === k);
  // Глагол раунда берётся из выбранного пула по кругу: chosen[round % длина].
  // При длине пула ≥ 2 подряд один и тот же глагол не выпадает — «новый каждый раунд».
  const curVerbKey = chosen.length ? chosen[round % chosen.length] : null;
  const curVerb = phase !== "setup" && curVerbKey ? verbByKey(curVerbKey) : null;
  // Роли ТЕКУЩЕГО раунда считаем по roundOrder (стабилен — уход игрока не перетасовывает текущий раунд).
  // Фоллбэк на order для старых сохранений без roundOrder.
  const activeOrder = (roundOrder && roundOrder.length) ? roundOrder : order;
  const { canon, fantasy, detectives } = phase !== "setup"
    ? rolesForRound(activeOrder, round) : { canon: null, fantasy: null, detectives: [] };

  // текущий круг по числу заданных вопросов
  const circle = qCount < 9 ? 1 : qCount < 18 ? 2 : 3;
  const activeDetective = detectives.length ? detectives[turnIdx % detectives.length] : null;
  const dotsFilled = qCount - (circle - 1) * 9; // заполнено в текущем круге (0..9)

  function toggleVerb(k) {
    setChosen((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }
  // индексы заполненных слотов игроков (пустые игнорируются)
  const filledIdxs = players.map((p, i) => (p.trim() ? i : -1)).filter((i) => i >= 0);
  function distribute() { setOrder(shuffle(filledIdxs)); }
  function shuffle(a) { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

  // Старт: от 3 до 7 игроков, пул глаголов ≥ 2 (чтобы подряд не повторялись).
  const canStart = filledIdxs.length >= 3 && filledIdxs.length <= 7 && chosen.length >= 2;

  function startGame() {
    // порядок = заполненные игроки; сохраняем превью-раскладку, если она по тому же составу
    const sameSet = order.length === filledIdxs.length && filledIdxs.every((i) => order.includes(i));
    const ord = sameSet ? order : shuffle(filledIdxs);
    setOrder(ord);
    setRoundOrder(ord); // первый раунд играет полный состав
    const s = {}; filledIdxs.forEach((i) => (s[i] = 0));
    setScores(s); setRound(0); setQCount(0); setSolved(false); setTurnIdx(0); setBanner(""); setPhase("game"); startPrep();
    pushRoles(0, ord);
  }

  // ход переходит следующему детективу по кругу; комната узнаёт сразу
  function passTurn() {
    const n = detectives.length || 1;
    const t = (turnIdx + 1) % n;
    setTurnIdx(t);
    if (room) api({ action: "set_turn", code: room.code, turnIdx: t }).catch(() => {});
  }
  const roundConnected = !!(room && room.round && phase === "game" && room.round.n === round + 1);
  // --- Свой вопрос детектива: ✅ = +2 автоматически, ❌ = 0 без штрафа; ход переходит сам ---
  const pendingOwn = roundConnected ? room.round.pendingOwn || null : null;
  const ownChimed = useRef(0);
  useEffect(() => {
    if (pendingOwn && pendingOwn.ts !== ownChimed.current) {
      ownChimed.current = pendingOwn.ts;
      chime();
    }
  }, [pendingOwn && pendingOwn.ts]);
  async function approveOwn(approved) {
    if (!pendingOwn) return;
    const byName = pendingOwn.byName;
    const d = await api({ action: "approve", code: room.code, approved });
    if (!d.ok) { setBanner("⚠️ " + (d.error || "Не получилось оценить вопрос")); return; }
    setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game));
    if (approved) {
      const idx = players.findIndex((p) => p.trim().toLowerCase() === String(byName).trim().toLowerCase());
      if (idx >= 0) award(2, [idx]);
      setBanner(`✅ Свой вопрос (${byName}): +2`);
    } else {
      setBanner(`❌ Свой вопрос (${byName}): не засчитан, без штрафа`);
    }
  }
  // --- Шаг 5: угадывание глагола (руки, слово, голосование, вердикт) ---
  const rdSrv = roundConnected ? room.round : null;
  const handsSrv = rdSrv ? rdSrv.hands || [] : [];
  const guessSrv = rdSrv ? rdSrv.guess || null : null;
  const votedCount = rdSrv ? (rdSrv.votedIds || []).length : 0;
  const votersNeed = rdSrv ? ((rdSrv.roles && rdSrv.roles.detectives) || []).length : 0;
  const elimSrv = rdSrv ? rdSrv.eliminated || [] : [];
  const revealedSrv = rdSrv ? rdSrv.revealed || null : null;
  async function giveFloor(pid) {
    const d = await api({ action: "give_floor", code: room.code, playerId: pid });
    if (!d.ok) { setBanner("⚠️ " + (d.error || "Не получилось дать слово")); return; }
    setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game));
  }
  async function sendVerdict(correct) {
    const d = await api({ action: "verdict", code: room.code, correct });
    if (!d.ok) { setBanner("⚠️ " + (d.error || "Не получилось")); return; }
    setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game));
  }
  async function endRoundSrv() {
    const d = await api({ action: "end_round", code: room.code });
    if (!d.ok) { setBanner("⚠️ " + (d.error || "Не получилось завершить раунд")); return; }
    setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game));
  }
  async function forceVotes() {
    const d = await api({ action: "force_votes", code: room.code });
    if (!d.ok) { setBanner("⚠️ " + (d.error || "Не получилось")); return; }
    setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game));
  }
  // вскрытие пришло из комнаты → очки в таблицу /host один раз (защита от перезагрузки страницы)
  const revealApplied = useRef(Number(localStorage.getItem("host_reveal_v1") || 0));
  useEffect(() => {
    if (!revealedSrv || revealedSrv.ts === revealApplied.current) return;
    revealApplied.current = revealedSrv.ts;
    try { localStorage.setItem("host_reveal_v1", String(revealedSrv.ts)); } catch (e) {}
    setScores((prev) => {
      const sc = { ...prev };
      (revealedSrv.breakdown || []).forEach((b) => {
        const idx = players.findIndex((p) => p.trim().toLowerCase() === String(b.name).trim().toLowerCase());
        if (idx >= 0) sc[idx] = (sc[idx] || 0) + b.pts;
      });
      return sc;
    });
    setSolved(true); setAskWho(false);
    const rvb = verbByKey(revealedSrv.verbKey);
    setBanner(revealedSrv.ok
      ? `✔ ${revealedSrv.byName} угадал: ${rvb ? rvb.inf : revealedSrv.verbKey} (+${revealedSrv.detPts}, круг ${revealedSrv.circle}). Очки начислены автоматически.`
      : `Никто не угадал. Глагол: ${rvb ? rvb.inf : revealedSrv.verbKey}. Очки свидетелям начислены.`);
    chime();
  }, [revealedSrv && revealedSrv.ts]);
  // выбывание детектива → плашка
  const elimSeen = useRef(0);
  useEffect(() => {
    const le = rdSrv ? rdSrv.lastElim : null;
    if (le && le.ts !== elimSeen.current) {
      elimSeen.current = le.ts;
      setBanner(`❌ ${le.byName} назвал(а) неверный глагол — выбывает до конца раунда`);
    }
  }, [rdSrv && rdSrv.lastElim && rdSrv.lastElim.ts]);
  // звуковой сигнал: называние глагола / новая рука
  const guessChimed = useRef(0);
  useEffect(() => {
    if (guessSrv && guessSrv.stage === "naming" && guessSrv.ts !== guessChimed.current) {
      guessChimed.current = guessSrv.ts; chime();
    }
  }, [guessSrv && guessSrv.stage, guessSrv && guessSrv.ts]);
  const handsChimed = useRef(0);
  useEffect(() => {
    const last = handsSrv.length ? handsSrv[handsSrv.length - 1].ts : 0;
    if (last && last !== handsChimed.current) { handsChimed.current = last; chime(); }
  }, [handsSrv.length]);

  async function addQuestion() {
    if (solved || qCount >= 27) return;
    if (roundConnected) {
      // вопрос задан голосом без пульта: сервер сам двинет очередь, синк подтянет счёт
      const d = await api({ action: "ask", code: room.code, manual: true, text: "🎙 вопрос задан голосом" });
      if (d.ok) { setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game)); }
      return;
    }
    passTurn();
    const n = qCount + 1; setQCount(n);
    if (n === 9) setBanner("Круг 1 завершён — детективы не угадали. Переходим к Кругу 2.");
    else if (n === 18) setBanner("Круг 2 завершён. Финальный Круг 3.");
    else if (n === 27) setBanner("Вопросы закончились. Если глагол не угадан — свидетели получают потолок +6.");
    else setBanner("");
  }

  function award(points, idxList) {
    setScores((prev) => { const s = { ...prev }; idxList.forEach((i) => (s[i] = (s[i] || 0) + points)); return s; });
  }
  // детектив угадал
  function detectiveGuessed(detIdx) {
    const detPts = circle === 1 ? 5 : circle === 2 ? 3 : 1;
    const witPts = circle === 1 ? 0 : circle === 2 ? 3 : 6;
    award(detPts, [detIdx]);
    if (witPts > 0) award(witPts, [canon, fantasy]);
    setSolved(true); setAskWho(false);
    setBanner(`✔ Угадал ${players[detIdx]} (+${detPts}). Свидетели ${witPts > 0 ? "+" + witPts : "0"}.`);
  }
  // никто не угадал
  function nobody() {
    award(6, [canon, fantasy]);
    setSolved(true); setAskWho(false);
    setBanner("Никто не угадал. Свидетели +6 (потолок). Глагол раскрывается.");
  }
  function manual(idx, pts) { award(pts, [idx]); }

  // Раунды открытые: идут, пока ведущая не завершит игру. Без потолка в 5.
  function nextRound() {
    // следующий раунд пересобираем БЕЗ ушедших; текущий раунд доигрывался прежним составом
    const nextOrder = order.filter((i) => !isLeft(players[i]));
    setRoundOrder(nextOrder);
    setRound(round + 1); setQCount(0); setSolved(false); setTurnIdx(0); setBanner(""); setTg(null); startPrep();
    pushRoles(round + 1, nextOrder);
  }
  // Ведущая решает, когда игра окончена → экран итогов.
  function finishGame() { setPhase("final"); }

  function makeTelegram() {
    const v = curVerb;
    setTg({
      canon: `🟢 Tu rol: TESTIGO CANON (Свидетель Канона)\nГлагол раунда: ${v.inf.toUpperCase()} — ${v.ru}\nТы знаешь правду. Открой свою шпаргалку Канона и отвечай строго по истории. Только Sí / No + одна фраза.`,
      fantasy: `🔴 Tu rol: TESTIGO FANTASÍA (Свидетель Фантазии)\nГлагол раунда: ${v.inf.toUpperCase()} — ${v.ru}\nТы врёшь, но убедительно. Открой свою шпаргалку Фантазии и держись своей версии до конца.`,
    });
  }
  function copy(txt, label) {
    try { navigator.clipboard.writeText(txt); setCopied(label); setTimeout(() => setCopied(""), 1500); } catch (e) {}
  }

  function resetAll() {
    setPhase("setup"); setPlayers(["", "", "", "", ""]); setChosen([]);
    setOrder([]); setRoundOrder([]); setRound(0); setQCount(0); setScores({}); setSolved(false); setBanner(""); setTg(null);
  }

  // ---------- ОБЩИЙ КАРКАС ----------
  const wrap = {
    minHeight: "100vh", background: `radial-gradient(120% 80% at 50% 0%, ${C.cream} 0%, ${C.creamDeep} 100%)`,
    fontFamily: SERIF, color: C.ink, padding: "18px 14px 60px", boxSizing: "border-box",
  };
  const maxw = { maxWidth: 560, margin: "0 auto" };

  // ---------- SETUP / Блок 0 ----------
  if (phase === "setup") {
    return (
      <div style={wrap}><div style={maxw}>
        <Header />
        <Block stripe={C.raspberry}>
          <h2 style={h2}>🎮 Комната Zoom-игры</h2>
          {!room ? (
            <>
              <p style={pHint}>Создай комнату — получишь код для игроков. Они введут его в своих пультах, и ты увидишь, кто вошёл.</p>
              <Btn bg={C.raspberry} disabled={roomBusy} onClick={createRoom} style={{ width: "100%", marginTop: 10, padding: 13 }}>
                {roomBusy ? "Создаю..." : "✦ Создать комнату"}
              </Btn>
              {roomErr && <p style={{ ...pHint, color: C.raspberry, marginTop: 8 }}>{roomErr}</p>}
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", margin: "10px 0 4px" }}>
                <div style={{ fontSize: 13, color: C.inkSoft }}>Код игры — продиктуй или кинь в чат Zoom:</div>
                <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 8, color: C.raspberry, margin: "4px 0" }}>{room.code}</div>
              </div>
              <Label>Вошли ({(room.players || []).length}/7)</Label>
              {(room.players || []).length === 0 && (
                <p style={{ ...pHint, marginTop: 6 }}>Пока никого — жду игроков...</p>
              )}
              {(room.players || []).map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "9px 12px", marginTop: 6 }}>
                  <span style={{ fontWeight: 700 }}>✅ {p.name}</span>
                  <button onClick={() => kickPlayer(p.id)} title="Убрать из комнаты" style={{ background: "none", border: "none", color: C.inkSoft, cursor: "pointer", fontSize: 15 }}>✕</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <Btn bg={C.emerald} disabled={(room.players || []).length === 0} onClick={fillFromRoom}>↓ Подставить имена в игру</Btn>
                <Btn bg={C.goldDeep} onClick={closeRoom}>Закрыть комнату</Btn>
              </div>
            </>
          )}
        </Block>
        <Block stripe={C.gold}>
          <h2 style={h2}>Настройка игры</h2>
          <p style={pHint}>От 3 до 7 участников и минимум 2 глагола из пула. Раунды идут, пока ты не завершишь игру. Роли крутятся по кругу.</p>

          <div style={{ marginTop: 12 }}>
            <Label>Участники ({filledIdxs.length} · можно 3–7)</Label>
            {players.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={p} placeholder={`Игрок ${i + 1}`}
                  onChange={(e) => setPlayers(players.map((x, j) => (j === i ? e.target.value : x)))}
                  style={{ ...inp, flex: 1 }} />
                {players.length > 3 && (
                  <button onClick={() => setPlayers(players.filter((_, j) => j !== i))}
                    title="Убрать слот" style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 8, width: 38, height: 38, marginBottom: 8, color: C.raspberry, cursor: "pointer", fontSize: 16, flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
              {players.length < 7 && (
                <button onClick={() => setPlayers([...players, ""])}
                  style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "5px 12px", color: C.emeraldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>
                  + Добавить игрока
                </button>
              )}
              <button onClick={() => setPlayers(players.map((x, j) => (x.trim() ? x : `Тест${j + 1}`)))}
                style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "5px 12px", color: C.inkSoft, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF }}>
                🧪 Заполнить пустые тестовыми именами
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <Label>Глаголы — пул (выбрано {chosen.length}, нужно ≥ 2)</Label>
            <p style={{ ...pHint, marginTop: 0 }}>Каждый раунд берётся следующий по кругу — подряд один и тот же не выпадет.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {VERBS.map((v) => {
                const on = chosen.includes(v.key);
                const idx = chosen.indexOf(v.key);
                return (
                  <button key={v.key} onClick={() => toggleVerb(v.key)} style={{
                    border: `1.5px solid ${on ? C.raspberry : C.line}`,
                    background: on ? C.raspberry : C.card, color: on ? "#fff" : C.ink,
                    borderRadius: 999, padding: "7px 13px", fontSize: 14, fontFamily: SERIF,
                    cursor: "pointer", fontWeight: on ? 700 : 500,
                  }}>
                    {v.emoji} {v.inf}{on ? ` · #${idx + 1}` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <Label>Раскладка ролей (превью первого круга)</Label>
            <RolesPreview players={players} order={order} chosen={chosen} filledIdxs={filledIdxs} />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <Btn bg={C.goldDeep} onClick={distribute}>🎲 Распределить / Перераспределить</Btn>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Btn bg={C.emerald} disabled={!canStart} onClick={startGame}
              style={{ width: "100%", padding: "14px", fontSize: 17 }}>
              ✦ Сохранить и начать игру
            </Btn>
            {!canStart && <p style={{ ...pHint, color: C.raspberry, marginTop: 8 }}>
              Нужно от 3 до 7 имён и минимум 2 глагола.</p>}
          </div>
        </Block>
        <Footer onReset={resetAll} />
      </div></div>
    );
  }

  // ---------- FINAL ----------
  if (phase === "final") {
    const ranking = order.map((i) => ({ i, pts: scores[i] || 0 }))
      .sort((a, b) => b.pts - a.pts);
    return (
      <div style={wrap}><div style={maxw}>
        <Header />
        <Block stripe={C.gold}>
          <h2 style={{ ...h2, textAlign: "center" }}>🏆 Итоги игры</h2>
          <div style={{ marginTop: 8 }}>
            {ranking.map((r, k) => {
              const gone = isLeft(players[r.i]);
              const champ = k === 0 && !gone;
              return (
              <div key={r.i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", marginBottom: 8, borderRadius: 10,
                background: champ ? C.goldSoft : C.cream,
                border: `1px solid ${champ ? C.gold : C.line}`,
                opacity: gone ? 0.6 : 1,
              }}>
                <span style={{ fontWeight: champ ? 700 : 600, fontSize: 17, color: gone ? C.inkSoft : C.ink, textDecoration: gone ? "line-through" : "none" }}>
                  {champ ? "👑 " : `${k + 1}. `}{players[r.i]}{gone && <span style={{ fontSize: 12.5, color: C.raspberry, fontWeight: 700, textDecoration: "none" }}> · вышел</span>}
                </span>
                <span style={{ fontWeight: 700, color: gone ? C.inkSoft : C.raspberry, fontSize: 18 }}>{r.pts}</span>
              </div>
              );
            })}
          </div>
          <Btn bg={C.emerald} onClick={resetAll} style={{ width: "100%", marginTop: 14, padding: 13 }}>
            Новая игра
          </Btn>
        </Block>
        <Footer onReset={resetAll} />
      </div></div>
    );
  }

  // ---------- GAME ----------
  const v = curVerb;
  const rd0 = roundConnected ? room.round : null;

  // --- плашка-баннер (во всю ширину) ---
  const bannerEl = banner ? (
    <div style={{
      background: solved ? C.emerald : C.goldSoft, color: solved ? "#fff" : C.ink,
      border: `1px solid ${solved ? C.emeraldDeep : C.gold}`, borderRadius: 12,
      padding: "12px 16px", marginBottom: 14, fontWeight: 600, fontSize: wide ? 17 : 15,
    }}>{banner}</div>
  ) : null;

  // --- таймер подготовки: компактный сбоку (wide) / полный (мобильный) ---
  const prepEl = prepActive ? (() => {
    const elapsed = PREP_DEFAULT - prepLeft;
    const ready = prepLeft <= PREP_MIN_LEFT; // прошёл минимум 3:00
    const accent = ready ? C.emerald : C.goldDeep;
    if (wide) return (
      <div style={{
        background: C.card, border: `2px solid ${accent}`, borderRadius: 14,
        padding: "12px 14px", marginBottom: 16, boxShadow: "0 2px 10px rgba(61,43,31,0.10)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>Подготовка свидетелей</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmtTime(prepLeft)}</div>
        </div>
        <div style={{ position: "relative", height: 6, background: C.cream, borderRadius: 99, marginTop: 8 }}>
          <div style={{ width: `${(elapsed / PREP_DEFAULT) * 100}%`, height: "100%", background: accent, borderRadius: 99, transition: "width 1s linear" }} />
          <div style={{ position: "absolute", left: "60%", top: -3, width: 2, height: 12, background: C.goldDeep }} title="mínimo 3:00" />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <Btn bg={ready ? C.emerald : C.goldDeep} style={{ padding: "7px 12px", fontSize: 13.5 }}
            onClick={() => { setPrepActive(false); setBanner("¡Empezamos! Детективы задают вопросы."); }}>
            {ready ? "▶ Начать раунд" : "▶ Раньше"}
          </Btn>
          <Btn bg={C.gold} style={{ padding: "7px 12px", fontSize: 13.5 }} onClick={() => setPrepLeft((s) => Math.min(s + 60, 600))}>+1 мин</Btn>
          <Btn bg="#B0A48C" style={{ padding: "7px 12px", fontSize: 13.5 }} onClick={() => setPrepActive(false)}>Скрыть</Btn>
        </div>
      </div>
    );
    return (
      <div style={{
        background: C.card, border: `2px solid ${accent}`, borderRadius: 14,
        padding: "16px 18px", marginBottom: 16, boxShadow: "0 2px 10px rgba(61,43,31,0.10)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: wide ? 16 : 13.5, fontWeight: 600, color: C.inkSoft, maxWidth: "60%" }}>
            Подготовка свидетелей · открыть глагол, историю и шпаргалку
          </div>
          <div style={{ fontSize: wide ? 48 : 40, fontWeight: 700, color: accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(prepLeft)}
          </div>
        </div>
        <div style={{ position: "relative", height: 8, background: C.cream, borderRadius: 99, marginTop: 12, overflow: "visible" }}>
          <div style={{ width: `${(elapsed / PREP_DEFAULT) * 100}%`, height: "100%", background: accent, borderRadius: 99, transition: "width 1s linear" }} />
          <div style={{ position: "absolute", left: "60%", top: -3, width: 2, height: 14, background: C.goldDeep }} title="mínimo 3:00" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.inkSoft, marginTop: 3 }}>
          <span>0:00</span><span style={{ color: C.goldDeep }}>mínimo 3:00</span><span>5:00</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Btn big={wide} bg={ready ? C.emerald : C.goldDeep}
            onClick={() => { setPrepActive(false); setBanner("¡Empezamos! Детективы задают вопросы."); }}>
            {ready ? "▶ Начать раунд" : "▶ Начать раньше"}
          </Btn>
          <Btn big={wide} bg={C.gold} onClick={() => setPrepLeft((s) => Math.min(s + 60, 600))}>+1 мин</Btn>
          <Btn big={wide} bg="#B0A48C" onClick={() => setPrepActive(false)}>Скрыть</Btn>
        </div>
      </div>
    );
  })() : (
    !solved ? (
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <button onClick={startPrep} style={{
          background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px",
          color: C.goldDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600,
        }}>⟲ Таймер подготовки (5:00)</button>
      </div>
    ) : null
  );

  // === ЛЕВАЯ ЗОНА — мир глагола (читаю, не нажимаю) ===
  const verbCard = (
    <Block stripe={C.gold}>
      <div style={tag}>Раунд {round + 1} · только для ведущего</div>
      <div style={{ fontSize: wide ? 46 : 40, fontWeight: 700, lineHeight: 1.1, color: C.ink }}>
        {v.emoji} {v.inf}
      </div>
      <div style={{ color: C.inkSoft, fontSize: wide ? 18 : 16, fontStyle: "italic" }}>{v.ru}</div>
    </Block>
  );

  const storyCard = <StoryBlock v={v} wide={wide} />;

  const dossierCard = (
    <Block stripe={C.emerald}>
      <h2 style={h2}>Досье · {v.inf}</h2>
      <div style={{
        background: C.emerald, color: "#fff", borderRadius: 8, padding: "6px 12px",
        display: "inline-block", fontWeight: 700, fontSize: 13.5, marginBottom: 12,
        letterSpacing: ".3px",
      }}>🟢 CANON — solo esto es verdad</div>
      <div style={{ paddingTop: 2 }}>
        {v.dossier.map(([q, a], i) => (
          <div key={i} style={{ display: "flex", padding: "6px 0", borderBottom: i < v.dossier.length - 1 ? `1px dashed ${C.line}` : "none" }}>
            <div style={{ width: 140, flexShrink: 0, color: C.goldDeep, fontWeight: 600, fontSize: wide ? 15 : 14 }}>{q}</div>
            <div style={{ fontSize: wide ? 15 : 14 }}>{a}</div>
          </div>
        ))}
      </div>
    </Block>
  );

  // === ПРАВАЯ ЗОНА — люди, комната, счёт ===
  const rolesCard = (
    <Block stripe={C.goldDeep}>
      <h2 style={h2}>Роли раунда</h2>
      <div style={{ marginTop: 8, fontSize: wide ? 15.5 : 14.5, lineHeight: 1.6 }}>
        <RoleLine color={C.emerald} label="Канон" name={players[canon]} />
        <RoleLine color={C.raspberry} label="Фантазия" name={players[fantasy]} />
        <RoleLine color={C.goldDeep} label="Детективы" name={detectives.map((d) => players[d]).join(" · ")} />
      </div>
      {rd0 && rd0.witAName && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, fontSize: 13.5 }}>
          {[["A", rd0.witAName], ["B", rd0.witBName]].map(([L, nm]) => {
            const isCanon = nm === players[canon];
            return (
              <span key={L} style={{ background: C.cream, border: `1.5px solid ${isCanon ? C.emerald : C.raspberry}`, borderRadius: 99, padding: "4px 12px", fontWeight: 700 }}>
                Свидетель {L} — {nm} <span style={{ color: isCanon ? C.emeraldDeep : C.raspberryDeep, fontSize: 11.5 }}>({isCanon ? "Канон" : "Фантазия"})</span>
              </span>
            );
          })}
        </div>
      )}
      {room && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px" }}>
          <span style={{ background: C.goldDeep, color: "#fff", borderRadius: 8, padding: "3px 10px", fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>Комната {room.code}</span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: rolesSent && rolesSent.n === round + 1 && rolesSent.ok ? C.emeraldDeep : C.inkSoft }}>
            {rolesSent && rolesSent.n === round + 1
              ? (rolesSent.ok ? "📡 Роли и глагол отправлены на пульты игроков" : `⚠️ Роли не дошли: ${rolesSent.msg}`)
              : "📡 Роли ещё не отправлены на пульты"}
          </span>
          <button onClick={() => pushRoles(round)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "3px 10px", color: C.goldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>↻ Отправить ещё раз</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <Btn bg={C.gold} onClick={makeTelegram}>📨 Отправить глагол свидетелям</Btn>
      </div>
      {tg && (
        <div style={{ marginTop: 14, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
          <MsgBox title="Свидетелю Канона 🟢" text={tg.canon} onCopy={() => copy(tg.canon, "canon")} copied={copied === "canon"} />
          <MsgBox title="Свидетелю Фантазии 🔴" text={tg.fantasy} onCopy={() => copy(tg.fantasy, "fant")} copied={copied === "fant"} />
          <p style={{ ...pHint, marginTop: 4 }}>Скопируй и отправь каждому в личку Telegram. Это страховка — обычно роли уезжают на пульты сами.</p>
        </div>
      )}
    </Block>
  );

  const scoreCard = (
    <Block stripe={C.gold}>
      <h2 style={h2}>Счёт <span style={{ fontWeight: 400, fontSize: 13, color: C.inkSoft }}>· копится через все раунды</span></h2>
      {order.map((i) => {
        const role = i === canon ? ["Канон", C.emerald] : i === fantasy ? ["Фантазия", C.raspberry] : ["Детектив", C.goldDeep];
        const gone = isLeft(players[i]);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${C.line}`, opacity: gone ? 0.6 : 1 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: wide ? 16 : 15, color: gone ? C.inkSoft : C.ink, textDecoration: gone ? "line-through" : "none" }}>{players[i]}</div>
              {gone
                ? <span style={{ fontSize: 12, color: "#fff", background: "#B0A48C", borderRadius: 6, padding: "1px 7px" }}>вышел</span>
                : <span style={{ fontSize: 12, color: "#fff", background: role[1], borderRadius: 6, padding: "1px 7px" }}>{role[0]}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: wide ? 22 : 20, color: C.goldDeep, minWidth: 34, textAlign: "right" }}>{scores[i] || 0}</span>
              {[5, 3, 1, -1].map((p) => (
                <button key={p} onClick={() => manual(i, p)} style={{
                  width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${p < 0 ? C.raspberryDeep : C.line}`,
                  background: C.card, color: p < 0 ? C.raspberryDeep : C.ink, fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: SERIF,
                }}>{p > 0 ? `+${p}` : p}</button>
              ))}
            </div>
          </div>
        );
      })}
      <p style={{ ...pHint, marginTop: 8 }}>Кнопки +5 / +3 / +1 / −1 — ручная корректировка ведущим.</p>
    </Block>
  );

  // === СОСТАВ — кто в игре, кто вышел (живые/ушедшие) ===
  const composicionCard = room ? (
    <Block stripe={C.emerald}>
      <h2 style={h2}>Состав <span style={{ fontWeight: 400, fontSize: 13, color: C.inkSoft }}>· кто в игре</span></h2>
      <div style={{ marginTop: 8 }}>
        {order.map((i) => {
          const nm = players[i];
          const gone = isLeft(nm);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${C.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: 14 }}>{gone ? "🚪" : "🟢"}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: gone ? C.inkSoft : C.ink, textDecoration: gone ? "line-through" : "none", opacity: gone ? 0.6 : 1 }}>{nm}</span>
                {gone && <span style={{ fontSize: 11.5, color: C.raspberry, fontWeight: 700 }}>вышел</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: gone ? C.inkSoft : C.goldDeep, opacity: gone ? 0.6 : 1 }}>{scores[i] || 0}</span>
                {!gone && roomPid(nm) && (
                  <button onClick={() => leaveByHost(nm)} title="Отметить, что игрок вышел из игры" style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "3px 9px", color: C.raspberry, fontSize: 11.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>вышел</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ ...pHint, marginTop: 8 }}>Ушедшие со следующего раунда не получают роли и не крутятся в очереди детективов. Кнопка «вышел» — страховка, если у игрока не нажалось.</p>
    </Block>
  ) : null;

  const questionListCard = rd0 && rd0.witAName ? (
    <Block stripe={C.goldDeep}>
      <QuestionGrid asked={rd0.asked || []} witA={rd0.witAName} witB={rd0.witBName} ans={v.answers} />
    </Block>
  ) : null;

  // === ЦЕНТР — то, чем руковожу (крупно) ===
  const actionsCard = (
    <Block stripe={C.goldDeep}>
      <h2 style={{ ...h2, fontSize: wide ? 20 : 17 }}>Вопросы детективов</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: wide ? 17 : 15 }}>Круг {circle} / 3</span>
        <span style={{ color: C.inkSoft, fontSize: wide ? 16 : 14 }}>Вопрос {qCount} / 27</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            width: wide ? 26 : 22, height: wide ? 26 : 22, borderRadius: "50%",
            background: i < dotsFilled ? C.goldDeep : C.card,
            border: `2px solid ${i < dotsFilled ? C.goldDeep : C.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: "#fff", fontWeight: 700,
          }}>{i < dotsFilled ? "✓" : ""}</div>
        ))}
      </div>

      {rd0 && rd0.witAName && (
        <div style={{ marginBottom: 14 }}>
          <QuestionFeed asked={rd0.asked || []} witA={rd0.witAName} witB={rd0.witBName} wide={wide} ans={v.answers} />
        </div>
      )}

      {pendingOwn && !solved && (
        <div style={{ background: C.goldSoft, border: `2px solid ${C.goldDeep}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: wide ? 18 : 15.5, color: C.ink, marginBottom: 8 }}>
            ✍️ Свой вопрос — <span style={{ color: C.goldDeep }}>{pendingOwn.byName}</span> задаёт голосом
          </div>
          <div style={{ fontSize: wide ? 15 : 13, color: C.inkSoft, marginBottom: 10 }}>
            ✅ если вопрос грамматически правильный, понятный и не повтор из списка.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn big={wide} bg={C.emerald} onClick={() => approveOwn(true)}>✅ Принять (+2)</Btn>
            <Btn big={wide} bg={C.raspberry} onClick={() => approveOwn(false)}>❌ Не засчитан (0)</Btn>
          </div>
        </div>
      )}

      {/* --- Шаг 5: называние глагола --- */}
      {roundConnected && !solved && guessSrv && guessSrv.stage === "voting" && (
        <div style={{ background: C.cream, border: `2px solid ${C.goldDeep}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: wide ? 18 : 15.5, color: C.goldDeep, marginBottom: 4 }}>
            🗳 Тайное голосование «Верю A / B» — {votedCount}/{votersNeed}
          </div>
          <div style={{ fontSize: wide ? 15 : 13, color: C.inkSoft, marginBottom: 8 }}>
            {guessSrv.byName ? `Слово у ${guessSrv.byName} — назовёт глагол после голосования.` : "Финал раунда: после голосования — вскрытие."} Детективы голосуют на своих пультах.
          </div>
          <button onClick={forceVotes} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "4px 12px", color: C.inkSoft, fontSize: 12, cursor: "pointer", fontFamily: SERIF }}>
            ⏭ Закрыть голосование без отстающих (чей-то пульт завис)
          </button>
        </div>
      )}
      {roundConnected && !solved && guessSrv && guessSrv.stage === "naming" && (
        <div style={{ background: C.goldSoft, border: `2px solid ${C.goldDeep}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: wide ? 19 : 16, color: C.ink, marginBottom: 6 }}>
            🎤 <span style={{ color: C.goldDeep }}>{guessSrv.byName}</span> называет глагол голосом. Верный — <b>{v.inf}</b>?
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn big={wide} bg={C.emerald} onClick={() => sendVerdict(true)}>✅ Верный — вскрытие и очки</Btn>
            <Btn big={wide} bg={C.raspberry} onClick={() => sendVerdict(false)}>❌ Неверный — выбывает</Btn>
          </div>
        </div>
      )}
      {roundConnected && !solved && !guessSrv && (
        <div style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: wide ? 16 : 14, color: C.goldDeep, marginBottom: 6 }}>
            🖐 Готовы назвать глагол {handsSrv.length ? `(${handsSrv.length})` : "— рук пока нет"}
          </div>
          {handsSrv.map((h, i) => (
            <div key={h.by} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: `1px dashed ${C.line}` }}>
              <span style={{ fontWeight: 700, fontSize: wide ? 17 : 14.5 }}>{i + 1}. {h.byName}</span>
              <Btn big={wide} bg={C.gold} style={!wide ? { padding: "6px 12px", fontSize: 13.5 } : {}} onClick={() => giveFloor(h.by)}>🎤 Дать слово</Btn>
            </div>
          ))}
          <div style={{ fontSize: wide ? 13.5 : 12, color: C.inkSoft, marginTop: 7, lineHeight: 1.45 }}>
            Право первой попытки — у задавшего вопрос: он называет глагол голосом, ты жмёшь «Дать слово» на его имени ниже и потом ✅/❌. Молчит — слово первой руке.
          </div>
          {(() => {
            const dets = (rdSrv.roles && rdSrv.roles.detectives) || [];
            const others = dets.filter((pid) => !elimSrv.includes(pid) && !handsSrv.some((h) => h.by === pid));
            if (!others.length) return null;
            return (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: C.inkSoft }}>Дать слово без руки:</span>
                {others.map((pid) => {
                  const p = (room.players || []).find((x) => x.id === pid);
                  return (
                    <button key={pid} onClick={() => giveFloor(pid)} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 99, padding: "4px 12px", color: C.ink, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: SERIF }}>
                      🎤 {p ? p.name : "?"}
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {!solved && (
        <>
          <div style={{ fontSize: wide ? 16 : 14, color: C.inkSoft, marginBottom: 6 }}>Сейчас спрашивает:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {detectives.map((d) => {
              const elim = roundConnected && elimSrv.includes(roomPid(players[d]));
              const on = d === activeDetective && !elim;
              return (
                <div key={d} style={{
                  padding: wide ? "10px 18px" : "8px 14px", borderRadius: 999, fontWeight: on ? 700 : 500, fontSize: wide ? 17 : 14.5,
                  background: on ? C.gold : C.cream, color: on ? "#fff" : C.inkSoft,
                  border: `1.5px solid ${on ? C.goldDeep : C.line}`,
                  textDecoration: elim ? "line-through" : "none", opacity: elim ? 0.55 : 1,
                }}>{elim ? "❌ " : on ? "▶ " : ""}{players[d]}</div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn big={wide} bg={C.goldDeep} onClick={addQuestion} disabled={qCount >= 27 || !!guessSrv}>{roundConnected ? "+ Вопрос голосом (без пульта)" : "+ Вопрос задан"}</Btn>
            <Btn big={wide} bg={C.gold} onClick={passTurn} disabled={!!guessSrv} title="Если детектив завис или пропускает — двигаем очередь без вопроса">↷ Передать ход</Btn>
            {!roundConnected && <Btn big={wide} bg={C.emerald} onClick={() => setAskWho(true)}>✔ Глагол угадан</Btn>}
            {!roundConnected && qCount >= 27 && <Btn big={wide} bg={C.raspberry} onClick={nobody}>Никто не угадал</Btn>}
            {roundConnected && !guessSrv && <Btn big={wide} bg={qCount >= 27 ? C.raspberry : "#B0A48C"} onClick={endRoundSrv} title="Голосование (если ещё не было) → вскрытие глагола → очки свидетелям">🏁 Завершить раунд</Btn>}
          </div>
          <div style={{ fontSize: wide ? 13.5 : 12, color: C.inkSoft, marginTop: 7, lineHeight: 1.45 }}>
            «+ Вопрос» — если вопрос прозвучал голосом мимо пультов. «↷ Передать ход» — детектив завис или пропускает. «🏁 Завершить раунд» — вопросы кончились / никто не угадывает.
          </div>

          {askWho && (
            <div style={{ marginTop: 12, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                Кто угадал? (круг {circle} → детектив +{circle === 1 ? 5 : circle === 2 ? 3 : 1}
                {circle > 1 ? `, свидетели +${circle === 2 ? 3 : 6}` : ", свидетели 0"})
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {detectives.map((d) => (
                  <Btn key={d} bg={C.emerald} onClick={() => detectiveGuessed(d)}>{players[d]}</Btn>
                ))}
                <Btn bg="#B0A48C" onClick={() => setAskWho(false)}>Отмена</Btn>
              </div>
            </div>
          )}
        </>
      )}
      {solved && (
        <div style={{ color: C.emeraldDeep, fontWeight: 600, fontSize: wide ? 17 : 15 }}>
          Раунд закрыт. Жми «→ Следующий раунд» ниже.
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn big={wide} bg={solved ? C.emerald : C.goldDeep} onClick={nextRound} style={{ flex: 1, minWidth: 200 }}>
          → Следующий раунд
        </Btn>
        <Btn big={wide} bg={C.raspberry} onClick={finishGame} title="Завершить игру и показать итоговую таблицу — раундов столько, сколько решишь">
          🏁 Завершить игру → итоги
        </Btn>
      </div>
    </Block>
  );

  // --- раскладка: широкий экран = 3 зоны, узкий = колонка ---
  if (wide) {
    return (
      <div style={wrap}><div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <Header round={round + 1} circle={circle} />
        {bannerEl}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(440px, 1.55fr) minmax(300px, 1fr)", gap: 18, alignItems: "start" }}>
          <div>{verbCard}{dossierCard}{storyCard}</div>
          <div>{actionsCard}</div>
          <div>{prepEl}{rolesCard}{scoreCard}{composicionCard}</div>
        </div>
        <Footer onReset={resetAll} />
      </div></div>
    );
  }
  return (
    <div style={wrap}><div style={maxw}>
      <Header round={round + 1} circle={circle} />
      {bannerEl}
      {prepEl}
      {verbCard}
      {rolesCard}
      {dossierCard}
      {actionsCard}
      {storyCard}
      {scoreCard}
      {composicionCard}
      {questionListCard}
      <Footer onReset={resetAll} />
    </div></div>
  );
}

// ---------- мелкие компоненты ----------
function Header({ round, circle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 12, letterSpacing: "2px", color: C.goldDeep, fontWeight: 600 }}>LA CIUDAD DE LOS SENTIDOS</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, fontFamily: SERIF }}>La Cata a Ciegas · Пульт ведущего</div>
      {round && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>Раунд {round} · Круг {circle}/3</div>}
    </div>
  );
}
function Footer({ onReset }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <button onClick={onReset} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 13, textDecoration: "underline", cursor: "pointer", fontFamily: SERIF }}>
        Сбросить игру
      </button>
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 8 }}>La Ciudad de los Sentidos 🍬 · v2.13</div>
    </div>
  );
}
function StoryBlock({ v, wide }) {
  const [open, setOpen] = useState(false);
  return (
    <Block stripe={C.gold}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ ...h2, margin: 0 }}>📖 Mini-historia <span style={{ fontWeight: 400, fontSize: 13, color: C.inkSoft }}>(leer una vez)</span></h2>
        <span style={{ color: C.goldDeep, fontWeight: 700, fontSize: 16 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <p style={{ fontSize: wide ? 16.5 : 14.5, lineHeight: 1.7, margin: "12px 0 0" }}><Highlighted text={v.storyEs} /></p>}
    </Block>
  );
}
function RoleLine({ color, label, name }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
      <span style={{ background: color, color: "#fff", fontSize: 12, borderRadius: 6, padding: "2px 8px", fontWeight: 600, minWidth: 78, textAlign: "center" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{name || "—"}</span>
    </div>
  );
}
function RolesPreview({ players, order, chosen, filledIdxs }) {
  const filled = filledIdxs || players.map((p, i) => (p.trim() ? i : -1)).filter((i) => i >= 0);
  if (filled.length < 3 || chosen.length < 2) {
    return <p style={pHint}>Заполни 3–7 имён и выбери минимум 2 глагола, чтобы увидеть раскладку.</p>;
  }
  // порядок ротации: распределённый, если он по тому же составу; иначе по списку
  const ord = order.length === filled.length && filled.every((i) => order.includes(i)) ? order : filled;
  const rounds = ord.length; // один полный круг ролей
  return (
    <div style={{ marginTop: 6, fontSize: 13, overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 420 }}>
        <thead>
          <tr>
            <th style={th}>Раунд</th><th style={th}>Глагол</th>
            <th style={{ ...th, color: C.emerald }}>Канон</th>
            <th style={{ ...th, color: C.raspberry }}>Фантазия</th>
            <th style={{ ...th, color: C.goldDeep }}>Детективы</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rounds }).map((_, r) => {
            const { canon, fantasy, detectives } = rolesForRound(ord, r);
            const v = VERBS.find((x) => x.key === chosen[r % chosen.length]);
            return (
              <tr key={r}>
                <td style={td}>{r + 1}</td>
                <td style={{ ...td, fontWeight: 600 }}>{v ? `${v.emoji} ${v.inf}` : "—"}</td>
                <td style={td}>{players[canon]}</td>
                <td style={td}>{players[fantasy]}</td>
                <td style={td}>{detectives.map((d) => players[d]).join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ ...pHint, marginTop: 6 }}>Это один полный круг ролей. Дальше роли продолжают крутиться, раундов — сколько решишь.</p>
    </div>
  );
}
function MsgBox({ title, text, onCopy, copied }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        <button onClick={onCopy} style={{ background: copied ? C.emerald : C.gold, color: "#fff", border: "none", borderRadius: 7, padding: "4px 10px", fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>
          {copied ? "Скопировано ✓" : "Копировать"}
        </button>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: SERIF, fontSize: 13.5, margin: 0, color: C.inkSoft, lineHeight: 1.5 }}>{text}</pre>
    </div>
  );
}

function QuestionFeed({ asked, witA, witB, wide, ans }) {
  const fs = wide ? 15 : 13;
  if (!asked.length) return (
    <div style={{ background: C.cream, border: `1px dashed ${C.line}`, borderRadius: 10, padding: "9px 12px", fontSize: fs, color: C.inkSoft, marginBottom: 10 }}>
      Лента вопросов пуста — детективы ещё не спрашивали со своих пультов.
    </div>
  );
  return (
    <div style={{ background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", marginBottom: 10, maxHeight: wide ? 300 : 190, overflowY: "auto" }}>
      {[...asked].map((a, i) => ({ ...a, n: i + 1 })).reverse().map((a) => (
        <div key={a.n} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: `1px dashed ${C.line}`, fontSize: fs, alignItems: "baseline", flexWrap: "wrap" }}>
          <span style={{ color: C.goldDeep, fontWeight: 700, flexShrink: 0 }}>#{a.n}</span>
          <span style={{ flexShrink: 0, fontWeight: 700 }}>🕵️ {a.byName}</span>
          {a.to && <span style={{ flexShrink: 0, background: C.goldSoft, borderRadius: 6, padding: "0 7px", fontWeight: 700 }}>→ {a.to} · {a.to === "A" ? witA : witB}</span>}
          <span style={{ color: C.inkSoft, minWidth: 0 }}>{a.text}</span>
          <CanonAns ans={ans} qid={a.qid} />
        </div>
      ))}
    </div>
  );
}
// Ответ Канона (правда) для вопроса из списка — подсказка только для ведущей
function CanonAns({ ans, qid, compact }) {
  const a = ans && qid ? ans[qid] : null;
  if (!a) return null;
  const si = a === "sí";
  return (
    <span style={{ flexShrink: 0, border: `1.5px solid ${C.emerald}`, color: si ? "#fff" : C.emeraldDeep, background: si ? C.emerald : C.card, borderRadius: 6, padding: compact ? "0 6px" : "1px 8px", fontWeight: 800, fontSize: compact ? 11 : 12 }}>
      {compact ? (si ? "SÍ" : "NO") : (si ? "Канон: SÍ" : "Канон: NO")}
    </span>
  );
}

// Полноэкранная доска вопросов (wide-режим): всегда раскрыта, категории в 3 колонки
function QuestionBoard({ asked, witA, witB, ans }) {
  const mark = (qid, w) => asked.some((a) => a.qid === qid && a.to === w);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <h2 style={{ ...h2, margin: 0 }}>📋 Список вопросов · гашение по A и B</h2>
        <span style={{ fontSize: 13, color: C.inkSoft }}>
          <b style={{ color: C.goldDeep }}>A</b> — {witA} · <b style={{ color: C.goldDeep }}>B</b> — {witB} · золотая метка = вопрос задан · зелёный SÍ/NO = правильный ответ Канона
        </span>
      </div>
      <div style={{ columnCount: 3, columnGap: 22 }}>
        {CATS.map((c) => (
          <div key={c.id} style={{ breakInside: "avoid", marginBottom: 14, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.goldDeep, margin: "2px 0 6px" }}>{c.icon} {c.es}</div>
            {QUESTIONS.filter((q) => q.cat === c.id).map((q) => {
              const a = mark(q.id, "A"), b = mark(q.id, "B");
              return (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 14.5, borderBottom: `1px dashed ${C.line}` }}>
                  <span style={{ flex: 1, color: a && b ? C.inkSoft : C.ink, textDecoration: a && b ? "line-through" : "none" }}>{q.q}</span>
                  <CanonAns ans={ans} qid={q.id} compact />
                  {[["A", a], ["B", b]].map(([L, on]) => (
                    <span key={L} style={{ width: 28, textAlign: "center", borderRadius: 6, fontWeight: 800, fontSize: 12.5, padding: "3px 0", background: on ? C.goldDeep : C.card, color: on ? "#fff" : C.inkSoft, border: `1px solid ${on ? C.goldDeep : C.line}` }}>{L}</span>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionGrid({ asked, witA, witB, ans }) {
  const [open, setOpen] = useState(false);
  const mark = (qid, w) => asked.some((a) => a.qid === qid && a.to === w);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "9px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", background: C.goldSoft }}>
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>📋 Список вопросов · гашение по A и B</span>
        <span style={{ color: C.goldDeep, fontWeight: 700 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && CATS.map((c) => (
        <div key={c.id} style={{ padding: "6px 12px", borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.goldDeep, margin: "4px 0" }}>{c.icon} {c.es}</div>
          {QUESTIONS.filter((q) => q.cat === c.id).map((q) => {
            const a = mark(q.id, "A"), b = mark(q.id, "B");
            return (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 12.5 }}>
                <span style={{ flex: 1, color: a && b ? C.inkSoft : C.ink, textDecoration: a && b ? "line-through" : "none" }}>{q.q}</span>
                <CanonAns ans={ans} qid={q.id} compact />
                {[["A", a, witA], ["B", b, witB]].map(([L, on, name]) => (
                  <span key={L} title={`Свидетель ${L} · ${name}`} style={{ width: 26, textAlign: "center", borderRadius: 6, fontWeight: 800, fontSize: 11.5, padding: "2px 0", background: on ? C.goldDeep : C.cream, color: on ? "#fff" : C.inkSoft, border: `1px solid ${on ? C.goldDeep : C.line}` }}>{L}</span>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------- стили ----------
const h2 = { fontSize: 17, fontWeight: 700, margin: "0 0 4px", color: C.ink };
const pHint = { fontSize: 13, color: C.inkSoft, margin: "4px 0 0", lineHeight: 1.5 };
const Label = ({ children }) => <div style={{ fontSize: 13, fontWeight: 600, color: C.goldDeep, marginBottom: 6, letterSpacing: ".3px" }}>{children}</div>;
const inp = { width: "100%", boxSizing: "border-box", padding: "10px 12px", marginBottom: 8, borderRadius: 9, border: `1.5px solid ${C.line}`, fontSize: 15, fontFamily: SERIF, color: C.ink, background: C.card };
const tag = { fontSize: 11.5, letterSpacing: ".5px", color: C.goldDeep, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 };
const th = { textAlign: "left", padding: "6px 8px", borderBottom: `2px solid ${C.line}`, fontSize: 12, fontWeight: 700 };
const td = { padding: "6px 8px", borderBottom: `1px solid ${C.line}`, fontSize: 12.5 };

