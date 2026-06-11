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
  },
  {
    key: "caminar", emoji: "🚶", inf: "caminar", ru: "идти / гулять", scene: "Escena 2",
    storyEs: "Después del desayuno, el Gran Jefe Alcalde **camina** por los pasillos del Palacio de Caramelo. Él **camina** despacio, con las manos detrás de la espalda. El Jefe **camina** cada mañana exactamente veinte minutos. Mientras **camina**, encuentra una idea nueva.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Camina"], ["¿Dónde?", "Por los pasillos del palacio"], ["¿Cuándo?", "Cada mañana, después del desayuno"], ["¿Con quién?", "Solo"], ["¿Cómo camina?", "Despacio, con las manos detrás de la espalda"], ["¿Cuánto dura?", "Exactamente veinte minutos"], ["¿Y después?", "Llega una idea nueva"]],
  },
  {
    key: "cantar", emoji: "🎵", inf: "cantar", ru: "петь", scene: "Escena 3",
    storyEs: "Cada mañana, a las siete en punto, los tres ayudantes del Jefe se reúnen en la Cocina Mágica. Ellos siempre **cantan** juntos una canción de trabajo. Mientras **cantan**, el caramelo en las ollas comienza a brillar más fuerte. El Jefe escucha desde su despacho y sonríe.",
    dossier: [["¿Quién?", "Los tres ayudantes del Jefe"], ["¿Qué hacen?", "Cantan"], ["¿Dónde?", "En la Cocina Mágica"], ["¿Cuándo?", "Cada mañana, a las siete en punto"], ["¿Con quién?", "Los tres juntos"], ["¿Qué cantan?", "«La melodía del caramelo dorado»"], ["¿Cuánto dura?", "Exactamente 5 minutos"], ["¿Qué pasa a la vez?", "El caramelo en las ollas brilla más fuerte"], ["¿Quién escucha?", "El Jefe, desde su despacho"]],
  },
  {
    key: "mirar", emoji: "👁", inf: "mirar", ru: "смотреть", scene: "Escena 4",
    storyEs: "Desde la terraza del Palacio, el Gran Jefe Alcalde **mira** la ciudad cada mañana. Él **mira** con calma, sin prisa. Hoy **mira** las nubes, **mira** los ayudantes que caminan por el mercado, **mira** el río de caramelo. Cuando **mira** así, en silencio, entiende todo lo que necesita.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Mira"], ["¿Dónde?", "Desde la terraza del palacio"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Solo, en silencio"], ["¿Qué mira?", "Las nubes, los ayudantes, el río de caramelo"], ["¿Cómo mira?", "Con calma, sin prisa"], ["¿Y después?", "Entiende todo lo que necesita para el día"]],
  },
  {
    key: "buscar", emoji: "🔍", inf: "buscar", ru: "искать", scene: "Escena 5",
    storyEs: "Cada mañana, después de mirar la ciudad, el Jefe **busca** ideas nuevas para el menú. Él **busca** en su libro de recetas. Hoy **busca** un ingrediente especial — algo que nunca ha usado. **Busca** en los armarios dorados, **busca** en las cajas secretas del sótano. Al final lo encuentra.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Busca"], ["¿Qué busca?", "Un ingrediente especial, nuevo"], ["¿Dónde busca?", "El libro de recetas, los armarios, las cajas del sótano"], ["¿Cuándo?", "Cada mañana, después de mirar la ciudad"], ["¿Con quién?", "Solo"], ["¿Cómo termina?", "Siempre encuentra — sabe dónde mirar"]],
  },
  {
    key: "escuchar", emoji: "🎧", inf: "escuchar", ru: "слушать", scene: "Escena 6",
    storyEs: "Cada mañana, después de buscar ideas, el Jefe **escucha** los sonidos del Palacio. Se sienta en su sillón, cierra los ojos y **escucha** en silencio absoluto. Hoy **escucha** el caramelo que burbujea, el viento, los pasos de los ayudantes. **Escucha** durante diez minutos exactos.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Escucha"], ["¿Dónde?", "En su sillón favorito"], ["¿Cuándo?", "Cada mañana, después de buscar ideas"], ["¿Con quién?", "Solo, en silencio absoluto"], ["¿Qué escucha?", "El caramelo que burbujea, el viento, los pasos"], ["¿Cuánto dura?", "Exactamente diez minutos"], ["¿Y después?", "Sabe qué falta en el palacio hoy"]],
  },
  {
    key: "hablar", emoji: "🗣", inf: "hablar", ru: "говорить", scene: "Escena 7",
    storyEs: "El Gran Jefe Alcalde **habla** mucho. **Habla** con sus ayudantes cada mañana en la gran sala. **Habla** claro y despacio. Hoy **habla** sobre el menú especial del día. **Habla** durante quince minutos sin parar. Sus ayudantes escuchan y toman notas.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Habla"], ["¿Dónde?", "En la gran sala del palacio"], ["¿Cuándo?", "Cada mañana"], ["¿Con quién?", "Con sus ayudantes"], ["¿De qué habla?", "Del menú especial del día"], ["¿Cuánto dura?", "Quince minutos sin parar"], ["¿Y los ayudantes?", "Escuchan y toman notas en cuadernos dorados"]],
  },
  {
    key: "preparar", emoji: "👨‍🍳", inf: "preparar", ru: "готовить", scene: "Escena 8",
    storyEs: "Después de hablar con sus ayudantes, el Jefe **prepara** el plato especial del día. Hoy **prepara** una tarta de caramelo con pétalos de azúcar dorado. **Prepara** todo con cuidado, con su cucharón de oro y su varilla de cristal. **Prepara** este plato durante una hora exacta.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Prepara"], ["¿Qué prepara?", "Una tarta de caramelo con pétalos de azúcar dorado"], ["¿Dónde?", "Sobre la mesa de mármol blanco"], ["¿Cuándo?", "Después de hablar con los ayudantes"], ["¿Con quién?", "Solo (los ayudantes observan en silencio)"], ["¿Con qué?", "Cucharón de oro y varilla de cristal"], ["¿Cuánto dura?", "Exactamente una hora"], ["¿Qué hace a la vez?", "Canta en voz baja"]],
  },
  {
    key: "comprar", emoji: "🛒", inf: "comprar", ru: "покупать", scene: "Escena 9",
    storyEs: "Una vez a la semana, el Jefe va al mercado de caramelo a **comprar** ingredientes frescos. **Compra** siempre lo mismo: caramelo líquido, azúcar dorado y especias mágicas. Hoy **compra** algo nuevo — polvo de caramelo plateado. **Compra** con una lista en la mano, rápido y sin dudar.",
    dossier: [["¿Quién?", "El Gran Jefe Alcalde"], ["¿Qué hace?", "Compra"], ["¿Dónde?", "En el mercado de caramelo"], ["¿Cuándo?", "Una vez a la semana"], ["¿Con quién?", "Solo"], ["¿Qué compra normalmente?", "Caramelo líquido, azúcar dorado, especias mágicas"], ["¿Qué compra hoy de nuevo?", "Una bolsa de polvo de caramelo plateado"], ["¿A quién compra?", "Al señor Dulce, en el rincón secreto del mercado"], ["¿Cómo compra?", "Rápido, con una lista en la mano"]],
  },
  {
    key: "trabajar", emoji: "⚙️", inf: "trabajar", ru: "работать", scene: "Escena 10",
    storyEs: "En el Palacio de Caramelo, todos **trabajan** juntos. El Jefe **trabaja** desde las siete de la mañana hasta las tres de la tarde. Hoy todos **trabajan** en el gran banquete del viernes. El Jefe **trabaja** en la cocina; los ayudantes **trabajan** en la sala de decoración.",
    dossier: [["¿Quién?", "El Jefe y todos los ayudantes"], ["¿Qué hacen?", "Trabajan"], ["¿Dónde trabaja el Jefe?", "En la cocina principal"], ["¿Dónde los ayudantes?", "En la sala de decoración"], ["¿Cuándo?", "Hoy — en el banquete del viernes"], ["¿Con quién?", "Todos juntos"], ["¿En qué trabajan?", "Flores de azúcar y velas de caramelo"], ["¿Cuánto dura?", "De las siete a las tres de la tarde"], ["¿Y después?", "El resultado siempre es perfecto"]],
  },
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
  const n = order.length;            // 5
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
          <strong key={i} style={{ color: C.raspberry, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
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

function Btn({ children, onClick, bg = C.gold, color = "#fff", disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#D8CBB4" : bg, color, border: "none", borderRadius: 10,
      padding: "10px 16px", fontSize: 15, fontWeight: 600, cursor: disabled ? "default" : "pointer",
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
  const [order, setOrder] = useState([0, 1, 2, 3, 4]); // player indices
  const [round, setRound] = useState(0); // 0..4
  const [qCount, setQCount] = useState(0); // вопросов задано в текущем раунде (0..27)
  const [scores, setScores] = useState({}); // index -> points
  const [solved, setSolved] = useState(false); // глагол этого раунда раскрыт/угадан
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
  const loaded = useRef(false);

  // загрузка состояния
  useEffect(() => {
    const s = loadState();
    if (s) {
      setPhase(s.phase); setPlayers(s.players); setChosen(s.chosen);
      setOrder(s.order); setRound(s.round); setQCount(s.qCount);
      setScores(s.scores); setSolved(s.solved);
    }
    loaded.current = true;
  }, []);
  // сохранение
  useEffect(() => {
    if (!loaded.current) return;
    saveState({ phase, players, chosen, order, round, qCount, scores, solved });
  }, [phase, players, chosen, order, round, qCount, scores, solved]);

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
    const names = room.players.map((p) => p.name);
    setPlayers([0, 1, 2, 3, 4].map((i) => names[i] || ""));
  }
  // опрос комнаты раз в 2 сек, пока мы в настройке
  useEffect(() => {
    if (!room || phase !== "setup") return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/game?code=${room.code}`);
        const d = await r.json();
        if (d.ok) { setRoom(d.game); localStorage.setItem("host_room_v1", JSON.stringify(d.game)); }
      } catch (e) { /* временный сбой сети — не страшно */ }
    }, 2000);
    return () => clearInterval(t);
  }, [room && room.code, phase]);

  function startPrep() { setPrepLeft(PREP_DEFAULT); setPrepActive(true); }

  // --- Роли на пульты игроков: имя в списке игры → playerId в комнате ---
  function roomPid(name) {
    if (!room || !name) return null;
    const p = (room.players || []).find((x) => x.name.trim().toLowerCase() === String(name).trim().toLowerCase());
    return p ? p.id : null;
  }
  async function pushRoles(roundIdx) {
    if (!room) return; // игра без комнаты — ручной режим, ничего не шлём
    const rr = rolesForRound(order, roundIdx);
    setRolesSent({ n: roundIdx + 1, ok: false, msg: "отправляю..." });
    try {
      const d = await api({
        action: "start_round", code: room.code, round: roundIdx + 1, verbKey: chosen[roundIdx],
        roles: {
          canon: roomPid(players[rr.canon]),
          fantasy: roomPid(players[rr.fantasy]),
          detectives: rr.detectives.map((i) => roomPid(players[i])).filter(Boolean),
        },
      });
      if (d.ok) setRolesSent({ n: roundIdx + 1, ok: true, msg: "" });
      else setRolesSent({ n: roundIdx + 1, ok: false, msg: d.error || "не получилось" });
    } catch (e) { setRolesSent({ n: roundIdx + 1, ok: false, msg: "сеть недоступна" }); }
  }

  const verbByKey = (k) => VERBS.find((v) => v.key === k);
  const curVerb = phase !== "setup" && chosen[round] ? verbByKey(chosen[round]) : null;
  const { canon, fantasy, detectives } = phase !== "setup"
    ? rolesForRound(order, round) : { canon: null, fantasy: null, detectives: [] };

  // текущий круг по числу заданных вопросов
  const circle = qCount < 9 ? 1 : qCount < 18 ? 2 : 3;
  const activeDetective = detectives.length ? detectives[qCount % 3] : null;
  const dotsFilled = qCount - (circle - 1) * 9; // заполнено в текущем круге (0..9)

  function toggleVerb(k) {
    setChosen((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : prev.length < 5 ? [...prev, k] : prev
    );
  }
  function distribute() { setOrder(shuffle([0, 1, 2, 3, 4])); }
  function shuffle(a) { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

  const canStart = players.every((p) => p.trim()) && chosen.length === 5;

  function startGame() {
    const s = {}; players.forEach((_, i) => (s[i] = 0));
    setScores(s); setRound(0); setQCount(0); setSolved(false); setBanner(""); setPhase("game"); startPrep();
    pushRoles(0);
  }

  function addQuestion() {
    if (solved || qCount >= 27) return;
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

  function nextRound() {
    if (round >= 4) { setPhase("final"); return; }
    setRound(round + 1); setQCount(0); setSolved(false); setBanner(""); setTg(null); startPrep();
    pushRoles(round + 1);
  }

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
    setOrder([0, 1, 2, 3, 4]); setRound(0); setQCount(0); setScores({}); setSolved(false); setBanner(""); setTg(null);
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
              <Label>Вошли ({(room.players || []).length}/5)</Label>
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
          <p style={pHint}>5 участников и 5 глаголов из пула. Роли распределит система.</p>

          <div style={{ marginTop: 12 }}>
            <Label>Участники (5)</Label>
            {players.map((p, i) => (
              <input key={i} value={p} placeholder={`Игрок ${i + 1}`}
                onChange={(e) => setPlayers(players.map((x, j) => (j === i ? e.target.value : x)))}
                style={inp} />
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Label>Глаголы раундов — выбрано {chosen.length}/5</Label>
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
                    {v.emoji} {v.inf}{on ? ` · R${idx + 1}` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <Label>Раскладка ролей (превью)</Label>
            <RolesPreview players={players} order={order} chosen={chosen} />
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
              Заполни все 5 имён и выбери ровно 5 глаголов.</p>}
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
            {ranking.map((r, k) => (
              <div key={r.i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", marginBottom: 8, borderRadius: 10,
                background: k === 0 ? C.goldSoft : C.cream,
                border: `1px solid ${k === 0 ? C.gold : C.line}`,
              }}>
                <span style={{ fontWeight: k === 0 ? 700 : 600, fontSize: 17 }}>
                  {k === 0 ? "👑 " : `${k + 1}. `}{players[r.i]}
                </span>
                <span style={{ fontWeight: 700, color: C.raspberry, fontSize: 18 }}>{r.pts}</span>
              </div>
            ))}
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
  return (
    <div style={wrap}><div style={maxw}>
      <Header round={round + 1} circle={circle} />

      {banner && (
        <div style={{
          background: solved ? C.emerald : C.goldSoft, color: solved ? "#fff" : C.ink,
          border: `1px solid ${solved ? C.emeraldDeep : C.gold}`, borderRadius: 12,
          padding: "11px 14px", marginBottom: 14, fontWeight: 600, fontSize: 15,
        }}>{banner}</div>
      )}

      {/* ТАЙМЕР ПОДГОТОВКИ */}
      {prepActive ? (() => {
        const elapsed = PREP_DEFAULT - prepLeft;
        const ready = prepLeft <= PREP_MIN_LEFT; // прошёл минимум 3:00
        const accent = ready ? C.emerald : C.goldDeep;
        return (
          <div style={{
            background: C.card, border: `2px solid ${accent}`, borderRadius: 14,
            padding: "16px 18px", marginBottom: 16, boxShadow: "0 2px 10px rgba(61,43,31,0.10)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.inkSoft, maxWidth: "60%" }}>
                Подготовка свидетелей · открыть глагол, историю и шпаргалку
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, color: accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {fmtTime(prepLeft)}
              </div>
            </div>
            {/* прогресс с отметкой минимума 3:00 */}
            <div style={{ position: "relative", height: 8, background: C.cream, borderRadius: 99, marginTop: 12, overflow: "visible" }}>
              <div style={{ width: `${(elapsed / PREP_DEFAULT) * 100}%`, height: "100%", background: accent, borderRadius: 99, transition: "width 1s linear" }} />
              <div style={{ position: "absolute", left: "60%", top: -3, width: 2, height: 14, background: C.raspberry }} title="mínimo 3:00" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.inkSoft, marginTop: 3 }}>
              <span>0:00</span><span style={{ color: C.raspberry }}>mínimo 3:00</span><span>5:00</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <Btn bg={ready ? C.emerald : C.goldDeep}
                onClick={() => { setPrepActive(false); setBanner("¡Empezamos! Детективы задают вопросы."); }}>
                {ready ? "▶ Начать раунд" : "▶ Начать раньше"}
              </Btn>
              <Btn bg={C.gold} onClick={() => setPrepLeft((s) => Math.min(s + 60, 600))}>+1 мин</Btn>
              <Btn bg="#B0A48C" onClick={() => setPrepActive(false)}>Скрыть</Btn>
            </div>
          </div>
        );
      })() : (
        !solved && (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <button onClick={startPrep} style={{
              background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "6px 14px",
              color: C.goldDeep, fontSize: 13, cursor: "pointer", fontFamily: SERIF, fontWeight: 600,
            }}>⟲ Таймер подготовки (5:00)</button>
          </div>
        )
      )}

      {/* БЛОК 1 — Глагол раунда */}
      <Block stripe={C.gold}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={tag}>Раунд {round + 1} / 5 · только для ведущего</div>
            <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, color: C.ink }}>
              {v.emoji} {v.inf}
            </div>
            <div style={{ color: C.inkSoft, fontSize: 16, fontStyle: "italic" }}>{v.ru}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.6 }}>
          <RoleLine color={C.emerald} label="Канон" name={players[canon]} />
          <RoleLine color={C.raspberry} label="Фантазия" name={players[fantasy]} />
          <RoleLine color={C.goldDeep} label="Детективы" name={detectives.map((d) => players[d]).join(" · ")} />
        </div>
        {room && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: rolesSent && rolesSent.n === round + 1 && rolesSent.ok ? C.emeraldDeep : C.inkSoft }}>
              {rolesSent && rolesSent.n === round + 1
                ? (rolesSent.ok ? "📡 Роли и глагол отправлены на пульты игроков" : `⚠️ Роли не дошли: ${rolesSent.msg}`)
                : "📡 Роли ещё не отправлены на пульты"}
            </span>
            <button onClick={() => pushRoles(round)} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 99, padding: "3px 10px", color: C.goldDeep, fontSize: 12.5, cursor: "pointer", fontFamily: SERIF, fontWeight: 600 }}>↻ Отправить ещё раз</button>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Btn bg={C.emerald} onClick={makeTelegram}>📨 Отправить глагол свидетелям</Btn>
          <Btn bg={C.goldDeep} onClick={nextRound}>{round >= 4 ? "→ К итогам" : "→ Следующий раунд"}</Btn>
        </div>

        {tg && (
          <div style={{ marginTop: 14, background: C.cream, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12 }}>
            <MsgBox title="Свидетелю Канона 🟢" text={tg.canon} onCopy={() => copy(tg.canon, "canon")} copied={copied === "canon"} />
            <MsgBox title="Свидетелю Фантазии 🔴" text={tg.fantasy} onCopy={() => copy(tg.fantasy, "fant")} copied={copied === "fant"} />
            <p style={{ ...pHint, marginTop: 4 }}>Скопируй и отправь каждому в личку Telegram.</p>
          </div>
        )}
      </Block>

      {/* ДОСЬЕ ГЛАГОЛА */}
      <Block stripe={C.raspberry}>
        <h2 style={h2}>Досье · {v.inf}</h2>
        <div style={{
          background: C.raspberry, color: "#fff", borderRadius: 8, padding: "6px 12px",
          display: "inline-block", fontWeight: 700, fontSize: 13.5, marginBottom: 12,
          letterSpacing: ".3px",
        }}>● CANON — solo esto es verdad</div>

        <div style={{ paddingTop: 2 }}>
          {v.dossier.map(([q, a], i) => (
            <div key={i} style={{ display: "flex", padding: "5px 0", borderBottom: i < v.dossier.length - 1 ? `1px dashed ${C.line}` : "none" }}>
              <div style={{ width: 130, flexShrink: 0, color: C.raspberry, fontWeight: 600, fontSize: 14 }}>{q}</div>
              <div style={{ fontSize: 14 }}>{a}</div>
            </div>
          ))}
        </div>
      </Block>

      {/* БЛОК 3 — Вопросы детективов */}
      <Block stripe={C.goldDeep}>
        <h2 style={h2}>Вопросы детективов</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Круг {circle} / 3</span>
          <span style={{ color: C.inkSoft, fontSize: 14 }}>Вопрос {qCount} / 27</span>
        </div>
        {/* 9 точек текущего круга */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: "50%",
              background: i < dotsFilled ? C.goldDeep : C.card,
              border: `2px solid ${i < dotsFilled ? C.goldDeep : C.line}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "#fff", fontWeight: 700,
            }}>{i < dotsFilled ? "✓" : ""}</div>
          ))}
        </div>

        {!solved && (
          <>
            <div style={{ fontSize: 14, color: C.inkSoft, marginBottom: 6 }}>Сейчас спрашивает:</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {detectives.map((d) => {
                const on = d === activeDetective;
                return (
                  <div key={d} style={{
                    padding: "8px 14px", borderRadius: 999, fontWeight: on ? 700 : 500, fontSize: 14.5,
                    background: on ? C.gold : C.cream, color: on ? "#fff" : C.inkSoft,
                    border: `1.5px solid ${on ? C.goldDeep : C.line}`,
                  }}>{on ? "▶ " : ""}{players[d]}</div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn bg={C.goldDeep} onClick={addQuestion} disabled={qCount >= 27}>+ Вопрос задан</Btn>
              <Btn bg={C.emerald} onClick={() => setAskWho(true)}>✔ Глагол угадан</Btn>
              {qCount >= 27 && <Btn bg={C.raspberry} onClick={nobody}>Никто не угадал</Btn>}
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
          <div style={{ color: C.emeraldDeep, fontWeight: 600 }}>
            Раунд закрыт. Нажми «Следующий раунд» вверху.
          </div>
        )}
      </Block>

      {/* МИНИ-ИСТОРИЯ (предпоследний блок, свёрнута по умолчанию) */}
      <StoryBlock v={v} />

      {/* БЛОК 4 — Счёт */}
      <Block stripe={C.emerald}>
        <h2 style={h2}>Счёт <span style={{ fontWeight: 400, fontSize: 13, color: C.inkSoft }}>· копится через все 5 раундов</span></h2>
        {order.map((i) => {
          const role = i === canon ? ["Канон", C.emerald] : i === fantasy ? ["Фантазия", C.raspberry] : ["Детектив", C.goldDeep];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${C.line}` }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{players[i]}</div>
                <span style={{ fontSize: 12, color: "#fff", background: role[1], borderRadius: 6, padding: "1px 7px" }}>{role[0]}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: C.raspberry, minWidth: 34, textAlign: "right" }}>{scores[i] || 0}</span>
                {[5, 3, 1, -1].map((p) => (
                  <button key={p} onClick={() => manual(i, p)} style={{
                    width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${p < 0 ? C.raspberry : C.line}`,
                    background: C.card, color: p < 0 ? C.raspberry : C.ink, fontWeight: 700, fontSize: 13,
                    cursor: "pointer", fontFamily: SERIF,
                  }}>{p > 0 ? `+${p}` : p}</button>
                ))}
              </div>
            </div>
          );
        })}
        <p style={{ ...pHint, marginTop: 8 }}>Кнопки +5 / +3 / +1 / −1 — ручная корректировка ведущим.</p>
      </Block>

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
      {round && <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>Раунд {round}/5 · Круг {circle}/3</div>}
    </div>
  );
}
function Footer({ onReset }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <button onClick={onReset} style={{ background: "none", border: "none", color: C.inkSoft, fontSize: 13, textDecoration: "underline", cursor: "pointer", fontFamily: SERIF }}>
        Сбросить игру
      </button>
      <div style={{ fontSize: 12, color: C.goldDeep, marginTop: 8 }}>La Ciudad de los Sentidos 🍬</div>
    </div>
  );
}
function StoryBlock({ v }) {
  const [open, setOpen] = useState(false);
  return (
    <Block stripe={C.gold}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ ...h2, margin: 0 }}>📖 Mini-historia · {v.scene} <span style={{ fontWeight: 400, fontSize: 13, color: C.inkSoft }}>(leer una vez)</span></h2>
        <span style={{ color: C.goldDeep, fontWeight: 700, fontSize: 16 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: "12px 0 0" }}><Highlighted text={v.storyEs} /></p>}
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
function RolesPreview({ players, order, chosen }) {
  if (!players.every((p) => p.trim()) || chosen.length !== 5) {
    return <p style={pHint}>Заполни имена и выбери 5 глаголов, чтобы увидеть раскладку.</p>;
  }
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
          {chosen.map((k, r) => {
            const { canon, fantasy, detectives } = rolesForRound(order, r);
            const v = VERBS.find((x) => x.key === k);
            return (
              <tr key={r}>
                <td style={td}>{r + 1}</td>
                <td style={{ ...td, fontWeight: 600 }}>{v.emoji} {v.inf}</td>
                <td style={td}>{players[canon]}</td>
                <td style={td}>{players[fantasy]}</td>
                <td style={td}>{detectives.map((d) => players[d]).join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

// ---------- стили ----------
const h2 = { fontSize: 17, fontWeight: 700, margin: "0 0 4px", color: C.ink };
const pHint = { fontSize: 13, color: C.inkSoft, margin: "4px 0 0", lineHeight: 1.5 };
const Label = ({ children }) => <div style={{ fontSize: 13, fontWeight: 600, color: C.goldDeep, marginBottom: 6, letterSpacing: ".3px" }}>{children}</div>;
const inp = { width: "100%", boxSizing: "border-box", padding: "10px 12px", marginBottom: 8, borderRadius: 9, border: `1.5px solid ${C.line}`, fontSize: 15, fontFamily: SERIF, color: C.ink, background: C.card };
const tag = { fontSize: 11.5, letterSpacing: ".5px", color: C.goldDeep, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 };
const th = { textAlign: "left", padding: "6px 8px", borderBottom: `2px solid ${C.line}`, fontSize: 12, fontWeight: 700 };
const td = { padding: "6px 8px", borderBottom: `1px solid ${C.line}`, fontSize: 12.5 };
