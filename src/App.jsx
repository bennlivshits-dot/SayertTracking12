import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import logoImg from "./assets/logo.png";
import sayeretWings from "./assets/units/sayeret_wings.jpg";
import shayetetWings from "./assets/units/shayetet_wings.jpg";
import shaldagWings from "./assets/units/shaldag_wings.jpg";
import unit669Wings from "./assets/units/669_wings.jpg";
import chovlimWings from "./assets/units/chovlim_wings.jpg";
import tayasWings from "./assets/units/tayas_wings.jpg";
import maglanWings from "./assets/units/maglan_wings.jpg";
import duvdevanWings from "./assets/units/duvdevan_wings.jpg";
import agozWings from "./assets/units/agoz_wings.jpg";
import okatzWings from "./assets/units/okatz_wings.jpg";
import yahalomWings from "./assets/units/yahalom_wings.jpg";
import tzanhanimWings from "./assets/units/tzanhanim_wings.jpg";
import submarinesWings from "./assets/units/submarines_wings.jpg";
import unit504Wings from "./assets/units/unit504_wings.jpg";
import coralWings from "./assets/units/coral_wings.jpg";
import lotarWings from "./assets/units/lotar_wings.jpg";
import unit5515Wings from "./assets/units/unit5515_wings.jpg";
import yamasWings from "./assets/units/yamas_wings.jpg";
import givatiWings from "./assets/units/givati_wings.jpg";
import golaniWings from "./assets/units/golani_wings.jpg";
import nachalWings from "./assets/units/nachal_wings.jpg";
import kharuvWings from "./assets/units/kharuv_wings.jpg";
import unit5353Wings from "./assets/units/unit5353_wings.jpg";
import unit888Wings from "./assets/units/unit888_wings.jpg";
import yaltamWings from "./assets/units/yaltam_wings.jpg";
import sanfirWings from "./assets/units/sanfir_wings.jpg";
import {
  Home, MessageSquare, BookOpen, User, Shield, Users, ClipboardCheck, Camera, Image as ImageIcon, Copy, ChevronUp, Mic, Edit2, Wind, Anchor, Plane, Footprints, AlertTriangle, Crosshair, Trophy, Activity, Waves, Mail, RefreshCw, Phone,
  TrendingUp, Check, X, Plus, Trash2, Send, Clock, Target, Dumbbell, Award,
  MapPin, ChevronDown, Gauge as GaugeIcon, Zap, BarChart3, Newspaper, Flame, Compass, Eye, EyeOff,
  HeartPulse, Timer, Loader2, ShieldAlert, Siren, CalendarDays, ChevronRight,
  ChevronLeft, CheckCircle2, Lock, LogOut, Heart, Bot, Sparkles, Star, Sun, Moon,
} from "lucide-react";
import {
  SUPABASE_URL as CFG_SUPABASE_URL,
  SUPABASE_ANON_KEY as CFG_SUPABASE_ANON_KEY,
  GEMINI_API_KEY as CFG_GEMINI_API_KEY,
  NETWORK_CODE as CFG_NETWORK_CODE,
} from "./config.js";

// Reads a Vite env var if present (Netlify-style deployment). Returns "" if unset
// or unavailable, so the app degrades to local-storage demo mode instead of
// crashing rather than a blank white screen.
function envVar(name) {
  try {
    return (import.meta.env && import.meta.env[name]) || "";
  } catch (e) {
    return "";
  }
}

// A config.js value counts as "set" only once the placeholder text has actually
// been replaced - this is what makes the app cleanly fall back to local mode
// automatically until real keys are pasted in, instead of trying (and failing)
// to fetch from a URL that's literally the Hebrew placeholder string.
function resolveConfig(envValue, hardcodedValue) {
  if (envValue) return envValue;
  if (hardcodedValue && !hardcodedValue.includes("הדבק_כאן")) return hardcodedValue;
  return "";
}

/**
 * ⚙️ CONFIG — reads from src/config.js (paste your real keys there - the intended
 * setup for GitHub Pages, since Pages serves static files with no env var system).
 * Real environment variables (VITE_*, e.g. on Netlify) take priority if present,
 * so the same code works on either host without edits.
 *
 * ADMIN_INVITE_CODE is intentionally NOT here anymore — see README.md: admin
 * self-signup via a client-side code was a real security gap (anyone reading the
 * bundle could find the code and self-promote). The first admin is now set once,
 * directly in Supabase's SQL editor; every other admin is promoted from inside
 * the app by an existing admin, enforced by RLS — not by a string in the JS bundle.
 */
const CONFIG = {
  GEMINI_API_KEY: resolveConfig(envVar("VITE_GEMINI_API_KEY"), CFG_GEMINI_API_KEY),
  NETWORK_CODE: resolveConfig(envVar("VITE_NETWORK_CODE"), CFG_NETWORK_CODE),
  SUPABASE_URL: resolveConfig(envVar("VITE_SUPABASE_URL"), CFG_SUPABASE_URL),
  SUPABASE_ANON_KEY: resolveConfig(envVar("VITE_SUPABASE_ANON_KEY"), CFG_SUPABASE_ANON_KEY),
};

/* ============================== MOCK / STATIC DATA ============================== */

const UNITS = [
  { id: "sayeret", name: "סיירת מטכ״ל", tagline: "מצוינות וחשיבה מחוץ לקופסה", text: "text-yellow-500", border: "border-yellow-600", hex: "#eab308", req: "ריצת 2 ק״מ מתחת ל-9 דק׳, מבחני מיון פיזיים ומנטליים קשוחים", image: sayeretWings },
  { id: "maglan", name: "מגלן", tagline: "עומק, דיוק וטכנולוגיה", text: "text-red-400", border: "border-red-800", hex: "#ef4444", req: "ניווטים ארוכים, הסוואה, אמל״ח מסווג", image: maglanWings },
  { id: "duvdevan", name: "דובדבן", tagline: "הטמעות ולוחמה בשטח בנוי", text: "text-rose-400", border: "border-rose-700", hex: "#fb7185", req: "לוחמה בשטח בנוי, קור רוח, הטמעות", image: duvdevanWings },
  { id: "agoz", name: "אגוז", tagline: "לוחמת גרילה ושטח פתוח", text: "text-orange-500", border: "border-orange-800", hex: "#f97316", req: "שטח הררי וסבוך, נחישות קיצונית", image: agozWings },
  { id: "shayetet", name: "שייטת 13", tagline: "עבודה תחת קור קיצוני וסוסיות", text: "text-cyan-400", border: "border-cyan-500", hex: "#22d3ee", req: "שחייה ארוכה, צלילה חופשית, עומס נפשי גבוה", image: shayetetWings },
  { id: "shaldag", name: "שלדג", tagline: "קשיחות ושאיפה לטוב ביותר", text: "text-blue-400", border: "border-blue-500", hex: "#60a5fa", req: "ניווט שטח, קפיצות צניחה, כושר גופני עילי", image: shaldagWings },
  { id: "669", name: "יחידה 669", tagline: "עבודה תחת לחץ", text: "text-emerald-400", border: "border-orange-500", hex: "#fb923c", req: "חילוץ הרים, עזרה ראשונה קרבית, סיבולת גבוהה", image: unit669Wings },
  { id: "chovlim", name: "חובלים", tagline: "אתגר אינטלקטואלי ופיזי", text: "text-slate-100", border: "border-slate-300", hex: "#e2e8f0", req: "לימודי פיקוד, ניווט ימי, משמעת גבוהה", image: chovlimWings },
  { id: "tayas", name: "טייס", tagline: "אחריות וזיכרון למופת", text: "text-sky-300", border: "border-sky-400", hex: "#38bdf8", req: "מבדקים פסיכוטכניים, ריכוז גבוה, כושר גופני מלא", image: tayasWings },
  { id: "okatz", name: "עוקץ", tagline: "זיקה לבעלי חיים ועצמאות מוחלטת", text: "text-pink-400", border: "border-pink-600", hex: "#db2777", req: "מיון עוקץ, יכולת עבודה עם כלבים, כושר גופני גבוה", image: okatzWings },
  { id: "yahalom", name: "יהל״ם", tagline: "דיוק כירורגי וקור רוח", text: "text-stone-300", border: "border-stone-500", hex: "#78716c", req: "גיבוש יהל״ם, כוח שריר, עבודה בחללים סגורים", image: yahalomWings },
  { id: "tzanhanim", name: "צנחנים", tagline: "רוח התנדבות וגאוות יחידה", text: "text-red-500", border: "border-red-900", hex: "#991b1b", req: "גיבוש צנחנים, סיבולת ריצה, מסעות ואלונקות", image: tzanhanimWings },
  { id: "submarines", name: "צוללות - שייטת 7", tagline: "חוסן נפשי ועבודת צוות סגורה", text: "text-indigo-400", border: "border-indigo-700", hex: "#1e3a8a", req: "גיבוש חובלים/צוללות, עמידות נפשית למרחב סגור", image: submarinesWings },
  { id: "unit504", name: "יחידה 504", tagline: "אינטליגנציה רגשית ובגרות נפשית", text: "text-violet-400", border: "border-violet-600", hex: "#7c3aed", req: "כושר שטח, שפות זרות, מיונים פסיכולוגיים", image: unit504Wings },
  { id: "coral", name: "יחידת קורל", tagline: "סיווג עמוק ומשמעת ברזל", text: "text-teal-400", border: "border-teal-600", hex: "#14b8a6", req: "כושר חי״ר עילי, עמידה בסיווג ביטחוני גבוה", image: coralWings },
  { id: "lotar", name: "יחידת הלוט״ר", tagline: "הדרכה ודיוק כירורגי", text: "text-zinc-400", border: "border-zinc-600", hex: "#52525b", req: "גיבוש לוט״ר, כוח מתפרץ, זריזות בשטח בנוי", image: lotarWings },
  { id: "unit5515", name: "מלך האריות - 5515", tagline: "ניוד טקטי ונהיגת שטח", text: "text-amber-700", border: "border-amber-800", hex: "#92400e", req: "חוסן ליבה וגב, תפיסה מרחבית גבוהה", image: unit5515Wings },
  { id: "yamas", name: "ימ״ס (מג״ב)", tagline: "היטמעות והסתערבות חשאית", text: "text-green-600", border: "border-green-800", hex: "#15803d", req: "גיבוש ימ״ס, כוח מתפרץ, זחילה וריצה מהירה", image: yamasWings },
  { id: "golani", name: "סיירת גולני", tagline: "רוח לחימה ואחוות לוחמים", text: "text-yellow-700", border: "border-yellow-800", hex: "#a16207", req: "גיבוש היחטיות, מסעות ואלונקות בשטח הררי", image: golaniWings },
  { id: "givati", name: "סיירת גבעתי", tagline: "זריזות וכוח מתפרץ", text: "text-purple-500", border: "border-purple-700", hex: "#9333ea", req: "גיבוש היחטיות, ריצה בדיונות", image: givatiWings },
  { id: "nachal", name: "סיירת נח״ל", tagline: "אינטליגנציה ועבודת צוות", text: "text-green-400", border: "border-green-500", hex: "#4ade80", req: "גיבוש היחטיות, סיבולת שריר וחוסן מנטלי", image: nachalWings },
  { id: "kharuv", name: "סיירת חרוב", tagline: "חדות תגובה ולחימה עירונית", text: "text-lime-800", border: "border-lime-900", hex: "#365314", req: "גיבוש היחטיות, כוח מתפרץ בסמטאות", image: kharuvWings },
  { id: "unit5353", name: "רוכב שמיים - 5353", tagline: "טכנולוגיה ואיסוף מודיעיני", text: "text-red-600", border: "border-red-800", hex: "#b91c1c", req: "גיבוש רוכב שמיים, חוסן גב וליבה", image: unit5353Wings },
  { id: "unit888", name: "היחידה הרב-ממדית - רפאים", tagline: "טכנולוגיה עתידנית וחי״ר", text: "text-indigo-400", border: "border-indigo-500", hex: "#6366f1", req: "כושר סיירת, קליטה טכנולוגית מהירה", image: unit888Wings },
  { id: "yaltam", name: "יחידת ילת״ם", tagline: "הנדסה וצלילה תת-ימית", text: "text-cyan-600", border: "border-cyan-800", hex: "#0e7490", req: "גיבוש חובלים/צוללות, קור רוח במים", image: yaltamWings },
  { id: "sanfir", name: "יחידת סנפיר", tagline: "הגנת נמלים ואקשן ימי", text: "text-sky-500", border: "border-sky-700", hex: "#0284c7", req: "גיבוש סנפיר, שחייה וכושר ימי", image: sanfirWings },
];

const TIERS = ["מתחילים", "מתקדם", "לפני גיבוש", "לפני גיוס"];

// Condensed, per-unit values/character-trait knowledge base - drawn from real
// research on what each unit actually selects and trains for. Used to ground the
// AI advisor's feedback in the specific traits the person's own target unit
// cares about, not generic advice.
const UNIT_VALUES = {
  sayeret: {
    traits: ["יצירתיות ותחבולה מבצעית - חשיבה מחוץ לקופסה", "צניעות וחשאיות מוחלטת - 'שתיקה שווה זהב'", "אינטלקט וזיכרון חזותי גבוהים", "עצמאות בקבלת החלטות תחת בדידות מבצעית", "אדפטציה - שינוי תוכנית תוך כדי תנועה"],
    focus: "דגש חזק על יכולת קוגניטיבית ופתרון בעיות תחת לחץ, לצד עצמאות מוחלטת בקבלת החלטות בשטח.",
  },
  shayetet: {
    traits: ["חוסן מנטלי קיצוני בסביבה עוינת (מים, חושך, קור)", "רעות ודבקות מוחלטת בצמד הלוחמים", "אגרסיביות מבוקרת וקטלנית", "כושר גופני ותפקודי חריג - סיבולת כוח במים ובחול", "רב-גוניות מבצעית: ים, יבשה ואוויר"],
    focus: "המיון הנוקשה ביותר לחוסן נפשי - שילוב מים ותת-קרקע. האמון בבן הזוג הוא אבסולוטי.",
  },
  shaldag: {
    traits: ["דיוק כירורגי בניווט ומיקום", "חשאיות וניידות מהירה - 'נעלם ומכה'", "עבודה בממשק רב-זרועי מול חיל האוויר", "יוזמה אישית - לא מחכים לפקודה", "כוננות מיידית לכל תרחיש"],
    focus: "טעות של מטרים בודדים יכולה להכשיל מבצע - נדרשת דייקנות קיצונית לצד יוזמה עצמאית.",
  },
  "669": {
    traits: ["קדושת החיים - חילוץ בכל מחיר", "תפקוד קר ומדויק בערפל קרב ואנרכיה", "מקצוענות רפואית תחת אש", "אומץ לב מחושב - ניהול פחד, לא היעדרו", "עבודת צוות הטרוגנית עם טייסים ורופאים"],
    focus: "מסכנים חיים באופן מודע כדי להציל אחרים - נדרש ניתוק רגשי מדויק תחת כאוס מוחלט.",
  },
  unit504: {
    traits: ["אינטליגנציה רגשית פנומנלית - קריאת בני אדם", "חוסן פסיכולוגי ויכולת משחק (ורסאטיליות)", "חשיבה אסטרטגית ואנליטית עמוקה", "דיסקרטיות קיצונית ואמינות ברזל", "תושייה ופתרון בעיות בזמן אמת"],
    focus: "המומחיות המרכזית היא ביכולת לגייס ולהפעיל אנשים - אמון, בגרות ואמינות אישית הם תנאי סף.",
  },
  duvdevan: {
    traits: ["הטמעות וחשאיות - יכולת משחק והתחזות מלאה", "מעבר מאפס למאה תוך שבריר שנייה", "קור רוח מוחלט בסביבה עוינת", "זריזות וקטלנות בטווח קצר (לש\"ב)", "עצמאות בצוותים קטנים מאוד"],
    focus: "היכולת להיטמע לחלוטין באוכלוסייה עוינת ואז לעבור מיידית למצב לחימה - בידוד רגשי מוחלט.",
  },
  yahalom: {
    traits: ["מקצוענות טכנית ברמת מדע מדויק (כימיה/פיזיקה)", "עמידות מנטלית ללוחמת מנהרות ותת-קרקע", "דיוק פנאטי - 'הטעות הראשונה היא גם האחרונה'", "תושייה הנדסית לניתוח מלכודים בזמן אמת", "עקשנות ונחישות בעבודה סיזיפית וממושכת"],
    focus: "טעות של מילימטר בטיפול בחומר נפץ היא עניין של חיים ומוות - נדרשת רמת דיוק וקור רוח יוצאי דופן.",
  },
  tzanhanim: {
    traits: ["רוח התנדבות ונכונות בלתי מתפשרת להקרבה", "דבקות במשימה - 'לא חוזרים עד שמבצעים'", "עמידות פיזית ומנטלית לעומק אסטרטגי ללא גיבוי", "משמעת צבאית קשוחה וסטנדרט גבוה", "אחוות לוחמים - אף פצוע לא נשאר מאחור"],
    focus: "התרחיש המרכזי הוא לחימה מנותקת מקווי אספקה - נדרשת נחישות והתמדה גם ללא גיבוי לוגיסטי.",
  },
  tayas: {
    traits: ["ביקורת עצמית פנאטית - תרבות תחקור ללא אגו", "חלוקת קשב ועיבוד מידע קיצוני בזמן אמת", "חוסן מנטלי וויסות רגשי לאורך קורס ארוך", "אינטלקט ותפיסה מרחבית תלת-ממדית גבוהה", "יושרה אישית - דיווח אמת גם על טעות קלה"],
    focus: "היכולת לבקר את עצמך באובייקטיביות מוחלטת ולתפקד תחת ניפוי מתמיד היא הליבה של הקורס.",
  },
  chovlim: {
    traits: ["מנהיגות ופיקוד בסביבה מבודדת בלב ים", "עמידות מנטלית לצפיפות ובידוד ממושך", "מקצוענות טכנולוגית ומערכתית גבוהה", "משמעת עצמית לשגרה סיזיפית שהופכת פתאום לחירום", "עבודת צוות ואמון הדדי אבסולוטי"],
    focus: "אחריות על כלי שיט וחיי אדם רבים בסביבה מבודדת - יציבות נפשית ומנהיגות הן קריטיות.",
  },
  submarines: {
    traits: ["מנהיגות ופיקוד בסביבה מבודדת בלב ים", "עמידות מנטלית לצפיפות ובידוד ממושך", "מקצוענות טכנולוגית ומערכתית גבוהה", "משמעת עצמית לשגרה סיזיפית שהופכת פתאום לחירום", "עבודת צוות ואמון הדדי אבסולוטי"],
    focus: "שהייה ממושכת בחלל סגור ללא אור יום - נדרשת יציבות נפשית שלא מפתחת חיכוכים תחת צפיפות.",
  },
  yamas: {
    traits: ["חוסר עכבות מבצעי וחתירה קיצונית למגע", "משחק והיטמעות מושלמת - סוואה אנושית", "עבודת צוות קרובה עם תלות הדדית עיוורת", "כושר גופני תפקודי חריג תחת בגדים אזרחיים", "מעבר חד בין שגרה מוחלטת ללחימה קיצונית"],
    focus: "פעילות בשטח העוין ביותר - נדרש מעבר מיידי בין 'שיעמום' אזרחי לפעולה קיצונית ברגע אחד.",
  },
  golani: { traits: ["חוסן פיזי ומנטלי סיזיפי", "רעות ואחוות לוחמים - הפלוגה כמשפחה", "דבקות במשימה ללא תנאי", "פשטות וצניעות מבצעית", "משמעת טקטית ועבודת צוות אורגנית"], focus: "הפועל השחור של המלחמה - קושי פיזי מתמשך שמייצר חיבור רגשי עמוק בין הלוחמים." },
  givati: { traits: ["חוסן פיזי ומנטלי סיזיפי", "רעות ואחוות לוחמים - הפלוגה כמשפחה", "דבקות במשימה ללא תנאי", "פשטות וצניעות מבצעית", "משמעת טקטית ועבודת צוות אורגנית"], focus: "הפועל השחור של המלחמה - קושי פיזי מתמשך שמייצר חיבור רגשי עמוק בין הלוחמים." },
  nachal: { traits: ["חוסן פיזי ומנטלי סיזיפי", "רעות ואחוות לוחמים - הפלוגה כמשפחה", "דבקות במשימה ללא תנאי", "פשטות וצניעות מבצעית", "משמעת טקטית ועבודת צוות אורגנית"], focus: "הפועל השחור של המלחמה - קושי פיזי מתמשך שמייצר חיבור רגשי עמוק בין הלוחמים." },
  kharuv: { traits: ["חוסן פיזי ומנטלי סיזיפי", "רעות ואחוות לוחמים - הפלוגה כמשפחה", "דבקות במשימה ללא תנאי", "פשטות וצניעות מבצעית", "משמעת טקטית ועבודת צוות אורגנית"], focus: "הפועל השחור של המלחמה - קושי פיזי מתמשך שמייצר חיבור רגשי עמוק בין הלוחמים." },
  okatz: {
    traits: ["אינטליגנציה רגשית וחיבור עמוק לבעל החיים", "אחריות ובלעדיות מקצועית - מובילים ראשונים בכוח", "אדפטציה חברתית ומבצעית מהירה לכל יחידה", "קור רוח תחת לחץ עצום ליד מטענים", "חוסן גופני מגוון - מתאים עצמו לכל יחידה"],
    focus: "לוחם וכלב כצמד - אחריות על חיי כל הכוח יושבת על קריאת שפת הגוף של הכלב.",
  },
  unit5353: {
    traits: ["חשיבה מערכתית וראייה אסטרטגית רחבה", "טכנולוגיה ודיוק כירורגי בהפעלת אמל\"ח", "ניווט עצמאי בעומק ובדידות מבצעית", "משמעת מבצעית ואורך רוח לתצפיות ארוכות", "רב-זרועיות ושיתוף פעולה עם חיל האוויר"],
    focus: "פעולה בעומק שטח האויב ללא הגנה היקפית - משמעת ברזל וסבלנות קריטיות להצלחה.",
  },
};
function getUnitValues(unitId) {
  return UNIT_VALUES[unitId] || null;
}

// Restricted unit list for the independent-trainee signup flow - only these 8,
// reusing the matching full-unit objects where one exists so colors/hex/tagline
// stay consistent app-wide, with one custom entry (חי"ר) since no exact match exists.
const INDIVIDUAL_UNITS = [
  UNITS.find((u) => u.id === "sayeret"),
  UNITS.find((u) => u.id === "shayetet"),
  { ...UNITS.find((u) => u.id === "chovlim"), name: "קורס חובלים" },
  { ...UNITS.find((u) => u.id === "tayas"), name: "קורס טיס" },
  { ...UNITS.find((u) => u.id === "yamas"), name: "ימ״ס / דובדבן" },
  { id: "chir", name: "חי״ר", tagline: "עמוד השדרה הקרבי", text: "text-orange-400", border: "border-orange-700", hex: "#c2410c", req: "כושר קרבי בסיסי גבוה, מסעות ונשיאת ציוד" },
  UNITS.find((u) => u.id === "shaldag"),
  UNITS.find((u) => u.id === "669"),
];

const GIBUSH_TYPES = [
  "גיבוש מטכ\"ל", "גיבוש שייטת", "גיבוש חובלים", "גיבוש טיס",
  "גיבוש יחטיות", "גיבוש ימ\"ס", "יום סיירות", "גיבושון 669",
];
// A "לפני גיוס" (pre-draft) trainee hasn't earned any gibush eligibility yet, except
// for the general infantry-track gibush ("גיבוש יחטיות") - and only if their stated
// target is one of the six track brigades. Everyone else (post-draft, or pre-draft
// with no matching target) sees the full list unrestricted.
const YECHTIYOT_TRACK_UNITS = ["golani", "givati", "nachal", "tzanhanim", "kharuv", "yamas"];
function allowedGibushTypes(profile) {
  if (profile?.level !== "לפני גיוס") return GIBUSH_TYPES;
  if (YECHTIYOT_TRACK_UNITS.includes(profile?.targetUnit)) return ["גיבוש יחטיות"];
  return [];
}

// Per-type color: hex is the primary accent, hex2 (when present) is the secondary
// tone for a two-color glow, matching the exact pairs given.
const GIBUSH_TYPE_COLORS = {
  "גיבוש מטכ\"ל": { hex: "#d4af37", name: "זהב" },              // זהב
  "יום סיירות": { hex: "#c0c0c0", name: "כסף" },                // כסף
  "גיבוש טיס": { hex: "#f8fafc", hex2: "#e2e8f0", name: "לבן" }, // לבן חלק מיוחד
  "גיבוש שייטת": { hex: "#2563eb", name: "כחול" },               // כחול
  "גיבוש חובלים": { hex: "#22d3ee", name: "תכלת" },              // תכלת
  "גיבוש ימ\"ס": { hex: "#dc2626", name: "אדום" },                // אדום
  "גיבוש יחטיות": { hex: "#f97316", name: "כתום" },              // כתום
  "גיבושון 669": { hex: "#9333ea", name: "סגול" },               // סגול
};

const HEALTH_OPTIONS = ["ברכיים", "גב תחתון", "קרסוליים", "אסטמה / נשימה", "בעיות לב", "אחר"];

// Starts empty on purpose — real articles/training content will be managed via Supabase later.
const INITIAL_ARTICLES = [];

const TRAINING_BANK = [
  { id: "כושר קרבי כללי", title: "כושר קרבי כללי", icon: Timer, color: "text-lime-500", bg: "bg-lime-500/15", group: "כושר קרבי", items: [] },
  { id: "יום סיירות", title: "יום סיירות", icon: Target, color: "text-orange-400", bg: "bg-orange-500/15", group: "כושר קרבי", items: [] },
  { id: "מטכ\"ל", title: "מטכ״ל", icon: Shield, color: "text-yellow-400", bg: "bg-yellow-500/15", group: "כושר קרבי", items: [] },
  { id: "שייטת", title: "שייטת", icon: Award, color: "text-cyan-400", bg: "bg-cyan-500/15", group: "כושר קרבי", items: [] },
  { id: "חובלים", title: "חובלים", icon: Award, color: "text-blue-400", bg: "bg-blue-500/15", group: "כושר קרבי", items: [] },
  { id: "טייס", title: "טייס", icon: Award, color: "text-sky-400", bg: "bg-sky-500/15", group: "כושר קרבי", items: [] },
  { id: "אימונים ללא ציוד", title: "אימונים ללא ציוד", icon: Zap, color: "text-purple-400", bg: "bg-purple-500/15", group: "כושר רגיל", items: [] },
  { id: "אימוני חדר כושר", title: "אימוני חדר כושר", icon: Dumbbell, color: "text-emerald-500", bg: "bg-emerald-500/15", group: "כושר רגיל", items: [] },
];
const TRAINING_BANK_GROUPS = [
  { id: "כושר קרבי", label: "כושר קרבי", hex: "#ef4444", icon: Flame },
  { id: "כושר רגיל", label: "כושר רגיל", hex: "#10b981", icon: Dumbbell },
];

// The 15 trainable dimensions for "המסלול שלי" - every AI-generated plan and every
// progress measurement is expressed in terms of these, so the whole feature has one
// consistent vocabulary from plan generation through periodic re-testing.
const PLAN_DIMENSIONS = [
  { id: "endurance", label: "סיבולת לב-ריאה", hex: "#ef4444" },
  { id: "sprint", label: "מהירות וספרינטים", hex: "#f97316" },
  { id: "upper", label: "כוח פלג גוף עליון", hex: "#10b981" },
  { id: "lower", label: "כוח פלג גוף תחתון", hex: "#f59e0b" },
  { id: "core", label: "כוח ליבה ובטן", hex: "#84cc16" },
  { id: "explosive", label: "כוח מתפרץ", hex: "#eab308" },
  { id: "muscular_endurance", label: "סיבולת שרירית", hex: "#22d3ee" },
  { id: "mobility", label: "גמישות וניידות", hex: "#38bdf8" },
  { id: "mental", label: "חוסן מנטלי", hex: "#a855f7" },
  { id: "teamwork", label: "עבודת צוות ומנהיגות", hex: "#ec4899" },
  { id: "navigation", label: "ניווט ואוריינטציה", hex: "#14b8a6" },
  { id: "gear", label: "עבודת ציוד וטכניקה", hex: "#64748b" },
  { id: "water", label: "כושר ימי ושחייה", hex: "#0ea5e9" },
  { id: "recovery", label: "התאוששות ומניעת פציעות", hex: "#f472b6" },
  { id: "lifestyle", label: "תזונה ושינה", hex: "#fb923c" },
];

// Which plan dimension each bank category mainly trains. Used only to tag a real bank
// workout when the AI gave no (or an invalid) dimension for it.
const BANK_CAT_TO_DIM = {
  "כושר קרבי כללי": "endurance", "יום סיירות": "muscular_endurance", "מטכ\"ל": "muscular_endurance",
  "שייטת": "water", "חובלים": "water", "טייס": "mental", "אימונים ללא ציוד": "core",
  "אימוני חדר כושר": "upper",
};

// Condensed per-gibush training emphasis, so the AI can intelligently weight a plan
// toward what actually matters for the specific gibush the trainee is facing -
// e.g. heavy swimming for שייטת 13 but almost none for טיס, which is cognitive-first.
const GIBUSH_TRAINING_FOCUS = {
  "יום סיירות": { dims: ["sprint", "muscular_endurance", "core", "lower", "endurance"], note: "ספרינטים בחול, זחילות, שקי חול, עליות/ירידות בדיונות - עומס חוזר על רגליים וליבה." },
  "גיבוש מטכ\"ל": { dims: ["sprint", "muscular_endurance", "core", "upper", "gear", "recovery"], note: "ספרינטי חול, זחילות, שקי חול, ריצות עם משקל, חפירות, נשיאת אלונקה - עומס משולב אישי+קבוצתי גבוה." },
  "גיבוש שייטת": { dims: ["water", "sprint", "muscular_endurance", "core", "recovery"], note: "מרכז הכובד הוא שחייה וצלילה במים, כולל עם ציוד; לצד זה גם ספרינטים וזחילות בחול." },
  "גיבוש חובלים": { dims: ["sprint", "muscular_endurance", "teamwork", "navigation", "mental"], note: "פחות שחייה/צלילה מאשר שייטת - הדגש על ריצות, סחיבות קבוצתיות, ניווט, פתרון בעיות ומנהיגות בצוות תחת עייפות." },
  "גיבוש טיס": { dims: ["mental", "teamwork", "endurance", "recovery"], note: "הכושר הגופני אינו מרכז הגיבוש - הדגש הוא קוגניטיבי (זיכרון, לוגיקה, משימות מרחביות) ומנהיגות תחת לחץ; עדיין נדרש תפקוד פיזי כשעייפים." },
  "גיבוש ימ\"ס": { dims: ["sprint", "muscular_endurance", "core", "mental", "recovery", "gear"], note: "עומס אגרסיבי במיוחד עם מעט התאוששות בין אקטים - שקי חול, אלונקה, ציוד, וחוסן מנטלי לתפקד תחת עייפות קיצונית." },
  "גיבושון 669": { dims: ["water", "gear", "mental"], note: "הדגש הוא יכולת להישאר מתפקד במים תחת לחץ (לא שחייה למרחק) - טבעת לחץ, צלילה, שנורקל, ולצד זה עבודה עם חבלים ורתמות." },
  "יחטיות צנחנים": { dims: ["sprint", "muscular_endurance", "core", "teamwork", "gear"], note: "פיזי משמעותית יותר מגיבוש צנחנים רגיל - ספרינטים בחול, נשיאת אלונקה ומשקלים, מסעות, תפקוד קבוצתי לאורך זמן." },
  "גיבוש צנחנים": { dims: ["sprint", "core", "teamwork", "endurance"], note: "פחות תובעני פיזית מהגיבושים האחרים - כושר בסיסי, משימות קבוצתיות ומוטיבציה לשירות קרבי, לא עומס קיצוני." },
  "גיבוש צוללות": { dims: ["mental", "teamwork", "sprint", "muscular_endurance", "gear"], note: "המרכיב המרכזי אינו כושר אלא יכולת טכנית/ניהולית, עבודת צוות וקור רוח; פיזית יש ספרינטים, אלונקה, חפירות ושהייה במים (לא שחייה מהירה)." },
};

// Categories eligible for the "find a training partner" feature - combat-fitness
// tracks only, where training with someone else genuinely matters most.
const PARTNER_CATEGORIES = ["טייס", "חובלים", "שייטת", "מטכ\"ל", "יום סיירות", "כושר קרבי כללי"];
const TRAINING_BANK_HEX = {
  "טייס": "#38bdf8", "מטכ\"ל": "#eab308", "שייטת": "#22d3ee", "חובלים": "#60a5fa",
  "יום סיירות": "#fb923c", "כושר קרבי כללי": "#84cc16",
  "אימונים ללא ציוד": "#c084fc", "כוח פלג גוף עליון": "#10b981", "כוח פלג גוף תחתון": "#f59e0b",
  "פלג גוף עליון חדר כושר": "#34d399", "פלג גוף עליון קליסטניקס": "#38bdf8",
};

// The original "יובל" network - some features (like training summaries) are
// exclusive to this specific network and must never appear for individual
// accounts or any other network, current or future.
const YUVAL_NETWORK_ID = "14f9329c-6d96-4d45-9c63-5829d7a3c66a";

const GIBUSHIM_LIST = [
  "יום סיירות", "גיבוש מטכ\"ל", "גיבוש שייטת", "גיבוש חובלים", "גיבוש טיס",
  "גיבוש ימ\"ס", "גיבושון 669", "יחטיות צנחנים", "גיבוש צנחנים", "גיבוש צוללות",
];

// Per-gibush portal card styling - each type gets its own distinct color and finish
// (shiny = strong glow/shine, matte = subdued, near-flat) rather than one uniform amber look.
const GIBUSH_PORTAL_STYLE = {
  "יחטיות צנחנים": { hex: "#f97316", shiny: true },   // כתום נוצץ
  "גיבוש חובלים": { hex: "#22d3ee", shiny: false },   // תכלת
  "גיבוש טיס": { hex: "#f1f5f9", shiny: false, matte: true }, // לבן מט
  "גיבוש מטכ\"ל": { hex: "#eab308", shiny: true },    // זהוב
  "גיבוש שייטת": { hex: "#3b82f6", shiny: false },    // כחול
  "גיבוש ימ\"ס": { hex: "#9ca3af", shiny: true },      // אפור נוצץ
  "יום סיירות": { hex: "#cbd5e1", shiny: true },       // כסף
  "גיבושון 669": { hex: "#a855f7", shiny: false },    // סגול
  "גיבוש צנחנים": { hex: "#92400e", shiny: false },   // חום
  "גיבוש צוללות": { hex: "#18181b", shiny: false, matte: true, dark: true }, // שחור מט חשאי
};

// Portal card icon per gibush type - visual variety instead of one repeated icon.
const GIBUSH_PORTAL_ICONS = {
  "יחטיות צנחנים": Wind,
  "גיבוש חובלים": Anchor,
  "גיבוש טיס": Plane,
  "גיבוש מטכ\"ל": Star,
  "גיבוש שייטת": Anchor,
  "גיבוש ימ\"ס": Compass,
  "יום סיירות": Footprints,
  "גיבושון 669": ShieldAlert,
  "גיבוש צנחנים": Wind,
  "גיבוש צוללות": Moon,
};

// Yerpa (Air Force fitness board) sub-sections - shown only to trainees whose
// target unit is 'tayas' (pilot course).
const YERPA_LIST = ["ירפ\"א א", "ירפ\"א ב", "פסיכולוג"];

// Filter/classification tags for tips-newspaper articles - a coach tags an article
// with one of these when publishing, and readers can filter the feed by the same list.
const ARTICLE_UNIT_TAGS = [
  "שלדג", "סיירת מטכ\"ל", "שייטת 13", "קורס טיס", "קורס חובלים", "ימ\"ס",
  "669", "קומנדו", "סיירת חי\"ר", "קורס צוללות", "עוקץ", "יהלם", "לוטר",
];

const TEAM_LIST = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    label: `צוות ${i + 1}`,
  })),
  { id: "13", label: "17 א" },
  { id: "14", label: "17 ב" },
];
// Friendly display label for a team id - falls back to "צוות X" for any id not
// explicitly named, so this never breaks for teams added directly in Supabase.
function getTeamLabel(teamId) {
  const found = TEAM_LIST.find((t) => t.id === String(teamId));
  return found ? found.label : `צוות ${teamId}`;
}

// Each team's verification code — a trainee must enter the correct code to lock in that team at signup.
const TEAM_CODES_MAP = {
  "1": "12121212",
  "2": "23412345",
  "3": "12351235",
  "4": "99899989",
  "5": "05405454",
  "6": "67676767",
  "7": "57473727",
  "8": "11188818",
  "9": "45945945",
  "10": "34873487",
  "11": "52135213",
  "12": "12131412",
};

// Placeholder values for the "מילה טובה" peer-recognition tag — rename these to match
// the organization's real stated values whenever you're ready.
const CORE_VALUES = ["נחישות", "עבודת צוות", "מנהיגות", "משמעת", "חוסן מנטלי", "עזרה לזולת"];

const WAR_WEEKS = [
  {
    title: "עקרונות ומטרות", intro: true,
    body: [
      "10 שבועות | 3 אימונים בשבוע | ללא ציוד (מלבד כיסא/שולחן/מגבת)",
      "45-70 דקות לאימון. ציוד: רצפה, כיסא יציב, שולחן חזק, מגבת",
      "כל אימון כולל: חימום, כוח, סבולת, ליבה, פינישר",
      "מטרות: לשמור כמה שיותר על כוח פלג גוף עליון · לשמור על יכולת שכיבות סמיכה, מתח (באמצעות תחליפים), זחילות ויציבות · לשמור על סבולת לקראת גיבושים · למנוע ירידה במסת שריר",
    ],
  },
  {
    title: "שבועות 1-2",
    workouts: [
      {
        name: "אימון A - Push + Legs",
        highlights: ["חימום: 30 סמוך-קום קל, 20 סקוואטים, 15 לאנג׳ים לכל רגל, 15 שכיבות סמיכה, 30 שניות פלאנק"],
        blocks: [
          { label: "כוח - 5 סבבים (מנוחה: דקה)", rows: [
            ["שכיבות סמיכה", "5", "15-20", "דקה"],
            ["Bulgarian Split Squat לכל רגל", "5", "20", "דקה"],
            ["Pike Push Ups", "5", "15", "דקה"],
            ["Wall Sit", "5", "30 שניות", "דקה"],
          ]},
          { label: "סבולת - 10 דקות AMRAP", rows: [
            ["Burpees", "-", "10", "-"],
            ["Mountain Climbers", "-", "20", "-"],
            ["Jump Squats", "-", "15", "-"],
          ]},
          { label: "Core - 4 סבבים", rows: [
            ["פלאנק", "4", "דקה", "-"],
            ["Side Plank לכל צד", "4", "40 שניות", "-"],
            ["Hollow Rocks", "4", "20", "-"],
          ]},
          { label: "פינישר", note: "100 שכיבות סמיכה - כמה שפחות עצירות" },
        ],
      },
      {
        name: "אימון B - Pull Simulation",
        highlights: ["אין מתח? מחליפים במשיכות איזומטריות"],
        blocks: [
          { label: "כוח - 6 סבבים של 30 שניות", note: "מגבת כרוכה סביב רגל, מנסים \"לקרוע\" אותה במשיכה מקסימלית - ומיד אחר כך:" },
          { rows: [
            ["הרמות גב", "6", "20", "-"],
            ["Superman", "6", "20", "-"],
            ["חתירות מתחת לשולחן (אם בטוח)", "6", "10-15", "-"],
          ]},
          { label: "יד אחורית", rows: [["Diamond Push Ups", "5", "12", "-"]] },
          { label: "גב - 5 סבבים", rows: [["Y", "5", "10", "-"], ["T", "5", "10", "-"], ["W", "5", "10", "-"]] },
          { label: "Core - 4 סבבים", rows: [["V Ups", "4", "20", "-"], ["Russian Twist", "4", "40", "-"], ["Dead Bug", "4", "20", "-"]] },
          { label: "פינישר - 10 דקות", note: "כל דקה: 10 Burpees" },
        ],
      },
      {
        name: "אימון C - גיבוש",
        highlights: ["45 דקות רצוף - חוזר 9 פעמים"],
        blocks: [
          { label: "כל 5 דקות", rows: [
            ["Burpees", "9", "20", "-"],
            ["Push Ups", "9", "20", "-"],
            ["Air Squats", "9", "30", "-"],
            ["Walking Lunges", "9", "20", "-"],
            ["Bear Crawl", "9", "דקה", "-"],
          ]},
        ],
      },
    ],
  },
  {
    title: "שבועות 3-4",
    workouts: [
      {
        name: "אימון A - Push + Legs",
        highlights: ["מעלים נפח מהבסיס: שכיבות סמיכה 20→25, Pike 15→20, Bulgarian 20→25, Burpees 10→15, Wall Sit 30→60 שניות, פלאנק 60→90 שניות", "חימום: 30 סמוך-קום קל, 20 סקוואטים, 15 לאנג׳ים לכל רגל, 15 שכיבות סמיכה, 30 שניות פלאנק"],
        blocks: [
          { label: "כוח - 5 סבבים (מנוחה: דקה)", rows: [
            ["שכיבות סמיכה", "5", "20-25", "דקה"],
            ["Bulgarian Split Squat לכל רגל", "5", "25", "דקה"],
            ["Pike Push Ups", "5", "20", "דקה"],
            ["Wall Sit", "5", "60 שניות", "דקה"],
          ]},
          { label: "סבולת - 10 דקות AMRAP", rows: [
            ["Burpees", "-", "15", "-"],
            ["Mountain Climbers", "-", "20", "-"],
            ["Jump Squats", "-", "15", "-"],
          ]},
          { label: "Core - 4 סבבים", rows: [
            ["פלאנק", "4", "90 שניות", "-"],
            ["Side Plank לכל צד", "4", "40 שניות", "-"],
            ["Hollow Rocks", "4", "20", "-"],
          ]},
          { label: "פינישר", note: "100 שכיבות סמיכה - כמה שפחות עצירות" },
        ],
      },
      { name: "אימון B - Pull Simulation", highlights: ["ללא שינוי מבסיס שבועות 1-2 - ראה שם את הפירוט המלא"], blocks: [] },
      { name: "אימון C - גיבוש", highlights: ["ללא שינוי מבסיס שבועות 1-2 - ראה שם את הפירוט המלא"], blocks: [] },
    ],
  },
  {
    title: "שבועות 5-6",
    workouts: [
      {
        name: "אימון A - Push + Legs",
        highlights: ["Tempo בכל תרגילי הכוח: 4 שניות ירידה, שנייה עצירה למטה, עלייה מהירה", "בנוסף: 100 סמוך-קום בסוף האימון (מעבר לפינישר)"],
        blocks: [
          { label: "כוח - 5 סבבים, בטמפו (מנוחה: דקה)", rows: [
            ["שכיבות סמיכה", "5", "20-25", "דקה"],
            ["Bulgarian Split Squat לכל רגל", "5", "25", "דקה"],
            ["Pike Push Ups", "5", "20", "דקה"],
            ["Wall Sit", "5", "60 שניות", "דקה"],
          ]},
          { label: "פינישר", note: "100 שכיבות סמיכה + 100 סמוך-קום נוספים" },
        ],
      },
      { name: "אימון B - Pull Simulation", highlights: ["Tempo בכל תרגילי הכוח: 4 שניות ירידה, שנייה עצירה למטה, עלייה מהירה", "שאר הפירוט ללא שינוי - ראה שבועות 1-2"], blocks: [] },
      { name: "אימון C - גיבוש", highlights: ["ללא שינוי מבסיס שבועות 1-2"], blocks: [] },
    ],
  },
  {
    title: "שבועות 7-8",
    workouts: [
      {
        name: "אימון A - Push + Legs",
        highlights: ["Density: אותו נפח, מנוחה מקוצרת ל-45 שניות בין הסבבים (במקום דקה)"],
        blocks: [
          { label: "כוח - 5 סבבים (מנוחה: 45 שניות)", rows: [
            ["שכיבות סמיכה", "5", "20-25", "45 שניות"],
            ["Bulgarian Split Squat לכל רגל", "5", "25", "45 שניות"],
            ["Pike Push Ups", "5", "20", "45 שניות"],
            ["Wall Sit", "5", "60 שניות", "45 שניות"],
          ]},
          { label: "פינישר חדש - 15 דקות EMOM", rows: [
            ["Burpees", "-", "12", "-"],
            ["Push Ups", "-", "15", "-"],
            ["Squats", "-", "20", "-"],
          ]},
        ],
      },
      { name: "אימון B - Pull Simulation", highlights: ["Density: מנוחה מקוצרת ל-45 שניות בין הסבבים", "שאר הפירוט ללא שינוי - ראה שבועות 1-2"], blocks: [] },
      { name: "אימון C - גיבוש", highlights: ["ללא שינוי מבסיס שבועות 1-2"], blocks: [] },
    ],
  },
  {
    title: "שבועות 9-10",
    workouts: [
      {
        name: "אימון A",
        highlights: [],
        blocks: [
          { label: "300 שכיבות סמיכה", rows: [
            ["שכיבות סמיכה רגילות", "-", "100", "-"],
            ["שכיבות סמיכה יהלום", "-", "100", "-"],
            ["שכיבות סמיכה רחבות", "-", "100", "-"],
          ]},
        ],
      },
      {
        name: "אימון B",
        highlights: [],
        blocks: [
          { label: "1000 חזרות גב - משולב", rows: [
            ["הרמות גב", "-", "-", "-"],
            ["Superman", "-", "-", "-"],
            ["Isometric Pull", "-", "-", "-"],
            ["Y-T-W", "-", "-", "-"],
          ]},
        ],
      },
      {
        name: "אימון C - שעת גיבוש",
        highlights: ["60 דקות ללא עצירה - כמה שיותר סיבובים"],
        blocks: [
          { label: "כל סיבוב", rows: [
            ["Burpees", "-", "15", "-"],
            ["Push Ups", "-", "20", "-"],
            ["Squats", "-", "30", "-"],
            ["Lunges", "-", "20", "-"],
            ["Bear Crawl", "-", "דקה", "-"],
            ["Crab Walk", "-", "דקה", "-"],
            ["פלאנק", "-", "דקה", "-"],
          ]},
        ],
      },
    ],
  },
  {
    title: "מבחן כל שבועיים",
    body: [
      "בצע ברצף ורשום תוצאות להשוואה למבחן הקודם:",
      "מקסימום שכיבות סמיכה",
      "פלאנק מקסימלי",
      "100 Burpees לזמן",
      "300 Air Squats לזמן",
      "50 Pike Push Ups לזמן",
    ],
  },
];


const WEEKDAYS_HE = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

/* ============================== HELPERS ============================== */

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatCountdown(ms) {
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000) % 24;
  const d = Math.floor(ms / 86400000);
  return { d, h, m, s };
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ROW_HEIGHT = 56; // px per hour row in the calendar grid

function getWeekStart(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return date;
}
const MOTIVATION_QUOTES = [
  "הגוף מגיע עד לאן שהראש לוקח אותו.",
  "מי שמתאמן לבד היום, מוביל מחר.",
  "כאב הוא זמני. לוותר הוא לתמיד.",
  "כל אימון שאתה עושה עכשיו, מישהו אחר לא עושה.",
  "לא צריך להיות מושלם. צריך להיות עקבי.",
  "היום הקשה שלך הוא בדיוק מה שיבנה אותך.",
  "מי שרוצה - מוצא דרך. מי שלא - מוצא תירוץ.",
  "העילית לא נולדת ככה. היא בונה את עצמה, אימון אחרי אימון.",
];
function quoteOfDay() {
  const day = Math.floor(Date.now() / 86400000);
  return MOTIVATION_QUOTES[day % MOTIVATION_QUOTES.length];
}

// ---- Fitness test scoring tables (0-100 scale, per exact spec given) ----
const SCORE_TABLE_PULLUPS = [[0,0],[1,5],[2,10],[3,15],[4,20],[5,25],[6,35],[7,45],[8,50],[9,60],[10,65],[11,68],[12,72],[13,75],[14,80],[15,85],[16,85],[17,88],[18,92],[19,95],[20,100]];
const SCORE_TABLE_PULLUPS_WEIGHTED = [[0,0],[1,10],[2,20],[3,35],[4,50],[5,65],[6,75],[7,82],[8,87],[9,94],[10,98],[11,100]];
const SCORE_TABLE_DIPS = [[0,0],[1,6],[2,12],[3,20],[4,27],[5,35],[6,40],[7,50],[8,60],[9,65],[10,70],[11,74],[12,80],[13,85],[14,90],[15,93],[16,95],[17,97],[18,100]];
const SCORE_TABLE_RUN_1000 = [[185,100],[190,95],[195,90],[200,86],[205,82],[210,78],[215,74],[220,70],[225,65],[230,60],[235,55],[240,50],[248,42],[256,34],[264,25],[272,15],[280,5]];
const SCORE_TABLE_RUN_2000 = [[420,100],[430,95],[440,90],[450,86],[460,82],[470,78],[480,74],[490,70],[500,65],[510,60],[520,55],[530,50],[545,42],[560,34],[575,25],[590,15],[605,5]];
const SCORE_TABLE_RUN_3000 = SCORE_TABLE_RUN_2000;
const SCORE_TABLE_RUN_5000 = [[1100,100],[1120,96],[1140,92],[1160,88],[1180,84],[1200,80],[1220,76],[1240,72],[1260,68],[1280,64],[1300,60],[1320,56],[1350,50],[1380,44],[1410,38],[1440,32],[1470,24],[1500,16],[1530,8],[1560,3]];

function scoreFromTimeTable(table, seconds) {
  if (seconds <= table[0][0]) return table[0][1];
  if (seconds >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    const [t1, s1] = table[i], [t2, s2] = table[i + 1];
    if (seconds >= t1 && seconds <= t2) {
      const frac = (seconds - t1) / (t2 - t1);
      return Math.round(s1 + frac * (s2 - s1));
    }
  }
  return table[table.length - 1][1];
}
function scoreFromRepsTable(table, reps) {
  if (reps <= 0) return 0;
  const maxEntry = table[table.length - 1];
  if (reps >= maxEntry[0]) return 100;
  const exact = table.find(([r]) => r === reps);
  if (exact) return exact[1];
  for (let i = 0; i < table.length - 1; i++) {
    const [r1, s1] = table[i], [r2, s2] = table[i + 1];
    if (reps >= r1 && reps <= r2) {
      const frac = (reps - r1) / (r2 - r1);
      return Math.round(s1 + frac * (s2 - s1));
    }
  }
  return 0;
}
function scoreForTest(testId, value) {
  switch (testId) {
    case "run_1000": return scoreFromTimeTable(SCORE_TABLE_RUN_1000, value);
    case "run_2000": return scoreFromTimeTable(SCORE_TABLE_RUN_2000, value);
    case "run_3000": return scoreFromTimeTable(SCORE_TABLE_RUN_3000, value);
    case "run_5000": return scoreFromTimeTable(SCORE_TABLE_RUN_5000, value);
    case "pullups": return scoreFromRepsTable(SCORE_TABLE_PULLUPS, value);
    case "pullups_weighted": return scoreFromRepsTable(SCORE_TABLE_PULLUPS_WEIGHTED, value);
    case "dips": return scoreFromRepsTable(SCORE_TABLE_DIPS, value);
    case "pushups": return Math.min(Math.round(value), 100);
    default: return 0;
  }
}
const DIFFICULTY_STYLE = {
  "מתחיל": { hex: "#10b981", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40" },
  "בסיסי": { hex: "#38bdf8", bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/40" },
  "מתקדם": { hex: "#f59e0b", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40" },
  "מתקדם מאוד": { hex: "#ef4444", bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40" },
};

function scoreColor(score) {
  if (score >= 90) return "#dc2626";
  if (score >= 75) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#fb923c";
  if (score >= 20) return "#facc15";
  return "#fde047";
}
function scoreRank(score) {
  if (score >= 90) return "עילית";
  if (score >= 75) return "מתקדם מאוד";
  if (score >= 60) return "מתקדם";
  if (score >= 40) return "בינוני";
  if (score >= 20) return "בסיסי";
  return "מתחיל";
}

const FITNESS_TESTS = [
  { id: "run_1000", label: "ריצת 1000 מטר", unit: "time", icon: Timer, hex: "#10b981" },
  { id: "run_2000", label: "ריצת 2000 מטר", unit: "time", icon: Timer, hex: "#10b981" },
  { id: "run_3000", label: "ריצת 3000 מטר", unit: "time", icon: Timer, hex: "#10b981" },
  { id: "run_5000", label: "ריצת 5000 מטר", unit: "time", icon: Timer, hex: "#10b981" },
  { id: "pullups", label: "מתח", unit: "reps", icon: Dumbbell, hex: "#10b981" },
  { id: "pullups_weighted", label: "מתח עם 6 ק״ג", unit: "reps", icon: Dumbbell, hex: "#10b981" },
  { id: "pushups", label: "שכיבות סמיכה", unit: "reps", icon: Zap, hex: "#10b981" },
  { id: "dips", label: "מקבילים", unit: "reps", icon: Zap, hex: "#10b981" },
];
const TEST_TO_BANK_CATEGORY = {
  run_1000: "כושר קרבי כללי", run_2000: "כושר קרבי כללי", run_3000: "יום סיירות", run_5000: "יום סיירות",
  pullups: "כוח פלג גוף עליון", pullups_weighted: "פלג גוף עליון קליסטניקס",
  pushups: "אימונים ללא ציוד", dips: "כוח פלג גוף עליון",
};
// Lower is better for time-based tests (running), higher is better for rep-based tests.
function isImprovement(unit, newVal, oldVal) {
  return unit === "time" ? newVal < oldVal : newVal > oldVal;
}
function formatTestValue(unit, val) {
  if (unit === "time") {
    const m = Math.floor(val / 60);
    const s = Math.round(val % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${val}`;
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h < 5) return "לילה טוב";
  if (h < 12) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  if (h < 21) return "ערב טוב";
  return "לילה טוב";
}

function timeToMinutes(t) {
  if (!t) return 360;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}
// Works for any date, not just today: past dates are always "ended", future dates
// never are, and today compares against the scheduled end time (or +60min if unset).
function eventHasEnded(e) {
  const todayKey = toKey(new Date());
  if (!e?.date) return false;
  if (e.date < todayKey) return true;
  if (e.date > todayKey) return false;
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const startMin = timeToMinutes(e.time || "00:00");
  const endMin = e.endTime ? timeToMinutes(e.endTime) : startMin + 60;
  return endMin <= nowMinutes;
}
function minutesToTime(mins) {
  const clamped = Math.max(0, Math.min(23 * 60 + 55, mins));
  const snapped = Math.round(clamped / 15) * 15;
  const h = Math.floor(snapped / 60);
  const m = snapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// A training's feedback form opens the moment it ends and stays open for 3 hours.
// If no explicit endTime was set by the admin, we assume a 2-hour session.
function getOpenFeedbackEvent(events) {
  const now = new Date();
  for (const e of events) {
    if (!e.date) continue;
    const start = new Date(`${e.date}T${e.time || "00:00"}:00`);
    const end = e.endTime ? new Date(`${e.date}T${e.endTime}:00`) : new Date(start.getTime() + 2 * 3600 * 1000);
    const windowEnd = new Date(end.getTime() + 3 * 3600 * 1000);
    if (now >= end && now <= windowEnd) return e;
  }
  return null;
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// A pulsing, clear-water-like colored glow that surrounds a solid black button —
// the button interior stays black; the light lives in the box-shadow halo around it.
// hex2, when given, tints the outer/soft ring for a two-tone glow.
function glowVars(hex, hex2) {
  return {
    "--glow-strong": hexToRgba(hex, 0.75),
    "--glow-soft": hexToRgba(hex2 || hex, 0.4),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Real Supabase Auth (GoTrue) over plain REST — no SDK needed. Used only when
// CONFIG.SUPABASE_URL / SUPABASE_ANON_KEY are filled in. Supabase sends the actual
// confirmation email and refuses to log in an unconfirmed account — this is the real
// verification client-side code alone cannot do.
async function supabaseSignUp(email, password, meta) {
  let res;
  try {
    res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: CONFIG.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, data: meta }),
    });
  } catch (e) {
    throw new Error(`לא ניתן להתחבר לשרת [${e?.name || "?"}: ${e?.message || "unknown"}] - בדקו כתובת/פרויקט מושהה`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.error_description || data?.error || "שגיאה בהרשמה");
  return data;
}

async function supabaseLogin(email, password) {
  let res;
  try {
    res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: CONFIG.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    throw new Error(`לא ניתן להתחבר לשרת [${e?.name || "?"}: ${e?.message || "unknown"}] - בדקו כתובת/פרויקט מושהה`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.error_description || "אימייל או סיסמה שגויים, או שהמייל טרם אומת");
  return data;
}

/* ============================== DATA LAYER ==============================
 * Every domain function below works against real Supabase tables when
 * CONFIG.SUPABASE_URL / SUPABASE_ANON_KEY are filled in, and transparently
 * falls back to Claude's local demo storage otherwise. Nothing else in the
 * app needs to know or care which mode is active.
 */

// Holds the real Supabase access token after login — required so Postgres'
// auth.uid() resolves correctly inside Row Level Security policies.
const session = { accessToken: null, refreshToken: null, expiresAt: null };
const SESSION_STORAGE_KEY = "sayert_session_v1";
const SESSION_MAX_IDLE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days without opening the app
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000; // refresh a bit before actual expiry, not right at the edge

function persistSession(authData) {
  session.accessToken = authData.access_token;
  session.refreshToken = authData.refresh_token || session.refreshToken;
  session.expiresAt = authData.expires_in ? Date.now() + authData.expires_in * 1000 : session.expiresAt;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      lastActiveAt: Date.now(),
    }));
  } catch (e) {}
}
function touchSessionActivity() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    parsed.lastActiveAt = Date.now();
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
  } catch (e) {}
}
function clearPersistedSession() {
  session.accessToken = null;
  session.refreshToken = null;
  try { localStorage.removeItem(SESSION_STORAGE_KEY); } catch (e) {}
}
async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: CONFIG.SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || "רענון החיבור נכשל");
  return data;
}
// Called before every authenticated request (REST call, RPC, or AI call). A
// long-lived screen - like slowly filling out the training-plan questionnaire,
// or just leaving a tab open - can easily outlast the access token's normal
// lifetime; without this, the *first* request after that point fails outright
// instead of quietly refreshing first. Never throws: if refresh fails, the
// caller proceeds with whatever token it has and lets the real request surface
// the actual error, rather than blocking on a network hiccup here.
async function ensureFreshToken() {
  if (!session.accessToken || !session.refreshToken) return;
  if (session.expiresAt && Date.now() < session.expiresAt - TOKEN_REFRESH_MARGIN_MS) return;
  try {
    const authData = await refreshAccessToken(session.refreshToken);
    persistSession(authData);
  } catch (e) {
    // leave the existing (possibly stale) token in place - the request itself will surface any real failure
  }
}
// Called once when the app boots: if a session was saved within the last 7
// days of actual use, silently restore it (refreshing the access token if
// needed) instead of showing the login screen. Anything older, or missing,
// falls through to a normal login prompt.
async function restorePersistedSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.refreshToken) return null;
    if (Date.now() - (parsed.lastActiveAt || 0) > SESSION_MAX_IDLE_MS) {
      clearPersistedSession();
      return null;
    }
    const authData = await refreshAccessToken(parsed.refreshToken);
    persistSession(authData);
    return authData;
  } catch (e) {
    clearPersistedSession();
    return null;
  }
}

function useSupabase() {
  return Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
}

async function sbRequest(method, table, { query = "", body } = {}) {
  await ensureFreshToken();
  const res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.accessToken || CONFIG.SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...(method !== "GET" ? { Prefer: "return=representation" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || "שגיאת שרת");
  }
  if (res.status === 204) return [];
  return res.json();
}

// Uploads a real image file to Supabase Storage (the 'unit-images' bucket) and
// returns a public URL pointing to that now-hosted copy - this is the coach's own
// file, uploaded to their own project, not a pasted link to someone else's image.
async function uploadUnitImage(file) {
  const base = CONFIG.SUPABASE_URL.replace(/\/$/, "");
  const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const res = await fetch(`${base}/storage/v1/object/unit-images/${path}`, {
    method: "POST",
    headers: {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.accessToken || CONFIG.SUPABASE_ANON_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || "העלאת התמונה נכשלה");
  }
  return `${base}/storage/v1/object/public/unit-images/${path}`;
}

async function sbRpc(fn, args) {
  await ensureFreshToken();
  const res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: CONFIG.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session.accessToken || CONFIG.SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || "שגיאת שרת");
  }
  return res.json();
}

// If you paste a key directly into CONFIG.GEMINI_API_KEY below, that's used straight
// away — simplest option, works immediately. If you leave it empty and later deploy
// the gemini-chat Edge Function, the app automatically switches to that instead (the
// key then never reaches the browser at all). Either way nothing else needs to change.
async function aiChat(systemPrompt, userText, history = []) {
  if (CONFIG.GEMINI_API_KEY) return callGemini(CONFIG.GEMINI_API_KEY, systemPrompt, userText, history);
  if (useSupabase()) {
    await ensureFreshToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    let res;
    try {
      res = await fetch(`${CONFIG.SUPABASE_URL.replace(/\/$/, "")}/functions/v1/gemini-chat`, {
        method: "POST",
        headers: {
          apikey: CONFIG.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.accessToken || CONFIG.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ systemPrompt, userText, history }),
        signal: controller.signal,
      });
    } catch (e) {
      if (e.name === "AbortError") throw new Error("הבקשה ארכה יותר מדי זמן - בדוק/י חיבור לאינטרנט");
      throw new Error("שגיאת רשת - בדוק/י חיבור לאינטרנט");
    } finally {
      clearTimeout(timeoutId);
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error || `AI request failed (${res.status})`);
    }
    const data = await res.json();
    return data.text || "לא התקבלה תשובה מהמאמן.";
  }
  throw new Error("no AI configured");
}

// health_issues is stored as one text column, not an array — these convert between
// that and the chip-based multi-select UI. The round-trip is a best-effort parse
// based on matching known HEALTH_OPTIONS substrings, not a lossless format.
function healthIssuesToText(issues, otherNote) {
  const parts = (issues || []).filter((i) => i !== "אחר");
  if ((issues || []).includes("אחר")) parts.push(otherNote?.trim() ? `אחר: ${otherNote.trim()}` : "אחר");
  return parts.join(", ");
}
function healthIssuesFromText(text) {
  if (!text) return { issues: [], otherNote: "" };
  const issues = HEALTH_OPTIONS.filter((opt) => opt !== "אחר" && text.includes(opt));
  const otherMatch = text.match(/אחר:\s*(.*)$/);
  if (otherMatch || text.includes("אחר")) issues.push("אחר");
  return { issues, otherNote: otherMatch ? otherMatch[1].trim() : "" };
}

// Maps between the app's internal nested `profile` object (used throughout the UI)
// and the real flat columns on the `profiles` table.
// Note: needs these columns added once Supabase is reconnected (not in the original schema):
// alter table profiles add column if not exists gibush_date date;
// alter table profiles add column if not exists gibush_type text;
// alter table profiles add column if not exists war_mode boolean default false;
// alter table profiles add column if not exists light_mode boolean default false;
function profileToDb(user) {
  const p = user.profile || {};
  return {
    full_name: p.fullName || null,
    role: user.role,
    team_id: p.teamCode ? Number(p.teamCode) : null,
    age: p.age ?? null,
    height: p.height ?? null,
    weight: p.weight ?? null,
    is_healthy: p.healthy ?? true,
    health_issues: healthIssuesToText(p.healthIssues || [], p.healthOtherNote || ""),
    target_unit: p.targetUnit || null,
    fitness_level: p.level || null,
    onboarded: user.onboarded,
    network: user.network || null,
    payment_status: user.paymentStatus || null,
    gibush_date: p.gibushDate || null,
    gibush_type: p.gibushType || null,
    war_mode: Boolean(p.warMode),
    light_mode: Boolean(p.lightMode),
    streak_value: p.streakValue ?? 0,
    streak_last_date: p.streakLastDate || null,
    photo_url: p.photoUrl || null,
    custom_bg_url: p.customBgUrl || null,
    phone: p.phone || null,
    city: p.city || null,
    grade: p.grade || null,
    custom_bg_enabled: Boolean(p.customBgEnabled),
  };
}
function profileFromDb(r) {
  const unitObj = UNITS.find((u) => u.id === r.target_unit);
  const { issues, otherNote } = healthIssuesFromText(r.health_issues);
  const hasProfile = r.age != null || r.fitness_level || r.target_unit;
  const profile = hasProfile
    ? {
        fullName: r.full_name || "",
        age: r.age, height: r.height, weight: r.weight,
        healthy: r.is_healthy,
        healthIssues: issues, healthOtherNote: otherNote,
        level: r.fitness_level || "",
        targetUnit: r.target_unit || "",
        targetUnitName: unitObj ? unitObj.name : "",
        teamCode: r.team_id != null ? String(r.team_id) : "",
        gibushDate: r.gibush_date || "",
        gibushType: r.gibush_type || "",
        warMode: Boolean(r.war_mode),
        lightMode: Boolean(r.light_mode),
        streakValue: r.streak_value ?? 0,
        streakLastDate: r.streak_last_date || "",
        photoUrl: r.photo_url || "",
        customBgUrl: r.custom_bg_url || "",
        phone: r.phone || "",
        city: r.city || "",
        grade: r.grade || "",
        customBgEnabled: Boolean(r.custom_bg_enabled),
      }
    : null;
  return { id: r.id, email: r.email, role: r.role, network: r.network, onboarded: Boolean(r.onboarded), accountType: r.account_type || "team", tier: r.tier || null, routePercentage: Number(r.route_percentage) || 0, requiresPayment: Boolean(r.requires_payment), paymentStatus: r.payment_status || null, profile };
}

async function fetchOwnProfile(uid) {
  const rows = await sbRequest("GET", "profiles", { query: `?id=eq.${uid}&select=*` });
  const r = rows[0];
  if (!r) return null;
  return profileFromDb(r);
}

// Verifies a team's code without ever exposing the code list to the client
// (Supabase mode calls the verify_team_code RPC; local demo mode checks the
// hardcoded map so testing still works without a live project).
async function verifyTeamCode(teamId, code) {
  if (useSupabase()) return sbRpc("verify_team_code", { p_team_id: Number(teamId), p_code: code });
  return TEAM_CODES_MAP[teamId] === code;
}

// Teams now belong to a specific network (teams.network_id) - the onboarding team
// picker must only ever show the teams that belong to the network the person just
// verified into, never every team across every network.
async function loadTeamsForNetwork(networkId) {
  if (!networkId || !useSupabase()) return TEAM_LIST;
  const rows = await sbRequest("GET", "teams", { query: `?select=id,name&network_id=eq.${networkId}&order=id.asc` });
  if (!rows || rows.length === 0) return TEAM_LIST;
  return rows.map((r) => ({ id: String(r.id), label: r.name || `צוות ${r.id}` }));
}

// Network code is verified via Supabase only (see the verify_network_code RPC —
// the code itself is never sent to or checked in client-side code in real mode).
// Returns the network's id on success (stored on the profile instead of the code
// itself) or null on failure. CONFIG.NETWORK_CODE remains only as a local-demo-mode
// fallback for testing without a live project.
async function verifyNetworkCode(code) {
  if (useSupabase()) {
    const rows = await sbRpc("verify_network_code_v2", { p_code: code });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row?.network_id) return null;
    return { id: row.network_id, requiresPayment: Boolean(row.requires_payment) };
  }
  return code === CONFIG.NETWORK_CODE ? { id: "local-network", requiresPayment: false } : null;
}

// ---- Users / profiles ----
async function loadUsers() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "profiles", { query: "?select=*" });
    return rows.map(profileFromDb);
  }
  return storageGetList("app_users");
}

async function saveUserProfile(user) {
  if (useSupabase()) {
    await sbRequest("PATCH", "profiles", { query: `?id=eq.${user.id}`, body: profileToDb(user) });
    return;
  }
  const users = await storageGetList("app_users");
  await storageSetList("app_users", users.map((u) => (u.id === user.id ? user : u)));
}

// ---- Official events (training calendar) ----
function eventFromDb(r) {
  return { id: r.id, date: r.date, title: r.title, time: r.time, endTime: r.end_time, location: r.location, createdBy: r.created_by };
}
async function loadOfficialEvents() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "official_events", { query: "?select=*&order=date.asc" });
    return rows.map(eventFromDb);
  }
  return storageGetList("official_events");
}
async function addOfficialEventRemote(entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "official_events", {
      body: { date: entry.date, title: entry.title, time: entry.time, end_time: entry.endTime, location: entry.location },
    });
    return eventFromDb(rows[0]);
  }
  const events = await storageGetList("official_events");
  await storageSetList("official_events", [entry, ...events]);
  return entry;
}
async function removeOfficialEventRemote(id) {
  if (useSupabase()) {
    await sbRequest("DELETE", "official_events", { query: `?id=eq.${id}` });
    return;
  }
  const events = await storageGetList("official_events");
  await storageSetList("official_events", events.filter((e) => e.id !== id));
}
// When a coach cancels a training that hasn't ended yet, any attendance already marked
// for it never really happened - so it's cleared out along with the event itself.
// A training canceled after it already ended keeps its attendance intact (that part is history).
async function removeAttendanceForEventRemote(eventId) {
  if (useSupabase()) {
    await sbRequest("DELETE", "individual_attendance", { query: `?event_id=eq.${eventId}` });
    await sbRequest("DELETE", "attendance_reports", { query: `?event_id=eq.${eventId}` });
    return;
  }
  const indiv = await storageGetList("individual_attendance");
  await storageSetList("individual_attendance", indiv.filter((r) => r.eventId !== eventId));
  const reports = await storageGetList("attendance_reports");
  await storageSetList("attendance_reports", reports.filter((r) => r.eventId !== eventId));
}

// ---- Articles (עיתון טיפים) — stored in app_content as category='tip_article' ----
// Note: image_url needs `alter table app_content add column if not exists image_url text;`
// added to the schema for this to persist once Supabase is connected.
async function loadArticlesRemote() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "app_content", { query: "?select=*&category=eq.tip_article&order=created_at.desc" });
    return rows.map((r) => ({ id: r.id, title: r.title, excerpt: r.body, unit: r.subcategory || "כללי", author: "", imageUrl: r.image_url || "" }));
  }
  return storageGetList("articles");
}
async function addArticleRemote(entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "app_content", { body: { category: "tip_article", title: entry.title, body: entry.excerpt, subcategory: entry.unit, image_url: entry.imageUrl || null } });
    const r = rows[0];
    return { id: r.id, title: r.title, excerpt: r.body, unit: r.subcategory || "כללי", author: "", imageUrl: r.image_url || "" };
  }
  const arts = await storageGetList("articles");
  await storageSetList("articles", [entry, ...arts]);
  return entry;
}

// ---- Training bank & Hub units/gibushim/unit-tips content — app_content in real
// Supabase mode, a local storage key in local mode. Starts empty either way,
// populated only by an admin (via Management tab) or, once reconnected, via
// Supabase directly.
// Convention: category='training_pool' with subcategory one of the 7 TRAINING_BANK ids;
// category='unit_info' with subcategory in ('יחידות','גיבושים','ערכים');
// category='unit_tips' with subcategory = one of the UNITS ids (e.g. 'shayetet') -
// shown only to trainees whose profile.targetUnit matches that same id.
// dateLabel is only meaningful for גיבושים content (the מועד shown on tap) - needs
// `alter table app_content add column if not exists date_label text;` in Supabase.
// ---- Fitness tests (running times, pull-ups, push-ups, dips - tracked over time) ----
function fitnessTestFromDb(r) {
  return { id: r.id, testType: r.test_type, value: Number(r.value), date: r.test_date };
}
async function loadFitnessTests(userId, testType) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "fitness_tests", { query: `?select=*&user_id=eq.${userId}&test_type=eq.${testType}&order=test_date.asc` });
    return rows.map(fitnessTestFromDb);
  }
  const all = await storageGetList(`fitness:${userId}`);
  return all.filter((t) => t.testType === testType);
}
async function loadAllFitnessTests(userId) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "fitness_tests", { query: `?select=*&user_id=eq.${userId}&order=test_date.asc` });
    return rows.map(fitnessTestFromDb);
  }
  return storageGetList(`fitness:${userId}`);
}
async function addFitnessTest(userId, entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "fitness_tests", { body: { user_id: userId, test_type: entry.testType, value: entry.value, test_date: entry.date } });
    return fitnessTestFromDb(rows[0]);
  }
  const all = await storageGetList(`fitness:${userId}`);
  const saved = { id: `local_${Date.now()}`, ...entry };
  await storageSetList(`fitness:${userId}`, [...all, saved]);
  return saved;
}
async function updateFitnessTest(id, value, date) {
  if (useSupabase()) {
    await sbRequest("PATCH", "fitness_tests", { query: `?id=eq.${id}`, body: { value, test_date: date } });
    return;
  }
}
async function deleteFitnessTest(userId, id) {
  if (useSupabase()) {
    await sbRequest("DELETE", "fitness_tests", { query: `?id=eq.${id}` });
    return;
  }
  const all = await storageGetList(`fitness:${userId}`);
  await storageSetList(`fitness:${userId}`, all.filter((t) => t.id !== id));
}
// ---- Monthly trainee evaluations (team leader -> coach, opens on the 30th) ----
function currentEvalMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
// Evaluation period opens on the 30th of each month. Short months (Feb, and 30-day
// months for the 31st case) still open on their actual last day so it's never skipped.
function isEvalPeriodOpen() {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const openDay = Math.min(30, lastDayOfMonth);
  return now.getDate() >= openDay;
}
async function loadMyEvaluationsRemote(teamLeaderId, monthKey) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "trainee_evaluations", { query: `?select=trainee_id&team_leader_id=eq.${teamLeaderId}&month_key=eq.${monthKey}` });
    return rows.map((r) => r.trainee_id);
  }
  return [];
}
async function submitTraineeEvaluationRemote(entry) {
  if (useSupabase()) {
    await sbRequest("POST", "trainee_evaluations", {
      body: {
        team_leader_id: entry.teamLeaderId, trainee_id: entry.traineeId, month_key: entry.monthKey,
        performance_rating: entry.performanceRating, attitude_rating: entry.attitudeRating, comments: entry.comments || null,
      },
    });
  }
}
async function loadAllEvaluationsRemote() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "trainee_evaluations", { query: "?select=*&order=created_at.desc" });
    return rows.map((r) => ({
      id: r.id, teamLeaderId: r.team_leader_id, traineeId: r.trainee_id, monthKey: r.month_key,
      performanceRating: r.performance_rating, attitudeRating: r.attitude_rating, comments: r.comments, createdAt: r.created_at,
    }));
  }
  return [];
}

async function loadValueReflection(userId, contentId) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "value_reflections", { query: `?select=reflection_text&user_id=eq.${userId}&content_id=eq.${contentId}` });
    return rows[0]?.reflection_text || "";
  }
  return "";
}
async function saveValueReflection(userId, contentId, text) {
  if (useSupabase()) {
    const existing = await sbRequest("GET", "value_reflections", { query: `?select=id&user_id=eq.${userId}&content_id=eq.${contentId}` });
    if (existing.length > 0) {
      await sbRequest("PATCH", "value_reflections", { query: `?id=eq.${existing[0].id}`, body: { reflection_text: text } });
    } else {
      await sbRequest("POST", "value_reflections", { body: { user_id: userId, content_id: contentId, reflection_text: text } });
    }
  }
}

async function loadFitnessGoals(userId) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "fitness_goals", { query: `?select=*&user_id=eq.${userId}` });
    const map = {};
    for (const r of rows) map[r.test_type] = Number(r.target_value);
    return map;
  }
  return (await storageGetList(`fitness_goals:${userId}`)).reduce((m, g) => ({ ...m, [g.testType]: g.targetValue }), {});
}
async function saveFitnessGoal(userId, testType, targetValue) {
  if (useSupabase()) {
    const existing = await sbRequest("GET", "fitness_goals", { query: `?select=id&user_id=eq.${userId}&test_type=eq.${testType}` });
    if (existing.length > 0) {
      await sbRequest("PATCH", "fitness_goals", { query: `?id=eq.${existing[0].id}`, body: { target_value: targetValue } });
    } else {
      await sbRequest("POST", "fitness_goals", { body: { user_id: userId, test_type: testType, target_value: targetValue } });
    }
    return;
  }
  const all = await storageGetList(`fitness_goals:${userId}`);
  await storageSetList(`fitness_goals:${userId}`, [...all.filter((g) => g.testType !== testType), { testType, targetValue }]);
}

async function loadContentRemote(category, subcategory) {
  if (useSupabase()) {
    let query = `?select=*&category=eq.${category}&order=created_at.desc`;
    if (subcategory) query += `&subcategory=eq.${encodeURIComponent(subcategory)}`;
    const rows = await sbRequest("GET", "app_content", { query });
    return rows.map((r) => ({ id: r.id, title: r.title, body: r.body, subcategory: r.subcategory, dateLabel: r.date_label || "", imageUrl: r.image_url || "", difficulty: r.difficulty || "", createdAt: r.created_at }));
  }
  const all = await storageGetList("app_content_local");
  return all.filter((c) => c.category === category && (!subcategory || c.subcategory === subcategory));
}

async function addContentRemote(entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "app_content", { body: { category: entry.category, subcategory: entry.subcategory, title: entry.title, body: entry.body, date_label: entry.dateLabel || null, image_url: entry.imageUrl || null } });
    const r = rows[0];
    return { id: r.id, title: r.title, body: r.body, subcategory: r.subcategory, category: r.category, dateLabel: r.date_label || "", imageUrl: r.image_url || "" };
  }
  const all = await storageGetList("app_content_local");
  const saved = { id: `local_${Date.now()}`, ...entry };
  await storageSetList("app_content_local", [saved, ...all]);
  return saved;
}
async function removeContentRemote(id) {
  if (useSupabase()) {
    await sbRequest("DELETE", "app_content", { query: `?id=eq.${id}` });
    return;
  }
  const all = await storageGetList("app_content_local");
  await storageSetList("app_content_local", all.filter((c) => c.id !== id));
}

// ---- Personal training logs (per-user calendar entries) ----
function logFromDb(r) {
  return { id: r.id, date: r.date, time: r.time, endTime: r.end_time, title: r.title, detail: r.detail, category: r.category || "", location: r.location || "", partnerOptIn: Boolean(r.partner_opt_in) };
}
async function loadPersonalLogsRemote(userId) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "personal_logs", { query: `?select=*&user_id=eq.${userId}&order=date.desc` });
    return rows.map(logFromDb);
  }
  return storageGetList(`logs:${userId}`);
}
async function addPersonalLogRemote(userId, entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "personal_logs", { body: { user_id: userId, date: entry.date, time: entry.time, end_time: entry.endTime || null, title: entry.title, detail: entry.detail, category: entry.category || null, location: entry.location || null } });
    return logFromDb(rows[0]);
  }
  const logs = await storageGetList(`logs:${userId}`);
  await storageSetList(`logs:${userId}`, [entry, ...logs]);
  return entry;
}
async function updatePersonalLogRemote(userId, id, patch) {
  if (useSupabase()) {
    await sbRequest("PATCH", "personal_logs", { query: `?id=eq.${id}`, body: patch });
    return;
  }
  const logs = await storageGetList(`logs:${userId}`);
  await storageSetList(`logs:${userId}`, logs.map((l) => (l.id === id ? { ...l, ...patch } : l)));
}
async function removePersonalLogRemote(userId, id) {
  if (useSupabase()) {
    await sbRequest("DELETE", "personal_logs", { query: `?id=eq.${id}` });
    return;
  }
  const logs = await storageGetList(`logs:${userId}`);
  await storageSetList(`logs:${userId}`, logs.filter((l) => l.id !== id));
}

// ---- Workout partner matching - opting a specific solo training in makes it
// visible (via RLS) to anyone else with a matching category and nearby date,
// across every team and network - and pulls back the same for them. ----
async function setPartnerOptInRemote(logId, optIn) {
  if (useSupabase()) {
    await sbRequest("PATCH", "personal_logs", { query: `?id=eq.${logId}`, body: { partner_opt_in: optIn } });
  }
}
async function findPartnerMatchesRemote(category, dateFrom, dateTo, excludeUserId) {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "personal_logs", {
    query: `?select=*&partner_opt_in=eq.true&category=eq.${encodeURIComponent(category)}&date=gte.${dateFrom}&date=lte.${dateTo}&user_id=neq.${excludeUserId}`,
  });
  if (rows.length === 0) return [];
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const profileRows = await sbRequest("GET", "profiles", { query: `?select=*&id=in.(${userIds.join(",")})` });
  return rows
    .map((r) => {
      const profileRow = profileRows.find((p) => p.id === r.user_id);
      if (!profileRow) return null;
      return { log: logFromDb(r), profile: profileFromDb(profileRow) };
    })
    .filter(Boolean);
}

// ---- Training reflections (permanent keep/improve history with AI feedback) ----
async function loadReflectionsRemote(userId) {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "training_reflections", { query: `?select=*&user_id=eq.${userId}&order=created_at.desc` });
    return rows.map((r) => ({
      id: r.id, trainingRefId: r.training_ref_id, title: r.training_title, date: r.training_date, group: r.is_group,
      keep1: r.keep1, keep2: r.keep2, improve1: r.improve1, improve2: r.improve2, aiTips: r.ai_tips,
    }));
  }
  return storageGetList(`reflections:${userId}`);
}
async function addReflectionRemote(userId, entry) {
  if (useSupabase()) {
    const rows = await sbRequest("POST", "training_reflections", {
      body: { user_id: userId, training_ref_id: entry.trainingRefId, training_title: entry.title, training_date: entry.date, is_group: entry.group, keep1: entry.keep1, keep2: entry.keep2, improve1: entry.improve1, improve2: entry.improve2, ai_tips: entry.aiTips },
    });
    const r = rows[0];
    return { id: r.id, trainingRefId: r.training_ref_id, title: r.training_title, date: r.training_date, group: r.is_group, keep1: r.keep1, keep2: r.keep2, improve1: r.improve1, improve2: r.improve2, aiTips: r.ai_tips };
  }
  const list = await storageGetList(`reflections:${userId}`);
  const saved = { id: `local_${Date.now()}`, ...entry };
  await storageSetList(`reflections:${userId}`, [saved, ...list]);
  return saved;
}

// ---- Attendance reports ----
// Note: entry.eventId ties the report to the specific training it was taken for.
// The Supabase schema built earlier doesn't have an event_id column on
// attendance_reports yet — add `alter table attendance_reports add column if not
// exists event_id uuid references official_events(id);` there to carry it through too.
async function loadAttendanceReportsRemote() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "attendance_reports", { query: "?select=*&order=date.desc" });
    return rows.map((r) => ({ teamId: r.team_id != null ? String(r.team_id) : "", eventId: r.event_id, date: r.date, percentage: r.attendance_percentage }));
  }
  return storageGetList("attendance_reports");
}
async function submitAttendanceRemote(entry) {
  if (useSupabase()) {
    await sbRequest("POST", "attendance_reports", { body: { event_id: entry.eventId, team_id: entry.teamId ? Number(entry.teamId) : null, date: entry.date, attendance_percentage: entry.percentage } });
    return;
  }
  const reports = await storageGetList("attendance_reports");
  await storageSetList("attendance_reports", [entry, ...reports]);
}

// ---- Individual per-trainee attendance (who specifically attended, not just the
// team percentage) - powers the coach's monthly "most attendances" leaderboard.
// Note: needs a new `individual_attendance` table if/when moved to Supabase:
// create table individual_attendance (id uuid default gen_random_uuid() primary key,
//   event_id text, date date, team_id int, user_id uuid references profiles(id),
//   present boolean, created_at timestamptz default now());
async function loadAllIndividualAttendance() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "individual_attendance", { query: "?select=*" });
    return rows.map((r) => ({ id: r.id, eventId: r.event_id, date: r.date, teamId: String(r.team_id), userId: r.user_id, present: r.present }));
  }
  return storageGetList("individual_attendance");
}
async function submitIndividualAttendanceRemote(records) {
  if (useSupabase()) {
    await sbRequest("POST", "individual_attendance", { body: records.map((r) => ({ event_id: r.eventId, date: r.date, team_id: Number(r.teamId), user_id: r.userId, present: r.present })) });
    return;
  }
  const all = await storageGetList("individual_attendance");
  await storageSetList("individual_attendance", [...records, ...all]);
}

// ---- Per-event RSVP (trainee marks if they're coming to a specific official training;
// admin sees exactly who's coming and who isn't, by name) ----
async function loadAllEventAttendance() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "event_attendance", { query: "?select=*" });
    return rows.map((r) => ({ id: r.id, eventId: r.event_id, userId: r.user_id, status: r.status }));
  }
  return storageGetList("event_attendance");
}
async function setEventAttendanceRemote(eventId, userId, status) {
  if (useSupabase()) {
    await sbRequest("DELETE", "event_attendance", { query: `?event_id=eq.${eventId}&user_id=eq.${userId}` }).catch(() => {});
    await sbRequest("POST", "event_attendance", { body: { event_id: eventId, user_id: userId, status } });
    return;
  }
  const all = await storageGetList("event_attendance");
  const filtered = all.filter((r) => !(r.eventId === eventId && r.userId === userId));
  await storageSetList("event_attendance", [...filtered, { id: `${eventId}_${userId}`, eventId, userId, status }]);
}

// ---- Training feedback ----
function feedbackFromDb(r) {
  return {
    id: r.id, userId: r.user_id, eventId: r.event_id, eventTitle: r.event_title,
    submittedAt: r.created_at, status: r.status, firstName: r.first_name,
    teamCode: r.team_id != null ? String(r.team_id) : "",
    coach: r.coach, valueRating: r.value_rating, recommendRating: r.recommend_rating,
    opinion: r.opinion,
    kindWord: r.kind_word_text ? { team: r.kind_word_team != null ? String(r.kind_word_team) : "", value: r.kind_word_value, text: r.kind_word_text } : null,
    howAreYou: r.how_are_you, messageToYuval: r.message_to_yuval,
  };
}
async function loadFeedbackRemote() {
  if (useSupabase()) {
    const rows = await sbRequest("GET", "training_feedback", { query: "?select=*&order=created_at.desc" });
    return rows.map(feedbackFromDb);
  }
  return storageGetList("training_feedback");
}
// ---- "המסלול שלי" - AI-generated training plans for independent trainees ----
// ---- Training board: network-scoped "who's training when and where", with a
// lightweight join-request flow between trainees in the same network only. ----
async function loadTrainingPosts(networkId) {
  if (!useSupabase() || !networkId) return [];
  const rows = await sbRequest("GET", "training_posts", { query: `?select=*,profiles(full_name)&network_id=eq.${networkId}&date=gte.${toKey(new Date())}&order=date.asc,time.asc` });
  return rows.map((r) => ({
    id: r.id, userId: r.user_id, title: r.title, category: r.category, date: r.date, time: r.time,
    location: r.location, notes: r.notes, createdAt: r.created_at, posterName: r.profiles?.full_name || "מתאמן",
  }));
}
async function addTrainingPostRemote(entry) {
  if (!useSupabase()) return entry;
  const rows = await sbRequest("POST", "training_posts", {
    body: { user_id: entry.userId, network_id: entry.networkId, title: entry.title, category: entry.category, date: entry.date, time: entry.time, location: entry.location, notes: entry.notes || null },
  });
  return { ...entry, id: rows[0].id, createdAt: rows[0].created_at };
}
async function removeTrainingPostRemote(id) {
  if (!useSupabase()) return;
  await sbRequest("DELETE", "training_posts", { query: `?id=eq.${id}` });
}
async function loadJoinRequestsRemote(userId) {
  if (!useSupabase()) return { sent: [], received: [] };
  const [sent, received] = await Promise.all([
    sbRequest("GET", "training_join_requests", { query: `?select=*&requester_id=eq.${userId}` }),
    sbRequest("GET", "training_join_requests", { query: `?select=*,training_posts!inner(user_id,title),profiles(full_name)&training_posts.user_id=eq.${userId}` }),
  ]);
  return {
    sent: sent.map((r) => ({ id: r.id, postId: r.post_id, status: r.status })),
    received: received.map((r) => ({ id: r.id, postId: r.post_id, status: r.status, postTitle: r.training_posts?.title, requesterName: r.profiles?.full_name || "מתאמן" })),
  };
}
async function sendJoinRequestRemote(postId, requesterId) {
  if (!useSupabase()) return;
  await sbRequest("POST", "training_join_requests", { body: { post_id: postId, requester_id: requesterId } });
}
async function respondJoinRequestRemote(id, status) {
  if (!useSupabase()) return;
  await sbRequest("PATCH", "training_join_requests", { query: `?id=eq.${id}`, body: { status } });
}


// ---- Simulations: full gibush-day simulations, run by a trainee with an
// external "evaluator" who enters results via a 6-digit code. Locked behind
// premium (checked separately in the UI against the person's own payment status). ----
async function loadSimulations() {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "simulations", { query: "?select=id,category,title,description,acts&order=created_at.asc" });
  return rows.map((r) => ({ id: r.id, category: r.category, title: r.title, description: r.description, acts: r.acts || [] }));
}
function generateSimCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
async function startSimulationSession(simulationId, traineeId, scheduledAt) {
  if (!useSupabase()) return null;
  let code = generateSimCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const rows = await sbRequest("POST", "simulation_sessions", { body: { simulation_id: simulationId, trainee_id: traineeId, code, scheduled_at: scheduledAt || null } });
      return { id: rows[0].id, code };
    } catch (e) {
      code = generateSimCode(); // collision on unique code - retry with a new one
    }
  }
  throw new Error("לא הצלחנו ליצור קוד ייחודי, נסה שוב");
}
// ---- Values consultation: each core value has its own tracking page. A trainee
// writes daily entries touching that value and gets an AI response per entry.
// Stories are separate read-only content tied to the same value by title. ----
const VALUE_META = {
  "שאיפה למצוינות": { icon: Trophy, hex: "#eab308" },
  "רעות": { icon: Users, hex: "#38bdf8" },
  "נחישות": { icon: Flame, hex: "#f97316" },
  "יוזמה והנהגה": { icon: Compass, hex: "#a855f7" },
  "משמעת": { icon: Shield, hex: "#10b981" },
  "נתינה למען האחר": { icon: Heart, hex: "#ec4899" },
  "אחריות": { icon: Anchor, hex: "#ef4444" },
  "אמינות": { icon: ClipboardCheck, hex: "#14b8a6" },
};
async function deleteValueEntry(entryId) {
  if (!useSupabase()) return;
  await sbRequest("DELETE", "value_entries", { query: `?id=eq.${entryId}` });
}
async function loadCoreValues() {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "app_content", { query: "?select=id,title,body&category=eq.unit_info&subcategory=eq.ערכי_ליבה&order=created_at.asc" });
  return rows.map((r) => ({ id: r.id, title: r.title, body: r.body }));
}
async function loadValueStory(valueTitle) {
  if (!useSupabase()) return null;
  const rows = await sbRequest("GET", "app_content", { query: `?select=body&category=eq.unit_info&subcategory=eq.סיפורי_ערכים&title=eq.${encodeURIComponent(valueTitle)}` });
  return rows[0]?.body || null;
}
async function loadValueEntries(userId, valueId) {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "value_entries", { query: `?select=*&user_id=eq.${userId}&value_id=eq.${valueId}&order=created_at.desc` });
  return rows.map((r) => ({ id: r.id, entryText: r.entry_text, aiResponse: r.ai_response, createdAt: r.created_at }));
}
async function loadAllValueEntriesForWeek(userId, sinceIso) {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "value_entries", { query: `?select=*&user_id=eq.${userId}&created_at=gte.${sinceIso}&order=created_at.desc` });
  return rows.map((r) => ({ id: r.id, valueId: r.value_id, entryText: r.entry_text, aiResponse: r.ai_response, createdAt: r.created_at }));
}
async function saveValueEntry(userId, valueId, entryText, aiResponse) {
  if (!useSupabase()) return null;
  const rows = await sbRequest("POST", "value_entries", { body: { user_id: userId, value_id: valueId, entry_text: entryText, ai_response: aiResponse } });
  return rows[0];
}

async function loadMySimSessions(traineeId) {
  if (!useSupabase()) return [];
  const rows = await sbRequest("GET", "simulation_sessions", { query: `?select=*,simulations(title,category)&trainee_id=eq.${traineeId}&order=created_at.desc` });
  return rows.map((r) => ({
    id: r.id, code: r.code, status: r.status, aiVerdict: r.ai_verdict, aiReasoning: r.ai_reasoning, scheduledAt: r.scheduled_at,
    simulationTitle: r.simulations?.title, simulationCategory: r.simulations?.category, createdAt: r.created_at, completedAt: r.completed_at,
  }));
}
async function rescheduleSimSession(sessionId, scheduledAt) {
  if (!useSupabase()) return;
  await sbRequest("PATCH", "simulation_sessions", { query: `?id=eq.${sessionId}`, body: { scheduled_at: scheduledAt } });
}
async function getSessionByCode(code) {
  if (!useSupabase()) return null;
  const rows = await sbRpc("get_session_by_code", { p_code: code });
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return { sessionId: r.session_id, simulationId: r.simulation_id, traineeName: r.trainee_name, status: r.status, acts: r.acts || [], simulationTitle: r.simulation_title, scheduledAt: r.scheduled_at, canEnter: r.can_enter !== false };
}
async function submitActResultByCode(code, actIndex, actName, data, notes) {
  return sbRpc("submit_act_result", { p_code: code, p_act_index: actIndex, p_act_name: actName, p_data: data, p_notes: notes || "" });
}
async function getActResultsByCode(code) {
  if (!useSupabase()) return [];
  const rows = await sbRpc("get_act_results_by_code", { p_code: code });
  return (rows || []).map((r) => ({ actIndex: r.act_index, actName: r.act_name, data: r.data || {}, notes: r.notes, completedAt: r.completed_at }));
}
async function finalizeSimulationVerdict(sessionId, verdict, reasoning) {
  if (!useSupabase()) return;
  await sbRequest("PATCH", "simulation_sessions", { query: `?id=eq.${sessionId}`, body: { status: "completed", ai_verdict: verdict, ai_reasoning: reasoning, completed_at: new Date().toISOString() } });
}

async function loadTrainingPlan(userId) {
  if (!useSupabase()) return null;
  const rows = await sbRequest("GET", "training_plans", { query: `?select=*&user_id=eq.${userId}` });
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id, title: r.title, unitId: r.unit_id, unitName: r.unit_name, level: r.level,
    weeklyPlan: r.weekly_plan || [], dimensionProgress: r.dimension_progress || {}, chatHistory: r.chat_history || [],
    athleteProfile: r.athlete_profile || null,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}
async function saveTrainingPlan(userId, plan) {
  if (!useSupabase()) return plan;
  const body = {
    user_id: userId, title: plan.title, unit_id: plan.unitId, unit_name: plan.unitName, level: plan.level,
    weekly_plan: plan.weeklyPlan, dimension_progress: plan.dimensionProgress, chat_history: plan.chatHistory,
    athlete_profile: plan.athleteProfile || null,
    updated_at: new Date().toISOString(),
  };
  if (plan.id) {
    await sbRequest("PATCH", "training_plans", { query: `?id=eq.${plan.id}`, body });
    return plan;
  }
  const rows = await sbRequest("POST", "training_plans", { body });
  return { ...plan, id: rows[0].id };
}
async function addPlanCalendarItem(userId, planId, entry) {
  if (!useSupabase()) return;
  await sbRequest("POST", "plan_calendar_items", {
    body: { user_id: userId, plan_id: planId, title: entry.title, category: entry.category, date: entry.date, start_time: entry.startTime, end_time: entry.endTime },
  });
}


async function submitFeedbackRemote(entry) {
  if (useSupabase()) {
    await sbRequest("POST", "training_feedback", {
      body: {
        user_id: entry.userId, event_id: entry.eventId, event_title: entry.eventTitle,
        first_name: entry.firstName, team_id: entry.teamCode ? Number(entry.teamCode) : null, coach: entry.coach,
        value_rating: entry.valueRating, recommend_rating: entry.recommendRating,
        opinion: entry.opinion,
        kind_word_team: entry.kindWord?.team ? Number(entry.kindWord.team) : null,
        kind_word_value: entry.kindWord?.value || null,
        kind_word_text: entry.kindWord?.text || null,
        how_are_you: entry.howAreYou, message_to_yuval: entry.messageToYuval, status: "pending",
      },
    });
    return;
  }
  const list = await storageGetList("training_feedback");
  await storageSetList("training_feedback", [entry, ...list]);
}
async function approveFeedbackRemote(id) {
  if (useSupabase()) {
    await sbRequest("PATCH", "training_feedback", { query: `?id=eq.${id}`, body: { status: "approved" } });
    return;
  }
}
async function checkFeedbackSubmitted(userId, eventId) {
  const list = await loadFeedbackRemote();
  return list.some((f) => f.userId === userId && f.eventId === eventId);
}

async function hashPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await window.crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function storageGetList(key) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const res = await window.storage.get(key, true);
      return res && res.value ? JSON.parse(res.value) : [];
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function storageSetList(key, list) {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(key, JSON.stringify(list), true);
      return;
    }
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error("storage set failed", key, e);
  }
}

async function callGemini(apiKey, systemPrompt, userText, history = []) {
  const contents = [
    ...history.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
    { role: "user", parts: [{ text: userText }] },
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    }
  );
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.error?.message || `Gemini request failed (${res.status})`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "לא התקבלה תשובה מהמאמן.";
}

function localCoachReply(text) {
  const t = text.toLowerCase();
  if (t.includes("שינה")) return "שאפו ל-7-9 שעות שינה בלילה. שינה היא חלק מהאימון עצמו - היא הזמן שבו הגוף בונה כוח ומתאושש.";
  if (t.includes("תזונה") || t.includes("אוכל")) return "לפני אימון קשה - פחמימות קלות לעיכול ומעט חלבון. אחרי אימון - חלבון + פחמימה תוך 60 דקות לשיקום מהיר.";
  if (t.includes("שין ספלינט") || t.includes("שוקיים")) return "כאב בשוקיים דורש הפחתת עומס ריצה מיידית ומעבר לאימון קרוס (שחייה/אופניים) לכמה ימים. אם הכאב נמשך, פנו לפיזיותרפיסט.";
  if (t.includes("פציעה") || t.includes("כואב")) return "אל תתאמנו דרך כאב חד. מנוחה יחסית, קרח ב-48 השעות הראשונות, ופנייה לאיש מקצוע אם אין שיפור תוך 3-4 ימים.";
  return "שאלה טובה. בגדול - התמידו, בנו עומס בהדרגה, ותנו לגוף להתאושש.";
}

function generateMockProgram(goal, unitName, level) {
  return WAR_WEEKS.slice(0, 4).map((w, i) => ({
    week: i + 1,
    title: `שבוע ${i + 1} - ${level || "כללי"}`,
    items: [
      `ריצה מותאמת ל${goal || "המטרה שלך"}`,
      i % 2 === 0 ? "אימון כוח משקל גוף מלא" : "אימון כוח מפוצל + ליבה",
      unitName ? `תרגול ספציפי לדרישות ${unitName}` : "עבודת סיבולת שטח",
    ],
  }));
}

/* ============================== SMALL UI ATOMS ============================== */

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/60 shadow-2xl shadow-black/50 ring-1 ring-white/[0.03] transition-all duration-300 ease-out hover:border-emerald-500/40 hover:shadow-emerald-500/10 ${className}`}>
      {children}
    </div>
  );
}

// ---- Error Boundary: catches render crashes anywhere below it so a bug in one
// screen doesn't take down the whole app to a blank/black screen. Shows a
// friendly recovery UI instead, with a "try again" (re-mount) and full reload option. ----
// The evaluator's flow: enter the 6-digit code (no account needed), see the
// trainee's name and every act of the simulation, and record results act by act.
// Every read/write here goes through the code-gated RPCs only - this component
// never touches any other table directly.
function EvaluatorFlow({ onBack }) {
  const [code, setCode] = useState("");
  const [session, setSession] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openActIndex, setOpenActIndex] = useState(0);
  const [savingAct, setSavingAct] = useState(null);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [improvingNoteIndex, setImprovingNoteIndex] = useState(null);
  const [liveCheckIndex, setLiveCheckIndex] = useState(null);
  const [liveCheckText, setLiveCheckText] = useState("");

  async function improveNoteWithAi(actIndex, act) {
    const current = results[actIndex]?.notes || "";
    if (!current.trim()) { setError("כתוב קודם כמה מילים או נקודות"); return; }
    setImprovingNoteIndex(actIndex);
    try {
      const sys = "אתה מגבש בכיר. קיבלת הערה קצרה או נקודות מגבש אחר על ביצוע מתגבש באקט מסוים. נסח אותה מחדש כהערה מקצועית, ברורה ותמציתית (1-2 משפטים), בלי להמציא פרטים שלא נכתבו.";
      const reply = await aiChat(sys, `האקט: ${act.name}. ההערה: ${current}`);
      updateActNotes(actIndex, reply.trim());
    } catch (e) {
      setError("שגיאה בעזרת הניסוח");
    } finally {
      setImprovingNoteIndex(null);
    }
  }
  async function getLiveConsistencyCheck(actIndex, act) {
    setLiveCheckIndex(actIndex);
    setLiveCheckText("");
    try {
      const doneSoFar = session.acts.slice(0, actIndex + 1).map((a, i) => {
        const r = results[i];
        if (!r) return null;
        const dataStr = Object.entries(r.data || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `${a.name}: ${dataStr}${r.notes ? " (" + r.notes + ")" : ""}`;
      }).filter(Boolean).join("\n");
      const sys = "אתה מגבש בכיר עם ניסיון. קיבלת תוצאות עד כה של מתגבש בסימולציה. תן משפט קצר אחד - האם משהו נראה לא עקבי או חריג (חיובי או שלילי) שכדאי לשים לב אליו, או שהכל נראה סביר. תשובה קצרה מאוד, בלי הקדמות.";
      const reply = await aiChat(sys, doneSoFar || "אין עדיין נתונים");
      setLiveCheckText(reply);
    } catch (e) {
      setLiveCheckText("לא הצלחתי לבדוק כרגע");
    } finally {
      setLiveCheckIndex(null);
    }
  }

  async function lookupCode() {
    if (code.trim().length !== 6) { setError("קוד חייב להיות 6 ספרות"); return; }
    setLoading(true);
    setError("");
    try {
      const s = await getSessionByCode(code.trim());
      if (!s) { setError("קוד לא נמצא - בדוק שוב"); setLoading(false); return; }
      setSession(s);
      const existing = await getActResultsByCode(code.trim());
      const map = {};
      existing.forEach((r) => { map[r.actIndex] = { data: r.data, notes: r.notes || "", done: true }; });
      setResults(map);
      const firstUndone = s.acts.findIndex((_, i) => !map[i]);
      setOpenActIndex(firstUndone === -1 ? 0 : firstUndone);
    } catch (e) {
      setError("שגיאה בחיפוש הקוד");
    } finally {
      setLoading(false);
    }
  }

  function updateActField(actIndex, field, value) {
    setResults((prev) => ({ ...prev, [actIndex]: { ...prev[actIndex], data: { ...(prev[actIndex]?.data || {}), [field]: value }, done: prev[actIndex]?.done || false } }));
  }
  function updateActNotes(actIndex, notes) {
    setResults((prev) => ({ ...prev, [actIndex]: { ...prev[actIndex], notes, done: prev[actIndex]?.done || false } }));
  }
  async function saveAct(actIndex, act) {
    setSavingAct(actIndex);
    try {
      const entry = results[actIndex] || { data: {}, notes: "" };
      await submitActResultByCode(code.trim(), actIndex, act.name, entry.data, entry.notes);
      setResults((prev) => ({ ...prev, [actIndex]: { ...prev[actIndex], done: true } }));
      const nextUndone = session.acts.findIndex((_, i) => i > actIndex && !results[i]?.done);
      if (nextUndone !== -1) setOpenActIndex(nextUndone);
    } catch (e) {
      setError("שגיאה בשמירת האקט");
    } finally {
      setSavingAct(null);
    }
  }

  async function getVerdict() {
    setVerdictLoading(true);
    try {
      const allNotes = session.acts.map((act, i) => {
        const r = results[i];
        if (!r) return `${act.name}: לא בוצע`;
        const dataStr = Object.entries(r.data || {}).map(([k, v]) => `${k}: ${v}`).join(", ");
        return `${act.name} (${act.type}): ${dataStr}${r.notes ? " | הערות מגבש: " + r.notes : ""}`;
      }).join("\n");
      const sys = `אתה מגבש בכיר ומעריך מיון ליחידות עילית בצה"ל, עם ניסיון רב בקביעת מי עובר גיבוש. קיבלת את כל התוצאות וההערות שמגבש אחר רשם על מתגבש שעבר סימולציית גיבוש "${session.simulationTitle}". תפקידך: לנתח את הביצועים בכל האקטים, איכות ההשתתפות, וההערות, ולקבוע פסק דין. החזר אך ורק JSON בפורמט: {"verdict": "עבר" או "לא עבר" או "גבולי", "reasoning": "2-4 משפטים המסבירים את ההחלטה, מתייחסים לאקטים ספציפיים"}`;
      const reply = await aiChat(sys, `תוצאות הסימולציה של ${session.traineeName}:\n${allNotes}`);
      const match = reply.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : { verdict: "לא ידוע", reasoning: reply };
      setVerdict(parsed);
      await finalizeSimulationVerdict(session.sessionId, parsed.verdict, parsed.reasoning);
    } catch (e) {
      setError("שגיאה בקבלת פסק דין מה-AI");
    } finally {
      setVerdictLoading(false);
    }
  }

  const completedCount = Object.values(results).filter((r) => r?.done).length;
  const allDone = session && completedCount === session.acts.length;

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen" dir="rtl">
        <button onClick={onBack} className="absolute top-5 right-5 text-zinc-500 flex items-center gap-1 text-sm font-bold"><ChevronRight size={14} /> חזרה</button>
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border-2 border-red-500/50 flex items-center justify-center mb-4">
          <ClipboardCheck size={28} className="text-red-400" />
        </div>
        <div className="text-lg font-black text-zinc-100 mb-2">הזנת קוד סימולציה</div>
        <div className="text-[13px] text-zinc-500 mb-5 text-center max-w-xs">הזן/י את הקוד בן 6 הספרות שקיבלת מהמתגבש</div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          onKeyDown={(e) => e.key === "Enter" && lookupCode()}
          placeholder="000000"
          dir="ltr"
          className="w-full max-w-[220px] text-center text-3xl font-black tracking-[0.3em] bg-zinc-950 border-2 border-zinc-700 rounded-2xl py-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 mb-3"
        />
        {error && <div className="text-red-400 text-[13px] font-bold mb-3">{error}</div>}
        <button onClick={lookupCode} disabled={loading} className="w-full max-w-[220px] rounded-2xl py-3 font-black text-white bg-red-500 disabled:opacity-50">
          {loading ? "מחפש..." : "המשך"}
        </button>
      </div>
    );
  }

  if (verdict) {
    const vHex = verdict.verdict === "עבר" ? "#10b981" : verdict.verdict === "לא עבר" ? "#ef4444" : "#f59e0b";
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen text-center" dir="rtl">
        <div className="text-5xl mb-3">{verdict.verdict === "עבר" ? "🏆" : verdict.verdict === "לא עבר" ? "❌" : "⚠️"}</div>
        <div className="text-2xl font-black mb-2" style={{ color: vHex }}>{verdict.verdict}</div>
        <div className="text-[14px] text-zinc-300 mb-6 max-w-sm leading-relaxed">{verdict.reasoning}</div>
        <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-right mb-4 max-h-64 overflow-y-auto">
          <div className="text-[12px] font-black text-zinc-400 mb-2">דו"ח תוצאות מלא - {session.traineeName}</div>
          {session.acts.map((act, i) => {
            const r = results[i];
            return (
              <div key={i} className="text-[11px] text-zinc-500 border-b border-zinc-800 py-1.5 last:border-0">
                <span className="font-bold text-zinc-300">{act.name}</span>{r?.data && Object.keys(r.data).length > 0 ? ` - ${Object.values(r.data).join(", ")}` : ""}{r?.notes ? ` (${r.notes})` : r ? "" : " - לא בוצע"}
              </div>
            );
          })}
        </div>
        <button onClick={onBack} className="text-[13px] font-bold text-zinc-500">סיום</button>
      </div>
    );
  }

  const [sessionStartTime] = useState(() => Date.now());
  const [confirmedStart, setConfirmedStart] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsedMinutes(Math.floor((Date.now() - sessionStartTime) / 60000)), 30000);
    return () => clearInterval(id);
  }, [sessionStartTime]);
  function jumpToNextUnfilled() {
    const next = session.acts.findIndex((_, i) => !results[i]?.done);
    if (next === -1) { setOpenActIndex(-1); return; }
    setOpenActIndex(next);
    document.getElementById(`eval-act-${next}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen p-4 pb-8" dir="rtl">
      <button onClick={onBack} className="flex items-center gap-1 text-zinc-500 text-sm font-bold mb-4"><ChevronRight size={14} /> יציאה</button>
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-500 font-bold">מעריך/ה את</div>
            <div className="text-lg font-black text-white">{session.traineeName}</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-bold bg-black/30 rounded-full px-2.5 py-1">
            <Clock size={11} /> {elapsedMinutes} דק׳
          </div>
        </div>
        <div className="text-[12px] text-zinc-400">{session.simulationTitle}</div>
        <div className="mt-2 h-2 rounded-full bg-black/40 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(completedCount / session.acts.length) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-[11px] text-zinc-500">{completedCount}/{session.acts.length} אקטים הושלמו</div>
          {!allDone && (
            <button onClick={jumpToNextUnfilled} className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              לאקט הבא <ChevronLeft size={11} />
            </button>
          )}
        </div>
      </div>

      {allDone && !verdict && (
        <button onClick={getVerdict} disabled={verdictLoading} className="w-full rounded-2xl py-3.5 font-black text-white bg-gradient-to-l from-violet-600 to-violet-500 mb-4 disabled:opacity-60">
          {verdictLoading ? "ה-AI שוקל..." : "קבל פסק דין AI סופי"}
        </button>
      )}

      {!confirmedStart ? (
        <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(150deg, #6b6144, #4a3f2e)", boxShadow: "0 0 0 1.5px #8a7a52 inset" }}>
          <div className="text-[14px] font-black text-[#e8dcc0] mb-1.5">רואה את כל {session.acts.length} האקטים של הגיבוש</div>
          {session.scheduledAt && (
            <div className="text-[13px] font-bold mb-2 flex items-center justify-center gap-1.5" style={{ color: "#f0e6c8" }}>
              <Clock size={13} /> מועד: {new Date(session.scheduledAt).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          {session.canEnter ? (
            <>
              <div className="text-[12px] text-[#cabb96] mb-4 leading-relaxed">לחיצה על הכפתור מתחילה את המדידה בפועל - מרגע זה אפשר למלא נתונים בכל אקט</div>
              <button onClick={() => setConfirmedStart(true)} className="w-full rounded-2xl py-3 font-black text-[#2a2418]" style={{ backgroundColor: "#c9ba91" }}>
                אישור תחילת גיבוש - כאן הכל מתחיל
              </button>
            </>
          ) : (
            <div className="text-[13px] font-bold text-[#e8b8b8] bg-black/20 rounded-xl p-3">
              עדיין מוקדם מדי - ניתן להיכנס רק מ-30 דקות לפני המועד ועד 30 דקות אחריו
            </div>
          )}
        </div>
      ) : (
      <div className="space-y-2">
        {session.acts.map((act, i) => {
          const isOpen = openActIndex === i;
          const r = results[i];
          return (
            <div id={`eval-act-${i}`} key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: r?.done ? "#10b98150" : "#27272a", background: r?.done ? "#10b98110" : "#18181b" }}>
              <button onClick={() => setOpenActIndex(isOpen ? -1 : i)} className="w-full flex items-center gap-3 p-3.5 text-right">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: r?.done ? "#10b981" : "#27272a" }}>
                  {r?.done ? <Check size={14} className="text-black" /> : <span className="text-[11px] font-black text-zinc-400">{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-zinc-200">{act.name}</div>
                  <div className="text-[10px] text-zinc-600">{act.time}</div>
                </div>
                <ChevronDown size={16} className={`text-zinc-600 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 space-y-2">
                  <div className="text-[12px] text-zinc-500 bg-black/30 rounded-lg p-2.5">{act.details}</div>
                  {act.inputType === "checkbox" && (
                    <div className="text-[12px] text-zinc-400">אקט ללא נתונים למדידה - סמן/י בוצע</div>
                  )}
                  {act.inputType === "rating" && (
                    <div>
                      <div className="text-[11px] text-zinc-500 font-bold mb-1.5 flex items-center gap-1.5">
                        <span>דירוג 1-10</span>
                        <span className="text-zinc-600 font-normal">(1-3 חלש · 4-6 סביר · 7-8 טוב · 9-10 יוצא דופן)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 10 }).map((_, n) => (
                          <button key={n} onClick={() => updateActField(i, "rating", n + 1)} className="w-8 h-8 rounded-lg text-[12px] font-bold border" style={r?.data?.rating === n + 1 ? { backgroundColor: "#10b981", color: "#000", borderColor: "#10b981" } : { borderColor: "#3f3f46", color: "#a1a1aa" }}>
                            {n + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {act.inputType === "time_and_notes" && act.type === "run_test" && (
                    <div>
                      <div className="text-[11px] text-zinc-500 font-bold mb-1.5">זמן ריצה (בשניות)</div>
                      <input type="number" value={r?.data?.seconds || ""} onChange={(e) => updateActField(i, "seconds", e.target.value)} placeholder="למשל 205 (=3:25)" dir="ltr" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                    </div>
                  )}
                  {act.inputType === "time_and_notes" && (act.type === "crawl" || act.type === "crawl_relay") && (
                    <div className="space-y-2">
                      <input value={r?.data?.keep || ""} onChange={(e) => updateActField(i, "keep", e.target.value)} placeholder="מה לשמר באקט הזה" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                      <input value={r?.data?.improve || ""} onChange={(e) => updateActField(i, "improve", e.target.value)} placeholder="מה לשפר באקט הזה" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                    </div>
                  )}
                  {act.inputType === "time_and_notes" && act.type === "tzukon" && (
                    <div>
                      <div className="text-[11px] text-zinc-500 font-bold mb-1.5">מספר עליות ב-20 הדקות</div>
                      <input type="number" value={r?.data?.reps || ""} onChange={(e) => updateActField(i, "reps", e.target.value)} placeholder="מספר עליות שבוצעו" dir="ltr" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                    </div>
                  )}
                  {act.inputType === "time_and_notes" && !["run_test", "crawl", "crawl_relay", "tzukon"].includes(act.type) && (
                    <input value={r?.data?.time || ""} onChange={(e) => updateActField(i, "time", e.target.value)} placeholder="זמן/תוצאה (למשל 3:20 או 18 סבבים הושלמו)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                  )}
                  {act.inputType === "ai_analysis" && (
                    <textarea value={r?.data?.response || ""} onChange={(e) => updateActField(i, "response", e.target.value)} placeholder="תאר את התגובה/פתרון המתגבש למקרה שהוצג" rows={2} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 resize-none" />
                  )}
                  <div className="relative">
                    <textarea value={r?.notes || ""} onChange={(e) => updateActNotes(i, e.target.value)} placeholder="הערות נוספות (יועברו ל-AI לפסק הדין הסופי)" rows={2} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 pl-16 text-[13px] text-zinc-100 placeholder-zinc-600 resize-none" />
                    <button onClick={() => improveNoteWithAi(i, act)} disabled={improvingNoteIndex === i} className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-violet-500/15 px-1.5 py-1 text-[10px] font-bold text-violet-400 disabled:opacity-50">
                      {improvingNoteIndex === i ? <Loader2 size={10} className="animate-spin" /> : <Bot size={10} />} נסח
                    </button>
                  </div>
                  <button onClick={() => getLiveConsistencyCheck(i, act)} disabled={liveCheckIndex === i} className="w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-bold text-violet-400 bg-violet-500/10 disabled:opacity-50">
                    {liveCheckIndex === i ? <Loader2 size={11} className="animate-spin" /> : <Bot size={11} />} בדיקת AI - האם משהו חריג עד כה?
                  </button>
                  {liveCheckIndex === null && liveCheckText && (
                    <div className="text-[11px] text-violet-300 bg-violet-500/[0.06] border border-violet-500/20 rounded-lg p-2">{liveCheckText}</div>
                  )}
                  <button onClick={() => saveAct(i, act)} disabled={savingAct === i} className="w-full rounded-lg py-2 font-bold text-black bg-emerald-500 text-[13px] disabled:opacity-50">
                    {savingAct === i ? "שומר..." : r?.done ? "עדכן ✓" : "סמן כבוצע ✓"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("SayertTracking crash caught by ErrorBoundary:", error, info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center mb-4">
            <AlertTriangle size={26} className="text-red-400" />
          </div>
          <div className="text-lg font-black text-zinc-100 mb-1.5">משהו השתבש</div>
          <div className="text-[13px] text-zinc-500 mb-5 max-w-xs leading-relaxed">
            קרתה תקלה לא צפויה במסך הזה. אפשר לנסות שוב, וזה בדרך כלל נפתר.
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-xl py-2.5 text-sm font-bold bg-emerald-500 text-black active:scale-95 transition"
            >
              נסה שוב
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl py-2.5 text-sm font-bold bg-zinc-800 text-zinc-300 active:scale-95 transition"
            >
              רענן את האפליקציה
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Reusable "this feature needs premium" screen - shown in place of a gated
// feature's real content, with a clear path to the upgrade flow.
function PremiumStatusToggle({ isPremium, size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isSmall ? "w-9 h-5" : "w-12 h-6.5"} rounded-full transition-colors duration-300`} style={{ backgroundColor: isPremium ? "#10b981" : "#3f3f46" }}>
        <div
          className={`absolute top-0.5 ${isSmall ? "w-4 h-4" : "w-5 h-5"} rounded-full bg-white transition-all duration-300`}
          style={{ [isPremium ? "left" : "right"]: 2 }}
        />
      </div>
      <span className={`${isSmall ? "text-[9px]" : "text-[11px]"} font-black uppercase`} style={{ color: isPremium ? "#10b981" : "#71717a" }}>
        {isPremium ? "ON" : "OFF"}
      </span>
    </div>
  );
}

function PremiumLock({ title, description, icon: Icon = Lock }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-amber-400" />
      </div>
      <div className="text-lg font-black text-zinc-100 mb-2">{title}</div>
      <div className="text-[13px] text-zinc-500 mb-6 max-w-xs leading-relaxed">{description}</div>
      <div className="rounded-2xl px-5 py-3.5 flex flex-col items-center gap-2" style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1.5px #3f3f4680 inset" }}>
        <span className="text-[13px] font-bold text-zinc-400">אינך מנוי</span>
        <PremiumStatusToggle isPremium={false} />
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children, tone = "emerald" }) {
  const toneMap = {
    emerald: { text: "text-emerald-400", hex: "#10b981" },
    amber: { text: "text-amber-400", hex: "#f59e0b" },
    red: { text: "text-red-400", hex: "#ef4444" },
  };
  const t = toneMap[tone];
  return (
    <div className="flex items-center gap-2.5 mb-3">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-black/40 border flex items-center justify-center shrink-0" style={{ borderColor: `${t.hex}40`, boxShadow: `0 0 10px ${t.hex}25` }}>
          <Icon size={14} className={t.text} />
        </div>
      )}
      <h3 className="text-base font-bold tracking-wide text-zinc-100">{children}</h3>
    </div>
  );
}

function BrandEmblem({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emblemFill2" x1="50" y1="4" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#10b981" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#065f46" stopOpacity="0.02" />
        </linearGradient>
        <filter id="emblemGlow2" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="soft" />
          <feMerge><feMergeNode in="soft" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* outer hex frame */}
      <path d="M50 3 L91 26 V74 L50 97 L9 74 V26 Z" fill="url(#emblemFill2)" stroke="#10b981" strokeWidth="1.4" opacity="0.9" />
      {/* inner rotated hex, offset for layered tech look */}
      <path d="M50 12 L82 30.5 V69.5 L50 88 L18 69.5 V30.5 Z" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.55" strokeDasharray="3 3" />

      {/* circuit traces off the corners */}
      <g stroke="#34d399" strokeWidth="1" opacity="0.5" strokeLinecap="round">
        <path d="M9 26 H2 M9 26 V19" />
        <path d="M91 26 H98 M91 26 V19" />
        <path d="M9 74 H2 M9 74 V81" />
        <path d="M91 74 H98 M91 74 V81" />
      </g>
      <g fill="#34d399" opacity="0.7">
        <circle cx="2" cy="26" r="1.4" />
        <circle cx="98" cy="26" r="1.4" />
        <circle cx="2" cy="74" r="1.4" />
        <circle cx="98" cy="74" r="1.4" />
      </g>

      {/* targeting reticle */}
      <g filter="url(#emblemGlow2)">
        <circle cx="50" cy="50" r="17" stroke="#6ee7b7" strokeWidth="1" opacity="0.5" fill="none" />
        <circle cx="50" cy="50" r="1.6" fill="#d1fae5" />
        <path d="M50 30 V37 M50 63 V70 M30 50 H37 M63 50 H70" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* ascending chevron - elite / rising mark */}
      <g filter="url(#emblemGlow2)">
        <path d="M32 58 L50 42 L68 58" stroke="#34d399" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 66 L50 55 L62 66" stroke="#a7f3d0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      </g>
    </svg>
  );
}

function Pill({ children, tone = "zinc" }) {
  const toneMap = {
    zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[13px] font-semibold border ${toneMap[tone]}`}>{children}</span>;
}

function GlowButton({ children, onClick, tone = "emerald", icon: Icon, className = "", disabled }) {
  const toneMap = {
    emerald: "bg-gradient-to-l from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-black font-black shadow-emerald-500/40 hover:shadow-emerald-400/60 hover:shadow-xl hover:scale-[1.02]",
    amber: "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30 hover:shadow-amber-400/50 hover:shadow-xl hover:scale-[1.02]",
    red: "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 hover:shadow-red-500/50 hover:shadow-xl hover:scale-[1.02]",
    ghost: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 shadow-none border border-zinc-700",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-base font-bold shadow-lg transition-all duration-300 ease-out active:scale-95 disabled:opacity-40 disabled:active:scale-100 disabled:hover:shadow-lg disabled:hover:scale-100 ${toneMap[tone]} ${className}`}
    >
      {Icon && <Icon size={16} className={Icon === Loader2 ? "animate-spin" : ""} />}
      {children}
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const toneMap = {
    success: "bg-emerald-500 text-black",
    error: "bg-red-600 text-white",
    info: "bg-zinc-800 text-zinc-100 border border-zinc-700",
  };
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-[85%] px-1 py-1 rounded-xl text-base font-bold">
      <div className={`px-4 py-2.5 rounded-xl shadow-2xl ${toneMap[toast.tone]}`}>{toast.msg}</div>
    </div>
  );
}

/* ============================== RATING BUTTONS (1-5) ============================== */

function RatingButtons({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 rounded-lg py-2 text-base font-black border transition ${
            value === n ? "bg-emerald-500 border-emerald-500 text-black" : "bg-zinc-900 border-zinc-800 text-zinc-400"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ============================== INTRO CAROUSEL ============================== */

function IntroCarousel({ onDone }) {
  function finish() {
    try { localStorage.setItem("sayert_intro_seen", "true"); } catch (e) {}
    onDone();
  }

  const FEATURES = [
    { icon: Bot, title: "מאמן AI אישי", desc: "צ׳אט חכם שעונה על כל שאלה, בכל שעה", hex: "#10b981" },
    { icon: CalendarDays, title: "יומן חכם", desc: "אימונים אישיים וקבוצתיים במקום אחד", hex: "#38bdf8" },
    { icon: Shield, title: "מאגר יחידות", desc: "כל מה שצריך לדעת על היעד הקרבי שלך", hex: "#f59e0b" },
    { icon: TrendingUp, title: "מעקב התקדמות", desc: "משוב אישי ומעקב אימונים לאורך זמן", hex: "#a78bfa" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="w-48 h-48 sm:w-56 sm:h-56 mb-2">
            <img src={logoImg} alt="SayertTracking" className="w-full h-full object-contain" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-zinc-50 tracking-wide">SayertTracking</div>
          <div className="w-10 h-px bg-emerald-500/40 my-2" />
          <div className="text-base sm:text-base text-zinc-500">המעטפת לסיירת - הדרך שלך ליחידות העילית</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="rounded-2xl bg-zinc-900/70 backdrop-blur-md border border-zinc-800/60 p-4 sm:p-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black border flex items-center justify-center mb-2.5" style={{ borderColor: `${f.hex}50`, boxShadow: `0 0 12px ${f.hex}25` }}>
                <f.icon size={18} style={{ color: f.hex }} />
              </div>
              <div className="text-base sm:text-base font-black text-zinc-100 mb-0.5">{f.title}</div>
              <div className="text-[13px] sm:text-sm text-zinc-500 leading-snug">{f.desc}</div>
            </div>
          ))}
        </div>

        <GlowButton tone="emerald" className="w-full" icon={ChevronLeft} onClick={finish}>
          בואו נתחיל
        </GlowButton>
      </div>
    </div>
  );
}

/* ============================== AUTH SCREEN ============================== */

function AuthScreen({ onAuthed, showToast }) {
  const [screen, setScreen] = useState("choice"); // 'choice' | 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [networkCode, setNetworkCode] = useState("");
  const [coachCode, setCoachCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [taglineIdx, setTaglineIdx] = useState(0);
  const TAGLINES = [
    "כל אימון מקרב אותך למטרה",
    "מי שמתאמן היום, מוביל מחר",
    "הדרך ליחידות העילית מתחילה כאן",
    "עקביות מנצחת כישרון",
  ];
  useEffect(() => {
    const id = setInterval(() => setTaglineIdx((i) => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const useRealAuth = Boolean(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
  const mode = screen === "signup" || screen === "individual_signup" ? "signup" : "login";

  async function submit() {
    setError("");
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) { setError("נא למלא אימייל וסיסמה"); return; }
    if (!EMAIL_RE.test(cleanEmail)) { setError("כתובת האימייל לא תקינה"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password.length < 6) throw new Error("הסיסמה חייבת להכיל לפחות 6 תווים");
        if (password !== confirm) throw new Error("הסיסמאות אינן תואמות");

        if (screen === "individual_signup") {
          if (useRealAuth) {
            const authData = await supabaseSignUp(cleanEmail, password, { role: "trainee", account_type: "individual" });
            if (authData.access_token) {
              persistSession(authData);
              const appUser = await fetchOwnProfile(authData.user?.id);
              if (!appUser) throw new Error("נרשמת אך הפרופיל טרם נוצר, נסה/י להתחבר בעוד רגע");
              showToast("נרשמת בהצלחה!", "success");
              onAuthed(appUser);
            } else {
              showToast("נרשמת בהצלחה - כעת ניתן להתחבר", "success");
              setScreen("login"); setPassword(""); setConfirm("");
            }
          } else {
            const users = await storageGetList("app_users");
            if (users.some((u) => u.email.toLowerCase() === cleanEmail.toLowerCase())) throw new Error("כבר קיים משתמש עם אימייל זה");
            const passwordHash = await hashPassword(password);
            const newUser = {
              id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              email: cleanEmail, passwordHash, network: null, accountType: "individual",
              role: "trainee", createdAt: new Date().toISOString(), onboarded: false, profile: null,
            };
            await storageSetList("app_users", [...users, newUser]);
            showToast("נרשמת בהצלחה!", "success");
            onAuthed(newUser);
          }
          setLoading(false);
          return;
        }

        const networkResult = await verifyNetworkCode(networkCode.trim());
        if (!networkResult) throw new Error("קוד רשת שגוי");
        const networkId = networkResult.id;
        const requiresPayment = networkResult.requiresPayment;
        const wantsCoach = coachCode.trim() === "12345123";

        if (useRealAuth) {
          // The server trigger checks coach_code itself and assigns the role -
          // the client's claim alone is never trusted, even here. Every new
          // signup is also auto-confirmed server-side now, so this logs
          // straight in for every user, no email step for anyone.
          const authData = await supabaseSignUp(cleanEmail, password, { role: "trainee", network: networkId, coach_code: coachCode.trim(), requires_payment: requiresPayment });
          if (authData.access_token) {
            persistSession(authData);
            const appUser = await fetchOwnProfile(authData.user?.id);
            if (!appUser) throw new Error("נרשמת אך הפרופיל טרם נוצר, נסה/י להתחבר בעוד רגע");
            showToast("נרשמת בהצלחה!", "success");
            onAuthed(appUser);
          } else {
            showToast("נרשמת בהצלחה - כעת ניתן להתחבר", "success");
            setScreen("login"); setPassword(""); setConfirm("");
          }
        } else {
          const users = await storageGetList("app_users");
          if (users.some((u) => u.email.toLowerCase() === cleanEmail.toLowerCase())) throw new Error("כבר קיים משתמש עם אימייל זה");
          const passwordHash = await hashPassword(password);
          const newUser = {
            id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            email: cleanEmail, passwordHash, network: networkId, requiresPayment,
            role: wantsCoach ? "admin" : "trainee",
            createdAt: new Date().toISOString(),
            onboarded: wantsCoach, profile: null,
          };
          await storageSetList("app_users", [...users, newUser]);
          showToast("נרשמת בהצלחה!", "success");
          onAuthed(newUser);
        }
      } else {
        if (useRealAuth) {
          const authData = await supabaseLogin(cleanEmail, password);
          persistSession(authData);
          const appUser = await fetchOwnProfile(authData.user?.id);
          if (!appUser) throw new Error("משתמש לא נמצא במערכת");
          showToast(`ברוך שובך, ${appUser.email.split("@")[0]}`, "success");
          onAuthed(appUser);
        } else {
          const users = await storageGetList("app_users");
          const user = users.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase());
          if (!user) throw new Error("משתמש לא נמצא");
          const hash = await hashPassword(password);
          if (hash !== user.passwordHash) throw new Error("סיסמה שגויה");
          showToast(`ברוך שובך, ${user.email.split("@")[0]}`, "success");
          onAuthed(user);
        }
      }
    } catch (e) {
      setError(e.message || "שגיאה, נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  const logo = (
    <div className="flex flex-col items-center mb-4">
      <div className="mb-1" style={{ width: 136, height: 136 }}>
        <img src={logoImg} alt="SayertTracking" className="w-full h-full object-contain" />
      </div>
      <div className="text-2xl font-black text-zinc-50 tracking-wide">SayertTracking</div>
      <div className="w-8 h-px bg-emerald-500/40 my-1.5" />
      <div className="text-sm text-zinc-500 tracking-wide">המעטפת לסיירת</div>
    </div>
  );

  // Screen 1: choice - just two big buttons, no fields at all yet
  const authParticles = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-emerald-500"
          style={{
            width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2,
            left: `${(i * 29) % 100}%`, top: `${(i * 53) % 100}%`,
            opacity: 0.25,
            animation: `authFloat ${6 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes authFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-24px) translateX(8px); }
        }
        @keyframes screenFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  if (screen === "choice") {
    return (
      <div key="choice" className="flex-1 flex flex-col items-center p-5 relative overflow-y-auto overflow-x-hidden" style={{ justifyContent: "safe center", animation: "screenFadeIn 0.35s ease-out" }}>
        {authParticles}
        <style>{`
          @keyframes ambientHueShift { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }
          @keyframes titleGradientMove { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes logoRingPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35), 0 0 20px 2px rgba(16,185,129,0.25); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,0), 0 0 30px 4px rgba(16,185,129,0.4); } }
          @keyframes badgeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes choiceFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes choiceShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes chipGlowSeq { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
          @keyframes cornerPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
          @keyframes individualShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes conicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes blobDrift1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-15px) scale(1.15); } }
          @keyframes blobDrift2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-18px,18px) scale(0.9); } }
          @keyframes watermarkPulse { 0%, 100% { opacity: 0.03; transform: scale(1); } 50% { opacity: 0.06; transform: scale(1.04); } }
          @keyframes scanSweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(600%); } }
          @keyframes crumbFloat { 0%, 100% { transform: translateY(0); opacity: 0.25; } 50% { transform: translateY(-8px); opacity: 0.6; } }
          @keyframes statCountFade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes underlineCycle { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
          @keyframes buttonRipple { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 100% { box-shadow: 0 0 0 10px rgba(16,185,129,0); } }
          @keyframes iconCycle { 0%, 30% { opacity: 1; transform: scale(1); } 33%, 63% { opacity: 0; transform: scale(0.7); } 66%, 96% { opacity: 0; } 100% { opacity: 1; transform: scale(1); } }
          @keyframes grainShift { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-1.5%, -1%); } }
        `}</style>

        {/* Ambient shifting gradient wash */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 60% at 50% 15%, rgba(16,185,129,0.12), transparent 60%)", animation: "ambientHueShift 6s ease-in-out infinite" }} />
        {/* Slow-drifting gradient blobs (mesh feel) */}
        <div className="absolute top-10 -right-10 w-56 h-56 rounded-full blur-3xl opacity-20 bg-emerald-500 pointer-events-none" style={{ animation: "blobDrift1 9s ease-in-out infinite" }} />
        <div className="absolute bottom-24 -left-10 w-48 h-48 rounded-full blur-3xl opacity-15 bg-violet-500 pointer-events-none" style={{ animation: "blobDrift2 11s ease-in-out infinite" }} />
        {/* Large pulsing crosshair watermark */}
        <Crosshair size={340} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" style={{ animation: "watermarkPulse 5s ease-in-out infinite" }} />
        {/* Scanline/grid overlay */}
        <div className="absolute inset-0 pointer-events-none tech-grid opacity-40" />
        {/* Periodic scan sweep */}
        <div className="absolute inset-x-0 h-32 pointer-events-none opacity-30" style={{ background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.15), transparent)", animation: "scanSweep 6s linear infinite" }} />
        {/* Film grain texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", animation: "grainShift 0.5s steps(2) infinite" }} />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
        {/* HUD corner brackets */}
        {[["top-3 right-3", "border-t-2 border-r-2"], ["top-3 left-3", "border-t-2 border-l-2"], ["bottom-3 right-3", "border-b-2 border-r-2"], ["bottom-3 left-3", "border-b-2 border-l-2"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${border} border-emerald-500/40 pointer-events-none`} style={{ animation: `cornerPulse 3s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
        {/* Floating dust crumbs */}
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full bg-emerald-400 pointer-events-none" style={{ left: `${(i * 31 + 8) % 92}%`, top: `${(i * 47 + 10) % 85}%`, animation: `crumbFloat ${4 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}

        <div className="w-full max-w-xs relative" style={{ animation: "choiceFadeUp 0.4s ease-out 0s both" }}>
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-1" style={{ width: 136, height: 136 }}>
              {/* Rotating conic ring behind logo */}
              <div className="absolute -inset-2 rounded-full opacity-40" style={{ background: "conic-gradient(from 0deg, #10b981, transparent 30%, transparent 70%, #10b981)", animation: "conicSpin 7s linear infinite" }} />
              <div className="absolute inset-0 rounded-full" style={{ animation: "logoRingPulse 3s ease-in-out infinite" }} />
              <img src={logoImg} alt="SayertTracking" className="w-full h-full object-contain relative z-10" />
              <div className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-black border-2 border-emerald-500/60 flex items-center justify-center z-20" style={{ animation: "badgeSpin 8s linear infinite" }}>
                <Shield size={14} className="text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-wide bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #10b981, #6ee7b7, #10b981)", backgroundSize: "200% auto", animation: "titleGradientMove 4s ease-in-out infinite" }}>SayertTracking</div>
            <div className="w-10 h-1 rounded-full my-1.5" style={{ backgroundImage: "linear-gradient(90deg, #10b981, #6ee7b7, #a855f7, #10b981)", backgroundSize: "300% auto", animation: "underlineCycle 5s ease-in-out infinite" }} />
            <div className="text-sm text-zinc-500 tracking-wide">המעטפת לסיירת</div>
          </div>
          <div className="h-6 flex items-center justify-center mb-3 overflow-hidden">
            <div key={taglineIdx} className="text-[13px] text-emerald-400/80 font-semibold" style={{ animation: "taglineFade 3.2s ease-in-out" }}>
              {TAGLINES[taglineIdx]}
            </div>
          </div>
          <style>{`
            @keyframes taglineFade {
              0% { opacity: 0; transform: translateY(4px); }
              12% { opacity: 1; transform: translateY(0); }
              85% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>

          <div className="relative" style={{ animation: "choiceFadeUp 0.4s ease-out 0.1s both" }}>
            <Card className="p-5 space-y-3 tech-grid tech-corners border-2 border-emerald-500/25 glow-pulse relative overflow-hidden" style={{ ...glowVars("#10b981"), backdropFilter: "blur(6px)" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.1), transparent)", animation: "choiceShimmer 4.5s ease-in-out 1s infinite" }} />
              </div>
              <button
                onClick={() => setScreen("login")}
                className="relative w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-black overflow-hidden"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                <span className="absolute inset-0 rounded-2xl" style={{ animation: "buttonRipple 2.4s ease-out infinite" }} />
                <span className="relative">יש לי כבר חשבון - התחברות</span>
                <ChevronLeft size={17} className="relative" />
              </button>
            </Card>
          </div>

          <button
            onClick={() => setScreen("individual_signup")}
            className="relative w-full flex items-center gap-3.5 rounded-2xl px-4 py-4 overflow-hidden active:scale-[0.97] transition mt-3"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.16), rgba(24,24,27,0.7))", boxShadow: "0 0 0 1.5px #a855f770, 0 0 22px 0 #a855f745", animation: "choiceFadeUp 0.4s ease-out 0.16s both, glowPulse 2.5s ease-in-out infinite" }}
          >
            <div className="absolute -left-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-30 bg-violet-500 pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", animation: "individualShimmer 3.5s ease-in-out 1s infinite" }} />
            </div>
            <div className="relative w-11 h-11 rounded-2xl bg-black border-2 border-violet-500/60 flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 14px 1px #a855f760" }}>
              <Crosshair size={20} className="text-violet-400" style={{ filter: "drop-shadow(0 0 3px #a855f7)" }} />
            </div>
            <div className="relative flex-1 min-w-0 text-right">
              <span className="text-[15px] font-black text-white tracking-wide block">הרשמה למתאמנים עצמאיים</span>
              <span className="text-[11px] text-violet-300 font-semibold">מסלול AI אישי, בלי צוות</span>
            </div>
            <ChevronLeft size={16} className="relative text-violet-400/70 shrink-0" />
          </button>

          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-zinc-500" style={{ animation: "choiceFadeUp 0.4s ease-out 0.22s both" }}>
            <div className="flex items-center gap-1.5" style={{ animation: "chipGlowSeq 3s ease-in-out 0s infinite" }}><TrendingUp size={12} className="text-emerald-500" /> מעקב התקדמות</div>
            <div className="flex items-center gap-1.5" style={{ animation: "chipGlowSeq 3s ease-in-out 1s infinite" }}><Bot size={12} className="text-emerald-500" /> מאמן AI</div>
            <div className="flex items-center gap-1.5" style={{ animation: "chipGlowSeq 3s ease-in-out 2s infinite" }}><Shield size={12} className="text-emerald-500" /> מאגר תוכן</div>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-zinc-600" style={{ animation: "choiceFadeUp 0.4s ease-out 0.28s both, statCountFade 0.6s ease-out 0.5s both" }}>
            <Lock size={10} className="text-zinc-700" /> מאובטח ומוצפן
          </div>
          <button onClick={() => setScreen("evaluator_code")} className="w-full text-center mt-4 text-[12px] font-bold text-zinc-500 hover:text-red-400 transition">
            אני מגבש/ת - יש לי קוד סימולציה
          </button>
        </div>
      </div>
    );
  }

  if (screen === "evaluator_code") {
    return <EvaluatorFlow onBack={() => setScreen("choice")} />;
  }

  // Screen 2: login - its own dedicated screen, just email + password
  if (screen === "login") {
    return (
      <div key="login" className="flex-1 flex flex-col items-center p-5 relative overflow-y-auto overflow-x-hidden" style={{ justifyContent: "safe center", animation: "screenFadeIn 0.35s ease-out" }}>
        {authParticles}
        <style>{`
          @keyframes loginAmbient { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.75; } }
          @keyframes loginFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes loginShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes loginIconPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
        `}</style>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 55% at 50% 10%, rgba(16,185,129,0.1), transparent 60%)", animation: "loginAmbient 6s ease-in-out infinite" }} />
        <div className="w-full max-w-xs relative">
          {logo}
          <Card className="p-5 tech-grid tech-corners relative overflow-hidden" style={{ animation: "loginFadeUp 0.35s ease-out both" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08), transparent)", animation: "loginShimmer 5s ease-in-out 1s infinite" }} />
            </div>
            <button onClick={() => { setScreen("choice"); setError(""); }} className="relative flex items-center gap-1.5 text-zinc-500 hover:text-emerald-400 text-sm font-bold mb-4">
              <ChevronRight size={14} /> חזרה
            </button>
            <div className="relative space-y-3">
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold flex items-center gap-1.5"><Mail size={11} className="text-emerald-500" /> אימייל</label>
                <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="name@example.com" className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold flex items-center gap-1.5"><Lock size={11} className="text-emerald-500" /> סיסמה</label>
                <div className="relative mt-1">
                  <input dir="ltr" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pr-3 pl-10 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2" style={{ animation: "loginFadeUp 0.25s ease-out both" }}>{error}</div>}
              <GlowButton tone="emerald" icon={loading ? Loader2 : ChevronLeft} className="w-full" disabled={loading} onClick={submit}>
                {loading ? "רגע..." : "התחבר"}
              </GlowButton>
            </div>
          </Card>

          <div className="flex items-center gap-3 my-3.5" style={{ animation: "loginFadeUp 0.35s ease-out 0.1s both" }}>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-zinc-700" />
            <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-[9px] text-zinc-500 font-bold">או</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-zinc-700" />
          </div>

          <button
            onClick={() => setScreen("individual_signup")}
            className="relative w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 overflow-hidden active:scale-[0.97] transition"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.14), rgba(24,24,27,0.7))", boxShadow: "0 0 0 1.5px #a855f760, 0 0 16px 0 #a855f735", animation: "loginFadeUp 0.35s ease-out 0.16s both" }}
          >
            <div className="w-9 h-9 rounded-xl bg-black border-2 border-violet-500/60 flex items-center justify-center shrink-0" style={{ animation: "loginIconPulse 2.4s ease-in-out infinite" }}>
              <Crosshair size={16} className="text-violet-400" />
            </div>
            <span className="relative flex-1 text-[13px] font-black text-white text-right">מתאמן/ת עצמאי/ת? הרשמה כאן</span>
            <ChevronLeft size={14} className="text-violet-400/70 shrink-0" />
          </button>
        </div>
      </div>
    );
  }

  // Screen 3: signup - its own dedicated screen, password entry separate from login entirely
  if (screen === "signup") {
  return (
    <div key="signup" className="flex-1 flex flex-col items-center p-5 relative overflow-y-auto" style={{ justifyContent: "safe center", animation: "screenFadeIn 0.35s ease-out" }}>
      {authParticles}
      <div className="w-full max-w-xs relative">
        {logo}
        <Card className="p-5">
          <button onClick={() => { setScreen("choice"); setError(""); }} className="flex items-center gap-1.5 text-zinc-500 hover:text-emerald-400 text-sm font-bold mb-4">
            <ChevronRight size={14} /> חזרה
          </button>
          <div className="space-y-3">
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">אימייל</label>
              <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="name@example.com" className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">סיסמה</label>
              <div className="relative mt-1">
                <input dir="ltr" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pr-3 pl-10 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">אימות סיסמה</label>
              <div className="relative mt-1">
                <input dir="ltr" type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pr-3 pl-10 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">קוד רשת</label>
              <input dir="ltr" value={networkCode} onChange={(e) => setNetworkCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="קוד הרשת שקיבלת" className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">קוד מאמן (רק למאמנים - השאירו ריק אם אתם חניכים)</label>
              <input dir="ltr" type="password" value={coachCode} onChange={(e) => setCoachCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="אופציונלי" className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all duration-300" />
            </div>
            {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
            <GlowButton tone="emerald" icon={loading ? Loader2 : Check} className="w-full" disabled={loading} onClick={submit}>
              {loading ? "רגע..." : "הרשם"}
            </GlowButton>
          </div>
        </Card>
      </div>
    </div>
  );
  }

  // Screen 4: individual_signup - solo trainee, no team/network code at all
  return (
    <div key="individual_signup" className="flex-1 flex flex-col items-center p-5 relative overflow-y-auto" style={{ justifyContent: "safe center", animation: "screenFadeIn 0.35s ease-out" }}>
      {authParticles}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="absolute rounded-full bg-emerald-400" style={{ width: 2, height: 2, left: `${(i * 29 + 12) % 90}%`, top: `${(i * 41 + 8) % 85}%`, opacity: 0.4, animation: `constellationFloat ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes constellationFloat { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(6px, -10px); opacity: 0.6; } }`}</style>
      <div className="w-full max-w-xs relative">
        {logo}
        <Card className="p-5 relative overflow-hidden border-2 border-emerald-500/30" style={glowVars("#10b981")}>
          <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-emerald-500 pointer-events-none" />
          <button onClick={() => { setScreen("choice"); setError(""); }} className="relative flex items-center gap-1.5 text-zinc-500 hover:text-emerald-400 text-sm font-bold mb-3">
            <ChevronRight size={14} /> חזרה
          </button>
          <div className="relative flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#10b981")}>
              <Crosshair size={20} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-base font-black text-zinc-100">מתאמנים עצמאיים</div>
              <div className="text-[12px] text-zinc-500">ממוקד, אישי, בלי צוות</div>
            </div>
          </div>
          <div className="relative space-y-3">
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">אימייל</label>
              <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="name@example.com" className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">סיסמה</label>
              <div className="relative mt-1">
                <input dir="ltr" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pr-3 pl-10 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[13px] text-zinc-500 font-semibold">אימות סיסמה</label>
              <div className="relative mt-1">
                <input dir="ltr" type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pr-3 pl-10 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
            <GlowButton tone="emerald" icon={loading ? Loader2 : Crosshair} className="w-full" disabled={loading} onClick={submit}>
              {loading ? "רגע..." : "הרשם"}
            </GlowButton>
          </div>
        </Card>
        <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5"><Target size={12} className="text-emerald-500" /> יעד קרבי אישי</div>
          <div className="flex items-center gap-1.5"><Bot size={12} className="text-emerald-500" /> AI אישי</div>
        </div>
      </div>
    </div>
  );
}

/* ============================== ONBOARDING FLOW ============================== */

function OnboardingFlow({ user, onDone, showToast }) {
  const draftRaw = (() => {
    try { return JSON.parse(localStorage.getItem("sayert_onboarding_draft") || "null"); } catch (e) { return null; }
  })();
  const [step, setStep] = useState(draftRaw?.step || 0);
  const [fullName, setFullName] = useState(draftRaw?.fullName || "");
  const [phone, setPhone] = useState(draftRaw?.phone || "");
  const [city, setCity] = useState(draftRaw?.city || "");
  const [grade, setGrade] = useState(draftRaw?.grade || "");
  const [age, setAge] = useState(draftRaw?.age || 17);
  const [height, setHeight] = useState(draftRaw?.height || 175);
  const [weight, setWeight] = useState(draftRaw?.weight || 68);
  const [healthy, setHealthy] = useState(draftRaw?.healthy ?? true);
  const [issues, setIssues] = useState(draftRaw?.issues || []);
  const [otherNote, setOtherNote] = useState(draftRaw?.otherNote || "");
  const [level, setLevel] = useState(draftRaw?.level || "");
  const [unit, setUnit] = useState(() => {
    if (!draftRaw?.unitId) return null;
    const list = user?.accountType === "individual" ? INDIVIDUAL_UNITS : UNITS;
    return list.find((u) => u.id === draftRaw.unitId) || null;
  });
  const [unitSearchOb, setUnitSearchOb] = useState("");
  const [teamCode, setTeamCode] = useState(draftRaw?.teamCode || "");
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [teamCodeError, setTeamCodeError] = useState("");
  const [checkingCode, setCheckingCode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const draft = { step, fullName, phone, city, grade, age, height, weight, healthy, issues, otherNote, level, unitId: unit?.id || null, teamCode };
    try { localStorage.setItem("sayert_onboarding_draft", JSON.stringify(draft)); } catch (e) {}
  }, [step, fullName, phone, city, grade, age, height, weight, healthy, issues, otherNote, level, unit, teamCode]);
  // Celebrate the exact moment step 0's fields all become valid.
  const step0Complete = fullName.trim().length >= 2 && phone.trim().length >= 9 && city.trim().length >= 2 && age > 0 && height > 0 && weight > 0 && Boolean(grade);
  const prevStep0CompleteRef = useRef(false);
  useEffect(() => {
    if (step0Complete && !prevStep0CompleteRef.current) fxConfetti(["#10b981", "#34d399", "#ffffff"], { count: 24 });
    prevStep0CompleteRef.current = step0Complete;
  }, [step0Complete]);

  // The team picker must only show teams that belong to the specific network this
  // person verified into at signup - never the full list across every network.
  const [networkTeams, setNetworkTeams] = useState(TEAM_LIST);
  const [loadingTeams, setLoadingTeams] = useState(false);
  useEffect(() => {
    setLoadingTeams(true);
    loadTeamsForNetwork(user?.network).then((teams) => { setNetworkTeams(teams); setLoadingTeams(false); });
  }, [user?.network]);

  function toggleIssue(opt) {
    setIssues((list) => (list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt]));
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function finish() {
    if (!isIndividual) {
      setCheckingCode(true);
      const valid = await verifyTeamCode(teamCode, teamCodeInput.trim());
      setCheckingCode(false);
      if (!valid) {
        setTeamCodeError("קוד האימות שגוי - בדוק/י את הקוד שקיבלת עבור הצוות");
        return;
      }
    }
    setSaving(true);
    try {
      const profile = {
        fullName, phone: phone.trim(), city: city.trim(), grade, age, height, weight, healthy,
        healthIssues: healthy ? [] : issues,
        healthOtherNote: healthy ? "" : otherNote,
        level, targetUnit: unit.id, targetUnitName: unit.name,
        teamCode: isIndividual ? "" : teamCode,
      };
      const updatedUser = { ...user, onboarded: true, profile };
      await saveUserProfile(updatedUser);
      setSaving(false);
      setCelebrating(true);
      try { localStorage.removeItem("sayert_onboarding_draft"); } catch (e) {}
      setTimeout(() => onDone(updatedUser), 2200);
      return;
    } catch (e) {
      showToast("שגיאה בשמירה, נסה שוב", "error");
    } finally {
      setSaving(false);
    }
  }

  const isIndividual = user?.accountType === "individual";
  const stepsMeta = isIndividual ? ["פרטים אישיים", "רמת כושר", "יעד קרבי"] : ["פרטים אישיים", "רמת כושר", "יעד קרבי", "צוות"];

  if (celebrating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6 + (i % 3) * 3,
                height: 6 + (i % 3) * 3,
                left: `${(i * 37) % 100}%`,
                top: "-5%",
                backgroundColor: ["#10b981", "#34d399", "#6ee7b7", "#f59e0b"][i % 4],
                animation: `confettiFall ${2 + (i % 5) * 0.3}s ease-in ${(i % 6) * 0.15}s forwards`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(70vh) rotate(360deg); opacity: 0; }
          }
          @keyframes checkPop {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        <div
          className="relative w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-5"
          style={{ animation: "checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards", boxShadow: "0 0 40px 10px rgba(16,185,129,0.5)" }}
        >
          <Check size={48} className="text-black" strokeWidth={3} />
        </div>
        <div className="text-2xl font-black text-zinc-50 mb-1.5">מוכן/ה לצאת לדרך!</div>
        <div className="text-[14px] text-zinc-400 text-center max-w-xs">{fullName ? `ברוך/ה הבא/ה, ${fullName.split(" ")[0]}` : "הפרופיל שלך מוכן"} - מעכשיו הכל במקום אחד</div>
      </div>
    );
  }

  const STEP_ICONS = [User, GaugeIcon, Target, Users];
  const STEP_HEX = ["#10b981", "#f59e0b", "#a855f7", "#38bdf8"];

  return (
    <div className="fx-root flex-1 flex flex-col p-4 overflow-y-auto relative tech-grid tech-corners" onPointerDown={(e) => fxTouchRing(e, STEP_HEX[step])}>
      <FxStyles />
      <FxAmbience hex={STEP_HEX[step]} hex2="#a855f7" hex3="#38bdf8" icons={[User, Target, Trophy]} particles={9} dots />
      <FxScrollBar hex={STEP_HEX[step]} />
      <style>{`
        @keyframes obDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(6px,-10px); opacity: 0.6; } }
        @keyframes obHalo { 0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); } }
        @keyframes obSlideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-[0.15]" style={{ top: "-10%", left: "-20%", backgroundColor: STEP_HEX[step] }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="absolute rounded-full" style={{ width: 2, height: 2, backgroundColor: STEP_HEX[step], left: `${(i * 31 + 10) % 90}%`, top: `${(i * 23 + 6) % 70}%`, opacity: 0.35, animation: `obDust ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
      </div>
      <div className="relative sticky top-0 z-10 pb-2 -mx-4 px-4" style={{ background: "linear-gradient(180deg, var(--card-base) 75%, transparent)" }}>
        <div className="flex items-center justify-between mb-2 mt-2 px-1">
          {stepsMeta.map((label, i) => {
            const StepIcon = STEP_ICONS[i];
            const isDone = i < step;
            const isCurrent = i === step;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => isDone && setStep(i)}
                  disabled={!isDone}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-black active:scale-90"
                        : isCurrent
                        ? "bg-black text-emerald-400"
                        : "bg-zinc-900 border-zinc-700 text-zinc-600"
                    }`}
                    style={isCurrent ? { borderColor: STEP_HEX[step], animation: "obHalo 1.8s ease-in-out infinite" } : undefined}
                  >
                    {isDone ? <Check size={16} /> : <StepIcon size={15} />}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${isCurrent ? "text-emerald-400" : isDone ? "text-zinc-400" : "text-zinc-600"}`}>{label}</span>
                </button>
                {i < stepsMeta.length - 1 && (
                  <div className="relative flex-1 h-0.5 mx-1 -mt-5 rounded-full overflow-hidden bg-zinc-800">
                    <div className="absolute inset-y-0 right-0 rounded-full transition-all duration-500" style={{ width: i < step ? "100%" : "0%", backgroundColor: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 text-[13px] text-zinc-600 font-semibold mb-1 mt-3 relative">
          <span>שלב {step + 1} מתוך {stepsMeta.length}</span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1"><Clock size={11} /> כ-{(stepsMeta.length - step) * 30} שניות נותרו</span>
        </div>
      </div>

      <div key={step} className="flex-1 relative" style={{ animation: "obSlideIn 0.3s ease-out" }}>
        {step === 0 && (
          <div className="space-y-4">
            <style>{`
              @keyframes obFieldFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes obCheckPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
              @keyframes obRingPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            `}</style>
            {(() => {
              const fieldsFilled = [fullName.trim().length >= 2, phone.trim().length >= 9, city.trim().length >= 2, age > 0, height > 0, weight > 0, Boolean(grade)].filter(Boolean).length;
              const pct = Math.round((fieldsFilled / 7) * 100);
              return (
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 shrink-0" style={pct === 100 ? { animation: "obCheckPop 0.4s ease-out" } : undefined}>
                    <svg viewBox="0 0 44 44" className="-rotate-90">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="#27272a" strokeWidth="4" />
                      <circle cx="22" cy="22" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${(pct / 100) * 113} 113`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease-out" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-400">{pct}%</div>
                  </div>
                  <span className="relative">
                    <SectionTitle icon={User}>ספר/י לנו קצת עליך</SectionTitle>
                    <span aria-hidden="true" className="absolute -inset-1 rounded-full pointer-events-none" style={{ boxShadow: "0 0 0 0 #10b98150", animation: "fxGlow 2.4s ease-in-out infinite", "--gc": "#10b98180" }} />
                  </span>
                </div>
              );
            })()}

            {(fullName.trim() || age > 0 || height > 0 || weight > 0) && (
              <div {...fxTilt(5)} className="relative rounded-2xl overflow-hidden p-3 flex items-center gap-2 flex-wrap" style={{ ...fxTiltStyle, background: "linear-gradient(120deg, #10b98120, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1px #10b98135 inset", animation: "obFieldFadeUp 0.3s ease-out both" }}>
                <FxSpot radius="1rem" />
                <User size={14} className="relative text-emerald-400 shrink-0" />
                <span className="relative text-[13px] text-zinc-300 font-semibold">
                  {fullName.trim() || "השם שלך"}{age > 0 ? ` · ${age}` : ""}{height > 0 ? ` · ${height} ס״מ` : ""}{weight > 0 ? ` · ${weight} ק״ג` : ""}
                </span>
              </div>
            )}

            <div style={{ animation: "obFieldFadeUp 0.3s ease-out 0.04s both" }}>
              <div className="flex items-center justify-between">
                <label className="text-[13px] text-zinc-500 font-semibold">שם מלא</label>
                <span className="text-[10px] tabular-nums font-bold text-zinc-600">{fullName.length}/40</span>
              </div>
              <div className="relative mt-1">
                <User size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input maxLength={40} value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pr-9 pl-9 py-2 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                {fullName.trim().length >= 2 && <Check size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" style={{ animation: "obCheckPop 0.3s ease-out" }} />}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2" style={{ animation: "obFieldFadeUp 0.3s ease-out 0.08s both" }}>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold">טלפון</label>
                <div className="relative mt-1">
                  <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input dir="ltr" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="050-0000000" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pr-9 pl-9 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                  {phone.trim().length >= 9 && <Check size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" style={{ animation: "obCheckPop 0.3s ease-out" }} />}
                </div>
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold">עיר מגורים</label>
                <div className="relative mt-1">
                  <MapPin size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="לדוגמה: חיפה" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pr-9 pl-9 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                  {city.trim().length >= 2 && <Check size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" style={{ animation: "obCheckPop 0.3s ease-out" }} />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2" style={{ animation: "obFieldFadeUp 0.3s ease-out 0.12s both" }}>
              {[["גיל", age, setAge, 12, 25, "#10b981"], ["גובה (ס״מ)", height, setHeight, 130, 210, "#38bdf8"], ["משקל (ק״ג)", weight, setWeight, 30, 150, "#f59e0b"]].map(([label, val, setter, min, max, hx]) => (
                <div key={label} {...fxTilt(6)} className="relative" style={fxTiltStyle}>
                  <label className="text-[12px] text-zinc-500 font-semibold flex items-center gap-1">
                    {label} {val >= min && val <= max && <Check size={11} className="text-emerald-400" />}
                  </label>
                  <div className="flex items-center gap-1 mt-1">
                    <button type="button" onClick={() => setter(Math.max(min, (val || min) - 1))} className="w-7 h-8 rounded-lg bg-zinc-800 text-zinc-400 font-black shrink-0 flex items-center justify-center active:scale-90 transition">−</button>
                    <input type="number" min={min} max={max} value={val} onChange={(e) => setter(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-1 py-2 text-base text-zinc-100 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                    <button type="button" onClick={() => setter(Math.min(max, (val || min) + 1))} className="w-7 h-8 rounded-lg bg-zinc-800 text-zinc-400 font-black shrink-0 flex items-center justify-center active:scale-90 transition">+</button>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden mt-1.5">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100))}%`, backgroundColor: hx, boxShadow: `0 0 5px ${hx}` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-xl p-2" style={{ animation: "obFieldFadeUp 0.3s ease-out 0.16s both" }}>
              <HudCorners hex="#10b981" corners={2} inset={2} />
              <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">כיתה</label>
              <div className="grid grid-cols-3 gap-1.5">
                {["מתחת לט׳", "כיתה ט׳", "כיתה י׳", "כיתה י״א", "כיתה י״ב", "אחרי בית ספר"].map((g) => (
                  <button key={g} type="button" onClick={() => setGrade(g)} className={`rounded-lg py-2 text-[12px] font-bold border transition ${grade === g ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-700 text-zinc-400"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ animation: "obFieldFadeUp 0.3s ease-out 0.2s both" }}>
              <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 flex items-center gap-1.5"><Heart size={13} className="text-red-400" style={{ animation: "fxFloat 2.4s ease-in-out infinite" }} /> האם את/ה נוטה להיות בריא/ה?</label>
              <div className="flex gap-2">
                <button onClick={() => setHealthy(true)} className={`flex-1 rounded-xl py-2.5 text-base font-bold border transition ${healthy ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>כן</button>
                <button onClick={() => setHealthy(false)} className={`flex-1 rounded-xl py-2.5 text-base font-bold border transition ${!healthy ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>לא</button>
              </div>
            </div>

            {!healthy && (
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">מה הבעיה? (ניתן לבחור כמה)</label>
                <div className="flex flex-wrap gap-1.5">
                  {HEALTH_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => toggleIssue(opt)} className={`rounded-full px-3 py-1.5 text-sm font-bold border ${issues.includes(opt) ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {issues.includes("אחר") && (
                  <textarea value={otherNote} onChange={(e) => setOtherNote(e.target.value)} placeholder="פרט/י..." rows={2} className="w-full mt-2 bg-zinc-950 border border-red-500/30 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none" />
                )}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2 fx-stagger">
            <style>{`
              @keyframes obShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
              @keyframes obFieldFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes obCheckPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
              @keyframes obIconBounce { 0% { transform: scale(1); } 40% { transform: scale(1.25); } 100% { transform: scale(1.08); } }
            `}</style>
            <span className="relative inline-block">
              <SectionTitle icon={GaugeIcon} tone="amber">מה רמת הכושר הנוכחית שלך?</SectionTitle>
              <span aria-hidden="true" className="absolute -inset-1 rounded-full pointer-events-none" style={{ "--gc": "#f59e0b80", animation: "fxGlow 2.4s ease-in-out infinite" }} />
            </span>
            <div className="flex items-center gap-1.5 px-0.5 pb-1" aria-hidden="true">
              {TIERS.map((_, ti) => (
                <React.Fragment key={ti}>
                  <div className="flex-1 h-1 rounded-full overflow-hidden bg-zinc-800">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: TIERS.indexOf(level) >= ti ? "100%" : "0%", backgroundColor: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
                  </div>
                </React.Fragment>
              ))}
            </div>
            {TIERS.map((t, ti) => {
              const TierIcon = [Footprints, Activity, Flame, Trophy][ti] || Activity;
              const selected = level === t;
              return (
                <button key={t} onClick={() => { setLevel(t); fxConfetti(["#f59e0b", "#fbbf24", "#ffffff"], { count: 20 }); }} {...fxTilt(6)} className={`relative w-full text-right rounded-xl px-4 py-3.5 text-base font-bold border transition flex items-center gap-3 overflow-hidden ${selected ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`} style={{ ...fxTiltStyle, animation: `obFieldFadeUp 0.3s ease-out ${ti * 0.06}s both` }}>
                  {selected && <FxFrame hex="#f59e0b" hex2="#fbbf24" radius="0.75rem" />}
                  {selected && <HudCorners hex="#f59e0b" corners={2} inset={6} />}
                  <FxSpot radius="0.75rem" />
                  {selected && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)", animation: "obShimmer 3s ease-in-out infinite" }} />
                    </div>
                  )}
                  <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: selected ? "#f59e0b25" : "#27272a", animation: selected ? "obIconBounce 0.4s ease-out" : undefined }}>
                    <TierIcon size={16} className={selected ? "text-amber-400" : "text-zinc-500"} />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <div>{t}</div>
                    <div className={`text-[10.5px] font-normal mt-0.5 ${selected ? "text-amber-400/70" : "text-zinc-600"}`}>{["בונים בסיס - התחלה נכונה ובטוחה", "עומס סדיר, מוכנים להעלות רמה", "שבועות אחרונים לפני יום המבחן", "ספרינט אחרון - חידוד ושמירה על כושר"][ti]}</div>
                  </div>
                  {selected && <Check size={18} className="relative text-amber-400 shrink-0" style={{ animation: "obCheckPop 0.3s ease-out" }} />}
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div>
            <style>{`@keyframes unitCardFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <span className="relative inline-block">
              <SectionTitle icon={Target}>לאיזו יחידה את/ה שואף/ת?</SectionTitle>
              <span aria-hidden="true" className="absolute -inset-1 rounded-full pointer-events-none" style={{ "--gc": "#a855f780", animation: "fxGlow 2.4s ease-in-out infinite" }} />
            </span>
            <div className="text-[13px] text-zinc-600 mb-3">שימו לב - לאחר האישור לא ניתן יהיה לשנות את היעד</div>

            {unit && (
              <div {...fxTilt(5)} className="relative rounded-2xl overflow-hidden p-3.5 mb-3 flex items-center gap-3" style={{ ...fxTiltStyle, background: `linear-gradient(120deg, ${unit.hex}25, transparent 75%), var(--card-base-alt)`, boxShadow: `0 0 0 1.5px ${unit.hex}50 inset` }}>
                <FxFrame hex={unit.hex} hex2="#a855f7" radius="1rem" />
                <FxSpot radius="1rem" />
                <div className="relative w-10 h-10 rounded-full bg-black border-2 flex items-center justify-center shrink-0" style={{ borderColor: unit.hex, animation: "obIconBounce 0.4s ease-out" }}>
                  <Shield size={18} style={{ color: unit.hex }} />
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: unit.hex }}>נבחר</div>
                  <div className={`text-[15px] font-black ${unit.text}`}>{unit.name}</div>
                </div>
                <Check size={18} className="relative" style={{ color: unit.hex }} />
              </div>
            )}

            {!isIndividual && (
              <div className="relative mb-3">
                <input
                  value={unitSearchOb}
                  onChange={(e) => setUnitSearchOb(e.target.value)}
                  placeholder="חיפוש יחידה..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-8 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300"
                />
                <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                {unitSearchOb && <button onClick={() => setUnitSearchOb("")} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600"><X size={15} /></button>}
              </div>
            )}

            {isIndividual && (
              <div className="flex items-center gap-1.5 text-[12px] text-emerald-500/80 font-semibold mb-3">
                <Crosshair size={12} /> 8 יעדים ממוקדים למתאמנים עצמאיים
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              {(isIndividual ? INDIVIDUAL_UNITS : (unitSearchOb.trim() ? UNITS.filter((u) => u.name.includes(unitSearchOb.trim())) : UNITS)).map((u, i) => {
                const selected = unit?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => { setUnit(u); fxConfetti([u.hex, "#ffffff", "#a855f7"], { count: 22 }); }}
                    {...fxTilt(7)}
                    style={{ ...(selected ? glowVars(u.hex) : {}), ...fxTiltStyle, animation: isIndividual ? `unitCardFadeUp 0.35s ease-out ${i * 0.05}s both` : undefined }}
                    className={`relative rounded-2xl px-3 py-4 text-center transition active:scale-95 overflow-hidden ${selected ? `glow-btn border-2 ${u.border}` : `bg-zinc-950 border-2 ${u.border}`}`}
                  >
                    {u.image && (
                      <>
                        <img src={u.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" style={{ filter: "grayscale(0.15)" }} />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.75) 65%), radial-gradient(ellipse at center, ${u.hex}25, transparent 70%)` }} />
                      </>
                    )}
                    {selected && <HudCorners hex={u.hex} corners={2} inset={5} />}
                    <FxSpot radius="1rem" />
                    {isIndividual && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-black/50 text-[9px] font-black flex items-center justify-center z-10" style={{ color: u.hex }}>{i + 1}</span>
                    )}
                    <div className={`relative text-base font-black ${u.image ? "text-white" : u.text}`} style={{ ...(selected ? { animation: "obIconBounce 0.35s ease-out" } : {}), textShadow: u.image ? "0 1px 4px rgba(0,0,0,0.8)" : undefined }}>{u.name}</div>
                    <div className="relative text-[12px] mt-0.5" style={{ color: u.image ? "#e4e4e7" : undefined }}>{u.tagline}</div>
                    {isIndividual && selected && u.req && (
                      <div className="relative text-[10px] mt-1.5 pt-1.5 border-t leading-relaxed" style={{ color: u.image ? "#d4d4d8" : "#71717a", borderColor: u.image ? "rgba(255,255,255,0.2)" : undefined }}>{u.req}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionTitle icon={Users}>לאיזה צוות את/ה משויך/ת?</SectionTitle>
            <div className="text-[13px] text-zinc-600 mb-3">בחר/י את מספר הצוות והזן/י את קוד האימות שקיבלת מהמדריך. לא ניתן לשנות לאחר האישור.</div>
            {loadingTeams ? (
              <div className="text-center py-6 text-sm text-zinc-600">טוען צוותים...</div>
            ) : (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {networkTeams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTeamCode(t.id); setTeamCodeError(""); }}
                  className={`rounded-xl py-3 text-base font-black border transition ${teamCode === t.id ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            )}
            {teamCode && (
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold">קוד אימות ל{getTeamLabel(teamCode)}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  dir="ltr"
                  value={teamCodeInput}
                  onChange={(e) => { setTeamCodeInput(e.target.value); setTeamCodeError(""); }}
                  placeholder="הזן/י קוד"
                  className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300"
                />
                {teamCodeError && <div className="text-sm text-red-400 mt-1.5">{teamCodeError}</div>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 pb-2">
        {step > 0 && (
          <GlowButton tone="ghost" className="flex-1" onClick={handleBack}>חזור</GlowButton>
        )}
        {step === 0 && (
          <GlowButton tone="emerald" className="flex-1" disabled={!fullName.trim()} onClick={() => setStep(1)}>המשך ל{stepsMeta[1]}</GlowButton>
        )}
        {step === 1 && (
          <GlowButton tone="emerald" className="flex-1" disabled={!level} onClick={() => setStep(2)}>המשך ל{stepsMeta[2]}</GlowButton>
        )}
        {step === 2 && unit && (
          isIndividual ? (
            <GlowButton tone="emerald" icon={saving ? Loader2 : Check} className="flex-1" disabled={saving} onClick={finish}>
              {saving ? "שומר..." : "סיום ההרשמה"}
            </GlowButton>
          ) : (
            <GlowButton tone="emerald" className="flex-1" onClick={() => setStep(3)}>המשך ל{stepsMeta[3]}</GlowButton>
          )
        )}
        {!isIndividual && step === 3 && (
          <GlowButton tone="emerald" icon={saving || checkingCode ? Loader2 : Check} className="flex-1" disabled={saving || checkingCode || !teamCode || !teamCodeInput.trim()} onClick={finish}>
            {checkingCode ? "בודק קוד..." : saving ? "שומר..." : "סיום ההרשמה"}
          </GlowButton>
        )}
      </div>
    </div>
  );
}

/* ============================== HEADER ============================== */

function AppHeader({ user }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const greeting = hour >= 5 && hour < 12 ? "בוקר טוב" : hour >= 12 && hour < 17 ? "צהריים טובים" : hour >= 17 && hour < 21 ? "ערב טוב" : "לילה טוב";
  const displayName = user.profile?.fullName || user.email.split("@")[0];

  return (
    <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-black/60 backdrop-blur">
      <div className="text-[11px] text-zinc-600 leading-none mb-1">
        {now.toLocaleDateString("he-IL", { day: "numeric", month: "long" })} · {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div className="text-base font-black text-zinc-50 leading-none truncate max-w-[220px]">{greeting}, {displayName}</div>
    </div>
  );
}

/* ============================== BOTTOM NAV ============================== */

function BottomNav({ tabs, active, setActive, onSameTabClick }) {
  const MILITARY_BROWN = "#8a7355";
  const PATH_HEX = "#a855f7";
  return (
    <div className="border-t border-zinc-800/80 bg-black/80 backdrop-blur-xl flex items-end">
      {tabs.map((t) => {
        const isActive = active === t.id;
        const isChat = t.id === "chat";
        const isPath = t.id === "path";
        if (isChat) {
          return (
            <button key={t.id} onClick={() => { if (isActive) onSameTabClick?.(t.id); else setActive(t.id); }} className="relative flex-1 flex flex-col items-center gap-0.5 pb-1.5 transition-transform duration-300 ease-out active:scale-90">
              <div
                className="w-14 h-14 -mt-5 rounded-full flex items-center justify-center border-4 border-black transition-transform duration-300"
                style={{ background: `linear-gradient(150deg, ${MILITARY_BROWN}, #5c4d33)`, boxShadow: isActive ? `0 4px 18px ${MILITARY_BROWN}80` : "0 4px 14px rgba(0,0,0,0.4)" }}
              >
                <t.icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-bold mt-0.5" style={{ color: isActive ? MILITARY_BROWN : "#71717a" }}>{t.label}</span>
            </button>
          );
        }
        if (isPath) {
          return (
            <button key={t.id} onClick={() => { if (isActive) onSameTabClick?.(t.id); else setActive(t.id); }} className="relative flex-1 flex flex-col items-center gap-0.5 pb-1.5 transition-transform duration-300 ease-out active:scale-90">
              <div
                className="w-14 h-14 -mt-5 rounded-full flex items-center justify-center border-4 border-black transition-transform duration-300"
                style={{ background: `linear-gradient(150deg, ${PATH_HEX}, #6b21a8)`, boxShadow: isActive ? `0 4px 18px ${PATH_HEX}90` : "0 4px 14px rgba(168,85,247,0.35)", animation: isActive ? "glowPulse 2.2s ease-in-out infinite" : undefined }}
              >
                <t.icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-bold mt-0.5" style={{ color: isActive ? PATH_HEX : "#a78bfa" }}>{t.label}</span>
            </button>
          );
        }
        return (
          <button key={t.id} onClick={() => { if (isActive) onSameTabClick?.(t.id); else setActive(t.id); }} className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 transition-transform duration-300 ease-out active:scale-90">
            {isActive && <span className="absolute top-0 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(16,185,129,0.6)]" />}
            <t.icon size={15} className={`transition-all duration-300 ease-out ${isActive ? "text-emerald-400 scale-110" : "text-zinc-600"}`} />
            <span className={`text-[10px] font-bold transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-zinc-600"}`}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================== HOME TAB ============================== */

function FitnessLineGraph({ points, unit, onPointClick }) {
  if (points.length === 0) return null;
  const W = 320, H = 170, PAD_X = 46, PAD_Y = 24, PAD_R = 14;
  const values = points.map((p) => p.value);
  let min = Math.min(...values), max = Math.max(...values);
  if (min === max) { min -= unit === "time" ? 5 : 1; max += unit === "time" ? 5 : 1; }
  const range = max - min;

  // For time-based tests, lower is better - invert the Y mapping so "up" always
  // visually means "improving," regardless of whether the metric is time or reps.
  const yFor = (v) => {
    const norm = (v - min) / range; // 0..1
    const visual = unit === "time" ? norm : 1 - norm;
    return PAD_Y + visual * (H - PAD_Y * 2);
  };
  const xFor = (i) => points.length === 1 ? (PAD_X + W - PAD_R) / 2 : PAD_X + (i / (points.length - 1)) * (W - PAD_R - PAD_X);

  const coords = points.map((p, i) => [xFor(i), yFor(p.value)]);
  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1][0]} ${H - PAD_Y} L ${coords[0][0]} ${H - PAD_Y} Z`;

  // Axis labels: top value, middle value, bottom value - actual numbers (time or reps), not abstract.
  const axisSteps = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: 190 }}>
      <defs>
        <linearGradient id="fitGraphFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="fitGraphGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {axisSteps.map((f) => {
        const y = PAD_Y + f * (H - PAD_Y * 2);
        // Visual top (f=0) = better; for time that's min, for reps that's max.
        const val = unit === "time" ? min + f * range : max - f * range;
        return (
          <g key={f}>
            <line x1={PAD_X} x2={W - PAD_R} y1={y} y2={y} stroke="#27272a" strokeWidth="1" strokeDasharray="3 4" />
            <text x={PAD_X - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#71717a">{formatTestValue(unit, val)}</text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#fitGraphFill)" />
      <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#fitGraphGlow)" />
      {coords.map(([x, y], i) => {
        const isLast = i === coords.length - 1;
        return (
          <g key={i} onClick={() => onPointClick?.(points[i])} style={{ cursor: onPointClick ? "pointer" : "default" }}>
            <circle cx={x} cy={y} r="14" fill="transparent" />
            <circle cx={x} cy={y} r={isLast ? 5 : 3.5} fill={isLast ? "#10b981" : "var(--card-base)"} stroke="#10b981" strokeWidth="2" />
            {isLast && <circle cx={x} cy={y} r="9" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />}
          </g>
        );
      })}
    </svg>
  );
}

function AnimatedNumber({ value, className }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = display;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className={className}>{display}</span>;
}

function SpeedGauge({ value, label, hex }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 40;
  const circumference = 2 * Math.PI * r * (250 / 360);
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);
  const dash = (animated / 100) * circumference;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * clamped));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clamped]);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[125deg]">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#27272a" strokeWidth="7" strokeDasharray={`${circumference} 999`} strokeLinecap="round" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={hex} strokeWidth="7" strokeDasharray={`${dash} 999`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${hex})`, transition: "stroke-dasharray 1.1s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--card-base)", boxShadow: "0 0 0 1px rgba(127,127,127,0.15)" }}>
            <span className="text-xl font-black tabular-nums" style={{ color: hex }}>{display}%</span>
          </div>
        </div>
      </div>
      <div className="text-[11px] font-bold text-zinc-400 mt-1.5 text-center tracking-wide">{label}</div>
    </div>
  );
}

function WarMiniTable({ rows }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 mb-2">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-red-500/10 border-b border-red-500/20">
            <th className="text-right font-bold text-red-400 py-1.5 px-2.5 text-[11px]">תרגיל</th>
            <th className="text-center font-bold text-red-400 py-1.5 px-1 text-[11px]">סטים</th>
            <th className="text-center font-bold text-red-400 py-1.5 px-1 text-[11px]">חזרות</th>
            <th className="text-center font-bold text-red-400 py-1.5 px-1 text-[11px]">מנוחה</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-zinc-950" : "bg-black"}>
              <td className="text-right py-2 px-2.5 font-bold text-zinc-200 text-[13px]">{r[0]}</td>
              <td className="text-center py-2 px-1 text-zinc-300 text-[13px] tabular-nums">{r[1]}</td>
              <td className="text-center py-2 px-1 text-zinc-300 text-[13px] tabular-nums">{r[2]}</td>
              <td className="text-center py-2 px-1 text-amber-400/90 text-[12px] tabular-nums">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarWorkoutBlock({ workout }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-base font-black text-red-400 mb-2 flex items-center gap-1.5">
        <Flame size={15} /> {workout.name}
      </div>
      {workout.highlights?.length > 0 && (
        <div className="bg-amber-500/[0.07] border border-amber-500/25 rounded-lg p-2.5 mb-2.5 space-y-1">
          {workout.highlights.map((h, i) => (
            <div key={i} className="text-[12px] text-amber-300 leading-relaxed">{h}</div>
          ))}
        </div>
      )}
      {workout.blocks.map((b, bi) => (
        <div key={bi} className="mb-2.5 last:mb-0">
          {b.label && <div className="text-[13px] font-bold text-zinc-400 mb-1">{b.label}</div>}
          {b.rows && <WarMiniTable rows={b.rows} />}
          {b.note && <div className="text-[13px] text-zinc-400 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5">{b.note}</div>}
        </div>
      ))}
    </div>
  );
}


function ReflectionHistoryRow({ r, isOpen, onToggle }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border tech-corners" style={{ borderColor: isOpen ? "#0ea5e970" : "#0ea5e930", background: isOpen ? "linear-gradient(160deg, #0ea5e920, transparent 60%), #050709" : "linear-gradient(160deg, #0ea5e910, transparent 65%), #050709" }}>
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      {isOpen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-8" style={{ background: "linear-gradient(180deg, transparent, rgba(14,165,233,0.12), transparent)", animation: "shimmerSlide 3s linear infinite", transform: "rotate(90deg) translateY(-50%)" }} />
        </div>
      )}
      <button onClick={onToggle} className="relative w-full flex items-center gap-3 px-4 py-3.5">
        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${r.group ? "bg-sky-500/10 border-sky-500/40" : "bg-black border-zinc-700"}`}>
          {r.group ? <Users size={16} className="text-sky-400" /> : <User size={16} className="text-zinc-400" />}
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-sky-400" style={{ boxShadow: "0 0 6px #38bdf8" }} />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="text-[14px] font-bold text-zinc-100 truncate">{r.title}</div>
          <div className="text-[11px] text-sky-500/70 font-mono tracking-wide flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-sky-500/60" /> {r.date}
          </div>
        </div>
        <ChevronDown size={16} className={`shrink-0 transition ${isOpen ? "rotate-180 text-sky-400" : "text-sky-600/60"}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-500/[0.08] border border-emerald-500/25 rounded-xl p-3">
              <div className="text-[11px] text-emerald-400 font-bold mb-1.5 flex items-center gap-1"><Check size={12} /> שימור</div>
              <div className="text-[12px] text-zinc-300 space-y-1 leading-relaxed">
                <div>{r.keep1}</div>
                <div>{r.keep2}</div>
              </div>
            </div>
            <div className="bg-amber-500/[0.08] border border-amber-500/25 rounded-xl p-3">
              <div className="text-[11px] text-amber-400 font-bold mb-1.5 flex items-center gap-1"><TrendingUp size={12} /> שיפור</div>
              <div className="text-[12px] text-zinc-300 space-y-1 leading-relaxed">
                <div>{r.improve1}</div>
                <div>{r.improve2}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[12px] text-sky-400 font-semibold mb-1.5 flex items-center gap-1"><Bot size={12} /> מה ה-AI המליץ</div>
            <div className="bg-sky-500/[0.06] border border-sky-500/20 rounded-xl p-3 text-[13px] text-zinc-300 leading-relaxed [&>*:last-child]:mb-0">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1.5">{children}</p>,
                  strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pr-3 space-y-0.5 mb-1.5">{children}</ul>,
                  li: ({ children }) => <li>{children}</li>,
                }}
              >
                {r.aiTips}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const WORKOUT_LEVEL_STYLES = {
  "בסיס": { hex: "#10b981", emoji: "🟢" },
  "בסיס+": { hex: "#22c55e", emoji: "🟢" },
  "בינוני": { hex: "#eab308", emoji: "🟡" },
  "בינוני+": { hex: "#f59e0b", emoji: "🟡" },
  "מתקדם": { hex: "#f97316", emoji: "🟠" },
  "מתקדם+": { hex: "#ea580c", emoji: "🟠" },
  "קשה": { hex: "#ef4444", emoji: "🔴" },
  "קשה מאוד": { hex: "#dc2626", emoji: "🔴" },
  "קשה מאוד+": { hex: "#b91c1c", emoji: "🔴" },
};
// Which training split an aimuni-chadar-kosher (gym) workout belongs to - lets the bank
// list be filtered by workout type, and lets each workout show which split it's part of.
const SPLIT_TYPE_STYLES = {
  "Push/Pull/Legs": { hex: "#f97316", icon: Dumbbell, short: "PPL" },
  "עליון/תחתון": { hex: "#38bdf8", icon: Target, short: "U/L" },
  "ארנולד ספליט": { hex: "#a855f7", icon: Trophy, short: "ארנולד" },
  "התמחות": { hex: "#ef4444", icon: Flame, short: "התמחות" },
  "פול בודי": { hex: "#10b981", icon: Zap, short: "פול בודי" },
};

function parseReflectionReply(text) {
  if (!text) return { score: null, question: null, body: text };
  const scoreMatch = text.match(/ציון:\s*(\d+)\s*\/\s*10/);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
  let body = scoreMatch ? text.replace(scoreMatch[0], "").trim() : text;
  const sentences = body.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const lastLine = sentences[sentences.length - 1];
  const question = lastLine && lastLine.includes("?") ? lastLine : null;
  if (question) body = sentences.slice(0, -1).join("\n");
  return { score, question, body };
}

function parseRestSeconds(text) {
  if (!text || text === "—") return null;
  const minMatch = text.match(/(\d+)\s*דק/);
  const secMatch = text.match(/(\d+)\s*שנ/);
  let total = 0;
  if (minMatch) total += parseInt(minMatch[1], 10) * 60;
  if (secMatch) total += parseInt(secMatch[1], 10);
  return total > 0 ? total : null;
}

function RestTimerButton({ label, text, hex }) {
  const totalSeconds = parseRestSeconds(text);
  const [remaining, setRemaining] = useState(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) { setDone(true); return; }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);
  if (!totalSeconds) {
    return (
      <div className="rounded-lg bg-black/30 px-2.5 py-1.5">
        <div className="text-[9px] text-zinc-500 font-bold mb-0.5">{label}</div>
        <div className="text-[12px] font-bold text-amber-400 tabular-nums">{text && text !== "—" ? text : "-"}</div>
      </div>
    );
  }
  const running = remaining !== null && remaining > 0;
  const pct = running ? ((totalSeconds - remaining) / totalSeconds) * 100 : done ? 100 : 0;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (running) { setRemaining(null); } else { setDone(false); setRemaining(totalSeconds); } }}
      className="relative rounded-lg overflow-hidden px-2.5 py-1.5 text-right w-full"
      style={{ backgroundColor: done ? `${hex}25` : "rgba(0,0,0,0.3)", boxShadow: done ? `0 0 0 1.5px ${hex}70 inset` : undefined, animation: done ? "restTimerDone 0.6s ease-in-out 2" : undefined }}
    >
      {running && <div className="absolute inset-y-0 right-0 opacity-25" style={{ width: `${pct}%`, backgroundColor: hex, transition: "width 1s linear" }} />}
      {done && <span aria-hidden="true" className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: `0 0 0 0 ${hex}`, animation: "fxPing 0.8s ease-out" }} />}
      <div className="relative text-[9px] text-zinc-500 font-bold mb-0.5 flex items-center gap-1">
        {label}
        {!running && !done && <Clock size={9} className="opacity-60" />}
      </div>
      <div className="relative text-[12px] font-bold tabular-nums" style={{ color: done ? hex : running ? "#fff" : "#fbbf24" }}>
        {running ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}` : done ? "בוצע ✓" : text}
      </div>
    </button>
  );
}

// Best-effort icon per exercise name, purely cosmetic (falls back to Dumbbell).
function exerciseIcon(name) {
  const n = name || "";
  if (/מתח|pull|chin/i.test(n)) return Anchor;
  if (/סקוואט|squat|לאנג|מכרע|lunge/i.test(n)) return Footprints;
  if (/שכיבות|push|מקביל|dip/i.test(n)) return Dumbbell;
  if (/פלאנק|הולו|hollow|plank|ליבה|core|סופרמן/i.test(n)) return Target;
  if (/עקב|calf/i.test(n)) return TrendingUp;
  if (/עמיד.*ידיים|handstand/i.test(n)) return Zap;
  if (/קפיצ|jump|explosive|מתפרץ/i.test(n)) return Flame;
  return Dumbbell;
}
function WorkoutTable({ body }) {
  const lines = (body || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const levelLine = lines.find((l) => l.startsWith("LEVEL|"));
  const level = levelLine ? levelLine.slice(6) : null;
  const levelStyle = level ? (WORKOUT_LEVEL_STYLES[level] || { hex: "#71717a", emoji: "⚪" }) : null;
  const splitLine = lines.find((l) => l.startsWith("SPLIT|"));
  const split = splitLine ? splitLine.slice(6) : null;
  const splitStyle = split ? (SPLIT_TYPE_STYLES[split] || { hex: "#a855f7", icon: Dumbbell }) : null;
  const notes = lines.filter((l) => l.startsWith("META|")).map((l) => l.slice(5));
  const rows = lines.filter((l) => !l.startsWith("META|") && !l.startsWith("LEVEL|") && !l.startsWith("SPLIT|")).map((l) => l.split("|"));
  const isRichFormat = rows.length > 0 && rows[0].length >= 6;
  const [doneActs, setDoneActs] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copiedWorkout, setCopiedWorkout] = useState(false);
  function toggleAct(i) {
    setDoneActs((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      if (next.length === rows.length && rows.length > 0) setTimeout(() => setShowCelebration(true), 200);
      return next;
    });
  }
  const hexMain = levelStyle?.hex || "#10b981";
  // Rough total-time estimate: sets x (a per-set guess) + rest time between sets and before the next act.
  const estMinutes = isRichFormat ? Math.max(1, Math.round(rows.reduce((sum, r) => {
    const sets = parseInt(r[2], 10) || 1;
    const restBetween = (r[3] || "").match(/(\d+)/)?.[1] ? parseInt(r[3], 10) * (r[3].includes("דקה") || r[3].includes("דקות") ? 60 : 1) : 45;
    const restNext = (r[4] || "").match(/(\d+)/)?.[1] ? parseInt(r[4], 10) * (r[4].includes("דקה") || r[4].includes("דקות") ? 60 : 1) : 60;
    return sum + sets * (30 + restBetween) + restNext;
  }, 0) / 60)) : null;
  function copyWorkoutText() {
    const text = rows.map((r, i) => `${i + 1}. ${r[0]} - ${r[1]} x${r[2]} סבבים`).join("\n");
    try { navigator.clipboard?.writeText(text); setCopiedWorkout(true); setTimeout(() => setCopiedWorkout(false), 1800); } catch (e) {}
  }

  return (
    <div className="relative">
      <style>{`@keyframes wtBounce { 0% { transform: scale(1); } 40% { transform: scale(1.3) rotate(-6deg); } 100% { transform: scale(1); } }`}</style>
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={() => setShowCelebration(false)}>
          <style>{`
            @keyframes celebPop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
            @keyframes confettiFallBig { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(400px) rotate(540deg); opacity: 0; } }
          `}</style>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="absolute w-2 h-2 rounded-sm" style={{ left: `${(i * 41 + 5) % 100}%`, top: "-5%", backgroundColor: [hexMain, "#fbbf24", "#ffffff", "#ef4444"][i % 4], animation: `confettiFallBig ${1.5 + (i % 5) * 0.3}s ease-in ${i * 0.05}s both` }} />
            ))}
          </div>
          <div className="relative text-center" style={{ animation: "celebPop 0.4s cubic-bezier(0.16,1,0.3,1)" }} onClick={(e) => e.stopPropagation()}>
            <div className="relative inline-block mb-3">
              <span aria-hidden="true" className="absolute -inset-3 rounded-full pointer-events-none" style={{ "--gc": `${hexMain}90`, animation: "fxGlow 1.4s ease-in-out infinite" }} />
              <div className="relative text-6xl">🏆</div>
            </div>
            <div className="text-2xl font-black text-white mb-1">האימון הושלם!</div>
            <div className="text-[13px] text-zinc-400 mb-5">כל {rows.length} האקטים בוצעו - עבודה מצוינת</div>
            <button onClick={() => setShowCelebration(false)} className="rounded-2xl px-8 py-3 font-black text-black" style={{ background: `linear-gradient(135deg, ${hexMain}, ${hexMain}cc)` }}>
              המשך
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {level && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ backgroundColor: `${levelStyle.hex}20`, boxShadow: `0 0 0 1.5px ${levelStyle.hex}50 inset`, "--gc": `${levelStyle.hex}70`, animation: "fxGlow 2.8s ease-in-out infinite" }}>
            <span>{levelStyle.emoji}</span>
            <span className="text-[12px] font-black" style={{ color: levelStyle.hex }}>רמה: {level}</span>
          </div>
        )}
        {split && splitStyle && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ backgroundColor: `${splitStyle.hex}20`, boxShadow: `0 0 0 1.5px ${splitStyle.hex}50 inset` }}>
            <splitStyle.icon size={11} style={{ color: splitStyle.hex }} />
            <span className="text-[12px] font-black" style={{ color: splitStyle.hex }}>{split}</span>
          </div>
        )}
        {isRichFormat && estMinutes && (
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-zinc-900 text-zinc-400 text-[12px] font-bold">
            <Clock size={11} /> {estMinutes >= 60 ? `${Math.floor(estMinutes / 60)} שעה ${estMinutes % 60 ? estMinutes % 60 + " דק׳" : ""}` : `${estMinutes} דק׳`}
          </div>
        )}
        {isRichFormat && rows.length > 0 && (
          <button onClick={copyWorkoutText} className="mr-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-zinc-900 text-zinc-400 text-[12px] font-bold active:scale-95 transition">
            {copiedWorkout ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />} {copiedWorkout ? "הועתק" : "העתק"}
          </button>
        )}
      </div>
      {isRichFormat && rows.length > 0 && (
        <div className="relative rounded-xl overflow-hidden bg-black/30 px-3 py-2.5 mb-3 flex items-center gap-3">
          <FxRing size={38} stroke={3.5} pct={(doneActs.length / rows.length) * 100} hex={hexMain}>
            <span className="text-[11px] font-black tabular-nums" style={{ color: hexMain }}>{doneActs.length}/{rows.length}</span>
          </FxRing>
          <div className="flex-1">
            <div className="text-[11px] text-zinc-400 font-bold mb-1">התקדמות באימון</div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(doneActs.length / rows.length) * 100}%`, backgroundColor: hexMain, boxShadow: `0 0 8px ${hexMain}` }} />
            </div>
          </div>
        </div>
      )}
      {notes.map((n, i) => (
        <div key={i} className="text-sm text-amber-400 font-semibold mb-2 flex items-start gap-1.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 px-3 py-2">
          <Target size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <span>{n}</span>
        </div>
      ))}
      {isRichFormat ? (
        <div className="space-y-2.5">
          <style>{`@keyframes actCardFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes restTimerDone { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`}</style>
          {rows.map((r, i) => {
            const [name, duration, sets, restBetween, restNext, emphasis] = r;
            const hex = levelStyle?.hex || "#10b981";
            const isDone = doneActs.includes(i);
            const ActIcon = exerciseIcon(name);
            return (
              <div key={i} {...fxTilt(4)} className="relative rounded-2xl overflow-hidden p-3.5" style={{ ...fxTiltStyle, background: isDone ? `linear-gradient(120deg, ${hex}22, transparent 70%), var(--card-base-alt)` : `linear-gradient(120deg, ${hex}14, transparent 70%), var(--card-base-alt)`, boxShadow: isDone ? `0 0 0 1.5px ${hex}70 inset, 0 0 14px 0 ${hex}30` : `0 0 0 1.5px ${hex}35 inset`, animation: `actCardFadeUp 0.3s ease-out ${i * 0.05}s both`, opacity: isDone ? 0.85 : 1 }}>
                <FxSpot radius="1rem" />
                {isDone && <HudCorners hex={hex} corners={2} inset={7} />}
                <div className="absolute right-0 top-3 bottom-3 w-[3px] rounded-full pointer-events-none" style={{ backgroundColor: hex, opacity: isDone ? 0.9 : 0.4, boxShadow: isDone ? `0 0 6px ${hex}` : "none" }} />
                <div className="relative flex items-center gap-2.5 mb-2.5">
                  <button onClick={() => toggleAct(i)} className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 transition" style={{ backgroundColor: isDone ? hex : `${hex}25`, color: isDone ? "#000" : hex, animation: isDone ? "wtBounce 0.4s ease-out" : undefined }}>
                    {isDone ? <Check size={14} /> : i + 1}
                  </button>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}18` }}>
                    <ActIcon size={13} style={{ color: hex }} />
                  </div>
                  <span className={`font-black text-[15px] leading-tight flex-1 ${isDone ? "text-zinc-400 line-through" : "text-zinc-100"}`}>{name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="rounded-lg bg-black/30 px-2.5 py-1.5">
                    <div className="text-[9px] text-zinc-500 font-bold mb-0.5">משך זמן</div>
                    <div className="text-[13px] font-black text-white tabular-nums">{duration || "-"}</div>
                  </div>
                  <div className="rounded-lg bg-black/30 px-2.5 py-1.5">
                    <div className="text-[9px] text-zinc-500 font-bold mb-0.5">סבבים</div>
                    <div className="text-[13px] font-black text-white tabular-nums">{sets || "-"}</div>
                  </div>
                  <RestTimerButton label="מנוחה בין סבבים" text={restBetween} hex={hex} />
                  <RestTimerButton label="מנוחה לאקט הבא" text={restNext} hex={hex} />
                </div>
                {emphasis && (
                  <div className="flex items-start gap-1.5 text-[12px] text-sky-300 bg-sky-500/[0.07] rounded-lg px-2.5 py-1.5">
                    <Compass size={12} className="text-sky-400 shrink-0 mt-0.5" />
                    <span>{emphasis}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : rows.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.06)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-l from-emerald-500/15 to-emerald-500/5 border-b border-emerald-500/20">
                <th className="text-right font-black text-emerald-400 py-2.5 px-3 text-[12px] tracking-wide">תרגיל</th>
                <th className="text-center font-black text-emerald-400 py-2.5 px-1.5 text-[12px] tracking-wide">סטים</th>
                <th className="text-center font-black text-emerald-400 py-2.5 px-1.5 text-[12px] tracking-wide">חזרות</th>
                <th className="text-center font-black text-emerald-400 py-2.5 px-1.5 text-[12px] tracking-wide">מנוחה</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`border-b border-zinc-800/60 last:border-0 ${i % 2 === 0 ? "bg-zinc-950" : "bg-black"}`}>
                  <td className="text-right py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                      <span className="font-bold text-zinc-100 text-[14px] leading-tight">{r[0]}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-1">
                    <span className="inline-block min-w-[28px] font-black text-base text-white tabular-nums">{r[1] || "-"}</span>
                  </td>
                  <td className="text-center py-3 px-1.5">
                    <span className="text-[13px] font-bold text-zinc-300 tabular-nums">{r[2] || "-"}</span>
                  </td>
                  <td className="text-center py-3 px-1.5">
                    <span className="text-[12px] font-semibold text-amber-400/90 tabular-nums">{r[3] || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WorkoutCard({ it, isOpen, onToggle, index, isCompleted, onToggleCompleted, isFavorite, onToggleFavorite, isNew, note, onSaveNote }) {
  const flavors = [
    { hex: "#f97316", label: "כוח" },
    { hex: "#ef4444", label: "עצימות" },
    { hex: "#eab308", label: "מתח" },
    { hex: "#10b981", label: "ביצוע" },
  ];
  const levelLine = (it.body || "").split("\n").find((l) => l.trim().startsWith("LEVEL|"));
  const level = levelLine ? levelLine.trim().slice(6) : null;
  const levelStyle = level ? WORKOUT_LEVEL_STYLES[level] : null;
  const flavor = levelStyle ? { hex: levelStyle.hex, label: level } : flavors[index % flavors.length];
  const diff = DIFFICULTY_STYLE[it.difficulty];
  return (
    <div id={`workout-${it.id}`} {...fxTilt(4)} className="rounded-2xl overflow-hidden border relative" style={{ ...fxTiltStyle, borderColor: isOpen ? flavor.hex : "#27272a", background: isOpen ? `linear-gradient(160deg, ${flavor.hex}18, transparent 60%), var(--card-base)` : "var(--card-base-alt)", animation: `bankItemFadeUp 0.3s ease-out ${Math.min(index, 8) * 0.04}s both`, opacity: isCompleted ? 0.7 : 1 }}>
      <FxSpot radius="1rem" />
      {isOpen && <HudCorners hex={flavor.hex} corners={2} inset={7} />}
      {isNew && (
        <span className="absolute top-2 left-2 z-10 text-[9px] font-black text-black bg-emerald-400 rounded-full px-2 py-0.5" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }}>חדש</span>
      )}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4">
        <button onClick={onToggleCompleted} className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition ${isCompleted ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}>
          {isCompleted && <Check size={13} className="text-black" />}
        </button>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${flavor.hex}, ${flavor.hex}99)`, boxShadow: `0 4px 14px ${flavor.hex}45` }}>
          {levelStyle ? <span className="text-lg">{levelStyle.emoji}</span> : <Flame size={20} className="text-white" />}
        </div>
        <div className="flex-1 text-right min-w-0">
          <div className={`text-lg font-black leading-tight truncate ${isCompleted ? "text-zinc-500 line-through" : "text-zinc-50"}`}>{it.title}</div>
          {(diff || level) && (
            <span className={`inline-flex items-center gap-1 mt-1 rounded-full px-2 py-0.5 text-[11px] font-bold border ${diff ? `${diff.bg} ${diff.text} ${diff.border}` : ""}`} style={!diff ? { backgroundColor: `${flavor.hex}18`, color: flavor.hex, borderColor: `${flavor.hex}40` } : undefined}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: diff?.hex || flavor.hex }} /> {it.difficulty || level}
            </span>
          )}
        </div>
        <button onClick={onToggleFavorite} className="shrink-0"><Star size={17} className={isFavorite ? "text-amber-400" : "text-zinc-700"} fill={isFavorite ? "#fbbf24" : "none"} /></button>
        <ChevronDown size={20} className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} style={{ color: isOpen ? flavor.hex : "#71717a" }} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <WorkoutTable body={it.body} />
          <div className="mt-3 rounded-xl bg-black/30 p-2.5">
            <div className="text-[11px] font-bold text-zinc-500 mb-1.5">הערות אישיות</div>
            <textarea
              defaultValue={note}
              onBlur={(e) => onSaveNote(e.target.value)}
              placeholder="איך הלך? מה כדאי לזכור בפעם הבאה..."
              rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-[13px] text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// HOME PAGE VISUAL LAYER
// Everything below is decoration: pointer-events are off, it is hidden from
// screen readers, and every animation is switched off for people who have
// "reduce motion" enabled (see the media query inside HomeAmbience).
// ---------------------------------------------------------------------------

// Scroll parallax: publishes the main scroll offset as a CSS variable
// (--hm-scroll) that the ambient layers use to drift at different speeds.
function useHomeScrollParallax() {
  useEffect(() => {
    let raf = 0;
    const onScroll = (ev) => {
      const t = ev.target;
      const isDoc = t === document || t === document.documentElement;
      // Ignore small scrollers (chip rows, textareas) - only the main tall scroller drives parallax.
      if (!isDoc && (t.clientHeight || 0) < 300) return;
      const st = isDoc ? window.scrollY : t.scrollTop;
      if (typeof st !== "number") return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => document.documentElement.style.setProperty("--hm-scroll", String(Math.round(st))));
    };
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      cancelAnimationFrame(raf);
      document.documentElement.style.removeProperty("--hm-scroll");
    };
  }, []);
}

// Expanding ring at the exact spot of every tap/click.
function spawnTouchRing(e, color) {
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const size = 34;
    const el = document.createElement("span");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `position:fixed;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color}cc;box-shadow:0 0 12px ${color}80;pointer-events:none;z-index:70;animation:hmRing 0.6s ease-out forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
  } catch (err) {}
}

// Small pulsing HUD-style corner brackets for a card (parent must be positioned).
function HudCorners({ hex, corners = 4, size = 12, inset = 8 }) {
  const all = [["top", "right", "border-t-2 border-r-2"], ["top", "left", "border-t-2 border-l-2"], ["bottom", "right", "border-b-2 border-r-2"], ["bottom", "left", "border-b-2 border-l-2"]].slice(0, corners);
  return all.map(([v, h, b], i) => (
    <span key={i} aria-hidden="true" className={`absolute ${b} pointer-events-none`} style={{ [v]: inset, [h]: inset, width: size, height: size, borderColor: `${hex}75`, animation: `fxCorner 3s ease-in-out ${i * 0.4}s infinite` }} />
  ));
}

// Section divider: fading line, twinkling diamond, fading line.
function HomeDivider({ hex }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-2 h-3 -my-1">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, ${hex}66, transparent)` }} />
      <span className="text-[9px] leading-none" style={{ color: hex, animation: "fxTwinkle 3.2s ease-in-out infinite" }}>✦</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${hex}66, transparent)` }} />
    </div>
  );
}

// A thin 24-hour track with a glowing sun/moon marker at the current time.
// The day starts on the right (RTL), matching the rest of the app.
function DayTrack({ pct, accent, Icon }) {
  return (
    <div aria-hidden="true" className="relative mt-3.5 mb-1.5 h-7">
      <div className="absolute inset-x-1 top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(270deg, #4338ca66, #f59e0b77, #38bdf877, #f9731677, #a855f766)" }} />
      {[25, 50, 75].map((t) => <span key={t} className="absolute top-1/2 w-px h-2 -translate-y-1/2 bg-white/15" style={{ right: `${t}%` }} />)}
      <div className="absolute top-1/2 w-6 h-6 -translate-y-1/2 rounded-full flex items-center justify-center" style={{ right: `calc(${Math.min(100, Math.max(0, pct))}% - 12px)`, backgroundColor: "#000", boxShadow: `0 0 0 1.5px ${accent}, 0 0 14px 2px ${accent}80` }}>
        <Icon size={12} style={{ color: accent }} />
      </div>
      <span className="absolute -bottom-1.5 right-1 text-[8px] text-zinc-600 font-bold">00:00</span>
      <span className="absolute -bottom-1.5 left-1 text-[8px] text-zinc-600 font-bold">24:00</span>
    </div>
  );
}

// Decorations that live inside the hero card (which is overflow-hidden).
function HeroFx({ hex, hex2 }) {
  return (
    <>
      {/* rotating gradient border ring - only the 1.5px border area is visible */}
      <div aria-hidden="true" className="absolute inset-0 rounded-3xl pointer-events-none" style={{ padding: 1.5, overflow: "hidden", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude" }}>
        <div style={{ position: "absolute", inset: "-100%", background: `conic-gradient(from 0deg, transparent 0%, ${hex} 10%, transparent 26%, transparent 55%, ${hex2} 68%, transparent 84%)`, animation: "hmSpin 8s linear infinite" }} />
      </div>
      {/* diagonal light sweep that crosses the card every few seconds */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "38%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.10), transparent)", animation: "hmSweep 9s ease-in-out 1.5s infinite" }} />
      </div>
      {/* twinkling star glyphs */}
      {[["top-3 right-1/3", 8, 0], ["top-9 left-10", 6, 1.2], ["bottom-7 right-16", 7, 2.1], ["top-16 right-6", 5, 0.6], ["bottom-12 left-1/3", 6, 1.7]].map(([pos, sz, dl], i) => (
        <span key={i} aria-hidden="true" className={`absolute ${pos} pointer-events-none leading-none`} style={{ fontSize: sz, color: i % 2 ? hex2 : "#fff", animation: `hmTwinkle ${3 + (i % 3)}s ease-in-out ${dl}s infinite` }}>✦</span>
      ))}
      {/* 1px top highlight and glowing bottom edge */}
      <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
      <div aria-hidden="true" className="absolute bottom-0 left-6 right-6 h-[2px] pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${hex}, ${hex2}, transparent)`, animation: "hmBreathe 4s ease-in-out infinite" }} />
      <HudCorners hex={hex} corners={2} inset={10} />
    </>
  );
}

// Fixed background layer behind the Home page: drifting aurora glows, rising
// particles, stars, rays, grain and vignette - plus the CSS for the page-wide
// entrance animation and press feedback.
function HomeAmbience({ accent, hex, violet }) {
  const par = (k) => ({ transform: `translate3d(0, calc(var(--hm-scroll, 0) * ${k}px), 0)` });
  const blob = (key, style, c1, c2, dur, k) => (
    <div key={key} style={{ position: "absolute", ...style, ...par(k) }}>
      <div style={{ position: "relative", width: "100%", height: "100%", animation: `hmDrift ${dur}s ease-in-out infinite` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${c1}55 0%, transparent 65%)`, animation: `hmFade ${dur * 1.4}s ease-in-out infinite` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${c2}55 0%, transparent 65%)`, animation: `hmFade ${dur * 1.4}s ease-in-out -${dur * 0.7}s infinite` }} />
      </div>
    </div>
  );
  return (
    <div aria-hidden="true" className="hm-ambience" style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, maxWidth: "var(--app-max-width)", marginInline: "auto", pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <style>{`
        @keyframes hmEnter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes hmDrift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(24px, -30px) scale(1.12); } }
        @keyframes hmFade { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes hmRise { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 0.55; } 90% { opacity: 0.3; } 100% { transform: translate(18px, -105vh); opacity: 0; } }
        @keyframes hmTwinkle { 0%, 100% { opacity: 0.25; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.25); } }
        @keyframes hmBreathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
        @keyframes hmShoot { 0% { opacity: 0; transform: translate(0, 0) rotate(-28deg); } 2% { opacity: 1; } 8% { opacity: 0; transform: translate(-320px, 150px) rotate(-28deg); } 100% { opacity: 0; transform: translate(-320px, 150px) rotate(-28deg); } }
        @keyframes hmSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes hmSweep { 0%, 62% { transform: translateX(-130%); } 100% { transform: translateX(330%); } }
        @keyframes hmCorner { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.85; } }
        @keyframes hmHalo { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.14); opacity: 0.05; } }
        @keyframes hmOrbit { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes hmShine { 0%, 100% { background-position: 120% 0; } 50% { background-position: -20% 0; } }
        @keyframes hmScan { 0% { transform: translateY(-120%); } 100% { transform: translateY(520%); } }
        @keyframes hmBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes hmRing { from { transform: scale(0.35); opacity: 0.95; } to { transform: scale(2.6); opacity: 0; } }
        @keyframes hmBar { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }

        /* page-wide staggered entrance (fixed-position modals are excluded so they never get a transform) */
        .hm-root > :not(.fixed):not(style) { animation: hmEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .hm-root > :nth-child(2) { animation-delay: 0.04s; } .hm-root > :nth-child(3) { animation-delay: 0.08s; }
        .hm-root > :nth-child(4) { animation-delay: 0.12s; } .hm-root > :nth-child(5) { animation-delay: 0.16s; }
        .hm-root > :nth-child(6) { animation-delay: 0.20s; } .hm-root > :nth-child(7) { animation-delay: 0.24s; }
        .hm-root > :nth-child(8) { animation-delay: 0.28s; } .hm-root > :nth-child(9) { animation-delay: 0.32s; }
        .hm-root > :nth-child(10) { animation-delay: 0.36s; } .hm-root > :nth-child(11) { animation-delay: 0.40s; }
        .hm-root > :nth-child(n+12) { animation-delay: 0.44s; }

        /* press feedback for every button on the page */
        .hm-root button:not(:disabled):active { filter: brightness(1.16); }

        /* gradient-shine greeting */
        .hm-shine { background-image: linear-gradient(100deg, #fafafa 0%, #fafafa 38%, var(--hm-accent, #fff) 50%, #fafafa 62%, #fafafa 100%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: hmShine 7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hm-ambience *, .hm-shine, .hm-root > * { animation: none !important; }
        }
      `}</style>

      {/* time-of-day colour wash + top spotlight */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${accent}12 0%, transparent 45%)` }} />
      <div style={{ position: "absolute", top: -60, left: "50%", width: 340, height: 440, marginLeft: -170, background: `radial-gradient(ellipse at top, ${accent}2a, transparent 70%)`, animation: "hmBreathe 7s ease-in-out infinite" }} />

      {/* drifting aurora glows (colour cross-fades between two hues, parallax on scroll) */}
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
        {blob("a", { top: -90, right: -130, width: 380, height: 380 }, hex, violet, 16, -0.05)}
        {blob("b", { top: "38%", left: -150, width: 340, height: 340 }, violet, accent, 21, -0.09)}
        {blob("c", { bottom: -140, right: "6%", width: 360, height: 360 }, accent, hex, 26, -0.13)}
      </div>

      {/* light rays */}
      {[["26%", 16], ["64%", -14]].map(([left, rot], i) => (
        <div key={i} style={{ position: "absolute", top: -20, left, width: 64, height: 520, background: `linear-gradient(180deg, ${accent}26, transparent 85%)`, transform: `rotate(${rot}deg)`, transformOrigin: "top", animation: `hmBar ${8 + i * 3}s ease-in-out ${i * 2}s infinite` }} />
      ))}

      {/* rising particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{ position: "absolute", bottom: -10, left: `${(i * 53 + 7) % 96}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", backgroundColor: i % 3 === 0 ? hex : accent, opacity: 0, animation: `hmRise ${14 + (i % 5) * 3}s linear ${(i * 1.7) % 12}s infinite` }} />
      ))}

      {/* twinkling stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} style={{ position: "absolute", top: `${(i * 37 + 6) % 70}%`, left: `${(i * 61 + 9) % 92}%`, fontSize: 6 + (i % 3) * 3, color: "#fff", lineHeight: 1, animation: `hmTwinkle ${3 + (i % 4)}s ease-in-out ${i * 0.7}s infinite` }}>✦</span>
      ))}

      {/* shooting star (visible for a moment every ~11s) */}
      <span style={{ position: "absolute", top: "11%", right: "-6%", width: 90, height: 1.5, background: "linear-gradient(90deg, transparent, #fff)", opacity: 0, animation: "hmShoot 11s ease-in 4s infinite" }} />

      {/* film grain (static, cheap) + soft edge vignette */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.035, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 58%, rgba(0,0,0,0.5) 100%)" }} />
    </div>
  );
}

function HomeTab({ warMode, goToWarChat, officialEvents, personalLogs, goToHub, goToValue, goToFeedback, goToCalendar, goToFitness, goToPath, goToProfile, role, isIndividual, trainingContent, articles, valuesContent, profile, showToast, userId, networkId, requiresPayment, paymentStatus, isPremium, removePersonalLog, updateProfile, resetSignal, scrollToTop }) {
  const gibushDate = profile?.gibushDate ? new Date(`${profile.gibushDate}T06:00:00`) : null;
  const [timeLeft, setTimeLeft] = useState(() => (gibushDate ? formatCountdown(gibushDate - new Date()) : null));
  useEffect(() => {
    if (!gibushDate) { setTimeLeft(null); return; }
    setTimeLeft(formatCountdown(gibushDate - new Date()));
    const id = setInterval(() => setTimeLeft(formatCountdown(gibushDate - new Date())), 1000);
    return () => clearInterval(id);
  }, [profile?.gibushDate]);
  const [openWeek, setOpenWeek] = useState(0);
  const [nowTick, setNowTick] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNowTick(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const dayPct = Math.round(((nowTick.getHours() * 60 + nowTick.getMinutes()) / 1440) * 100);
  const currentHour = nowTick.getHours();
  const timeAccent = currentHour < 6 ? "#6366f1" : currentHour < 12 ? "#f59e0b" : currentHour < 17 ? "#38bdf8" : currentHour < 21 ? "#f97316" : "#a855f7";
  const TimeIcon = currentHour < 6 ? Moon : currentHour < 18 ? Sun : Moon;
  const [tilt, setTilt] = useState(null);

  const [homeView, setHomeView] = useState("main");
  useHomeScrollParallax();
  const [showPremiumPromo, setShowPremiumPromo] = useState(false);
  useEffect(() => {
    if (!isIndividual || isPremium) return;
    const lastShown = localStorage.getItem("sayert_premium_promo_shown");
    if (lastShown === toKey(new Date())) return;
    const timer = setTimeout(() => {
      setShowPremiumPromo(true);
      try { localStorage.setItem("sayert_premium_promo_shown", toKey(new Date())); } catch (e) {}
    }, 2500);
    return () => clearTimeout(timer);
  }, [isIndividual, isPremium]);
  const [boardPosts, setBoardPosts] = useState([]);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [boardRequests, setBoardRequests] = useState({ sent: [], received: [] });
  const [showAddPost, setShowAddPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postTime, setPostTime] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [postNotes, setPostNotes] = useState("");
  const [postingBoard, setPostingBoard] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [boardSearch, setBoardSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState("all"); // 'all' | 'today' | 'mine'
  const [showMyRequests, setShowMyRequests] = useState(false);

  async function refreshBoard() {
    setLoadingBoard(true);
    const [posts, reqs] = await Promise.all([loadTrainingPosts(networkId), loadJoinRequestsRemote(userId)]);
    setBoardPosts(posts);
    setBoardRequests(reqs);
    setLoadingBoard(false);
  }
  useEffect(() => {
    if (homeView === "training_board") refreshBoard();
  }, [homeView]);

  async function submitBoardPost() {
    if (!postTitle.trim() || !postDate || !postTime) { showToast?.("נא למלא כותרת, תאריך ושעה", "error"); return; }
    setPostingBoard(true);
    try {
      const saved = await addTrainingPostRemote({ userId, networkId, title: postTitle.trim(), category: postCategory, date: postDate, time: postTime, location: postLocation.trim(), notes: postNotes.trim() });
      setBoardPosts((prev) => [...prev, { ...saved, posterName: profile?.fullName || "אני" }].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)));
      setPostTitle(""); setPostCategory(""); setPostDate(""); setPostTime(""); setPostLocation(""); setPostNotes("");
      setShowAddPost(false);
      showToast?.("האימון פורסם!", "success");
    } catch (e) {
      showToast?.("שגיאה בפרסום", "error");
    } finally {
      setPostingBoard(false);
    }
  }
  async function requestToJoin(postId) {
    await sendJoinRequestRemote(postId, userId);
    setBoardRequests((prev) => ({ ...prev, sent: [...prev.sent, { postId, status: "pending" }] }));
    showToast?.("בקשת הצטרפות נשלחה!", "success");
  }
  async function respondToRequest(reqId, status) {
    await respondJoinRequestRemote(reqId, status);
    setBoardRequests((prev) => ({ ...prev, received: prev.received.map((r) => (r.id === reqId ? { ...r, status } : r)) }));
  }
  async function deleteBoardPost(id) {
    await removeTrainingPostRemote(id);
    setBoardPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const [trainingSummaries, setTrainingSummaries] = useState([]);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  const [summarySearch, setSummarySearch] = useState("");
  const [summarySort, setSummarySort] = useState("new"); // 'new' | 'old'
  const [savedSummaryIds, setSavedSummaryIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_saved_summaries") || "[]"); } catch (e) { return []; }
  });
  const [recentSummaryIds, setRecentSummaryIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_recent_summaries") || "[]"); } catch (e) { return []; }
  });
  const [openSummary, setOpenSummary] = useState(null);
  function toggleSavedSummary(id, e) {
    e?.stopPropagation();
    setSavedSummaryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_saved_summaries", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  function openSummaryDetail(s) {
    setOpenSummary(s);
    setRecentSummaryIds((prev) => {
      const next = [s.id, ...prev.filter((x) => x !== s.id)].slice(0, 6);
      try { localStorage.setItem("sayert_recent_summaries", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  useEffect(() => {
    if (homeView !== "training_summaries" || trainingSummaries.length > 0) return;
    setLoadingSummaries(true);
    loadContentRemote("training_summary").then((rows) => { setTrainingSummaries(rows); setLoadingSummaries(false); });
  }, [homeView]);

  useEffect(() => { scrollToTop?.(); }, [homeView]);
  useEffect(() => { if (resetSignal) setHomeView("main"); }, [resetSignal]);
  const [activeBank, setActiveBank] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({ "כושר קרבי": true, "כושר רגיל": true });
  const [magerSearch, setMagerSearch] = useState("");
  const [magerOnlyWithContent, setMagerOnlyWithContent] = useState(false);
  const [magerFavCategories, setMagerFavCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_mager_fav_categories") || "[]"); } catch (e) { return []; }
  });
  const [magerRecentCategories, setMagerRecentCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_mager_recent_categories") || "[]"); } catch (e) { return []; }
  });
  const [todaySpotOverride, setTodaySpotOverride] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [magerCompactView, setMagerCompactView] = useState(false);
  const [lastCompletedUndo, setLastCompletedUndo] = useState(null);
  const [showAiWhyModal, setShowAiWhyModal] = useState(null);
  const [aiWhyText, setAiWhyText] = useState("");
  const [loadingAiWhy, setLoadingAiWhy] = useState(false);
  async function askAiWhyImportant(bank) {
    setShowAiWhyModal(bank);
    setAiWhyText("");
    setLoadingAiWhy(true);
    try {
      const sys = "אתה מאמן כושר קרבי לבני נוער בהכנה לגיוס. הסבר בקצרה (2-3 משפטים) למה קטגוריית האימון הזו חשובה, ואיך היא עוזרת בגיבושים ובשירות קרבי. תשובה ישירה בלבד, בלי הקדמות.";
      const reply = await aiChat(sys, `למה חשוב להתאמן על "${bank.title}"?`);
      setAiWhyText(reply);
    } catch (e) {
      setAiWhyText("לא הצלחתי לקבל תשובה כרגע.");
    } finally {
      setLoadingAiWhy(false);
    }
  }
  const [loadingAiRecommendation, setLoadingAiRecommendation] = useState(false);
  async function getAiRecommendation() {
    setLoadingAiRecommendation(true);
    try {
      const allWorkouts = (trainingContent || []).filter((t) => t.title !== "עקרונות ומטרות");
      const doneList = allWorkouts.filter((w) => completedWorkoutIds.includes(w.id)).map((w) => `${w.title} (${w.subcategory})`).join(", ") || "עדיין לא סימן שום אימון כבוצע";
      const availableList = TRAINING_BANK.map((b) => b.title).join(", ");
      const sys = `אתה מאמן כושר קרבי. תבחר עבור המתאמן קטגוריית אימון אחת בדיוק מתוך הרשימה הבאה, ותסביר בקצרה (משפט אחד) למה זו הבחירה הנכונה עכשיו, בהתחשב במה שכבר בוצע. קטגוריות זמינות: ${availableList}. החזר אך ורק JSON: {"category": "שם הקטגוריה המדויק מהרשימה", "reason": "משפט קצר"}`;
      const reply = await aiChat(sys, `מה שכבר בוצע: ${doneList}. מה מומלץ עכשיו?`);
      const match = reply.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      if (parsed?.category) {
        const bank = TRAINING_BANK.find((b) => b.title === parsed.category);
        setAiRecommendation({ bank, reason: parsed.reason });
      }
    } catch (e) {
      showToast?.("לא הצלחתי לקבל המלצה כרגע", "error");
    } finally {
      setLoadingAiRecommendation(false);
    }
  }
  function toggleMagerFavorite(id, e) {
    e?.stopPropagation();
    setMagerFavCategories((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_mager_fav_categories", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  function openMagerCategory(b) {
    setActiveBank(b);
    setHomeView("bank_detail");
    setMagerRecentCategories((prev) => {
      const next = [b.id, ...prev.filter((x) => x !== b.id)].slice(0, 6);
      try { localStorage.setItem("sayert_mager_recent_categories", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  const [bankSearch, setBankSearch] = useState("");
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState("all");
  const [bankSplitFilter, setBankSplitFilter] = useState("all"); // workout-type filter (PPL/U-L/Arnold/etc), for categories that tag it
  const [bankSort, setBankSort] = useState("default"); // 'default' | 'easiest' | 'hardest' | 'newest'
  const [bankAllExpanded, setBankAllExpanded] = useState(false);
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_completed_workouts") || "[]"); } catch (e) { return []; }
  });
  const [favoriteWorkoutIds, setFavoriteWorkoutIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_fav_workouts") || "[]"); } catch (e) { return []; }
  });
  const [recentWorkoutIds, setRecentWorkoutIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_recent_workouts") || "[]"); } catch (e) { return []; }
  });
  const [workoutNotes, setWorkoutNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_workout_notes") || "{}"); } catch (e) { return {}; }
  });
  const [showBankScrollTop, setShowBankScrollTop] = useState(false);
  function toggleWorkoutCompleted(id, e) {
    e?.stopPropagation();
    setCompletedWorkoutIds((prev) => {
      const wasCompleted = prev.includes(id);
      const next = wasCompleted ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_completed_workouts", JSON.stringify(next)); } catch (err) {}
      if (!wasCompleted) {
        setLastCompletedUndo(id);
        setTimeout(() => setLastCompletedUndo((cur) => (cur === id ? null : cur)), 4000);
      }
      return next;
    });
  }
  function toggleWorkoutFavorite(id, e) {
    e?.stopPropagation();
    setFavoriteWorkoutIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_fav_workouts", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  function trackRecentWorkout(id) {
    setRecentWorkoutIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5);
      try { localStorage.setItem("sayert_recent_workouts", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  function saveWorkoutNote(id, text) {
    setWorkoutNotes((prev) => {
      const next = { ...prev, [id]: text };
      try { localStorage.setItem("sayert_workout_notes", JSON.stringify(next)); } catch (err) {}
      return next;
    });
  }
  const [openWorkoutId, setOpenWorkoutId] = useState(null);
  const todayKey = toKey(new Date());
  const todayEvents = officialEvents.filter((e) => e.date === todayKey);
  const openFeedbackEvent = role !== "admin" ? getOpenFeedbackEvent(officialEvents) : null;

  // ---- Streak gauge: +2/day if active on consecutive days, -2 per missed day ----
  useEffect(() => {
    if (!profile || !updateProfile) return;
    const last = profile.streakLastDate;
    if (last === todayKey) return; // already checked in today
    let next = profile.streakValue || 0;
    if (last) {
      const gapDays = Math.round((new Date(todayKey) - new Date(last)) / 86400000);
      if (gapDays === 1) next = Math.min(100, next + 2);
      else if (gapDays > 1) next = Math.max(0, next - 2 * (gapDays - 1));
    }
    updateProfile({ streakValue: next, streakLastDate: todayKey });
  }, [profile?.streakLastDate]);
  const streakValue = profile?.streakValue || 0;

  // ---- Load gauge: based on how many trainings (personal + official) happened this week ----
  function weekStart(d) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() - dt.getDay()); // Sunday start
    dt.setHours(0, 0, 0, 0);
    return dt;
  }
  const thisWeekStartKey = toKey(weekStart(new Date()));
  const trainingsThisWeek = useMemo(() => {
    const official = (officialEvents || []).filter((e) => e.date >= thisWeekStartKey && e.date <= todayKey).length;
    const personal = (personalLogs || []).filter((e) => e.date >= thisWeekStartKey && e.date <= todayKey).length;
    return official + personal;
  }, [officialEvents, personalLogs, thisWeekStartKey, todayKey]);

  const track = profile?.gibushDate ? "gibush" : profile?.level === "מתחיל" ? "beginner" : profile?.level === "מתקדם" ? "advanced" : "draft";
  const LOAD_TABLE = {
    beginner: { 0: 0, 1: 25, 2: 60, 3: 80, 4: 95, 5: 100 },
    advanced: { 0: 0, 1: 25, 2: 40, 3: 65, 4: 80, 5: 92 },
    gibush: { 0: 0, 1: 25, 2: 35, 3: 60, 4: 77, 5: 90 },
    draft: { 0: 0, 1: 25, 2: 40, 3: 60, 4: 80, 5: 94 },
  };
  const loadTable = LOAD_TABLE[track];
  const loadValue = loadTable[Math.min(trainingsThisWeek, 5)];

  // ---- Individual-account metrics: replace the team-only attendance gauge with two
  // metrics that make sense without a team - monthly volume and this week's completion. ----
  const thisMonthKey = todayKey.slice(0, 7);
  const trainingsThisMonth = useMemo(() => (personalLogs || []).filter((e) => e.date?.startsWith(thisMonthKey)).length, [personalLogs, thisMonthKey]);
  const daysIntoWeekSoFar = new Date().getDay() + 1; // Sunday=0 -> 1 day in, etc.
  const daysWithTrainingThisWeek = useMemo(() => {
    const uniqueDates = new Set((personalLogs || []).filter((e) => e.date >= thisWeekStartKey && e.date <= todayKey).map((e) => e.date));
    return uniqueDates.size;
  }, [personalLogs, thisWeekStartKey, todayKey]);
  const weekCompletionValue = Math.min(100, Math.round((daysWithTrainingThisWeek / Math.max(1, daysIntoWeekSoFar)) * 100));
  const monthlyVolumeValue = Math.min(100, trainingsThisMonth * 8); // ~12-13 sessions/month reaches 100

  // ---- Attendance gauge: % of official trainings the trainee was marked present for ----
  const [attendanceValue, setAttendanceValue] = useState(0);
  useEffect(() => {
    if (!userId) return;
    loadAllIndividualAttendance().then((all) => {
      const mine = all.filter((r) => r.userId === userId);
      if (mine.length === 0) { setAttendanceValue(0); return; }
      const present = mine.filter((r) => r.present).length;
      setAttendanceValue(Math.round((present / mine.length) * 100));
    });
  }, [userId]);

  const gibushHex = (GIBUSH_TYPE_COLORS[profile?.gibushType] || {}).hex || "#10b981";

  // ---- Next-training logic: today, else next upcoming, else a suggestion ----
  const nextTrainingInfo = useMemo(() => {
    const allUpcoming = [
      ...(officialEvents || []).map((e) => ({ ...e, group: true })),
      ...(personalLogs || []).map((e) => ({ ...e, group: false })),
    ].filter((e) => e.date >= todayKey).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const hasEnded = (e) => {
      if (e.date !== todayKey) return false;
      const startMin = timeToMinutes(e.time || "00:00");
      const endMin = e.endTime ? timeToMinutes(e.endTime) : startMin + 60;
      return endMin <= nowMinutes;
    };

    const today = allUpcoming.filter((e) => e.date === todayKey && !hasEnded(e));
    const future = allUpcoming.filter((e) => e.date > todayKey);
    const next = future[0] || null;

    if (today.length === 0 && !next) {
      const dow = new Date().getDay(); // 0=Sun..6=Sat
      const isLateWeek = [3, 4, 5, 6].includes(dow);
      if (isLateWeek && trainingsThisWeek >= 3) {
        return { type: "suggestion", text: "לא קבוע אימון, אך עקב השבוע העמוס שהיה מומלץ לצאת לריצת נפח קלה או לנוח" };
      }
      const suggestions = [
        "לא קבוע שום אימון, בוא תקבע אימון פלג גוף עליון ותתן בראש!",
        "לא קבוע אימון, בוא תקבע אימון ריצה מהמאגר ותתן בראש!",
      ];
      return { type: "suggestion", text: suggestions[Math.floor(Math.random() * suggestions.length)] };
    }
    return { type: "events", today, next };
  }, [officialEvents, personalLogs, todayKey, trainingsThisWeek]);
  const [showNext, setShowNext] = useState(false);
  // ---- Siren notification system: tracks which article/value-content items the
  // user has already "seen" via this specific notification list (independent of
  // whether they separately read them in the Hub). New items accumulate until
  // individually tapped, exactly like an unread-message inbox. ----
  const [sirenSeenIds, setSirenSeenIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_siren_seen_ids") || "[]"); } catch (e) { return []; }
  });
  const [sirenOpen, setSirenOpen] = useState(false);
  const sirenNotifications = useMemo(() => {
    const seenSet = new Set(sirenSeenIds);
    const fromArticles = (articles || []).map((a) => ({ kind: "article", id: `a_${a.id}`, refId: a.id, title: a.title, createdAt: a.createdAt }));
    const fromValues = (valuesContent || []).map((v) => ({ kind: "value", id: `v_${v.id}`, refId: v.id, title: v.title, createdAt: v.createdAt }));
    return [...fromArticles, ...fromValues]
      .filter((n) => n.createdAt && !seenSet.has(n.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [articles, valuesContent, sirenSeenIds]);
  function markSirenSeen(id) {
    setSirenSeenIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem("sayert_siren_seen_ids", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  function openSirenNotification(n) {
    markSirenSeen(n.id);
    setSirenOpen(false);
    if (n.kind === "article") goToHub?.();
    else goToValue?.(n.refId);
  }

  if (homeView === "training_summaries" && !isIndividual && networkId === YUVAL_NETWORK_ID) {
    let list = trainingSummaries;
    if (summarySearch.trim()) list = list.filter((s) => s.title.includes(summarySearch.trim()));
    list = [...list].sort((a, b) => summarySort === "new" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));
    const [featured, ...rest] = list;

    if (openSummary) {
      const plain = openSummary.body.replace(/[*_#>-]/g, "");
      const mins = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 150));
      return (
        <div className="p-4 space-y-4">
          <button onClick={() => setOpenSummary(null)} className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 text-base font-bold">
            <ChevronRight size={16} /> חזרה לכל הסיכומים
          </button>
          <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: "radial-gradient(ellipse 130% 100% at 30% -20%, #0ea5e935, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #0ea5e945 inset" }}>
            {openSummary.imageUrl && <img src={openSummary.imageUrl} alt="" className="w-full h-40 object-cover rounded-2xl mb-3.5" />}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border-2 border-sky-500/50 flex items-center justify-center shrink-0">
                <ClipboardCheck size={20} className="text-sky-400" />
              </div>
              <div className="flex-1 min-w-0">
                {openSummary.dateLabel && <span className="text-[11px] font-bold text-sky-400">{openSummary.dateLabel}</span>}
                <div className="text-lg font-black text-white leading-tight">{openSummary.title}</div>
              </div>
              <button onClick={(e) => toggleSavedSummary(openSummary.id, e)} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center shrink-0">
                <Star size={16} className={savedSummaryIds.includes(openSummary.id) ? "text-amber-400" : "text-zinc-500"} fill={savedSummaryIds.includes(openSummary.id) ? "#fbbf24" : "none"} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-zinc-500"><Clock size={11} /> {mins} דק׳ קריאה</div>
          </div>
          <Card className="p-4">
            <div className="text-[15px] text-zinc-200 leading-relaxed [&>*:last-child]:mb-0">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3">{children}</p>,
                  strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                  h2: ({ children }) => <h2 className="text-base font-black text-sky-400 mt-4 mb-2">{children}</h2>,
                  ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-3">{children}</ul>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                }}
              >
                {openSummary.body}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-3">
        <style>{`@keyframes summaryFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes summaryShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }`}</style>
        <button onClick={() => setHomeView("main")} className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 text-base font-bold mb-1">
          <ChevronRight size={16} /> חזרה
        </button>

        <div className="relative rounded-3xl overflow-hidden p-5 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #0ea5e930, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #0ea5e945 inset" }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: "#0ea5e9", animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border-2 border-sky-500/50 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#0ea5e9")}>
              <ClipboardCheck size={22} className="text-sky-400" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-zinc-50">סיכומי אימון</div>
              <div className="text-[12px] text-zinc-500">{trainingSummaries.length} סיכומים זמינים</div>
            </div>
          </div>
        </div>

        {trainingSummaries.length > 3 && (
          <div className="relative">
            <input value={summarySearch} onChange={(e) => setSummarySearch(e.target.value)} placeholder="חיפוש סיכום..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500/40" />
            <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button onClick={() => setSummarySort((s) => (s === "new" ? "old" : "new"))} className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
            <ChevronDown size={12} /> {summarySort === "new" ? "החדש קודם" : "הישן קודם"}
          </button>
        </div>

        {recentSummaryIds.length > 0 && !summarySearch.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {recentSummaryIds.map((id) => {
              const s = trainingSummaries.find((x) => x.id === id);
              if (!s) return null;
              return (
                <button key={id} onClick={() => openSummaryDetail(s)} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border border-sky-500/40 bg-sky-500/10">
                  <Clock size={11} className="text-sky-400" />
                  <span className="text-[12px] font-bold text-sky-400 max-w-[110px] truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {loadingSummaries ? (
          <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl">
            {summarySearch.trim() ? "אין תוצאות לחיפוש" : "עדיין אין סיכומי אימון"}
          </div>
        ) : (
          <div className="space-y-2.5">
            {featured && (
              <button onClick={() => openSummaryDetail(featured)} className="relative w-full text-right rounded-2xl overflow-hidden active:scale-[0.98] transition" style={{ height: 170, boxShadow: "0 0 0 1.5px #0ea5e960" }}>
                {featured.imageUrl ? (
                  <img src={featured.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 tech-grid" style={{ background: "linear-gradient(135deg, #0ea5e955, #0ea5e915)" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 15%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)" }} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "summaryShimmer 3.5s ease-in-out 0.5s infinite" }} />
                </div>
                {featured.dateLabel && <span className="absolute top-3 right-3 rounded-md px-2.5 py-1 text-[11px] font-black bg-sky-500/35 text-sky-300" style={{ boxShadow: "0 0 0 1.5px #0ea5e970 inset" }}>{featured.dateLabel}</span>}
                <div className="absolute bottom-0 right-0 left-0 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-sky-400 mb-1">הסיכום האחרון</div>
                  <div className="text-lg font-black text-white leading-tight line-clamp-2">{featured.title}</div>
                </div>
              </button>
            )}
            {rest.map((s, i) => {
              const plain = s.body.replace(/[*_#>-]/g, "");
              const mins = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 150));
              const isSaved = savedSummaryIds.includes(s.id);
              return (
                <button key={s.id} onClick={() => openSummaryDetail(s)} className="relative w-full text-right rounded-2xl overflow-hidden p-3.5 flex items-center gap-3 active:scale-[0.98] transition" style={{ background: "linear-gradient(120deg, #0ea5e918, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #0ea5e940 inset", animation: `summaryFadeUp 0.35s ease-out ${i * 0.05}s both` }}>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0 overflow-hidden">
                    {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-full h-full object-cover" /> : <ClipboardCheck size={17} className="text-sky-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-black text-zinc-100 truncate">{s.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                      {s.dateLabel && <span>{s.dateLabel}</span>}
                      <span className="flex items-center gap-1"><Clock size={9} /> {mins} דק׳</span>
                    </div>
                  </div>
                  {isSaved && <Star size={13} className="text-amber-400 shrink-0" fill="#fbbf24" />}
                  <ChevronLeft size={15} className="text-sky-500/60 shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (homeView === "training_board") {
    let list = boardPosts;
    if (boardSearch.trim()) list = list.filter((p) => p.title.includes(boardSearch.trim()) || p.location?.includes(boardSearch.trim()));
    if (boardFilter === "today") list = list.filter((p) => p.date === toKey(new Date()));
    if (boardFilter === "mine") list = list.filter((p) => p.userId === userId);
    const pendingReceivedCount = boardRequests.received.filter((r) => r.status === "pending").length;

    return (
      <div className="p-4 space-y-3 pb-24 relative">
        <style>{`
          @keyframes boardFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes boardShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes boardDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(5px,-8px); opacity: 0.6; } }
          @keyframes boardCheckPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes boardFabPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.5); } 50% { box-shadow: 0 0 0 8px rgba(168,85,247,0); } }
        `}</style>
        <button onClick={() => setHomeView("main")} className="flex items-center gap-1.5 text-zinc-400 hover:text-violet-400 text-base font-bold mb-1">
          <ChevronRight size={16} /> חזרה
        </button>

        <div className="relative rounded-3xl overflow-hidden p-5 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #a855f730, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #a855f745 inset" }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: "#a855f7", animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="absolute rounded-full bg-violet-300" style={{ width: 2, height: 2, left: `${(i * 33 + 12) % 90}%`, top: `${(i * 25 + 8) % 70}%`, opacity: 0.35, animation: `boardDust ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }} />
            ))}
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border-2 border-violet-500/50 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#a855f7")}>
              <Users size={22} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-zinc-50">מי מתאמן?</div>
              <div className="text-[12px] text-zinc-500">מי ומתי מתאמן ברשת שלך - {boardPosts.length} אימונים קרובים</div>
            </div>
            <button onClick={() => setShowMyRequests((s) => !s)} className="relative w-10 h-10 rounded-full bg-black/40 flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-violet-400" />
              {pendingReceivedCount > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }}>{pendingReceivedCount}</span>
              )}
            </button>
          </div>
        </div>

        {showMyRequests && (
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #a855f740 inset", animation: "boardFadeUp 0.3s ease-out" }}>
            <div className="text-[13px] font-black text-violet-400 mb-1">בקשות שקיבלתי</div>
            {boardRequests.received.length === 0 ? (
              <div className="text-[12px] text-zinc-600">אין בקשות עדיין</div>
            ) : (
              boardRequests.received.map((r) => (
                <div key={r.id} className="flex items-center gap-2.5 bg-black/30 rounded-xl p-2.5">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 text-[12px] font-black text-violet-400">{r.requesterName.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-zinc-200 truncate">{r.requesterName} מבקש/ת להצטרף ל{r.postTitle}</div>
                  </div>
                  {r.status === "pending" ? (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => respondToRequest(r.id, "accepted")} className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center"><Check size={13} className="text-emerald-400" /></button>
                      <button onClick={() => respondToRequest(r.id, "declined")} className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center"><X size={13} className="text-red-400" /></button>
                    </div>
                  ) : (
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full shrink-0 ${r.status === "accepted" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>{r.status === "accepted" ? "אושר" : "נדחה"}</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="relative">
          <input value={boardSearch} onChange={(e) => setBoardSearch(e.target.value)} placeholder="חיפוש אימון או מיקום..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
          <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        </div>
        <div className="flex gap-1.5">
          {[["all", "הכל"], ["today", "היום"], ["mine", "שלי"]].map(([id, label]) => (
            <button key={id} onClick={() => setBoardFilter(id)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${boardFilter === id ? "bg-violet-500/15 border-violet-500 text-violet-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
              {label}
            </button>
          ))}
        </div>

        {loadingBoard ? (
          <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-2"><Users size={22} className="text-zinc-700" /></div>
            <div className="text-[13px] font-bold text-zinc-500">{boardSearch.trim() ? "אין תוצאות" : "אין עדיין אימונים ברשת שלך"}</div>
            <div className="text-[11px] text-zinc-700 mt-0.5">פרסמו את האימון הבא שלכם!</div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.map((p, i) => {
              const isMine = p.userId === userId;
              const isToday = p.date === toKey(new Date());
              const hex = TRAINING_BANK_HEX[p.category] || "#a855f7";
              const bankItem = TRAINING_BANK.find((b) => b.title === p.category);
              const PIcon = bankItem?.icon || Dumbbell;
              const isExpanded = expandedPostId === p.id;
              const alreadyRequested = boardRequests.sent.some((r) => r.postId === p.id);
              return (
                <div key={p.id} className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(120deg, ${hex}1c, transparent 75%), var(--card-base-alt)`, boxShadow: isMine ? `0 0 0 1.5px #a855f760 inset` : `0 0 0 1.5px ${hex}40 inset`, animation: `boardFadeUp 0.35s ease-out ${i * 0.05}s both` }}>
                  {isToday && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${hex}20, transparent)`, animation: "boardShimmer 4s ease-in-out infinite" }} />
                    </div>
                  )}
                  <button onClick={() => setExpandedPostId(isExpanded ? null : p.id)} className="relative w-full flex items-center gap-3 p-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}22` }}>
                      <PIcon size={17} style={{ color: hex }} />
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: "0 0 6px #10b981" }} />}
                        <span className="text-[13px] font-black text-zinc-100 truncate">{p.title}</span>
                        {isMine && <span className="text-[9px] font-bold text-violet-400 bg-violet-500/15 rounded-full px-1.5 py-0.5 shrink-0">שלי</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-1"><Clock size={9} /> {p.time}</span>
                        {p.location && <span className="flex items-center gap-1"><MapPin size={9} /> {p.location}</span>}
                        <span>{new Date(`${p.date}T00:00:00`).toLocaleDateString("he-IL", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-zinc-600 transition shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="relative px-3.5 pb-3.5">
                      <div className="rounded-xl bg-black/30 p-3 mb-2.5">
                        <div className="text-[11px] text-zinc-500 mb-1">מפורסם ע״י {p.posterName}</div>
                        {p.notes && <div className="text-[13px] text-zinc-300">{p.notes}</div>}
                      </div>
                      {isMine ? (
                        <button onClick={() => deleteBoardPost(p.id)} className="w-full rounded-xl py-2.5 text-[12px] font-bold text-red-400 border border-red-500/30 flex items-center justify-center gap-1.5">
                          <Trash2 size={12} /> מחק פרסום
                        </button>
                      ) : alreadyRequested ? (
                        <div className="w-full rounded-xl py-2.5 text-[12px] font-bold text-emerald-400 bg-emerald-500/10 flex items-center justify-center gap-1.5" style={{ animation: "boardCheckPop 0.3s ease-out" }}>
                          <Check size={12} /> בקשה נשלחה
                        </div>
                      ) : (
                        <button onClick={() => requestToJoin(p.id)} className="w-full rounded-xl py-2.5 text-[12px] font-black text-white flex items-center justify-center gap-1.5" style={{ background: `linear-gradient(135deg, ${hex}, ${hex}cc)` }}>
                          <Users size={12} /> בקשת הצטרפות
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setShowAddPost(true)}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-violet-500 flex items-center justify-center shadow-lg active:scale-90 transition z-20"
          style={{ animation: "boardFabPulse 2.2s ease-in-out infinite" }}
        >
          <Plus size={24} className="text-white" />
        </button>

        {showAddPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setShowAddPost(false)}>
            <div className="w-full sm:max-w-xs bg-zinc-950 border border-violet-500/30 rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-black text-zinc-100">פרסום אימון</div>
                <button onClick={() => setShowAddPost(false)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500"><X size={16} /></button>
              </div>
              <div className="space-y-2.5">
                <input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="שם האימון" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100">
                  <option value="">קטגוריה (לא חובה)</option>
                  {TRAINING_BANK.map((b) => <option key={b.id} value={b.title}>{b.title}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={postDate} onChange={(e) => setPostDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100" />
                  <input type="time" value={postTime} onChange={(e) => setPostTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100" />
                </div>
                <input value={postLocation} onChange={(e) => setPostLocation(e.target.value)} placeholder="מיקום" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                <textarea value={postNotes} onChange={(e) => setPostNotes(e.target.value)} placeholder="הערות (לא חובה)" rows={2} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 resize-none" />
                <GlowButton tone="ghost" icon={postingBoard ? Loader2 : Send} className="w-full" disabled={postingBoard} onClick={submitBoardPost}>
                  {postingBoard ? "מפרסם..." : "פרסם אימון"}
                </GlowButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  if (homeView === "bank_detail" && activeBank) {
    function parseWorkoutLevel(body) {
      const line = (body || "").split("\n").find((l) => l.trim().startsWith("LEVEL|"));
      return line ? line.trim().slice(6) : null;
    }
    function parseWorkoutSplit(body) {
      const line = (body || "").split("\n").find((l) => l.trim().startsWith("SPLIT|"));
      return line ? line.trim().slice(6) : null;
    }
    const rawItems = trainingContent
      .filter((t) => t.subcategory === activeBank.id)
      .sort((a, b) => {
        if (a.title === "עקרונות ומטרות") return -1;
        if (b.title === "עקרונות ומטרות") return 1;
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    let allItems = [...rawItems];
    if (bankSort === "newest") {
      allItems = [...rawItems].sort((a, b) => (a.title === "עקרונות ומטרות" ? -1 : b.title === "עקרונות ומטרות" ? 1 : new Date(b.createdAt) - new Date(a.createdAt)));
    } else if (bankSort === "easiest" || bankSort === "hardest") {
      const order = Object.keys(WORKOUT_LEVEL_STYLES);
      allItems = [...rawItems].sort((a, b) => {
        if (a.title === "עקרונות ומטרות") return -1;
        if (b.title === "עקרונות ומטרות") return 1;
        const ai = order.indexOf(parseWorkoutLevel(a.body)), bi = order.indexOf(parseWorkoutLevel(b.body));
        return bankSort === "easiest" ? ai - bi : bi - ai;
      });
    }
    let items = bankSearch.trim()
      ? allItems.filter((it) => it.title.toLowerCase().includes(bankSearch.trim().toLowerCase()) || it.title === "עקרונות ומטרות")
      : allItems;
    if (bankDifficultyFilter !== "all") {
      items = items.filter((it) => it.title === "עקרונות ומטרות" || it.difficulty === bankDifficultyFilter || parseWorkoutLevel(it.body) === bankDifficultyFilter);
    }
    if (bankSplitFilter !== "all") {
      items = items.filter((it) => it.title === "עקרונות ומטרות" || parseWorkoutSplit(it.body) === bankSplitFilter);
    }
    const hex = TRAINING_BANK_HEX[activeBank.id] || "#10b981";
    const splitCounts = allItems.reduce((acc, it) => {
      const sp = parseWorkoutSplit(it.body);
      if (sp) acc[sp] = (acc[sp] || 0) + 1;
      return acc;
    }, {});
    const diffCounts = allItems.reduce((acc, it) => {
      const d = it.difficulty || parseWorkoutLevel(it.body);
      if (d) acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    const realItems = allItems.filter((it) => it.title !== "עקרונות ומטרות");
    const completedCount = realItems.filter((it) => completedWorkoutIds.includes(it.id)).length;
    const nextRecommended = realItems.find((it) => !completedWorkoutIds.includes(it.id));

    return (
      <div className="fx-root p-4 relative fx-stagger" onPointerDown={(e) => fxTouchRing(e, hex)}>
        <FxStyles />
        <FxAmbience hex={hex} hex2="#a855f7" hex3="#38bdf8" icons={[Dumbbell, Flame, Trophy]} particles={9} />
        <FxScrollBar hex={hex} />
        <style>{`
          @keyframes bankCountUp { from { opacity: 0.4; } to { opacity: 1; } }
          @keyframes bankItemFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes heroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } }
        `}</style>
        <button onClick={() => { setHomeView("main"); setBankSearch(""); setOpenWorkoutId(null); }} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה לבית
        </button>

        <div {...fxTilt(5)} className="relative rounded-3xl overflow-hidden p-5 mb-4 tech-grid" style={{ ...fxTiltStyle, background: `radial-gradient(ellipse 130% 90% at 25% -15%, ${hex}35, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${hex}40 inset` }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: hex, animation: "heroPulse 4s ease-in-out infinite" }} />
          <FxFrame hex={hex} hex2="#a855f7" radius="1.5rem" />
          <HudCorners hex={hex} corners={2} inset={10} />
          <FxSpot radius="1.5rem" />
          <div className="relative flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 glow-pulse" style={{ backgroundColor: `${hex}22`, boxShadow: `0 0 0 1.5px ${hex}55 inset`, ...glowVars(hex) }}>
              <activeBank.icon size={26} style={{ color: hex }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-black text-zinc-50">{activeBank.title}</div>
              <div className="text-[12px] text-zinc-500">
                <AnimatedNumber value={allItems.length} className="tabular-nums font-bold" /> אימונים
                {completedCount > 0 && <span> · {completedCount} הושלמו</span>}
              </div>
            </div>
          </div>
          {realItems.length > 0 && (
            <div className="relative mt-3.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                <span>התקדמות בקטגוריה</span>
                <span className="font-bold" style={{ color: hex }}>{completedCount}/{realItems.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(completedCount / realItems.length) * 100}%`, backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }} />
              </div>
            </div>
          )}
          {Object.keys(diffCounts).length > 0 && (
            <div className="relative flex items-center gap-1.5 mt-4 flex-wrap">
              <button onClick={() => setBankDifficultyFilter("all")} className="text-[11px] font-bold rounded-full px-2.5 py-1 border transition" style={bankDifficultyFilter === "all" ? { backgroundColor: `${hex}25`, borderColor: hex, color: hex } : { borderColor: "#3f3f46", color: "#71717a" }}>
                הכל
              </button>
              {Object.keys(diffCounts).map((d) => {
                const dHex = DIFFICULTY_STYLE[d]?.hex || WORKOUT_LEVEL_STYLES[d]?.hex || hex;
                const active = bankDifficultyFilter === d;
                return (
                  <button key={d} onClick={() => setBankDifficultyFilter(d)} className="text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1 border transition" style={active ? { backgroundColor: `${dHex}25`, borderColor: dHex, color: dHex } : { borderColor: "#3f3f46", color: "#a1a1aa" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dHex }} /> {d} · {diffCounts[d]}
                  </button>
                );
              })}
            </div>
          )}
          {Object.keys(splitCounts).length > 1 && (
            <div className="relative flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[10px] font-bold text-zinc-600 flex items-center gap-1 shrink-0"><Compass size={10} /> סוג פיצול:</span>
              <button onClick={() => setBankSplitFilter("all")} className="text-[11px] font-bold rounded-full px-2.5 py-1 border transition" style={bankSplitFilter === "all" ? { backgroundColor: `${hex}25`, borderColor: hex, color: hex } : { borderColor: "#3f3f46", color: "#71717a" }}>
                הכל
              </button>
              {Object.keys(splitCounts).map((sp) => {
                const st = SPLIT_TYPE_STYLES[sp] || { hex: "#a855f7", icon: Dumbbell };
                const active = bankSplitFilter === sp;
                return (
                  <button key={sp} onClick={() => setBankSplitFilter(sp)} className="text-[11px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1 border transition" style={active ? { backgroundColor: `${st.hex}25`, borderColor: st.hex, color: st.hex } : { borderColor: "#3f3f46", color: "#a1a1aa" }}>
                    <st.icon size={10} /> {sp} · {splitCounts[sp]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {nextRecommended && !bankSearch.trim() && bankDifficultyFilter === "all" && (
          <button
            onClick={() => { setOpenWorkoutId(nextRecommended.id); trackRecentWorkout(nextRecommended.id); document.getElementById(`workout-${nextRecommended.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
            className="relative w-full text-right rounded-2xl p-3.5 mb-3.5 flex items-center gap-3"
            style={{ background: `linear-gradient(120deg, ${hex}22, transparent 75%), var(--card-base-alt)`, boxShadow: `0 0 0 1.5px ${hex}45 inset` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}25` }}>
              <Zap size={16} style={{ color: hex }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase" style={{ color: hex }}>מומלץ לך עכשיו</div>
              <div className="text-[13px] font-black text-zinc-100 truncate">{nextRecommended.title}</div>
            </div>
            <ChevronLeft size={15} style={{ color: hex }} className="shrink-0" />
          </button>
        )}

        {recentWorkoutIds.length > 0 && !bankSearch.trim() && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3.5" style={{ scrollbarWidth: "none" }}>
            {recentWorkoutIds.map((rid) => {
              const w = allItems.find((x) => x.id === rid);
              if (!w) return null;
              return (
                <button key={rid} onClick={() => { setOpenWorkoutId(rid); document.getElementById(`workout-${rid}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border" style={{ borderColor: `${hex}45`, backgroundColor: `${hex}10` }}>
                  <Clock size={10} style={{ color: hex }} />
                  <span className="text-[11px] font-bold max-w-[100px] truncate" style={{ color: hex }}>{w.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3.5">
          {allItems.length > 6 && (
            <div className="relative flex-1">
              <input
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder={`חיפוש בתוך ${allItems.length} אימונים...`}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-8 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300"
              />
              <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              {bankSearch && (
                <button onClick={() => setBankSearch("")} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"><X size={14} /></button>
              )}
            </div>
          )}
          <button onClick={() => setBankSort((s) => (s === "default" ? "easiest" : s === "easiest" ? "hardest" : s === "hardest" ? "newest" : "default"))} className="shrink-0 w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <ChevronDown size={15} />
          </button>
          <button onClick={() => setBankAllExpanded((s) => !s)} className="shrink-0 w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400">
            {bankAllExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
        {bankSort !== "default" && (
          <div className="text-[11px] text-zinc-500 -mt-2.5 mb-3">ממוין: {bankSort === "easiest" ? "מהקל לקשה" : bankSort === "hardest" ? "מהקשה לקל" : "החדש ביותר"}</div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl">
            {allItems.length === 0 ? "אין עדיין תוכן כאן - יתווסף בהמשך" : "אין תוצאות לחיפוש"}
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((it, idx) => {
              if (it.title === "עקרונות ומטרות") {
                return (
                  <Card key={it.id} className="p-4 border-2 border-red-500/30 bg-red-500/[0.04]">
                    <div className="flex items-center gap-1.5 text-red-400 font-black text-lg mb-2">
                      <Flame size={18} /> {it.title}
                    </div>
                    <WorkoutTable body={it.body} />
                  </Card>
                );
              }
              const realIdx = allItems.filter((x) => x.title !== "עקרונות ומטרות").indexOf(it);
              const halfLimit = Math.ceil(allItems.filter((x) => x.title !== "עקרונות ומטרות").length / 2);
              const isLocked = !isPremium && realIdx >= halfLimit;
              if (isLocked) {
                return (
                  <button key={it.id} onClick={() => showToast?.("שדרג לפרימיום כדי לפתוח את כל האימונים", "info")} className="w-full flex items-center gap-3 rounded-2xl p-3.5 opacity-60" style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1px #3f3f46 inset" }}>
                    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0">
                      <Lock size={15} className="text-zinc-600" />
                    </div>
                    <div className="flex-1 text-right blur-[3px] select-none">
                      <div className="text-[13px] font-bold text-zinc-300">{it.title}</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 rounded-full px-2 py-1 shrink-0">פרימיום</span>
                  </button>
                );
              }
              return (
                <WorkoutCard
                  key={it.id}
                  it={it}
                  index={idx}
                  isOpen={bankAllExpanded || openWorkoutId === it.id}
                  onToggle={() => { const next = openWorkoutId === it.id ? null : it.id; setOpenWorkoutId(next); if (next) trackRecentWorkout(it.id); }}
                  isCompleted={completedWorkoutIds.includes(it.id)}
                  onToggleCompleted={(e) => toggleWorkoutCompleted(it.id, e)}
                  isFavorite={favoriteWorkoutIds.includes(it.id)}
                  onToggleFavorite={(e) => toggleWorkoutFavorite(it.id, e)}
                  isNew={Date.now() - new Date(it.createdAt).getTime() < 7 * 86400000}
                  note={workoutNotes[it.id] || ""}
                  onSaveNote={(text) => saveWorkoutNote(it.id, text)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
    <FxStyles />
    <HomeAmbience accent={timeAccent} hex={gibushHex} violet="#a855f7" />
    <div className="hm-root p-4 space-y-4 relative" onPointerDown={(e) => spawnTouchRing(e, timeAccent)}>
      {showPremiumPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl" onClick={() => setShowPremiumPromo(false)}>
          <style>{`
            @keyframes promoDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(6px,-12px); opacity: 0.7; } }
            @keyframes promoGlowSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes promoPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            @keyframes promoIconBounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-4px) scale(1.05); } }
            @keyframes promoShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
            @keyframes promoCheckIn { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
          `}</style>
          <div
            className="relative w-full max-w-xs rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(160deg, #1c1305, #000 60%)", boxShadow: "0 0 0 2px #f59e0b70, 0 20px 60px -10px #f59e0b50", animation: "promoPop 0.35s cubic-bezier(0.16,1,0.3,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="absolute rounded-full bg-amber-300" style={{ width: 2.5, height: 2.5, left: `${(i * 27 + 8) % 92}%`, top: `${(i * 19 + 6) % 90}%`, opacity: 0.4, animation: `promoDust ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }} />
              ))}
            </div>
            <button onClick={() => setShowPremiumPromo(false)} className="absolute left-3 top-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-zinc-400">
              <X size={16} />
            </button>

            <div className="relative pt-8 pb-4 flex flex-col items-center text-center px-5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: "#f59e0b" }} />
              <div className="relative w-20 h-20 mb-3" style={{ animation: "promoIconBounce 2.2s ease-in-out infinite" }}>
                <svg viewBox="0 0 80 80" className="absolute inset-0" style={{ animation: "promoGlowSpin 6s linear infinite" }}>
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="14 12" opacity="0.7" />
                </svg>
                <div className="absolute inset-2 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center" style={{ boxShadow: "0 0 24px 4px #f59e0b70" }}>
                  <Star size={30} className="text-amber-400" fill="#f59e0b" />
                </div>
              </div>
              <div className="relative text-xl font-black text-white mb-1">שחרר את הפוטנציאל המלא!</div>
              <div className="relative text-[13px] text-amber-200/80 leading-relaxed mb-4">
                אתה מפספס חלק גדול ממה שהאפליקציה יכולה לתת לך. שדרג עכשיו ותקבל הכל.
              </div>

              <div className="relative w-full space-y-2 mb-4 text-right">
                {[
                  ["גישה מלאה למאגר האימונים", BookOpen],
                  ["עיתון הטיפים - כתבות שבועיות", Newspaper],
                  ["AI ללא הגבלת הודעות", Bot],
                  ['"המסלול שלי" - תוכנית AI אישית', Crosshair],
                ].map(([label, Icon], i) => (
                  <div key={label} className="flex items-center gap-2.5" style={{ animation: `promoCheckIn 0.3s ease-out ${0.15 + i * 0.08}s both` }}>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-amber-400" />
                    </div>
                    <span className="text-[13px] font-bold text-zinc-200 flex-1">{label}</span>
                    <Check size={14} className="text-emerald-400 shrink-0" />
                  </div>
                ))}
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden p-3.5 mb-4" style={{ background: "linear-gradient(120deg, #f59e0b22, transparent 75%)", boxShadow: "0 0 0 1.5px #f59e0b50 inset" }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "promoShimmer 3s ease-in-out 0.5s infinite" }} />
                </div>
                <div className="relative flex items-center justify-center gap-1.5">
                  <span className="text-3xl font-black text-amber-400">9₪</span>
                  <span className="text-[13px] text-zinc-400 font-bold">/ לחודש</span>
                </div>
                <div className="relative text-[11px] text-zinc-500 mt-0.5">פחות ממחיר קפה - ביטול בכל עת</div>
              </div>

              <button
                onClick={() => setShowPremiumPromo(false)}
                className="relative w-full rounded-2xl py-3.5 font-black text-black text-[15px] active:scale-[0.97] transition"
                style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", boxShadow: "0 0 24px 2px #f59e0b60" }}
              >
                שדרג לפרימיום עכשיו
              </button>
              <button onClick={() => setShowPremiumPromo(false)} className="relative text-[12px] text-zinc-600 mt-3 font-semibold">
                אולי מאוחר יותר
              </button>
            </div>
          </div>
        </div>
      )}

      {requiresPayment && paymentStatus !== "confirmed" && (
        <div className="relative rounded-2xl overflow-hidden p-4 flex items-center gap-3" style={{ background: "linear-gradient(140deg, #f59e0b15, transparent 70%), var(--card-base)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center shrink-0">
            <Star size={16} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-black text-zinc-300">מנוי פרימיום</div>
            <div className="text-[10px] text-zinc-600">מאגר מלא · עיתון טיפים · AI ללא הגבלה · המסלול שלי</div>
          </div>
          <PremiumStatusToggle isPremium={false} size="small" />
        </div>
      )}

      {(() => {
        const unitVals = getUnitValues(profile?.targetUnit);
        if (!unitVals?.traits?.length) return null;
        const dayNum = Math.floor(Date.now() / 86400000);
        const trait = unitVals.traits[dayNum % unitVals.traits.length];
        const [traitTitle, ...traitRest] = trait.split(" - ");
        return (
          <div className="relative rounded-2xl overflow-hidden p-4 flex items-start gap-3" style={{ background: "linear-gradient(135deg, #a855f715, transparent 70%), var(--card-base)", boxShadow: "0 0 0 1.5px #a855f735 inset" }}>
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/40 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase text-violet-400 mb-0.5">תובנת היום · {profile?.targetUnitName}</div>
              <div className="text-[13px] font-bold text-zinc-200 leading-snug">{traitTitle}</div>
              {traitRest.length > 0 && <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{traitRest.join(" - ")}</div>}
            </div>
          </div>
        );
      })()}

      <div className="fixed top-0 right-0 left-0 h-[3px] z-40 pointer-events-none" style={{ maxWidth: "var(--app-max-width)", marginInline: "auto" }}>
        <div className="h-full bg-zinc-900/50">
          <div className="h-full transition-all duration-1000" style={{ width: `${dayPct}%`, background: `linear-gradient(90deg, ${timeAccent}, ${timeAccent}aa)`, boxShadow: `0 0 6px ${timeAccent}` }} />
        </div>
      </div>
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) rotate(-2deg); }
          50% { transform: scaleY(1.15) rotate(2deg); }
        }
        @keyframes dustDrift {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translate(-20px, -40px); opacity: 0; }
        }
        @keyframes titleUnderline {
          0%, 100% { opacity: 0.3; width: 24px; }
          50% { opacity: 0.9; width: 40px; }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
      <div className="relative rounded-3xl overflow-hidden p-5 mb-1" style={{ background: `radial-gradient(ellipse 130% 100% at 30% -20%, ${gibushHex}35, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${gibushHex}30 inset` }}>
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30" style={{ backgroundColor: gibushHex, animation: "heroPulse 4s ease-in-out infinite" }} />
        <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ backgroundColor: gibushHex }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 3), height: 2 + (i % 3),
                left: `${(i * 37 + 10) % 95}%`, top: `${(i * 61 + 5) % 90}%`,
                backgroundColor: gibushHex, opacity: 0.4,
                animation: `constellationFloat ${5 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes heroPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.25); opacity: 0.45; }
          }
          @keyframes constellationFloat {
            0%, 100% { transform: translate(0, 0); opacity: 0.2; }
            50% { transform: translate(6px, -10px); opacity: 0.6; }
          }
          @keyframes auraSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <HeroFx hex={gibushHex} hex2={isIndividual ? "#a855f7" : timeAccent} />
        <div className="relative flex items-center justify-between">
          <div>
            {isIndividual && (
          <>
            <Crosshair size={140} className="absolute -left-6 -bottom-8 text-violet-500 opacity-[0.06] pointer-events-none rotate-12" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(115deg, rgba(168,85,247,0.06), transparent 55%)" }} />
          </>
        )}
        <div className="flex items-center gap-1.5 mb-1">
              <div className="text-[11px] font-bold tracking-wide uppercase" style={{ color: gibushHex }}>SayertTracking</div>
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${timeAccent}25` }}>
                <TimeIcon size={9} style={{ color: timeAccent }} />
              </div>
              {isIndividual && (
                <span className="flex items-center gap-1 rounded-full bg-violet-500/15 border border-violet-500/40 text-violet-400 text-[9px] font-black px-1.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }} />
                  AI פעיל
                </span>
              )}
            </div>
            <div className="hm-shine text-[26px] font-black text-zinc-50 leading-tight" style={{ "--hm-accent": timeAccent }}>{greetingByHour()}{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""} 💪</div>
            <div className="text-[13px] text-zinc-400 mt-1">{new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</div>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {profile?.targetUnitName && (
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black" style={{ backgroundColor: `${gibushHex}1f`, color: gibushHex, boxShadow: `0 0 0 1px ${gibushHex}40 inset` }}><Target size={10} /> {profile.targetUnitName}</span>
              )}
              {profile?.level && (
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black bg-zinc-800/70 text-zinc-300"><Activity size={10} /> {profile.level}</span>
              )}
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black" style={{ backgroundColor: `${timeAccent}1f`, color: timeAccent, boxShadow: `0 0 0 1px ${timeAccent}40 inset` }}><TimeIcon size={10} /> {currentHour < 6 ? "שעת לילה" : currentHour < 12 ? "בוקר" : currentHour < 17 ? "צהריים" : currentHour < 21 ? "ערב" : "לילה"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSirenOpen(true)}
              className="relative w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition"
              style={sirenNotifications.length > 0 ? { backgroundColor: "#ef444422", boxShadow: "0 0 0 1.5px #ef444460" } : { backgroundColor: "rgba(0,0,0,0.4)", boxShadow: "0 0 0 1px #3f3f46" }}
            >
              <Siren size={22} className={sirenNotifications.length > 0 ? "text-red-400" : "text-zinc-500"} style={sirenNotifications.length > 0 ? { animation: "flameFlicker 1s ease-in-out infinite" } : undefined} />
              {sirenNotifications.length > 0 && (
                <span className="absolute -top-1 -left-1 min-w-[19px] h-[19px] px-1 rounded-full bg-red-500 text-white text-[11px] font-black flex items-center justify-center" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite", boxShadow: "0 0 0 2px #000" }}>
                  {sirenNotifications.length > 9 ? "9+" : sirenNotifications.length}
                </span>
              )}
            </button>
            <button onClick={goToProfile} className="relative w-16 h-16 shrink-0 active:scale-90 transition flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" style={{ animation: "auraSpin 12s linear infinite" }}>
                <circle cx="32" cy="32" r="30" fill="none" stroke={isIndividual ? "#a855f7" : gibushHex} strokeWidth="1.5" opacity="0.35" />
                <circle cx="32" cy="32" r="30" fill="none" stroke={isIndividual ? "#a855f7" : gibushHex} strokeWidth="1.5" strokeDasharray="18 170" strokeLinecap="round" opacity="0.9" />
              </svg>
              <span aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `0 0 0 1.5px ${isIndividual ? "#a855f7" : gibushHex}`, animation: "hmHalo 3s ease-in-out infinite" }} />
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ animation: "hmOrbit 5s linear infinite" }}>
                <span className="absolute left-1/2 -top-[3px] w-1.5 h-1.5 rounded-full -translate-x-1/2" style={{ backgroundColor: isIndividual ? "#c084fc" : gibushHex, boxShadow: `0 0 8px 2px ${isIndividual ? "#a855f7" : gibushHex}` }} />
              </div>
              <div className="relative w-14 h-14 rounded-full flex items-center justify-center glow-pulse overflow-hidden" style={{ background: `linear-gradient(135deg, ${gibushHex}, ${gibushHex}99)`, ...glowVars(gibushHex) }}>
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-xl font-black text-black leading-none">{(profile?.fullName || "?").trim().charAt(0) || "?"}</span>
                )}
              </div>
              {isIndividual && (
                <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 rounded-full bg-violet-500 border-2 border-black flex items-center justify-center" style={{ boxShadow: "0 0 8px 1px #a855f770" }}>
                  <Crosshair size={11} className="text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        <DayTrack pct={dayPct} accent={timeAccent} Icon={TimeIcon} />

        {isIndividual && (
          <button onClick={() => goToPath?.()} className="relative w-full mt-3.5 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5" style={{ background: "rgba(168,85,247,0.12)", boxShadow: "0 0 0 1.5px #a855f745 inset" }}>
            <Crosshair size={14} className="text-violet-400 shrink-0" />
            <span className="text-[12px] font-bold text-violet-200 flex-1 text-right">המסלול שלך פעיל - AI בונה ומעדכן אותו</span>
            <ChevronLeft size={13} className="text-violet-400/60 shrink-0" />
          </button>
        )}

        {sirenOpen && (
          <div className="fixed inset-0 z-50 bg-black overflow-y-auto" dir="rtl">
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setSirenOpen(false)} className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 text-sm font-bold">
                  <ChevronRight size={16} /> חזרה
                </button>
                <div className="flex items-center gap-2">
                  <Siren size={18} className="text-red-400" />
                  <span className="text-base font-black text-zinc-100">התראות</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              {sirenNotifications.length === 0 ? (
                <div className="flex flex-col items-center text-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mb-3">
                    <Siren size={24} className="text-zinc-700" />
                  </div>
                  <div className="text-[15px] font-bold text-zinc-400">אין התראות חדשות</div>
                  <div className="text-[13px] text-zinc-600 mt-1">כשיעלה תוכן ערכי או כתבה חדשה, תראו אותם כאן</div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sirenNotifications.map((n) => (
                    <button key={n.id} onClick={() => openSirenNotification(n)} className="relative w-full text-right rounded-2xl overflow-hidden p-4 flex items-center gap-3 active:scale-[0.98] transition" style={{ background: "linear-gradient(120deg, #f59e0b1f, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
                      <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                        {n.kind === "article" ? <Newspaper size={19} className="text-amber-400" /> : <Star size={19} className="text-amber-400" fill="#f59e0b" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-amber-500/70 uppercase tracking-wide mb-0.5">{n.kind === "article" ? "עיתון הטיפים" : "תוכן ערכי"}</div>
                        <div className="text-[15px] font-black text-zinc-100 leading-tight">{n.title}</div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" style={{ boxShadow: "0 0 6px #ef4444" }} />
                      <ChevronLeft size={16} className="text-amber-500/60 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {(() => {
          const overall = Math.round(isIndividual ? (streakValue + loadValue + weekCompletionValue + monthlyVolumeValue) / 4 : (streakValue + loadValue + attendanceValue) / 3);
          const rank = overall >= 85 ? { label: "עילית", hex: "#f59e0b" } : overall >= 65 ? { label: "מתקדם", hex: "#a78bfa" } : overall >= 40 ? { label: "מתפתח", hex: "#38bdf8" } : { label: "בהתחלה", hex: "#10b981" };
          return (
            <div className="relative flex items-center gap-1.5 mt-3.5">
              <span className="text-[11px] font-black rounded-full px-3 py-1 flex items-center gap-1" style={{ backgroundColor: `${rank.hex}20`, color: rank.hex, boxShadow: `0 0 10px ${rank.hex}30` }}>
                <Star size={10} fill={rank.hex} /> דרגה: {rank.label}
              </span>
            </div>
          );
        })()}
      </div>

      <HomeDivider hex={gibushHex} />

      <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3 relative overflow-hidden" style={{ background: "linear-gradient(100deg, #1c1917, var(--card-base))", boxShadow: "0 0 0 1px rgba(245,158,11,0.15) inset" }}>
        <div className="absolute -left-4 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-amber-500" />
        <span aria-hidden="true" className="absolute -left-1 -top-3 text-7xl font-black leading-none pointer-events-none select-none" style={{ color: "#f59e0b14" }}>❝</span>
        <span aria-hidden="true" className="absolute right-0 top-3 bottom-3 w-[3px] rounded-full pointer-events-none" style={{ background: "linear-gradient(180deg, transparent, #f59e0b, transparent)", animation: "hmBar 3s ease-in-out infinite" }} />
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none"><div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", background: "linear-gradient(105deg, transparent, rgba(245,158,11,0.10), transparent)", animation: "hmSweep 8s ease-in-out 3s infinite" }} /></div>
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 relative">
          <span aria-hidden="true" className="absolute -inset-1 rounded-2xl pointer-events-none" style={{ boxShadow: "0 0 0 1.5px #f59e0b66", animation: "hmHalo 3s ease-in-out infinite" }} />
          <Flame size={17} className="text-amber-400" />
        </div>
        <span className="text-[13px] text-zinc-200 font-semibold leading-snug relative">{quoteOfDay()}</span>
      </div>

      {(() => {
        const todayKey = toKey(nowTick);
        const weekDays = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(nowTick);
          d.setDate(d.getDate() - d.getDay() + i);
          return d;
        });
        const dayLabels = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
        const hasEventOn = (key) => (officialEvents || []).some((e) => e.date === key) || (personalLogs || []).some((l) => l.date === key);
        return (
          <button onClick={isIndividual ? () => goToPath?.() : undefined} className="relative w-full rounded-2xl p-3 pb-4 flex items-center justify-between gap-1" style={{ background: `linear-gradient(180deg, ${gibushHex}12, transparent 45%), var(--card-base-alt)`, boxShadow: "0 0 0 1px #27272a inset, 0 1px 0 rgba(255,255,255,0.07) inset" }}>
            {weekDays.map((d, i) => {
              const key = toKey(d);
              const isToday = key === todayKey;
              const hasEvent = hasEventOn(key);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl" style={isToday ? { backgroundColor: `${gibushHex}20`, boxShadow: `0 0 0 1.5px ${gibushHex}70, 0 0 14px ${gibushHex}40` } : undefined}>
                  <span className="text-[10px] font-semibold text-zinc-600">{dayLabels[i]}</span>
                  <span className="text-[13px] font-black tabular-nums" style={{ color: isToday ? gibushHex : "#a1a1aa" }}>{d.getDate()}</span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: hasEvent ? (isToday ? gibushHex : "#71717a") : "transparent", boxShadow: hasEvent ? `0 0 6px ${isToday ? gibushHex : "#a1a1aa"}` : undefined }} />
                  <span className="text-[8px] leading-none font-black h-2" style={{ color: gibushHex }}>{isToday ? "היום" : ""}</span>
                </div>
              );
            })}
            <div aria-hidden="true" className="absolute bottom-1.5 left-3 right-3 h-[2px] rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${((new Date(nowTick).getDay() + 1) / 7) * 100}%`, background: `linear-gradient(270deg, ${gibushHex}, ${gibushHex}66)`, boxShadow: `0 0 6px ${gibushHex}` }} />
            </div>
          </button>
        );
      })()}

      <HomeDivider hex={gibushHex} />

      {!isIndividual && (
      <Card
        className="p-4 relative overflow-hidden border-none tech-grid"
        style={{ background: `linear-gradient(145deg, ${gibushHex}22, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1px ${gibushHex}35 inset`, transform: tilt ? `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` : "perspective(600px) rotateX(0) rotateY(0)", transition: tilt ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x: px * 10, y: -py * 10 });
        }}
        onPointerLeave={() => setTilt(null)}
      >
        <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-40" style={{ backgroundColor: gibushHex }} />
        <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-3xl opacity-20" style={{ backgroundColor: gibushHex }} />
        <HudCorners hex={gibushHex} />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-10 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${gibushHex}22, transparent)`, animation: "hmScan 5s linear infinite" }} />
        <div aria-hidden="true" className="absolute bottom-0 inset-x-6 h-[2px] pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${gibushHex}, transparent)`, animation: "hmBar 3.5s ease-in-out infinite" }} />
        <div className="relative flex items-center gap-1.5 mb-3 text-sm font-bold" style={{ color: gibushHex }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: gibushHex, boxShadow: `0 0 8px 2px ${gibushHex}` }} />
          <span className="font-black" style={{ backgroundImage: `linear-gradient(90deg, ${gibushHex}, #fff)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>איך אתה מתקדם</span>
          <span className="mr-auto flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider" style={{ backgroundColor: "#ef444422", color: "#f87171" }}><span className="w-1 h-1 rounded-full bg-red-400" style={{ animation: "hmBlink 1.2s ease-in-out infinite" }} />LIVE</span>
        </div>
        <div className="relative grid gap-2 grid-cols-1">
          <SpeedGauge value={attendanceValue} label="נוכחות" hex={gibushHex} />
        </div>
      </Card>
      )}

      {openFeedbackEvent && (
        <button onClick={goToFeedback} className="w-full rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 p-4 flex items-center justify-between active:scale-[0.98] transition">
          <div className="text-right w-full">
            <div className="text-emerald-400 font-black text-base flex items-center gap-1.5 justify-end">
              מילוי משוב אימון <ClipboardCheck size={16} />
            </div>
            <div className="text-emerald-200/70 text-[13px] mt-0.5">האימון "{openFeedbackEvent.title}" הסתיים - נשמח לשמוע איך היה</div>
          </div>
        </button>
      )}

      <Card className="p-5 relative overflow-hidden border-none" style={{ background: `linear-gradient(160deg, ${gibushHex}15, transparent 50%), var(--card-base)` }}>
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: `${gibushHex}20` }} />
        <SectionTitle icon={Clock} tone="amber">{profile?.gibushType ? `ספירה לאחור ל${profile.gibushType}` : "ספירה לאחור לגיבוש הקרוב"}</SectionTitle>
        {timeLeft ? (
          <div className="grid grid-cols-4 gap-2.5 text-center relative">
            {[["ימים", timeLeft.d], ["שעות", timeLeft.h], ["דק׳", timeLeft.m], ["שנ׳", timeLeft.s]].map(([label, val]) => (
              <div key={label} className="rounded-2xl py-3.5 bg-black border-2" style={{ borderColor: gibushHex }}>
                <div className="text-2xl font-black tabular-nums" style={{ color: gibushHex }}>{String(val).padStart(2, "0")}</div>
                <div className="text-[11px] text-zinc-400 font-semibold mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={isIndividual ? () => goToPath?.() : undefined} className="w-full text-center py-5 bg-black border-2 border-amber-500/50 rounded-xl text-amber-400 hover:border-amber-500 transition glow-pulse" style={glowVars("#f59e0b")}>
            <Target size={22} className="mx-auto mb-2" />
            <div className="text-base font-black mb-1">עדיין לא נקבע מועד גיבוש</div>
            <div className="text-[13px] text-amber-400/70">לחצו כאן כדי לקבוע בלוז השבועי ב"המסלול שלי"</div>
          </button>
        )}
      </Card>
      {warMode && (
        <div className="relative rounded-3xl overflow-hidden p-4" style={{ background: "radial-gradient(ellipse 130% 80% at 30% -10%, #dc262635, transparent 65%), var(--card-base)", boxShadow: "0 0 0 2px #dc262650 inset" }}>
          <div className="absolute -right-10 -top-14 w-48 h-48 rounded-full blur-3xl opacity-30" style={{ backgroundColor: "#dc2626", animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="relative flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-red-500/15 border-2 border-red-500/50 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#dc2626")}>
              <Siren size={20} className="text-red-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="text-base font-black text-red-400">מצב מלחמה פעיל</div>
              <div className="text-[12px] text-zinc-500">תוכנית ביתית · 10 שבועות · ללא ציוד</div>
            </div>
            <span className="text-[11px] font-bold bg-red-500/15 text-red-400 rounded-full px-2.5 py-1 shrink-0">10 שבועות</span>
          </div>

          {WAR_WEEKS.filter((w) => w.intro).map((w) => (
            <div key={w.title} className="relative rounded-2xl p-3.5 mb-2.5" style={{ background: "linear-gradient(120deg, #dc262618, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1px #dc262635 inset" }}>
              <div className="text-sm font-black text-red-400 mb-1.5 flex items-center gap-1.5"><Star size={13} /> {w.title}</div>
              <div className="space-y-1">
                {w.body.map((line, idx) => (
                  <div key={idx} className="text-[13px] text-zinc-300 leading-relaxed">{line}</div>
                ))}
              </div>
            </div>
          ))}

          <div className="relative space-y-2">
            {WAR_WEEKS.filter((w) => !w.intro).map((w, i) => {
              const isOpen = openWeek === i;
              return (
                <div key={w.title} className="rounded-2xl overflow-hidden" style={{ background: isOpen ? "linear-gradient(120deg, #dc262620, transparent 70%), var(--card-base-alt)" : "var(--card-base-alt)", boxShadow: `0 0 0 1px ${isOpen ? "#dc262650" : "#27272a"} inset` }}>
                  <button onClick={() => setOpenWeek(isOpen ? -1 : i)} className="w-full flex items-center gap-2.5 px-3.5 py-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 ${isOpen ? "bg-red-500 text-black" : "bg-black text-red-400 border border-red-500/40"}`}>{i + 1}</span>
                    <span className="text-base font-bold text-zinc-200 flex-1 text-right">{w.title}</span>
                    <ChevronDown size={16} className={`text-red-400/70 transition shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5">
                      {w.workouts ? (
                        w.workouts.map((workout, wi) => <WarWorkoutBlock key={wi} workout={workout} />)
                      ) : (
                        <div className="space-y-1.5">
                          {w.body.map((line, idx) => (
                            <div key={idx} className="text-[13px] text-zinc-400 flex items-start gap-1.5 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-red-500 shrink-0 mt-1.5" /> <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="relative mt-3.5">
            <GlowButton tone="red" icon={ShieldAlert} className="w-full" onClick={goToWarChat}>פתח צ׳אט AI חירום</GlowButton>
          </div>
        </div>
      )}

      {!isIndividual && networkId === YUVAL_NETWORK_ID && (
      <button onClick={() => setHomeView("training_summaries")} className="relative w-full text-right rounded-2xl overflow-hidden p-4 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #0ea5e922, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #0ea5e945 inset" }}>
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-sky-500 pointer-events-none" />
        <div className="relative w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
          <ClipboardCheck size={20} className="text-sky-400" />
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="text-[15px] font-black text-zinc-100">סיכומי אימון</div>
          <div className="text-[12px] text-zinc-500">כל הסיכומים של האימונים הקבוצתיים</div>
        </div>
        <ChevronLeft size={17} className="relative text-sky-500/60 shrink-0" />
      </button>
      )}

      <button onClick={() => setHomeView("training_board")} className="relative w-full text-right rounded-2xl overflow-hidden p-4 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #a855f722, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #a855f745 inset" }}>
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-violet-500 pointer-events-none" />
        <div className="relative w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
          <Users size={20} className="text-violet-400" />
        </div>
        <div className="relative flex-1 min-w-0">
          <div className="text-[15px] font-black text-zinc-100">מי מתאמן?</div>
          <div className="text-[12px] text-zinc-500">מי ומתי מתאמן ברשת שלך - הצטרפו אליהם</div>
        </div>
        <ChevronLeft size={17} className="relative text-violet-500/60 shrink-0" />
      </button>

      <HomeDivider hex={gibushHex} />

      <div className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden p-3.5 tech-grid" style={{ background: `radial-gradient(ellipse 120% 90% at 20% -20%, ${gibushHex}20, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${gibushHex}35 inset` }}>
          <style>{`@keyframes magerDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(5px,-8px); opacity: 0.6; } }`}</style>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="absolute rounded-full" style={{ width: 2, height: 2, backgroundColor: gibushHex, right: `${8 + i * 24}%`, top: `${20 + (i % 2) * 45}%`, opacity: 0.4, animation: `magerDust ${4 + i}s ease-in-out ${i * 0.3}s infinite` }} />
            ))}
          </div>
          <div className="relative flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${gibushHex}22` }}>
              <BarChart3 size={17} style={{ color: gibushHex }} />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-black text-zinc-100">מאגר אימונים</div>
              <div className="text-[11px] text-zinc-500">
                <AnimatedNumber value={(trainingContent || []).filter((t) => t.title !== "עקרונות ומטרות").length} className="tabular-nums" /> אימונים בסה״כ
              </div>
            </div>
            <button onClick={() => setMagerOnlyWithContent((s) => !s)} className="text-[11px] font-bold rounded-full px-2.5 py-1.5 shrink-0" style={magerOnlyWithContent ? { backgroundColor: `${gibushHex}25`, color: gibushHex } : { backgroundColor: "#18181b", color: "#71717a" }}>
              רק עם תוכן
            </button>
          </div>
          <div className="relative flex items-center gap-1.5 mt-2">
            <button
              onClick={() => {
                const allWorkouts = (trainingContent || []).filter((t) => t.title !== "עקרונות ומטרות");
                if (allWorkouts.length === 0) return;
                const pick = allWorkouts[Math.floor(Math.random() * allWorkouts.length)];
                const bank = TRAINING_BANK.find((b) => b.id === pick.subcategory);
                if (bank) openMagerCategory(bank);
              }}
              className="flex items-center gap-1.5 text-[11px] font-bold rounded-full px-2.5 py-1.5 border"
              style={{ borderColor: `${gibushHex}45`, color: gibushHex, backgroundColor: `${gibushHex}10` }}
            >
              <RefreshCw size={11} /> אימון אקראי
            </button>
            <button onClick={() => setMagerCompactView((s) => !s)} className="flex items-center gap-1.5 text-[11px] font-bold rounded-full px-2.5 py-1.5 border border-zinc-700 text-zinc-400">
              {magerCompactView ? <ChevronDown size={11} /> : <ChevronUp size={11} />} {magerCompactView ? "תצוגה רגילה" : "תצוגה קומפקטית"}
            </button>
          </div>
        </div>

        <div className="relative">
          <input value={magerSearch} onChange={(e) => setMagerSearch(e.target.value)} placeholder="חיפוש קטגוריית אימון..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-8 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />

          {magerSearch && (
            <button onClick={() => setMagerSearch("")} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"><X size={14} /></button>
          )}
        </div>

        {aiRecommendation?.bank ? (
          <button
            onClick={() => openMagerCategory(aiRecommendation.bank)}
            className="relative w-full text-right rounded-2xl overflow-hidden p-4 flex items-center gap-3"
            style={{ background: "linear-gradient(120deg, #a855f728, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #a855f760 inset" }}
          >
            <div className="w-11 h-11 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
              <Bot size={20} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black uppercase text-violet-400">ה-AI ממליץ</div>
              <div className="text-[14px] font-black text-zinc-100 truncate">{aiRecommendation.bank.title}</div>
              <div className="text-[11px] text-zinc-500 truncate">{aiRecommendation.reason}</div>
            </div>
            <ChevronLeft size={17} className="text-violet-400/60 shrink-0" />
          </button>
        ) : (
          <button
            onClick={getAiRecommendation}
            disabled={loadingAiRecommendation}
            className="relative w-full text-right rounded-2xl overflow-hidden p-3.5 flex items-center gap-3 disabled:opacity-60"
            style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #a855f740 inset" }}
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
              {loadingAiRecommendation ? <Loader2 size={16} className="text-violet-400 animate-spin" /> : <Bot size={16} className="text-violet-400" />}
            </div>
            <span className="text-[13px] font-bold text-violet-300 flex-1">{loadingAiRecommendation ? "חושב..." : "מה מומלץ לי להתאמן עליו עכשיו? (AI)"}</span>
          </button>
        )}

        {magerRecentCategories.length > 0 && !magerSearch.trim() && (
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {magerRecentCategories.map((id) => {
              const b = TRAINING_BANK.find((x) => x.id === id);
              if (!b) return null;
              const hex = TRAINING_BANK_HEX[id] || gibushHex;
              return (
                <button key={id} onClick={() => openMagerCategory(b)} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border" style={{ borderColor: `${hex}45`, backgroundColor: `${hex}10` }}>
                  <Clock size={10} style={{ color: hex }} />
                  <span className="text-[11px] font-bold" style={{ color: hex }}>{b.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {(() => {
          const allWorkouts = (trainingContent || []).filter((t) => t.title !== "עקרונות ומטרות");
          if (allWorkouts.length === 0) {
            return (
              <div className="relative w-full rounded-2xl overflow-hidden p-4 flex items-center gap-3.5" style={{ background: "var(--card-base-alt)" }}>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-16 rounded-full bg-zinc-800" />
                  <div className="h-3.5 w-3/4 rounded-full bg-zinc-800" />
                </div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", animation: "shimmerSlide 1.6s ease-in-out infinite" }} />
                </div>
              </div>
            );
          }
          const day = Math.floor(Date.now() / 86400000);
          const spot = todaySpotOverride || allWorkouts[day % allWorkouts.length];
          const bank = TRAINING_BANK.find((b) => b.id === spot.subcategory);
          const hex = TRAINING_BANK_HEX[spot.subcategory] || "#10b981";
          return (
            <div className="relative rounded-2xl p-[1.5px] overflow-hidden" style={{ background: `conic-gradient(${hex}, transparent, ${hex})`, animation: "auraSpin 5s linear infinite" }}>
            <button
              onClick={() => openMagerCategory(bank || { id: spot.subcategory, title: spot.subcategory })}
              className="relative w-full text-right rounded-2xl overflow-hidden p-4 flex items-center gap-3.5"
              style={{ background: `linear-gradient(120deg, ${hex}25, transparent 75%), var(--card-base-alt)` }}
            >
              <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full blur-3xl opacity-25" style={{ backgroundColor: hex }} />
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 bottom-0 w-16" style={{ background: `linear-gradient(90deg, transparent, ${hex}25, transparent)`, animation: "shimmerSweep 3.5s ease-in-out infinite" }} />
              </div>
              <style>{`
                @keyframes shimmerSweep {
                  0% { transform: translateX(-100px); }
                  50%, 100% { transform: translateX(420px); }
                }
              `}</style>
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 glow-pulse" style={{ backgroundColor: `${hex}25`, ...glowVars(hex) }}>
                <Flame size={22} style={{ color: hex }} />
              </div>
              <div className="relative flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: hex }}>אימון היום</div>
                <div className="text-[15px] font-black text-zinc-100 truncate">{spot.title}</div>
                <div className="text-[12px] text-zinc-500">{bank?.title || spot.subcategory}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setTodaySpotOverride(allWorkouts[Math.floor(Math.random() * allWorkouts.length)]); }} className="relative w-8 h-8 rounded-full bg-black/40 flex items-center justify-center shrink-0">
                <RefreshCw size={13} style={{ color: hex }} />
              </button>
              <ChevronLeft size={18} className="relative shrink-0" style={{ color: hex }} />
            </button>
            </div>
          );
        })()}

        {TRAINING_BANK_GROUPS.map((group, gi) => {
          let cats = TRAINING_BANK.filter((b) => b.group === group.id);
          if (magerSearch.trim()) cats = cats.filter((b) => b.title.includes(magerSearch.trim()));
          if (magerOnlyWithContent) cats = cats.filter((b) => (trainingContent || []).some((t) => t.subcategory === b.id));
          if (cats.length === 0) return null;
          const allCats = TRAINING_BANK.filter((b) => b.group === group.id);
          const groupCount = allCats.reduce((sum, b) => sum + (trainingContent || []).filter((t) => t.subcategory === b.id).length, 0);
          const filledCats = allCats.filter((b) => (trainingContent || []).some((t) => t.subcategory === b.id)).length;
          const completionPct = allCats.length ? Math.round((filledCats / allCats.length) * 100) : 0;
          const isOpen = expandedGroups[group.id];
          return (
            <div key={group.id} className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(160deg, ${group.hex}15, transparent 55%), var(--card-base-alt)`, boxShadow: `0 0 0 1px ${group.hex}30 inset`, animation: `magerGroupFadeUp 0.35s ease-out ${gi * 0.08}s both` }}>
              <style>{`@keyframes magerGroupFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } @keyframes magerRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <button onClick={() => setExpandedGroups((g) => ({ ...g, [group.id]: !g[group.id] }))} className="w-full flex items-center gap-3 p-4">
                <div className="relative w-11 h-11 shrink-0">
                  <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
                    <circle cx="22" cy="22" r="19" fill="none" stroke={`${group.hex}25`} strokeWidth="3" />
                    <circle cx="22" cy="22" r="19" fill="none" stroke={group.hex} strokeWidth="3" strokeDasharray={`${(completionPct / 100) * 119} 119`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease-out" }} />
                  </svg>
                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ backgroundColor: `${group.hex}18` }}>
                    <group.icon size={16} style={{ color: group.hex }} />
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-base font-black text-zinc-100">{group.label}</div>
                  <div className="text-[11px] text-zinc-500 mb-1.5">{allCats.length} קטגוריות · {groupCount} אימונים · {completionPct}% מלא</div>
                  <div className="flex items-center gap-1">
                    {allCats.map((b) => {
                      const catHex = TRAINING_BANK_HEX[b.id] || group.hex;
                      const hasContent = (trainingContent || []).some((t) => t.subcategory === b.id);
                      return <span key={b.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasContent ? catHex : "#3f3f46" }} />;
                    })}
                  </div>
                </div>
                <ChevronDown size={18} className={`shrink-0 transition ${isOpen ? "rotate-180" : ""}`} style={{ color: group.hex }} />
              </button>
              {isOpen && !magerCompactView && (
                <div className="grid grid-cols-2 gap-2.5 p-4 pt-0">
                  {cats.map((b, ci) => {
                    const count = (trainingContent || []).filter((t) => t.subcategory === b.id).length;
                    const hex = TRAINING_BANK_HEX[b.id] || group.hex;
                    const isFav = magerFavCategories.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        onClick={() => openMagerCategory(b)}
                        className="relative rounded-2xl active:scale-[0.96] transition p-3.5 text-right flex flex-col gap-2.5 overflow-hidden"
                        style={{ background: `linear-gradient(150deg, ${hex}22, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${hex}35 inset`, animation: `magerGroupFadeUp 0.3s ease-out ${ci * 0.04}s both` }}
                      >
                        <div className="absolute -left-5 -bottom-5 w-16 h-16 rounded-full blur-2xl opacity-25" style={{ backgroundColor: hex }} />
                        <button onClick={(e) => { e.stopPropagation(); askAiWhyImportant(b); }} className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                          <Bot size={11} className="text-violet-400" />
                        </button>
                        <div className="relative flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}22`, boxShadow: `0 0 0 1.5px ${hex}50 inset` }}>
                            <b.icon size={18} style={{ color: hex }} />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: count > 0 ? `${hex}20` : "#27272a", color: count > 0 ? hex : "#52525b" }}>{count}</span>
                            <button onClick={(e) => toggleMagerFavorite(b.id, e)} className="shrink-0">
                              <Star size={13} className={isFav ? "text-amber-400" : "text-zinc-700"} fill={isFav ? "#fbbf24" : "none"} />
                            </button>
                          </div>
                        </div>
                        <span className="relative text-[13px] font-bold text-zinc-100 leading-tight">{b.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAiWhyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowAiWhyModal(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-violet-500/30 rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase text-violet-400">AI מסביר</div>
                <div className="text-[14px] font-black text-zinc-100">{showAiWhyModal.title}</div>
              </div>
              <button onClick={() => setShowAiWhyModal(null)} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500"><X size={14} /></button>
            </div>
            {loadingAiWhy ? (
              <div className="flex items-center gap-2 text-[13px] text-zinc-500 py-4"><Loader2 size={14} className="animate-spin" /> חושב...</div>
            ) : (
              <div className="text-[13px] text-zinc-300 leading-relaxed">{aiWhyText}</div>
            )}
          </div>
        </div>
      )}

      {lastCompletedUndo && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-zinc-900 border border-zinc-700 rounded-full pl-2 pr-4 py-2 shadow-xl">
          <span className="text-[12px] text-zinc-300 font-bold">סומן כבוצע</span>
          <button onClick={() => { toggleWorkoutCompleted(lastCompletedUndo); setLastCompletedUndo(null); }} className="text-[12px] font-black text-emerald-400 bg-emerald-500/15 rounded-full px-3 py-1">
            בטל
          </button>
        </div>
      )}
    </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SHARED MOTION / EFFECTS KIT
// Used by the values page, the metrics page and the weekly schedule.
// Decoration only: pointer-events are off where relevant, hidden from screen
// readers, and every animation is disabled for "reduce motion" users.
// ---------------------------------------------------------------------------
const FX_CSS = `
  @keyframes fxRing { from { transform: scale(0.35); opacity: 0.95; } to { transform: scale(2.6); opacity: 0; } }
  @keyframes fxConfetti { 0% { transform: translate(0, 0) rotate(0deg); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; } }
  @keyframes fxEnter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes fxDrift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(24px, -30px) scale(1.12); } }
  @keyframes fxFade { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes fxRise { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 0.55; } 90% { opacity: 0.3; } 100% { transform: translate(18px, -105vh); opacity: 0; } }
  @keyframes fxTwinkle { 0%, 100% { opacity: 0.25; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.25); } }
  @keyframes fxBreathe { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
  @keyframes fxShoot { 0% { opacity: 0; transform: translate(0, 0) rotate(-28deg); } 2% { opacity: 1; } 8% { opacity: 0; transform: translate(-320px, 150px) rotate(-28deg); } 100% { opacity: 0; transform: translate(-320px, 150px) rotate(-28deg); } }
  @keyframes fxSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fxSweep { 0%, 62% { transform: translateX(-130%); } 100% { transform: translateX(330%); } }
  @keyframes fxPing { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.55); opacity: 0; } }
  @keyframes fxFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes fxSlideIn { from { opacity: 0; transform: translateX(-26px); } to { opacity: 1; transform: none; } }
  @keyframes fxDraw { from { stroke-dashoffset: var(--from); } to { stroke-dashoffset: var(--to); } }
  @keyframes fxDonut { from { stroke-dasharray: 0 var(--c); } to { stroke-dasharray: var(--seg) var(--c); } }
  @keyframes fxGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes fxScaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fxBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
  @keyframes fxBanner { 0% { opacity: 0; transform: translateY(-24px) scale(0.9); } 10%, 88% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-12px); } }
  @keyframes fxBar { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
  @keyframes fxCorner { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.85; } }
  @keyframes fxGlow { 0%, 100% { box-shadow: 0 0 0 0 var(--gc, transparent); } 50% { box-shadow: 0 0 16px 3px var(--gc, transparent); } }
  @keyframes fxScan { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(400%); opacity: 0; } }

  /* staggered entrance for the direct children of an .fx-stagger container */
  .fx-stagger > :not(style):not(.fixed) { animation: fxEnter 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
  .fx-stagger > :nth-child(2) { animation-delay: 0.05s; } .fx-stagger > :nth-child(3) { animation-delay: 0.10s; }
  .fx-stagger > :nth-child(4) { animation-delay: 0.15s; } .fx-stagger > :nth-child(5) { animation-delay: 0.20s; }
  .fx-stagger > :nth-child(6) { animation-delay: 0.25s; } .fx-stagger > :nth-child(7) { animation-delay: 0.30s; }
  .fx-stagger > :nth-child(n+8) { animation-delay: 0.35s; }

  /* springy press feedback on every button inside an .fx-root page */
  .fx-root button { transition-property: scale, filter, color, background-color, border-color, opacity, box-shadow; transition-duration: 0.18s; transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
  .fx-root button:not(:disabled):active { scale: 0.95; filter: brightness(1.14); }

  @media (prefers-reduced-motion: reduce) { .fx-root, .fx-root *, .fx-ambience * { animation: none !important; } }
`;
function FxStyles() { return <style>{FX_CSS}</style>; }
function ensureFxStyles() {
  if (typeof document === "undefined" || document.getElementById("sayert-fx-styles")) return;
  const st = document.createElement("style");
  st.id = "sayert-fx-styles";
  st.textContent = FX_CSS;
  document.head.appendChild(st);
}
const fxReduced = () => { try { return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } };

// Expanding ring at the exact spot of a tap/click.
function fxTouchRing(e, color) {
  try {
    if (fxReduced() || (e.pointerType === "mouse" && e.button !== 0)) return;
    ensureFxStyles();
    const size = 34;
    const el = document.createElement("span");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `position:fixed;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;border:2px solid ${color}cc;box-shadow:0 0 12px ${color}80;pointer-events:none;z-index:70;animation:fxRing 0.6s ease-out forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
  } catch (err) {}
}

// Burst of confetti (coloured pieces + a few emoji) from a point on screen.
function fxConfetti(colors, opts = {}) {
  try {
    if (fxReduced()) return;
    ensureFxStyles();
    const { x = window.innerWidth / 2, y = window.innerHeight * 0.55, count = 28 } = opts;
    const glyphs = ["✨", "⭐", "💫", "🔥", "🏆"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const ang = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 180;
      const emoji = i % 5 === 0;
      el.setAttribute("aria-hidden", "true");
      if (emoji) el.textContent = glyphs[(i / 5) % glyphs.length | 0];
      el.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:80;${emoji ? "font-size:16px;line-height:1;" : `width:7px;height:10px;border-radius:2px;background:${colors[i % colors.length]};`}--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist - 70}px;--rot:${Math.round(Math.random() * 720 - 360)}deg;animation:fxConfetti ${(0.9 + Math.random() * 0.8).toFixed(2)}s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  } catch (err) {}
}

// Pointer-driven 3D tilt + a soft light that follows the finger/cursor.
// Spread the result on a card, give it style={fxTiltStyle} and render <FxSpot /> inside it.
const fxTiltStyle = { transform: "perspective(700px) rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg))", transition: "transform 0.25s ease-out" };
function fxTilt(strength = 7) {
  return {
    onPointerMove: (e) => {
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--tx", `${((0.5 - py) * strength).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${((px - 0.5) * strength).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--spot", "1");
    },
    onPointerLeave: (e) => {
      const el = e.currentTarget;
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
      el.style.setProperty("--spot", "0");
    },
  };
}
function FxSpot({ radius = "1rem" }) {
  return <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ borderRadius: radius, background: "radial-gradient(150px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.11), transparent 62%)", opacity: "var(--spot, 0)", transition: "opacity 0.3s" }} />;
}

// Thin bar at the very top that fills as the page is scrolled (updates the DOM directly - no re-render).
function FxScrollBar({ hex }) {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = (ev) => {
      const t = ev.target;
      const isDoc = t === document || t === document.documentElement;
      if (!isDoc && (t.clientHeight || 0) < 300) return;
      const st = isDoc ? window.scrollY : t.scrollTop;
      const max = isDoc ? document.documentElement.scrollHeight - window.innerHeight : t.scrollHeight - t.clientHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, st / max)) : 0})`;
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);
  return (
    <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, maxWidth: "var(--app-max-width)", marginInline: "auto", height: 3, zIndex: 45, pointerEvents: "none" }}>
      <div ref={ref} style={{ height: "100%", transformOrigin: "right", transform: "scaleX(0)", background: `linear-gradient(270deg, ${hex}, ${hex}66)`, boxShadow: `0 0 8px ${hex}` }} />
    </div>
  );
}

// Fixed background layer: tinted wash, spotlight, 3 drifting aurora glows (colour cross-fade + scroll
// parallax), light rays, optional dot grid, floating icon watermarks, particles, stars, shooting star.
function FxAmbience({ hex, hex2, hex3, icons = [], dots = false, particles = 12 }) {
  const par = (k) => ({ transform: `translate3d(0, calc(var(--hm-scroll, 0) * ${k}px), 0)` });
  const blob = (key, style, c1, c2, dur, k) => (
    <div key={key} style={{ position: "absolute", ...style, ...par(k) }}>
      <div style={{ position: "relative", width: "100%", height: "100%", animation: `fxDrift ${dur}s ease-in-out infinite` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${c1}55 0%, transparent 65%)`, animation: `fxFade ${dur * 1.4}s ease-in-out infinite` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${c2}55 0%, transparent 65%)`, animation: `fxFade ${dur * 1.4}s ease-in-out -${dur * 0.7}s infinite` }} />
      </div>
    </div>
  );
  const h2 = hex2 || hex, h3 = hex3 || hex;
  const spots = [{ top: "14%", right: "-8%" }, { top: "46%", left: "-10%" }, { bottom: "8%", right: "6%" }];
  return (
    <div aria-hidden="true" className="fx-ambience" style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, maxWidth: "var(--app-max-width)", marginInline: "auto", pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${hex}12 0%, transparent 45%)` }} />
      <div style={{ position: "absolute", top: -60, left: "50%", width: 340, height: 440, marginLeft: -170, background: `radial-gradient(ellipse at top, ${hex}2a, transparent 70%)`, animation: "fxBreathe 7s ease-in-out infinite" }} />
      {dots && <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: `radial-gradient(circle, ${hex}28 1px, transparent 1.6px)`, backgroundSize: "22px 22px" }} />}
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
        {blob("a", { top: -90, right: -130, width: 380, height: 380 }, hex, h2, 16, -0.05)}
        {blob("b", { top: "38%", left: -150, width: 340, height: 340 }, h2, h3, 21, -0.09)}
        {blob("c", { bottom: -140, right: "6%", width: 360, height: 360 }, h3, hex, 26, -0.13)}
      </div>
      {[["26%", 16], ["64%", -14]].map(([left, rot], i) => (
        <div key={i} style={{ position: "absolute", top: -20, left, width: 64, height: 520, background: `linear-gradient(180deg, ${hex}24, transparent 85%)`, transform: `rotate(${rot}deg)`, transformOrigin: "top", animation: `fxBar ${8 + i * 3}s ease-in-out ${i * 2}s infinite` }} />
      ))}
      {icons.slice(0, 3).map((Ico, i) => (
        <div key={i} style={{ position: "absolute", ...spots[i], ...par(-0.07 - i * 0.03) }}>
          <div style={{ animation: `fxDrift ${30 + i * 8}s ease-in-out ${i * 3}s infinite` }}>
            <Ico size={190 - i * 30} strokeWidth={1.2} style={{ color: i % 2 ? h2 : hex, opacity: 0.055 }} />
          </div>
        </div>
      ))}
      {Array.from({ length: particles }).map((_, i) => (
        <span key={i} style={{ position: "absolute", bottom: -10, left: `${(i * 53 + 7) % 96}%`, width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%", backgroundColor: i % 3 === 0 ? h2 : hex, opacity: 0, animation: `fxRise ${14 + (i % 5) * 3}s linear ${(i * 1.7) % 12}s infinite` }} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} style={{ position: "absolute", top: `${(i * 37 + 6) % 70}%`, left: `${(i * 61 + 9) % 92}%`, fontSize: 6 + (i % 3) * 3, color: "#fff", lineHeight: 1, animation: `fxTwinkle ${3 + (i % 4)}s ease-in-out ${i * 0.7}s infinite` }}>✦</span>
      ))}
      <span style={{ position: "absolute", top: "11%", right: "-6%", width: 90, height: 1.5, background: "linear-gradient(90deg, transparent, #fff)", opacity: 0, animation: "fxShoot 11s ease-in 4s infinite" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.42) 100%)" }} />
    </div>
  );
}

// A rotating gradient border ring plus a periodic light sweep, for a rounded card (parent must be relative + overflow-hidden).
function FxFrame({ hex, hex2, radius = "1.5rem" }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ borderRadius: radius, padding: 1.5, overflow: "hidden", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude" }}>
        <div style={{ position: "absolute", inset: "-100%", background: `conic-gradient(from 0deg, transparent 0%, ${hex} 10%, transparent 26%, transparent 55%, ${hex2 || hex} 68%, transparent 84%)`, animation: "fxSpin 8s linear infinite" }} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: radius }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, width: "38%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.10), transparent)", animation: "fxSweep 9s ease-in-out 1.5s infinite" }} />
      </div>
    </>
  );
}

// Circular progress that draws itself in. Children render in the centre.
function FxRing({ size = 44, stroke = 4, pct = 0, hex = "#a855f7", track = "#27272a", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const to = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={hex} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={to} style={{ "--from": c, "--to": to, animation: "fxDraw 0.9s ease-out both", filter: `drop-shadow(0 0 3px ${hex}99)` }} />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

// Radar chart: one axis per item, value 0..1, draws itself in.
function FxRadar({ items, size = 210, hex = "#a855f7" }) {
  const n = items.length;
  const cx = size / 2, cy = size / 2, R = size / 2 - 34;
  const pt = (i, r) => { const a = (Math.PI * 2 * i) / n - Math.PI / 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const poly = (r) => items.map((_, i) => pt(i, r).map((v) => v.toFixed(1)).join(",")).join(" ");
  const dataPts = items.map((it, i) => pt(i, R * Math.max(0.06, it.value)).map((v) => v.toFixed(1)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[230px] mx-auto block">
      {[0.33, 0.66, 1].map((k) => <polygon key={k} points={poly(R * k)} fill="none" stroke="#3f3f46" strokeWidth="1" opacity={0.7} />)}
      {items.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#3f3f46" strokeWidth="1" opacity={0.6} />; })}
      <polygon points={dataPts} fill={`${hex}33`} stroke={hex} strokeWidth="2" strokeLinejoin="round" style={{ transformOrigin: `${cx}px ${cy}px`, animation: "fxScaleIn 0.9s ease-out both", filter: `drop-shadow(0 0 6px ${hex}88)` }} />
      {items.map((it, i) => { const [x, y] = pt(i, R * Math.max(0.06, it.value)); return <circle key={i} cx={x} cy={y} r="3" fill={it.hex} style={{ animation: `fxScaleIn 0.5s ease-out ${0.5 + i * 0.05}s both`, transformOrigin: `${x}px ${y}px` }} />; })}
      {items.map((it, i) => { const [x, y] = pt(i, R + 17); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight="700" fill={it.value > 0 ? it.hex : "#71717a"}>{it.label}</text>; })}
    </svg>
  );
}

// Donut chart: segments draw themselves in. Centre content via children.
function FxDonut({ segments, size = 130, stroke = 16, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f1f23" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const seg = Math.max(0, (s.value / total) * c - 2);
          const off = -(acc / total) * c;
          acc += s.value;
          return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.hex} strokeWidth={stroke} strokeDasharray={`${seg} ${c}`} strokeDashoffset={off} style={{ "--c": c, "--seg": seg, animation: `fxDonut 0.8s ease-out ${i * 0.08}s both` }} />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

// Types text in character by character (used for a freshly received AI reply).
function FxTypewriter({ text, speed = 14 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => { if (v >= text.length) { clearInterval(id); return v; } return v + 1; }), speed);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, n)}{n < text.length && <span className="inline-block w-[2px] h-3 bg-violet-400 align-middle mr-0.5" style={{ animation: "fxBlink 0.8s steps(2) infinite" }} />}</>;
}

// Section heading with an icon chip and a fading gradient line.
function FxSectionHead({ icon: Icon, title, hex, right }) {
  return (
    <div className="flex items-center gap-2.5 px-0.5">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}1f`, boxShadow: `0 0 0 1px ${hex}45 inset` }}><Icon size={13} style={{ color: hex }} /></div>
      <span className="text-[13px] font-black text-zinc-100">{title}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, ${hex}66, transparent)` }} />
      {right}
    </div>
  );
}

// Streak helpers over a list of entries ({ createdAt }). Best streak is measured inside the 30-day window we load.
function fxStreakStats(entries) {
  const days = new Set(entries.map((e) => toKey(new Date(e.createdAt))));
  let current = 0;
  { const d = new Date(); if (!days.has(toKey(d))) d.setDate(d.getDate() - 1); while (days.has(toKey(d))) { current++; d.setDate(d.getDate() - 1); } }
  let best = 0, run = 0;
  const d2 = new Date(); d2.setDate(d2.getDate() - 29);
  for (let i = 0; i < 30; i++) { if (days.has(toKey(d2))) { run++; best = Math.max(best, run); } else run = 0; d2.setDate(d2.getDate() + 1); }
  return { current, best, days };
}
const VALUE_LEVELS = [
  { min: 0, title: "מתחיל/ה", hex: "#a1a1aa" },
  { min: 3, title: "מתעורר/ת", hex: "#38bdf8" },
  { min: 8, title: "מתמיד/ה", hex: "#10b981" },
  { min: 15, title: "מעמיק/ה", hex: "#eab308" },
  { min: 30, title: "מוביל/ה", hex: "#f97316" },
  { min: 50, title: "אלוף/ת ערכים", hex: "#ec4899" },
];
function fxLevelFor(total) {
  let idx = 0;
  VALUE_LEVELS.forEach((l, i) => { if (total >= l.min) idx = i; });
  const cur = VALUE_LEVELS[idx], next = VALUE_LEVELS[idx + 1];
  return { idx, cur, next, pct: next ? Math.round(((total - cur.min) / (next.min - cur.min)) * 100) : 100 };
}

/* ============================== VALUES WORK TAB ============================== */
// "עבודה ערכית" - replaces the old journal tab. One page per core value: a daily entry box with
// an AI reply, a separate stories column, and a weekly table + AI feedback on the main page.

function ValuesWorkTab({ userId, profile, showToast }) {
  useHomeScrollParallax();
  const taRef = useRef(null);
  const [typingEntryId, setTypingEntryId] = useState(null);
  const [milestoneBanner, setMilestoneBanner] = useState(null);
  const [coreValues, setCoreValues] = useState([]);
  const [coreValuesLoaded, setCoreValuesLoaded] = useState(false);
  const [openValue, setOpenValue] = useState(null); // the value currently being tracked
  const [valueSubView, setValueSubView] = useState("track"); // 'track' | 'stories'
  const [valueEntries, setValueEntries] = useState([]);
  const [loadingValueEntries, setLoadingValueEntries] = useState(false);
  const [valueEntryText, setValueEntryText] = useState("");
  const [savingValueEntry, setSavingValueEntry] = useState(false);
  const [valueStory, setValueStory] = useState(null);
  const [loadingValueStory, setLoadingValueStory] = useState(false);
  const [weeklyValueSummary, setWeeklyValueSummary] = useState(null);
  const [loadingWeeklyValueSummary, setLoadingWeeklyValueSummary] = useState(false);
  const [valuesAllEntries, setValuesAllEntries] = useState([]); // last 30 days, all values
  const [valueFavorites, setValueFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem("sayert_value_favs") || "[]"); } catch (e) { return []; } });
  const [valueRecent, setValueRecent] = useState(() => { try { return JSON.parse(localStorage.getItem("sayert_value_recent") || "[]"); } catch (e) { return []; } });
  const [readStories, setReadStories] = useState(() => { try { return JSON.parse(localStorage.getItem("sayert_read_stories") || "[]"); } catch (e) { return []; } });
  const [valueSearch, setValueSearch] = useState("");
  const [valueFilter, setValueFilter] = useState("all"); // 'all' | 'today' | 'notyet'
  const [valueSort, setValueSort] = useState("name"); // 'name' | 'active'
  const [entryFilter, setEntryFilter] = useState("all"); // 'all' | 'today'
  const [expandedEntries, setExpandedEntries] = useState({});
  const [confirmDeleteEntryId, setConfirmDeleteEntryId] = useState(null);
  const [valueJustSaved, setValueJustSaved] = useState(false);
  const [storyFontScale, setStoryFontScale] = useState(1);
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);
  useEffect(() => {
    if (!coreValuesLoaded) {
      loadCoreValues().then((v) => { setCoreValues(v); setCoreValuesLoaded(true); });
      loadAllValueEntriesForWeek(userId, new Date(Date.now() - 30 * 86400000).toISOString()).then(setValuesAllEntries).catch(() => {});
    }
  }, []);
  useEffect(() => {
    if (!openValue) return;
    try {
      if (valueEntryText) localStorage.setItem(`sayert_value_draft_${openValue.id}`, valueEntryText);
      else localStorage.removeItem(`sayert_value_draft_${openValue.id}`);
    } catch (e) {}
  }, [valueEntryText, openValue]);
  async function openValueTracking(value) {
    setOpenValue(value);
    setValueSubView("track");
    let draft = "";
    try { draft = localStorage.getItem(`sayert_value_draft_${value.id}`) || ""; } catch (e) {}
    setValueEntryText(draft);
    setEntryFilter("all");
    setConfirmDeleteEntryId(null);
    setLoadingValueEntries(true);
    const entries = await loadValueEntries(userId, value.id);
    setValueEntries(entries);
    setLoadingValueEntries(false);
  }
  async function openValueStories(value) {
    setOpenValue(value);
    setValueSubView("stories");
    setLoadingValueStory(true);
    const story = await loadValueStory(value.title);
    setValueStory(story);
    setLoadingValueStory(false);
  }
  // The entry box grows with what you type (up to a limit) and shrinks back after sending.
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [valueEntryText, openValue, valueSubView]);
  async function submitValueEntry() {
    if (!valueEntryText.trim()) return;
    setSavingValueEntry(true);
    try {
      const unitVals = getUnitValues(profile?.targetUnit);
      const unitLine = profile?.targetUnitName ? ` המתאמן שואף להתקבל ל${profile.targetUnitName}${unitVals ? ` (היחידה הזו מחפשת: ${unitVals.traits.slice(0, 3).join("; ")})` : ""}. אם זה רלוונטי, קשר בקצרה את מה שכתב למה שהגיבוש והיחידה בוחנים.` : "";
      const sys = `אתה מאמן ערכי לבני נוער בהכנה לשירות קרבי. המתאמן כתב לך משהו שקשור לערך "${openValue.title}" (${openValue.body}).${unitLine} תן תגובה קצרה (2-3 משפטים), חמה אך כנה - התייחס ספציפית למה שכתב, לא תשובה כללית.`;
      const reply = await aiChat(sys, valueEntryText.trim());
      await saveValueEntry(userId, openValue.id, valueEntryText.trim(), reply);
      const beforeStreak = fxStreakStats(valuesAllEntries).current;
      const entries = await loadValueEntries(userId, openValue.id);
      setValueEntries(entries);
      setTypingEntryId(entries[0]?.id || null); // the newest reply types itself in
      setTimeout(() => setTypingEntryId(null), 9000);
      setValueEntryText("");
      try { localStorage.removeItem(`sayert_value_draft_${openValue.id}`); } catch (e) {}
      const celebrateHex = (VALUE_META[openValue.title] || {}).hex || "#a855f7";
      fxConfetti([celebrateHex, "#fbbf24", "#ffffff", "#ec4899"]);
      try {
        const fresh = await loadAllValueEntriesForWeek(userId, new Date(Date.now() - 30 * 86400000).toISOString());
        setValuesAllEntries(fresh);
        const afterStreak = fxStreakStats(fresh).current;
        if (afterStreak > beforeStreak && [3, 7, 14, 30].includes(afterStreak)) {
          setMilestoneBanner(afterStreak);
          setTimeout(() => setMilestoneBanner(null), 4300);
          fxConfetti([celebrateHex, "#fbbf24", "#f97316", "#ffffff"], { count: 64, y: window.innerHeight * 0.35 });
        }
      } catch (e) {}
      setValueJustSaved(true);
      setTimeout(() => setValueJustSaved(false), 1000);
      showToast?.("נשמר, וה-AI ענה", "success");
    } catch (e) {
      showToast?.("שגיאה בשליחה", "error");
    } finally {
      setSavingValueEntry(false);
    }
  }
  async function getWeeklyValueSummary() {
    setLoadingWeeklyValueSummary(true);
    try {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const entries = await loadAllValueEntriesForWeek(userId, weekAgo);
      if (entries.length === 0) {
        setWeeklyValueSummary({ reasoning: "עדיין לא כתבת שום דבר על אף ערך השבוע. ברגע שתתחיל לכתוב על ערך, הוא יופיע בטבלה וה-AI ינתח אותו כאן.", focusAreas: [], missedAreas: [], generatedAt: Date.now() });
        return;
      }
      // Only values the trainee actually wrote about (and got a reply on) are analysed.
      const engagedIds = [...new Set(entries.map((e) => e.valueId))];
      const engaged = coreValues.filter((v) => engagedIds.includes(v.id));
      const untouched = coreValues.filter((v) => !engagedIds.includes(v.id)).map((v) => v.title);
      const entriesText = engaged.map((v) => {
        const ve = entries.filter((e) => e.valueId === v.id);
        return `${v.title} (${ve.length} הודעות): ${ve.map((e) => e.entryText).join(" | ")}`;
      }).join("\n");
      const unitVals = getUnitValues(profile?.targetUnit);
      const unitLine = unitVals ? `היעד של המתאמן הוא ${profile?.targetUnitName}. הערכים שהיחידה הזו מחפשת בפועל: ${unitVals.traits.join("; ")}.` : (profile?.targetUnitName ? `היעד של המתאמן הוא ${profile.targetUnitName}.` : "");
      const sys = `אתה מאמן ערכי לבני נוער בהכנה לשירות קרבי. ${unitLine}
קיבלת את כל מה שהמתאמן כתב בשבוע האחרון על ערכים - רק על ערכים שהוא בחר לכתוב עליהם. ערכים שלא נגע בהם השבוע: ${untouched.join(", ") || "אין"}.
תן משוב שבועי מלא ומדויק:
1. התייחס אך ורק לערכים שהוא כתב עליהם (אל תמציא ואל תזכיר ערכים שלא כתב עליהם כאילו עבד עליהם).
2. קשר את מה שכתב באופן מפורש לגיבוש וליחידה שהוא מכוון אליהם.
3. ב-missedAreas ציין עד 3 ערכים מתוך רשימת "ערכים שלא נגע בהם" שהכי חשוב לו לעבוד עליהם לפי היחידה שלו.
החזר אך ורק JSON בפורמט: {"reasoning": "פסקה אחת מלאה וחמה", "focusAreas": ["ערכים שהתמקד בהם"], "missedAreas": ["ערכים שלא נגע בהם וחשוב לעבוד עליהם"]}`;
      const reply = await aiChat(sys, `סיכום שבועי של המתאמן:\n${entriesText}`);
      const match = reply.match(/\{[\s\S]*\}/);
      let parsed;
      try { parsed = match ? JSON.parse(match[0]) : null; } catch (e) { parsed = null; }
      setWeeklyValueSummary({
        reasoning: parsed?.reasoning || reply,
        focusAreas: Array.isArray(parsed?.focusAreas) ? parsed.focusAreas : [],
        missedAreas: Array.isArray(parsed?.missedAreas) ? parsed.missedAreas.filter((m) => untouched.includes(m)) : [],
        generatedAt: Date.now(),
      });
    } catch (e) {
      setWeeklyValueSummary({ reasoning: "לא הצלחתי לבנות סיכום כרגע, נסה שוב בעוד רגע.", focusAreas: [], missedAreas: [], generatedAt: Date.now() });
    } finally {
      setLoadingWeeklyValueSummary(false);
    }
  }

  const ambHex = openValue ? ((VALUE_META[openValue.title] || {}).hex || "#a855f7") : "#a855f7";
  const ambIcons = openValue ? [(VALUE_META[openValue.title] || {}).icon || Heart, Heart, Trophy] : [Heart, Trophy, Users];
  return (
    <>
    <FxStyles />
    <FxAmbience hex={ambHex} hex2={openValue ? "#a855f7" : "#ec4899"} hex3={openValue ? "#ec4899" : "#38bdf8"} icons={ambIcons} dots particles={12} />
    {milestoneBanner && (
      <div aria-live="polite" className="fixed left-0 right-0 top-16 z-[60] flex justify-center pointer-events-none px-4" style={{ animation: "fxBanner 4.3s ease-out both" }}>
        <div className="rounded-2xl px-5 py-3 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #f97316, #ec4899)", boxShadow: "0 10px 40px -8px #f97316aa" }}>
          <Flame size={24} className="text-white" />
          <div>
            <div className="text-[10px] font-black text-white/80 uppercase">אבן דרך חדשה</div>
            <div className="text-[15px] font-black text-white">{milestoneBanner} ימי רצף ברצף!</div>
          </div>
        </div>
      </div>
    )}
    <div className="fx-root p-4 space-y-3 relative" onPointerDown={(e) => fxTouchRing(e, ambHex)}>
      <>
      <style>{`
        @keyframes vlFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vlConic { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes vlDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(5px,-9px); opacity: 0.65; } }
        @keyframes vlPop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.25); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes vlShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
        @keyframes vlPulse { 0%, 100% { box-shadow: 0 0 0 0 var(--vc, transparent); } 50% { box-shadow: 0 0 14px 2px var(--vc, transparent); } }
        @keyframes vlSparkle { 0% { transform: translateY(0) scale(0.5); opacity: 1; } 100% { transform: translateY(-34px) scale(1.2); opacity: 0; } }
        @keyframes vlFlame { 0%, 100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(1.15) rotate(3deg); } }
        @keyframes vlSkeleton { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.7; } }
        @keyframes vlCorner { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.75; } }
      `}</style>
      {(() => {
        const WEEKDAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
        const todayKeyV = toKey(new Date());
        const dayKeyOf = (iso) => toKey(new Date(iso));
        const metaOf = (v) => VALUE_META[v?.title] || { icon: Heart, hex: "#a855f7" };
        const copyText = (t) => { try { navigator.clipboard?.writeText(t); showToast?.("הועתק", "success"); } catch (err) {} };
        const fmtDate = (iso) => new Date(iso).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
        const clamp = (n) => ({ display: "-webkit-box", WebkitLineClamp: n, WebkitBoxOrient: "vertical", overflow: "hidden" });

        const entriesByValue = {};
        valuesAllEntries.forEach((e) => { (entriesByValue[e.valueId] = entriesByValue[e.valueId] || []).push(e); });
        const weekAgoMs = Date.now() - 7 * 86400000;
        const weekEntries = valuesAllEntries.filter((e) => new Date(e.createdAt).getTime() >= weekAgoMs);
        const engagedWeekIds = [...new Set(weekEntries.map((e) => e.valueId))];
        const daysWithEntries = new Set(valuesAllEntries.map((e) => dayKeyOf(e.createdAt)));
        const writtenToday = daysWithEntries.has(todayKeyV);
        const todayCount = valuesAllEntries.filter((e) => dayKeyOf(e.createdAt) === todayKeyV).length;
        let streak = 0;
        { const d = new Date(); if (!daysWithEntries.has(toKey(d))) d.setDate(d.getDate() - 1); while (daysWithEntries.has(toKey(d))) { streak++; d.setDate(d.getDate() - 1); } }
        const last7 = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { key: toKey(d), label: WEEKDAYS[d.getDay()], has: daysWithEntries.has(toKey(d)), isToday: i === 6 }; });
        const lastWritten = (vid) => { const arr = entriesByValue[vid]; return arr && arr.length ? Math.max(...arr.map((e) => new Date(e.createdAt).getTime())) : 0; };
        const suggested = [...coreValues].sort((a, b) => lastWritten(a.id) - lastWritten(b.id))[0];

        const pushRecent = (id) => setValueRecent((prev) => { const next = [id, ...prev.filter((x) => x !== id)].slice(0, 4); try { localStorage.setItem("sayert_value_recent", JSON.stringify(next)); } catch (err) {} return next; });
        const toggleFav = (id, ev) => { ev?.stopPropagation(); setValueFavorites((prev) => { const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]; try { localStorage.setItem("sayert_value_favs", JSON.stringify(next)); } catch (err) {} return next; }); };
        const openTrack = (v) => { pushRecent(v.id); return openValueTracking(v); };
        const openStory = (v) => { pushRecent(v.id); return openValueStories(v); };
        const toggleRead = (id) => setReadStories((prev) => { const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]; try { localStorage.setItem("sayert_read_stories", JSON.stringify(next)); } catch (err) {} return next; });

        if (!coreValuesLoaded) {
          return (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-zinc-900" style={{ animation: `vlSkeleton 1.4s ease-in-out ${i * 0.15}s infinite` }} />)}
            </div>
          );
        }
        if (coreValues.length === 0) {
          return (
            <div className="rounded-2xl bg-zinc-900/60 p-8 text-center">
              <Heart size={28} className="text-violet-400 mx-auto mb-2" />
              <div className="text-[13px] text-zinc-500">עדיין לא הוגדרו ערכים. ברגע שיפורסמו, הם יופיעו כאן.</div>
            </div>
          );
        }

        /* =============================== VALUE PAGE =============================== */
        if (openValue) {
          const meta = metaOf(openValue);
          const hex = meta.hex;
          const VIcon = meta.icon;
          const idx = coreValues.findIndex((v) => v.id === openValue.id);
          const prevV = coreValues[(idx - 1 + coreValues.length) % coreValues.length];
          const nextV = coreValues[(idx + 1) % coreValues.length];
          const isFav = valueFavorites.includes(openValue.id);
          const len = valueEntryText.length;
          const shownEntries = entryFilter === "today" ? valueEntries.filter((e) => dayKeyOf(e.createdAt) === todayKeyV) : valueEntries;
          const valueDays = new Set(valueEntries.map((e) => dayKeyOf(e.createdAt)));
          let valueStreak = 0;
          { const d = new Date(); if (!valueDays.has(toKey(d))) d.setDate(d.getDate() - 1); while (valueDays.has(toKey(d))) { valueStreak++; d.setDate(d.getDate() - 1); } }
          const STARTERS = ["מה עשיתי היום שמבטא את הערך הזה?", "רגע שבו היה לי קשה לפעול לפי הערך", "מה אני רוצה לשפר בערך הזה?", "מי מעורר בי השראה בערך הזה ולמה?"];
          const goPrevNext = (v) => (valueSubView === "stories" ? openStory(v) : openTrack(v));

          return (
            <div className="space-y-3 fx-stagger">
              <div className="flex items-center gap-2" style={{ animation: "vlFadeUp 0.3s ease-out both" }}>
                <button onClick={() => setOpenValue(null)} className="flex items-center gap-1 text-zinc-400 text-sm font-bold"><ChevronRight size={15} /> כל הערכים</button>
                <div className="mr-auto flex items-center gap-1.5">
                  <button onClick={() => goPrevNext(prevV)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400"><ChevronRight size={14} /></button>
                  <button onClick={() => goPrevNext(nextV)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400"><ChevronLeft size={14} /></button>
                  <button onClick={(ev) => toggleFav(openValue.id, ev)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><Star size={14} className={isFav ? "text-amber-400" : "text-zinc-600"} fill={isFav ? "#fbbf24" : "none"} /></button>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: `radial-gradient(ellipse 130% 90% at 25% -15%, ${hex}30, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${hex}45 inset`, animation: "vlFadeUp 0.35s ease-out 0.03s both" }}>
                <FxFrame hex={hex} hex2="#a855f7" />
                <HudCorners hex={hex} corners={4} inset={10} />
                <div aria-hidden="true" className="absolute top-2 left-4 pointer-events-none select-none font-black leading-none tabular-nums" style={{ fontSize: 60, color: `${hex}16` }}>{String(idx + 1).padStart(2, "0")}<span style={{ fontSize: 20 }}>/{String(coreValues.length).padStart(2, "0")}</span></div>
                <VIcon size={170} className="absolute -bottom-6 -left-6 pointer-events-none opacity-[0.06]" style={{ color: hex }} />
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="absolute w-1 h-1 rounded-full pointer-events-none" style={{ backgroundColor: hex, left: `${(i * 27 + 12) % 88}%`, top: `${(i * 19 + 10) % 50}%`, animation: `vlDust ${4 + i}s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
                <div className="relative flex items-center gap-3.5">
                  <div className="relative w-16 h-16 shrink-0">
                    <div className="absolute -inset-1.5 rounded-2xl opacity-50" style={{ background: `conic-gradient(from 0deg, ${hex}, transparent 35%, transparent 65%, ${hex})`, animation: "vlConic 6s linear infinite" }} />
                    <div className="absolute inset-0 rounded-2xl bg-black border-2 flex items-center justify-center" style={{ borderColor: hex, boxShadow: `0 0 18px 2px ${hex}55` }}>
                      <VIcon size={28} style={{ color: hex }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-black" style={{ backgroundImage: `linear-gradient(90deg, #ffffff, ${hex})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{openValue.title}</div>
                    <div className="w-10 h-0.5 rounded-full my-1.5" style={{ background: `linear-gradient(90deg, ${hex}, transparent)` }} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10.5px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: `${hex}20`, color: hex }}>{valueEntries.length} הודעות</span>
                      {valueStreak > 0 && <span className="text-[10.5px] font-bold rounded-full px-2 py-0.5 flex items-center gap-1" style={{ backgroundColor: "#f9731620", color: "#fb923c" }}><Flame size={10} /> {valueStreak} ימי רצף</span>}
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-center gap-1.5 mt-4" aria-label={`ערך ${idx + 1} מתוך ${coreValues.length}`}>
                  {coreValues.map((cv, ci) => (
                    <span key={cv.id} className="rounded-full transition-all duration-300" style={{ width: ci === idx ? 18 : 6, height: 6, backgroundColor: ci === idx ? hex : "#3f3f46", boxShadow: ci === idx ? `0 0 8px ${hex}` : "none" }} />
                  ))}
                </div>
                <div className="relative mt-3 rounded-xl bg-black/30 p-3.5 pr-4 overflow-hidden" style={{ borderRight: `3px solid ${hex}` }}>
                  <span aria-hidden="true" className="absolute -top-2 left-2 text-5xl font-black leading-none pointer-events-none select-none" style={{ color: `${hex}18` }}>❝</span>
                  <div className="text-[13px] text-zinc-300 leading-relaxed">{openValue.body}</div>
                </div>
              </div>

              <div className="relative grid grid-cols-2 gap-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl p-1 overflow-hidden">
                <div className="absolute top-1 bottom-1 rounded-xl pointer-events-none transition-all duration-500" style={{ width: "calc(50% - 6px)", right: valueSubView === "track" ? "4px" : "calc(50% + 2px)", background: `linear-gradient(120deg, ${hex}, ${hex}bb)`, boxShadow: `0 0 14px 1px ${hex}70` }} />
                {[["track", "מעקב יומי", Edit2], ["stories", "סיפורים", BookOpen]].map(([id, label, TabIcon]) => (
                  <button key={id} onClick={() => (id === "track" ? openTrack(openValue) : openStory(openValue))} className="relative flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition-colors duration-300 active:scale-95" style={{ color: valueSubView === id ? "#000" : "#71717a" }}>
                    <TabIcon size={14} /> {label}
                  </button>
                ))}
              </div>

              {valueSubView === "track" && (
                <div key="track" className="space-y-3" style={{ animation: "fxSlideIn 0.35s ease-out both" }}>
                  <div className="relative rounded-2xl p-3.5" style={{ background: "var(--card-base)", boxShadow: `0 0 0 1.5px ${hex}30 inset`, animation: "vlFadeUp 0.35s ease-out 0.06s both" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-black text-zinc-200">מה קרה היום שנוגע ל{openValue.title}?</span>
                      <FxRing size={30} stroke={3} pct={(len / 600) * 100} hex={len > 540 ? "#f59e0b" : hex}><span className="text-[8px] font-black tabular-nums" style={{ color: len > 540 ? "#f59e0b" : "#a1a1aa" }}>{600 - len}</span></FxRing>
                    </div>
                    <textarea
                      ref={taRef}
                      value={valueEntryText}
                      onChange={(ev) => setValueEntryText(ev.target.value)}
                      onKeyDown={(ev) => { if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") submitValueEntry(); }}
                      maxLength={600}
                      rows={4}
                      placeholder={`כתוב כאן על ${openValue.title}: מקרה, תחושה, שאלה או החלטה...`}
                      className="w-full bg-zinc-950 border rounded-xl px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none transition-all duration-300"
                      style={{ borderColor: valueEntryText ? `${hex}80` : "#3f3f46", boxShadow: valueEntryText ? `0 0 0 3px ${hex}22` : "none" }}
                    />
                    <div className="flex gap-1.5 overflow-x-auto py-2" style={{ scrollbarWidth: "none" }}>
                      {STARTERS.map((s) => (
                        <button key={s} onClick={() => setValueEntryText((t) => (t ? `${t}\n${s} ` : `${s} `))} className="shrink-0 text-[10.5px] font-bold rounded-full px-2.5 py-1.5 border active:scale-95 transition" style={{ borderColor: `${hex}45`, color: hex, backgroundColor: `${hex}10` }}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={submitValueEntry}
                      disabled={savingValueEntry || !valueEntryText.trim()}
                      className="relative w-full rounded-xl py-3 font-black text-[14px] flex items-center justify-center gap-2 overflow-hidden disabled:opacity-40 active:scale-[0.97] transition"
                      style={{ background: `linear-gradient(135deg, ${hex}, ${hex}bb)`, color: "#000" }}
                    >
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "vlShimmer 3s ease-in-out infinite" }} />
                      </div>
                      {savingValueEntry ? <Loader2 size={15} className="relative animate-spin" /> : <Bot size={15} className="relative" />}
                      <span className="relative">{savingValueEntry ? "ה-AI חושב..." : "שלח וקבל תגובה"}</span>
                    </button>
                    {valueJustSaved && (
                      <div className="absolute inset-x-0 bottom-14 pointer-events-none flex justify-center gap-3">
                        {["✨", "⭐", "✨", "💫", "✨"].map((s, i) => <span key={i} className="text-lg" style={{ animation: `vlSparkle 0.9s ease-out ${i * 0.08}s both` }}>{s}</span>)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[["all", "כל ההודעות"], ["today", "היום"]].map(([id, label]) => (
                      <button key={id} onClick={() => setEntryFilter(id)} className="text-[11px] font-bold rounded-full px-3 py-1.5 border transition" style={entryFilter === id ? { backgroundColor: `${hex}22`, borderColor: hex, color: hex } : { borderColor: "#3f3f46", color: "#71717a" }}>{label}</button>
                    ))}
                    <span className="mr-auto text-[10px] text-zinc-600 tabular-nums">{shownEntries.length} מוצגות</span>
                  </div>

                  {loadingValueEntries ? (
                    <div className="space-y-2.5">
                      {[0, 1].map((i) => <div key={i} className="h-20 rounded-xl bg-zinc-900" style={{ animation: `vlSkeleton 1.3s ease-in-out ${i * 0.15}s infinite` }} />)}
                    </div>
                  ) : shownEntries.length === 0 && !savingValueEntry ? (
                    <div className="rounded-2xl bg-zinc-900/50 p-7 text-center" style={{ animation: "vlFadeUp 0.35s ease-out both" }}>
                      <div className="w-12 h-12 rounded-2xl mx-auto mb-2.5 flex items-center justify-center" style={{ backgroundColor: `${hex}18`, animation: "fxFloat 3s ease-in-out infinite" }}><Edit2 size={20} style={{ color: hex }} /></div>
                      <div className="text-[13px] font-bold text-zinc-300 mb-0.5">{entryFilter === "today" ? "עוד לא כתבת היום על הערך הזה" : "עוד לא כתבת על הערך הזה"}</div>
                      <div className="text-[11px] text-zinc-600">כל הודעה שתשלח תקבל תגובה אישית מה-AI ותיכנס לסיכום השבועי</div>
                    </div>
                  ) : (
                    <div className="relative pr-4">
                      <div className="absolute right-[5px] top-1 bottom-1 w-0.5 rounded-full" style={{ backgroundColor: `${hex}30` }} />
                      <div className="space-y-3.5">
                        {savingValueEntry && (
                          <div className="rounded-xl p-3 bg-zinc-900" style={{ animation: "vlSkeleton 1.2s ease-in-out infinite" }}>
                            <div className="h-2.5 w-2/3 rounded bg-zinc-800 mb-2" />
                            <div className="h-2.5 w-1/2 rounded bg-zinc-800 mb-2" />
                            <span className="text-[10px] font-bold text-violet-400">ה-AI חושב על מה שכתבת...</span>
                          </div>
                        )}
                        {shownEntries.map((en, i) => {
                          const expanded = expandedEntries[en.id];
                          const long = en.entryText.length > 140;
                          const confirming = confirmDeleteEntryId === en.id;
                          return (
                            <div key={en.id} className="relative" style={{ animation: `vlFadeUp 0.3s ease-out ${Math.min(i, 6) * 0.05}s both` }}>
                              <div className="absolute right-[-15.5px] top-1.5 w-3 h-3 rounded-full border-2 border-black" style={{ backgroundColor: hex }} />
                              <div className="text-[10px] text-zinc-600 mb-1 flex items-center gap-1.5"><span className="rounded-full px-1.5 py-0.5 text-[9px] font-black tabular-nums" style={{ backgroundColor: `${hex}20`, color: hex }}>#{valueEntries.length - valueEntries.findIndex((x) => x.id === en.id)}</span><Clock size={9} /> {fmtDate(en.createdAt)}</div>
                              <div className="rounded-xl p-3" style={{ background: "#0f0f10", boxShadow: `0 0 0 1px ${hex}25 inset` }}>
                                <div className="text-[12.5px] text-zinc-200 leading-relaxed whitespace-pre-wrap" style={!expanded && long ? clamp(3) : undefined}>{en.entryText}</div>
                                {long && (
                                  <button onClick={() => setExpandedEntries((p) => ({ ...p, [en.id]: !p[en.id] }))} className="text-[10.5px] font-bold mt-1" style={{ color: hex }}>{expanded ? "הצג פחות" : "הצג הכל"}</button>
                                )}
                                {en.aiResponse && (
                                  <div className="mt-2.5 rounded-lg p-2.5 flex items-start gap-2" style={{ background: "linear-gradient(120deg, #a855f714, transparent 80%)", borderRight: "3px solid #a855f7" }}>
                                    <span className="relative w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 0 1.5px #a855f7" }}>
                                      <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 1.5px #a855f7", animation: "fxPing 2.4s ease-out infinite" }} />
                                      <Bot size={12} className="text-violet-400" />
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[9px] font-black text-violet-400 mb-0.5">AI</div>
                                      <div className="text-[12px] text-zinc-300 leading-relaxed">{typingEntryId === en.id ? <FxTypewriter text={en.aiResponse} /> : en.aiResponse}</div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-3 mt-2.5">
                                  <button onClick={() => copyText(en.entryText)} className="text-[10px] font-bold text-zinc-500 flex items-center gap-1"><Copy size={10} /> העתק</button>
                                  {en.aiResponse && <button onClick={() => copyText(en.aiResponse)} className="text-[10px] font-bold text-violet-400/80 flex items-center gap-1"><Bot size={10} /> העתק תגובה</button>}
                                  <button
                                    onClick={async () => {
                                      if (!confirming) { setConfirmDeleteEntryId(en.id); return; }
                                      try {
                                        await deleteValueEntry(en.id);
                                        setValueEntries((prev) => prev.filter((x) => x.id !== en.id));
                                        setValuesAllEntries((prev) => prev.filter((x) => x.id !== en.id));
                                        showToast?.("נמחק", "success");
                                      } catch (err) { showToast?.("שגיאה במחיקה", "error"); }
                                      setConfirmDeleteEntryId(null);
                                    }}
                                    className="mr-auto text-[10px] font-bold flex items-center gap-1"
                                    style={{ color: confirming ? "#ef4444" : "#52525b" }}
                                  >
                                    <Trash2 size={10} /> {confirming ? "לחץ שוב למחיקה" : "מחק"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {valueSubView === "stories" && (
                loadingValueStory ? (
                  <div className="space-y-2.5">
                    {[0, 1, 2].map((i) => <div key={i} className="h-6 rounded bg-zinc-900" style={{ width: `${90 - i * 15}%`, animation: `vlSkeleton 1.3s ease-in-out ${i * 0.15}s infinite` }} />)}
                  </div>
                ) : !valueStory ? (
                  <div className="rounded-2xl bg-zinc-900/50 p-7 text-center">
                    <BookOpen size={26} className="mx-auto mb-2" style={{ color: hex, animation: "fxFloat 3s ease-in-out infinite" }} />
                    <div className="text-[13px] font-bold text-zinc-300">עדיין אין סיפור לערך הזה</div>
                    <div className="text-[11px] text-zinc-600 mt-0.5">סיפורים חדשים מתווספים כל הזמן</div>
                  </div>
                ) : (() => {
                  const words = valueStory.split(/\s+/).length;
                  const mins = Math.max(1, Math.ceil(words / 180));
                  const isRead = readStories.includes(openValue.id);
                  const sentences = valueStory.match(/[^.!?]+[.!?]+["”]?\s*|[^.!?]+$/g) || [valueStory];
                  const paras = [];
                  for (let k = 0; k < sentences.length; k += 2) paras.push(sentences.slice(k, k + 2).join("").trim());
                  return (
                    <div key="stories" className="space-y-3" style={{ animation: "fxSlideIn 0.35s ease-out both" }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1"><Clock size={11} /> {mins} דק׳ קריאה</span>
                        {isRead && <span className="text-[10.5px] font-bold rounded-full px-2 py-0.5 flex items-center gap-1" style={{ backgroundColor: "#10b98120", color: "#10b981", animation: "vlPop 0.35s ease-out" }}><Check size={10} /> נקרא</span>}
                        <div className="mr-auto flex items-center gap-1">
                          <button onClick={() => setStoryFontScale((s) => Math.max(0.85, s - 0.1))} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[11px] font-bold">א-</button>
                          <button onClick={() => setStoryFontScale((s) => Math.min(1.4, s + 0.1))} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[14px] font-bold">א+</button>
                        </div>
                      </div>
                      <div className="relative rounded-2xl p-5 pr-6 overflow-hidden" style={{ background: `linear-gradient(150deg, ${hex}14, transparent 60%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${hex}30 inset`, borderRight: `4px solid ${hex}` }}>
                        <div aria-hidden="true" className="absolute top-0 right-3 w-5 h-9 pointer-events-none" style={{ background: isRead ? "#10b981" : hex, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)", boxShadow: `0 0 10px ${isRead ? "#10b981" : hex}88` }} />
                        <div className="absolute top-1 left-3 text-7xl font-black leading-none pointer-events-none select-none" style={{ color: `${hex}18` }}>”</div>
                        <div className="relative flex flex-col items-center mb-4">
                          <div className="w-14 h-[72px] rounded-t-full flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${hex}40, ${hex}10)`, boxShadow: `0 0 0 1.5px ${hex}55 inset, 0 0 22px ${hex}33` }}>
                            <VIcon size={24} style={{ color: hex }} />
                          </div>
                          <div className="text-[10px] font-black uppercase mt-2" style={{ color: hex }}>סיפור על {openValue.title}</div>
                        </div>
                        <div className="relative text-zinc-200 leading-9" style={{ fontSize: `${16 * storyFontScale}px` }}>
                          {paras.map((p, pi) => (
                            <div key={pi}>
                              {pi > 0 && (
                                <div aria-hidden="true" className="flex items-center justify-center gap-2 my-3">
                                  <span className="h-px w-8" style={{ background: `linear-gradient(270deg, ${hex}77, transparent)` }} />
                                  <span className="text-sm" style={{ color: hex }}>❦</span>
                                  <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${hex}77, transparent)` }} />
                                </div>
                              )}
                              <p>{pi === 0 && <span className="float-right text-5xl font-black leading-none ml-2 mt-1" style={{ color: hex }}>{p.charAt(0)}</span>}{pi === 0 ? p.slice(1) : p}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => toggleRead(openValue.id)} className="rounded-xl py-2.5 text-[12px] font-bold border transition active:scale-95" style={isRead ? { borderColor: "#10b98160", color: "#10b981", backgroundColor: "#10b98112" } : { borderColor: "#3f3f46", color: "#a1a1aa" }}>
                          {isRead ? "סימנתי כנקרא" : "סמן כנקרא"}
                        </button>
                        <button onClick={() => { const pre = `קראתי את הסיפור על ${openValue.title} וזה גרם לי לחשוב ש`; openTrack(openValue).then(() => setValueEntryText(pre)); }} className="rounded-xl py-2.5 text-[12px] font-black active:scale-95 transition flex items-center justify-center gap-1.5" style={{ background: `linear-gradient(135deg, ${hex}, ${hex}bb)`, color: "#000" }}>
                          <Edit2 size={12} /> כתוב מה חשבת
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          );
        }

        /* =============================== VALUES HOME =============================== */
        const tableRows = coreValues.filter((v) => engagedWeekIds.includes(v.id)).map((v) => {
          const ents = weekEntries.filter((e) => e.valueId === v.id);
          return { v, count: ents.length, latest: ents[0], meta: metaOf(v) };
        });
        const maxCount = Math.max(1, ...tableRows.map((r) => r.count));
        const engagedCount = engagedWeekIds.length;

        let list = coreValues.filter((v) => !valueSearch.trim() || v.title.includes(valueSearch.trim()));
        if (valueFilter === "today") list = list.filter((v) => (entriesByValue[v.id] || []).some((e) => dayKeyOf(e.createdAt) === todayKeyV));
        if (valueFilter === "notyet") list = list.filter((v) => !(entriesByValue[v.id] || []).some((e) => dayKeyOf(e.createdAt) === todayKeyV));
        list.sort((a, b) => {
          const fa = valueFavorites.includes(a.id) ? 0 : 1;
          const fb = valueFavorites.includes(b.id) ? 0 : 1;
          if (fa !== fb) return fa - fb;
          if (valueSort === "active") return (entriesByValue[b.id] || []).length - (entriesByValue[a.id] || []).length;
          return a.title.localeCompare(b.title, "he");
        });
        const shareText = weeklyValueSummary ? `סיכום ערכי שבועי\n${tableRows.map((r) => `${r.v.title}: ${r.count} הודעות`).join("\n")}\n\n${weeklyValueSummary.reasoning}` : "";

        // ---- data for the growth card and the charts ----
        const fxStats = fxStreakStats(valuesAllEntries);
        const totalEntries = valuesAllEntries.length;
        const lvl = fxLevelFor(totalEntries);
        const touchedCount = Object.keys(entriesByValue).length;
        const perValueWeek = coreValues.map((v) => ({ v, meta: metaOf(v), count: weekEntries.filter((e) => e.valueId === v.id).length }));
        const weekMax = Math.max(1, ...perValueWeek.map((x) => x.count));
        const radarItems = perValueWeek.map((x) => ({ label: x.v.title.split(" ")[0], value: x.count / weekMax, hex: x.meta.hex }));
        const donutSegs = perValueWeek.filter((x) => x.count > 0).map((x) => ({ value: x.count, hex: x.meta.hex }));
        const perDayCounts = last7.map((d) => weekEntries.filter((e) => dayKeyOf(e.createdAt) === d.key).length);
        const dayMax = Math.max(1, ...perDayCounts);
        const topValueId = perValueWeek.reduce((best, x) => (x.count > (best?.count || 0) ? x : best), null)?.v.id;

        return (
          <div className="space-y-3 fx-stagger">
            <div className="relative rounded-3xl overflow-hidden p-5 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #a855f730, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #a855f745 inset", animation: "vlFadeUp 0.35s ease-out both" }}>
              <FxFrame hex="#a855f7" hex2="#ec4899" />
              <HudCorners hex="#a855f7" corners={4} inset={10} />
              {[["top-3 right-1/3", 8, 0], ["top-10 left-8", 6, 1.2], ["bottom-8 right-14", 7, 2.1], ["top-16 right-5", 5, 0.6]].map(([pos, sz, dl], i) => (
                <span key={i} aria-hidden="true" className={`absolute ${pos} pointer-events-none leading-none`} style={{ fontSize: sz, color: i % 2 ? "#ec4899" : "#fff", animation: `fxTwinkle ${3 + (i % 3)}s ease-in-out ${dl}s infinite` }}>✦</span>
              ))}
              <div aria-hidden="true" className="absolute top-0 left-8 right-8 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
              <div aria-hidden="true" className="absolute bottom-0 left-6 right-6 h-[2px] pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, #a855f7, #ec4899, transparent)", animation: "fxBreathe 4s ease-in-out infinite" }} />
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="absolute w-1 h-1 rounded-full pointer-events-none" style={{ backgroundColor: "#a855f7", left: `${(i * 23 + 8) % 90}%`, top: `${(i * 31 + 10) % 55}%`, animation: `vlDust ${4 + i}s ease-in-out ${i * 0.3}s infinite` }} />
              ))}
              <div className="relative flex items-center gap-3.5">
                <div className="relative w-14 h-14 shrink-0">
                  <div className="absolute -inset-1.5 rounded-2xl opacity-50" style={{ background: "conic-gradient(from 0deg, #a855f7, transparent 35%, transparent 65%, #a855f7)", animation: "vlConic 6s linear infinite" }} />
                  <div className="absolute inset-0 rounded-2xl bg-black border-2 border-violet-500/70 flex items-center justify-center" style={{ boxShadow: "0 0 18px 2px #a855f750" }}>
                    <Heart size={24} className="text-violet-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-black" style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #c084fc, #ec4899)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>עבודה ערכית</div>
                  <div className="w-10 h-0.5 rounded-full my-1" style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }} />
                  <div className="text-[12px] text-zinc-500 leading-snug">כתוב על ערך, קבל תגובה מה-AI, וקרא סיפורים</div>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <Flame size={Math.round(22 + Math.min(12, streak * 1.5))} className={streak > 0 ? "text-orange-400" : "text-zinc-700"} style={streak > 0 ? { animation: `vlFlame ${Math.max(0.6, 1.6 - streak * 0.08).toFixed(2)}s ease-in-out infinite`, filter: `drop-shadow(0 0 ${6 + Math.min(14, streak * 2)}px #f97316aa)` } : undefined} />
                  <AnimatedNumber value={streak} className="text-lg font-black text-zinc-100 tabular-nums leading-none" />
                  <span className="text-[9px] text-zinc-500 font-bold">ימי רצף</span>
                </div>
              </div>

              <div className="relative flex items-center justify-between gap-1 mt-4">
                {last7.map((d) => (
                  <div key={d.key} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={d.has ? { background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff", boxShadow: "0 0 8px #a855f780", animation: d.isToday ? "vlPop 0.4s ease-out" : undefined } : { backgroundColor: "#18181b", boxShadow: d.isToday ? "0 0 0 1.5px #a855f760 inset" : undefined }}>
                      {d.has && <Check size={12} />}
                    </div>
                    <span className={`text-[9px] font-bold ${d.isToday ? "text-violet-400" : "text-zinc-600"}`}>{d.label}</span>
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-2 gap-2 mt-4">
                <div className="rounded-xl bg-black/30 p-2.5 flex items-center gap-2.5">
                  <div className="relative w-9 h-9 shrink-0">
                    <svg viewBox="0 0 36 36" className="-rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={writtenToday ? "#10b981" : "#a855f7"} strokeWidth="3.5" strokeDasharray={`${writtenToday ? 94 : 0} 94`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease-out" }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">{writtenToday ? <Check size={14} className="text-emerald-400" /> : <span className="text-[10px] font-black text-violet-400">0</span>}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-black text-zinc-200">יעד יומי</div>
                    <div className="text-[10px] text-zinc-500">{writtenToday ? `${todayCount} הודעות היום` : "עוד לא כתבת היום"}</div>
                  </div>
                </div>
                <div className="rounded-xl bg-black/30 p-2.5">
                  <div className="flex items-center justify-between text-[11px] font-black text-zinc-200 mb-1.5">
                    <span>יעד שבועי</span>
                    <span className="text-violet-400 tabular-nums">{Math.min(engagedCount, 3)}/3 ערכים</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (engagedCount / 3) * 100)}%`, background: "linear-gradient(90deg, #a855f7, #ec4899)", boxShadow: "0 0 8px #a855f7" }} />
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-1">{engagedCount >= 3 ? "יעד השבוע הושג" : "כתוב על 3 ערכים שונים השבוע"}</div>
                </div>
              </div>
            </div>

            {suggested && (
              <button
                onClick={() => openTrack(suggested)}
                className="relative w-full text-right rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden active:scale-[0.98] transition"
                style={{ background: `linear-gradient(120deg, ${metaOf(suggested).hex}22, transparent 75%), var(--card-base-alt)`, boxShadow: `0 0 0 1.5px ${metaOf(suggested).hex}50 inset`, "--vc": `${metaOf(suggested).hex}80`, animation: !writtenToday ? "vlPulse 2.4s ease-in-out infinite" : "vlFadeUp 0.35s ease-out 0.05s both" }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation: "vlShimmer 4s ease-in-out infinite" }} />
                </div>
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${metaOf(suggested).hex}22`, boxShadow: `0 0 0 1.5px ${metaOf(suggested).hex}55 inset` }}>
                  {(() => { const SI = metaOf(suggested).icon; return <SI size={18} style={{ color: metaOf(suggested).hex }} />; })()}
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase" style={{ color: metaOf(suggested).hex }}>{writtenToday ? "ערך מומלץ להיום" : "עוד לא כתבת היום · מומלץ"}</div>
                  <div className="text-[14px] font-black text-zinc-100">{suggested.title}</div>
                  <div className="text-[11px] text-zinc-500">{lastWritten(suggested.id) ? `נכתב לאחרונה: ${fmtDate(new Date(lastWritten(suggested.id)).toISOString())}` : "עוד לא כתבת על הערך הזה"}</div>
                </div>
                <ChevronLeft size={16} className="relative shrink-0" style={{ color: metaOf(suggested).hex }} />
              </button>
            )}

            <HomeDivider hex="#a855f7" />

            <div className="relative rounded-2xl overflow-hidden p-4" style={{ background: `linear-gradient(135deg, ${lvl.cur.hex}1a, transparent 70%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${lvl.cur.hex}40 inset` }}>
              <HudCorners hex={lvl.cur.hex} corners={2} inset={8} />
              <div className="relative flex items-center gap-3">
                <FxRing size={54} stroke={4} pct={lvl.pct} hex={lvl.cur.hex}>
                  <Trophy size={18} style={{ color: lvl.cur.hex }} />
                </FxRing>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase" style={{ color: lvl.cur.hex }}>רמה {lvl.idx + 1}</div>
                  <div className="text-[16px] font-black text-zinc-50">{lvl.cur.title}</div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-1.5">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lvl.pct}%`, background: `linear-gradient(90deg, ${lvl.cur.hex}, ${(lvl.next || lvl.cur).hex})`, boxShadow: `0 0 8px ${lvl.cur.hex}` }} />
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">{lvl.next ? `עוד ${lvl.next.min - totalEntries} הודעות לרמה "${lvl.next.title}"` : "הגעת לרמה הגבוהה ביותר"} · לפי 30 הימים האחרונים</div>
                </div>
              </div>
              <div className="relative grid grid-cols-3 gap-2 mt-3">
                {[["הודעות", totalEntries], ["ערכים שנגעת בהם", touchedCount], ["רצף שיא", fxStats.best]].map(([label, val]) => (
                  <div key={label} className="rounded-xl bg-black/30 py-2 text-center">
                    <AnimatedNumber value={val} className="text-lg font-black text-zinc-100 tabular-nums" />
                    <div className="text-[9px] text-zinc-500 font-bold">{label}</div>
                  </div>
                ))}
              </div>
              <div className="relative flex items-center justify-between mt-3.5 px-1">
                {[3, 7, 14, 30].map((m) => {
                  const got = fxStats.best >= m;
                  return (
                    <div key={m} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={got ? { background: "linear-gradient(135deg, #f97316, #ec4899)", boxShadow: "0 0 12px #f9731699", animation: "fxScaleIn 0.5s ease-out both" } : { backgroundColor: "#18181b", boxShadow: "0 0 0 1px #3f3f46 inset" }}>
                        {got ? <Flame size={15} className="text-white" /> : <Lock size={12} className="text-zinc-600" />}
                      </div>
                      <span className={`text-[9px] font-black ${got ? "text-orange-400" : "text-zinc-600"}`}>{m} ימים</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden" style={{ background: "var(--card-base)", boxShadow: "0 0 0 1.5px #a855f735 inset", animation: "vlFadeUp 0.35s ease-out 0.1s both" }}>
              {[["top-2 right-2", "border-t-2 border-r-2"], ["top-2 left-2", "border-t-2 border-l-2"]].map(([pos, border], i) => (
                <div key={i} className={`absolute ${pos} w-3.5 h-3.5 ${border} border-violet-500/50 pointer-events-none`} style={{ animation: `vlCorner 3s ease-in-out ${i * 0.5}s infinite` }} />
              ))}
              <div className="flex items-center gap-2 p-3.5" style={{ background: "linear-gradient(120deg, #a855f722, transparent 80%)" }}>
                <ClipboardCheck size={15} className="text-violet-400 shrink-0" />
                <div className="flex-1 text-[13px] font-black text-zinc-100">סיכום שבועי</div>
                <span className="text-[10px] text-zinc-500 tabular-nums">{engagedCount} ערכים · {weekEntries.length} הודעות</span>
                <button onClick={() => setSummaryCollapsed((s) => !s)} className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-zinc-500">
                  {summaryCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                </button>
              </div>
              {!summaryCollapsed && (
                <div className="p-3.5 pt-1 space-y-3">
                  {tableRows.length === 0 ? (
                    <div className="rounded-xl bg-black/30 p-5 text-center">
                      <Edit2 size={20} className="text-violet-400 mx-auto mb-1.5" />
                      <div className="text-[12px] font-bold text-zinc-300">הטבלה תתמלא ברגע שתכתוב על ערך</div>
                      <div className="text-[10.5px] text-zinc-600 mt-0.5">רק ערכים שכתבת עליהם ושקיבלו תגובה נכנסים לטבלה ולמשוב</div>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-zinc-800">
                      <div className="grid text-[10px] font-black text-violet-300 px-2.5 py-2" style={{ gridTemplateColumns: "1.1fr 1fr 2fr", background: "linear-gradient(90deg, #a855f725, #a855f708)" }}>
                        <span>ערך</span><span>הודעות</span><span>תובנת AI</span>
                      </div>
                      {tableRows.map((r, i) => {
                        const RIcon = r.meta.icon;
                        const insight = r.latest?.aiResponse ? (r.latest.aiResponse.match(/^[^.!?]*[.!?]?/)?.[0] || r.latest.aiResponse) : "אין עדיין תגובה";
                        return (
                          <button key={r.v.id} onClick={() => openTrack(r.v)} className="w-full grid items-center px-2.5 py-2.5 text-right gap-2 active:opacity-70 transition" style={{ gridTemplateColumns: "1.1fr 1fr 2fr", backgroundColor: i % 2 === 0 ? "#0a0a0a" : "#111113", animation: `vlFadeUp 0.3s ease-out ${i * 0.05}s both` }}>
                            <span className="flex items-center gap-1.5 min-w-0">
                              <RIcon size={12} className="shrink-0" style={{ color: r.meta.hex }} />
                              <span className="text-[12px] font-black truncate" style={{ color: r.meta.hex }}>{r.v.title}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="text-[12px] font-black text-zinc-200 tabular-nums w-4">{r.count}</span>
                              <span className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${(r.count / maxCount) * 100}%`, backgroundColor: r.meta.hex }} /></span>
                            </span>
                            <span className="text-[10.5px] text-zinc-400 leading-snug" style={clamp(2)}>{insight}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {weeklyValueSummary ? (
                    <div className="rounded-xl p-3" style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%)", boxShadow: "0 0 0 1.5px #a855f740 inset", animation: "vlFadeUp 0.3s ease-out both" }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot size={13} className="text-violet-400" />
                        <span className="text-[10px] font-black uppercase text-violet-400 flex-1">משוב AI שבועי</span>
                        <button onClick={() => copyText(shareText)} className="text-zinc-500"><Copy size={12} /></button>
                        <button onClick={getWeeklyValueSummary} disabled={loadingWeeklyValueSummary} className="text-zinc-500 disabled:opacity-50">{loadingWeeklyValueSummary ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}</button>
                      </div>
                      <div className="text-[12px] text-zinc-300 leading-relaxed">{weeklyValueSummary.reasoning}</div>
                      {weeklyValueSummary.focusAreas?.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[10px] font-black text-emerald-400 mb-1">התמקדת ב</div>
                          <div className="flex flex-wrap gap-1">{weeklyValueSummary.focusAreas.map((a) => <span key={a} className="text-[10.5px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: "#10b98120", color: "#34d399" }}>{a}</span>)}</div>
                        </div>
                      )}
                      {weeklyValueSummary.missedAreas?.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[10px] font-black text-amber-400 mb-1">כדאי לתת תשומת לב</div>
                          <div className="flex flex-wrap gap-1">{weeklyValueSummary.missedAreas.map((a) => <span key={a} className="text-[10.5px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: "#f59e0b20", color: "#fbbf24" }}>{a}</span>)}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={getWeeklyValueSummary} disabled={loadingWeeklyValueSummary || tableRows.length === 0} className="w-full rounded-xl py-2.5 text-[12px] font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 active:scale-[0.97] transition" style={{ color: "#c084fc", backgroundColor: "#a855f712", boxShadow: "0 0 0 1.5px #a855f740 inset" }}>
                      {loadingWeeklyValueSummary ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />}
                      {loadingWeeklyValueSummary ? "ה-AI מנתח את השבוע..." : "קבל משוב AI שבועי מלא"}
                    </button>
                  )}
                </div>
              )}
            </div>

            <HomeDivider hex="#ec4899" />
            <FxSectionHead icon={Activity} title="מאזן ערכים" hex="#a855f7" right={<span className="text-[10px] text-zinc-600 font-bold">7 ימים אחרונים</span>} />
            <div className="relative rounded-2xl overflow-hidden p-4" style={{ background: "var(--card-base)", boxShadow: "0 0 0 1.5px #a855f730 inset" }}>
              {weekEntries.length === 0 ? (
                <div className="text-center py-5">
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-violet-500/15" style={{ animation: "fxFloat 3s ease-in-out infinite" }}><Activity size={20} className="text-violet-400" /></div>
                  <div className="text-[12px] font-bold text-zinc-300">הגרפים יתמלאו ברגע שתכתוב על ערך</div>
                  <div className="text-[10.5px] text-zinc-600 mt-0.5">מאזן בין הערכים, התפלגות ופעילות יומית</div>
                </div>
              ) : (
                <>
                  <FxRadar items={radarItems} hex="#a855f7" />
                  <div className="flex items-center gap-4 mt-3">
                    <FxDonut segments={donutSegs} size={112} stroke={14}>
                      <AnimatedNumber value={weekEntries.length} className="text-2xl font-black text-zinc-50 tabular-nums leading-none" />
                      <span className="text-[9px] text-zinc-500 font-bold mt-0.5">הודעות</span>
                    </FxDonut>
                    <div className="flex-1 min-w-0 space-y-1">
                      {perValueWeek.filter((x) => x.count > 0).map((x) => (
                        <div key={x.v.id} className="flex items-center gap-1.5 text-[10.5px]">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: x.meta.hex }} />
                          <span className="flex-1 truncate text-zinc-300">{x.v.title}</span>
                          <span className="tabular-nums text-zinc-500 font-bold">{x.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-16 mt-4">
                    {last7.map((d, i) => (
                      <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full rounded-t-md" style={{ height: `${Math.max(6, (perDayCounts[i] / dayMax) * 100)}%`, background: d.isToday ? "linear-gradient(180deg, #ec4899, #a855f7)" : "linear-gradient(180deg, #a855f7aa, #a855f733)", transformOrigin: "bottom", animation: `fxGrow 0.6s ease-out ${i * 0.06}s both`, opacity: perDayCounts[i] ? 1 : 0.35 }} />
                        <span className="text-[9px] text-zinc-600 font-bold">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <FxSectionHead icon={Heart} title="הערכים שלי" hex="#ec4899" right={<span className="text-[10px] text-zinc-600 font-bold tabular-nums">{list.length}</span>} />

            <div className="relative">
              <input value={valueSearch} onChange={(ev) => setValueSearch(ev.target.value)} placeholder="חיפוש ערך..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-8 py-2 text-[13px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              <Compass size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              {valueSearch && <button onClick={() => setValueSearch("")} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600"><X size={14} /></button>}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {[["all", "הכל"], ["today", "כתבתי היום"], ["notyet", "טרם כתבתי"]].map(([id, label]) => (
                <button key={id} onClick={() => setValueFilter(id)} className="shrink-0 text-[11px] font-bold rounded-full px-3 py-1.5 border transition" style={valueFilter === id ? { backgroundColor: "#a855f722", borderColor: "#a855f7", color: "#c084fc" } : { borderColor: "#3f3f46", color: "#71717a" }}>{label}</button>
              ))}
              <button onClick={() => setValueSort((s) => (s === "name" ? "active" : "name"))} className="shrink-0 mr-auto text-[11px] font-bold rounded-full px-3 py-1.5 border border-zinc-700 text-zinc-400">
                {valueSort === "name" ? "לפי שם" : "לפי פעילות"}
              </button>
            </div>
            {valueRecent.length > 0 && !valueSearch.trim() && (
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {valueRecent.map((rid) => {
                  const rv = coreValues.find((x) => x.id === rid);
                  if (!rv) return null;
                  const RM = metaOf(rv);
                  return (
                    <button key={rid} onClick={() => openTrack(rv)} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border" style={{ borderColor: `${RM.hex}45`, backgroundColor: `${RM.hex}10` }}>
                      <Clock size={10} style={{ color: RM.hex }} />
                      <span className="text-[11px] font-bold" style={{ color: RM.hex }}>{rv.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {list.length === 0 ? (
              <div className="rounded-2xl bg-zinc-900/50 p-7 text-center text-[13px] text-zinc-500">לא נמצאו ערכים שמתאימים</div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {list.map((v, i) => {
                  const meta = metaOf(v);
                  const CardIcon = meta.icon;
                  const ents = entriesByValue[v.id] || [];
                  const doneToday = ents.some((e) => dayKeyOf(e.createdAt) === todayKeyV);
                  const isFav = valueFavorites.includes(v.id);
                  const isRead = readStories.includes(v.id);
                  const weekCount = weekEntries.filter((e) => e.valueId === v.id).length;
                  const dotDays = last7.map((d) => ents.some((e) => dayKeyOf(e.createdAt) === d.key));
                  const isTop = topValueId === v.id;
                  return (
                    <div key={v.id} {...fxTilt(7)} className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(150deg, ${meta.hex}24, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${meta.hex}38 inset`, animation: `vlFadeUp 0.35s ease-out ${i * 0.05}s backwards`, ...fxTiltStyle }}>
                      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-[3px] pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${meta.hex}, transparent)`, animation: "fxBar 3.5s ease-in-out infinite" }} />
                      <CardIcon aria-hidden="true" size={110} className="absolute -bottom-5 -left-4 pointer-events-none" style={{ color: meta.hex, opacity: 0.07 }} />
                      <div className="absolute -left-5 -bottom-5 w-16 h-16 rounded-full blur-2xl opacity-25 pointer-events-none" style={{ backgroundColor: meta.hex }} />
                      <FxSpot />
                      {isFav && (
                        <div aria-hidden="true" className="absolute top-0 left-0 w-9 h-9 pointer-events-none" style={{ background: "linear-gradient(135deg, #fbbf24 0%, #fbbf24 50%, transparent 50%)" }}>
                          <Star size={9} className="absolute top-1 left-1 text-black" fill="#000" />
                        </div>
                      )}
                      <button onClick={() => openTrack(v)} className="relative w-full text-right p-3.5 pb-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <FxRing size={48} stroke={3} pct={Math.min(100, (weekCount / 3) * 100)} hex={meta.hex}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(145deg, ${meta.hex}35, ${meta.hex}12)`, boxShadow: `0 0 0 1.5px ${meta.hex}55 inset` }}>
                              <CardIcon size={17} style={{ color: meta.hex }} />
                            </div>
                          </FxRing>
                          <div className="flex items-center gap-1">
                            {isTop && <span className="w-5 h-5 rounded-full flex items-center justify-center" title="הערך הפעיל ביותר השבוע" style={{ background: "linear-gradient(135deg, #fde047, #f59e0b)", boxShadow: "0 0 8px #f59e0b99", animation: "vlPop 0.5s ease-out" }}><Trophy size={10} className="text-black" /></span>}
                            {doneToday && <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center" style={{ animation: "vlPop 0.4s ease-out" }}><Check size={11} className="text-black" /></span>}
                            <span className="text-[10px] font-bold rounded-full px-2 py-0.5 tabular-nums" style={{ backgroundColor: ents.length ? `${meta.hex}22` : "#27272a", color: ents.length ? meta.hex : "#52525b" }}>{ents.length}</span>
                          </div>
                        </div>
                        <span className="text-[14px] font-black" style={{ backgroundImage: `linear-gradient(90deg, #ffffff, ${meta.hex})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v.title}</span>
                        <span className="text-[10px] text-zinc-500 leading-snug" style={clamp(2)}>{v.body}</span>
                        <div className="flex items-center gap-1 mt-0.5" aria-label="ימים עם הודעות ב-7 הימים האחרונים">
                          {dotDays.map((on, di) => <span key={di} className="rounded-full" style={{ width: 5, height: 5, backgroundColor: on ? meta.hex : "#27272a", boxShadow: on ? `0 0 5px ${meta.hex}` : "none" }} />)}
                        </div>
                      </button>
                      <div className="relative flex items-center justify-between px-3.5 pb-3">
                        <button onClick={() => openStory(v)} className="flex items-center gap-1 text-[10.5px] font-bold" style={{ color: meta.hex }}>
                          <BookOpen size={11} /> {isRead ? "נקרא" : "סיפור"}
                        </button>
                        <button onClick={(ev) => toggleFav(v.id, ev)}><Star size={13} className={isFav ? "text-amber-400" : "text-zinc-700"} fill={isFav ? "#fbbf24" : "none"} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
      </>
    </div>
    </>
  );
}

/* ============================== CALENDAR TAB ============================== */

function CalendarTab({ officialEvents, personalLogs, addPersonalLog, removePersonalLog, updatePersonalLog, profile, onSetGibushDate, userId, trainingContent, resetSignal, scrollToTop }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [addPopup, setAddPopup] = useState(null); // { time }
  const [newTitle, setNewTitle] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [bankPickerOpen, setBankPickerOpen] = useState(false);
  const [bankPickerCat, setBankPickerCat] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [gibushOpen, setGibushOpen] = useState(false);
  const [gibushInput, setGibushInput] = useState(profile?.gibushDate || "");
  const [gibushTypeInput, setGibushTypeInput] = useState(profile?.gibushType || "");
  const [drag, setDrag] = useState(null); // { id, startClientY, startMinutes, liveMinutes, moved }
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [calView, setCalView] = useState("month"); // 'month' | 'day' - month is the landing view
  useEffect(() => { scrollToTop?.(); }, [calView]);
  useEffect(() => { if (resetSignal) setCalView("month"); }, [resetSignal]);
  const dayScrollRef = useRef(null);
  const [monthCursor, setMonthCursor] = useState(() => new Date());

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }), [weekStart]);
  const todayKey = toKey(new Date());
  const selKey = toKey(selectedDay);

  useEffect(() => {
    if (calView === "day" && dayScrollRef.current) {
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const targetTop = (nowMinutes / 60) * ROW_HEIGHT - 100; // center-ish, minus a little offset
      dayScrollRef.current.scrollTop = Math.max(0, targetTop);
    }
  }, [calView, selKey]);

  const eventsByDay = useMemo(() => {
    const map = {};
    officialEvents.forEach((e) => { (map[e.date] ||= []).push({ ...e, source: "official" }); });
    personalLogs.forEach((e) => { (map[e.date] ||= []).push({ ...e, source: "personal" }); });
    return map;
  }, [officialEvents, personalLogs]);
  const dayEvents = eventsByDay[selKey] || [];

  function openAdd(hour) {
    const start = `${String(hour).padStart(2, "0")}:00`;
    const end = `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`;
    setAddPopup({ time: start });
    setNewTitle(""); setNewDetail(""); setNewEndTime(end);
  }
  function saveAdd() {
    if (!newTitle.trim() || !addPopup) return;
    addPersonalLog({ id: Date.now(), date: selKey, time: addPopup.time, endTime: newEndTime || null, title: newTitle.trim(), detail: newDetail.trim(), category: newCategory, location: newLocation.trim() });
    setAddPopup(null);
    setNewCategory("");
    setNewLocation("");
  }

  function onPointerDownEvent(e, ev) {
    if (ev.source !== "personal") return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ id: ev.id, ev, startClientY: e.clientY, startMinutes: timeToMinutes(ev.time), liveMinutes: timeToMinutes(ev.time), moved: false });
  }
  function onPointerMoveGrid(e) {
    if (!drag) return;
    const deltaY = e.clientY - drag.startClientY;
    const deltaMinutes = (deltaY / ROW_HEIGHT) * 60;
    setDrag((d) => ({ ...d, liveMinutes: d.startMinutes + deltaMinutes, moved: d.moved || Math.abs(deltaY) > 6 }));
  }
  async function onPointerUpGrid() {
    if (!drag) return;
    if (!drag.moved) { setSelectedEvent(drag.ev); setDrag(null); return; }
    const newTime = minutesToTime(drag.liveMinutes);
    if (newTime !== minutesToTime(drag.startMinutes)) await updatePersonalLog(drag.id, { time: newTime });
    setDrag(null);
  }

  if (calView === "month") {
    return (
      <div className="flex flex-col h-full p-4 tech-grid">
        <div className="flex items-center justify-between mb-4 shrink-0 tech-corners border border-emerald-500/20 rounded-xl px-3 py-2.5 bg-black/60">
          <button onClick={() => setMonthCursor((c) => { const d = new Date(c); d.setMonth(d.getMonth() - 1); return d; })} className="text-zinc-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-zinc-900">
            <ChevronRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-lg font-black text-zinc-100 font-mono">{monthCursor.toLocaleDateString("he-IL", { month: "long", year: "numeric" })}</div>
          </div>
          <button onClick={() => setMonthCursor((c) => { const d = new Date(c); d.setMonth(d.getMonth() + 1); return d; })} className="text-zinc-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-zinc-900">
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1.5 shrink-0">
          {WEEKDAYS_HE.map((w) => (
            <div key={w} className="text-center text-[11px] font-bold text-emerald-500/70 py-1 font-mono">{w}</div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {(() => {
            const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
            const startOffset = first.getDay();
            const daysInMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0).getDate();
            const cells = [];
            for (let i = 0; i < startOffset; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), d));
            return (
              <div className="grid grid-cols-7 gap-1.5">
                {cells.map((d, i) => {
                  if (!d) return <div key={`e${i}`} />;
                  const key = toKey(d);
                  const isSel = key === selKey;
                  const isToday = key === todayKey;
                  const dayEventList = eventsByDay[key] || [];
                  const hasOfficial = dayEventList.some((e) => e.source === "official");
                  const hasPersonal = dayEventList.some((e) => e.source === "personal");
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedDay(d);
                        setWeekStart(getWeekStart(d));
                        setCalView("day");
                      }}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition relative border ${
                        isSel ? "bg-emerald-500 text-black border-emerald-400" : isToday ? "bg-black border-emerald-500/60 text-emerald-400 glow-pulse tech-corners" : "bg-black/40 border-zinc-800/80 text-zinc-300 hover:border-zinc-600"
                      }`}
                      style={isToday && !isSel ? glowVars("#10b981") : undefined}
                    >
                      <span className="text-base font-bold font-mono tabular-nums">{d.getDate()}</span>
                      {(hasOfficial || hasPersonal) && (
                        <div className="flex gap-0.5">
                          {hasOfficial && <span className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-black" : "bg-sky-400"}`} />}
                          {hasPersonal && <span className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-black" : "bg-amber-400"}`} />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-zinc-800 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono"><span className="w-2 h-2 rounded-full bg-sky-400" /> אימון רשמי</div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono"><span className="w-2 h-2 rounded-full bg-amber-400" /> אימון אישי</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex items-center justify-between border-b border-emerald-500/20 shrink-0 bg-black/40">
        <button onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; })} className="text-zinc-400 hover:text-emerald-400 p-1">
          <ChevronRight size={18} />
        </button>
        <button onClick={() => { setMonthCursor(selectedDay); setCalView("month"); }} className="flex items-center gap-1.5 text-sm font-bold text-zinc-300 hover:text-emerald-400 transition px-2 py-1 rounded-lg font-mono">
          <CalendarDays size={15} className="text-emerald-500" />
          {selectedDay.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
        </button>
        <button onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; })} className="text-zinc-400 hover:text-emerald-400 p-1">
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="flex px-2 py-2 gap-1 border-b border-zinc-800 shrink-0 tech-grid">
        {days.map((d) => {
          const key = toKey(d);
          const isSel = key === selKey;
          const isToday = key === todayKey;
          const hasEvents = (eventsByDay[key] || []).length > 0;
          return (
            <button
              key={key}
              onClick={() => setSelectedDay(d)}
              className={`flex-1 rounded-lg py-1.5 flex flex-col items-center gap-0.5 transition border ${isSel ? "bg-emerald-500 text-black border-emerald-400" : isToday ? "bg-black text-emerald-400 border-emerald-500/50" : "text-zinc-400 border-transparent hover:border-zinc-700"}`}
            >
              <span className="text-[10px] font-bold font-mono">{WEEKDAYS_HE[d.getDay()]}</span>
              <span className="text-sm font-black font-mono tabular-nums">{d.getDate()}</span>
              <span className={`w-1 h-1 rounded-full ${hasEvents ? (isSel ? "bg-black" : "bg-amber-400") : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      {allowedGibushTypes(profile).length > 0 && (
        <div className="px-3 pt-2.5 pb-1.5 flex justify-center shrink-0">
          {profile?.gibushDate ? (
            <button
              onClick={() => { setGibushInput(profile.gibushDate); setGibushTypeInput(profile.gibushType); setGibushOpen(true); }}
              className="rounded-full border-2 px-3.5 py-1.5 text-[13px] font-bold flex items-center gap-1.5 glow-pulse bg-black active:scale-95 transition"
              style={{ ...glowVars((GIBUSH_TYPE_COLORS[profile.gibushType] || {}).hex || "#f59e0b", (GIBUSH_TYPE_COLORS[profile.gibushType] || {}).hex2), borderColor: (GIBUSH_TYPE_COLORS[profile.gibushType] || {}).hex || "#f59e0b", color: (GIBUSH_TYPE_COLORS[profile.gibushType] || {}).hex || "#f59e0b" }}
            >
              <Target size={11} />
              {profile.gibushType}: {new Date(`${profile.gibushDate}T00:00:00`).toLocaleDateString("he-IL")}
            </button>
          ) : (
            <button
              onClick={() => { setGibushInput(""); setGibushTypeInput(""); setGibushOpen(true); }}
              className="rounded-full bg-amber-500/10 border border-amber-500/40 px-3.5 py-1.5 text-[13px] font-bold text-amber-400 flex items-center gap-1.5 active:scale-95 transition glow-pulse"
              style={glowVars("#f59e0b")}
            >
              <Target size={12} /> קבע/י מועד גיבוש
            </button>
          )}
        </div>
      )}

      <div ref={dayScrollRef} className="flex-1 overflow-y-auto" onPointerMove={onPointerMoveGrid} onPointerUp={onPointerUpGrid} onPointerCancel={onPointerUpGrid}>
        <div className="relative mx-3" style={{ height: 24 * ROW_HEIGHT }}>
          {HOURS.map((h) => (
            <button key={h} onClick={() => openAdd(h)} className="absolute inset-x-0 border-t border-zinc-800/60 hover:bg-zinc-900/40 transition-colors" style={{ top: h * ROW_HEIGHT, height: ROW_HEIGHT }}>
              <span className="absolute left-1 top-0.5 text-[12px] text-zinc-600 w-9 text-center">{String(h).padStart(2, "0")}:00</span>
            </button>
          ))}
          {dayEvents.map((ev) => {
            const isDragging = drag && drag.id === ev.id;
            const minutes = isDragging ? drag.liveMinutes : timeToMinutes(ev.time);
            const top = (minutes / 60) * ROW_HEIGHT;
            const isOfficial = ev.source === "official";
            const durationMinutes = ev.endTime ? Math.max(15, timeToMinutes(ev.endTime) - timeToMinutes(ev.time)) : 60;
            const blockHeight = Math.max(44, (durationMinutes / 60) * ROW_HEIGHT);
            return (
              <div
                key={ev.id}
                onPointerDown={isOfficial ? undefined : (e) => onPointerDownEvent(e, ev)}
                onClick={isOfficial ? (e) => { e.stopPropagation(); setSelectedEvent(ev); } : undefined}
                className={`absolute right-0 left-12 rounded-lg px-3 py-1.5 overflow-hidden select-none transition-shadow ${
                  isOfficial ? "bg-sky-500/15 border border-sky-500/40 text-sky-100 cursor-pointer" : "bg-amber-500/15 border border-amber-500/40 text-amber-100 cursor-grab active:cursor-grabbing"
                } ${isDragging ? "z-20 shadow-lg shadow-black/50 scale-[1.02] opacity-90" : "z-10"}`}
                style={{ top, height: blockHeight }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{ev.title}</div>
                    <div className="text-[12px] opacity-70 flex items-center gap-1">
                      {ev.time}{ev.endTime ? `-${ev.endTime}` : ""}{ev.location ? ` · ${ev.location}` : ""}
                    </div>
                  </div>
                  {!isOfficial && (
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(ev); }}
                      className="shrink-0 w-5 h-5 rounded-full bg-black/30 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {addPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => { setAddPopup(null); setBankPickerOpen(false); setBankPickerCat(null); }}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-base font-bold text-zinc-200 mb-3">אירוע חדש</div>

            <button onClick={() => setBankPickerOpen((o) => !o)} className="w-full mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold py-2 flex items-center justify-center gap-1.5">
              <BarChart3 size={14} /> {bankPickerOpen ? "סגור בחירה מהמאגר" : "בחר אימון מהמאגר"}
            </button>

            {bankPickerOpen && (
              <div className="mb-3 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 max-h-56 overflow-y-auto">
                {!bankPickerCat ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {TRAINING_BANK.map((b) => (
                      <button key={b.id} onClick={() => setBankPickerCat(b.id)} className="rounded-lg bg-zinc-950 border border-zinc-800 py-2 px-2 text-[12px] font-bold text-zinc-300 flex flex-col items-center gap-1 hover:border-emerald-500/40">
                        <b.icon size={14} className={b.color} /> {b.title}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setBankPickerCat(null)} className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 mb-2">
                      <ChevronRight size={12} /> חזרה לקטגוריות
                    </button>
                    {(() => {
                      const items = (trainingContent || []).filter((t) => t.subcategory === bankPickerCat);
                      return items.length === 0 ? (
                        <div className="text-[11px] text-zinc-600 text-center py-3">אין עדיין אימונים בקטגוריה זו</div>
                      ) : (
                        <div className="space-y-1">
                          {items.map((it) => (
                            <button
                              key={it.id}
                              onClick={() => {
                                setNewTitle(it.title);
                                setNewDetail(it.body || "");
                                setNewCategory(bankPickerCat);
                                setBankPickerOpen(false);
                                setBankPickerCat(null);
                              }}
                              className="w-full text-right rounded-lg bg-zinc-950 border border-zinc-800 px-2.5 py-2 text-[12px] font-bold text-zinc-300 hover:border-emerald-500/40"
                            >
                              {it.title}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 font-semibold">משעה</label>
                <input type="time" value={addPopup.time} onChange={(e) => setAddPopup({ ...addPopup, time: e.target.value })} className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-zinc-500 font-semibold">עד שעה</label>
                <input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
              </div>
            </div>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="לדוגמה: ריצת 3 קילומטר לבד" className="w-full mb-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
            <input value={newDetail} onChange={(e) => setNewDetail(e.target.value)} placeholder="פירוט (אופציונלי)" className="w-full mb-3 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
            {PARTNER_CATEGORIES.includes(newCategory) && (
              <input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="איפה תתאמנו? (אופציונלי, יעזור למצוא שותף)" className="w-full mb-3 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
            )}
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setAddPopup(null)}>ביטול</GlowButton>
              <GlowButton tone="amber" icon={Plus} className="flex-1" disabled={!newTitle.trim()} onClick={saveAdd}>הוסף</GlowButton>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (() => {
        const isOfficialEv = selectedEvent.source === "official";
        const bankItem = TRAINING_BANK.find((b) => b.title === selectedEvent.category);
        const hex = isOfficialEv ? "#38bdf8" : (TRAINING_BANK_HEX[selectedEvent.category] || "#f59e0b");
        const EvIcon = bankItem?.icon || (isOfficialEv ? Users : Dumbbell);
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setSelectedEvent(null)}>
            <style>{`
              @keyframes eventHeroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } }
              @keyframes eventShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
            `}</style>
            <div className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative p-5 overflow-hidden" style={{ background: `radial-gradient(ellipse 130% 100% at 30% -20%, ${hex}35, transparent 65%), var(--card-base)` }}>
                <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: hex, animation: "eventHeroPulse 4s ease-in-out infinite" }} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", animation: "eventShimmer 4s ease-in-out 0.5s infinite" }} />
                </div>
                <button onClick={() => setSelectedEvent(null)} className="absolute left-3 top-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-zinc-500 hover:text-zinc-300 z-10"><X size={16} /></button>
                <div className="relative flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-black border-2 flex items-center justify-center shrink-0" style={{ borderColor: hex, boxShadow: `0 0 20px 2px ${hex}50` }}>
                    <EvIcon size={26} style={{ color: hex }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {selectedEvent.category && (
                      <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-black mb-1" style={{ backgroundColor: `${hex}25`, color: hex }}>{selectedEvent.category}</span>
                    )}
                    <div className="text-lg font-black text-white leading-tight">{selectedEvent.title}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[13px] text-zinc-300 font-bold">
                    <Clock size={14} style={{ color: hex }} /> {selectedEvent.time}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ""}
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-1.5 text-[13px] text-zinc-300 font-bold">
                      <MapPin size={14} style={{ color: hex }} /> {selectedEvent.location}
                    </div>
                  )}
                </div>
                {selectedEvent.detail && (
                  <div className="rounded-2xl p-3.5" style={{ background: `${hex}12`, boxShadow: `0 0 0 1px ${hex}30 inset` }}>
                    <div className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: hex }}>הערות</div>
                    <div className="text-[13px] text-zinc-300 leading-relaxed">{selectedEvent.detail}</div>
                  </div>
                )}
                <div className="text-[12px] text-zinc-600 text-center pt-1 flex items-center justify-center gap-1.5">
                  {isOfficialEv ? <><Users size={12} /> אימון רשמי - נקבע ע״י המאמן</> : <><Crosshair size={12} /> חלק מהמסלול האישי שלך</>}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-red-600/30 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-4">
              <Trash2 size={28} className="text-red-400 mb-2" />
              <div className="text-base font-black text-zinc-100">למחוק את "{deleteConfirm.title}"?</div>
              <div className="text-sm text-zinc-500 mt-1.5">לא ניתן לשחזר לאחר המחיקה</div>
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>לא</GlowButton>
              <GlowButton tone="red" icon={Trash2} className="flex-1" onClick={() => { removePersonalLog(deleteConfirm.id); setDeleteConfirm(null); }}>כן, מחק</GlowButton>
            </div>
          </div>
        </div>
      )}

      {gibushOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setGibushOpen(false)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-base font-black text-amber-400 mb-3 flex items-center gap-1.5"><Target size={16} /> מועד הגיבוש שלי</div>
            <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">לאיזה גיבוש?</label>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {allowedGibushTypes(profile).map((t) => {
                const c = GIBUSH_TYPE_COLORS[t] || {};
                const sel = gibushTypeInput === t;
                return (
                  <button
                    key={t}
                    onClick={() => setGibushTypeInput(t)}
                    className={`rounded-lg py-2 text-[13px] font-bold border-2 transition ${sel ? "bg-black" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                    style={sel ? { borderColor: c.hex, color: c.hex } : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">תאריך</label>
            <input type="date" value={gibushInput} onChange={(e) => setGibushInput(e.target.value)} className="w-full mb-3 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setGibushOpen(false)}>ביטול</GlowButton>
              <GlowButton tone="amber" className="flex-1" disabled={!gibushInput || !gibushTypeInput} onClick={() => { onSetGibushDate(gibushInput, gibushTypeInput); setGibushOpen(false); }}>שמור</GlowButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ============================== CHAT TAB ============================== */

function CoachChat({ warMode, showToast, profile, userId, isPremium }) {
  const STORAGE_KEY = "sayert_chat_history";
  const DAILY_LIMIT_KEY = "sayert_chat_daily_count";
  const [dailyCount, setDailyCount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DAILY_LIMIT_KEY) || "null");
      if (saved && saved.date === toKey(new Date())) return saved.count;
    } catch (e) {}
    return 0;
  });
  const DAILY_FREE_LIMIT = 3;
  const dailyLimitReached = !isPremium && dailyCount >= DAILY_FREE_LIMIT;
  function incrementDailyCount() {
    setDailyCount((prev) => {
      const next = prev + 1;
      try { localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: toKey(new Date()), count: next })); } catch (e) {}
      return next;
    });
  }
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [{ role: "assistant", text: warMode ? "כאן מאמן החירום. איך אני יכול לעזור לך בתוכנית ה-6 שבועות?" : "היי! אני המאמן הטקטי שלך. שאל אותי על תזונה, שינה, פציעות או כל דבר אחר." }];
  });
  const DRAFT_KEY = "sayert_chat_draft";
  const [input, setInput] = useState(() => {
    try { return localStorage.getItem(DRAFT_KEY) || ""; } catch (e) { return ""; }
  });
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [listening, setListening] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const recognitionRef = useRef(null);
  const aiConfigured = useSupabase() || Boolean(CONFIG.GEMINI_API_KEY);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);
  const [chatFontScale, setChatFontScale] = useState(1);
  const [quotedMsg, setQuotedMsg] = useState(null);
  const [chatSearch, setChatSearch] = useState("");
  const [showChatSearch, setShowChatSearch] = useState(false);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 200);
    setShowScrollTopBtn(el.scrollTop > 300);
  }
  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  function scrollToTopOfChat() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }
  function quoteMessage(text) {
    setQuotedMsg(text);
    textareaRef.current?.focus();
  }
  function shareChat() {
    const text = messages.map((m) => `${m.role === "user" ? "אני" : "מאמן"}: ${m.text}`).join("\n\n");
    if (navigator.share) { navigator.share({ text }); return; }
    navigator.clipboard?.writeText(text);
    showToast("השיחה הועתקה", "success");
  }

  // Draft auto-save: never lose what you were typing if you navigate away and back.
  useEffect(() => {
    try {
      if (input) localStorage.setItem(DRAFT_KEY, input);
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
  }, [input]);

  // Voice input via the browser's native speech recognition - no extra dependency.
  function toggleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast("זיהוי קול לא נתמך בדפדפן הזה", "error"); return; }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "he-IL";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  const SUGGESTIONS = warMode
    ? ["איך לשמור על כוח בלי חדר כושר?", "כמה זמן מנוחה בין אימונים?", "מה לאכול לפני אימון בבית?"]
    : ["איך לשפר זמן ריצת 2000?", "כמה שינה אני צריך?", "מה לאכול לפני גיבוש?", "איך למנוע פציעות ברגליים?"];

  function copyMessage(text, idx) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }
  function sendSuggestion(text) {
    send(text);
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch (e) {}
  }, [messages]);

  function clearChat() {
    const fresh = [{ role: "assistant", text: warMode ? "כאן מאמן החירום. איך אני יכול לעזור לך בתוכנית ה-6 שבועות?" : "היי! אני המאמן הטקטי שלך. שאל אותי על תזונה, שינה, פציעות או כל דבר אחר." }];
    setMessages(fresh);
    setConfirmClear(false);
    showToast("הצ׳אט נמחק", "success");
  }

  async function send(overrideText) {
    const raw = (overrideText ?? input).trim();
    if (!raw) return;
    if (dailyLimitReached) {
      showToast?.("הגעת למכסת 3 ההודעות היומית בגרסה החינמית - שדרג לפרימיום להודעות ללא הגבלה", "error");
      return;
    }
    incrementDailyCount();
    const text = quotedMsg ? `בהמשך למה שנאמר: "${quotedMsg.slice(0, 80)}"\n\n${raw}` : raw;
    setMessages((m) => [...m, { role: "user", text: raw, ts: Date.now() }]);
    setInput("");
    setQuotedMsg(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setJustSent(true);
    setTimeout(() => setJustSent(false), 400);
    setLoading(true);
    try {
      const sys = warMode
        ? "אתה מאמן כושר קרבי עילי במצב חירום. בכל תשובה, התבסס במפורש על עקרונות מבוססי-מחקר מתחום מדעי הספורט האקדמיים (כמו עומס הדרגתי, פריודיזציה, אזורי דופק אירוביים, זמני התאוששות שריר) - ברמה הנלמדת במוסדות מובילים כמו Stanford ו-Harvard - אך תרגם אותם לשפה תומכת, פשוטה ותכליתית לבני נוער 16-19 בתוכנית אימון ביתית של 6 שבועות לקראת גיבוש. ענה בעברית קצרה מאוד וממוקדת - עד 4-5 משפטים לכל היותר, בלי הקדמות מיותרות, ברורה, מדעית אך נגישה, בלי ייעוץ רפואי מסוכן."
        : "אתה מאמן כושר קרבי עילי, מקצועי ותומך. בכל תשובה, ציין ויישם באופן מפורש עקרונות מבוססי-מחקר מתחום מדעי ביצועי הספורט (כמו עומס הדרגתי, התאוששות שרירית, אימון אינטרוולים, תזונת ספורט) - ברמה האקדמית הנלמדת במוסדות מובילים בעולם (Stanford, Harvard) - אך הסבר זאת תמיד בפשטות ובגובה העיניים לבני נוער 16-19 המתכוננים לגיבושים צבאיים. ענה בעברית קצרה מאוד וממוקדת - עד 4-5 משפטים לכל היותר, בלי הקדמות מיותרות, בלי ייעוץ רפואי מסוכן.";
      const reply = await aiChat(sys, text, messages);
      setMessages((m) => [...m, { role: "assistant", text: reply, ts: Date.now() }]);
    } catch (e) {
      if (aiConfigured) showToast(`שגיאת AI: ${e.message || "לא ידוע"} - מוצגת תשובה מקומית`, "info");
      await new Promise((r) => setTimeout(r, 300));
      setMessages((m) => [...m, { role: "assistant", text: localCoachReply(text) }]);
    } finally {
      setLoading(false);
    }
  }

  const markdownComponents = {
    p: ({ children }) => <p className="mb-2">{children}</p>,
    strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
    ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pr-4 space-y-1 mb-2">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    h1: ({ children }) => <div className="font-black text-base text-white mb-1.5">{children}</div>,
    h2: ({ children }) => <div className="font-black text-base text-white mb-1.5">{children}</div>,
    h3: ({ children }) => <div className="font-bold text-white mb-1">{children}</div>,
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0 bg-black/50 tech-grid relative overflow-hidden" style={{ borderColor: warMode ? "#dc262640" : "#10b98130" }}>
        <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full blur-2xl opacity-25" style={{ backgroundColor: warMode ? "#dc2626" : "#10b981", animation: "chatHeaderPulse 3.5s ease-in-out infinite" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="absolute rounded-full" style={{ width: 2, height: 2, backgroundColor: warMode ? "#dc2626" : "#10b981", right: `${20 + i * 22}%`, top: `${20 + (i % 2) * 40}%`, opacity: 0.4, animation: `chatDust ${4 + i}s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </div>
        <style>{`
          @keyframes chatHeaderPulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.15); }
          }
          @keyframes msgIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes chatDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(4px,-6px); opacity: 0.6; } }
          @keyframes onlineRipple { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); } 100% { box-shadow: 0 0 0 6px rgba(16,185,129,0); } }
        `}</style>
        <div className="flex items-center gap-2 relative">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${warMode ? "border-red-500/40 bg-red-500/10" : "border-emerald-500/40 bg-emerald-500/10"}`}>
            <Bot size={15} className={warMode ? "text-red-400" : "text-emerald-400"} />
          </div>
          <div>
            <div className={`text-[13px] font-bold ${warMode ? "text-red-400" : "text-emerald-400"}`}>{warMode ? "מאמן חירום" : "מאמן טקטי"}</div>
            {!isPremium ? (
              <div className={`text-[11px] flex items-center gap-1 ${dailyLimitReached ? "text-amber-400 font-bold" : "text-zinc-500"}`}>
                <Lock size={9} /> {dailyCount}/{DAILY_FREE_LIMIT} הודעות היום (חינמי)
              </div>
            ) : (
              <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: "onlineRipple 1.6s ease-out infinite" }} /> זמין עכשיו
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 relative">
          <button onClick={() => setShowChatSearch((s) => !s)} className={`w-7 h-7 rounded-lg border flex items-center justify-center transition ${showChatSearch ? "border-emerald-500/60 text-emerald-400" : "border-zinc-700 text-zinc-400"}`}>
            <Compass size={13} />
          </button>
          <button onClick={() => setChatFontScale((s) => (s >= 1.2 ? 0.9 : Math.round((s + 0.15) * 100) / 100))} className="w-7 h-7 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 text-[10px] font-black">
            A+
          </button>
          <button onClick={shareChat} className="w-7 h-7 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400">
            <Send size={12} />
          </button>
          {confirmClear ? (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/40 rounded-lg px-2 py-1.5">
              <span className="text-[11px] text-red-300 font-semibold">למחוק?</span>
              <button onClick={clearChat} className="text-[12px] font-black text-red-400 hover:text-red-300 px-1">כן</button>
              <button onClick={() => setConfirmClear(false)} className="text-[12px] font-bold text-zinc-500 hover:text-zinc-300 px-1">לא</button>
            </div>
          ) : (
            <button onClick={() => setConfirmClear(true)} className="w-7 h-7 rounded-lg border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-500/50 transition">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {showChatSearch && (
        <div className="px-4 py-2 border-b border-zinc-800 bg-black/30 shrink-0">
          <div className="relative">
            <input value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} placeholder="חיפוש בשיחה..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pr-8 pl-3 py-1.5 text-[13px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
            <Compass size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          </div>
        </div>
      )}

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {messages.filter((m) => !chatSearch.trim() || m.text.includes(chatSearch.trim())).map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`} style={{ animation: "msgIn 0.3s ease-out" }}>
            <div className={`flex items-end gap-2 max-w-[85%] group ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role !== "user" ? (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${warMode ? "bg-red-500/15 border border-red-500/40" : "bg-emerald-500/15 border border-emerald-500/40"}`}>
                  <Bot size={12} className={warMode ? "text-red-400" : "text-emerald-400"} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mb-0.5 overflow-hidden">
                  {profile?.photoUrl ? <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-black">{(profile?.fullName || "?").trim().charAt(0)}</span>}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div
                  className={`px-3.5 py-2.5 rounded-2xl ${
                    m.role === "user"
                      ? "text-black rounded-bl-sm"
                      : warMode
                      ? "border border-red-500/30 text-zinc-200 rounded-br-sm"
                      : "border border-zinc-800 text-zinc-200 rounded-br-sm"
                  }`}
                  style={{
                    background: m.role === "user"
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : warMode
                      ? "linear-gradient(135deg, #1c0a0a, #2a0f0f)"
                      : "linear-gradient(135deg, #18181b, #0f0f11)",
                    fontSize: `${chatFontScale}em`,
                  }}
                >
                  {m.role === "user" ? (
                    <div className="leading-relaxed break-words font-semibold">{m.text}</div>
                  ) : (
                    <div className="leading-relaxed break-words [&>*:last-child]:mb-0">
                      <ReactMarkdown components={markdownComponents}>{m.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-2 ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                  {m.role !== "user" && (
                    <button onClick={() => copyMessage(m.text, i)} className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition px-1">
                      {copiedIdx === i ? (
                        <><Check size={11} className="text-emerald-400" /> <span className="text-emerald-400">הועתק</span></>
                      ) : (
                        <><Copy size={11} /> העתק</>
                      )}
                    </button>
                  )}
                  <button onClick={() => quoteMessage(m.text)} className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition px-1 opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={11} /> צטט
                  </button>
                  {m.ts && (
                    <span className="text-[10px] text-zinc-600 px-1 opacity-0 group-hover:opacity-100 transition">
                      {new Date(m.ts).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${warMode ? "bg-red-500/15 border border-red-500/40" : "bg-emerald-500/15 border border-emerald-500/40"}`}>
                <Bot size={12} className={warMode ? "text-red-400" : "text-emerald-400"} />
              </div>
              <div className={`px-4 py-3 rounded-2xl rounded-br-sm flex items-center gap-1 ${warMode ? "bg-red-950/40 border border-red-500/30" : "bg-zinc-900 border border-zinc-800"}`}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className={`w-1.5 h-1.5 rounded-full ${warMode ? "bg-red-400" : "bg-emerald-400"}`} style={{ animation: `typingDot 1.4s ease-in-out ${d * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendSuggestion(s)}
                className={`text-[13px] font-semibold rounded-full px-3.5 py-2 border transition active:scale-95 ${warMode ? "border-red-500/30 text-red-300 hover:bg-red-500/10" : "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute left-1/2 -translate-x-1/2 bottom-24 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg active:scale-90 transition z-10"
        >
          <ChevronDown size={16} className="text-zinc-300" />
        </button>
      )}
      {showScrollTopBtn && (
        <button
          onClick={scrollToTopOfChat}
          className="absolute left-1/2 -translate-x-1/2 top-16 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-lg active:scale-90 transition z-10"
        >
          <ChevronUp size={16} className="text-zinc-300" />
        </button>
      )}
      {quotedMsg && (
        <div className="px-3 pt-2 flex items-center gap-2 border-t shrink-0" style={{ borderColor: warMode ? "#dc262630" : "#10b98125" }}>
          <div className={`w-1 self-stretch rounded-full ${warMode ? "bg-red-500" : "bg-emerald-500"}`} />
          <div className="flex-1 min-w-0 text-[12px] text-zinc-500 truncate py-1">{quotedMsg}</div>
          <button onClick={() => setQuotedMsg(null)} className="text-zinc-600 hover:text-zinc-400"><X size={14} /></button>
        </div>
      )}
      <div className="p-3 border-t flex items-end gap-2" style={{ borderColor: warMode ? "#dc262630" : "#10b98125", background: `linear-gradient(180deg, transparent, ${warMode ? "#dc262608" : "#10b98108"}), rgba(0,0,0,0.4)` }}>
        <style>{`
          @keyframes typingDot {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-3px); }
          }
          @keyframes sentPulse {
            0% { transform: scale(1); }
            40% { transform: scale(0.85); }
            100% { transform: scale(1); }
          }
          @keyframes micPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
            50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          }
        `}</style>
        <div className={`flex-1 flex items-end gap-1.5 bg-zinc-950 border rounded-xl px-2 py-1.5 focus-within:ring-2 transition-all duration-300 ${warMode ? "border-red-500/30 focus-within:ring-red-500/40 focus-within:border-red-500/60" : "border-emerald-500/30 focus-within:ring-emerald-500/40 focus-within:border-emerald-500/60"}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(112, e.target.scrollHeight) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="הקלד הודעה... (Shift+Enter לשורה חדשה)"
            rows={1}
            className="flex-1 bg-transparent px-2 py-1.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none"
            style={{ maxHeight: 112 }}
          />
          {input && (
            <button onClick={() => { setInput(""); if (textareaRef.current) textareaRef.current.style.height = "auto"; }} className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center mb-1">
              <X size={12} className="text-zinc-400" />
            </button>
          )}
          <button
            onClick={toggleVoiceInput}
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-0.5 transition ${listening ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"}`}
            style={listening ? { animation: "micPulse 1.5s ease-in-out infinite" } : undefined}
          >
            <Mic size={14} />
          </button>
        </div>
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-30 border transition ${warMode ? "bg-red-600 border-red-400" : "bg-emerald-500 border-emerald-400"}`}
          style={justSent ? { animation: "sentPulse 0.4s ease-out" } : undefined}
        >
          <Send size={17} className={warMode ? "text-white" : "text-black"} />
        </button>
      </div>
    </div>
  );
}

function ChatTab({ warMode, showToast, profile, userId, isPremium }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <CoachChat warMode={warMode} showToast={showToast} profile={profile} userId={userId} isPremium={isPremium} />
      </div>
    </div>
  );
}

/* ============================== PATH TAB (המסלול שלי) ============================== */

const WEEK_DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function QAccordionItem({ id, icon: Icon, hex, title, summary, isAnswered, isExpanded, onToggle, children, index, optional, itemRef }) {
  return (
    <div
      ref={itemRef}
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isExpanded ? `linear-gradient(135deg, ${hex}1c, transparent 70%), var(--card-base-alt)` : "var(--card-base-alt)",
        boxShadow: isExpanded ? `0 0 0 1.5px ${hex}70, 0 0 18px 0 ${hex}30` : `0 0 0 1px ${isAnswered ? hex + "50" : "#27272a"}`,
        animation: `qItemFadeUp 0.35s ease-out ${(index || 0) * 0.05}s both`,
      }}
    >
      {isExpanded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 w-1/3" style={{ background: `linear-gradient(90deg, transparent, ${hex}18, transparent)`, animation: "qShimmer 3s ease-in-out infinite" }} />
        </div>
      )}
      <button onClick={onToggle} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-right">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300" style={{ backgroundColor: `${hex}22`, boxShadow: isAnswered ? `0 0 8px 0 ${hex}50` : undefined }}>
          {isAnswered ? <Check size={16} style={{ color: hex }} /> : <Icon size={16} style={{ color: hex }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-black text-zinc-100 flex items-center gap-1.5">
            {title}
            {optional && <span className="text-[10px] font-semibold text-zinc-600">(לא חובה)</span>}
          </div>
          {!isExpanded && summary && <div className="text-[11px] mt-0.5 font-bold truncate" style={{ color: hex }}>{summary}</div>}
          {!isExpanded && !summary && <div className="text-[11px] text-zinc-600 mt-0.5">לחצו לבחירה</div>}
        </div>
        <ChevronDown size={16} className="text-zinc-500 transition-transform duration-300 shrink-0" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isExpanded ? 500 : 0 }}>
        <div className="relative px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

/* ============================== WEEK COMMAND CENTER ============================== */
// The weekly schedule as a "mission control" HUD: a hex-node week rail (tap to select, drag a
// workout from one node onto another to move/swap it), a mission panel for the selected day,
// a training-load spectrum with overload detection, and an AI scan terminal.
const WCC_LEVEL_LOAD = { "בסיס": 1, "בסיס+": 2, "בינוני": 3, "בינוני+": 4, "מתקדם": 5, "מתקדם+": 6, "קשה": 7, "קשה מאוד": 8, "קשה מאוד+": 9 };
function wccWorkoutMeta(session, trainingContent) {
  const list = trainingContent || [];
  const w = list.find((t) => t.id === session.contentId) || list.find((t) => t.title === session.title);
  if (!w) return { level: null, load: 4, exercises: null, split: null };
  const lines = (w.body || "").split("\n").map((l) => l.trim());
  const lv = lines.find((l) => l.startsWith("LEVEL|"));
  const sp = lines.find((l) => l.startsWith("SPLIT|"));
  const level = lv ? lv.slice(6) : (w.difficulty || null);
  const exercises = lines.filter((l) => l.includes("|") && !/^(LEVEL|SPLIT|META)\|/.test(l)).length;
  return { level, load: WCC_LEVEL_LOAD[level] || 4, exercises: exercises || null, split: sp ? sp.slice(6) : null };
}
const WCC_STATUS = {
  rest: { label: "RECOVERY", he: "התאוששות", hex: "#a78bfa" },
  done: { label: "COMPLETE", he: "הושלם", hex: "#10b981" },
  missed: { label: "OVERDUE", he: "באיחור", hex: "#ef4444" },
  active: { label: "ACTIVE", he: "פעיל עכשיו", hex: "#22d3ee" },
  queued: { label: "QUEUED", he: "בתור", hex: "#f59e0b" },
};
const WCC_RECOVERY_TIPS = ["שינה של 8 שעות היא האימון הכי חשוב היום", "שתה מים, מתח קל, והליכה של 20 דקות", "גם שריר צריך לנוח כדי לגדול", "בדוק איפה כואב, ותן לזה זמן", "ארוחה עשירה בחלבון + פחמימות מורכבות"];
const WCC_HEX = "22,2 41,13 41,35 22,46 3,35 3,13";
const WCC_MONO = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", direction: "ltr", unicodeBidi: "isolate" };
const WCC_CSS = `
  @keyframes wccComet { from { left: -25%; } to { left: 115%; } }
  @keyframes wccMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes wccStamp { 0% { transform: rotate(-12deg) scale(2.2); opacity: 0; } 60% { transform: rotate(-12deg) scale(0.95); opacity: 1; } 100% { transform: rotate(-12deg) scale(1); opacity: 0.9; } }
  @keyframes wccOrbit { from { transform: rotate(0deg) translateX(26px) rotate(0deg); } to { transform: rotate(360deg) translateX(26px) rotate(-360deg); } }
  @keyframes wccSelectIn { from { transform: scale(0.85); } to { transform: scale(1); } }
  @keyframes wccPanelIn { from { opacity: 0; transform: translateY(8px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
`;

function WeekCommandCenter({ plan, completedKeys, selectedDay, onSelectDay, gibushDayIdx, gibushHex, daysToGibush, simsByDayIdx, trainingContent, streak, onToggleComplete, onOpenContent, onSnooze, onSwap, onRemove, onMoveSession, moveUndo, onUndoMove, sessionTips, loadingTipKey, onGetTip, aiText, aiLoading, onAiScan, onCloseAi, onCopy, copied, search, setSearch, fontScale }) {
  const weekly = plan.weeklyPlan;
  const todayIdx = new Date().getDay();
  const sunday = new Date(); sunday.setDate(sunday.getDate() - todayIdx);
  const dateOf = (i) => { const d = new Date(sunday); d.setDate(d.getDate() + i); return d; };
  const LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
  const ACCENT = "#22d3ee";
  const [searchOpen, setSearchOpen] = useState(false);
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const suppressRef = useRef(false);
  const moveRef = useRef(onMoveSession);
  moveRef.current = onMoveSession;

  const days = weekly.map((day, i) => {
    const sessions = day.sessions || [];
    const first = sessions[0];
    const dim = first ? PLAN_DIMENSIONS.find((d) => d.id === first.dimension) : null;
    const done = sessions.filter((_, si) => completedKeys[`${i}_${si}`]).length;
    const meta = first ? wccWorkoutMeta(first, trainingContent) : null;
    const status = !sessions.length ? "rest" : done === sessions.length ? "done" : i < todayIdx ? "missed" : i === todayIdx ? "active" : "queued";
    const q = search.trim();
    const match = !q || sessions.some((s) => s.title.includes(q) || (s.category || "").includes(q));
    return { i, day, sessions, first, hex: first ? (dim?.hex || "#10b981") : "#52525b", done, meta, status, match, load: sessions.length ? (meta?.load || 4) : 0 };
  });
  const totalSessions = days.reduce((a, d) => a + d.sessions.length, 0);
  const doneSessions = days.reduce((a, d) => a + d.done, 0);
  const syncPct = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0;
  const loadWarn = days.some((d, k) => k > 0 && d.load >= 7 && days[k - 1].load >= 7);
  const nextMission = (() => { for (let k = todayIdx; k < days.length; k++) { if (days[k].sessions.length && days[k].done < days[k].sessions.length) return days[k]; } return null; })();
  const sel = days[selectedDay] || days[todayIdx] || days[0];
  const st = WCC_STATUS[sel.status];
  const beamPct = days.length > 1 ? (todayIdx / (days.length - 1)) * 100 : 0;
  const rel = (i) => (i === todayIdx ? "היום" : i === todayIdx + 1 ? "מחר" : `בעוד ${i - todayIdx} ימים`);
  const ticker = [
    `SYNC ${doneSessions}/${totalSessions}`,
    `STREAK ${streak || 0}D`,
    daysToGibush != null && daysToGibush >= 0 ? `GIBUSH T-${daysToGibush}D` : null,
    nextMission ? `NEXT: ${nextMission.first.title} · ${rel(nextMission.i)}` : "ALL MISSIONS CLEAR",
    loadWarn ? "WARNING: HIGH LOAD STREAK" : "LOAD BALANCED",
  ].filter(Boolean);

  // Drag a workout from one day node onto another: moves it to a free day, or swaps with a booked one.
  useEffect(() => {
    const overOf = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY); const v = el?.closest?.("[data-wcc-day]")?.getAttribute("data-wcc-day"); return v != null ? Number(v) : null; };
    function move(e) {
      const d = dragRef.current; if (!d) return;
      const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
      if (!d.active) {
        if (Math.hypot(dx, dy) < 10) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.5) { dragRef.current = null; return; }
        d.active = true;
        try { navigator.vibrate?.(10); } catch (err) {}
      }
      setDrag({ from: d.from, x: e.clientX, y: e.clientY, over: overOf(e) });
    }
    function up(e) {
      const d = dragRef.current; dragRef.current = null;
      if (!d || !d.active) return;
      const over = overOf(e);
      setDrag(null);
      suppressRef.current = true;
      setTimeout(() => { suppressRef.current = false; }, 0);
      if (over != null && over !== d.from) { try { navigator.vibrate?.([12, 30, 12]); } catch (err) {} moveRef.current(d.from, over); }
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, []);
  function onNodeDown(e, i) {
    if (!(weekly[i].sessions || []).length) return;
    dragRef.current = { from: i, sx: e.clientX, sy: e.clientY, active: false };
  }

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ background: "#06070a", boxShadow: `0 0 0 1px ${ACCENT}30 inset, 0 24px 70px -28px ${ACCENT}66` }}>
      <style>{WCC_CSS}</style>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(#ffffff07 1px, transparent 1px), linear-gradient(90deg, #ffffff07 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(180deg, #000, transparent 85%)", WebkitMaskImage: "linear-gradient(180deg, #000, transparent 85%)" }} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 pointer-events-none" style={{ background: `linear-gradient(180deg, transparent, ${ACCENT}1c, transparent)`, animation: "fxScan 6s linear infinite" }} />
      <FxFrame hex={ACCENT} hex2="#a855f7" radius="1.5rem" />
      <HudCorners hex={ACCENT} corners={4} inset={9} />

      {/* top bar */}
      <div className="relative px-4 pt-4 flex items-center gap-3">
        <FxRing size={46} stroke={4} pct={syncPct} hex={syncPct === 100 ? "#10b981" : ACCENT}>
          <span className="text-[11px] font-black tabular-nums" style={{ color: syncPct === 100 ? "#10b981" : ACCENT }}>{syncPct}%</span>
        </FxRing>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px #34d399", animation: "fxBlink 1.4s ease-in-out infinite" }} />
            <span className="text-[10px] font-black tracking-[0.25em] text-cyan-300" style={WCC_MONO}>WEEK.SYNC // LIVE</span>
          </div>
          <div className="text-[17px] font-black text-zinc-50 leading-tight">מרכז שליטה שבועי</div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSearchOpen((v) => !v)} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#ffffff0a", boxShadow: "0 0 0 1px #ffffff14 inset" }}><Compass size={14} className="text-zinc-400" /></button>
          <button onClick={onCopy} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#ffffff0a", boxShadow: "0 0 0 1px #ffffff14 inset" }}>{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-zinc-400" />}</button>
        </div>
      </div>
      {searchOpen && (
        <div className="relative px-4 pt-2.5" style={{ animation: "wccPanelIn 0.25s ease-out both" }}>
          <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="סנן אימון או קטגוריה..." className="w-full rounded-xl px-3 py-2 text-[13px] text-zinc-100 placeholder-zinc-600 focus:outline-none" style={{ background: "#0d0f13", boxShadow: `0 0 0 1px ${ACCENT}40 inset` }} />
        </div>
      )}

      {/* live ticker */}
      <div className="relative mt-3 overflow-hidden" style={{ ...WCC_MONO, background: "#ffffff06", borderTop: "1px solid #ffffff0d", borderBottom: "1px solid #ffffff0d" }}>
        <div className="flex whitespace-nowrap py-1.5" style={{ width: "max-content", animation: "wccMarquee 26s linear infinite" }}>
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center">
              {ticker.map((t, k) => (
                <span key={k} className="text-[10px] font-bold tracking-wider px-3" style={{ color: t.startsWith("WARNING") ? "#f87171" : k % 2 ? "#a5f3fc" : "#d4d4d8" }}>▸ {t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* week rail */}
      <div className="relative px-3 pt-5 pb-1">
        <div className="absolute" style={{ right: 36, left: 36, top: 46, height: 3 }}>
          <div className="absolute inset-0 rounded-full" style={{ background: "#1c1f26" }} />
          <div className="absolute inset-y-0 right-0 rounded-full" style={{ width: `${beamPct}%`, background: `linear-gradient(270deg, ${ACCENT}, #a855f7)`, boxShadow: `0 0 12px ${ACCENT}` }} />
          <div className="absolute -top-[2px] w-10 h-[7px] rounded-full pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, #fff, transparent)`, opacity: 0.55, animation: "wccComet 3.4s linear infinite" }} />
        </div>
        <div className="relative flex items-start">
          {days.map((d) => {
            const isSel = d.i === sel.i;
            const isToday = d.i === todayIdx;
            const isGibush = gibushDayIdx === d.i;
            const hasSim = !!simsByDayIdx[d.i];
            const pct = d.sessions.length ? (d.done / d.sessions.length) * 100 : 0;
            const isOver = drag && drag.over === d.i && drag.from !== d.i;
            const isFrom = drag && drag.from === d.i;
            return (
              <div key={d.i} data-wcc-day={d.i} className="flex-1 flex flex-col items-center gap-1" style={{ touchAction: "pan-y", userSelect: "none", opacity: d.match ? 1 : 0.28, transition: "opacity .25s" }}
                onPointerDown={(e) => onNodeDown(e, d.i)}
                onClick={() => { if (suppressRef.current) return; try { navigator.vibrate?.(6); } catch (err) {} onSelectDay(d.i); }}>
                <div className="relative cursor-pointer" style={{ width: 44, height: 48, transform: isSel ? "scale(1.14)" : isOver ? "scale(1.22)" : "none", transition: "transform .25s cubic-bezier(.34,1.56,.64,1)", filter: isSel || isOver ? `drop-shadow(0 0 10px ${isOver ? "#fff" : d.hex})` : "none", opacity: isFrom ? 0.35 : 1 }}>
                  {isToday && !isSel && <span aria-hidden="true" className="absolute inset-1 rounded-full pointer-events-none" style={{ border: `1.5px solid ${ACCENT}`, animation: "fxPing 2s ease-out infinite" }} />}
                  <svg width="44" height="48" viewBox="0 0 44 48" className="absolute inset-0">
                    <polygon points={WCC_HEX} fill={isSel ? `${d.hex}26` : "#0b0d11"} stroke={d.sessions.length ? `${d.hex}40` : "#3f3f46"} strokeWidth={d.sessions.length ? 2 : 1.5} strokeDasharray={d.sessions.length ? undefined : "3 3"} />
                    {d.sessions.length > 0 && <polygon points={WCC_HEX} fill="none" stroke={d.hex} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" pathLength="100" strokeDasharray={`${pct} 100`} style={{ transition: "stroke-dasharray .7s ease-out", filter: `drop-shadow(0 0 3px ${d.hex})` }} />}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    <span className="text-[9px] font-bold" style={{ color: isSel ? "#fff" : "#a1a1aa" }}>{LETTERS[d.i]}׳</span>
                    <span className="text-[14px] font-black tabular-nums mt-0.5" style={{ color: isSel || isToday ? "#fff" : "#d4d4d8", ...WCC_MONO }}>{dateOf(d.i).getDate()}</span>
                  </div>
                  {d.status === "done" && <span className="absolute -top-1 -left-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center" style={{ animation: "wccSelectIn .3s ease-out" }}><Check size={9} className="text-black" /></span>}
                  {d.status === "missed" && <span className="absolute -top-1 -left-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] font-black text-white">!</span>}
                  {isGibush && <span className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: gibushHex, boxShadow: `0 0 8px ${gibushHex}` }}><Target size={9} className="text-black" /></span>}
                  {hasSim && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500" style={{ boxShadow: "0 0 6px #ef4444" }} />}
                  {d.status === "rest" && <Moon size={9} className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-violet-400" />}
                </div>
                <div className="h-3 text-[8px] font-black" style={{ color: isOver ? "#fff" : isSel ? d.hex : "transparent", ...WCC_MONO }}>{isOver ? "DROP" : "▲"}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-[9px] text-zinc-600 font-bold -mt-0.5" style={WCC_MONO}>TAP · SELECT &nbsp;//&nbsp; DRAG · MOVE / SWAP</div>
      </div>

      {drag && drag.x != null && weekly[drag.from]?.sessions?.[0] && (
        <div aria-hidden="true" className="fixed z-[90] pointer-events-none rounded-xl px-3 py-1.5 text-[11px] font-black text-black max-w-[190px] truncate" style={{ left: drag.x, top: drag.y, transform: "translate(-50%, -140%) rotate(-3deg)", background: days[drag.from].hex, boxShadow: `0 10px 30px -6px ${days[drag.from].hex}` }}>
          {weekly[drag.from].sessions[0].title}
        </div>
      )}

      {/* mission panel */}
      <div key={sel.i} className="relative px-4 pt-2 pb-3 space-y-2.5" style={{ animation: "wccPanelIn .35s ease-out both" }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.2em] rounded-md px-2 py-1" style={{ ...WCC_MONO, color: st.hex, background: `${st.hex}1a`, boxShadow: `0 0 0 1px ${st.hex}55 inset` }}>{st.label}</span>
          <span className="text-[13px] font-black text-zinc-100">יום {sel.day.day}{sel.i === todayIdx ? " · היום" : ""}</span>
          <span className="text-[10px] text-zinc-500 font-bold mr-auto" style={WCC_MONO}>{dateOf(sel.i).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" })} · {st.he}</span>
        </div>
        {(gibushDayIdx === sel.i || simsByDayIdx[sel.i]) && (
          <div className="flex flex-wrap gap-1.5">
            {gibushDayIdx === sel.i && <span className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: `${gibushHex}25`, color: gibushHex, boxShadow: `0 0 0 1px ${gibushHex}55 inset` }}>◎ יום הגיבוש</span>}
            {(simsByDayIdx[sel.i] || []).map((sm) => (
              <span key={sm.id} className="rounded-full px-2.5 py-1 text-[10px] font-black bg-red-500/15 text-red-400">⌖ סימולציה · {new Date(sm.scheduledAt).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</span>
            ))}
          </div>
        )}

        {sel.sessions.length === 0 ? (
          <div className="relative rounded-2xl p-4 overflow-hidden flex items-center gap-4" style={{ background: "radial-gradient(ellipse at 20% 30%, #a78bfa22, transparent 65%), #0b0b10", boxShadow: "0 0 0 1px #a78bfa30 inset" }}>
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <Moon size={26} className="text-violet-300" style={{ filter: "drop-shadow(0 0 8px #a78bfa)" }} />
              <span className="absolute w-1.5 h-1.5 rounded-full bg-violet-200" style={{ animation: "wccOrbit 6s linear infinite", boxShadow: "0 0 6px #ddd6fe" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black tracking-widest text-violet-300" style={WCC_MONO}>RECOVERY MODE</div>
              <div className="text-[13px] font-bold text-zinc-200 leading-snug mt-0.5">{WCC_RECOVERY_TIPS[sel.i % WCC_RECOVERY_TIPS.length]}</div>
              <div className="text-[10.5px] text-zinc-500 mt-1">אפשר לגרור לכאן אימון מיום אחר</div>
            </div>
          </div>
        ) : (
          sel.sessions.map((s, si) => {
            const key = `${sel.i}_${si}`;
            const isDone = !!completedKeys[key];
            const dim = PLAN_DIMENSIONS.find((x) => x.id === s.dimension);
            const hex = dim?.hex || "#10b981";
            const bank = TRAINING_BANK.find((b) => b.title === s.category);
            const Icon = bank?.icon || Dumbbell;
            const meta = wccWorkoutMeta(s, trainingContent);
            const lv = meta.level ? WORKOUT_LEVEL_STYLES[meta.level] : null;
            return (
              <div key={si} {...fxTilt(3)} className="relative rounded-2xl overflow-hidden p-3.5" style={{ ...fxTiltStyle, background: `linear-gradient(135deg, ${hex}22, transparent 62%), #0a0b0f`, boxShadow: `0 0 0 1px ${hex}45 inset` }}>
                <FxSpot radius="1rem" />
                <div className="absolute inset-y-3 right-0 w-[3px] rounded-full" style={{ background: hex, boxShadow: `0 0 12px ${hex}` }} />
                {isDone && <div aria-hidden="true" className="absolute top-3 left-3 text-[11px] font-black tracking-[0.2em] rounded-md px-2 py-1 pointer-events-none" style={{ ...WCC_MONO, color: "#10b981", border: "2px solid #10b981", animation: "wccStamp .5s ease-out both", background: "#10b9811a" }}>MISSION COMPLETE</div>}
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)", background: `linear-gradient(145deg, ${hex}55, ${hex}18)` }}>
                    <Icon size={20} style={{ color: "#fff" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-black text-zinc-50 leading-tight ${isDone ? "opacity-70" : ""}`} style={{ fontSize: `${15 * fontScale}px` }}>{s.title}</div>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${hex}1c`, color: hex }}>{dim?.label || s.category}</span>
                      {meta.split && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-white/5 text-zinc-300">{meta.split}</span>}
                    </div>
                  </div>
                </div>
                <div className="relative grid grid-cols-3 gap-1.5 mt-3">
                  <div className="rounded-xl p-2 text-center" style={{ background: "#ffffff08" }}>
                    <div className="text-[8px] font-black tracking-widest text-zinc-500" style={WCC_MONO}>LOAD</div>
                    <div className="flex items-end justify-center gap-[2px] h-4 mt-1">
                      {Array.from({ length: 9 }).map((_, k) => (
                        <span key={k} className="w-[3px] rounded-sm" style={{ height: `${30 + k * 8}%`, background: k < meta.load ? (k < 3 ? "#10b981" : k < 6 ? "#f59e0b" : "#ef4444") : "#27272a" }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-2 text-center" style={{ background: "#ffffff08" }}>
                    <div className="text-[8px] font-black tracking-widest text-zinc-500" style={WCC_MONO}>MOVES</div>
                    <div className="text-[15px] font-black text-zinc-100 tabular-nums" style={WCC_MONO}>{meta.exercises ?? "–"}</div>
                  </div>
                  <div className="rounded-xl p-2 text-center" style={{ background: "#ffffff08" }}>
                    <div className="text-[8px] font-black tracking-widest text-zinc-500" style={WCC_MONO}>LEVEL</div>
                    <div className="text-[11px] font-black mt-0.5" style={{ color: lv?.hex || "#a1a1aa" }}>{meta.level || "–"}</div>
                  </div>
                </div>
                <div className="relative flex items-center gap-1.5 mt-3">
                  <button onClick={() => onOpenContent(s, dim, hex)} className="flex-1 rounded-xl py-2.5 text-[13px] font-black text-black flex items-center justify-center gap-1.5 active:scale-95 transition" style={{ background: `linear-gradient(135deg, ${hex}, ${hex}cc)`, boxShadow: `0 6px 20px -8px ${hex}` }}>
                    <Zap size={14} /> התחל משימה
                  </button>
                  <button onClick={() => onToggleComplete(key)} className="rounded-xl px-3.5 py-2.5 text-[12px] font-black flex items-center gap-1 active:scale-95 transition" style={isDone ? { background: "#10b981", color: "#000" } : { background: "#ffffff0d", color: "#d4d4d8", boxShadow: "0 0 0 1px #ffffff1a inset" }}>
                    <Check size={13} /> {isDone ? "בוצע" : "סמן"}
                  </button>
                  {!isDone && sel.i === todayIdx && <button onClick={() => onSnooze(sel.i, si)} title="דחה למחר" className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-sky-400" style={{ background: "#ffffff0a" }}><Clock size={14} /></button>}
                  <button onClick={() => onSwap(sel.i, si, s)} title="החלף אימון" className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-amber-400" style={{ background: "#ffffff0a" }}><RefreshCw size={14} /></button>
                  <button onClick={() => onRemove(sel.i, si)} title="הסר" className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400" style={{ background: "#ffffff0a" }}><X size={14} /></button>
                </div>
                {sessionTips[key] ? (
                  <div className="relative mt-2.5 flex items-start gap-1.5 text-[11.5px] text-cyan-200 rounded-lg px-2.5 py-2" style={{ background: "#22d3ee0d", boxShadow: "0 0 0 1px #22d3ee25 inset" }}><Bot size={12} className="text-cyan-400 shrink-0 mt-0.5" /> {sessionTips[key]}</div>
                ) : (
                  <button onClick={() => onGetTip(key, s)} disabled={loadingTipKey === key} className="relative mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 disabled:opacity-50">
                    {loadingTipKey === key ? <Loader2 size={11} className="animate-spin" /> : <Bot size={11} />} {loadingTipKey === key ? "מנתח..." : "טיפ ביצוע מ-AI"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* load spectrum */}
      <div className="relative px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500" style={WCC_MONO}>LOAD SPECTRUM</span>
          {loadWarn ? <span className="text-[10px] font-black text-red-400 flex items-center gap-1"><Flame size={10} /> עומס גבוה ברצף - שקול מנוחה</span> : <span className="text-[10px] font-bold text-emerald-400/80">עומס מאוזן</span>}
        </div>
        <div className="flex items-end gap-1.5 h-14">
          {days.map((d) => (
            <button key={d.i} onClick={() => onSelectDay(d.i)} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
              <div className="w-full rounded-[3px]" style={{ height: `${d.load ? d.load * 10 : 6}%`, minHeight: 4, background: d.sessions.length ? (d.status === "done" ? `linear-gradient(180deg, ${d.hex}, ${d.hex}77)` : `repeating-linear-gradient(135deg, ${d.hex}66 0 3px, transparent 3px 6px)`) : "#17181d", boxShadow: d.i === todayIdx ? `0 0 12px ${d.hex}` : "none", outline: d.i === sel.i ? `1px solid ${d.hex}` : "none", outlineOffset: 1, transformOrigin: "bottom", animation: `fxGrow .6s ease-out ${d.i * 0.05}s both` }} />
            </button>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="relative px-4 pb-4 space-y-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onAiScan} disabled={aiLoading} className="rounded-xl px-3 py-2 text-[11px] font-black flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition" style={{ ...WCC_MONO, color: "#a5f3fc", background: "#22d3ee14", boxShadow: "0 0 0 1px #22d3ee50 inset" }}>
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Bot size={12} />} AI.SCAN
          </button>
          {nextMission && <span className="text-[11px] text-zinc-400 font-bold truncate flex-1 min-w-0">הבאה: <span className="text-zinc-200">{nextMission.first.title}</span> · {rel(nextMission.i)}</span>}
          {moveUndo && <button onClick={onUndoMove} className="rounded-xl px-3 py-2 text-[11px] font-black text-amber-300" style={{ background: "#f59e0b14", boxShadow: "0 0 0 1px #f59e0b50 inset" }}>↺ בטל הזזה</button>}
        </div>
        {(aiText || aiLoading) && (
          <div className="rounded-xl p-3" style={{ background: "#040506", boxShadow: "0 0 0 1px #22d3ee35 inset" }}>
            <div className="flex items-center gap-2 mb-1.5 text-cyan-400 text-[10px] font-bold" style={WCC_MONO}>
              <span>$ ai.scan --week --deep</span>
              <button onClick={onCloseAi} className="ml-auto text-zinc-600"><X size={12} /></button>
            </div>
            {aiLoading ? <div className="text-[12px] text-cyan-200/80">מנתח עומסים, מנוחה וגיוון<span className="animate-pulse">...</span></div> : <div className="text-[12px] text-zinc-300 leading-relaxed"><FxTypewriter text={aiText} speed={12} /></div>}
          </div>
        )}
      </div>
    </div>
  );
}

function PathTab({ profile, userId, showToast, trainingContent, addPersonalLog, officialEvents, personalLogs, removePersonalLog, isPremium, onSetGibushDate }) {
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const [clearChatConfirm, setClearChatConfirm] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);
  const [addingSession, setAddingSession] = useState(null); // { dayIdx, sessionIdx }
  const [addTimes, setAddTimes] = useState({ start: "", end: "" });
  const [addedKeys, setAddedKeys] = useState({});
  const [reflectLoading, setReflectLoading] = useState(false);
  const [reflectingOn, setReflectingOn] = useState(null);
  const [athleteProfile, setAthleteProfile] = useState(null);
  const [showInterview, setShowInterview] = useState(false);
  const [pathChatSubView, setPathChatSubView] = useState("feedback"); // 'feedback' | 'advice'
  const [simList, setSimList] = useState([]);
  const [mySimSessions, setMySimSessions] = useState([]);
  const [loadingSims, setLoadingSims] = useState(false);
  const [startingSimId, setStartingSimId] = useState(null);
  const [justStartedCode, setJustStartedCode] = useState(null);
  const [simsLoaded, setSimsLoaded] = useState(false);
  async function loadSimsData() {
    setLoadingSims(true);
    const [sims, sessions] = await Promise.all([loadSimulations(), loadMySimSessions(userId)]);
    setSimList(sims);
    setMySimSessions(sessions);
    setLoadingSims(false);
    setSimsLoaded(true);
  }
  const [timingAdvice, setTimingAdvice] = useState(null);
  const [viewingSim, setViewingSim] = useState(null);
  const [loadingTimingAdvice, setLoadingTimingAdvice] = useState(false);
  async function handleStartSim(sim) {
    if (!isPremium) { showToast?.("סימולציות זמינות רק במנוי פרימיום", "error"); return; }
    setLoadingTimingAdvice(true);
    setTimingAdvice({ sim, text: null, prepTips: null });
    try {
      const actTimes = sim.acts.map((a) => a.time).filter((t) => /^\d{2}:\d{2}$/.test(t)).join(", ");
      const profileLine = athleteProfile ? `רמת כושר עצמית: ${athleteProfile.fitnessLevel}. יעד: ${profile?.targetUnitName || "לא צוין"}.` : `יעד: ${profile?.targetUnitName || "לא צוין"}.`;
      const sys = `אתה מומחה בתכנון אימונים, מחזורי שינה, והכנה מנטלית לגיבושים. קיבלת לוח זמנים של סימולציית גיבוש שנכתב לפי שעון ליום מסוים ספציפי (לרוב מתחיל אחה"צ/ערב ונמשך כל הלילה). ${profileLine} השעות המקוריות בטקסט: ${actTimes}. החזר אך ורק JSON בפורמט: {"timing": "2-3 משפטים על השעה הכי הגיונית להתחיל בפועל בהתחשב בשלבים הדורשים ערנות בלילה, אל תכפה בדיוק את השעה הכתובה - תן טווח הגיוני", "prep": "2-3 משפטים קצרים על איך להתכונן פיזית ומנטלית לפני הסימולציה הזו הספציפית, בהתחשב ביעד ובכושר"}`;
      const reply = await aiChat(sys, `הכן אותי לקראת "${sim.title}"`);
      const match = reply.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : { timing: reply, prep: null };
      setTimingAdvice({ sim, text: parsed.timing, prepTips: parsed.prep });
    } catch (e) {
      setTimingAdvice({ sim, text: "מומלץ להתחיל בשעות הערב כמתוכנן במקור, כדי שהשלבים הליליים יישארו בלילה אמיתי.", prepTips: null });
    } finally {
      setLoadingTimingAdvice(false);
    }
  }
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  async function confirmStartSim(sim) {
    setTimingAdvice(null);
    setStartingSimId(sim.id);
    try {
      const scheduledIso = scheduledDateTime ? new Date(scheduledDateTime).toISOString() : null;
      const result = await startSimulationSession(sim.id, userId, scheduledIso);
      setJustStartedCode({ code: result.code, title: sim.title, scheduledDateTime });
      setScheduledDateTime("");
      loadSimsData();
    } catch (e) {
      showToast?.("שגיאה ביצירת קוד", "error");
    } finally {
      setStartingSimId(null);
    }
  }
  const [interviewStep, setInterviewStep] = useState(0);
  const [ivName, setIvName] = useState(profile?.fullName || "");
  const [ivAge, setIvAge] = useState(profile?.age || "");
  const [ivDuration, setIvDuration] = useState("");
  const [ivFitness, setIvFitness] = useState("");
  const [ivValues, setIvValues] = useState("");
  const [ivMental, setIvMental] = useState("");
  const [ivStrengths, setIvStrengths] = useState([""]);
  const [savingInterview, setSavingInterview] = useState(false);
  const [keep1, setKeep1] = useState(""); const [keep2, setKeep2] = useState("");
  const [improve1, setImprove1] = useState(""); const [improve2, setImprove2] = useState("");
  const [aiTips, setAiTips] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [openReflectionId, setOpenReflectionId] = useState(null);
  useEffect(() => {
    if (!userId) return;
    loadReflectionsRemote(userId).then(setReflections);
  }, [userId]);
  const todayKeyPath = toKey(new Date());
  const reflectedIds = useMemo(() => new Set(reflections.map((r) => r.trainingRefId)), [reflections]);
  const candidateTrainings = useMemo(() => {
    const official = (officialEvents || []).filter((e) => e.date <= todayKeyPath).map((e) => ({ id: `off_${e.id}`, rawId: e.id, title: e.title, date: e.date, group: true }));
    const personal = (personalLogs || []).filter((e) => e.date <= todayKeyPath).map((e) => ({ id: `pers_${e.id}`, title: e.title, date: e.date, group: false }));
    return [...official, ...personal].filter((t) => !reflectedIds.has(t.id)).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 20);
  }, [officialEvents, personalLogs, todayKeyPath, reflectedIds]);
  const [pastTrainings, setPastTrainings] = useState([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const officialCandidates = candidateTrainings.filter((t) => t.group);
      if (officialCandidates.length === 0) { if (!cancelled) setPastTrainings(candidateTrainings); return; }
      const stillLive = useSupabase()
        ? new Set((await sbRequest("GET", "official_events", { query: `?select=id&id=in.(${officialCandidates.map((t) => t.rawId).join(",")})` })).map((r) => String(r.id)))
        : new Set(officialCandidates.map((t) => t.rawId));
      if (cancelled) return;
      setPastTrainings(candidateTrainings.filter((t) => !t.group || stillLive.has(String(t.rawId))));
    })();
    return () => { cancelled = true; };
  }, [candidateTrainings]);
  function openReflection(training) {
    setReflectingOn(training);
    setKeep1(""); setKeep2(""); setImprove1(""); setImprove2(""); setAiTips(null);
  }
  async function submitInterview() {
    if (!ivName.trim() || !ivAge || !ivDuration.trim() || !ivFitness || !ivValues || !ivMental) {
      showToast?.("נא למלא את כל השדות", "error");
      return;
    }
    setSavingInterview(true);
    try {
      const newProfile = {
        name: ivName.trim(), age: Number(ivAge), duration: ivDuration.trim(),
        fitnessLevel: ivFitness, valuesLevel: ivValues, mentalLevel: ivMental,
        strengths: ivStrengths.map((s) => s.trim()).filter(Boolean),
        completedAt: new Date().toISOString(),
      };
      const updated = { ...plan, athleteProfile: newProfile };
      const saved = await saveTrainingPlan(userId, updated);
      setPlan(saved);
      setAthleteProfile(newProfile);
      setShowInterview(false);
      showToast?.("הפרופיל נשמר! עכשיו נדע להתאים לך משוב מדויק", "success");
    } catch (e) {
      showToast?.("שגיאה בשמירה", "error");
    } finally {
      setSavingInterview(false);
    }
  }
  function addStrengthField() {
    if (ivStrengths.length >= 6) return;
    setIvStrengths((prev) => [...prev, ""]);
  }
  function updateStrength(i, val) {
    setIvStrengths((prev) => prev.map((s, idx) => (idx === i ? val : s)));
  }


  async function submitReflection() {
    if (!keep1.trim() && !keep2.trim() && !improve1.trim() && !improve2.trim()) {
      showToast?.("נא למלא לפחות שדה אחד", "error");
      return;
    }
    setReflectLoading(true);
    try {
      const unitVals = getUnitValues(profile?.targetUnit);
      const profileBlock = athleteProfile
        ? `פרופיל אישי של המתאמן: ${athleteProfile.name}, גיל ${athleteProfile.age}, מתאמן/ת כבר ${athleteProfile.duration}. דירוג כושר עצמי: ${athleteProfile.fitnessLevel}. דירוג ערכים עצמי: ${athleteProfile.valuesLevel}. דירוג יתרונות שכליים עצמי: ${athleteProfile.mentalLevel}.${athleteProfile.strengths.length ? ` יתרונות אישיים שציין: ${athleteProfile.strengths.join(", ")}.` : ""}`
        : "המתאמן עדיין לא מילא פרופיל אישי מלא.";
      const unitBlock = unitVals
        ? `היעד של המתאמן: ${profile?.targetUnitName}. הערכים המרכזיים שהיחידה הזו מחפשת בפועל: ${unitVals.traits.join("; ")}. ${unitVals.focus}`
        : `היעד של המתאמן: ${profile?.targetUnitName || "לא צוין"}.`;
      const sys = `אתה מאמן כושר קרבי עילי לבני נוער 16-19 שמתכוננים לגיוס ליחידות עילית, מבוסס על מדעי ביצועי ספורט, פסיכולוגיה של ביצועים ומחקר מוכח בתחום - לא ניחושים כלליים.
${profileBlock}
${unitBlock}

חניך כתב לך משוב על אימון - מה ששמר טוב ו/או מה שהוא רוצה לשפר. תפקידך להחזיר תשובה עם הסעיפים הבאים, בדיוק בסדר הזה, עם כותרת קצרה לכל סעיף:

**נקודות לשימור** - אם כתב מה ששמר טוב, ציין בפירוש את החוזקות שלו, וקשר אותן ל**ערך ספציפי** שהיחידה שלו מחפשת (מהרשימה למעלה) - למשל אם שמר על עבודת צוות וזו יחידה שמחפשת רעות, תגיד את זה במפורש. אם לא כתב מה ששמר - דלג על הסעיף.

**נקודות לשיפור** - אם כתב מה שהוא רוצה לשפר, תן 3-4 נקודות קצרות וקונקרטיות, מבוססות על עקרונות אמיתיים של תורת האימון (עומס-התאוששות, אדפטציה הדרגתית, ספציפיות האימון), לא המצאות. אם לא כתב - דלג על הסעיף.

**טיפ ליעד שלך** - טיפ אחד ספציפי שמקדם אותו ישירות לכיוון ${profile?.targetUnitName || "היעד שלו"}, מבוסס על ערך ספציפי מהרשימה למעלה שהוא עדיין לא הזכיר או לא מיצה.

**מוטיבציה** - משפט מוטיבציה חזק, אישי וספציפי (לא כללי וקלישאתי) שמזכיר את היעד שלו בשם ונותן לו דחיפה אמיתית להמשיך, בהתבסס על מה שהוא כתב ועל היתרונות האישיים שציין בפרופיל.

בסוף, בשורה נפרדת: תן ציון מספרי 1-10 למשוב עצמו (כמה איכותי, מפורט ומודע-עצמית הוא היה) - לא ציון לאימון עצמו - בפורמט המדויק: "ציון: X/10".
ואז **שאל שאלת המשך אחת טובה** שתעזור למקסם את הסיכוי שלו להתקבל ליחידה הספציפית שלו - שאלה שמכוונת אותו לחשוב על ההיבט הבא שהוא צריך לעבוד עליו, בהתאם לערכי היחידה.
הכל בעברית, חם אך ישיר, בלי הקדמות מיותרות.`;
      const keepParts = [keep1, keep2].filter((s) => s.trim());
      const improveParts = [improve1, improve2].filter((s) => s.trim());
      const userText = [
        keepParts.length ? `שמרתי טוב: ${keepParts.join(" | ")}` : "",
        improveParts.length ? `רוצה לשפר: ${improveParts.join(" | ")}` : "",
      ].filter(Boolean).join("\n");
      const reply = await aiChat(sys, userText);
      setAiTips(reply);
      const saved = await addReflectionRemote(userId, {
        trainingRefId: reflectingOn.id, title: reflectingOn.title, date: reflectingOn.date, group: reflectingOn.group,
        keep1, keep2, improve1, improve2, aiTips: reply,
      });
      setReflections((prev) => [saved, ...prev]);
      if (!reflectingOn.group && reflectingOn.id.startsWith("pers_")) {
        removePersonalLog?.(reflectingOn.id.replace("pers_", ""));
      }
    } catch (e) {
      showToast?.(`שגיאת AI: ${e.message || "לא ידוע"}`, "error");
    } finally {
      setReflectLoading(false);
    }
  }
  const [completedKeys, setCompletedKeys] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_path_completed") || "{}"); } catch (e) { return {}; }
  });
  const [expandedDays, setExpandedDays] = useState(() => new Set([new Date().getDay()]));
  const [dimensionFilter, setDimensionFilter] = useState("all"); // 'all' | 'weak'
  const [dimensionsExpanded, setDimensionsExpanded] = useState(true);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [consistencyWeeks, setConsistencyWeeks] = useState(() => {
    try { return Number(localStorage.getItem("sayert_path_streak_weeks") || 0); } catch (e) { return 0; }
  });
  const [requestingNextWeek, setRequestingNextWeek] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [qDaysPerWeek, setQDaysPerWeek] = useState(4);
  const [qTrainsInGroup, setQTrainsInGroup] = useState(null); // null | true | false
  const [qGroupDays, setQGroupDays] = useState([]); // array of weekday indices (0-6)
  const [qTimeOfDay, setQTimeOfDay] = useState("");
  const [qPriorityDims, setQPriorityDims] = useState([]);
  const [qDivisionNotes, setQDivisionNotes] = useState("");
  const [qSeaAccess, setQSeaAccess] = useState(null);
  const [qGymAccess, setQGymAccess] = useState(null);
  const [qRunLocation, setQRunLocation] = useState("");
  const [qGibush, setQGibush] = useState(() => {
    // If the trainee's target unit already implies a specific gibush, pre-fill it -
    // otherwise leave empty so the questionnaire asks explicitly.
    const impliedMap = { sayeret: "יום סיירות", shayetet: "גיבוש שייטת", chovlim: "גיבוש חובלים", tayas: "גיבוש טיס", yamas: "גיבוש ימ\"ס", shaldag: "יחטיות צנחנים", submarines: "גיבוש צוללות" };
    return impliedMap[profile?.targetUnit] || "";
  });
  const [qExpandedSection, setQExpandedSection] = useState("gibush");
  const qSectionRefs = useRef({});
  const [pathView, setPathView] = useState("plan"); // 'plan' | 'progress' | 'chat'
  const [sessionSearch, setSessionSearch] = useState("");
  const [allDaysExpanded, setAllDaysExpanded] = useState(false);
  const [justCompletedKey, setJustCompletedKey] = useState(null);
  const [undoToast, setUndoToast] = useState(null);
  const [dimensionSort, setDimensionSort] = useState("default"); // 'default' | 'weakest'
  const [copiedShare, setCopiedShare] = useState(false);
  const [renamingSession, setRenamingSession] = useState(null); // { dayIdx, sessionIdx, value }
  const [swappingSession, setSwappingSession] = useState(null); // { dayIdx, sessionIdx, session }
  const [swapReason, setSwapReason] = useState("");
  const [swapTarget, setSwapTarget] = useState(null); // id of a real bank workout
  const [swapCat, setSwapCat] = useState(null);
  const [gibushDraft, setGibushDraft] = useState("");
  const [editingGibush, setEditingGibush] = useState(false);
  const [savingGibush, setSavingGibush] = useState(false);
  const [swapVerdict, setSwapVerdict] = useState(null);
  const [loadingSwapVerdict, setLoadingSwapVerdict] = useState(false);
  const [sessionTips, setSessionTips] = useState({});
  const [loadingTipKey, setLoadingTipKey] = useState(null);
  async function getSessionTip(key, session) {
    setLoadingTipKey(key);
    try {
      const unitLine = profile?.targetUnitName ? ` היעד שלו הוא ${profile.targetUnitName}.` : "";
      const sys = `אתה מאמן כושר קרבי. תן טיפ ביצוע קצר אחד (משפט אחד, מעשי וקונקרטי) לאימון הספציפי הזה - איך לבצע אותו נכון או למקסם ממנו תועלת.${unitLine} בלי הקדמות.`;
      const reply = await aiChat(sys, `טיפ לאימון: ${session.title}`);
      setSessionTips((prev) => ({ ...prev, [key]: reply }));
    } catch (e) {
      setSessionTips((prev) => ({ ...prev, [key]: "התמקד בטכניקה נכונה לפני שמעלים קצב." }));
    } finally {
      setLoadingTipKey(null);
    }
  }
  const [viewingSessionContent, setViewingSessionContent] = useState(null);
  const [schedulingSimSession, setSchedulingSimSession] = useState(null);
  const [schedulingDateTime, setSchedulingDateTime] = useState("");
  const [weekBalanceCheck, setWeekBalanceCheck] = useState(null);
  const [loadingWeekBalance, setLoadingWeekBalance] = useState(false);
  async function checkWeekBalance() {
    setLoadingWeekBalance(true);
    setWeekBalanceCheck(null);
    try {
      const weekSummary = plan.weeklyPlan.map((d) => `${d.day}: ${d.sessions?.length ? d.sessions.map((s) => s.title).join(", ") : "מנוחה"}`).join(" | ");
      const sys = "אתה מאמן כושר קרבי מומחה בעקרונות עומס-התאוששות. קיבלת לוח אימונים שבועי. בדוק אם יש איזון נכון (לא יותר מדי מאותו סוג אימון ברצף, מספיק ימי מנוחה, גיוון בין יכולות). תן משוב קצר של 2-3 משפטים - מה טוב ומה כדאי לשים לב אליו.";
      const reply = await aiChat(sys, `לוח השבוע: ${weekSummary}`);
      setWeekBalanceCheck(reply);
    } catch (e) {
      setWeekBalanceCheck("לא הצלחתי לבדוק את השבוע כרגע.");
    } finally {
      setLoadingWeekBalance(false);
    }
  }
  function openSwapModal(dayIdx, sessionIdx, session) {
    setSwappingSession({ dayIdx, sessionIdx, session });
    setSwapReason("");
    setSwapTarget(null);
    setSwapCat(null);
    setSwapVerdict(null);
  }
  async function getSwapVerdict() {
    if (!swapTarget) return;
    setLoadingSwapVerdict(true);
    setSwapVerdict(null);
    try {
      const weekSummary = plan.weeklyPlan.map((d) => `${d.day}: ${d.sessions?.length ? d.sessions.map((s) => s.title).join(", ") : "מנוחה"}`).join(" | ");
      const sys = `אתה מאמן כושר קרבי מומחה בתכנון עומסי אימון ובעקרון ההתאוששות-הדרגתיות. המתאמן רוצה להחליף אימון בלוח הזמנים השבועי שלו. תן חוות דעת. החזר אך ורק JSON בפורמט: {"score": מספר 1-10 (10=החלפה מצוינת, 1=החלפה בעייתית מאוד), "note": "משפט או שניים שמסבירים האם כדאי, בהתחשב בשאר השבוע ובסיבה שנתן"}`;
      const userMsg = `לוח השבוע המלא: ${weekSummary}. רוצה להחליף את "${swappingSession.session.title}" ב-"${bankWorkouts.find((w) => w.id === swapTarget)?.title || ""}". הסיבה שנתן: ${swapReason.trim() || "לא צוינה סיבה"}.`;
      const reply = await aiChat(sys, userMsg);
      const match = reply.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : { score: 5, note: reply };
      setSwapVerdict(parsed);
    } catch (e) {
      setSwapVerdict({ score: 5, note: "לא הצלחתי לקבל חוות דעת מה-AI כרגע." });
    } finally {
      setLoadingSwapVerdict(false);
    }
  }
  function confirmSwap() {
    const { dayIdx, sessionIdx } = swappingSession;
    const target = bankWorkouts.find((w) => w.id === swapTarget);
    if (!target) return;
    const dimIds = Object.keys(plan.dimensionProgress || {});
    const updated = {
      ...plan,
      weeklyPlan: plan.weeklyPlan.map((day, i) => i !== dayIdx ? day : {
        ...day,
        sessions: day.sessions.map((s, si) => si !== sessionIdx ? s : bankSession(target, pickDimension(target, s.dimension, dimIds))),
      }),
    };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setSwappingSession(null);
    showToast?.("האימון הוחלף", "success");
  }
  const [duplicatingWeek, setDuplicatingWeek] = useState(false);
  const [personalBests, setPersonalBests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_path_bests") || "{}"); } catch (e) { return {}; }
  });
  const [lastActivityDate, setLastActivityDate] = useState(() => {
    try { return localStorage.getItem("sayert_path_last_activity") || null; } catch (e) { return null; }
  });
  const [weekHistory, setWeekHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_path_week_history") || "[]"); } catch (e) { return []; }
  });
  // Which week completedKeys currently represents, as the date-key of that week's Sunday.
  // Without this, a checkmark from three weeks ago would silently still show as "done" for
  // this week's same weekday - nothing ever told the UI a new week had started.
  function currentWeekAnchor() {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return toKey(d);
  }
  const [weekAnchorKey, setWeekAnchorKey] = useState(() => {
    try { return localStorage.getItem("sayert_path_week_anchor") || currentWeekAnchor(); } catch (e) { return currentWeekAnchor(); }
  });
  const [missedSessions, setMissedSessions] = useState([]); // sessions from past days this week that were never checked off
  const [showReorgPrompt, setShowReorgPrompt] = useState(false);
  const [reorgJustApplied, setReorgJustApplied] = useState(false);
  const [withinWeekMissedDismissed, setWithinWeekMissedDismissed] = useState(false);
  // A lightweight completion LOG keyed by real calendar date (distinct from completedKeys,
  // which only ever reflects the current week) - purely for the adherence heatmap/streak math
  // below, so it keeps real history even as completedKeys itself resets every week.
  const [completionLog, setCompletionLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_path_completion_log") || "{}"); } catch (e) { return {}; }
  });
  function logCompletionToday() {
    const key = toKey(new Date());
    setCompletionLog((prev) => {
      const next = { ...prev, [key]: (prev[key] || 0) + 1 };
      try { localStorage.setItem("sayert_path_completion_log", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  const [committedToday, setCommittedToday] = useState(() => {
    try { return localStorage.getItem("sayert_path_committed_date") === toKey(new Date()); } catch (e) { return false; }
  });
  const [weeklyIntention, setWeeklyIntention] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("sayert_path_intention") || "null");
      return raw && raw.weekAnchor === currentWeekAnchor() ? raw.text : "";
    } catch (e) { return ""; }
  });
  const [editingIntention, setEditingIntention] = useState(false);
  const [intentionDraft, setIntentionDraft] = useState("");
  const [pathFontScale, setPathFontScale] = useState(() => {
    try { return Number(localStorage.getItem("sayert_path_font_scale") || 1); } catch (e) { return 1; }
  });
  const [snoozedToast, setSnoozedToast] = useState(null);
  const [lastReorgSnapshot, setLastReorgSnapshot] = useState(null); // for undo
  const [postWorkoutMsg, setPostWorkoutMsg] = useState(null);
  const [moveUndo, setMoveUndo] = useState(null); // last drag-move, so it can be reverted
  const chatEndRef = useRef(null);
  const dayRefs = useRef({});

  // Runs once per PathTab mount: if the stored anchor is not this week's Sunday, a real
  // calendar week has passed since the trainee was last here. Before wiping the old
  // checkmarks, collect which sessions from the stale week were left undone (for the
  // "you fell behind" banner and for week history), then roll completedKeys over.
  useEffect(() => {
    const nowAnchor = currentWeekAnchor();
    if (weekAnchorKey === nowAnchor || !plan?.weeklyPlan) return;
    const weeksElapsed = Math.max(1, Math.round((new Date(nowAnchor) - new Date(weekAnchorKey)) / (7 * 86400000)));
    if (weeksElapsed === 1) {
      const missed = [];
      plan.weeklyPlan.forEach((day, dayIdx) => {
        (day.sessions || []).forEach((s, si) => {
          const key = `${dayIdx}_${si}`;
          if (!completedKeys[key]) missed.push({ day: day.day, title: s.title });
        });
      });
      if (missed.length > 0) setMissedSessions(missed);
    } else {
      // More than a week of total silence - the per-day breakdown is stale and not useful; just flag the gap.
      setMissedSessions([{ day: null, title: null, longGap: weeksElapsed }]);
    }
    setCompletedKeys({});
    try { localStorage.setItem("sayert_path_completed", "{}"); } catch (e) {}
    setWeekAnchorKey(nowAnchor);
    try { localStorage.setItem("sayert_path_week_anchor", nowAnchor); } catch (e) {}
  }, [plan, weekAnchorKey]);

  function toggleQPriority(id) {
    setQPriorityDims((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 5 ? prev : [...prev, id]));
  }
  // Training-theory sanity cap: never let a beginner pick more than the level
  // allows, regardless of what they'd click - this is enforced, not suggested.
  const maxDaysForLevel = profile?.level === "לפני גיוס" || profile?.level === "לפני גיבוש" ? 5 : profile?.level === "מתחילים" ? 4 : 5;

  function toggleCompleted(key) {
    setCompletedKeys((prev) => {
      const wasCompleted = prev[key];
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("sayert_path_completed", JSON.stringify(next)); } catch (e) {}
      if (!wasCompleted) {
        setJustCompletedKey(key);
        setTimeout(() => setJustCompletedKey(null), 900);
        // If this was the last session in its day, celebrate the whole day - not just the one tick.
        const [dIdx] = key.split("_").map(Number);
        const daySessions = (plan?.weeklyPlan?.[dIdx]?.sessions || []);
        const dayKeys = daySessions.map((_, si) => `${dIdx}_${si}`);
        if (dayKeys.length > 0 && dayKeys.every((k) => k === key || next[k])) {
          fxConfetti(["#10b981", "#34d399", "#fbbf24", "#ffffff"], { count: 46 });
        }
        setUndoToast(key);
        setTimeout(() => setUndoToast((cur) => (cur === key ? null : cur)), 4000);
        try { localStorage.setItem("sayert_path_last_activity", toKey(new Date())); } catch (e) {}
        setLastActivityDate(toKey(new Date()));
        logCompletionToday();
        const encouragements = ["כל הכבוד, עוד צעד קדימה", "זה בדיוק מה שבונה אותך", "עקביות היא מה שמנצח", "יפה, תמשיך ככה", "זה נספר - גם היום"];
        setPostWorkoutMsg(encouragements[Math.floor(Math.random() * encouragements.length)]);
        setTimeout(() => setPostWorkoutMsg(null), 3200);
      }
      return next;
    });
  }
  // Days earlier in THIS week (before today) that have a session which was never checked
  // off - this is the "you fell behind a day" case, distinct from the cross-week rollover above.
  const withinWeekMissed = useMemo(() => {
    if (!plan?.weeklyPlan) return [];
    const todayIdx = new Date().getDay();
    const out = [];
    plan.weeklyPlan.forEach((day, dayIdx) => {
      if (dayIdx >= todayIdx) return;
      (day.sessions || []).forEach((s, si) => {
        if (!completedKeys[`${dayIdx}_${si}`]) out.push({ dayIdx, sessionIdx: si, day: day.day, title: s.title });
      });
    });
    return out;
  }, [plan, completedKeys]);
  useEffect(() => { if (withinWeekMissed.length === 0) setWithinWeekMissedDismissed(false); }, [withinWeekMissed.length]);
  // Desktop convenience: arrow keys move which day is expanded. Ignored while typing in any
  // field (inputs, textareas, contenteditable) so it never hijacks normal text editing.
  useEffect(() => {
    function onKeyDown(e) {
      if (pathView !== "plan" || !plan?.weeklyPlan) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const open = [...expandedDays];
      const current = open.length === 1 ? open[0] : new Date().getDay();
      // RTL layout: the day row reads right-to-left, so the right arrow moves to the previous day.
      const next = e.key === "ArrowRight" ? Math.max(0, current - 1) : Math.min(plan.weeklyPlan.length - 1, current + 1);
      if (next === current) return;
      e.preventDefault();
      setExpandedDays(new Set([next]));
      dayRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathView, plan, expandedDays]);
  const touchStartRef = useRef(null);
  function moveToAdjacentDay(direction) {
    // direction: -1 = swipe toward "previous" day, +1 = toward "next" day (RTL-aware, same mapping as arrow keys)
    if (!plan?.weeklyPlan) return;
    const open = [...expandedDays];
    const current = open.length === 1 ? open[0] : new Date().getDay();
    const next = direction === -1 ? Math.max(0, current - 1) : Math.min(plan.weeklyPlan.length - 1, current + 1);
    if (next === current) return;
    setExpandedDays(new Set([next]));
    dayRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function onPlanTouchStart(e) { touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function onPlanTouchEnd(e) {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // require a mostly-horizontal, deliberate swipe
    moveToAdjacentDay(dx > 0 ? 1 : -1); // RTL: finger moving right (dx>0) reveals the next day visually
  }
  // Moves each missed session (oldest first) into the next available rest day from today
  // onward. A day that already has a session is never overwritten - missed work only ever
  // fills in actual gaps, never doubles anyone up.
  function reorganizeMissedDays() {
    if (!plan?.weeklyPlan || withinWeekMissed.length === 0) return;
    const todayIdx = new Date().getDay();
    const openSlots = plan.weeklyPlan
      .map((day, dayIdx) => ({ dayIdx, isOpen: dayIdx >= todayIdx && (day.sessions || []).length === 0 }))
      .filter((x) => x.isOpen)
      .map((x) => x.dayIdx);
    if (openSlots.length === 0) {
      showToast?.("אין ימים פנויים השבוע להעביר אליהם - נסה למחוק יום מנוחה ידנית", "error");
      return;
    }
    const toMove = withinWeekMissed.slice(0, openSlots.length);
    const weeklyPlan = plan.weeklyPlan.map((day, dayIdx) => {
      const incomingSlot = openSlots.indexOf(dayIdx);
      if (incomingSlot !== -1 && incomingSlot < toMove.length) {
        return { ...day, sessions: [{ ...plan.weeklyPlan[toMove[incomingSlot].dayIdx].sessions[toMove[incomingSlot].sessionIdx] }] };
      }
      const stillMissedHere = toMove.some((m) => m.dayIdx === dayIdx);
      if (stillMissedHere) return { ...day, sessions: [] };
      return day;
    });
    setLastReorgSnapshot(plan.weeklyPlan);
    const updated = { ...plan, weeklyPlan };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setShowReorgPrompt(false);
    setReorgJustApplied(true);
    setTimeout(() => setReorgJustApplied(false), 2600);
    fxConfetti(["#10b981", "#34d399", "#ffffff"], { count: 30 });
    showToast?.(toMove.length < withinWeekMissed.length ? `${toMove.length} אימונים סודרו מחדש - לא נשאר מקום לכולם` : "האימונים סודרו מחדש השבוע", "success");
  }
  // Real streak/heatmap computed from the date-keyed log, independent of this week's
  // completedKeys - so it stays accurate across week boundaries instead of resetting.
  const last30 = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = toKey(d);
      days.push({ key, has: Boolean(completionLog[key]) });
    }
    return days;
  }, [completionLog]);
  const logStreak = useMemo(() => {
    let s = 0; const d = new Date();
    if (!completionLog[toKey(d)]) d.setDate(d.getDate() - 1);
    while (completionLog[toKey(d)]) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }, [completionLog]);
  const bestLogStreak = useMemo(() => {
    let best = 0, run = 0;
    last30.forEach((d) => { if (d.has) { run++; best = Math.max(best, run); } else run = 0; });
    return best;
  }, [last30]);
  function commitToday() {
    setCommittedToday(true);
    try { localStorage.setItem("sayert_path_committed_date", toKey(new Date())); } catch (e) {}
    showToast?.("רשמנו - בהצלחה באימון", "success");
  }
  function saveWeeklyIntention() {
    setWeeklyIntention(intentionDraft.trim());
    try { localStorage.setItem("sayert_path_intention", JSON.stringify({ weekAnchor: currentWeekAnchor(), text: intentionDraft.trim() })); } catch (e) {}
    setEditingIntention(false);
  }
  function snoozeToTomorrow(dayIdx, sessionIdx) {
    if (!plan?.weeklyPlan) return;
    const targetIdx = dayIdx + 1;
    if (targetIdx > 6 || (plan.weeklyPlan[targetIdx]?.sessions || []).length > 0) {
      showToast?.("אין מקום פנוי מחר להעביר אליו", "error");
      return;
    }
    const session = plan.weeklyPlan[dayIdx].sessions[sessionIdx];
    const weeklyPlan = plan.weeklyPlan.map((day, i) => {
      if (i === dayIdx) return { ...day, sessions: day.sessions.filter((_, si) => si !== sessionIdx) };
      if (i === targetIdx) return { ...day, sessions: [session] };
      return day;
    });
    const updated = { ...plan, weeklyPlan };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setSnoozedToast(session.title);
    setTimeout(() => setSnoozedToast(null), 3000);
  }
  function printWeek() {
    document.body.classList.add("print-mode");
    const cleanup = () => { document.body.classList.remove("print-mode"); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => window.print(), 50);
  }
  function exportWeekToICS() {
    if (!plan?.weeklyPlan) return;
    const sunday = new Date(); sunday.setDate(sunday.getDate() - sunday.getDay());
    const pad = (n) => String(n).padStart(2, "0");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SayertTracking//he"];
    plan.weeklyPlan.forEach((day, i) => {
      (day.sessions || []).forEach((s) => {
        const d = new Date(sunday); d.setDate(d.getDate() + i); d.setHours(18, 0, 0, 0);
        const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
        const end = new Date(d.getTime() + 60 * 60000);
        const endStamp = `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00`;
        lines.push("BEGIN:VEVENT", `UID:${i}-${s.title.replace(/\s/g, "")}-${sunday.getTime()}@sayert`, `DTSTART:${stamp}`, `DTEND:${endStamp}`, `SUMMARY:${s.title}`, "END:VEVENT");
      });
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "המסלול-שלי.ics";
    a.click();
    URL.revokeObjectURL(url);
  }
  function copyTodayWorkout() {
    const todayIdx = new Date().getDay();
    const sessions = plan?.weeklyPlan?.[todayIdx]?.sessions || [];
    if (sessions.length === 0) { showToast?.("אין אימון היום להעתיק", "info"); return; }
    navigator.clipboard?.writeText(sessions.map((s) => s.title).join("\n"));
    showToast?.("הועתק", "success");
  }
  function markAllDoneToday() {
    const todayIdx = new Date().getDay();
    const sessions = plan?.weeklyPlan?.[todayIdx]?.sessions || [];
    if (sessions.length === 0) return;
    setCompletedKeys((prev) => {
      const next = { ...prev };
      sessions.forEach((_, si) => { next[`${todayIdx}_${si}`] = true; });
      try { localStorage.setItem("sayert_path_completed", JSON.stringify(next)); } catch (e) {}
      return next;
    });
    logCompletionToday();
    fxConfetti(["#10b981", "#34d399", "#ffffff"], { count: 30 });
  }
  function undoReorganize() {
    if (!lastReorgSnapshot) return;
    const updated = { ...plan, weeklyPlan: lastReorgSnapshot };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setLastReorgSnapshot(null);
    setReorgJustApplied(false);
    showToast?.("בוטל", "success");
  }
  // The command center shows one selected day at a time; it reuses expandedDays (a one-item set)
  // as that selection so the arrow keys and swipe gestures keep driving the same thing.
  const selectedDayIdx = expandedDays.size === 1 ? [...expandedDays][0] : new Date().getDay();
  function selectDay(i) { setExpandedDays(new Set([i])); }
  // Drag a workout from one day onto another: onto a free day it moves, onto a booked day the two swap.
  function moveSessionBetweenDays(from, to) {
    if (!plan?.weeklyPlan || from === to) return;
    const wp = plan.weeklyPlan;
    const a = wp[from]?.sessions || [];
    const b = wp[to]?.sessions || [];
    if (a.length === 0) return;
    setMoveUndo({ weeklyPlan: wp, completedKeys });
    const weeklyPlan = wp.map((d, i) => (i === from ? { ...d, sessions: b } : i === to ? { ...d, sessions: a } : d));
    const nextCompleted = { ...completedKeys };
    const moveFlags = (fromIdx, toIdx, count) => Array.from({ length: count }).map((_, si) => ({ si, v: completedKeys[`${fromIdx}_${si}`] }));
    a.forEach((_, si) => { delete nextCompleted[`${from}_${si}`]; });
    b.forEach((_, si) => { delete nextCompleted[`${to}_${si}`]; });
    moveFlags(from, to, a.length).forEach(({ si, v }) => { if (v) nextCompleted[`${to}_${si}`] = true; });
    moveFlags(to, from, b.length).forEach(({ si, v }) => { if (v) nextCompleted[`${from}_${si}`] = true; });
    setCompletedKeys(nextCompleted);
    try { localStorage.setItem("sayert_path_completed", JSON.stringify(nextCompleted)); } catch (e) {}
    const updated = { ...plan, weeklyPlan };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    selectDay(to);
    showToast?.(b.length ? "האימונים הוחלפו" : "האימון הועבר", "success");
    setTimeout(() => setMoveUndo((cur) => (cur && cur.weeklyPlan === wp ? null : cur)), 8000);
  }
  function undoMove() {
    if (!moveUndo) return;
    const updated = { ...plan, weeklyPlan: moveUndo.weeklyPlan };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setCompletedKeys(moveUndo.completedKeys);
    try { localStorage.setItem("sayert_path_completed", JSON.stringify(moveUndo.completedKeys)); } catch (e) {}
    setMoveUndo(null);
  }
  function undoComplete(key) {
    setCompletedKeys((prev) => {
      const next = { ...prev, [key]: false };
      try { localStorage.setItem("sayert_path_completed", JSON.stringify(next)); } catch (e) {}
      return next;
    });
    setUndoToast(null);
  }
  function toggleDayExpanded(dayIdx) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayIdx)) next.delete(dayIdx); else next.add(dayIdx);
      return next;
    });
  }
  function toggleAllDays() {
    if (!plan) return;
    if (allDaysExpanded) { setExpandedDays(new Set()); setAllDaysExpanded(false); }
    else { setExpandedDays(new Set(plan.weeklyPlan.map((_, i) => i))); setAllDaysExpanded(true); }
  }
  function removeSession(dayIdx, sessionIdx) {
    const updated = { ...plan, weeklyPlan: plan.weeklyPlan.map((day, i) => i !== dayIdx ? day : { ...day, sessions: day.sessions.filter((_, si) => si !== sessionIdx) }) };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
  }
  function startRenameSession(dayIdx, sessionIdx, currentTitle) {
    setRenamingSession({ dayIdx, sessionIdx, value: currentTitle });
  }
  function confirmRenameSession() {
    if (!renamingSession) return;
    const { dayIdx, sessionIdx, value } = renamingSession;
    const updated = { ...plan, weeklyPlan: plan.weeklyPlan.map((day, i) => i !== dayIdx ? day : { ...day, sessions: day.sessions.map((s, si) => si !== sessionIdx ? s : { ...s, title: value }) }) };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setRenamingSession(null);
  }
  async function duplicateLastWeek() {
    setDuplicatingWeek(true);
    try {
      const newStreak = consistencyWeeks + 1;
      setConsistencyWeeks(newStreak);
      try { localStorage.setItem("sayert_path_streak_weeks", String(newStreak)); } catch (e) {}
      const historyEntry = { week: newStreak, completedCount: weekStats.completedCount, total: weekStats.total, date: toKey(new Date()) };
      const nextHistory = [...weekHistory, historyEntry].slice(-8);
      setWeekHistory(nextHistory);
      try { localStorage.setItem("sayert_path_week_history", JSON.stringify(nextHistory)); } catch (e) {}
      setAddedKeys({});
      setCompletedKeys({});
      showToast?.("השבוע שוכפל!", "success");
    } finally {
      setDuplicatingWeek(false);
    }
  }
  function sharePlan() {
    if (!plan) return;
    const lines = [plan.title, ...plan.weeklyPlan.map((d) => `${d.day}: ${d.sessions?.length ? d.sessions.map((s) => s.title).join(", ") : "מנוחה"}`)];
    const text = lines.join("\n");
    if (navigator.share) { navigator.share({ title: plan.title, text }); return; }
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    });
  }

  useEffect(() => {
    (async () => {
      setLoadingPlan(true);
      let p = await loadTrainingPlan(userId);
      // Self-heal legacy plans built before the 7-dimension system existed - they
      // still have all 15 stored. Trim to the 7 with real progress first, then fill
      // from priorities/defaults, and persist the fix so it only happens once.
      if (p?.dimensionProgress && Object.keys(p.dimensionProgress).length > 7) {
        const entries = Object.entries(p.dimensionProgress);
        const withProgress = entries.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([id]) => id);
        const rest = entries.filter(([, v]) => v === 0).map(([id]) => id);
        const trimmedIds = [...withProgress, ...rest].slice(0, 7);
        const trimmedProgress = {};
        trimmedIds.forEach((id) => { trimmedProgress[id] = p.dimensionProgress[id]; });
        p = { ...p, dimensionProgress: trimmedProgress };
        saveTrainingPlan(userId, p);
      }
      setPlan(p);
      setAthleteProfile(p?.athleteProfile || null);
      setLoadingPlan(false);
    })();
  }, [userId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [plan?.chatHistory?.length]);
  useEffect(() => { if (!simsLoaded) loadSimsData(); }, []);

  // THE BANK IS THE ONLY SOURCE OF WORKOUTS. Every session in a plan is exactly one real bank
  // entry - its id, its exact bank title, its bank category. Nothing is ever invented by the AI.
  const bankWorkouts = (trainingContent || [])
    .filter((t) => t.title && t.title !== "עקרונות ומטרות")
    .map((t) => {
      const cat = TRAINING_BANK.find((b) => b.id === t.subcategory);
      return cat ? { id: t.id, title: t.title, catId: cat.id, catTitle: cat.title, difficulty: t.difficulty || "" } : null;
    })
    .filter(Boolean);
  const bankListText = bankWorkouts.map((w, i) => `${i + 1}. [${w.catTitle}] ${w.title}${w.difficulty ? ` (${w.difficulty})` : ""}`).join("\n");
  function bankSession(w, dimension) {
    return { contentId: w.id, title: w.title, category: w.catTitle, categoryId: w.catId, dimension };
  }
  function pickDimension(w, raw, allowedIds) {
    const okList = allowedIds && allowedIds.length ? allowedIds : PLAN_DIMENSIONS.map((d) => d.id);
    if (raw && okList.includes(raw)) return raw;
    const byCat = BANK_CAT_TO_DIM[w.catId];
    if (byCat && okList.includes(byCat)) return byCat;
    return okList[0] || "endurance";
  }
  // Turns whatever the AI returned into a week made only of real bank workouts, at most one per
  // day. A session that doesn't map to a real bank entry is dropped - it never reaches the screen.
  function normalizeWeeklyPlanToBank(weeklyPlan, allowedDimIds) {
    return weeklyPlan.map((day) => {
      const raw = Array.isArray(day.sessions) ? day.sessions[0] : null;
      if (!raw) return { ...day, sessions: [] };
      let w = null;
      if (raw.workoutNo != null && bankWorkouts[Number(raw.workoutNo) - 1]) w = bankWorkouts[Number(raw.workoutNo) - 1];
      if (!w && raw.contentId) w = bankWorkouts.find((x) => x.id === raw.contentId) || null;
      if (!w && raw.title) w = bankWorkouts.find((x) => x.title === raw.title) || null;
      if (!w) return { ...day, sessions: [] };
      return { ...day, sessions: [bankSession(w, pickDimension(w, raw.dimension, allowedDimIds))] };
    });
  }
  // Plans saved before this rule existed may hold invented names or several workouts on a day.
  // Convert them once: keep only real bank workouts, one per day, under the bank's exact names.
  useEffect(() => {
    if (!plan || !Array.isArray(plan.weeklyPlan) || bankWorkouts.length === 0) return;
    const isClean = plan.weeklyPlan.every((d) => (d.sessions || []).length <= 1 && (d.sessions || []).every((s) => {
      const w = bankWorkouts.find((x) => x.id === s.contentId);
      return w && w.title === s.title && w.catTitle === s.category;
    }));
    if (isClean) return;
    const used = new Set(plan.weeklyPlan.flatMap((d) => (d.sessions || []).map((s) => s.contentId || bankWorkouts.find((x) => x.title === s.title)?.id).filter(Boolean)));
    const dimIds = Object.keys(plan.dimensionProgress || {});
    const fixedWeekly = plan.weeklyPlan.map((d) => {
      const raw = (d.sessions || [])[0];
      if (!raw) return { ...d, sessions: [] };
      let w = raw.contentId ? bankWorkouts.find((x) => x.id === raw.contentId) : null;
      if (!w && raw.title) w = bankWorkouts.find((x) => x.title === raw.title) || null;
      if (!w && raw.category) w = bankWorkouts.find((x) => (x.catTitle === raw.category || x.catId === raw.category) && !used.has(x.id)) || null;
      if (!w) return { ...d, sessions: [] };
      used.add(w.id);
      return { ...d, sessions: [bankSession(w, pickDimension(w, raw.dimension, dimIds))] };
    });
    const fixed = { ...plan, weeklyPlan: fixedWeekly };
    setPlan(fixed);
    saveTrainingPlan(userId, fixed).catch(() => {});
  }, [plan, trainingContent]);

  // ---- Dates on the weekly schedule: the gibush date and scheduled simulations ----
  // weeklyPlan[i] is weekday i (0 = Sunday) of the CURRENT week.
  const weekDateKeys = Array.from({ length: 7 }).map((_, i) => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + i); return toKey(d); });
  const gibushKey = profile?.gibushDate || null;
  const gibushDayIdx = gibushKey ? weekDateKeys.indexOf(gibushKey) : -1;
  const daysToGibush = gibushKey ? Math.round((new Date(`${gibushKey}T00:00:00`) - new Date(new Date().toDateString())) / 86400000) : null;
  const gibushHexPath = (GIBUSH_TYPE_COLORS[profile?.gibushType] || {}).hex || "#f59e0b";
  const simsByDayIdx = {};
  (mySimSessions || []).filter((s) => s.scheduledAt && s.status !== "completed").forEach((s) => {
    const idx = weekDateKeys.indexOf(toKey(new Date(s.scheduledAt)));
    if (idx >= 0) (simsByDayIdx[idx] = simsByDayIdx[idx] || []).push(s);
  });
  async function saveGibushDate() {
    if (!gibushDraft) { showToast?.("בחר/י תאריך", "error"); return; }
    setSavingGibush(true);
    try {
      await onSetGibushDate?.(gibushDraft, profile?.gibushType || qGibush || "");
      setEditingGibush(false);
      showToast?.("מועד הגיבוש נקבע", "success");
    } finally {
      setSavingGibush(false);
    }
  }

  function buildPlanSystemPrompt() {
    const cappedDays = Math.min(qDaysPerWeek || maxDaysForLevel, maxDaysForLevel);
    const priorityLabels = qPriorityDims.length ? PLAN_DIMENSIONS.filter((d) => qPriorityDims.includes(d.id)).map((d) => d.label).join(", ") : "אין העדפה מפורשת - תחליט אתה מה הכי רלוונטי";
    const dimensionIdList = PLAN_DIMENSIONS.map((d) => d.id).join("/");
    const gibushFocus = GIBUSH_TRAINING_FOCUS[qGibush];
    const gibushBlock = gibushFocus
      ? `הגיבוש שהמתאמן מתכונן אליו: ${qGibush}. ידע מקצועי על מה שבאמת נדרש בגיבוש הזה: ${gibushFocus.note} הרבדים המומלצים ביותר לגיבוש הזה: ${gibushFocus.dims.map((id) => PLAN_DIMENSIONS.find((d) => d.id === id)?.label).join(", ")} - תן להם משקל כבד ב-7 הרבדים שתבחר, אלא אם המתאמן סימן עדיפויות אחרות שסותרות זאת (העדפה מפורשת שלו גוברת).`
      : "המתאמן לא ציין גיבוש ספציפי - בסס את הבחירה על היעד ועל מה שסימן.";
    const accessBlock = `נגישות: ${qSeaAccess === false ? "אין גישה לים - אל תבנה sessions שדורשים שחייה/צלילה בים, גם אם היו רלוונטיים לגיבוש." : qSeaAccess === true ? "יש גישה לים - אימוני מים אפשריים אם רלוונטי." : ""} ${qGymAccess === false ? "אין גישה לחדר כושר - העדף אימונים ללא ציוד/משקל גוף." : qGymAccess === true ? "יש גישה לחדר כושר - אימוני כוח עם משקולות אפשריים." : ""} ${qRunLocation ? `מיקום ריצה זמין: ${qRunLocation} - התייחס לזה בשדה notes של אימוני ריצה.` : ""}`;
    const weekdayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const groupBlock = qTrainsInGroup === true && qGroupDays.length > 0
      ? `המתאמן מתאמן גם באימון קבוצתי (עם מגבש/קבוצה) בימים הבאים: ${qGroupDays.map((d) => weekdayNames[d]).join(", ")}. חשוב מאוד: אל תבנה עוד אימון אישי מלא ומאתגר באותם ימים - הגוף כבר עומס שם באימון הקבוצתי. לכן בימים האלה שים sessions: [] (ללא אימון אישי) כדי לא לגרום לעומס-יתר ופציעה - אל תמציא אימוני מתיחות או תוספות, רק אימונים מהרשימה הממוספרת. רכז את האימונים האישיים המשמעותיים והמאתגרים בימים שאינם ימי קבוצה.`
      : qTrainsInGroup === false
      ? "המתאמן אינו מתאמן בשום מסגרת קבוצתית - כל האימונים בתוכנית הם עליו לבד, תכנן עומסים בהתאם (בלי להניח שיש עומס נוסף ממקור אחר)."
      : "";
    const notesBlock = qDivisionNotes.trim() ? `הערות חלוקה מהמתאמן עצמו (חשוב להתחשב בהן): ${qDivisionNotes.trim()}` : "";
    return `אתה בונה תוכניות אימונים מקצועיות למתאמנים עצמאיים בהכנה לגיוס ליחידות עילית, לפי עקרונות תורת האימון (periodization) - לא רשימה אקראית של אימונים.
פרטי המתאמן: גיל ${profile?.age || "לא ידוע"}, יעד: ${profile?.targetUnitName || "לא נבחר"}, רמת כושר: ${profile?.level || "לא ידוע"}.
${gibushBlock}
${accessBlock}
${groupBlock}
${notesBlock}
העדפת זמן אימון: ${qTimeOfDay || "גמיש"}. רבדים בעדיפות שסימן בעצמו: ${priorityLabels}.
**רשימת האימונים היחידה שמותר לבחור ממנה** - זה המאגר האמיתי של האפליקציה. אסור להמציא שום אימון, שום שם ושום קטגוריה שלא מופיעים ברשימה. בכל בחירה מציינים אך ורק את המספר של האימון מהרשימה:\n${bankListText || "המאגר ריק - החזר את כל הימים עם sessions ריק"}
15 הרבדים האפשריים במערכת (מזהה: תווית): ${PLAN_DIMENSIONS.map((d) => `${d.id}: ${d.label}`).join(", ")}.

**משימה קריטית לפני בניית התוכנית עצמה:** תבחר בדיוק 7 מתוך 15 הרבדים - לא יותר, לא פחות - שהכי רלוונטיים **למתאמן הספציפי הזה**. הבחירה חייבת להתבסס על:
- **הגיבוש שלו** (אם צוין למעלה) - הרבדים המומלצים לגיבוש חייבים לקבל עדיפות.
- **היעד שלו** (${profile?.targetUnitName || "לא נבחר"}).
- **הגיל שלו** (${profile?.age || "לא ידוע"}) - מתאמן צעיר יותר, תן משקל גבוה יותר לבניית יסודות; מבוגר יותר, אפשר יותר עומס.
- **הרבדים שסימן בעצמו כעדיפות** - אלה חייבים להיכלל בבחירה שלך אם סימן כאלה, וגוברים על המלצת הגיבוש הכללית.
15 רבדים על מסך אחד זה מכוער ולא הגיוני עבור אדם אחד - **חובה בדיוק 7**, אישיים ורלוונטיים אליו בלבד.

חוקי תורת אימון מחייבים, ללא יוצא מן הכלל:
- **בדיוק ${cappedDays} ימי אימון בשבוע, לא יותר** (זה תקרה מחושבת לפי רמת הכושר - אף פעם לא 6-7 ימים, זה לא הגיוני ומוביל לפציעות ושחיקה). שאר הימים - sessions: [] (מנוחה מלאה).
- **בכל יום אימון - אימון אחד בדיוק מהרשימה הממוספרת, לעולם לא שניים או יותר.** מערך ה-sessions של כל יום מכיל תמיד פריט אחד בלבד (או אפס, ליום מנוחה). אסור לשלב כמה אימונים ביום אחד, אסור להמציא אימון, ואסור לשנות שם של אימון - הבחירה היא מספר מהרשימה בלבד.
- שילוב מאוזן בין **בניית יסודות** (סיבולת בסיסית, טכניקה, גמישות) ו**עבודת כוח** (כוח פלג עליון/תחתון/ליבה, כוח מתפרץ) - לא רק ריצות, לא רק כוח.
- **פיזור נכון**: לא שני אימוני עומס גבוה ברצף בלי יום התאוששות ביניהם.
- מתקדם בהדרגה (למתחילים בפרט - להתחיל קל יחסית ולבנות עומס עם הזמן, לא לקפוץ ישר לעומס גבוה).
- כל session.dimension בתוכנית השבועית **חייב** להיות אחד מ-7 המזהים שבחרת ב-selectedDimensions, לא מזהה אחר.
- כבד את הגבלות הנגישות (ים/חדר כושר/מיקום ריצה) ואת הערות החלוקה של המתאמן.

החזר אך ורק JSON תקין בפורמט הבא, בלי שום טקסט נוסף לפניו או אחריו:
{"title": "כותרת קצרה לתוכנית", "selectedDimensions": ["בדיוק 7 מזהי רבדים מתוך: ${dimensionIdList}"], "weeklyPlan": [{"day": "ראשון", "sessions": [{"workoutNo": מספר מהרשימה הממוספרת, "dimension": "אחד מ-7 המזהים שבחרת ב-selectedDimensions בלבד"}]}], "reasoning": "2-3 משפטים על ההיגיון מאחורי התוכנית, כולל למה בחרת דווקא את 7 הרבדים האלה למתאמן הזה"}
ימים בלי אימון - שים sessions: [] (יום מנוחה). אל תחרוג מהפורמט.`;
  }

  function parsePlanJson(text) {
    const cleaned = text.replace(/```json\s*|```\s*/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    let parsed;
    try { parsed = JSON.parse(match[0]); } catch (e) { return null; }
    // Hard safeguard: even with an explicit instruction, the AI can still return
    // more than one session for a single day - enforce the real rule here rather
    // than trusting compliance, since a user seeing two workouts stacked on the
    // same day is a real, visible bug regardless of why it happened. Applies to
    // every caller (initial generation, plan-chat edits, next-week requests).
    if (Array.isArray(parsed?.weeklyPlan)) {
      const allowed = Array.isArray(parsed.selectedDimensions) && parsed.selectedDimensions.length ? parsed.selectedDimensions : Object.keys(plan?.dimensionProgress || {});
      parsed.weeklyPlan = normalizeWeeklyPlanToBank(parsed.weeklyPlan, allowed);
    }
    return parsed;
  }

  async function generatePlan() {
    if (bankWorkouts.length === 0) { showToast?.("המאגר עדיין ריק, אין ממה לבנות מסלול", "error"); return; }
    setGenerating(true);
    try {
      const sys = buildPlanSystemPrompt();
      const reply = await aiChat(sys, "בנה לי את התוכנית השבועית הראשונה שלי.", []);
      const parsed = parsePlanJson(reply);
      if (!parsed?.weeklyPlan) { showToast?.("לא הצלחתי לבנות תוכנית כרגע, נסה שוב", "error"); return; }
      if (!parsed.weeklyPlan.some((d) => d.sessions?.length)) { showToast?.("ה-AI לא בחר אימונים מהמאגר. לא שמרתי כלום, נסה שוב", "error"); return; }
      // The AI picks exactly 7 of the 15 dimensions, personalized to this trainee -
      // validate its choice and fall back to a sensible default if it didn't comply.
      const validIds = new Set(PLAN_DIMENSIONS.map((d) => d.id));
      let selected = Array.isArray(parsed.selectedDimensions) ? parsed.selectedDimensions.filter((id) => validIds.has(id)) : [];
      selected = [...new Set(selected)];
      if (selected.length !== 7) {
        const fallback = [...qPriorityDims, ...PLAN_DIMENSIONS.map((d) => d.id)];
        selected = [...new Set(fallback)].slice(0, 7);
      }
      const dimensionProgress = {};
      selected.forEach((id) => { dimensionProgress[id] = 0; });
      // Every session's dimension must be one of the final 7 (the AI's own pick may have been replaced above).
      const finalDims = new Set(selected);
      const weeklyForPlan = parsed.weeklyPlan.map((d) => ({
        ...d,
        sessions: (d.sessions || []).map((s) => {
          if (finalDims.has(s.dimension)) return s;
          const w = bankWorkouts.find((x) => x.id === s.contentId);
          return { ...s, dimension: w ? pickDimension(w, null, selected) : selected[0] };
        }),
      }));
      const newPlan = {
        title: parsed.title || `המסלול של ${profile?.fullName?.split(" ")[0] || ""} ליחידת ${profile?.targetUnitName || ""}`,
        unitId: profile?.targetUnit || "", unitName: profile?.targetUnitName || "", level: profile?.level || "",
        weeklyPlan: weeklyForPlan, dimensionProgress,
        chatHistory: [{ role: "assistant", text: parsed.reasoning || "בניתי לך תוכנית ראשונה - תגידו לי אם תרצו לשנות משהו!" }],
      };
      const saved = await saveTrainingPlan(userId, newPlan);
      setPlan(saved);
      showToast?.("המסלול שלך מוכן!", "success");
    } catch (e) {
      showToast?.("שגיאה בבניית התוכנית", "error");
    } finally {
      setGenerating(false);
    }
  }

  async function sendPlanChat(overrideText) {
    const text = (overrideText ?? chatInput).trim();
    if (!text || !plan) return;
    setChatInput("");
    const nextHistory = [...plan.chatHistory, { role: "user", text }];
    setPlan({ ...plan, chatHistory: nextHistory });
    setSendingChat(true);
    try {
      const isPeriodizedRequest = /בניה ואיכות|אוניברסיטא|periodization/i.test(text);
      const sys = `${buildPlanSystemPrompt()}
זו לא הבנייה הראשונה - יש כבר תוכנית קיימת: ${JSON.stringify(plan.weeklyPlan)}.
המשתמש מבקש שינוי או שואל שאלה. אם זו בקשת שינוי (להזיז/למחוק/לשנות אימונים) - שנה רק את מה שביקש, לפי התאריכים/תנאים שציין, והחזר שוב JSON מלא באותו פורמט בדיוק (weeklyPlan+title+reasoning) עם השינוי המבוקש בלבד ושאר התוכנית ללא שינוי.
${isPeriodizedRequest ? "המשתמש ביקש גישה מקצועית בסגנון תכנון תקופתי (periodization) של אוניברסיטאות מובילות בארה\"ב - התאם את התוכנית לעקרונות כאלה: מחזורי עומס והתאוששות, פסגת ביצוע לקראת תאריך יעד." : ""}
אם זו רק שאלה (לא בקשת שינוי) - ענה בטקסט חופשי קצר וידידותי, בלי JSON.`;
      const reply = await aiChat(sys, text, plan.chatHistory);
      const parsed = parsePlanJson(reply);
      let updatedPlan;
      if (parsed?.weeklyPlan && parsed.weeklyPlan.some((d) => d.sessions?.length)) {
        updatedPlan = { ...plan, weeklyPlan: parsed.weeklyPlan, title: parsed.title || plan.title, chatHistory: [...nextHistory, { role: "assistant", text: parsed.reasoning || "עדכנתי את התוכנית!", isPlanUpdate: true }] };
        showToast?.("התוכנית עודכנה", "success");
      } else {
        updatedPlan = { ...plan, chatHistory: [...nextHistory, { role: "assistant", text: parsed?.weeklyPlan ? "לא הצלחתי לבחור אימונים מהמאגר לשינוי הזה, התוכנית נשארה כמו שהיא." : reply }] };
      }
      const saved = await saveTrainingPlan(userId, updatedPlan);
      setPlan(saved);
    } catch (e) {
      showToast?.("שגיאה בשליחה", "error");
    } finally {
      setSendingChat(false);
    }
  }
  function sendQuickPrompt(text) {
    sendPlanChat(text);
  }
  function clearPlanChat() {
    const updated = { ...plan, chatHistory: [] };
    setPlan(updated);
    saveTrainingPlan(userId, updated);
    setClearChatConfirm(false);
  }

  function findNextTrainingDate(dayName) {
    const idx = WEEK_DAYS_HE.indexOf(dayName);
    if (idx === -1) return toKey(new Date());
    const now = new Date();
    const diff = (idx - now.getDay() + 7) % 7;
    const target = new Date(now);
    target.setDate(now.getDate() + (diff === 0 ? 7 : diff));
    return toKey(target);
  }

  async function confirmAddToCalendar() {
    if (!addingSession || !addTimes.start || !addTimes.end) return;
    const { dayIdx, sessionIdx } = addingSession;
    const day = plan.weeklyPlan[dayIdx];
    const session = day.sessions[sessionIdx];
    const date = findNextTrainingDate(day.day);
    await addPersonalLog({ id: Date.now(), date, time: addTimes.start, endTime: addTimes.end, title: session.title, detail: session.notes || "", category: session.category || "" });
    if (plan.id) await addPlanCalendarItem(userId, plan.id, { title: session.title, category: session.category, date, startTime: addTimes.start, endTime: addTimes.end });
    setAddedKeys((prev) => ({ ...prev, [`${dayIdx}_${sessionIdx}`]: true }));
    setAddingSession(null);
    setAddTimes({ start: "", end: "" });
    showToast?.("נוסף ליומן!", "success");
  }

  const nextSession = useMemo(() => {
    if (!plan) return null;
    const todayIdx = new Date().getDay();
    for (let i = todayIdx; i < plan.weeklyPlan.length; i++) {
      const day = plan.weeklyPlan[i];
      if (day.sessions?.length && !completedKeys[`${i}_0`]) return { day: day.day, session: day.sessions[0] };
    }
    for (const day of plan.weeklyPlan) {
      if (day.sessions?.length) return { day: day.day, session: day.sessions[0] };
    }
    return null;
  }, [plan, completedKeys]);

  const weekStats = useMemo(() => {
    if (!plan) return { total: 0, addedCount: 0, completedCount: 0, restDays: 0 };
    let total = 0, addedCount = 0, completedCount = 0, restDays = 0;
    plan.weeklyPlan.forEach((day, dayIdx) => {
      if (!day.sessions || day.sessions.length === 0) { restDays++; return; }
      day.sessions.forEach((s, sessionIdx) => {
        total++;
        const key = `${dayIdx}_${sessionIdx}`;
        if (addedKeys[key]) addedCount++;
        if (completedKeys[key]) completedCount++;
      });
    });
    return { total, addedCount, completedCount, restDays };
  }, [plan, addedKeys, completedKeys]);

  // The trainee's own personalized 7 dimensions, chosen by the AI at plan-creation
  // time - derived from dimensionProgress's keys so no extra DB field is needed.
  const myDimensions = useMemo(() => {
    if (!plan?.dimensionProgress) return [];
    return PLAN_DIMENSIONS.filter((d) => Object.prototype.hasOwnProperty.call(plan.dimensionProgress, d.id));
  }, [plan]);

  const weakDimensions = useMemo(() => {
    if (!plan) return [];
    return myDimensions.filter((d) => (plan.dimensionProgress?.[d.id] || 0) < 40);
  }, [plan, myDimensions]);

  const readinessScore = useMemo(() => {
    if (!plan || myDimensions.length === 0) return 0;
    const values = myDimensions.map((d) => plan.dimensionProgress?.[d.id] || 0);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [plan, myDimensions]);

  const sortedDimensions = useMemo(() => {
    const list = dimensionFilter === "weak" ? weakDimensions : myDimensions;
    if (dimensionSort !== "weakest") return list;
    return [...list].sort((a, b) => (plan?.dimensionProgress?.[a.id] || 0) - (plan?.dimensionProgress?.[b.id] || 0));
  }, [dimensionFilter, dimensionSort, weakDimensions, myDimensions, plan]);

  // Detects a dimension crossing its own previous high the moment it updates -
  // used to flare a "personal best" badge instead of just showing the number.
  useEffect(() => {
    if (!plan?.dimensionProgress) return;
    let changed = false;
    const next = { ...personalBests };
    Object.entries(plan.dimensionProgress).forEach(([id, val]) => {
      if (!next[id] || val > next[id]) { next[id] = val; changed = true; }
    });
    if (changed) {
      setPersonalBests(next);
      try { localStorage.setItem("sayert_path_bests", JSON.stringify(next)); } catch (e) {}
    }
  }, [plan?.dimensionProgress]);

  const daysSinceActivity = useMemo(() => {
    if (!lastActivityDate) return null;
    return Math.floor((Date.now() - new Date(lastActivityDate).getTime()) / 86400000);
  }, [lastActivityDate]);

  function copyPlanSummary() {
    if (!plan) return;
    const lines = [plan.title, ...plan.weeklyPlan.map((d) => `${d.day}: ${d.sessions?.length ? d.sessions.map((s) => s.title).join(", ") : "מנוחה"}`)];
    navigator.clipboard?.writeText(lines.join("\n")).then(() => {
      setCopiedPlan(true);
      setTimeout(() => setCopiedPlan(false), 1800);
    });
  }

  async function requestNextWeek() {
    setRequestingNextWeek(true);
    try {
      const myDimLabels = myDimensions.map((d) => `${d.id}: ${d.label}`).join(", ");
      const sys = `${buildPlanSystemPrompt()}
זו לא הבנייה הראשונה - זה שבוע ההמשך. השבוע הקודם היה: ${JSON.stringify(plan.weeklyPlan)}.
**חשוב: אל תבחר רבדים חדשים.** הרבדים של המתאמן הזה כבר קבועים מהבנייה הראשונה ולא משתנים: ${myDimLabels}. כל session.dimension חייב להיות אחד מאלה בדיוק, כדי שההתקדמות תישאר עקבית.
בנה שבוע המשך שמתקדם בהדרגה מהשבוע הקודם (עומס מעט גבוה יותר אם השבוע הקודם הושלם ברובו, או דומה אם לא) - שמור על אותו פורמט JSON בדיוק (אפשר להתעלם משדה selectedDimensions, הוא לא רלוונטי הפעם).`;
      const reply = await aiChat(sys, "בנה לי את השבוע הבא במסלול.", plan.chatHistory);
      const parsed = parsePlanJson(reply);
      if (!parsed?.weeklyPlan) { showToast?.("לא הצלחתי לבנות שבוע חדש", "error"); return; }
      if (!parsed.weeklyPlan.some((d) => d.sessions?.length)) { showToast?.("ה-AI לא בחר אימונים מהמאגר. השבוע הנוכחי נשאר כמו שהוא", "error"); return; }
      // Force any dimension the AI might have drifted on back to the trainee's real
      // set, and never touch dimensionProgress here - the 7 stay exactly as they were.
      const myDimIds = new Set(myDimensions.map((d) => d.id));
      const safeWeeklyPlan = parsed.weeklyPlan.map((day) => ({
        ...day,
        sessions: (day.sessions || []).map((s) => ({ ...s, dimension: myDimIds.has(s.dimension) ? s.dimension : (myDimensions[0]?.id || s.dimension) })),
      }));
      const updatedPlan = { ...plan, weeklyPlan: safeWeeklyPlan, chatHistory: [...plan.chatHistory, { role: "assistant", text: `שבוע חדש מוכן! ${parsed.reasoning || ""}` }] };
      const saved = await saveTrainingPlan(userId, updatedPlan);
      setPlan(saved);
      setAddedKeys({});
      const newStreak = consistencyWeeks + 1;
      setConsistencyWeeks(newStreak);
      try { localStorage.setItem("sayert_path_streak_weeks", String(newStreak)); } catch (e) {}
      showToast?.("שבוע חדש נבנה!", "success");
    } catch (e) {
      showToast?.("שגיאה בבניית השבוע הבא", "error");
    } finally {
      setRequestingNextWeek(false);
    }
  }

  const simsBody = (
        <div className="space-y-3">
          {timingAdvice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setTimingAdvice(null)}>
              <div className="w-full max-w-xs bg-zinc-950 border-2 border-violet-500/50 rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase text-violet-400">AI ממליץ על תזמון</div>
                    <div className="text-[13px] font-black text-zinc-100">{timingAdvice.sim.title}</div>
                  </div>
                </div>
                {loadingTimingAdvice ? (
                  <div className="flex items-center gap-2 text-[13px] text-zinc-500 py-4"><Loader2 size={14} className="animate-spin" /> ה-AI בודק את לוח הזמנים...</div>
                ) : (
                  <>
                    <div className="text-[10px] font-black text-violet-400 uppercase mb-1">תזמון מומלץ</div>
                    <div className="text-[13px] text-zinc-300 leading-relaxed bg-violet-500/[0.06] border border-violet-500/20 rounded-xl p-3 mb-2.5">{timingAdvice.text}</div>
                    {timingAdvice.prepTips && (
                      <>
                        <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">איך להתכונן</div>
                        <div className="text-[13px] text-zinc-300 leading-relaxed bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-3 mb-4">{timingAdvice.prepTips}</div>
                      </>
                    )}
                  </>
                )}
                {!loadingTimingAdvice && (
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-zinc-500 mb-1.5">מתי בפועל תיפגשו לבצע?</div>
                    <input type="datetime-local" value={scheduledDateTime} onChange={(e) => setScheduledDateTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100" />
                    <div className="text-[10px] text-zinc-600 mt-1">המגבש יוכל להיכנס רק מ-30 דקות לפני ועד 30 דקות אחרי השעה הזו</div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setTimingAdvice(null)} className="flex-1 rounded-xl py-2.5 font-bold text-zinc-400 bg-zinc-900">ביטול</button>
                  <button onClick={() => confirmStartSim(timingAdvice.sim)} disabled={loadingTimingAdvice} className="flex-1 rounded-xl py-2.5 font-black text-white bg-red-500 disabled:opacity-50">קבל קוד והתחל</button>
                </div>
              </div>
            </div>
          )}

          {viewingSim && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col" onClick={() => setViewingSim(null)}>
              <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setViewingSim(null)} className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center shrink-0"><X size={16} className="text-zinc-400" /></button>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-red-400 uppercase">{viewingSim.category}</div>
                  <div className="text-[15px] font-black text-zinc-100 truncate">{viewingSim.title}</div>
                </div>
                <span className="text-[11px] font-bold text-zinc-500 shrink-0">{viewingSim.acts.length} אקטים</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
                <div className="text-[12px] text-zinc-500 mb-4 leading-relaxed">{viewingSim.description}</div>
                <div className="relative pr-5">
                  <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-red-500/25" />
                  <div className="space-y-4">
                    {viewingSim.acts.map((act, i) => (
                      <div key={i} className="relative">
                        <div className="absolute right-[-20.5px] top-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-black" />
                        <div className="text-[12px] font-black text-red-400 tabular-nums mb-1" dir="ltr">{act.time}</div>
                        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                          <div className="text-[13px] font-bold text-zinc-100 mb-1">{act.name}</div>
                          <div className="text-[12px] text-zinc-500 leading-relaxed">{act.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-800 bg-zinc-950" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { const s = viewingSim; setViewingSim(null); handleStartSim(s); }}
                  className="w-full rounded-2xl py-3 font-black text-[13px] flex items-center justify-center gap-1.5"
                  style={isPremium ? { backgroundColor: "#ef4444", color: "#fff" } : { backgroundColor: "#27272a", color: "#71717a" }}
                >
                  {!isPremium && <Lock size={13} />} התחל סימולציה זו
                </button>
              </div>
            </div>
          )}

          {justStartedCode && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setJustStartedCode(null)}>
              <div className="w-full max-w-xs bg-zinc-950 border-2 border-red-500/50 rounded-3xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="text-[13px] text-zinc-400 mb-2">{justStartedCode.title}</div>
                <div className="text-[12px] text-zinc-500 mb-3">תן/י את הקוד הזה למגבש שילווה אותך בסימולציה</div>
                <div className="text-4xl font-black tracking-[0.3em] text-red-400 tabular-nums mb-4" dir="ltr">{justStartedCode.code}</div>
                <button onClick={() => { navigator.clipboard?.writeText(justStartedCode.code); showToast?.("הועתק", "success"); }} className="w-full rounded-xl py-2.5 font-bold text-white bg-zinc-800 mb-2">
                  העתק קוד
                </button>
                <button onClick={() => setJustStartedCode(null)} className="w-full rounded-xl py-2.5 font-bold text-black bg-red-500">
                  הבנתי, סגור
                </button>
              </div>
            </div>
          )}

          {!isPremium && (
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "linear-gradient(120deg, #6b6144, #4a3f2e)", boxShadow: "0 0 0 1.5px #8a7a52 inset" }}>
              <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center shrink-0">
                <Lock size={16} className="text-[#d4c49a]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-black text-[#e8dcc0] mb-1">כדי להתחיל סימולציה נדרש תשלום</div>
                <div className="text-[12px] text-[#cabb96] leading-relaxed">
                  יש להעביר <b className="text-[#f0e6c8]">40 ₪</b> למספר <b dir="ltr" className="text-[#f0e6c8]">0585900050</b>, ולאחר אישור התשלום תיפתח הגישה
                </div>
              </div>
            </div>
          )}

          {loadingSims ? (
            <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
          ) : (
            <>
              {mySimSessions.length > 0 && (
                <div>
                  <style>{`@keyframes onlineRippleAmber { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); } 100% { box-shadow: 0 0 0 6px rgba(245,158,11,0); } }`}</style>
                  <div className="text-[12px] font-black text-zinc-400 mb-2">הסימולציות שלי</div>
                  <div className="space-y-2">
                    {mySimSessions.map((s) => {
                      const vHex = s.aiVerdict === "עבר" ? "#10b981" : s.aiVerdict === "לא עבר" ? "#ef4444" : "#f59e0b";
                      return (
                        <div key={s.id} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-bold text-zinc-200">{s.simulationTitle}</span>
                            {s.status === "completed" ? (
                              <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: `${vHex}20`, color: vHex }}>{s.aiVerdict}</span>
                            ) : (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={s.status === "in_progress" ? { backgroundColor: "#f59e0b20", color: "#f59e0b" } : { backgroundColor: "#6b614430", color: "#c9ba91" }}>
                                {s.status === "in_progress" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ animation: "onlineRippleAmber 1.6s ease-out infinite" }} />}
                                {s.status === "in_progress" ? "בתהליך עכשיו" : "מוכן להתחלה"}
                              </span>
                            )}
                          </div>
                          {s.status !== "completed" && (
                            <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5 flex-wrap" dir="rtl">
                              <span dir="ltr" className="text-zinc-600">קוד: {s.code}</span>
                              {s.scheduledAt && (
                                <span className="flex items-center gap-1" style={{ color: "#c9ba91" }}>
                                  <Clock size={10} /> {new Date(s.scheduledAt).toLocaleString("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                            </div>
                          )}
                          {s.aiReasoning && <div className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">{s.aiReasoning}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[12px] font-black text-zinc-400 mb-2">סימולציות זמינות</div>
                <style>{`@keyframes simCardFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes simShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } } @keyframes simBtnGlow { 0%, 100% { box-shadow: 0 0 8px 1px #ef444460; } 50% { box-shadow: 0 0 16px 3px #ef4444a0; } }`}</style>
                <div className="space-y-2.5">
                  {simList.map((sim, si) => {
                    const isMatkal = sim.category?.includes("מטכ");
                    const CatIcon = isMatkal ? Target : Waves;
                    const spansNight = sim.acts.some((a) => /^0[0-5]:/.test(a.time));
                    return (
                    <div key={sim.id} onClick={() => setViewingSim(sim)} className="relative rounded-2xl overflow-hidden p-4 cursor-pointer active:scale-[0.98] transition" style={{ background: "linear-gradient(120deg, #ef444418, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #ef444440 inset", animation: `simCardFadeUp 0.35s ease-out ${si * 0.08}s both` }}>
                      <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-15 bg-red-500 pointer-events-none" />
                      <div className="relative flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                          <CatIcon size={16} className="text-red-400" />
                        </div>
                        <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-black text-red-400 bg-red-500/15 rounded-full px-2 py-0.5">{sim.category}</span>
                          <span className="text-[10px] text-zinc-600">{sim.acts.length} אקטים</span>
                          {spansNight && <span className="text-[10px] text-violet-400 bg-violet-500/15 rounded-full px-2 py-0.5 flex items-center gap-1"><Clock size={9} /> כולל לילה</span>}
                        </div>
                      </div>
                      <div className="relative text-[15px] font-black text-zinc-100 mb-1">{sim.title}</div>
                      <div className="relative text-[12px] text-zinc-500 mb-3">{sim.description}</div>
                      <div className="relative flex items-center gap-2 mb-3 text-[11px] font-bold text-zinc-500">
                        <Compass size={12} /> לחץ/י לצפייה בלו״ז המלא לפי שעות
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStartSim(sim); }}
                        disabled={startingSimId === sim.id}
                        className="relative w-full rounded-xl py-2.5 font-black text-[13px] flex items-center justify-center gap-1.5 disabled:opacity-50 overflow-hidden"
                        style={isPremium ? { backgroundColor: "#ef4444", color: "#fff", animation: "simBtnGlow 2.2s ease-in-out infinite" } : { backgroundColor: "#27272a", color: "#71717a" }}
                      >
                        {isPremium && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)", animation: "simShimmer 3s ease-in-out infinite" }} />
                          </div>
                        )}
                        {!isPremium && <Lock size={13} />}
                        <span className="relative">{startingSimId === sim.id ? "יוצר קוד..." : "התחל סימולציה"}</span>
                      </button>
                    </div>
                    );
                  })}
                  {simList.length === 0 && <div className="text-center py-8 text-[13px] text-zinc-600">אין עדיין סימולציות זמינות</div>}
                </div>
              </div>
            </>
          )}
        </div>
  );

  if (loadingPlan) {
    return <div className="p-8 text-center text-sm text-zinc-600">טוען את המסלול שלך...</div>;
  }

  if (pathView === "sims" && !plan) {
    return (
      <div className="p-4">
        <button onClick={() => setPathView("plan")} className="flex items-center gap-1.5 text-zinc-400 text-base font-bold mb-4"><ChevronRight size={16} /> חזרה</button>
        {simsBody}
      </div>
    );
  }

  if (!plan) {
    if (!showQuestionnaire) {
      return (
        <div className="relative p-4 flex flex-col items-center justify-center min-h-[70vh] text-center overflow-hidden">
          <style>{`@keyframes introDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(8px,-14px); opacity: 0.7; } } @keyframes heroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } }`}</style>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="absolute rounded-full bg-violet-400" style={{ width: 2.5, height: 2.5, left: `${(i * 27 + 8) % 92}%`, top: `${(i * 19 + 10) % 85}%`, opacity: 0.3, animation: `introDust ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }} />
            ))}
          </div>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full blur-3xl opacity-20 bg-violet-500 pointer-events-none" style={{ animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="relative w-20 h-20 rounded-3xl bg-violet-500/15 border-2 border-violet-500/50 flex items-center justify-center mb-5 glow-pulse" style={glowVars("#a855f7")}>
            <Crosshair size={34} className="text-violet-400" />
          </div>
          <div className="relative text-2xl font-black text-zinc-100 mb-2.5">המסלול שלי</div>
          <div className="relative text-[14px] text-zinc-400 mb-7 max-w-xs leading-relaxed">
            AI יבנה לך תוכנית אימונים אישית ליעד <b className="text-violet-400">{profile?.targetUnitName || "שלך"}</b>, לפי תורת אימון אמיתית ולפי הגיבוש שאתה מתכונן אליו - לא סתם רשימה.
          </div>
          <button onClick={() => setShowQuestionnaire(true)} className="relative w-full max-w-xs flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-white" style={{ background: "linear-gradient(135deg, #a855f7, #7e22ce)", boxShadow: "0 0 20px 2px #a855f760" }}>
            בואו נתחיל <ChevronLeft size={17} />
          </button>
          <div className="relative flex items-center gap-4 mt-5 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5"><ClipboardCheck size={12} className="text-violet-400" /> כמה שאלות קצרות</div>
            <div className="flex items-center gap-1.5"><Target size={12} className="text-violet-400" /> מותאם לגיבוש שלך</div>
          </div>
          <button onClick={() => setPathView("sims")} className="relative mt-4 flex items-center gap-1.5 text-[12px] font-bold text-red-400">
            <ClipboardCheck size={13} /> יש לך קוד סימולציה או רוצה לראות מה קיים? לחץ כאן
          </button>
        </div>
      );
    }
    return (
      <div className="p-4 space-y-3 pb-8">
        <style>{`
          @keyframes qItemFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes qShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes qCheckPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
        `}</style>

        {(() => {
          const sections = ["gibush", "days", "group", "time", "access", "run", "dims", "notes"];
          const answered = {
            gibush: Boolean(qGibush), days: Boolean(qDaysPerWeek), time: Boolean(qTimeOfDay),
            access: qSeaAccess !== null && qGymAccess !== null, run: Boolean(qRunLocation),
            dims: qPriorityDims.length > 0, notes: true, // notes is optional, always counts
            group: qTrainsInGroup === false || (qTrainsInGroup === true && qGroupDays.length > 0),
          };
          const requiredSections = ["gibush", "days", "group", "time", "access", "run"];
          const answeredCount = requiredSections.filter((s) => answered[s]).length;
          const pct = Math.round((answeredCount / requiredSections.length) * 100);
          const firstUnanswered = requiredSections.find((s) => !answered[s]);

          function goToSection(id) {
            setQExpandedSection(id);
            setTimeout(() => qSectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
          }
          function answerAndAdvance(setter, value, sectionId) {
            setter(value);
            const idx = sections.indexOf(sectionId);
            const next = sections[idx + 1];
            if (next) setTimeout(() => goToSection(next), 350);
          }

          const gibushTheme = GIBUSH_TYPE_COLORS[qGibush] || { hex: "#a855f7" };
          const themeHex = gibushTheme.hex;
          const isSpecialWhite = qGibush === "גיבוש טיס";

          return (
            <>
              <div className="relative rounded-2xl overflow-hidden p-4" style={{ background: isSpecialWhite ? "linear-gradient(150deg, #ffffff12, transparent 65%), var(--card-base)" : `radial-gradient(ellipse 130% 100% at 30% -20%, ${themeHex}30, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${themeHex}45 inset` }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${themeHex}22`, border: `1px solid ${themeHex}66` }}>
                    <Crosshair size={16} style={{ color: themeHex }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-black text-zinc-100">כמה שאלות לפני שבונים</div>
                    <div className="text-[11px]" style={{ color: `${themeHex}b0` }}>{answeredCount}/{requiredSections.length} נענו{gibushTheme.name ? ` · ${gibushTheme.name}` : ""}</div>
                  </div>
                  {firstUnanswered && (
                    <button onClick={() => goToSection(firstUnanswered)} className="text-[11px] font-bold rounded-full px-2.5 py-1 shrink-0" style={{ color: themeHex, border: `1px solid ${themeHex}66` }}>הבא ←</button>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: themeHex, boxShadow: `0 0 8px ${themeHex}` }} />
                </div>
              </div>

              {qGibush && GIBUSH_TRAINING_FOCUS[qGibush] && (qPriorityDims.length > 0 || qDaysPerWeek) && (
                <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #10b98118, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98140 inset" }}>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1"><Bot size={12} /> תצוגה מקדימה - התוכנית תדגיש:</div>
                  <div className="flex flex-wrap gap-1">
                    {(qPriorityDims.length > 0 ? PLAN_DIMENSIONS.filter((d) => qPriorityDims.includes(d.id)) : PLAN_DIMENSIONS.filter((d) => GIBUSH_TRAINING_FOCUS[qGibush]?.dims.includes(d.id))).slice(0, 5).map((d) => (
                      <span key={d.id} className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: `${d.hex}22`, color: d.hex }}>{d.label}</span>
                    ))}
                  </div>
                </div>
              )}

              <QAccordionItem id="gibush" icon={Target} hex="#a855f7" title="לאיזה גיבוש אתה מתכונן?" summary={qGibush} isAnswered={answered.gibush} isExpanded={qExpandedSection === "gibush"} onToggle={() => setQExpandedSection((s) => (s === "gibush" ? null : "gibush"))} index={0} itemRef={(el) => (qSectionRefs.current.gibush = el)}>
                <div className="grid grid-cols-2 gap-1.5">
                  {GIBUSHIM_LIST.map((g) => (
                    <button key={g} onClick={() => answerAndAdvance(setQGibush, g, "gibush")} className={`rounded-xl py-2.5 text-[12px] font-bold border transition ${qGibush === g ? "bg-violet-500/15 border-violet-500 text-violet-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {g}
                    </button>
                  ))}
                </div>
                {qGibush && GIBUSH_TRAINING_FOCUS[qGibush] && (
                  <div className="text-[11px] text-zinc-500 mt-2.5 leading-relaxed bg-black/30 rounded-lg p-2.5">{GIBUSH_TRAINING_FOCUS[qGibush].note}</div>
                )}
              </QAccordionItem>

              <QAccordionItem id="days" icon={CalendarDays} hex="#10b981" title="כמה ימי אימון בשבוע?" summary={qDaysPerWeek ? `${qDaysPerWeek} ימים` : ""} isAnswered={answered.days} isExpanded={qExpandedSection === "days"} onToggle={() => setQExpandedSection((s) => (s === "days" ? null : "days"))} index={1} itemRef={(el) => (qSectionRefs.current.days = el)}>
                <div className="flex gap-2">
                  {Array.from({ length: maxDaysForLevel - 2 }).map((_, i) => {
                    const n = i + 3;
                    return (
                      <button key={n} onClick={() => answerAndAdvance(setQDaysPerWeek, n, "days")} className={`flex-1 rounded-xl py-3 text-base font-black border transition ${qDaysPerWeek === n ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                        {n}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-zinc-600 mt-2">מקסימום {maxDaysForLevel} ימים לרמת הכושר שלך - זה לפי תורת אימון, לא שרירותי</div>
              </QAccordionItem>

              <QAccordionItem id="group" icon={Users} hex="#06b6d4" title="אתה מתאמן בקבוצה?" summary={qTrainsInGroup === null ? "" : qTrainsInGroup ? `כן · ${qGroupDays.length} ימים` : "לא"} isAnswered={answered.group} isExpanded={qExpandedSection === "group"} onToggle={() => setQExpandedSection((s) => (s === "group" ? null : "group"))} index={2} itemRef={(el) => (qSectionRefs.current.group = el)}>
                <div className="flex gap-2 mb-3">
                  {[["כן", true], ["לא", false]].map(([label, val]) => (
                    <button key={label} onClick={() => { setQTrainsInGroup(val); if (!val) setTimeout(() => goToSection("time"), 350); }} className={`flex-1 rounded-xl py-3 text-base font-black border transition ${qTrainsInGroup === val ? "bg-cyan-500/15 border-cyan-500 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {qTrainsInGroup === true && (
                  <div>
                    <div className="text-[12px] text-zinc-500 font-semibold mb-2">באילו ימים האימון הקבוצתי?</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((label, dayIdx) => {
                        const isSelected = qGroupDays.includes(dayIdx);
                        return (
                          <button
                            key={dayIdx}
                            onClick={() => {
                              const next = isSelected ? qGroupDays.filter((d) => d !== dayIdx) : [...qGroupDays, dayIdx];
                              setQGroupDays(next);
                              if (next.length > 0 && qExpandedSection === "group") setTimeout(() => goToSection("time"), 500);
                            }}
                            className={`rounded-xl py-2.5 text-[13px] font-black border transition ${isSelected ? "bg-cyan-500/15 border-cyan-500 text-cyan-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[11px] text-zinc-600 mt-2">ה-AI יתחשב בימים האלה כשיבנה את התוכנית - לא יעמיס עליהם אימונים כפולים</div>
                  </div>
                )}
              </QAccordionItem>

              <QAccordionItem id="time" icon={Clock} hex="#f59e0b" title="מתי נוח לך להתאמן?" summary={qTimeOfDay} isAnswered={answered.time} isExpanded={qExpandedSection === "time"} onToggle={() => setQExpandedSection((s) => (s === "time" ? null : "time"))} index={3} itemRef={(el) => (qSectionRefs.current.time = el)}>
                <div className="flex gap-2">
                  {["בוקר", "אחה״צ", "ערב", "גמיש"].map((t) => (
                    <button key={t} onClick={() => answerAndAdvance(setQTimeOfDay, t, "time")} className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold border transition ${qTimeOfDay === t ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </QAccordionItem>

              <QAccordionItem id="access" icon={Waves} hex="#38bdf8" title="גישה לים וחדר כושר?" summary={answered.access ? `ים: ${qSeaAccess ? "כן" : "לא"} · חדר כושר: ${qGymAccess ? "כן" : "לא"}` : ""} isAnswered={answered.access} isExpanded={qExpandedSection === "access"} onToggle={() => setQExpandedSection((s) => (s === "access" ? null : "access"))} index={4} itemRef={(el) => (qSectionRefs.current.access = el)}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[12px] font-bold text-zinc-300 mb-1.5">גישה לים?</div>
                    <div className="flex gap-1.5">
                      {[["כן", true], ["לא", false]].map(([label, val]) => (
                        <button key={label} onClick={() => { setQSeaAccess(val); if (qGymAccess !== null) answerAndAdvance(() => {}, null, "access"); }} className={`flex-1 rounded-lg py-2 text-[12px] font-bold border transition ${qSeaAccess === val ? "bg-sky-500/15 border-sky-500 text-sky-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-zinc-300 mb-1.5">חדר כושר?</div>
                    <div className="flex gap-1.5">
                      {[["כן", true], ["לא", false]].map(([label, val]) => (
                        <button key={label} onClick={() => { setQGymAccess(val); if (qSeaAccess !== null) answerAndAdvance(() => {}, null, "access"); }} className={`flex-1 rounded-lg py-2 text-[12px] font-bold border transition ${qGymAccess === val ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </QAccordionItem>

              <QAccordionItem id="run" icon={Footprints} hex="#f97316" title="איפה אתה עושה ריצות?" summary={qRunLocation} isAnswered={answered.run} isExpanded={qExpandedSection === "run"} onToggle={() => setQExpandedSection((s) => (s === "run" ? null : "run"))} index={5} itemRef={(el) => (qSectionRefs.current.run = el)}>
                <div className="grid grid-cols-2 gap-1.5">
                  {["חול הים", "טיילת / בעיר", "ספורטק", "הליכון"].map((r) => (
                    <button key={r} onClick={() => answerAndAdvance(setQRunLocation, r, "run")} className={`rounded-xl py-2.5 text-[12px] font-bold border transition ${qRunLocation === r ? "bg-orange-500/15 border-orange-500 text-orange-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </QAccordionItem>

              <QAccordionItem id="dims" icon={TrendingUp} hex="#ec4899" title="מה הכי חשוב לך לשפר?" summary={qPriorityDims.length ? `${qPriorityDims.length} רבדים נבחרו` : ""} isAnswered={answered.dims} isExpanded={qExpandedSection === "dims"} onToggle={() => setQExpandedSection((s) => (s === "dims" ? null : "dims"))} index={6} optional itemRef={(el) => (qSectionRefs.current.dims = el)}>
                <div className="text-[11px] text-zinc-600 mb-2.5">בחרו עד 5 רבדים - התוכנית תיתן להם עדיפות (אבל לא תזניח את השאר). אם לא תבחרו - ה-AI יחליט לפי הגיבוש והיעד שלכם.</div>
                <div className="flex flex-wrap gap-1.5">
                  {PLAN_DIMENSIONS.map((d) => {
                    const selected = qPriorityDims.includes(d.id);
                    return (
                      <button key={d.id} onClick={() => toggleQPriority(d.id)} className="rounded-full px-3 py-1.5 text-[12px] font-bold border transition" style={selected ? { backgroundColor: `${d.hex}22`, borderColor: d.hex, color: d.hex } : { backgroundColor: "#18181b", borderColor: "#3f3f46", color: "#a1a1aa" }}>
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </QAccordionItem>

              <QAccordionItem id="notes" icon={Edit2} hex="#64748b" title="הערות נוספות" summary={qDivisionNotes.trim() ? "נוספה הערה" : ""} isAnswered={Boolean(qDivisionNotes.trim())} isExpanded={qExpandedSection === "notes"} onToggle={() => setQExpandedSection((s) => (s === "notes" ? null : "notes"))} index={7} optional itemRef={(el) => (qSectionRefs.current.notes = el)}>
                <div className="text-[11px] text-zinc-600 mb-2.5">איך הייתם רוצים לחלק את הדגשים? מגבלות, העדפות, כל דבר שחשוב שנדע</div>
                <textarea value={qDivisionNotes} onChange={(e) => setQDivisionNotes(e.target.value)} placeholder="למשל: רגל שמאל רגישה, אני מעדיף להתחיל עם כוח ולא סיבולת..." rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500/40" />
              </QAccordionItem>

              <GlowButton tone="emerald" icon={generating ? Loader2 : Crosshair} className="w-full" disabled={generating || answeredCount < requiredSections.length} onClick={generatePlan}>
                {generating ? "בונה תוכנית..." : answeredCount < requiredSections.length ? `נשארו ${requiredSections.length - answeredCount} שאלות` : "בנה את התוכנית שלי"}
              </GlowButton>
            </>
          );
        })()}
      </div>
    );
  }

  return (
    <div className="fx-root p-4 space-y-4 relative" onPointerDown={(e) => fxTouchRing(e, gibushHexPath || "#10b981")}>
      <FxStyles />
      <FxAmbience hex={gibushHexPath || "#10b981"} hex2="#a855f7" hex3="#38bdf8" icons={[Target, Crosshair, Trophy]} particles={10} />
      <FxScrollBar hex={gibushHexPath || "#10b981"} />
      <div className="grid grid-cols-4 gap-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl p-1">
        {[["plan", "התוכנית", CalendarDays, "#10b981"], ["fitness", "מדדים", Activity, "#f59e0b"], ["chat", "יועץ", Bot, "#a855f7"], ["sims", "סימולציות", ClipboardCheck, "#ef4444"]].map(([id, label, Icon, hex]) => (
          <button key={id} onClick={() => setPathView(id)} className="flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-[10px] font-bold transition" style={pathView === id ? { backgroundColor: `${hex}22`, color: hex } : { color: "#71717a" }}>
            <Icon size={14} style={pathView === id ? { animation: "tabPulse 0.4s ease-out" } : undefined} /> {label}
          </button>
        ))}
      </div>

      {pathView === "plan" && (
        <WeekCommandCenter plan={plan} completedKeys={completedKeys} selectedDay={selectedDayIdx} onSelectDay={selectDay} gibushDayIdx={gibushDayIdx} gibushHex={gibushHexPath} daysToGibush={daysToGibush} simsByDayIdx={simsByDayIdx} trainingContent={trainingContent} streak={logStreak} onToggleComplete={toggleCompleted} onOpenContent={(s, dim, hex) => setViewingSessionContent({ session: s, dim, hex })} onSnooze={snoozeToTomorrow} onSwap={openSwapModal} onRemove={removeSession} onMoveSession={moveSessionBetweenDays} moveUndo={moveUndo} onUndoMove={undoMove} sessionTips={sessionTips} loadingTipKey={loadingTipKey} onGetTip={getSessionTip} aiText={weekBalanceCheck} aiLoading={loadingWeekBalance} onAiScan={checkWeekBalance} onCloseAi={() => setWeekBalanceCheck(null)} onCopy={copyPlanSummary} copied={copiedPlan} search={sessionSearch} setSearch={setSessionSearch} fontScale={pathFontScale} />
      )}

      {reorgJustApplied && (
        <div className="rounded-2xl p-3.5 flex items-center gap-2.5" style={{ background: "linear-gradient(120deg, #10b98122, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98145 inset", animation: "vlFadeUp 0.3s ease-out both" }}>
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span className="text-[12px] text-emerald-200 flex-1 font-bold">סודר - בדוק את הימים הקרובים</span>
        </div>
      )}

      {missedSessions.length > 0 && (
        <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #f59e0b22, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b45 inset" }}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {missedSessions[0]?.longGap ? (
                <span className="text-[12px] text-amber-200">לא נפתח כאן כבר {missedSessions[0].longGap} שבועות - התחלנו לך שבוע נקי, בלי לחץ. בוא נחזור בהדרגה.</span>
              ) : (
                <>
                  <span className="text-[12px] text-amber-200 font-bold">השבוע שעבר הסתיים עם {missedSessions.length} אימונים שלא סומנו כבוצעו</span>
                  <div className="text-[11px] text-amber-300/70 mt-1">{missedSessions.slice(0, 3).map((m) => m.title).join(" · ")}{missedSessions.length > 3 ? ` ועוד ${missedSessions.length - 3}` : ""}</div>
                </>
              )}
            </div>
            <button onClick={() => setMissedSessions([])} className="text-amber-400/60 shrink-0"><X size={14} /></button>
          </div>
        </div>
      )}

      {withinWeekMissed.length > 0 && !withinWeekMissedDismissed && (
        <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #ef444422, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #ef444445 inset" }}>
          <div className="flex items-start gap-2.5 mb-2.5">
            <Flame size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[12px] text-red-200 font-bold">פיגרת {withinWeekMissed.length > 1 ? `ב-${withinWeekMissed.length} אימונים` : "ביום אחד"} השבוע</span>
              <div className="text-[11px] text-red-300/70 mt-0.5">{withinWeekMissed.map((m) => `${m.day}: ${m.title}`).join(" · ")}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={reorganizeMissedDays} className="flex-1 rounded-xl py-2 text-[12px] font-black text-black bg-red-400 flex items-center justify-center gap-1.5">
              <RefreshCw size={12} /> סדר לי מחדש
            </button>
            <button onClick={() => setWithinWeekMissedDismissed(true)} className="rounded-xl py-2 px-3 text-[12px] font-bold text-red-300/70 border border-red-500/30">לא עכשיו</button>
          </div>
        </div>
      )}

      {daysSinceActivity !== null && daysSinceActivity >= 3 && (
        <div className="rounded-2xl p-3.5 flex items-center gap-2.5" style={{ background: "linear-gradient(120deg, #f59e0b22, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b45 inset" }}>
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <span className="text-[12px] text-amber-200 flex-1">לא סימנת פעילות כבר {daysSinceActivity} ימים - חוזרים למסלול?</span>
        </div>
      )}

      <div className="relative rounded-3xl overflow-hidden p-5 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #10b98130, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #10b98140 inset", animation: "pathHueShift 12s ease-in-out infinite" }}>
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: "#10b981", animation: "heroPulse 4s ease-in-out infinite" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="absolute rounded-full bg-emerald-300" style={{ width: 2, height: 2, left: `${(i * 31 + 12) % 90}%`, top: `${(i * 23 + 8) % 70}%`, opacity: 0.35, animation: `pathDust ${5 + (i % 4)}s ease-in-out ${i * 0.35}s infinite` }} />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", animation: "pathShimmer 4s ease-in-out 0.5s infinite" }} />
        </div>
        <style>{`
          @keyframes heroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } }
          @keyframes pathDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(6px,-10px); opacity: 0.6; } }
          @keyframes pathShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes pathFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pathHueShift { 0%, 100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(8deg); } }
          @keyframes confettiPop { 0% { transform: scale(0) rotate(0deg); opacity: 1; } 100% { transform: scale(1.4) rotate(180deg) translateY(-16px); opacity: 0; } }
          @keyframes tabPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        `}</style>
        <div className="relative flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
              <circle cx="24" cy="24" r="21" fill="none" stroke="#00000040" strokeWidth="3" />
              <circle cx="24" cy="24" r="21" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${(readinessScore / 100) * 132} 132`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease-out" }} />
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center glow-pulse m-1.5" style={glowVars("#10b981")}>
              <Crosshair size={18} className="text-emerald-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-black text-zinc-50 truncate">{plan.title}</div>
            <div className="text-[12px] text-zinc-500">ליעד {plan.unitName} · מוכנות {readinessScore}%</div>
          </div>
          {consistencyWeeks > 0 && (
            <span className="rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-black px-2.5 py-1 shrink-0 flex items-center gap-1">
              <Flame size={11} fill="#10b981" /> {consistencyWeeks} שבועות
            </span>
          )}
        </div>
        <div className="relative mt-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-zinc-400 font-semibold">השבוע הזה</span>
            <span className="text-emerald-400 font-black">{weekStats.addedCount}/{weekStats.total} ביומן</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${weekStats.total ? (weekStats.addedCount / weekStats.total) * 100 : 0}%`, boxShadow: "0 0 8px #10b981" }} />
          </div>
        </div>
        {/* Path trail - weeks completed leading toward the target */}
        {weekHistory.length > 0 && (
          <div className="relative flex items-center gap-1 mt-3.5">
            {weekHistory.map((w, i) => (
              <React.Fragment key={i}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: "0 0 4px #10b981" }} />
                {i < weekHistory.length - 1 && <div className="flex-1 h-px bg-emerald-500/30" />}
              </React.Fragment>
            ))}
            <div className="flex-1 h-px bg-dashed border-t border-dashed border-zinc-700" />
            <Shield size={13} className="text-emerald-400 shrink-0" />
          </div>
        )}
      </div>

      {nextSession && pathView !== "plan" && (
        <button onClick={() => { setPathView("plan"); selectDay(WEEK_DAYS_HE.indexOf(nextSession.day)); }} className="w-full text-right rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #10b98122, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98145 inset" }}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-emerald-500/70 uppercase">מה עכשיו</div>
            <div className="text-[13px] font-black text-zinc-100">{nextSession.session.title} · יום {nextSession.day}</div>
          </div>
          <ChevronLeft size={15} className="text-emerald-500/60 shrink-0" />
        </button>
      )}

      {pathView === "fitness" && (
        <div className="-mx-4">
          <FitnessTab userId={userId} showToast={showToast} goToHome={() => setPathView("plan")} />
        </div>
      )}

      {pathView === "sims" && simsBody}


      {pathView === "plan" && (
      <div className="space-y-3 fx-stagger" onTouchStart={onPlanTouchStart} onTouchEnd={onPlanTouchEnd}>
      <div {...fxTilt(5)} className="relative rounded-2xl overflow-hidden p-3.5" style={{ ...fxTiltStyle, background: `linear-gradient(120deg, ${gibushHexPath}22, transparent 75%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${gibushHexPath}45 inset` }}>
        <FxFrame hex={gibushHexPath} hex2="#a855f7" radius="1rem" />
        <HudCorners hex={gibushHexPath} corners={2} inset={8} />
        <FxSpot radius="1rem" />
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: gibushHexPath }} />
        <div className="relative flex items-center gap-2.5">
          {gibushKey && daysToGibush != null ? (
            <FxRing size={40} stroke={3} pct={Math.max(4, 100 - Math.min(100, daysToGibush))} hex={gibushHexPath}>
              <Target size={16} style={{ color: gibushHexPath }} />
            </FxRing>
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${gibushHexPath}22`, boxShadow: `0 0 0 1.5px ${gibushHexPath}55 inset` }}>
              <Target size={18} style={{ color: gibushHexPath }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase" style={{ color: gibushHexPath }}>מועד הגיבוש{profile?.gibushType ? ` · ${profile.gibushType}` : ""}</div>
            {gibushKey ? (
              <div className="text-[14px] font-black text-zinc-100">
                {new Date(`${gibushKey}T00:00:00`).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            ) : (
              <div className="text-[13px] font-bold text-zinc-400">עדיין לא נקבע מועד גיבוש</div>
            )}
          </div>
          {gibushKey && (
            <span className="text-[11px] font-black rounded-full px-2.5 py-1 shrink-0 tabular-nums" style={{ backgroundColor: `${gibushHexPath}22`, color: gibushHexPath, "--gc": `${gibushHexPath}99`, animation: daysToGibush <= 3 && daysToGibush >= 0 ? "fxGlow 1.6s ease-in-out infinite" : undefined }}>
              {daysToGibush > 1 ? `עוד ${daysToGibush} ימים` : daysToGibush === 1 ? "מחר!" : daysToGibush === 0 ? "היום!" : "עבר"}
            </span>
          )}
          {gibushKey && !editingGibush && (
            <button onClick={() => { setGibushDraft(gibushKey); setEditingGibush(true); }} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-zinc-400 shrink-0"><Edit2 size={13} /></button>
          )}
        </div>
        {(editingGibush || !gibushKey) && (
          <div className="relative flex items-center gap-2 mt-3">
            <input type="date" value={gibushDraft} onChange={(e) => setGibushDraft(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100" />
            <button onClick={saveGibushDate} disabled={savingGibush || !gibushDraft} className="rounded-lg px-4 py-2 text-[13px] font-black text-black disabled:opacity-40" style={{ backgroundColor: gibushHexPath }}>{savingGibush ? "שומר..." : "קבע"}</button>
            {editingGibush && <button onClick={() => setEditingGibush(false)} className="text-zinc-500"><X size={16} /></button>}
          </div>
        )}
        {gibushKey && gibushDayIdx < 0 && daysToGibush > 0 && (
          <div className="relative text-[10.5px] text-zinc-500 mt-2">הגיבוש לא בשבוע הנוכחי, הוא יסומן בלוז ביום המתאים כשיגיע השבוע שלו</div>
        )}
        {gibushKey && daysToGibush != null && daysToGibush >= 0 && daysToGibush <= 14 && (
          <div className="relative mt-3 rounded-xl bg-black/30 p-2.5 flex items-center gap-2">
            <Flame size={13} className="text-red-400 shrink-0" style={{ animation: "flameFlicker 1.2s ease-in-out infinite" }} />
            <span className="text-[11.5px] font-bold text-red-200">
              {daysToGibush === 0 ? "היום זה קורה - כל אימון מכאן היה שווה את זה" : daysToGibush <= 3 ? `נשארו ${daysToGibush} ימים - כל אימון עכשיו נספר כפול` : `${daysToGibush} ימים לגיבוש - הישארות על המסלול היא ההבדל`}
            </span>
          </div>
        )}
      </div>

      {postWorkoutMsg && (
        <div className="rounded-2xl p-3 flex items-center gap-2 text-center justify-center" style={{ background: "linear-gradient(120deg, #10b98122, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98145 inset", animation: "vlFadeUp 0.3s ease-out both" }}>
          <Trophy size={14} className="text-emerald-400" />
          <span className="text-[12px] font-bold text-emerald-200">{postWorkoutMsg}</span>
        </div>
      )}

      {reorgJustApplied && lastReorgSnapshot && (
        <button onClick={undoReorganize} className="w-full text-[11px] font-bold text-zinc-500 underline text-center">בטל סידור מחדש</button>
      )}

      {snoozedToast && (
        <div className="rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-zinc-400" style={{ background: "var(--card-base-alt)" }}>
          <Clock size={12} className="text-amber-400" /> {`"${snoozedToast}" הועבר למחר`}
        </div>
      )}

      <div className="rounded-2xl p-3.5" style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1.5px #3f3f4660 inset" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black text-zinc-400 flex items-center gap-1.5"><Edit2 size={11} /> כוונת השבוע</span>
          {!editingIntention && <button onClick={() => { setIntentionDraft(weeklyIntention); setEditingIntention(true); }} className="text-[11px] font-bold text-emerald-400">{weeklyIntention ? "ערוך" : "הוסף"}</button>}
        </div>
        {editingIntention ? (
          <div className="flex items-center gap-1.5 mt-1.5">
            <input autoFocus value={intentionDraft} onChange={(e) => setIntentionDraft(e.target.value)} placeholder="למה השבוע הזה חשוב לך?" maxLength={80} className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-[13px] text-zinc-100" onKeyDown={(e) => e.key === "Enter" && saveWeeklyIntention()} />
            <button onClick={saveWeeklyIntention} className="text-emerald-400 shrink-0"><Check size={16} /></button>
          </div>
        ) : (
          <div className="text-[13px] text-zinc-200 font-semibold mt-0.5">{weeklyIntention || "עדיין לא קבעת כוונה לשבוע הזה"}</div>
        )}
      </div>

      <div className="rounded-2xl p-3.5" style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1.5px #3f3f4660 inset" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black text-zinc-400">30 הימים האחרונים</span>
          <span className="text-[11px] font-bold text-emerald-400">רצף: {logStreak} {bestLogStreak > logStreak ? `· שיא: ${bestLogStreak}` : ""}</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {last30.map((d) => (
            <div key={d.key} className="aspect-square rounded-[3px]" style={{ backgroundColor: d.has ? "#10b981" : "#27272a", boxShadow: d.has ? "0 0 4px #10b98180" : "none" }} title={d.key} />
          ))}
        </div>
      </div>

      {!committedToday && (plan?.weeklyPlan?.[new Date().getDay()]?.sessions || []).length > 0 && !completedKeys[`${new Date().getDay()}_0`] && (
        <button onClick={commitToday} className="w-full rounded-2xl py-3 font-black text-[13px] text-black bg-gradient-to-l from-emerald-400 to-emerald-500 flex items-center justify-center gap-1.5">
          <Zap size={14} /> אני מתחיל עכשיו
        </button>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <button onClick={markAllDoneToday} className="text-[11px] font-bold text-zinc-400 border border-zinc-800 rounded-full px-2.5 py-1.5 flex items-center gap-1"><Check size={11} /> סמן הכל היום</button>
        <button onClick={copyTodayWorkout} className="text-[11px] font-bold text-zinc-400 border border-zinc-800 rounded-full px-2.5 py-1.5 flex items-center gap-1"><Copy size={11} /> העתק היום</button>
        <button onClick={exportWeekToICS} className="text-[11px] font-bold text-zinc-400 border border-zinc-800 rounded-full px-2.5 py-1.5 flex items-center gap-1"><CalendarDays size={11} /> ליומן</button>
        <button onClick={printWeek} className="text-[11px] font-bold text-zinc-400 border border-zinc-800 rounded-full px-2.5 py-1.5 flex items-center gap-1"><Send size={11} /> הדפס</button>
        <div className="mr-auto flex items-center gap-1">
          <button onClick={() => { const v = Math.max(0.85, pathFontScale - 0.1); setPathFontScale(v); try { localStorage.setItem("sayert_path_font_scale", String(v)); } catch (e) {} }} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[11px] font-bold">א-</button>
          <button onClick={() => { const v = Math.min(1.3, pathFontScale + 0.1); setPathFontScale(v); try { localStorage.setItem("sayert_path_font_scale", String(v)); } catch (e) {} }} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[13px] font-bold">א+</button>
        </div>
      </div>

      {mySimSessions.filter((s) => s.status !== "completed").length > 0 && (
        <div className="rounded-2xl p-3.5 flex items-center gap-2.5" style={{ background: "linear-gradient(120deg, #ef444418, transparent 75%)", boxShadow: "0 0 0 1.5px #ef444440 inset" }}>
          <ClipboardCheck size={16} className="text-red-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-zinc-200">יש לך סימולציה שממתינה לתזמון</div>
            <div className="text-[11px] text-zinc-500 truncate">{mySimSessions.find((s) => s.status !== "completed")?.simulationTitle}</div>
          </div>
          <button
            onClick={() => {
              const s = mySimSessions.find((x) => x.status !== "completed");
              setSchedulingSimSession(s);
              setSchedulingDateTime(s.scheduledAt ? new Date(s.scheduledAt).toISOString().slice(0, 16) : "");
            }}
            className="text-[12px] font-bold text-red-400 border border-red-500/40 rounded-full px-3 py-1.5 shrink-0"
          >
            קבע מועד
          </button>
        </div>
      )}

      {schedulingSimSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSchedulingSimSession(null)}>
          <div className="w-full max-w-xs bg-zinc-950 border border-red-500/30 rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-[13px] font-black text-zinc-100 mb-1">{schedulingSimSession.simulationTitle}</div>
            <div className="text-[11px] text-zinc-500 mb-3">בחר/י יום ושעה לביצוע הסימולציה עם המגבש</div>
            <input type="datetime-local" value={schedulingDateTime} onChange={(e) => setSchedulingDateTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setSchedulingSimSession(null)} className="flex-1 rounded-xl py-2.5 font-bold text-zinc-400 bg-zinc-900">ביטול</button>
              <button
                onClick={async () => {
                  if (!schedulingDateTime) { showToast?.("בחר/י תאריך ושעה", "error"); return; }
                  await rescheduleSimSession(schedulingSimSession.id, new Date(schedulingDateTime).toISOString());
                  setMySimSessions((prev) => prev.map((s) => s.id === schedulingSimSession.id ? { ...s, scheduledAt: new Date(schedulingDateTime).toISOString() } : s));
                  setSchedulingSimSession(null);
                  showToast?.("המועד נקבע", "success");
                }}
                className="flex-1 rounded-xl py-2.5 font-black text-white bg-red-500"
              >
                שמור מועד
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly plan */}
      <div className="space-y-2.5">
        {swappingSession && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSwappingSession(null)}>
            <div className="w-full sm:max-w-xs bg-zinc-950 border border-amber-500/30 rounded-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0"><RefreshCw size={16} className="text-amber-400" /></div>
                <div className="flex-1">
                  <div className="text-[10px] font-black uppercase text-amber-400">שינוי אימון</div>
                  <div className="text-[13px] font-black text-zinc-100">{swappingSession.session.title}</div>
                </div>
                <button onClick={() => setSwappingSession(null)} className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500"><X size={14} /></button>
              </div>

              <div className="text-[11px] font-bold text-zinc-500 mb-1.5">למה אתה רוצה לשנות?</div>
              <textarea value={swapReason} onChange={(e) => setSwapReason(e.target.value)} placeholder="לדוגמה: כואב לי הברך, אין לי זמן היום, רוצה להתמקד בסבולת..." rows={2} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[13px] text-zinc-100 placeholder-zinc-600 resize-none mb-3" />

              <div className="text-[11px] font-bold text-zinc-500 mb-1.5">להחליף באימון מהמאגר:</div>
              {(() => {
                const swapCats = [...new Map(bankWorkouts.map((w) => [w.catId, w])).values()];
                const activeCat = swapCat || swappingSession.session.categoryId || swapCats[0]?.catId;
                const swapList = bankWorkouts.filter((w) => w.catId === activeCat && w.id !== swappingSession.session.contentId);
                return (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-1.5" style={{ scrollbarWidth: "none" }}>
                      {swapCats.map((c) => (
                        <button key={c.catId} onClick={() => { setSwapCat(c.catId); setSwapTarget(null); setSwapVerdict(null); }} className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold border transition" style={activeCat === c.catId ? { backgroundColor: "#f59e0b20", borderColor: "#f59e0b", color: "#f59e0b" } : { borderColor: "#3f3f46", color: "#71717a" }}>{c.catTitle}</button>
                      ))}
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1 mb-3">
                      {swapList.length === 0 && <div className="text-[11px] text-zinc-600 py-2 text-center">אין עוד אימונים בקטגוריה הזו</div>}
                      {swapList.map((w) => (
                        <button key={w.id} onClick={() => { setSwapTarget(w.id); setSwapVerdict(null); }} className="w-full text-right rounded-lg px-3 py-2 text-[12px] font-bold transition" style={swapTarget === w.id ? { backgroundColor: "#f59e0b25", color: "#f59e0b", boxShadow: "0 0 0 1.5px #f59e0b60 inset" } : { backgroundColor: "#18181b", color: "#a1a1aa" }}>{w.title}</button>
                      ))}
                    </div>
                  </>
                );
              })()}

              {swapTarget && !swapVerdict && (
                <button onClick={getSwapVerdict} disabled={loadingSwapVerdict} className="w-full rounded-xl py-2.5 font-bold text-[13px] text-violet-400 bg-violet-500/10 flex items-center justify-center gap-1.5 mb-3 disabled:opacity-50">
                  {loadingSwapVerdict ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />} {loadingSwapVerdict ? "ה-AI בודק..." : "מה ה-AI חושב על זה?"}
                </button>
              )}

              {swapVerdict && (
                <div className="rounded-xl p-3 mb-3" style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%)", boxShadow: "0 0 0 1.5px #a855f740 inset" }}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="relative w-9 h-9 shrink-0">
                      <svg viewBox="0 0 36 36" className="-rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke={swapVerdict.score >= 7 ? "#10b981" : swapVerdict.score >= 4 ? "#f59e0b" : "#ef4444"} strokeWidth="3" strokeDasharray={`${(swapVerdict.score / 10) * 94} 94`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white">{swapVerdict.score}</div>
                    </div>
                    <div className="text-[11px] font-bold text-violet-300">כדאיות ההחלפה מול שאר השבוע</div>
                  </div>
                  <div className="text-[12px] text-zinc-300 leading-relaxed">{swapVerdict.note}</div>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => setSwappingSession(null)} className="flex-1 rounded-xl py-2.5 font-bold text-zinc-400 bg-zinc-900">ביטול</button>
                <button onClick={confirmSwap} disabled={!swapTarget} className="flex-1 rounded-xl py-2.5 font-black text-black bg-amber-500 disabled:opacity-40">בצע החלפה</button>
              </div>
            </div>
          </div>
        )}

        {viewingSessionContent && (() => {
          const { session: vSession, dim: vDim, hex: vHex } = viewingSessionContent;
          const bankItem = TRAINING_BANK.find((b) => b.title === vSession.category);
          const VIcon = bankItem?.icon || Dumbbell;
          const linked = (trainingContent || []).find((t) => t.id === vSession.contentId) || (trainingContent || []).find((t) => t.title === vSession.title) || null;
          return (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4" onClick={() => setViewingSessionContent(null)}>
              <style>{`
                @keyframes vsFadeScale { from { opacity: 0; transform: scale(0.94) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes vsConicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes vsDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(5px,-8px); opacity: 0.6; } }
                @keyframes vsShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
                @keyframes vsItemFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes vsCornerPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
                @keyframes vsTextGlow { 0%, 100% { text-shadow: 0 0 6px var(--vg, transparent); } 50% { text-shadow: 0 0 14px var(--vg, transparent); } }
                @keyframes vsUnderline { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
              `}</style>
              <div
                className="relative w-full sm:max-w-xs max-h-[85vh] overflow-y-auto rounded-3xl overflow-hidden"
                style={{ background: `radial-gradient(ellipse 130% 80% at 30% -10%, ${vHex}25, transparent 65%), #0a0a0a`, boxShadow: `0 0 0 2px ${vHex}50, 0 20px 60px -10px ${vHex}40`, animation: "vsFadeScale 0.3s cubic-bezier(0.16,1,0.3,1)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Watermark icon */}
                <VIcon size={160} className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.05]" style={{ color: vHex }} />
                {/* Floating dust */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="absolute w-1 h-1 rounded-full pointer-events-none" style={{ backgroundColor: vHex, left: `${20 + i * 20}%`, top: `${10 + (i % 2) * 15}%`, animation: `vsDust ${4 + i}s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
                {/* Corner brackets */}
                {[["top-3 right-3", "border-t-2 border-r-2"], ["top-3 left-3", "border-t-2 border-l-2"]].map(([pos, border], i) => (
                  <div key={i} className={`absolute ${pos} w-4 h-4 ${border} pointer-events-none z-10`} style={{ borderColor: `${vHex}60`, animation: `vsCornerPulse 3s ease-in-out ${i * 0.4}s infinite` }} />
                ))}

                <button onClick={() => setViewingSessionContent(null)} className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                  <X size={15} className="text-zinc-400" />
                </button>

                <div className="relative p-5 flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 mb-3">
                    <div className="absolute -inset-1.5 rounded-2xl opacity-50" style={{ background: `conic-gradient(from 0deg, ${vHex}, transparent 35%, transparent 65%, ${vHex})`, animation: "vsConicSpin 6s linear infinite" }} />
                    <div className="absolute inset-0 rounded-2xl bg-black border-2 flex items-center justify-center" style={{ borderColor: vHex, boxShadow: `0 0 16px 2px ${vHex}50` }}>
                      <VIcon size={26} style={{ color: vHex }} />
                    </div>
                  </div>
                  <div className="text-lg font-black text-zinc-100">{vSession.title}</div>
                  <div className="text-[12px] font-bold mt-1" style={{ color: vHex, "--vg": `${vHex}80`, animation: "vsTextGlow 3s ease-in-out infinite" }}>{vDim?.label || vSession.category}</div>
                  <div className="w-10 h-0.5 rounded-full mt-2" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${vHex}, transparent)`, backgroundSize: "200% auto", animation: "vsUnderline 3s ease-in-out infinite" }} />
                </div>

                <div className="relative px-4 pb-5">
                  {!linked ? (
                    <div className="rounded-2xl bg-zinc-900/60 p-4 text-center text-[13px] text-zinc-500">
                      האימון הזה לא נמצא יותר במאגר.
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden p-3" style={{ background: `linear-gradient(120deg, ${vHex}18, transparent 70%), rgba(0,0,0,0.3)`, boxShadow: `0 0 0 1.5px ${vHex}35 inset`, animation: "vsItemFadeUp 0.3s ease-out both" }}>
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${vHex}15, transparent)`, animation: "vsShimmer 4s ease-in-out infinite" }} />
                      </div>
                      <div className="relative">
                        <WorkoutTable body={linked.body} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        <GlowButton tone="ghost" icon={requestingNextWeek ? Loader2 : ChevronLeft} className="w-full" disabled={requestingNextWeek} onClick={requestNextWeek}>
          {requestingNextWeek ? "בונה שבוע חדש..." : "בנה לי את השבוע הבא"}
        </GlowButton>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={duplicateLastWeek} disabled={duplicatingWeek} className="rounded-xl py-2.5 text-[12px] font-bold text-zinc-400 border border-zinc-800 flex items-center justify-center gap-1.5">
            {duplicatingWeek ? <Loader2 size={13} className="animate-spin" /> : <Copy size={13} />} שכפל שבוע זה
          </button>
          <button onClick={sharePlan} className="rounded-xl py-2.5 text-[12px] font-bold text-zinc-400 border border-zinc-800 flex items-center justify-center gap-1.5">
            {copiedShare ? <Check size={13} className="text-emerald-400" /> : <Send size={13} />} {copiedShare ? "הועתק" : "שתף מסלול"}
          </button>
        </div>
      </div>
      </div>
      )}

      {pathView === "chat" && (!athleteProfile || showInterview ? (
      <>
        <style>{`@keyframes ivFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        {!showInterview ? (
          <div className="relative rounded-3xl overflow-hidden p-6 flex flex-col items-center text-center" style={{ background: "linear-gradient(160deg, #a855f725, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #a855f750 inset" }}>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full blur-3xl opacity-25 bg-violet-500 pointer-events-none" />
            <div className="relative w-16 h-16 rounded-2xl bg-violet-500/15 border-2 border-violet-500/50 flex items-center justify-center mb-4">
              <Bot size={28} className="text-violet-400" />
            </div>
            <div className="relative text-lg font-black text-zinc-100 mb-2">בואו נכיר לפני שמתחילים</div>
            <div className="relative text-[13px] text-zinc-400 mb-5 max-w-xs leading-relaxed">
              כמה שאלות קצרות כדי שהיועץ ידע להתאים לך משוב מדויק, מבוסס על הערכים האמיתיים של {profile?.targetUnitName || "היעד שלך"} - לא עצות כלליות.
            </div>
            <GlowButton tone="ghost" icon={ChevronLeft} className="w-full max-w-xs" onClick={() => setShowInterview(true)}>
              בואו נתחיל
            </GlowButton>
          </div>
        ) : (
          <div className="space-y-3">
            <Card className="p-4">
              <SectionTitle icon={User}>קצת עליך</SectionTitle>
              <div className="space-y-2.5">
                <input value={ivName} onChange={(e) => setIvName(e.target.value)} placeholder="שם" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                <input type="number" value={ivAge} onChange={(e) => setIvAge(e.target.value)} placeholder="גיל" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                <input value={ivDuration} onChange={(e) => setIvDuration(e.target.value)} placeholder="כמה זמן אתה כבר מתאמן? (למשל: חצי שנה)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
              </div>
            </Card>
            <Card className="p-4">
              <SectionTitle icon={GaugeIcon} tone="amber">איך אתה מדרג את עצמך?</SectionTitle>
              <div className="space-y-3">
                <div>
                  <div className="text-[12px] text-zinc-500 font-semibold mb-1.5">רמת כושר</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["נמוכה", "בינונית", "גבוהה", "כושר שיא"].map((v) => (
                      <button key={v} onClick={() => setIvFitness(v)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${ivFitness === v ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-zinc-500 font-semibold mb-1.5">הערכים שלי כבן אדם</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["נמוכים", "בינוניים", "גבוהים"].map((v) => (
                      <button key={v} onClick={() => setIvValues(v)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${ivValues === v ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[12px] text-zinc-500 font-semibold mb-1.5">יתרונות שכליים</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["נמוכים", "בינוניים", "מעולים"].map((v) => (
                      <button key={v} onClick={() => setIvMental(v)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${ivMental === v ? "bg-sky-500/15 border-sky-500 text-sky-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <SectionTitle icon={Star} tone="red">היתרונות שלי</SectionTitle>
              <div className="space-y-2">
                {ivStrengths.map((s, i) => (
                  <input key={i} value={s} onChange={(e) => updateStrength(i, e.target.value)} placeholder={`יתרון ${i + 1}`} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600" />
                ))}
                {ivStrengths.length < 6 && (
                  <button onClick={addStrengthField} className="text-[12px] font-bold text-emerald-400 flex items-center gap-1"><Plus size={13} /> הוסף יתרון</button>
                )}
              </div>
            </Card>
            {profile?.targetUnitName && getUnitValues(profile.targetUnit) && (
              <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #a855f740 inset" }}>
                <div className="text-[11px] font-black text-violet-400 mb-1.5">מה {profile.targetUnitName} מחפשת</div>
                <div className="flex flex-wrap gap-1">
                  {getUnitValues(profile.targetUnit).traits.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-violet-500/15 text-violet-300">{t.split(" - ")[0]}</span>
                  ))}
                </div>
              </div>
            )}
            <GlowButton tone="emerald" icon={savingInterview ? Loader2 : Check} className="w-full" disabled={savingInterview} onClick={submitInterview}>
              {savingInterview ? "שומר..." : "סיימתי, בואו נתחיל"}
            </GlowButton>
          </div>
        )}
      </>
      ) : (
      <>

      {pathChatSubView === "feedback" && (
      <>
      <Card className="p-4 relative overflow-hidden border-none" style={{ background: "linear-gradient(140deg, #10b98118, transparent 70%), var(--card-base)", boxShadow: "0 0 0 1px #10b98130 inset" }}>
        <style>{`@keyframes pendingFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full blur-3xl opacity-15 bg-emerald-500 pointer-events-none" />
        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <ClipboardCheck size={16} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-[15px] font-black text-zinc-100">אימונים אחרונים</div>
            <div className="text-[11px] text-emerald-500/70 font-semibold">שימור ושיפור</div>
          </div>
          {pastTrainings.length > 0 && (
            <span className="mr-auto rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-black px-2 py-0.5">{pastTrainings.length}</span>
          )}
        </div>
        {pastTrainings.length === 0 ? (
          <div className="relative flex flex-col items-center text-center py-6">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center mb-2">
              <Check size={18} className="text-zinc-700" />
            </div>
            <div className="text-[13px] font-bold text-zinc-500">אין כרגע אימונים חדשים למשוב</div>
            <div className="text-[11px] text-zinc-700 mt-0.5">תראו כאן אימונים ברגע שיסתיימו</div>
          </div>
        ) : (
          <div className="relative space-y-2">
            {pastTrainings.map((t, i) => (
              <button
                key={t.id}
                onClick={() => openReflection(t)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-3 active:scale-[0.98] transition"
                style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98135 inset", animation: `pendingFadeUp 0.4s ease-out ${i * 0.06}s both` }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.group ? "bg-sky-500/15" : "bg-zinc-800"}`}>
                  {t.group ? <Users size={15} className="text-sky-400" /> : <User size={15} className="text-zinc-400" />}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-sm font-bold text-zinc-100 truncate">{t.title}</div>
                  <div className="text-[11px] text-zinc-600">{t.date}</div>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-1 shrink-0">ממתין</span>
                <ChevronLeft size={15} className="text-emerald-500/50 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </Card>

      {reflections.length > 0 && (
        <Card className="p-4">
          <SectionTitle icon={Bot} tone="amber">היסטוריית שימור ושיפור</SectionTitle>
          <div className="space-y-2">
            {reflections.map((r) => (
              <ReflectionHistoryRow key={r.id} r={r} isOpen={openReflectionId === r.id} onToggle={() => setOpenReflectionId(openReflectionId === r.id ? null : r.id)} />
            ))}
          </div>
        </Card>
      )}

      {reflectingOn && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setReflectingOn(null)}>
          <div className="w-full sm:max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative p-4 pb-5 overflow-hidden" style={{ background: "radial-gradient(ellipse 130% 100% at 30% -20%, #0ea5e930, transparent 65%), var(--card-base)" }}>
              <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: "#0ea5e9", animation: "heroPulse 4s ease-in-out infinite" }} />
              <div className="relative flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border-2 border-sky-500/40 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#0ea5e9")}>
                    <Bot size={18} className="text-sky-400" />
                  </div>
                  <div>
                    <div className="text-base font-black text-zinc-100">{reflectingOn.title}</div>
                    <div className="text-[11px] text-zinc-500">{reflectingOn.date}</div>
                  </div>
                </div>
                <button onClick={() => setReflectingOn(null)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-zinc-500 hover:text-zinc-300 shrink-0"><X size={16} /></button>
              </div>

              {!aiTips && (
                <div className="relative flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(([keep1, keep2].filter((s) => s.trim()).length) / 2) * 100}%` }} />
                  </div>
                  <div className="flex-1 h-1 rounded-full bg-amber-500/20 overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(([improve1, improve2].filter((s) => s.trim()).length) / 2) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
            {!aiTips ? (
              <div className="space-y-3.5">
                <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #10b98118, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98140 inset" }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Check size={12} className="text-emerald-400" /></div>
                    <label className="text-[13px] text-emerald-400 font-bold">שני דברים לשימור מהאימון</label>
                  </div>
                  <div className="space-y-2">
                    <input value={keep1} onChange={(e) => setKeep1(e.target.value)} placeholder="דבר ראשון לשימור" className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                    <input value={keep2} onChange={(e) => setKeep2(e.target.value)} placeholder="דבר שני לשימור" className="w-full bg-black/40 border border-emerald-500/20 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                  </div>
                </div>

                <div className="rounded-2xl p-3.5" style={{ background: "linear-gradient(120deg, #f59e0b18, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center"><TrendingUp size={12} className="text-amber-400" /></div>
                    <label className="text-[13px] text-amber-400 font-bold">שני דברים לשיפור מהאימון</label>
                  </div>
                  <div className="space-y-2">
                    <input value={improve1} onChange={(e) => setImprove1(e.target.value)} placeholder="דבר ראשון לשיפור" className="w-full bg-black/40 border border-amber-500/20 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
                    <input value={improve2} onChange={(e) => setImprove2(e.target.value)} placeholder="דבר שני לשיפור" className="w-full bg-black/40 border border-amber-500/20 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
                  </div>
                </div>

                <GlowButton tone="emerald" icon={reflectLoading ? Loader2 : Send} className="w-full" disabled={reflectLoading} onClick={submitReflection}>
                  {reflectLoading ? "שולח ל-AI..." : "שלח וקבל טיפים אישיים"}
                </GlowButton>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-[13px] text-emerald-400 font-semibold mb-1.5">מה שכתבת לשימור</div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 space-y-1">
                    <div>• {keep1}</div>
                    <div>• {keep2}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-amber-400 font-semibold mb-1.5">מה שכתבת לשיפור</div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-300 space-y-1">
                    <div>• {improve1}</div>
                    <div>• {improve2}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-sky-400 font-semibold mb-1.5 flex items-center gap-1"><Bot size={12} /> 5 דרכים לעבוד על זה אישית</div>
                  {(() => {
                    const { score, question, body } = parseReflectionReply(aiTips);
                    return (
                      <>
                        {score !== null && (
                          <div className="flex items-center gap-3 mb-3 rounded-xl bg-black/30 p-3">
                            <div className="relative w-12 h-12 shrink-0">
                              <svg viewBox="0 0 48 48" className="-rotate-90">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="#27272a" strokeWidth="4" />
                                <circle cx="24" cy="24" r="20" fill="none" stroke={score >= 7 ? "#10b981" : score >= 4 ? "#f59e0b" : "#ef4444"} strokeWidth="4" strokeDasharray={`${(score / 10) * 126} 126`} strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-white">{score}</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-[12px] font-bold text-zinc-300">ציון איכות המשוב שלך</div>
                              <div className="text-[11px] text-zinc-500">{score >= 7 ? "משוב מפורט ומודע-עצמית" : score >= 4 ? "משוב סביר - אפשר לפרט יותר" : "נסה לפרט יותר בפעם הבאה"}</div>
                            </div>
                          </div>
                        )}
                        <div className="bg-sky-500/[0.06] border border-sky-500/30 rounded-lg p-3 text-base text-zinc-200 leading-relaxed [&>*:last-child]:mb-0">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2">{children}</p>,
                              strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                              ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pr-4 space-y-1 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            }}
                          >
                            {body}
                          </ReactMarkdown>
                        </div>
                        {question && (
                          <div className="mt-2.5 rounded-xl p-3 flex items-start gap-2" style={{ background: "linear-gradient(120deg, #a855f718, transparent 75%)", boxShadow: "0 0 0 1.5px #a855f740 inset" }}>
                            <Bot size={14} className="text-violet-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-[10px] font-black uppercase text-violet-400 mb-0.5">שאלה למחשבה</div>
                              <div className="text-[13px] text-zinc-200 font-semibold">{question}</div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                <GlowButton tone="ghost" className="w-full" onClick={() => setReflectingOn(null)}>סגור</GlowButton>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
      </>
      )}

      </>
      ))}

      {addingSession && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setAddingSession(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-base font-black text-zinc-100 mb-3">הוספה ליומן</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[12px] text-zinc-500">משעה</label>
                <input type="time" value={addTimes.start} onChange={(e) => setAddTimes((t) => ({ ...t, start: e.target.value }))} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-base text-zinc-100 mt-1" />
              </div>
              <div>
                <label className="text-[12px] text-zinc-500">עד שעה</label>
                <input type="time" value={addTimes.end} onChange={(e) => setAddTimes((t) => ({ ...t, end: e.target.value }))} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-base text-zinc-100 mt-1" />
              </div>
            </div>
            <GlowButton tone="emerald" icon={Check} className="w-full" disabled={!addTimes.start || !addTimes.end} onClick={confirmAddToCalendar}>אישור</GlowButton>
          </div>
        </div>
      )}

      {nextSession && pathView === "plan" && (
        <button
          onClick={() => { selectDay(WEEK_DAYS_HE.indexOf(nextSession.day)); window.scrollTo?.({ top: 0, behavior: "smooth" }); }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg active:scale-95 transition"
          style={{ backgroundColor: "#10b981", boxShadow: "0 4px 16px rgba(16,185,129,0.5)" }}
        >
          <Zap size={14} className="text-black" />
          <span className="text-[12px] font-black text-black">מה עכשיו</span>
        </button>
      )}

      {undoToast && (
        <div className="fixed bottom-24 right-4 left-4 z-40 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 bg-zinc-900 border border-zinc-700 shadow-lg">
          <span className="text-[13px] text-zinc-300 font-semibold flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> סומן כהושלם</span>
          <button onClick={() => undoComplete(undoToast)} className="text-[13px] font-black text-emerald-400">בטל</button>
        </div>
      )}
    </div>
  );
}



function HubTab({ articles, valuesContent, profile, resetSignal, scrollToTop, userId, showToast, jumpToValueId, onJumpHandled, isPremium }) {
  const [view, setView] = useState("main"); // 'main' | 'יחידות' | 'unit_detail' | 'גיבושים' | 'gibush_detail' | 'ערכים'
  useEffect(() => { if (resetSignal) setView("main"); }, [resetSignal]);
  useEffect(() => { scrollToTop?.(); }, [view]);
  const [pageContent, setPageContent] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [unitContent, setUnitContent] = useState(null); // { loading, data } for the currently open unit specifically
  const [openArticle, setOpenArticle] = useState(null);
  const [openUnit, setOpenUnit] = useState(null);
  const [unitFontScale, setUnitFontScale] = useState(1);
  const [showUnitScrollTop, setShowUnitScrollTop] = useState(false);
  const [askingUnitAi, setAskingUnitAi] = useState(false);
  const [unitAiAnswer, setUnitAiAnswer] = useState("");
  async function askAiAboutUnit(unitName, question) {
    setAskingUnitAi(true);
    setUnitAiAnswer("");
    try {
      const sys = `אתה מומחה ביחידות עילית בצה"ל. ענה בקצרה (2-3 משפטים) על שאלה לגבי היחידה "${unitName}".`;
      const reply = await aiChat(sys, question);
      setUnitAiAnswer(reply);
    } catch (e) {
      setUnitAiAnswer("לא הצלחתי לענות כרגע.");
    } finally {
      setAskingUnitAi(false);
    }
  }
  const [openGibush, setOpenGibush] = useState(null);
  const [gibushVersionsName, setGibushVersionsName] = useState(null);
  const [gibushVersionsSort, setGibushVersionsSort] = useState("new"); // 'new' | 'old'
  const [gibushPortalSearch, setGibushPortalSearch] = useState("");
  const [readGibushIds, setReadGibushIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_read_gibushim") || "[]"); } catch (e) { return []; }
  });
  const [openPhase, setOpenPhase] = useState(0);
  const [viewedPhaseIndices, setViewedPhaseIndices] = useState(new Set([0]));
  const [suitCheckList, setSuitCheckList] = useState({});
  const [openYerpa, setOpenYerpa] = useState(null);
  const [articleFilter, setArticleFilter] = useState("הכל");
  const [articleSortMode, setArticleSortMode] = useState("new"); // 'new' | 'unit'
  const [articleSearch, setArticleSearch] = useState("");
  const [readArticleIds, setReadArticleIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_read_articles") || "[]"); } catch (e) { return []; }
  });
  const [recentArticleIds, setRecentArticleIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_recent_articles") || "[]"); } catch (e) { return []; }
  });
  function markArticleRead(id) {
    setReadArticleIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem("sayert_read_articles", JSON.stringify(next)); } catch (e) {}
      return next;
    });
    setRecentArticleIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 6);
      try { localStorage.setItem("sayert_recent_articles", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  const [unitSearch, setUnitSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Recently-viewed and favorite units persist across sessions via localStorage -
  // lightweight, personal-device convenience that doesn't need a database round-trip.
  const [recentUnitIds, setRecentUnitIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_recent_units") || "[]"); } catch (e) { return []; }
  });
  const [favoriteUnitIds, setFavoriteUnitIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_favorite_units") || "[]"); } catch (e) { return []; }
  });
  function markUnitViewed(unitId) {
    setRecentUnitIds((prev) => {
      const next = [unitId, ...prev.filter((id) => id !== unitId)].slice(0, 6);
      try { localStorage.setItem("sayert_recent_units", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  function toggleFavoriteUnit(unitId, e) {
    e?.stopPropagation();
    setFavoriteUnitIds((prev) => {
      const next = prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId];
      try { localStorage.setItem("sayert_favorite_units", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }

  // ---- Rich value-content reading view state ----
  const [openValue, setOpenValue] = useState(null);
  const [valueFontSize, setValueFontSize] = useState(17);
  const [savedValueIds, setSavedValueIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_saved_values") || "[]"); } catch (e) { return []; }
  });
  const [readProgress, setReadProgress] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [copiedValue, setCopiedValue] = useState(false);

  function toggleSavedValue(id, e) {
    e?.stopPropagation();
    setSavedValueIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_saved_values", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }

  const [readValueIds, setReadValueIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_read_values") || "[]"); } catch (e) { return []; }
  });
  const [recentValueIds, setRecentValueIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_recent_values") || "[]"); } catch (e) { return []; }
  });
  const [valueSearch, setValueSearch] = useState("");
  const [valueListFilter, setValueListFilter] = useState("הכל"); // 'הכל' | 'שמורים' | 'לא נקראו'
  const [flagshipCarouselIdx, setFlagshipCarouselIdx] = useState(0);
  useEffect(() => {
    if (!valuesContent || valuesContent.length < 2) return;
    const id = setInterval(() => setFlagshipCarouselIdx((i) => (i + 1) % valuesContent.length), 3500);
    return () => clearInterval(id);
  }, [valuesContent?.length]);
  function markValueRead(id) {
    setReadValueIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem("sayert_read_values", JSON.stringify(next)); } catch (e) {}
      return next;
    });
    setRecentValueIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 5);
      try { localStorage.setItem("sayert_recent_values", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  function extractValueQuote(body) {
    const match = body.match(/^\*\*(.+?)\*\*/m);
    return match ? match[1] : (body.split("\n\n")[0] || "").replace(/[*#>-]/g, "").slice(0, 90);
  }

  async function openValueDetail(c) {
    setOpenValue(c);
    setValueFontSize(17);
    setReadProgress(0);
    setAiInsight("");
    setReflectionSaved(false);
    setReflectionText(userId ? await loadValueReflection(userId, c.id) : "");
    markValueRead(c.id);
  }

  // Cross-tab navigation: the siren notification on the Home page can pass a
  // specific values-content id here to jump straight into it, bypassing the list.
  useEffect(() => {
    if (!jumpToValueId) return;
    const match = (valuesContent || []).find((v) => v.id === jumpToValueId);
    if (match) {
      setPageContent(valuesContent);
      setView("ערכים");
      openValueDetail(match);
    }
    onJumpHandled?.();
  }, [jumpToValueId]);

  async function saveReflection() {
    if (!userId || !openValue) return;
    await saveValueReflection(userId, openValue.id, reflectionText.trim());
    setReflectionSaved(true);
    showToast?.("נשמר", "success");
    setTimeout(() => setReflectionSaved(false), 2000);
  }

  async function getAiInsight() {
    if (!openValue) return;
    setLoadingInsight(true);
    try {
      const sys = "אתה מדריך ערכי לבני נוער 16-19 בהכנה לגיוס. קיבלת מאמר ערכי. תן שאלת רפלקציה אישית אחת, ממוקדת וחדה (לא כללית), שתגרום לקורא לחשוב איך הערך הזה בא לידי ביטוי בחיים שלו ספציפית. עד 2-3 משפטים, בעברית, ישיר וחם.";
      const reply = await aiChat(sys, `הכותרת: ${openValue.title}\n\nהתוכן: ${openValue.body}`, []);
      setAiInsight(reply);
    } catch (e) {
      setAiInsight("לא הצלחתי לייצר שאלה כרגע - נסה שוב.");
    } finally {
      setLoadingInsight(false);
    }
  }

  function copyValueText() {
    if (!openValue) return;
    navigator.clipboard?.writeText(`${openValue.title}\n\n${openValue.body}`).then(() => {
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 1800);
    });
  }

  // ---- Tips-article reading experience state (distinct features from values content) ----
  const [articleFontSize, setArticleFontSize] = useState(16);
  const [savedArticleIds, setSavedArticleIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sayert_saved_articles") || "[]"); } catch (e) { return []; }
  });
  const [articleProgress, setArticleProgress] = useState(0);
  const [checkedTips, setCheckedTips] = useState({});
  const [trainingPlanInsight, setTrainingPlanInsight] = useState("");
  const [loadingPlanInsight, setLoadingPlanInsight] = useState(false);

  function toggleSavedArticle(id, e) {
    e?.stopPropagation();
    setSavedArticleIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem("sayert_saved_articles", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }
  function toggleTipChecked(idx) {
    setCheckedTips((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }
  async function getTrainingPlanInsight(article) {
    setLoadingPlanInsight(true);
    try {
      const sys = "אתה מאמן כושר קרבי עילי. קיבלת טיפ אישי שכתב בוגר יחידה, ורוצה לעזור לקורא לתרגם אותו לפעולה קונקרטית בתוכנית האימונים שלו. תן המלצה אחת קצרה, ישימה ומעשית (2-3 משפטים), בלי הקדמות.";
      const reply = await aiChat(sys, `הטיפ: ${article.title}\n\n${article.excerpt}\n\nאיך אני יכול לתרגם את זה לפעולה מעשית בתוכנית האימונים שלי השבוע?`, []);
      setTrainingPlanInsight(reply);
    } catch (e) {
      setTrainingPlanInsight("לא הצלחתי לייצר המלצה כרגע.");
    } finally {
      setLoadingPlanInsight(false);
    }
  }
  function extractTips(text) {
    return text.split(/[.\n]/).map((s) => s.trim()).filter((s) => s.length > 20 && s.length < 120 && /כדאי|חשוב|תתאמן|תתכונן|צריך|לזכור|לא לשכוח|מומלץ/.test(s)).slice(0, 5);
  }
  function extractPullQuote(text) {
    const sentences = text.split(/[.\n]/).map((s) => s.trim()).filter((s) => s.length > 40 && s.length < 130);
    return sentences.sort((a, b) => b.length - a.length)[Math.floor(sentences.length / 3)] || sentences[0] || null;
  }

  // ---- Gibush detail: deterministic parsing helpers, no AI involved ----
  function parseGibushPhases(body) {
    const parts = body.split(/^## /m).filter((p) => p.trim());
    return parts.map((p) => {
      const [title, ...rest] = p.split("\n");
      return { title: title.trim(), content: rest.join("\n").trim() };
    });
  }
  function parseGibushStats(body) {
    const nights = (body.match(/לילה (הראשון|השני|שלישי|רביעי)/g) || []).length || (body.match(/## לילה/g) || []).length;
    const marches = (body.match(/מסע/g) || []).length;
    const crawlMatches = [...body.matchAll(/(\d+)[–-](\d+)\s*מקצי זחילות/g)];
    const sprintMatches = [...body.matchAll(/(\d+)[–-](\d+)\s*מקצי ספרינטים/g)];
    const sumRange = (matches) => matches.reduce((sum, m) => sum + (parseInt(m[1], 10) + parseInt(m[2], 10)) / 2, 0);
    return {
      nights: nights || 2,
      marches,
      crawlRounds: Math.round(sumRange(crawlMatches)) || null,
      sprintRounds: Math.round(sumRange(sprintMatches)) || null,
      hasInterviews: /ראיונ/.test(body),
    };
  }
  function markGibushRead(id) {
    setReadGibushIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem("sayert_read_gibushim", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }

  async function openView(v) {
    setView(v);
    setLoadingPage(true);
    const content = await loadContentRemote("unit_info", v);
    setPageContent(content);
    setLoadingPage(false);
  }

  // Independent fetch for the currently-open unit - never trusts pageContent alone,
  // since that depends on however the user navigated here. This guarantees the real
  // content loads every single time, regardless of navigation path or timing.
  useEffect(() => {
    if (view !== "unit_detail" || !openUnit) return;
    let cancelled = false;
    setUnitContent({ loading: true, data: null });
    loadContentRemote("unit_info", "יחידות").then((rows) => {
      if (cancelled) return;
      const match = rows.find((c) => c.title === openUnit.id) || null;
      setUnitContent({ loading: false, data: match });
    });
    return () => { cancelled = true; };
  }, [view, openUnit]);

  if (view === "יחידות") {
    const baseUnits = showFavoritesOnly ? UNITS.filter((u) => favoriteUnitIds.includes(u.id)) : UNITS;
    const filteredUnits = unitSearch.trim() ? baseUnits.filter((u) => u.name.includes(unitSearch.trim())) : baseUnits;
    const recentUnits = recentUnitIds.map((id) => UNITS.find((u) => u.id === id)).filter(Boolean);
    return (
      <div className="p-4">
        <button onClick={() => { setView("main"); setUnitSearch(""); }} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה למאגר
        </button>
        <SectionTitle icon={Shield}>יחידות עילית</SectionTitle>

        {recentUnits.length > 0 && !unitSearch.trim() && !showFavoritesOnly && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3.5" style={{ scrollbarWidth: "none" }}>
            {recentUnits.map((u) => (
              <button key={u.id} onClick={() => { setOpenUnit(u); setView("unit_detail"); markUnitViewed(u.id); }} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border" style={{ borderColor: `${u.hex}50`, backgroundColor: `${u.hex}12` }}>
                <Clock size={11} style={{ color: u.hex }} />
                <span className="text-[12px] font-bold" style={{ color: u.hex }}>{u.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="relative mb-3">
          <input
            value={unitSearch}
            onChange={(e) => setUnitSearch(e.target.value)}
            placeholder={`חיפוש מתוך ${UNITS.length} יחידות...`}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300"
          />
          <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        </div>
        <button onClick={() => setShowFavoritesOnly((s) => !s)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold border mb-4 transition ${showFavoritesOnly ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
          <Star size={12} fill={showFavoritesOnly ? "#fbbf24" : "none"} /> {showFavoritesOnly ? "מציג מועדפים" : "מועדפים בלבד"}
        </button>
        {filteredUnits.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl">{showFavoritesOnly ? "עדיין לא סימנת יחידות מועדפות" : "אין תוצאות"}</div>
        ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredUnits.map((u) => {
            const published = pageContent.find((c) => c.title === u.id);
            const isFav = favoriteUnitIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => { setOpenUnit(u); setView("unit_detail"); markUnitViewed(u.id); }}
                className="relative flex flex-col items-center gap-2 rounded-2xl p-4 overflow-hidden active:scale-95 transition"
                style={{ background: `linear-gradient(160deg, ${u.hex}20, transparent 70%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${u.hex}40 inset` }}
              >
                <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-30" style={{ backgroundColor: u.hex }} />
                <button onClick={(e) => toggleFavoriteUnit(u.id, e)} className="absolute left-2 top-2 z-10 w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
                  <Star size={12} className={isFav ? "text-amber-400" : "text-zinc-500"} fill={isFav ? "#fbbf24" : "none"} />
                </button>
                <div className="relative w-14 h-14 rounded-full bg-black border-2 flex items-center justify-center overflow-hidden glow-pulse" style={{ borderColor: u.hex, ...glowVars(u.hex) }}>
                  {published?.imageUrl ? (
                    <img src={published.imageUrl} alt={u.name} className="w-full h-full object-cover" />
                  ) : u.image ? (
                    <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                  ) : (
                    <Shield size={22} style={{ color: u.hex }} />
                  )}
                </div>
                <span className="relative text-[13px] font-bold text-zinc-100 text-center leading-tight">{u.name}</span>
              </button>
            );
          })}
        </div>
        )}
        {filteredUnits.length > 10 && (
          <button onClick={() => scrollToTop?.()} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg active:scale-90 transition z-20" style={{ boxShadow: "0 4px 16px rgba(16,185,129,0.5)" }}>
            <ChevronUp size={18} />
          </button>
        )}
      </div>
    );
  }

  if (view === "unit_detail" && openUnit) {
    const published = unitContent?.data || null;
    const stillLoading = !unitContent || unitContent.loading;
    const isFav = favoriteUnitIds.includes(openUnit.id);
    const wordCount = published?.body ? published.body.split(/\s+/).length : 0;
    const readMins = Math.max(1, Math.ceil(wordCount / 180));
    const headers = published?.body ? (published.body.match(/^#{1,3}\s+.+$/gm) || []).map((h) => h.replace(/^#+\s*/, "")) : [];
    return (
      <div className="p-4 relative">
        <style>{`
          @keyframes unitDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(6px,-10px); opacity: 0.6; } }
          @keyframes unitConicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes unitTextGlow { 0%, 100% { text-shadow: 0 0 8px var(--glow-color, transparent); } 50% { text-shadow: 0 0 16px var(--glow-color, transparent); } }
          @keyframes unitFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes unitShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes unitCornerPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
          @keyframes unitUnderline { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        `}</style>
        {/* Background watermark shield */}
        <Shield size={220} className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.03]" style={{ color: openUnit.hex }} />
        {/* Floating dust particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full pointer-events-none" style={{ backgroundColor: openUnit.hex, left: `${(i * 37 + 10) % 90}%`, top: `${(i * 23 + 15) % 40}%`, animation: `unitDust ${4 + i}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
        <div className="relative flex items-center justify-between mb-4">
          <button onClick={() => setView("יחידות")} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold">
            <ChevronRight size={16} /> חזרה ליחידות
          </button>
          <div className="flex items-center gap-2">
            <button onClick={(e) => toggleFavoriteUnit(openUnit.id, e)} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
              <Star size={15} className={isFav ? "text-amber-400" : "text-zinc-600"} fill={isFav ? "#fbbf24" : "none"} />
            </button>
            <button
              onClick={() => {
                const shareText = `${openUnit.name} - ${openUnit.tagline}`;
                navigator.clipboard?.writeText(shareText);
                showToast?.("הועתק", "success");
              }}
              className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"
            >
              <Send size={13} className="text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-col items-center text-center mb-5" style={{ animation: "unitFadeUp 0.35s ease-out both" }}>
          <div className="relative w-24 h-24 mb-3">
            <div className="absolute -inset-1.5 rounded-full opacity-50" style={{ background: `conic-gradient(from 0deg, ${openUnit.hex}, transparent 35%, transparent 65%, ${openUnit.hex})`, animation: "unitConicSpin 6s linear infinite" }} />
            <div className="absolute inset-0 rounded-full bg-black border-2 flex items-center justify-center overflow-hidden glow-pulse" style={{ borderColor: openUnit.hex, ...glowVars(openUnit.hex) }}>
              {published?.imageUrl ? (
                <img src={published.imageUrl} alt={openUnit.name} className="w-full h-full object-cover" />
              ) : openUnit.image ? (
                <img src={openUnit.image} alt={openUnit.name} className="w-full h-full object-cover" />
              ) : (
                <Shield size={38} style={{ color: openUnit.hex }} />
              )}
            </div>
          </div>
          <div className="text-xl font-black text-zinc-100">{openUnit.name}</div>
          <div className="text-base font-bold mt-1" style={{ color: openUnit.hex, "--glow-color": `${openUnit.hex}80`, animation: "unitTextGlow 3s ease-in-out infinite" }}>{openUnit.tagline}</div>
          <div className="w-12 h-0.5 rounded-full mt-2" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${openUnit.hex}, transparent)`, backgroundSize: "200% auto", animation: "unitUnderline 3s ease-in-out infinite" }} />
        </div>

        {published && !stillLoading && (
          <div className="relative flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1"><Clock size={11} /> {readMins} דק׳ קריאה</span>
            <div className="flex items-center gap-1 mr-auto">
              <button onClick={() => setUnitFontScale((s) => Math.max(0.85, s - 0.1))} className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[11px] font-bold">א-</button>
              <button onClick={() => setUnitFontScale((s) => Math.min(1.3, s + 0.1))} className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-[13px] font-bold">א+</button>
            </div>
          </div>
        )}

        {headers.length > 1 && (
          <div className="relative flex gap-1.5 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: "none" }}>
            {headers.map((h, i) => (
              <span key={i} className="shrink-0 text-[10px] font-bold rounded-full px-2.5 py-1" style={{ backgroundColor: `${openUnit.hex}18`, color: openUnit.hex }}>{i + 1}. {h}</span>
            ))}
          </div>
        )}

        <Card className="relative p-4 leading-9 [&>*:last-child]:mb-0 overflow-hidden" style={{ fontSize: `${17 * unitFontScale}px`, boxShadow: `0 0 0 1.5px ${openUnit.hex}30 inset` }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${openUnit.hex}10, transparent)`, animation: "unitShimmer 5s ease-in-out 1s infinite" }} />
          </div>
          {[["top-3 right-3", "border-t-2 border-r-2"], ["top-3 left-3", "border-t-2 border-l-2"]].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-4 h-4 ${border} pointer-events-none`} style={{ borderColor: `${openUnit.hex}50`, animation: `unitCornerPulse 3s ease-in-out ${i * 0.5}s infinite` }} />
          ))}
          <div className="relative text-zinc-200">
          {stillLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-zinc-500 text-sm">
              <Loader2 size={16} className="animate-spin" /> טוען תוכן...
            </div>
          ) : published ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3">{children}</p>,
                strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-3">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pr-4 space-y-1 mb-3">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                h1: ({ children }) => <div className="font-black text-lg mb-2 pb-1.5 border-b" style={{ color: openUnit.hex, borderColor: `${openUnit.hex}40` }}>{children}</div>,
                h2: ({ children }) => <div className="font-black text-lg mb-2 pb-1.5 border-b" style={{ color: openUnit.hex, borderColor: `${openUnit.hex}40` }}>{children}</div>,
                h3: ({ children }) => <div className="font-bold text-base mb-1.5" style={{ color: openUnit.hex }}>{children}</div>,
              }}
            >
              {published.body}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-6">
              <div className="text-zinc-500 text-sm mb-3">עדיין לא פורסם תוכן ליחידה זו</div>
              <button onClick={() => setOpenUnit({ ...openUnit })} className="text-emerald-400 text-sm font-bold underline">נסה שוב</button>
            </div>
          )}
          </div>
        </Card>

        {published && !stillLoading && (
          <div className="relative mt-3 rounded-2xl p-3.5" style={{ background: `linear-gradient(120deg, ${openUnit.hex}18, transparent 75%)`, boxShadow: `0 0 0 1.5px ${openUnit.hex}40 inset` }}>
            {unitAiAnswer ? (
              <div className="text-[13px] text-zinc-200 leading-relaxed flex items-start gap-2">
                <Bot size={14} className="shrink-0 mt-0.5" style={{ color: openUnit.hex }} /> {unitAiAnswer}
              </div>
            ) : (
              <button onClick={() => askAiAboutUnit(openUnit.name, `מה חשוב לדעת כדי להתכונן ל${openUnit.name}?`)} disabled={askingUnitAi} className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold disabled:opacity-50" style={{ color: openUnit.hex }}>
                {askingUnitAi ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />} {askingUnitAi ? "חושב..." : "שאל את ה-AI איך להתכונן ליחידה הזו"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (view === "גיבושים") {
    const availableCount = GIBUSHIM_LIST.filter((name) => pageContent.some((x) => x.title === name)).length;
    let namesToShow = GIBUSHIM_LIST;
    if (gibushPortalSearch.trim()) namesToShow = namesToShow.filter((name) => name.includes(gibushPortalSearch.trim()));
    return (
      <div className="p-4">
        <style>{`
          @keyframes gibushCardFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <button onClick={() => setView("main")} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה למאגר
        </button>

        <div className="relative rounded-3xl overflow-hidden p-5 mb-4 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #f59e0b30, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ backgroundColor: "#f59e0b", animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="relative flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#f59e0b")}>
              <Target size={22} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-zinc-50">פורטל גיבושים</div>
              <div className="text-[12px] text-zinc-500">{availableCount} מתוך {GIBUSHIM_LIST.length} עם תוכן זמין</div>
            </div>
          </div>
        </div>

        {GIBUSHIM_LIST.length > 6 && (
          <div className="relative mb-3.5">
            <input
              value={gibushPortalSearch}
              onChange={(e) => setGibushPortalSearch(e.target.value)}
              placeholder="חיפוש גיבוש..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300"
            />
            <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          </div>
        )}

        {loadingPage ? (
          <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {namesToShow.map((name, i) => {
              const matches = pageContent.filter((x) => x.title === name);
              const hasContent = matches.length > 0;
              const versionCount = matches.length;
              const anyRead = matches.some((m) => readGibushIds.includes(m.id));
              const style = GIBUSH_PORTAL_STYLE[name] || { hex: "#f59e0b", shiny: false };
              const textHex = style.dark ? "#a1a1aa" : style.hex;
              const CardIcon = GIBUSH_PORTAL_ICONS[name] || Target;
              return (
                <button
                  key={name}
                  onClick={() => {
                    if (!hasContent) return;
                    setGibushVersionsName(name);
                    setView("gibush_versions");
                  }}
                  className={`relative rounded-2xl p-4 text-right border-2 transition overflow-hidden ${hasContent ? "active:scale-[0.97]" : "bg-zinc-950 border-zinc-800 opacity-40"} ${hasContent && style.shiny ? "glow-pulse" : ""}`}
                  style={{
                    ...(hasContent
                      ? {
                          background: style.dark ? "linear-gradient(160deg, #27272a, #000)" : `linear-gradient(160deg, ${style.hex}22, transparent 70%), #0a0a0a`,
                          borderColor: style.matte ? `${style.hex}55` : `${style.hex}80`,
                          boxShadow: style.shiny ? `0 0 16px 1px ${style.hex}50, 0 0 0 1px ${style.hex}90 inset` : `0 0 0 1px ${style.hex}40 inset`,
                          ...(style.shiny ? glowVars(style.hex) : {}),
                        }
                      : {}),
                    animation: `gibushCardFadeUp 0.4s ease-out ${i * 0.05}s both`,
                  }}
                >
                  {style.shiny && hasContent && (
                    <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-30" style={{ backgroundColor: style.hex }} />
                  )}
                  {hasContent && anyRead && (
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={11} className="text-black" />
                    </div>
                  )}
                  <CardIcon size={18} className="relative mb-2" style={{ color: hasContent ? textHex : "#3f3f46" }} />
                  <div className={`relative text-base font-black leading-tight ${hasContent ? "text-zinc-100" : "text-zinc-600"}`}>{name}</div>
                  {hasContent ? (
                    <div className="relative flex items-center gap-1.5 mt-1.5">
                      <span className="text-[12px] font-bold" style={{ color: textHex }}>בחר תאריך ←</span>
                      {versionCount > 1 && (
                        <span className="text-[10px] font-black rounded-full px-1.5 py-0.5" style={{ backgroundColor: `${style.hex}30`, color: textHex }}>{versionCount}</span>
                      )}
                    </div>
                  ) : (
                    <div className="relative text-[12px] text-zinc-700 mt-1.5">אין עדיין מידע</div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (view === "gibush_versions" && gibushVersionsName) {
    const style = GIBUSH_PORTAL_STYLE[gibushVersionsName] || { hex: "#f59e0b", shiny: false };
    const hex = style.dark ? "#a1a1aa" : style.hex;
    const CardIcon = GIBUSH_PORTAL_ICONS[gibushVersionsName] || Target;
    let versions = pageContent.filter((x) => x.title === gibushVersionsName);
    versions = [...versions].sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return gibushVersionsSort === "new" ? bTime - aTime : aTime - bTime;
    });
    const newestId = versions.length > 0 ? [...versions].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0].id : null;
    return (
      <div className="p-4">
        <button onClick={() => { setView("גיבושים"); setGibushVersionsName(null); }} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה לפורטל
        </button>

        <div className="relative rounded-3xl overflow-hidden p-5 mb-4 tech-grid" style={{ background: `radial-gradient(ellipse 130% 90% at 25% -15%, ${hex}30, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${hex}45 inset` }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ backgroundColor: hex, animation: "heroPulse 4s ease-in-out infinite" }} />
          <div className="relative flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-black border-2 flex items-center justify-center shrink-0 glow-pulse" style={{ borderColor: hex, ...glowVars(hex) }}>
              <CardIcon size={22} style={{ color: hex }} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-zinc-50">{gibushVersionsName}</div>
              <div className="text-[12px] text-zinc-500">{versions.length === 1 ? "גרסה אחת זמינה" : `${versions.length} גרסאות זמינות`} · בחרו לפי תאריך</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[12px] text-zinc-500">מיון:</span>
          <button onClick={() => setGibushVersionsSort((s) => (s === "new" ? "old" : "new"))} className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
            <ChevronDown size={12} /> {gibushVersionsSort === "new" ? "החדש קודם" : "הישן קודם"}
          </button>
        </div>

        <div className="relative space-y-2.5">
          <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-amber-500/20" />
          {versions.map((v, i) => {
            const isNewest = v.id === newestId;
            const isRead = readGibushIds.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => { setOpenGibush(v); setView("gibush_detail"); markGibushRead(v.id); }}
                className="relative w-full flex items-start gap-3 text-right"
                style={{ animation: `gibushCardFadeUp 0.4s ease-out ${i * 0.07}s both` }}
              >
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${isRead ? "bg-emerald-500/20 border-emerald-500" : "bg-black border-amber-500/50"}`}>
                  {isRead ? <Check size={16} className="text-emerald-400" /> : <Clock size={15} className="text-amber-400" />}
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden p-3.5" style={{ background: "linear-gradient(120deg, #f59e0b18, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-bold px-2 py-0.5">
                      <Clock size={10} /> {v.dateLabel || "ללא תאריך"}
                    </span>
                    {isNewest && <span className="rounded-full bg-red-500 text-white text-[10px] font-black px-2 py-0.5">החדש ביותר</span>}
                  </div>
                  <div className="text-[13px] text-zinc-400 line-clamp-2 leading-relaxed">{v.body.replace(/[*_#>-]/g, "").slice(0, 90)}...</div>
                </div>
                <ChevronLeft size={17} className="text-amber-500/60 shrink-0 mt-3" />
              </button>
            );
          })}
        </div>

        {versions.length > 1 && (
          <button
            onClick={() => { const newest = versions.find((v) => v.id === newestId); if (newest) { setOpenGibush(newest); setView("gibush_detail"); markGibushRead(newest.id); } }}
            className="w-full mt-4 rounded-2xl py-3 text-center text-[13px] font-bold text-amber-400 border border-amber-500/40 bg-amber-500/10"
          >
            פתח את הגרסה החדשה ביותר ←
          </button>
        )}
      </div>
    );
  }

  if (view === "gibush_detail" && openGibush) {
    const phases = parseGibushPhases(openGibush.body);
    const stats = parseGibushStats(openGibush.body);
    const isRead = readGibushIds.includes(openGibush.id);
    const phaseIcons = [Compass, Moon, Moon, Users, Star];
    const phaseProgress = viewedPhaseIndices.size;
    // Deterministic (no AI) intensity score from parsed physical-activity volume,
    // not a raw count display - just how heavy the gibush reads overall, 1-5.
    const intensityScore = (stats.nights || 0) * 1.2 + (stats.marches || 0) * 1.5 + (stats.crawlRounds || 0) * 0.15 + (stats.sprintRounds || 0) * 0.15;
    const intensityLevel = Math.max(1, Math.min(5, Math.round(intensityScore / 3)));
    const intensityLabel = ["קלה", "בינונית", "גבוהה", "גבוהה מאוד", "קיצונית"][intensityLevel - 1];
    return (
      <div className="p-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="relative flex items-center justify-between mb-4">
          <button onClick={() => setView("גיבושים")} className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 text-base font-bold">
            <ChevronRight size={16} /> חזרה לגיבושים
          </button>
          <div className="flex items-center gap-2">
            {navigator.share && (
              <button onClick={() => navigator.share({ title: openGibush.title, text: `${openGibush.title} - ${openGibush.dateLabel || ""}` })} className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                <Send size={13} className="text-zinc-400" />
              </button>
            )}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden p-5 mb-4 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #f59e0b30, transparent 65%), #0a0a12", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ backgroundColor: "#f59e0b", animation: "heroPulse 4s ease-in-out infinite" }} />
          <style>{`
            @keyframes heroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } }
            @keyframes constellationFloat { 0%, 100% { transform: translate(0, 0); opacity: 0.2; } 50% { transform: translate(6px, -10px); opacity: 0.6; } }
          `}</style>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="absolute rounded-full bg-amber-300" style={{ width: 2, height: 2, left: `${(i * 43 + 15) % 90}%`, top: `${(i * 29 + 10) % 60}%`, opacity: 0.5, animation: `constellationFloat ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }} />
          ))}
          <div className="relative flex flex-col items-center text-center">
            <div className="relative w-16 h-16 rounded-2xl bg-black border-2 border-amber-500/60 flex items-center justify-center mb-3 glow-pulse" style={glowVars("#f59e0b")}>
              <Moon size={26} className="text-amber-400" />
              {isRead && <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={11} className="text-black" /></span>}
            </div>
            <div className="text-xl font-black text-zinc-100">{openGibush.title}</div>
            {openGibush.dateLabel && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 px-3 py-1 text-sm font-bold text-amber-400 mt-2">
                <Clock size={12} /> מועד: {openGibush.dateLabel}
              </div>
            )}
          </div>

          {/* Feature 1: how much of the gibush write-up you've explored so far, as a ring */}
          <div className="relative flex items-center gap-3 mt-4 bg-black/40 rounded-2xl p-3">
            <div className="relative w-12 h-12 shrink-0">
              <svg viewBox="0 0 44 44" className="-rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#3f3f4650" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${(phaseProgress / phases.length) * 113} 113`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease-out" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-amber-400">{phaseProgress}/{phases.length}</div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-[13px] font-bold text-zinc-200">שלבים שנחקרו</div>
              <div className="text-[11px] text-zinc-500">פתחו את כל השלבים כדי להכיר את הגיבוש לעומק</div>
            </div>
          </div>

          {/* Feature 2: qualitative intensity gauge, not literal counted stats */}
          <div className="relative mt-2.5 bg-black/40 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-bold text-zinc-200">רמת עצימות</span>
              <span className="text-[11px] font-black text-amber-400">{intensityLabel}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden flex gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 rounded-full transition-all duration-500" style={{ backgroundColor: i < intensityLevel ? "#f59e0b" : "transparent" }} />
              ))}
            </div>
          </div>

          {/* Feature 3: day/night timeline strip, one segment per phase, alternating tone */}
          <div className="relative flex items-center gap-1 mt-2.5">
            {phases.map((ph, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: i % 2 === 0 ? "#312e81" : "#78350f", opacity: openPhase === i ? 1 : 0.5 }} />
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
          {phases.map((ph, i) => (
            <button key={i} onClick={() => { setOpenPhase(i); setViewedPhaseIndices((prev) => new Set(prev).add(i)); }} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${openPhase === i ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
              {ph.title}
            </button>
          ))}
        </div>

        <div className="relative space-y-2.5 mb-5">
          <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-amber-500/20" />
          {phases.map((ph, i) => {
            const Icon = phaseIcons[i % phaseIcons.length];
            const isOpen = openPhase === i;
            return (
              <div key={i} className="relative flex items-start gap-3">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${isOpen ? "bg-amber-500 border-amber-400" : "bg-black border-amber-500/40"}`}>
                  <Icon size={16} className={isOpen ? "text-black" : "text-amber-400"} />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: isOpen ? "linear-gradient(120deg, #f59e0b18, transparent 70%), var(--card-base-alt)" : "var(--card-base-alt)", boxShadow: `0 0 0 1px ${isOpen ? "#f59e0b45" : "#27272a"} inset` }}>
                  <button onClick={() => { setOpenPhase(isOpen ? -1 : i); setViewedPhaseIndices((prev) => new Set(prev).add(i)); }} className="w-full flex items-center justify-between px-3.5 py-3">
                    <span className="text-base font-bold text-zinc-200">{ph.title}</span>
                    <ChevronDown size={15} className={`text-amber-400/70 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 text-[15px] text-zinc-300 leading-8 [&>*:last-child]:mb-0">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 whitespace-pre-line">{children}</p>,
                          strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-2">{children}</ul>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        }}
                      >
                        {ph.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Card className="p-4 mb-4">
          <div className="text-[13px] font-black text-zinc-200 mb-2.5 flex items-center gap-1.5"><Target size={14} className="text-amber-400" /> מתאים לך אם...</div>
          <div className="space-y-1.5">
            {["נוח לך עם עבודה בלילה ובחוסר שינה", "אתה מתפקד טוב תחת עומס מנטלי, לא רק פיזי", "יש לך סבולת לזחילות ומסעות ארוכים", "אתה יכול לשמור על ריכוז גם כשעייף"].map((s, i) => (
              <button key={i} onClick={() => setSuitCheckList((p) => ({ ...p, [i]: !p[i] }))} className="w-full flex items-center gap-2.5 text-right">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 ${suitCheckList[i] ? "bg-amber-500 border-amber-500" : "border-zinc-600"}`}>
                  {suitCheckList[i] && <Check size={12} className="text-black" />}
                </span>
                <span className={`text-[13px] ${suitCheckList[i] ? "text-zinc-200" : "text-zinc-400"}`}>{s}</span>
              </button>
            ))}
          </div>
          {Object.values(suitCheckList).filter(Boolean).length > 0 && (
            <div className="text-[12px] text-amber-400 font-bold mt-3 text-center">{Object.values(suitCheckList).filter(Boolean).length}/4 מתאימים לך</div>
          )}
        </Card>
      </div>
    );
  }

  if (view === "ערכים") {
    return (
      <div className="p-4">
        <style>{`
          @keyframes valuesFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes valuesShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
          @keyframes valuesGlowPulse { 0%, 100% { box-shadow: 0 0 0 1.5px #f59e0b55, 0 0 14px 0 #f59e0b30; } 50% { box-shadow: 0 0 0 1.5px #f59e0b80, 0 0 20px 2px #f59e0b45; } }
        `}</style>
        <button onClick={() => setView("main")} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה למאגר
        </button>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden p-5 mb-4 tech-grid" style={{ background: "radial-gradient(ellipse 130% 90% at 25% -15%, #f59e0b30, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-25" style={{ backgroundColor: "#f59e0b", animation: "heroPulse 4s ease-in-out infinite" }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="absolute rounded-full bg-amber-300" style={{ width: 2, height: 2, left: `${(i * 43 + 15) % 90}%`, top: `${(i * 29 + 10) % 60}%`, opacity: 0.5, animation: `constellationFloat ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }} />
          ))}
          <div className="relative flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center justify-center shrink-0" style={{ animation: "valuesGlowPulse 2.5s ease-in-out infinite" }}>
              <Star size={22} className="text-amber-400" fill="#f59e0b" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-zinc-50">תוכן ערכי לקראת השירות</div>
              <div className="text-[12px] text-zinc-500">להיות בן אדם וחניך לפני שהכל</div>
            </div>
          </div>
          {pageContent.length > 0 && (() => {
            const readCount = pageContent.filter((c) => readValueIds.includes(c.id)).length;
            const pct = Math.round((readCount / pageContent.length) * 100);
            return (
              <div className="relative mt-4">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-zinc-400 font-semibold">המסע שלכם</span>
                  <span className="text-amber-400 font-black">{readCount}/{pageContent.length} נקראו</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: `${pct}%`, boxShadow: "0 0 8px #f59e0b" }} />
                </div>
              </div>
            );
          })()}
        </div>

        {pageContent.length > 3 && (
          <div className="relative mb-3">
            <input
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              placeholder="חיפוש תוכן ערכי..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300"
            />
            <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          </div>
        )}

        <div className="flex gap-1.5 mb-3.5">
          {["הכל", "שמורים", "לא נקראו"].map((f) => (
            <button key={f} onClick={() => setValueListFilter(f)} className={`rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${valueListFilter === f ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
              {f}
            </button>
          ))}
        </div>

        {recentValueIds.length > 0 && !valueSearch.trim() && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3.5" style={{ scrollbarWidth: "none" }}>
            {recentValueIds.map((id) => {
              const c = pageContent.find((x) => x.id === id);
              if (!c) return null;
              return (
                <button key={id} onClick={() => openValueDetail(c)} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border border-amber-500/40 bg-amber-500/10">
                  <Clock size={11} className="text-amber-400" />
                  <span className="text-[12px] font-bold text-amber-400 max-w-[110px] truncate">{c.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {loadingPage ? (
          <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
        ) : pageContent.length === 0 ? (
          <div className="text-center py-12 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl">
            אין עדיין תוכן כאן - יתווסף דרך Supabase
          </div>
        ) : (() => {
          let list = pageContent;
          if (valueListFilter === "שמורים") list = list.filter((c) => savedValueIds.includes(c.id));
          if (valueListFilter === "לא נקראו") list = list.filter((c) => !readValueIds.includes(c.id));
          if (valueSearch.trim()) list = list.filter((c) => c.title.includes(valueSearch.trim()));
          if (list.length === 0) {
            return (
              <div className="text-center py-12 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl">
                {valueSearch.trim() ? "אין תוצאות לחיפוש" : valueListFilter === "שמורים" ? "עדיין לא שמרתם תוכן" : "קראתם הכל - כל הכבוד!"}
              </div>
            );
          }
          return (
            <div className="space-y-2.5">
              {list.map((c, i) => {
                const isSaved = savedValueIds.includes(c.id);
                const isRead = readValueIds.includes(c.id);
                const quote = extractValueQuote(c.body);
                const mins = Math.max(1, Math.round(c.body.replace(/[*_#>-]/g, "").split(/\s+/).filter(Boolean).length / 150));
                return (
                  <button
                    key={c.id}
                    onClick={() => openValueDetail(c)}
                    className="relative w-full text-right rounded-2xl overflow-hidden p-4 active:scale-[0.98] transition"
                    style={{
                      background: isRead ? "var(--card-base-alt)" : "linear-gradient(120deg, #f59e0b1f, transparent 75%), var(--card-base-alt)",
                      boxShadow: isRead ? "0 0 0 1px #3f3f46 inset" : "0 0 0 1.5px #f59e0b45 inset",
                      animation: `valuesFadeUp 0.4s ease-out ${i * 0.06}s both`,
                      opacity: isRead ? 0.8 : 1,
                    }}
                  >
                    {!isRead && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.12), transparent)", animation: `valuesShimmer 4s ease-in-out ${i * 0.3}s infinite` }} />
                      </div>
                    )}
                    {/* ribbon corner */}
                    <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-amber-500" />
                    <div className="absolute top-0 right-0 w-0 h-0" style={{ borderStyle: "solid", borderWidth: "0 28px 28px 0", borderColor: `transparent ${isRead ? "#3f3f46" : "#f59e0b"} transparent transparent`, opacity: 0.5 }} />
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-black text-black/70">{i + 1}</span>

                    <div className="relative flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 overflow-hidden">
                        {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : isRead ? <Check size={16} className="text-emerald-400" /> : <Star size={18} className="text-amber-400" fill="#f59e0b" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black text-amber-500/70 uppercase tracking-wide">פרק {i + 1}</span>
                          {isRead && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5"><Check size={9} /> נקרא</span>}
                        </div>
                        <div className="text-base font-black text-zinc-100 mb-1">{c.title}</div>
                        <div className="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed italic">"{quote}"</div>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-600">
                          <span className="flex items-center gap-1"><Clock size={10} /> {mins} דק׳</span>
                          {isSaved && <span className="flex items-center gap-1 text-amber-400"><Star size={10} fill="#fbbf24" /> שמור</span>}
                        </div>
                      </div>
                      <ChevronLeft size={17} className="text-amber-500/60 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })()}

        {openValue && (() => {
          const hex = "#f59e0b";
          const paragraphs = openValue.body.split("\n\n").filter((p) => p.trim());
          const boldMatch = paragraphs[0]?.match(/^\*\*(.+)\*\*$/);
          const quoteText = boldMatch ? boldMatch[1] : null;
          const restParagraphs = quoteText ? paragraphs.slice(1) : paragraphs;
          const takeaways = restParagraphs.slice(1, -1).map((p) => p.split(/[.—]/)[0].trim()).filter((s) => s.length > 15 && s.length < 90).slice(0, 3);
          return (
            <div className="fixed inset-0 z-50 bg-black overflow-y-auto" dir="rtl" onScroll={(e) => {
              const el = e.currentTarget;
              const pct = (el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100;
              setReadProgress(Math.min(100, Math.round(pct)));
            }}>
              <div className="fixed top-0 right-0 left-0 h-1 bg-zinc-900 z-[60]">
                <div className="h-full bg-amber-500" style={{ width: `${readProgress}%`, transition: "width 0.15s linear", boxShadow: "0 0 8px #f59e0b" }} />
              </div>

              <div className="relative w-full p-5 pb-4 overflow-hidden tech-grid" style={{ background: `radial-gradient(ellipse 130% 90% at 25% -15%, ${hex}30, transparent 65%), #000` }}>
                <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: hex, animation: "heroPulse 4s ease-in-out infinite" }} />
                <style>{`@keyframes heroPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.25); opacity: 0.45; } } @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                <div className="relative flex items-center justify-between mb-3">
                  <button onClick={() => setOpenValue(null)} className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 text-sm font-bold">
                    <ChevronRight size={16} /> חזרה
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => toggleSavedValue(openValue.id, e)} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <Star size={15} className={savedValueIds.includes(openValue.id) ? "text-amber-400" : "text-zinc-500"} fill={savedValueIds.includes(openValue.id) ? "#fbbf24" : "none"} />
                    </button>
                    <button onClick={copyValueText} className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      {copiedValue ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-zinc-400" />}
                    </button>
                  </div>
                </div>
                <div className="relative w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center glow-pulse mb-3" style={glowVars(hex)}>
                  <Star size={22} className="text-amber-400" />
                </div>
                <div className="relative text-2xl font-black text-zinc-50 leading-tight">{openValue.title}</div>
                <div className="relative flex items-center gap-3 mt-2 text-[12px] text-zinc-500">
                  <span className="flex items-center gap-1"><Clock size={11} /> {Math.max(1, Math.round(openValue.body.split(/\s+/).length / 150))} דק׳ קריאה</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setValueFontSize((s) => Math.max(14, s - 1))} className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-zinc-400 font-black text-[11px]">A-</button>
                    <button onClick={() => setValueFontSize((s) => Math.min(22, s + 1))} className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-zinc-400 font-black text-[13px]">A+</button>
                  </div>
                </div>
              </div>

              <div className="p-5 pb-10 max-w-lg mx-auto">
                {takeaways.length > 0 && (
                  <div className="rounded-2xl p-4 mb-5" style={{ background: `${hex}10`, boxShadow: `0 0 0 1px ${hex}30 inset` }}>
                    <div className="text-[12px] font-black text-amber-400 uppercase tracking-wide mb-2">נקודות מפתח</div>
                    <div className="space-y-1.5">
                      {takeaways.map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-[13px] text-zinc-300">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quoteText && (
                  <div className="relative rounded-2xl p-5 mb-6 text-center" style={{ background: `${hex}12`, boxShadow: `0 0 0 1.5px ${hex}40 inset` }}>
                    <div className="text-3xl mb-1" style={{ color: hex }}>"</div>
                    <div className="text-lg font-black text-zinc-100 italic leading-relaxed">{quoteText}</div>
                  </div>
                )}

                <div className="leading-9 [&>*:last-child]:mb-0" style={{ fontSize: valueFontSize }}>
                  {restParagraphs.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="flex items-center justify-center my-5"><span className="w-1 h-1 rounded-full bg-amber-500/40" /><span className="w-1 h-1 rounded-full bg-amber-500/40 mx-1.5" /><span className="w-1 h-1 rounded-full bg-amber-500/40" /></div>}
                      <p className={`text-zinc-300 whitespace-pre-line ${i === 0 ? "first-letter:text-4xl first-letter:font-black first-letter:ml-1" : ""}`} style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`, "--tw-text-opacity": 1 }}>
                        <span dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, `<strong style="color:${hex};font-weight:900">$1</strong>`) }} />
                      </p>
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${hex}25` }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Bot size={15} className="text-violet-400" />
                    <span className="text-[13px] font-black text-zinc-200">מה זה אומר בשבילי?</span>
                  </div>
                  {aiInsight ? (
                    <div className="rounded-xl p-3.5 bg-violet-500/10 text-[13px] text-zinc-300 leading-relaxed">{aiInsight}</div>
                  ) : (
                    <GlowButton tone="ghost" icon={loadingInsight ? Loader2 : Bot} className="w-full" disabled={loadingInsight} onClick={getAiInsight}>
                      {loadingInsight ? "חושב..." : "קבל שאלת מחשבה אישית"}
                    </GlowButton>
                  )}
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${hex}25` }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Target size={15} className="text-amber-400" />
                    <span className="text-[13px] font-black text-zinc-200">מה אני לוקח מזה?</span>
                  </div>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="כתוב/י במילה שלך - איך תיישם/י את זה השבוע?"
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 mb-2"
                  />
                  <GlowButton tone="amber" icon={reflectionSaved ? Check : Send} className="w-full" onClick={saveReflection}>{reflectionSaved ? "נשמר!" : "שמור מחשבה אישית"}</GlowButton>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  if (view === "ירפא") {
    return (
      <div className="p-4">
        <button onClick={() => setView("main")} className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה למאגר
        </button>
        <SectionTitle icon={ClipboardCheck} tone="amber">איך תעבור את הירפ״א</SectionTitle>
        {loadingPage ? (
          <div className="text-center py-10 text-sm text-zinc-600">טוען...</div>
        ) : (
          <div className="space-y-2">
            {YERPA_LIST.map((name) => {
              const c = pageContent.find((x) => x.title === name);
              return (
                <button
                  key={name}
                  onClick={() => c && setOpenYerpa(c)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 border transition ${c ? "bg-zinc-900 border-sky-500/30 hover:border-sky-500/60 active:scale-[0.98]" : "bg-zinc-950 border-zinc-800 opacity-50"}`}
                >
                  <span className="text-base font-bold text-zinc-200">{name}</span>
                  {c ? <ChevronLeft size={16} className="text-sky-400" /> : <span className="text-[12px] text-zinc-600">אין עדיין מידע</span>}
                </button>
              );
            })}
          </div>
        )}

        {openYerpa && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setOpenYerpa(null)}>
            <div className="w-full sm:max-w-sm bg-zinc-950 border border-sky-500/30 rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="text-base font-black text-zinc-100 mb-3">{openYerpa.title}</div>
              <div className="text-[17px] text-zinc-300 leading-8 whitespace-pre-line">{openYerpa.body}</div>
              <button onClick={() => setOpenYerpa(null)} className="w-full mt-4 text-center text-sm text-zinc-500 hover:text-zinc-300">סגור</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fx-root p-4 space-y-6 relative" onPointerDown={(e) => fxTouchRing(e, "#f59e0b")}>
      <FxStyles />
      <FxAmbience hex="#f59e0b" hex2="#10b981" hex3="#38bdf8" icons={[Newspaper, Shield, Trophy]} particles={10} />
      <FxScrollBar hex="#f59e0b" />
      {(() => {
        const readCount = (valuesContent || []).filter((v) => readValueIds.includes(v.id)).length;
        const total = (valuesContent || []).length;
        const pct = total > 0 ? Math.round((readCount / total) * 100) : 0;
        const unseenCount = (valuesContent || []).length; // shown contextually below, not gating the banner
        const carouselItem = total > 0 ? valuesContent[flagshipCarouselIdx % total] : null;
        return (
          <button
            onClick={() => { setPageContent(valuesContent); setView("ערכים"); }}
            className="relative w-full text-right rounded-3xl overflow-hidden p-5"
            style={{ background: "radial-gradient(ellipse 140% 100% at 20% -20%, #f59e0b40, transparent 65%), linear-gradient(160deg, #1c1305, #000)", boxShadow: "0 0 0 2px #f59e0b60, 0 8px 30px -8px #f59e0b40" }}
          >
            <style>{`
              @keyframes flagshipPulse { 0%, 100% { box-shadow: 0 0 0 2px #f59e0b60, 0 8px 30px -8px #f59e0b40; } 50% { box-shadow: 0 0 0 2px #f59e0b90, 0 8px 40px -4px #f59e0b60; } }
              @keyframes flagshipShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
              @keyframes flagshipDust { 0% { transform: translate(0,0); opacity: 0; } 15% { opacity: 0.5; } 85% { opacity: 0.5; } 100% { transform: translate(-16px,-30px); opacity: 0; } }
              @keyframes flagshipTitleFade { 0% { opacity: 0; transform: translateY(4px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; } 100% { opacity: 0; } }
            `}</style>
            <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
            <div className="absolute -right-10 -top-14 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: "#f59e0b", animation: "heroPulse 4s ease-in-out infinite" }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ animation: "flagshipPulse 3s ease-in-out infinite" }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="absolute rounded-full bg-amber-300" style={{ width: 2, height: 2, left: `${(i * 31 + 10) % 92}%`, top: `${(i * 23 + 8) % 70}%`, animation: `flagshipDust ${6 + (i % 4)}s ease-in-out ${i * 0.5}s infinite` }} />
              ))}
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", animation: "flagshipShimmer 4s ease-in-out 0.6s infinite" }} />
            </div>

            <div className="relative flex items-center gap-3.5 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-black border-2 border-amber-400 flex items-center justify-center shrink-0" style={{ boxShadow: "0 0 20px 2px #f59e0b60" }}>
                <Star size={26} className="text-amber-400" fill="#f59e0b" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">הדגל של האפליקציה</span>
                  {readCount < total && total > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }}>{total - readCount} חדש</span>
                  )}
                </div>
                <div className="text-xl font-black text-white leading-tight">תוכן ערכי לקראת השירות</div>
              </div>
              {total > 0 && (
                <div className="relative w-12 h-12 shrink-0">
                  <svg viewBox="0 0 44 44" className="-rotate-90">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#00000060" strokeWidth="4" />
                    <circle cx="22" cy="22" r="18" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${(pct / 100) * 113} 113`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease-out" }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-amber-400">{pct}%</div>
                </div>
              )}
            </div>

            {carouselItem ? (
              <button
                onClick={(e) => { e.stopPropagation(); setPageContent(valuesContent); setView("ערכים"); openValueDetail(carouselItem); }}
                className="relative w-full text-right bg-black/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2"
              >
                <Compass size={13} className="text-amber-400 shrink-0" />
                <span key={carouselItem.id} className="text-[13px] font-bold text-amber-100 truncate flex-1" style={{ animation: "flagshipTitleFade 3.5s ease-in-out" }}>{carouselItem.title}</span>
                <ChevronLeft size={14} className="text-amber-400/60 shrink-0" />
              </button>
            ) : (
              <div className="relative text-[13px] text-amber-200/60">עדיין אין תוכן - יתווסף בקרוב</div>
            )}
          </button>
        );
      })()}

      <div className="relative rounded-3xl overflow-hidden p-5 border border-emerald-500/25 tech-grid">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(16,185,129,0.12), transparent 70%)" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black border border-emerald-500/40 flex items-center justify-center shrink-0 tech-corners">
            <BookOpen size={22} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-black text-zinc-50">המאגר</div>
            <div className="text-[12px] text-zinc-500 font-mono">כל מה שצריך במקום אחד</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <input
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="חיפוש בכל המאגר - יחידות, כתבות..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300"
        />
        <Compass size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        {globalSearch.trim() && (() => {
          const q = globalSearch.trim();
          const unitMatches = UNITS.filter((u) => u.name.includes(q)).slice(0, 4);
          const articleMatches = (articles || []).filter((a) => a.title.includes(q)).slice(0, 4);
          const noResults = unitMatches.length === 0 && articleMatches.length === 0;
          return (
            <div className="absolute top-full mt-1.5 w-full bg-zinc-950 border border-emerald-500/30 rounded-xl overflow-hidden z-10 max-h-72 overflow-y-auto">
              {noResults ? (
                <div className="text-[13px] text-zinc-600 text-center py-4">אין תוצאות</div>
              ) : (
                <>
                  {unitMatches.map((u) => (
                    <button key={u.id} onClick={() => { setOpenUnit(u); setView("unit_detail"); markUnitViewed(u.id); setGlobalSearch(""); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-zinc-900 transition">
                      <Shield size={14} style={{ color: u.hex }} className="shrink-0" />
                      <span className="text-sm font-bold text-zinc-200 flex-1 text-right">{u.name}</span>
                      <span className="text-[10px] text-zinc-600">יחידה</span>
                    </button>
                  ))}
                  {articleMatches.map((a) => (
                    <button key={a.id} onClick={() => { setOpenArticle(a); setGlobalSearch(""); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-zinc-900 transition">
                      <Newspaper size={14} className="text-amber-400 shrink-0" />
                      <span className="text-sm font-bold text-zinc-200 flex-1 text-right">{a.title}</span>
                      <span className="text-[10px] text-zinc-600">כתבה</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          );
        })()}
      </div>

      {(() => {
        const day = Math.floor(Date.now() / 86400000);
        // Personalized pick, not a pure day-rotation: 1) the viewer's own target unit, if they
        // haven't seen it in the last few days, 2) otherwise a unit they've never opened at all,
        // 3) only once both of those are exhausted does it fall back to the plain rotation.
        const targetUnit = profile?.targetUnit ? UNITS.find((u) => u.id === profile.targetUnit) : null;
        const targetSeenRecently = targetUnit && recentUnitIds.slice(0, 2).includes(targetUnit.id);
        const neverOpened = UNITS.filter((u) => !recentUnitIds.includes(u.id) && u.id !== targetUnit?.id);
        let spotlight, spotlightReason;
        if (targetUnit && !targetSeenRecently) {
          spotlight = targetUnit; spotlightReason = "היעד שלך";
        } else if (neverOpened.length > 0) {
          spotlight = neverOpened[day % neverOpened.length]; spotlightReason = "עדיין לא קראת על זה";
        } else {
          spotlight = UNITS[day % UNITS.length]; spotlightReason = null;
        }
        return (
          <button onClick={() => { setOpenUnit(spotlight); setView("unit_detail"); markUnitViewed(spotlight.id); }} {...fxTilt(6)} className="w-full relative rounded-2xl overflow-hidden p-4 flex items-center gap-3.5 text-right" style={{ ...fxTiltStyle, background: `linear-gradient(120deg, ${spotlight.hex}22, transparent 70%), var(--card-base)`, boxShadow: `0 0 0 1px ${spotlight.hex}35 inset` }}>
            <FxFrame hex={spotlight.hex} hex2="#a855f7" radius="1rem" />
            <HudCorners hex={spotlight.hex} corners={2} inset={7} />
            <FxSpot radius="1rem" />
            {spotlight.image && <img src={spotlight.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.09] pointer-events-none" />}
            <div className="relative w-14 h-14 rounded-full bg-black border-2 flex items-center justify-center shrink-0 overflow-hidden glow-pulse" style={{ borderColor: spotlight.hex, ...glowVars(spotlight.hex) }}>
              {spotlight.image ? (
                <img src={spotlight.image} alt={spotlight.name} className="w-full h-full object-cover" />
              ) : (
                <Shield size={24} style={{ color: spotlight.hex }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5" style={{ color: spotlight.hex }}>
                יחידה מומלצת היום
                {spotlightReason && <span className="normal-case rounded-full px-1.5 py-0.5" style={{ backgroundColor: `${spotlight.hex}25` }}>{spotlightReason}</span>}
              </div>
              <div className="text-base font-black text-zinc-50">{spotlight.name}</div>
              <div className="text-[12px] text-zinc-500 truncate">{spotlight.tagline}</div>
            </div>
            <ChevronLeft size={18} className="shrink-0" style={{ color: spotlight.hex }} />
          </button>
        );
      })()}

      {isPremium ? (
      <div className="relative">
        <style>{`
          @keyframes newspaperFadeUp {
            from { opacity: 0; transform: translateY(14px) rotate(var(--card-rot, 0deg)); }
            to { opacity: 1; transform: translateY(0) rotate(var(--card-rot, 0deg)); }
          }
          @keyframes newBadgePulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.6); }
            50% { box-shadow: 0 0 0 5px rgba(248,113,113,0); }
          }
          @keyframes featuredShimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(250%) skewX(-15deg); }
          }
        `}</style>

        {/* Masthead */}
        <div className="relative rounded-t-2xl overflow-hidden px-4 pt-4 pb-3" style={{ background: "linear-gradient(160deg, #f59e0b18, transparent 60%), var(--card-base-alt)" }}>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
          <HudCorners hex="#f59e0b" corners={2} inset={8} />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(180deg, #f59e0b22, transparent)", animation: "fxScan 5s linear infinite" }} />
          <div className="relative flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500/70 uppercase tracking-widest mb-1">
                <Newspaper size={12} /> גיליון · {new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long" })}
              </div>
              <div className="text-2xl font-black text-zinc-50 tracking-tight">עיתון הטיפים</div>
            </div>
            <div className="text-left relative">
              <span aria-hidden="true" className="absolute -inset-2 rounded-full pointer-events-none" style={{ "--gc": "#f59e0b70", animation: "fxGlow 2.6s ease-in-out infinite" }} />
              <div className="relative text-xl font-black text-amber-400"><AnimatedNumber value={articles.length} /></div>
              <div className="relative text-[10px] text-zinc-500">כתבות</div>
            </div>
          </div>
          {(() => {
            const unreadTotal = articles.filter((a) => !readArticleIds.includes(a.id)).length;
            if (unreadTotal === 0 || articles.length === 0) return null;
            return <div className="relative text-[11px] font-bold text-amber-300/80 mt-2">{unreadTotal} כתבות מחכות לך שעוד לא קראת</div>;
          })()}
          {/* torn-paper divider */}
          <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 mt-3 relative">
            <polyline points="0,6 10,2 20,9 30,3 40,8 50,1 60,7 70,4 80,10 90,2 100,6 110,9 120,3 130,7 140,1 150,8 160,4 170,10 180,2 190,6 200,9 210,3 220,7 230,1 240,8 250,4 260,10 270,2 280,6 290,9 300,3 310,7 320,1 330,8 340,4 350,10 360,2 370,6 380,9 390,3 400,6" fill="none" stroke="#f59e0b30" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="px-0.5 pt-3 space-y-2.5">
          <div className="relative">
            <input
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              placeholder="חיפוש כתבה..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-[14px] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300"
            />
            <Compass size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: "none" }}>
              {["הכל", ...ARTICLE_UNIT_TAGS].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setArticleFilter(tag)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-bold border whitespace-nowrap transition ${articleFilter === tag ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button onClick={() => setArticleSortMode((s) => (s === "new" ? "unit" : "new"))} className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
              <ChevronDown size={12} /> {articleSortMode === "new" ? "חדש" : "יחידה"}
            </button>
          </div>

          {recentArticleIds.length > 0 && !articleSearch.trim() && (
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {recentArticleIds.map((id) => {
                const a = articles.find((x) => x.id === id);
                if (!a) return null;
                const hex = UNITS.find((u) => u.name === a.unit)?.hex || "#f59e0b";
                return (
                  <button key={id} onClick={() => { setOpenArticle(a); markArticleRead(a.id); }} className="shrink-0 flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1.5 border" style={{ borderColor: `${hex}50`, backgroundColor: `${hex}12` }}>
                    <Clock size={11} style={{ color: hex }} />
                    <span className="text-[12px] font-bold max-w-[110px] truncate" style={{ color: hex }}>{a.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {(() => {
          let filtered = articleFilter === "הכל" ? articles : articles.filter((a) => a.unit === articleFilter);
          if (articleSearch.trim()) filtered = filtered.filter((a) => a.title.includes(articleSearch.trim()));
          if (articleSortMode === "unit") filtered = [...filtered].sort((a, b) => (a.unit || "").localeCompare(b.unit || "", "he"));
          return filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-xl mt-3">
              {articleSearch.trim() ? "אין תוצאות לחיפוש" : articleFilter === "הכל" ? "אין עדיין כתבות" : `אין עדיין כתבות בסיווג ${articleFilter}`}
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              {(() => {
                // Personalized ordering: unread articles before read ones, and within each of
                // those groups, articles tagged to the viewer's own target unit come first -
                // so the one thing featured is actually relevant to this specific person.
                const targetUnitObj = profile?.targetUnit ? UNITS.find((u) => u.id === profile.targetUnit) : null;
                const matchesTarget = (a) => targetUnitObj && (a.unit === targetUnitObj.name || a.unit === targetUnitObj.id);
                const personalized = [...filtered].sort((a, b) => {
                  const aUnread = !readArticleIds.includes(a.id), bUnread = !readArticleIds.includes(b.id);
                  if (aUnread !== bUnread) return aUnread ? -1 : 1;
                  const aMatch = matchesTarget(a), bMatch = matchesTarget(b);
                  if (aMatch !== bMatch) return aMatch ? -1 : 1;
                  return 0;
                });
                const [featured, ...rest] = (articleFilter === "הכל" && !articleSearch.trim() && articleSortMode !== "unit") ? personalized : filtered;
                const featuredIsUnread = !readArticleIds.includes(featured.id);
                const featuredMatchesTarget = matchesTarget(featured);
                const unreadCount = filtered.filter((a) => !readArticleIds.includes(a.id)).length;
                const fHex = UNITS.find((u) => u.name === featured.unit || u.id === featured.unit)?.hex || "#10b981";
                const isNew = featured.createdAt && (Date.now() - new Date(featured.createdAt)) < 3 * 86400000;
                const isSaved = savedArticleIds.includes(featured.id);
                const mins = Math.max(1, Math.round((featured.excerpt || "").split(/\s+/).length / 150));
                return (
                  <>
                  <div role="button" tabIndex={0} onClick={() => { setOpenArticle(featured); markArticleRead(featured.id); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setOpenArticle(featured); markArticleRead(featured.id); } }} {...fxTilt(5)} className="relative w-full text-right rounded-2xl overflow-hidden active:scale-[0.98] transition cursor-pointer" style={{ ...fxTiltStyle, height: 210, boxShadow: `0 0 0 1.5px ${fHex}50` }}>
                    {featured.imageUrl ? (
                      <img src={featured.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 tech-grid" style={{ background: `linear-gradient(135deg, ${fHex}55, ${fHex}15)` }} />
                    )}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 10%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.35) 100%)" }} />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "featuredShimmer 3.5s ease-in-out 0.5s infinite" }} />
                    </div>
                    <span className="absolute top-3 right-3 rounded-md px-2.5 py-1 text-[11px] font-black" style={{ backgroundColor: `${fHex}35`, color: fHex, boxShadow: `0 0 0 1.5px ${fHex}70 inset`, transform: "rotate(-4deg)" }}>{featured.unit}</span>
                    <FxFrame hex={fHex} hex2="#a855f7" radius="1rem" />
                    <FxSpot radius="1rem" />
                    {isNew && <span className="absolute top-3 left-3 rounded-full bg-red-500 text-white text-[10px] font-black px-2 py-0.5" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }}>חדש</span>}
                    {!isNew && featuredMatchesTarget && <span className="absolute top-3 left-3 rounded-full text-white text-[10px] font-black px-2 py-0.5" style={{ backgroundColor: fHex }}>ליעד שלך</span>}
                    {!isNew && !featuredMatchesTarget && featuredIsUnread && <span className="absolute top-3 left-3 rounded-full bg-black/60 text-white text-[10px] font-bold px-2 py-0.5">עוד לא קראת</span>}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSavedArticle(featured.id, e); if (!isSaved) fxConfetti([fHex, "#fbbf24", "#ffffff"], { count: 16 }); }}
                        className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                        style={isSaved ? { animation: "obCheckPop 0.35s ease-out" } : undefined}
                      >
                        {isSaved ? <Star size={13} className="text-amber-400" fill="#fbbf24" /> : <Star size={13} className="text-white/70" />}
                      </button>
                    </div>
                    <div className="absolute bottom-0 right-0 left-0 p-4">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-amber-400 mb-1 flex items-center gap-2">
                        כתבה מובילה <span className="text-zinc-400 normal-case font-semibold flex items-center gap-1"><Clock size={10} /> {mins} דק׳</span>
                      </div>
                      <div className="text-lg font-black text-white leading-tight line-clamp-2" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>{featured.title}</div>
                    </div>
                  </div>

                  {rest.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {rest.map((a, i) => {
                        const unitObj = UNITS.find((u) => u.name === a.unit || u.id === a.unit);
                        const hex = unitObj?.hex || ["#10b981", "#f59e0b", "#38bdf8", "#f87171"][i % 4];
                    const rotation = ((i * 37) % 7) - 3;
                    const isNew = a.createdAt && (Date.now() - new Date(a.createdAt)) < 3 * 86400000;
                    const isSaved = savedArticleIds.includes(a.id);
                    const isRead = readArticleIds.includes(a.id);
                    const mins = Math.max(1, Math.round((a.excerpt || "").split(/\s+/).length / 150));
                    return (
                      <button
                        key={a.id}
                        onClick={() => { setOpenArticle(a); markArticleRead(a.id); }}
                        {...fxTilt(6)}
                        className="relative text-right rounded-2xl overflow-hidden active:scale-95 transition"
                        style={{ ...fxTiltStyle, height: 150, boxShadow: `0 0 0 1.5px ${hex}45`, "--card-rot": `${rotation}deg`, animation: `newspaperFadeUp 0.45s ease-out ${i * 0.06}s both`, opacity: isRead ? 0.75 : 1 }}
                      >
                        <FxSpot radius="1rem" />
                        {a.imageUrl ? (
                          <img src={a.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center tech-grid" style={{ background: `linear-gradient(140deg, ${hex}40, ${hex}10)` }}>
                            <Newspaper size={26} style={{ color: hex }} />
                          </div>
                        )}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 20%, transparent 65%)" }} />
                        <div className="absolute top-0 bottom-0 right-0 w-1.5" style={{ backgroundColor: hex, boxShadow: `0 0 8px ${hex}` }} />
                        <span className="absolute top-2 right-3 rounded-md px-2 py-0.5 text-[10px] font-black" style={{ backgroundColor: `${hex}40`, color: hex, transform: "rotate(-5deg)" }}>{a.unit}</span>
                        {isNew && <span className="absolute top-2 left-2 rounded-full bg-red-500 w-2.5 h-2.5" style={{ animation: "newBadgePulse 1.8s ease-in-out infinite" }} />}
                        {isSaved && <Star size={12} className="absolute bottom-2 left-2 text-amber-400" fill="#fbbf24" />}
                        {isRead && <Check size={12} className="absolute bottom-2 left-2 text-emerald-400" style={{ display: isSaved ? "none" : "block" }} />}
                        <div className="absolute bottom-0 right-0 left-0 p-2.5">
                          <div className="text-[13px] font-black text-white line-clamp-2 leading-tight mb-1">{a.title}</div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1"><Clock size={9} /> {mins} דק׳</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              </>
                );
              })()}
            </div>
          );
        })()}
      </div>
      ) : (
        <button onClick={() => showToast?.("שדרג לפרימיום כדי לפתוח את עיתון הטיפים", "info")} className="relative rounded-2xl overflow-hidden p-5 flex items-center gap-3.5 text-right" style={{ background: "linear-gradient(120deg, #f59e0b18, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Lock size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-black text-zinc-100">עיתון הטיפים - פרימיום</div>
            <div className="text-[12px] text-zinc-500">כתבות וטיפים שבועיים זמינים רק במנוי הפרימיום</div>
          </div>
          <Star size={16} className="text-amber-400 shrink-0" />
        </button>
      )}

      <div>
        <SectionTitle icon={Compass} tone="emerald">ניווט מהיר</SectionTitle>
        <div className="space-y-2">
          {profile?.targetUnit === "tayas" && (
            <button onClick={() => openView("ירפא")} className="relative w-full flex items-center gap-3.5 rounded-2xl overflow-hidden active:scale-[0.98] transition px-4 py-3.5" style={{ background: "linear-gradient(120deg, #38bdf825, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #38bdf845 inset" }}>
              <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-25 bg-sky-500" />
              <div className="relative w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0 glow-pulse" style={glowVars("#38bdf8")}>
                <ClipboardCheck size={20} className="text-sky-400" />
              </div>
              <span className="relative flex-1 text-right text-[15px] font-bold text-zinc-100">איך תעבור את הירפ״א</span>
              <ChevronLeft size={17} className="relative text-sky-400 shrink-0" />
            </button>
          )}
          <button onClick={() => openView("יחידות")} className="relative w-full flex items-center gap-3.5 rounded-2xl overflow-hidden active:scale-[0.98] transition px-4 py-3.5" style={{ background: "linear-gradient(120deg, #10b98122, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98140 inset" }}>
            <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-emerald-500" />
            <div className="relative w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-emerald-400" />
            </div>
            <span className="relative flex-1 text-right text-[15px] font-bold text-zinc-200">יחידות עילית</span>
            <ChevronLeft size={17} className="relative text-emerald-500/60 shrink-0" />
          </button>
          <button onClick={() => openView("גיבושים")} className="relative w-full flex items-center gap-3.5 rounded-2xl overflow-hidden active:scale-[0.98] transition px-4 py-3.5" style={{ background: "linear-gradient(120deg, #f59e0b22, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
            <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-amber-500" />
            <div className="relative w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <Target size={20} className="text-amber-400" />
            </div>
            <span className="relative flex-1 text-right text-[15px] font-bold text-zinc-200">פורטל גיבושים</span>
            <ChevronLeft size={17} className="relative text-amber-500/60 shrink-0" />
          </button>
        </div>
      </div>

      {openArticle && (() => {
        const unitObj = UNITS.find((u) => u.name === openArticle.unit);
        const hex = unitObj?.hex || "#10b981";
        const wordCount = (openArticle.excerpt || "").split(/\s+/).filter(Boolean).length;
        const readMins = Math.max(1, Math.round(wordCount / 150));
        const tips = extractTips(openArticle.excerpt || "");
        const pullQuote = extractPullQuote(openArticle.excerpt || "");
        const isMyTargetUnit = profile?.targetUnitName && openArticle.unit === profile.targetUnitName;
        const relatedArticles = (articles || []).filter((a) => a.id !== openArticle.id && a.unit === openArticle.unit).slice(0, 3);
        return (
          <div
            className="fixed inset-0 z-50 bg-black overflow-y-auto"
            dir="rtl"
            onScroll={(e) => {
              const el = e.currentTarget;
              const pct = (el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100;
              setArticleProgress(Math.min(100, Math.round(pct)));
            }}
          >
            <div className="fixed top-0 right-0 left-0 h-1 bg-zinc-900 z-[60]">
              <div className="h-full" style={{ width: `${articleProgress}%`, backgroundColor: hex, transition: "width 0.15s linear", boxShadow: `0 0 8px ${hex}` }} />
            </div>
            <div className="relative w-full" style={{ height: openArticle.imageUrl ? "42vh" : "auto" }}>
              {openArticle.imageUrl ? (
                <>
                  <img src={openArticle.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.97) 5%, rgba(0,0,0,0.35) 55%, ${hex}25 100%)` }} />
                </>
              ) : (
                <div className="relative w-full h-52 flex items-center justify-center overflow-hidden tech-grid" style={{ background: `linear-gradient(160deg, ${hex}35, #000)` }}>
                  <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ backgroundColor: hex }} />
                  {unitObj ? <Shield size={90} style={{ color: hex }} className="absolute opacity-[0.08]" /> : null}
                  <Newspaper size={48} style={{ color: hex }} className="relative opacity-70" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <button onClick={(e) => toggleSavedArticle(openArticle.id, e)} className="w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                  <Star size={16} className={savedArticleIds.includes(openArticle.id) ? "text-amber-400" : "text-white"} fill={savedArticleIds.includes(openArticle.id) ? "#fbbf24" : "none"} />
                </button>
              </div>
              <button onClick={() => setOpenArticle(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10">
                <X size={18} className="text-white" />
              </button>
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold" style={{ backgroundColor: `${hex}30`, color: hex, boxShadow: `0 0 0 1px ${hex}60 inset` }}>
                  {unitObj && <Shield size={11} />} {openArticle.unit}
                </span>
                <div className="text-2xl font-black text-white leading-tight mt-2" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{openArticle.title}</div>
                <div className="flex items-center gap-3 mt-2 text-[12px] text-zinc-400">
                  {openArticle.author && <span className="font-semibold flex items-center gap-1"><Award size={11} style={{ color: hex }} /> {openArticle.author} · מלש״ב שעבר את התהליך</span>}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[12px] text-zinc-400">
                  <span className="flex items-center gap-1"><Clock size={11} /> {readMins} דק׳ קריאה</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setArticleFontSize((s) => Math.max(13, s - 1))} className="w-6 h-6 rounded bg-black/50 flex items-center justify-center text-zinc-300 font-black text-[11px]">A-</button>
                    <button onClick={() => setArticleFontSize((s) => Math.min(21, s + 1))} className="w-6 h-6 rounded bg-black/50 flex items-center justify-center text-zinc-300 font-black text-[13px]">A+</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 pb-10 max-w-lg mx-auto">
              {isMyTargetUnit && (
                <div className="rounded-2xl p-3.5 mb-5 flex items-center gap-2.5" style={{ background: `${hex}15`, boxShadow: `0 0 0 1.5px ${hex}45 inset` }}>
                  <Target size={16} style={{ color: hex }} className="shrink-0" />
                  <span className="text-[13px] font-bold" style={{ color: hex }}>זה בדיוק היעד הקרבי שלך - שווה קריאה כפולה{profile?.gibushDate ? ` · ${Math.max(0, Math.ceil((new Date(profile.gibushDate) - new Date()) / 86400000))} ימים לגיבוש` : ""}</span>
                </div>
              )}

              {pullQuote && (
                <div className="relative pr-4 mb-6" style={{ borderRight: `3px solid ${hex}` }}>
                  <div className="text-lg font-black text-zinc-100 italic leading-relaxed">"{pullQuote}"</div>
                </div>
              )}

              <div className="leading-8 [&>*:last-child]:mb-0" style={{ fontSize: articleFontSize, "--tw-prose-bullets": hex }}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-4 whitespace-pre-line text-zinc-200">{children}</p>,
                    strong: ({ children }) => <strong className="font-black" style={{ color: hex }}>{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pr-4 space-y-1.5 mb-4">{children}</ul>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  }}
                >
                  {openArticle.excerpt}
                </ReactMarkdown>
              </div>

              {tips.length > 0 && (
                <div className="rounded-2xl p-4 mb-6" style={{ background: `${hex}10`, boxShadow: `0 0 0 1px ${hex}30 inset` }}>
                  <div className="text-[12px] font-black uppercase tracking-wide mb-2.5" style={{ color: hex }}>רשימת פעולות לקחת ממך</div>
                  <div className="space-y-2">
                    {tips.map((tip, i) => (
                      <button key={i} onClick={() => toggleTipChecked(i)} className="w-full flex items-start gap-2.5 text-right">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border-2 transition ${checkedTips[i] ? "border-transparent" : "border-zinc-600"}`} style={checkedTips[i] ? { backgroundColor: hex } : undefined}>
                          {checkedTips[i] && <Check size={12} className="text-black" />}
                        </span>
                        <span className={`text-[13px] leading-relaxed ${checkedTips[i] ? "text-zinc-500 line-through" : "text-zinc-300"}`}>{tip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 pt-5" style={{ borderTop: `1px solid ${hex}25` }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Dumbbell size={15} className="text-emerald-400" />
                  <span className="text-[13px] font-black text-zinc-200">תרגם לתוכנית האימונים שלי</span>
                </div>
                {trainingPlanInsight ? (
                  <div className="rounded-xl p-3.5 bg-emerald-500/10 text-[13px] text-zinc-300 leading-relaxed">{trainingPlanInsight}</div>
                ) : (
                  <GlowButton tone="ghost" icon={loadingPlanInsight ? Loader2 : Dumbbell} className="w-full" disabled={loadingPlanInsight} onClick={() => getTrainingPlanInsight(openArticle)}>
                    {loadingPlanInsight ? "חושב..." : "קבל המלצה מעשית"}
                  </GlowButton>
                )}
              </div>

              <div className="flex items-center gap-2 pt-5" style={{ borderTop: `1px solid ${hex}30` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${hex}20` }}>
                  {unitObj ? <Shield size={14} style={{ color: hex }} /> : <Newspaper size={14} style={{ color: hex }} />}
                </div>
                <span className="text-[12px] text-zinc-500">כתבה מתוך עיתון הטיפים · {openArticle.unit}</span>
              </div>

              {relatedArticles.length > 0 && (
                <div className="mt-8">
                  <div className="text-[13px] font-black text-zinc-200 mb-2.5">עוד כתבות על {openArticle.unit}</div>
                  <div className="flex gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                    {relatedArticles.map((a) => (
                      <button key={a.id} onClick={() => { setOpenArticle(a); setArticleProgress(0); }} className="shrink-0 w-40 text-right rounded-xl overflow-hidden" style={{ background: `${hex}10`, boxShadow: `0 0 0 1px ${hex}30 inset` }}>
                        <div className="h-16 flex items-center justify-center" style={{ background: `linear-gradient(140deg, ${hex}30, transparent)` }}>
                          <Newspaper size={20} style={{ color: hex }} />
                        </div>
                        <div className="p-2 text-[12px] font-bold text-zinc-200 line-clamp-2">{a.title}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ============================== PROFILE TAB ============================== */

/* ============================== FITNESS TAB (score table + per-test detail) ============================== */

function ScoreCircle({ score, size = 56, isPersonalBest }) {
  const hex = scoreColor(score);
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);
  const dash = (animated / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {isPersonalBest && (
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center z-10" style={{ boxShadow: "0 0 8px 2px rgba(251,191,36,0.7)" }}>
          <Star size={11} className="text-black" fill="black" />
        </div>
      )}
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={hex} strokeWidth="5" strokeDasharray={`${dash} 999`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${hex})`, transition: "stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-black text-white tabular-nums" style={{ fontSize: size * 0.32 }}>{score}</span>
      </div>
    </div>
  );
}

function ScoreBar({ score }) {
  const hex = scoreColor(score);
  return (
    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${score}%`, background: `linear-gradient(90deg, #fde047, ${hex})`, boxShadow: `0 0 8px ${hex}80` }} />
    </div>
  );
}

const FITNESS_GROUPS = [
  { label: "ריצות", tests: ["run_1000", "run_2000", "run_3000", "run_5000"], hex: "#38bdf8", icon: Timer },
  { label: "מתח", tests: ["pullups", "pullups_weighted"], hex: "#f59e0b", icon: Dumbbell },
  { label: "כוח גוף עליון", tests: ["pushups", "dips"], hex: "#a78bfa", icon: Zap },
];

function FitnessTab({ userId, showToast, goToHome }) {
  const [view, setView] = useState("table"); // 'table' | 'detail'
  const [allResults, setAllResults] = useState({}); // testId -> [{value,date}]
  const [loadingTable, setLoadingTable] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [fitnessHistory, setFitnessHistory] = useState([]);
  const [loadingFitness, setLoadingFitness] = useState(false);
  const [addingResult, setAddingResult] = useState(false);
  const [newResultVal, setNewResultVal] = useState("");
  const [newResultMin, setNewResultMin] = useState("");
  const [newResultSec, setNewResultSec] = useState("");
  const [savingResult, setSavingResult] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [confirmDeletePoint, setConfirmDeletePoint] = useState(null);
  const [sortMode, setSortMode] = useState("group"); // 'group' | 'weakest'
  const [goals, setGoals] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalInput, setGoalInput] = useState("");
  const [goalInputSec, setGoalInputSec] = useState("");
  const [goalCelebration, setGoalCelebration] = useState(null);
  const [aiTip, setAiTip] = useState("");
  const [goalEstimate, setGoalEstimate] = useState(null); // { text, loading } per active test
  const [loadingGoalEstimate, setLoadingGoalEstimate] = useState(false);
  const [loadingAiTip, setLoadingAiTip] = useState(false);

  async function refreshTable() {
    setLoadingTable(true);
    const [rows, goalMap] = await Promise.all([loadAllFitnessTests(userId), loadFitnessGoals(userId)]);
    const grouped = {};
    for (const r of rows) { (grouped[r.testType] ||= []).push(r); }
    setAllResults(grouped);
    setGoals(goalMap);
    setLoadingTable(false);
  }
  useEffect(() => { refreshTable(); }, [userId]);

  async function manualRefresh() {
    setRefreshing(true);
    await refreshTable();
    setTimeout(() => setRefreshing(false), 500);
    showToast("עודכן", "success");
  }

  function bestScoreFor(testId) {
    const hist = allResults[testId];
    if (!hist || hist.length === 0) return null;
    const t = FITNESS_TESTS.find((x) => x.id === testId);
    const best = t.unit === "time" ? Math.min(...hist.map((h) => h.value)) : Math.max(...hist.map((h) => h.value));
    return scoreForTest(testId, best);
  }
  function latestFor(testId) {
    const hist = allResults[testId];
    if (!hist || hist.length === 0) return null;
    return hist[hist.length - 1];
  }
  function isPersonalBestNow(testId) {
    const hist = allResults[testId];
    if (!hist || hist.length < 2) return false;
    const t = FITNESS_TESTS.find((x) => x.id === testId);
    const latest = hist[hist.length - 1].value;
    const bestOfAll = t.unit === "time" ? Math.min(...hist.map((h) => h.value)) : Math.max(...hist.map((h) => h.value));
    return latest === bestOfAll;
  }
  function goalProgressPct(testId) {
    const goal = goals[testId];
    const hist = allResults[testId];
    if (goal == null || !hist || hist.length === 0) return null;
    const t = FITNESS_TESTS.find((x) => x.id === testId);
    const baseline = hist[0].value;
    const current = t.unit === "time" ? Math.min(...hist.map((h) => h.value)) : Math.max(...hist.map((h) => h.value));
    if (baseline === goal) return 100;
    const pct = ((current - baseline) / (goal - baseline)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }
  function trendFor(testId) {
    const hist = allResults[testId];
    if (!hist || hist.length < 2) return null;
    const t = FITNESS_TESTS.find((x) => x.id === testId);
    const latest = hist[hist.length - 1].value;
    const prev = hist[hist.length - 2].value;
    if (latest === prev) return "same";
    return isImprovement(t.unit, latest, prev) ? "up" : "down";
  }
  function copySummary() {
    const lines = FITNESS_TESTS.map((t) => {
      const latest = latestFor(t.id);
      const score = bestScoreFor(t.id);
      return latest ? `${t.label}: ${formatTestValue(t.unit, latest.value)} (ציון ${score})` : `${t.label}: אין תוצאה`;
    });
    const text = `מד הכושר שלי - ציון כללי ${overallAvg} (${scoreRank(overallAvg)})\n\n${lines.join("\n")}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 1800);
    });
  }
  function openGoalEditor(t) {
    setEditingGoal(t);
    const existing = goals[t.id];
    if (existing != null) {
      if (t.unit === "time") {
        setGoalInput(String(Math.floor(existing / 60)));
        setGoalInputSec(String(Math.round(existing % 60)));
      } else {
        setGoalInput(String(existing));
        setGoalInputSec("");
      }
    } else {
      setGoalInput("");
      setGoalInputSec("");
    }
  }

  async function saveGoal() {
    const t = editingGoal;
    let val;
    if (t.unit === "time") {
      const m = parseInt(goalInput, 10) || 0;
      const s = parseInt(goalInputSec, 10) || 0;
      if (m === 0 && s === 0) { showToast("נא להזין זמן", "error"); return; }
      val = m * 60 + s;
    } else {
      val = parseInt(goalInput, 10);
      if (!val || val <= 0) { showToast("נא להזין ערך", "error"); return; }
    }
    await saveFitnessGoal(userId, t.id, val);
    setGoals((g) => ({ ...g, [t.id]: val }));
    setEditingGoal(null);
    setGoalInput(""); setGoalInputSec("");
    showToast("היעד נשמר", "success");
  }

  async function getAiTip() {
    setLoadingAiTip(true);
    setAiTip("");
    try {
      const sortedByScore = [...FITNESS_TESTS].map((t) => ({ t, score: bestScoreFor(t.id) })).filter((x) => x.score !== null).sort((a, b) => a.score - b.score);
      const weakest = sortedByScore.slice(0, 2);
      const summary = FITNESS_TESTS.map((t) => {
        const latest = latestFor(t.id);
        const goal = goals[t.id];
        if (!latest) return `${t.label}: אין תוצאה`;
        return `${t.label}: ${formatTestValue(t.unit, latest.value)} (ציון ${bestScoreFor(t.id)})${goal != null ? `, יעד: ${formatTestValue(t.unit, goal)}` : ""}`;
      }).join("; ");
      const weakestNames = weakest.map((x) => x.t.label).join(" ו-");
      const sys = "אתה מאמן כושר קרבי עילי, מקצועי ותומך, המתמחה בהכנה לגיבושים צבאיים. תן עצה קצרה, ממוקדת וישימה - עד 4 משפטים, בלי הקדמות מיותרות, מבוססת על עקרונות אימון מדעיים אך מוסברת בפשטות לבן נוער 16-19.";
      const userMsg = `אלו התוצאות והיעדים הנוכחיים שלי במד הכושר: ${summary}. המדדים הכי חלשים שלי הם ${weakestNames}. תן לי עצה ממוקדת איך להתקדם הכי מהר לעבר היעדים שלי, במיוחד במדדים החלשים.`;
      const reply = await aiChat(sys, userMsg, []);
      setAiTip(reply);
    } catch (e) {
      setAiTip("לא הצלחתי לקבל עצה כרגע - נסה שוב בעוד רגע.");
    } finally {
      setLoadingAiTip(false);
    }
  }

  const allScores = FITNESS_TESTS.map((t) => bestScoreFor(t.id) ?? 0);
  const overallAvg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  async function openTest(t) {
    setActiveTest(t);
    setView("detail");
    setAddingResult(false);
    setGoalEstimate(null);
    setLoadingFitness(true);
    const rows = await loadFitnessTests(userId, t.id);
    setFitnessHistory(rows);
    setLoadingFitness(false);
  }

  if (view === "detail" && activeTest) {
    const t = activeTest;
    const latest = fitnessHistory[fitnessHistory.length - 1];
    const prev = fitnessHistory[fitnessHistory.length - 2];
    const improved = latest && prev ? isImprovement(t.unit, latest.value, prev.value) : null;
    const latestScore = latest ? scoreForTest(t.id, latest.value) : null;

    async function saveResult() {
      let val;
      if (t.unit === "time") {
        const m = parseInt(newResultMin, 10) || 0;
        const s = parseInt(newResultSec, 10) || 0;
        if (m === 0 && s === 0) { showToast("נא להזין זמן", "error"); return; }
        val = m * 60 + s;
      } else {
        val = parseInt(newResultVal, 10);
        if (!val || val <= 0) { showToast("נא להזין מספר חזרות", "error"); return; }
      }
      setSavingResult(true);
      try {
        if (editingPoint) {
          await updateFitnessTest(editingPoint.id, val, editingPoint.date);
          setFitnessHistory((prev) => prev.map((p) => p.id === editingPoint.id ? { ...p, value: val } : p));
          showToast("התוצאה עודכנה", "success");
        } else {
          const saved = await addFitnessTest(userId, { testType: t.id, value: val, date: toKey(new Date()) });
          setFitnessHistory((prev) => [...prev, saved]);
          setGoalEstimate(null);
          const goalVal = goals[t.id];
          const reachedGoal = goalVal != null && (t.unit === "time" ? val <= goalVal : val >= goalVal);
          if (reachedGoal) {
            setGoalCelebration(t);
          } else {
            showToast("התוצאה נשמרה", "success");
          }
        }
        setAddingResult(false);
        setEditingPoint(null);
        setNewResultVal(""); setNewResultMin(""); setNewResultSec("");
        refreshTable();
      } catch (e) {
        showToast("שגיאה בשמירה", "error");
      } finally {
        setSavingResult(false);
      }
    }

    async function getGoalEstimate() {
      const goalVal = goals[t.id];
      if (goalVal == null || fitnessHistory.length < 2) return;
      setLoadingGoalEstimate(true);
      setGoalEstimate(null);
      try {
        const sorted = [...fitnessHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalDays = Math.max(1, (new Date(last.date) - new Date(first.date)) / 86400000);
        const isTime = t.unit === "time";
        const changePerWeek = isTime
          ? ((first.value - last.value) / totalDays) * 7
          : ((last.value - first.value) / totalDays) * 7;
        const remaining = isTime ? (last.value - goalVal) : (goalVal - last.value);

        let mathSummary;
        if (remaining <= 0) {
          mathSummary = `כבר עמדת ביעד (${formatTestValue(t.unit, last.value)} מול יעד ${formatTestValue(t.unit, goalVal)}).`;
        } else if (changePerWeek <= 0) {
          mathSummary = `לפי הנתונים שלך, אין כרגע שיפור ברור (התוצאה האחרונה: ${formatTestValue(t.unit, last.value)}, לפני ${Math.round(totalDays)} ימים: ${formatTestValue(t.unit, first.value)}). אי אפשר להעריך זמן ריאלי בקצב הנוכחי.`;
        } else {
          const weeksNeeded = remaining / changePerWeek;
          mathSummary = `בקצב השיפור הנוכחי שלך (כ-${formatTestValue(t.unit, changePerWeek)} לשבוע, מבוסס על ${sorted.length} תוצאות ב-${Math.round(totalDays)} הימים האחרונים), נותרו כ-${remaining > 0 ? formatTestValue(t.unit, remaining) : ""} עד היעד, שזה בערך ${Math.max(1, Math.round(weeksNeeded))} שבועות בקצב הזה.`;
        }

        const sys = "אתה מאמן כושר קרבי עילי מקצועי. קיבלת הערכה מספרית מדויקת שכבר חושבה מנתונים אמיתיים - אל תמציא מספר אחר, תסביר את זה בפשטות ותוסיף המלצה קצרה (2-3 סוגי אימונים, לא רק כושר קרבי) שיעזרו להגיע ליעד מהר יותר. עד 4 משפטים, בלי הקדמות.";
        const userMsg = `המדד: ${t.label}. ${mathSummary} תסביר לי את זה בקצרה ותציע אימונים משלימים (מעבר לכושר קרבי) שיעזרו לי להתקדם מהר יותר למדד הזה.`;
        const reply = await aiChat(sys, userMsg, []);
        setGoalEstimate({ text: reply });
      } catch (e) {
        setGoalEstimate({ text: "לא הצלחתי לחשב הערכה כרגע - נסה שוב בעוד רגע." });
      } finally {
        setLoadingGoalEstimate(false);
      }
    }

    function openEdit(point) {
      setEditingPoint(point);
      setAddingResult(true);
      if (t.unit === "time") {
        setNewResultMin(String(Math.floor(point.value / 60)));
        setNewResultSec(String(Math.round(point.value % 60)));
      } else {
        setNewResultVal(String(point.value));
      }
    }

    async function deletePoint() {
      try {
        await deleteFitnessTest(userId, confirmDeletePoint.id);
        setFitnessHistory((prev) => prev.filter((p) => p.id !== confirmDeletePoint.id));
        showToast("התוצאה נמחקה", "success");
        refreshTable();
      } catch (e) {
        showToast("שגיאה במחיקה", "error");
      }
      setConfirmDeletePoint(null);
      setAddingResult(false);
      setEditingPoint(null);
    }

    return (
      <div className="p-4 max-w-lg mx-auto">
        <button onClick={() => setView("table")} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
          <ChevronRight size={16} /> חזרה לטבלה
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <t.icon size={22} className="text-emerald-400" />
          </div>
          <div className="text-xl font-black text-zinc-50">{t.label}</div>
        </div>

        {goals[t.id] != null && (
          <div className="rounded-2xl p-3.5 mb-4 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #f59e0b20, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #f59e0b40 inset" }}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Target size={16} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wide">היעד האישי שלך</div>
              <div className="text-[16px] font-black text-zinc-100">{formatTestValue(t.unit, goals[t.id])}</div>
            </div>
            <button onClick={() => openGoalEditor(t)} className="text-[11px] font-bold text-zinc-500 hover:text-zinc-300 shrink-0">שינוי</button>
          </div>
        )}

        {loadingFitness ? (
          <div className="text-center py-16 text-sm text-zinc-600">טוען...</div>
        ) : fitnessHistory.length === 0 ? (
          <div className="text-center py-10 text-sm text-zinc-600 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4">עדיין אין תוצאות - תמלאו את הראשונה!</div>
        ) : (
          <div className="rounded-3xl overflow-hidden p-5 mb-4" style={{ background: "linear-gradient(160deg, #10b98118, transparent 55%), var(--card-base)", boxShadow: "0 0 0 1px #10b98130 inset" }}>
            <FitnessLineGraph points={fitnessHistory} unit={t.unit} onPointClick={openEdit} />
            <div className="text-[11px] text-zinc-600 text-center -mt-1 mb-1">הקישו על נקודה בגרף כדי לערוך אותה</div>
            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-[11px] text-zinc-500 mb-1">התוצאה האחרונה</div>
                <div className="text-4xl font-black text-emerald-400 tabular-nums">{formatTestValue(t.unit, latest.value)}</div>
                <div className="text-[12px] text-zinc-500 mt-1">מולא בתאריך {latest.date} · ציון {latestScore}</div>
              </div>
              {improved !== null && (
                <div className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold ${improved ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                  <TrendingUp size={13} className={improved ? "" : "rotate-90"} /> {improved ? "שיפור!" : "המשך כך"}
                </div>
              )}
            </div>
          </div>
        )}

        {!loadingFitness && fitnessHistory.length >= 2 && goals[t.id] != null && (
          <div className="mb-4">
            {goalEstimate ? (
              <div className="rounded-2xl p-4" style={{ background: "linear-gradient(120deg, #a78bfa20, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1px #a78bfa35 inset" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={14} className="text-violet-400 shrink-0" />
                  <span className="text-[13px] font-black text-zinc-100">כמה זמן עד היעד?</span>
                </div>
                <div className="text-[13px] text-zinc-300 leading-relaxed">{goalEstimate.text}</div>
                <button onClick={getGoalEstimate} className="text-[11px] font-bold text-violet-400 mt-2">חשב מחדש</button>
              </div>
            ) : (
              <GlowButton tone="ghost" icon={loadingGoalEstimate ? Loader2 : Bot} className="w-full" disabled={loadingGoalEstimate} onClick={getGoalEstimate}>
                {loadingGoalEstimate ? "מחשב הערכה..." : "כמה זמן ייקח לי להגיע ליעד?"}
              </GlowButton>
            )}
          </div>
        )}

        {addingResult ? (
          <Card className="p-4">
            <div className="text-base font-black text-zinc-100 mb-3">{editingPoint ? "עריכת תוצאה" : "תוצאה חדשה"}</div>
            {t.unit === "time" ? (
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-[11px] text-zinc-500 font-semibold block mb-1">דקות</label>
                  <input type="number" value={newResultMin} onChange={(e) => setNewResultMin(e.target.value)} placeholder="0" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-zinc-500 font-semibold block mb-1">שניות</label>
                  <input type="number" value={newResultSec} onChange={(e) => setNewResultSec(e.target.value)} placeholder="0" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                </div>
              </div>
            ) : (
              <div className="mb-3">
                <label className="text-[11px] text-zinc-500 font-semibold block mb-1">מספר חזרות</label>
                <input type="number" value={newResultVal} onChange={(e) => setNewResultVal(e.target.value)} placeholder="0" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
              </div>
            )}
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => { setAddingResult(false); setEditingPoint(null); setNewResultVal(""); setNewResultMin(""); setNewResultSec(""); }}>ביטול</GlowButton>
              {editingPoint && (
                <GlowButton tone="red" icon={Trash2} onClick={() => setConfirmDeletePoint(editingPoint)}>מחק</GlowButton>
              )}
              <GlowButton tone="emerald" icon={savingResult ? Loader2 : Check} className="flex-1" disabled={savingResult} onClick={saveResult}>שמור</GlowButton>
            </div>
          </Card>
        ) : (
          <GlowButton tone="emerald" icon={Plus} className="w-full" onClick={() => { setEditingPoint(null); setNewResultVal(""); setNewResultMin(""); setNewResultSec(""); setAddingResult(true); }}>מלא תוצאה חדשה</GlowButton>
        )}

        {confirmDeletePoint && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setConfirmDeletePoint(null)}>
            <div className="w-full sm:max-w-xs bg-zinc-950 border-2 border-red-500/40 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 text-red-400 font-black text-base mb-2">
                <Trash2 size={18} /> מחיקת תוצאה
              </div>
              <div className="text-sm text-zinc-400 mb-4">למחוק את התוצאה {formatTestValue(t.unit, confirmDeletePoint.value)} מתאריך {confirmDeletePoint.date}?</div>
              <div className="flex gap-2">
                <GlowButton tone="ghost" className="flex-1" onClick={() => setConfirmDeletePoint(null)}>ביטול</GlowButton>
                <GlowButton tone="red" icon={Trash2} className="flex-1" onClick={deletePoint}>מחק</GlowButton>
              </div>
            </div>
          </div>
        )}

        {goalCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85" dir="rtl" onClick={() => setGoalCelebration(null)}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, left: `${(i * 41) % 100}%`, top: "-5%",
                    backgroundColor: ["#f59e0b", "#fbbf24", "#10b981", "#34d399"][i % 4],
                    animation: `confettiFall ${2 + (i % 5) * 0.3}s ease-in ${(i % 6) * 0.12}s forwards`,
                  }}
                />
              ))}
            </div>
            <style>{`@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(70vh) rotate(360deg); opacity: 0; } }`}</style>
            <div className="relative flex flex-col items-center text-center px-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-24 h-24 rounded-full bg-amber-400 flex items-center justify-center mb-4" style={{ boxShadow: "0 0 40px 10px rgba(251,191,36,0.5)" }}>
                <Target size={44} className="text-black" strokeWidth={2.5} />
              </div>
              <div className="text-2xl font-black text-white mb-1.5">היעד הושג! 🎉</div>
              <div className="text-[14px] text-zinc-300 mb-6">{goalCelebration.label} - עמדת ביעד שהצבת לעצמך</div>
              <GlowButton tone="emerald" icon={Check} onClick={() => setGoalCelebration(null)}>מעולה!</GlowButton>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fx-root p-4 max-w-lg mx-auto fx-stagger relative" onPointerDown={(e) => fxTouchRing(e, scoreColor(overallAvg))}>
      <FxStyles />
      <FxAmbience hex={scoreColor(overallAvg)} hex2="#a855f7" hex3="#38bdf8" icons={[Trophy, TrendingUp, Target]} particles={10} />
      <FxScrollBar hex={scoreColor(overallAvg)} />
      <style>{`
        @keyframes fitDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(6px,-10px); opacity: 0.6; } }
        @keyframes fitHueShift { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @keyframes fitRankPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); } 50% { box-shadow: 0 0 0 5px rgba(255,255,255,0); } }
        @keyframes fitCardFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fitGroupRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fitShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
        @keyframes fitPbGlow { 0%, 100% { filter: drop-shadow(0 0 4px currentColor); } 50% { filter: drop-shadow(0 0 10px currentColor); } }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-black text-zinc-50">מד הכושר</div>
        <div className="flex items-center gap-2">
          <button onClick={copySummary} className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center active:scale-90 transition">
            {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} className="text-zinc-400" />}
          </button>
          <button onClick={manualRefresh} className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center active:scale-90 transition">
            <Loader2 size={15} className={`text-zinc-400 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {(
        <div {...fxTilt(6)} className="relative rounded-3xl overflow-hidden p-6 mb-5 flex flex-col items-center tech-grid" style={{ ...fxTiltStyle, background: `linear-gradient(160deg, ${scoreColor(overallAvg)}20, transparent 60%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${scoreColor(overallAvg)}45 inset` }}>
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ backgroundColor: scoreColor(overallAvg), animation: "fitHueShift 5s ease-in-out infinite" }} />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="absolute rounded-full" style={{ width: 2, height: 2, backgroundColor: scoreColor(overallAvg), left: `${(i * 29 + 8) % 92}%`, top: `${(i * 21 + 6) % 80}%`, opacity: 0.4, animation: `fitDust ${5 + (i % 3)}s ease-in-out ${i * 0.35}s infinite` }} />
            ))}
          </div>
          <FxFrame hex={scoreColor(overallAvg)} hex2="#a855f7" radius="1.5rem" />
          <FxSpot />
          {[["top-2 right-2", "border-t-2 border-r-2"], ["top-2 left-2", "border-t-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"], ["bottom-2 left-2", "border-b-2 border-l-2"]].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-4 h-4 ${border} pointer-events-none opacity-40`} style={{ borderColor: scoreColor(overallAvg) }} />
          ))}
          <div className="relative text-[12px] font-bold text-zinc-400 mb-2">ציון כושר כללי</div>
          <div className="relative" style={{ width: 130, height: 130 }}>
            <svg viewBox="0 0 130 130" className="-rotate-90">
              <circle cx="65" cy="65" r="56" fill="none" stroke="#27272a" strokeWidth="9" />
              <circle cx="65" cy="65" r="56" fill="none" stroke={scoreColor(overallAvg)} strokeWidth="9" strokeDasharray={`${(overallAvg / 100) * 2 * Math.PI * 56} 999`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${scoreColor(overallAvg)})`, transition: "stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatedNumber value={overallAvg} className="text-4xl font-black text-white tabular-nums" />
            </div>
          </div>
          <span className="relative mt-3 rounded-full px-3 py-1 text-[12px] font-black" style={{ backgroundColor: `${scoreColor(overallAvg)}25`, color: scoreColor(overallAvg), animation: "fitRankPulse 2.2s ease-in-out infinite" }}>{scoreRank(overallAvg)}</span>
          <div className="relative text-[11px] text-zinc-500 mt-2">מבוסס על התוצאה הטובה ביותר בכל מדד</div>
        </div>
      )}

      {!loadingTable && (() => {
        const scored = FITNESS_TESTS.map((t) => ({ t, score: bestScoreFor(t.id) })).filter((x) => x.score !== null);
        if (scored.length === 0) return null;
        const weakest = scored.sort((a, b) => a.score - b.score)[0];
        const bankCat = TEST_TO_BANK_CATEGORY[weakest.t.id];
        return (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "linear-gradient(160deg, #a78bfa20, transparent 60%), var(--card-base-alt)", boxShadow: "0 0 0 1px #a78bfa35 inset" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                <Bot size={15} className="text-violet-400" />
              </div>
              <div className="text-[14px] font-black text-zinc-100">עוזר AI אישי</div>
            </div>

            {bankCat && (
              <button onClick={() => { goToHome?.(); showToast(`חפשו את "${bankCat}" במאגר האימונים`, "info"); }} className="w-full flex items-center gap-2.5 rounded-xl bg-black/40 p-2.5 mb-2.5 text-right">
                <Target size={14} className="text-amber-400 shrink-0" />
                <span className="flex-1 text-[12px] text-zinc-300">המדד החלש ביותר שלכם: <b className="text-zinc-100">{weakest.t.label}</b> - מומלץ להתאמן על "{bankCat}"</span>
                <ChevronLeft size={14} className="text-zinc-500 shrink-0" />
              </button>
            )}

            {aiTip ? (
              <div className="text-[13px] text-zinc-300 leading-relaxed bg-black/40 rounded-xl p-3">{aiTip}</div>
            ) : (
              <GlowButton tone="ghost" icon={loadingAiTip ? Loader2 : Bot} className="w-full" disabled={loadingAiTip} onClick={getAiTip}>
                {loadingAiTip ? "חושב..." : "קבל עצה אישית מה-AI"}
              </GlowButton>
            )}
          </div>
        );
      })()}

      {!loadingTable && (() => {
        const scoredGroups = FITNESS_GROUPS.map((g) => {
          const vals = g.tests.map((tid) => bestScoreFor(tid)).filter((x) => x != null);
          return { label: g.label.replace("כוח ", "").replace("סיבולת ", ""), value: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length / 100 : 0, hex: g.hex };
        });
        if (scoredGroups.every((g) => g.value === 0)) return null;
        return (
          <div className="mb-4">
            <FxSectionHead icon={Activity} title="מאזן קבוצות" hex="#a855f7" />
            <div className="rounded-2xl p-3 mt-2" style={{ background: "var(--card-base-alt)", boxShadow: "0 0 0 1px #3f3f4660 inset" }}>
              <FxRadar items={scoredGroups} size={190} hex="#a855f7" />
            </div>
          </div>
        );
      })()}

      <div className="flex bg-zinc-900 rounded-xl p-1 gap-1 mb-4">
        {[["group", "לפי קבוצה"], ["weakest", "החלש ביותר קודם"]].map(([id, label]) => (
          <button key={id} onClick={() => setSortMode(id)} className={`flex-1 rounded-lg py-2 text-[12px] font-bold transition ${sortMode === id ? "bg-emerald-500 text-black" : "text-zinc-400"}`}>{label}</button>
        ))}
      </div>

      {loadingTable ? (
        <div className="text-center py-16 text-sm text-zinc-600">טוען...</div>
      ) : (
        <div className="space-y-5">
          {(sortMode === "weakest"
            ? [{ label: "כל המדדים - מהחלש לחזק", tests: [...FITNESS_TESTS].sort((a, b) => (bestScoreFor(a.id) ?? 0) - (bestScoreFor(b.id) ?? 0)).map((t) => t.id), hex: "#ef4444", icon: TrendingUp }]
            : FITNESS_GROUPS
          ).map((group, gi) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="relative w-8 h-8 shrink-0">
                  <svg viewBox="0 0 32 32" className="absolute inset-0" style={{ animation: "fitGroupRing 7s linear infinite" }}>
                    <circle cx="16" cy="16" r="14" fill="none" stroke={group.hex} strokeWidth="1.5" strokeDasharray="8 80" strokeLinecap="round" opacity="0.6" />
                  </svg>
                  <div className="absolute inset-[3px] rounded-lg flex items-center justify-center" style={{ backgroundColor: `${group.hex}22` }}>
                    <group.icon size={13} style={{ color: group.hex }} />
                  </div>
                </div>
                <span className="text-base font-black text-zinc-100">{group.label}</span>
                <div className="flex-1 h-px rounded-full" style={{ background: `linear-gradient(90deg, ${group.hex}50, transparent)` }} />
              </div>
              <div className="space-y-2">
                {group.tests.map((testId, ti) => {
                  const t = FITNESS_TESTS.find((x) => x.id === testId);
                  const latest = latestFor(testId);
                  const score = bestScoreFor(testId);
                  const goal = goals[testId];
                  const goalPct = goalProgressPct(testId);
                  const trend = trendFor(testId);
                  const pb = isPersonalBestNow(testId);
                  return (
                    <div key={testId} {...fxTilt(5)} className="relative rounded-2xl overflow-hidden" style={{ ...fxTiltStyle, background: `linear-gradient(120deg, ${group.hex}14, transparent 70%), var(--card-base-alt)`, boxShadow: pb ? `0 0 0 1.5px ${group.hex}70 inset, 0 0 14px 0 ${group.hex}30` : `0 0 0 1px ${group.hex}25 inset`, animation: `fitCardFadeUp 0.35s ease-out ${(gi * 3 + ti) * 0.04}s both` }}>
                      {pb && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${group.hex}22, transparent)`, animation: "fitShimmer 3.5s ease-in-out infinite" }} />
                        </div>
                      )}
                      <FxSpot />
                      <button onClick={() => openTest(t)} className="relative w-full flex items-center gap-3 p-3.5 text-right">
                        {score != null ? (
                          <FxRing size={40} stroke={3} pct={score} hex={group.hex}>
                            <t.icon size={15} style={{ color: group.hex }} />
                          </FxRing>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0" style={{ boxShadow: `0 0 0 1px ${group.hex}40 inset` }}>
                            <t.icon size={18} style={{ color: group.hex }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold text-zinc-200">{t.label}</span>
                            {pb && <Trophy size={12} className="text-amber-400" style={{ animation: "fitPbGlow 2s ease-in-out infinite" }} />}
                            {trend === "up" && <TrendingUp size={12} className="text-emerald-400" />}
                            {trend === "down" && <TrendingUp size={12} className="text-red-400 rotate-180" />}
                          </div>
                          {latest ? (
                            <>
                              <div className="text-[12px] text-zinc-500 mb-1">
                                {formatTestValue(t.unit, latest.value)}
                                {goal != null && <span className="text-zinc-600"> · יעד {formatTestValue(t.unit, goal)}</span>}
                              </div>
                              <ScoreBar score={score} />
                              {goalPct != null && (
                                <div className="mt-1.5">
                                  <div className="flex items-center justify-between text-[10px] text-amber-400/80 mb-0.5">
                                    <span>התקדמות ליעד</span>
                                    <span className="font-bold">{goalPct}%</span>
                                  </div>
                                  <div className="relative h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${goalPct}%`, transition: "width 0.8s ease-out", boxShadow: "0 0 6px #fbbf24" }} />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-[12px] text-zinc-600">אין עדיין תוצאה - הקישו למילוי</div>
                          )}
                        </div>
                        {score !== null ? <ScoreCircle score={score} size={48} isPersonalBest={pb} /> : <ChevronLeft size={17} className="text-zinc-600 shrink-0" />}
                      </button>
                      <button
                        onClick={() => openGoalEditor(t)}
                        className="relative w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-zinc-500 border-t border-zinc-800/80"
                      >
                        <Target size={11} /> {goal != null ? "עדכן יעד אישי" : "הגדר יעד אישי"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setEditingGoal(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border-2 border-emerald-500/40 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-base mb-3">
              <Target size={18} /> יעד אישי - {editingGoal.label}
            </div>
            {editingGoal.unit === "time" ? (
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <label className="text-[11px] text-zinc-500 font-semibold block mb-1">דקות</label>
                  <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-zinc-500 font-semibold block mb-1">שניות</label>
                  <input type="number" value={goalInputSec} onChange={(e) => setGoalInputSec(e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="text-[11px] text-zinc-500 font-semibold block mb-1">מספר חזרות</label>
                <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="0" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              </div>
            )}
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setEditingGoal(null)}>ביטול</GlowButton>
              <GlowButton tone="emerald" icon={Check} className="flex-1" onClick={saveGoal}>שמור יעד</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ user, setCurrentUser, showToast, onLogout, goBack }) {
  const profile = user.profile || {};
  const targetUnitObj = UNITS.find((u) => u.id === profile.targetUnit);
  const heroHex = targetUnitObj?.hex || "#10b981";
  const [warConfirmOpen, setWarConfirmOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [gibushDraftType, setGibushDraftType] = useState("");
  const [gibushDraftDate, setGibushDraftDate] = useState("");
  const [editingGibush, setEditingGibush] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileView, setProfileView] = useState("profile"); // 'profile' | 'settings' | 'about'
  const [uploadingBg, setUploadingBg] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldDraft, setFieldDraft] = useState("");
  const [justSaved, setJustSaved] = useState(null);
  const [copiedStats, setCopiedStats] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(true);

  function startEdit(field, currentVal) {
    setEditingField(field);
    setFieldDraft(String(currentVal ?? ""));
  }
  async function saveField(field) {
    const val = ["age", "height", "weight"].includes(field) ? Number(fieldDraft) : fieldDraft.trim();
    if (["age", "height", "weight"].includes(field) && (!val || val <= 0)) { showToast("ערך לא תקין", "error"); return; }
    await updateProfile({ [field]: val });
    setEditingField(null);
    setJustSaved(field);
    setTimeout(() => setJustSaved(null), 1800);
  }
  function copyStats() {
    const lines = [
      profile.fullName, targetUnitObj?.name, profile.teamCode ? getTeamLabel(profile.teamCode) : null,
      profile.age ? `גיל ${profile.age}` : null, profile.height ? `${profile.height} ס״מ` : null, profile.weight ? `${profile.weight} ק״ג` : null,
    ].filter(Boolean).join(" · ");
    navigator.clipboard?.writeText(lines).then(() => {
      setCopiedStats(true);
      setTimeout(() => setCopiedStats(false), 1800);
    });
  }

  async function updateProfile(patch) {
    const newProfile = { ...profile, ...patch };
    const newUser = { ...user, profile: newProfile };
    setCurrentUser(newUser);
    try {
      await saveUserProfile(newUser);
    } catch (e) {
      showToast("שגיאה בשמירה", "error");
    }
  }

  async function handlePhotoFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("נא לבחור קובץ תמונה", "error"); return; }
    setUploadingPhoto(true);
    try {
      const url = await uploadUnitImage(file);
      await updateProfile({ photoUrl: url });
      showToast("התמונה עודכנה", "success");
    } catch (e) {
      showToast(`שגיאת העלאה: ${e.message || "לא ידוע"}`, "error");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleBgFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("נא לבחור קובץ תמונה", "error"); return; }
    setUploadingBg(true);
    try {
      const url = await uploadUnitImage(file);
      await updateProfile({ customBgUrl: url, customBgEnabled: true });
      showToast("הרקע עודכן", "success");
    } catch (e) {
      showToast(`שגיאת העלאה: ${e.message || "לא ידוע"}`, "error");
    } finally {
      setUploadingBg(false);
    }
  }

  function toggleIssue(opt) {
    const list = profile.healthIssues || [];
    const next = list.includes(opt) ? list.filter((x) => x !== opt) : [...list, opt];
    updateProfile({ healthIssues: next });
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={goBack} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold">
        <ChevronRight size={16} /> חזרה לבית
      </button>
      <div className="relative rounded-3xl overflow-hidden p-6 tech-grid" style={{ background: `linear-gradient(160deg, ${targetUnitObj?.hex || "#10b981"}22, transparent 55%), var(--card-base)`, boxShadow: `0 0 0 1px ${targetUnitObj?.hex || "#10b981"}35 inset` }}>
        <div className="absolute -left-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ backgroundColor: targetUnitObj?.hex || "#10b981", animation: "profileHeroPulse 4s ease-in-out infinite" }} />
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl opacity-20" style={{ backgroundColor: targetUnitObj?.hex || "#10b981" }} />
        <style>{`
          @keyframes profileHeroPulse { 0%, 100% { transform: scale(1); opacity: 0.35; } 50% { transform: scale(1.2); opacity: 0.5; } }
          @keyframes ringSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes savedPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes heroShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
        `}</style>
        {targetUnitObj && (
          <Shield size={190} className="absolute -left-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05]" style={{ color: targetUnitObj.hex }} />
        )}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${targetUnitObj?.hex || "#10b981"}15, transparent)`, animation: "heroShimmer 3s ease-in-out 0.3s 1" }} />
        </div>
        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-3">
            <svg viewBox="0 0 120 120" className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" style={{ animation: "ringSpin 12s linear infinite" }}>
              <circle cx="60" cy="60" r="56" fill="none" stroke={targetUnitObj?.hex || "#10b981"} strokeWidth="1.5" strokeDasharray="6 8" opacity="0.5" />
            </svg>
            <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${targetUnitObj?.hex || "#10b981"}, ${targetUnitObj?.hex || "#10b981"}99)`, boxShadow: `0 8px 28px ${targetUnitObj?.hex || "#10b981"}55` }}>
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-black">{(profile.fullName || "?").trim().charAt(0) || "?"}</span>
              )}
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: targetUnitObj?.hex || "#10b981" }} />
            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: targetUnitObj?.hex || "#10b981" }} />
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: targetUnitObj?.hex || "#10b981" }} />
            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: targetUnitObj?.hex || "#10b981" }} />
            <label className="absolute bottom-0 left-0 w-9 h-9 rounded-full bg-black border-2 flex items-center justify-center cursor-pointer active:scale-90 transition" style={{ borderColor: targetUnitObj?.hex || "#3f3f46" }}>
              {uploadingPhoto ? <Loader2 size={15} className="text-zinc-300 animate-spin" /> : <Camera size={15} className="text-zinc-300" />}
              <input type="file" accept="image/*" className="hidden" disabled={uploadingPhoto} onChange={(e) => handlePhotoFile(e.target.files?.[0])} />
            </label>
          </div>

          {editingField === "fullName" ? (
            <div className="flex items-center gap-1.5 w-full max-w-[220px]">
              <input autoFocus value={fieldDraft} onChange={(e) => setFieldDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveField("fullName")} className="flex-1 bg-black border border-zinc-700 rounded-lg px-2.5 py-1.5 text-base text-zinc-100 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              <button onClick={() => saveField("fullName")} className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={13} className="text-black" /></button>
            </div>
          ) : (
            <button onClick={() => startEdit("fullName", profile.fullName)} className="flex items-center gap-1.5 group">
              <span className="text-xl font-black text-zinc-50">{profile.fullName || "ללא שם"}</span>
              {justSaved === "fullName" ? <Check size={13} className="text-emerald-400" style={{ animation: "savedPop 0.4s ease-out" }} /> : <Edit2 size={11} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition" />}
            </button>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            {targetUnitObj && (
              <span className="rounded-full px-3 py-1.5 text-[12px] font-bold border" style={{ borderColor: `${targetUnitObj.hex}60`, color: targetUnitObj.hex, backgroundColor: `${targetUnitObj.hex}15` }}>
                {targetUnitObj.name}
              </span>
            )}
            {profile.teamCode && (
              <span className="rounded-full px-3 py-1.5 text-[12px] font-bold border border-zinc-700 text-zinc-300 bg-black/60">
                {getTeamLabel(profile.teamCode)}
              </span>
            )}
            {profile.level && (
              <span className="rounded-full px-3 py-1.5 text-[12px] font-bold border border-zinc-700 text-zinc-300 bg-black/60">
                {profile.level}
              </span>
            )}
            {(profile.streakValue || 0) >= 7 && (
              <span className="rounded-full px-3 py-1.5 text-[12px] font-black border border-amber-500/50 text-amber-400 bg-amber-500/10 flex items-center gap-1">
                <Flame size={11} fill="#f59e0b" /> רצף {profile.streakValue >= 30 ? "אגדי" : profile.streakValue >= 14 ? "חזק" : "פעיל"}
              </span>
            )}
          </div>

          <button onClick={() => setStatsExpanded((s) => !s)} className="flex items-center gap-1 text-[11px] text-zinc-600 mt-3">
            {statsExpanded ? "הסתר נתונים" : "הצג נתונים"} <ChevronDown size={12} className={`transition ${statsExpanded ? "rotate-180" : ""}`} />
          </button>

          {statsExpanded && (profile.age || profile.height || profile.weight) && (
            <div className="flex items-center gap-2 mt-2 w-full">
              {[["age", "גיל", profile.age], ["height", "גובה (ס״מ)", profile.height], ["weight", "משקל (ק״ג)", profile.weight]].map(([field, label, val]) => (
                val != null && val !== "" ? (
                  <div key={field} className="flex-1 bg-black/50 border border-zinc-800 rounded-xl py-2.5 relative">
                    {editingField === field ? (
                      <div className="flex items-center justify-center gap-1 px-1">
                        <input autoFocus type="number" value={fieldDraft} onChange={(e) => setFieldDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveField(field)} className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1 py-0.5 text-sm text-zinc-100 text-center focus:outline-none" />
                        <button onClick={() => saveField(field)} className="text-emerald-400"><Check size={13} /></button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(field, val)} className="w-full">
                        <div className="text-lg font-black text-zinc-100 flex items-center justify-center gap-1">
                          {val}
                          {justSaved === field && <Check size={11} className="text-emerald-400" style={{ animation: "savedPop 0.4s ease-out" }} />}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-semibold">{label}</div>
                      </button>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          )}

          <button onClick={copyStats} className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 mt-3">
            {copiedStats ? <><Check size={11} className="text-emerald-400" /> <span className="text-emerald-400">הועתק</span></> : <><Copy size={11} /> העתק פרופיל</>}
          </button>
        </div>
      </div>

      {(() => {
        const days = user.createdAt ? Math.max(1, Math.ceil((new Date() - new Date(user.createdAt)) / 86400000)) : null;
        const motivationLine = targetUnitObj?.tagline || "כל יום שאתה מתאמן הוא יום שמקרב אותך ליעד";
        return (
          <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${targetUnitObj?.hex || "#10b981"}18, transparent 75%), var(--card-base-alt)`, boxShadow: `0 0 0 1px ${targetUnitObj?.hex || "#10b981"}30 inset` }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${targetUnitObj?.hex || "#10b981"}22` }}>
              <Sparkles size={16} style={{ color: targetUnitObj?.hex || "#10b981" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-zinc-200 leading-snug">{motivationLine}</div>
              {days && <div className="text-[11px] text-zinc-500 mt-0.5">{days} ימים בדרך שלך</div>}
            </div>
          </div>
        );
      })()}

      <div className="relative flex bg-zinc-900 rounded-2xl p-1 gap-1">
        {(() => {
          const tabs = ["profile", "settings", "about"];
          const idx = tabs.indexOf(profileView);
          return (
            <div
              className="absolute top-1 bottom-1 rounded-xl bg-emerald-500 transition-all duration-300 ease-out"
              style={{ width: "calc(33.333% - 3px)", right: `calc(${idx} * 33.333% + ${idx * 4}px + 4px)` }}
            />
          );
        })()}
        {[["profile", "פרופיל", User], ["settings", "הגדרות", GaugeIcon], ["about", "על המערכת", BookOpen]].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setProfileView(id)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition-colors duration-300 ${profileView === id ? "text-black" : "text-zinc-400"}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {profileView === "profile" && (
      <>
      <div className="relative rounded-3xl overflow-hidden p-5 mb-1" style={{ background: "#050505" }}>
        <style>{`
          @keyframes holoShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
          @keyframes blobMorph { 0%, 100% { border-radius: 42% 58% 65% 35% / 45% 40% 60% 55%; transform: scale(1) translate(0,0); } 33% { border-radius: 60% 40% 35% 65% / 55% 65% 35% 45%; transform: scale(1.08) translate(6px,-8px); } 66% { border-radius: 35% 65% 55% 45% / 40% 50% 50% 60%; transform: scale(0.96) translate(-6px,6px); } }
          @keyframes constellationDrift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes grainShiftUnit { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-2%, -1%); } }
          @keyframes letterReveal { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        {/* Liquid morphing blob */}
        <div className="absolute -right-10 -top-14 w-52 h-52 opacity-[0.16] pointer-events-none" style={{ background: `linear-gradient(135deg, ${heroHex}, #a855f7)`, animation: "blobMorph 9s ease-in-out infinite, holoShift 12s linear infinite" }} />
        {/* Constellation network background */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 300 140">
          {Array.from({ length: 9 }).map((_, i) => {
            const x1 = (i * 37 + 10) % 300, y1 = (i * 23 + 8) % 140;
            const x2 = ((i + 1) * 37 + 10) % 300, y2 = ((i + 1) * 23 + 8) % 140;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={heroHex} strokeWidth="0.5" />;
          })}
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={(i * 37 + 10) % 300} cy={(i * 23 + 8) % 140} r="1.6" fill={heroHex} style={{ animation: `constellationDrift ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite` }} />
          ))}
        </svg>
        {/* Film grain texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", animation: "grainShiftUnit 0.5s steps(2) infinite" }} />
        {/* Holographic iridescent ring around avatar */}
        <div className="relative flex items-center gap-3.5">
          <div className="relative w-16 h-16 shrink-0">
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, #10b981, #a855f7, #38bdf8, #f59e0b, #10b981)", animation: "holoShift 6s linear infinite", padding: 2 }}>
              <div className="w-full h-full rounded-full bg-black" />
            </div>
            <div className="absolute inset-[3px] rounded-full overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${heroHex}, ${heroHex}99)` }}>
              {profile.photoUrl ? <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-black text-black">{(profile.fullName || "?").trim().charAt(0)}</span>}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-black text-white flex flex-wrap">
              {(profile.fullName || "המתאמן/ת שלנו").split("").map((ch, i) => (
                <span key={i} style={{ animation: `letterReveal 0.4s ease-out ${i * 0.03}s both` }}>{ch === " " ? "\u00A0" : ch}</span>
              ))}
            </div>
            <div className="text-[12px] text-zinc-500">{profile.targetUnitName ? `בדרך ל${profile.targetUnitName}` : "בדרך לשירות משמעותי"}</div>
          </div>
        </div>
      </div>

      {(() => {
        const fields = [profile.fullName, profile.age, profile.height, profile.weight, profile.level, profile.teamCode];
        const filledCount = fields.filter(Boolean).length;
        const pct = Math.round((filledCount / fields.length) * 100);
        return (
          <div className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "linear-gradient(120deg, #10b98118, transparent 75%), var(--card-base-alt)", boxShadow: "0 0 0 1.5px #10b98140 inset" }}>
            <div className="relative w-11 h-11 shrink-0">
              <svg viewBox="0 0 44 44" className="-rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#3f3f4650" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${(pct / 100) * 113} 113`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease-out" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-emerald-400">{pct}%</div>
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-zinc-200">שלמות הפרופיל</div>
              <div className="text-[11px] text-zinc-500">{filledCount}/{fields.length} שדות מולאו</div>
            </div>
          </div>
        );
      })()}
      <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {[["personal-section", "פרטים", User], ["level-section", "כושר", GaugeIcon], ["team-section", "צוות", Users], ["gibush-section", "גיבוש", Clock]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" })} className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>
      {(() => {
        const badges = [
          { id: "b1", label: "צעד ראשון", icon: Footprints, unlocked: Boolean(profile.fullName) },
          { id: "b2", label: "נתונים מלאים", icon: ClipboardCheck, unlocked: Boolean(profile.age && profile.height && profile.weight) },
          { id: "b3", label: "יעד נבחר", icon: Target, unlocked: Boolean(profile.targetUnit) },
          { id: "b4", label: "בצוות", icon: Users, unlocked: Boolean(profile.teamCode) },
          { id: "b5", label: "רצף 7 ימים", icon: Flame, unlocked: (profile.streakValue || 0) >= 50 },
        ];
        return (
          <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {badges.map((b) => (
              <div key={b.id} className="shrink-0 flex flex-col items-center gap-1 w-16">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={b.unlocked ? { background: `linear-gradient(135deg, ${heroHex}, ${heroHex}90)`, boxShadow: `0 0 14px 1px ${heroHex}60` } : { backgroundColor: "#18181b", border: "1.5px dashed #3f3f46" }}
                >
                  {b.unlocked && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "loginShimmer 3s ease-in-out infinite" }} />
                    </div>
                  )}
                  <b.icon size={18} className={b.unlocked ? "text-black relative" : "text-zinc-700"} />
                </div>
                <span className={`text-[9px] font-bold text-center leading-tight ${b.unlocked ? "text-zinc-300" : "text-zinc-700"}`}>{b.label}</span>
              </div>
            ))}
          </div>
        );
      })()}

      <Card className="p-4" id="personal-section">
        <SectionTitle icon={User}>נתונים אישיים</SectionTitle>
        <div className="mb-3">
          <label className="text-[12px] text-zinc-500 font-semibold">שם מלא</label>
          <input value={profile.fullName || ""} onChange={(e) => updateProfile({ fullName: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["גיל", "age", ""], ["גובה", "height", "ס״מ"], ["משקל", "weight", 'ק"ג']].map(([label, key, unit]) => (
            <div key={key}>
              <label className="text-[12px] text-zinc-500 font-semibold">{label}</label>
              <input type="number" value={profile[key] || 0} onChange={(e) => updateProfile({ [key]: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-base text-zinc-100 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
              {unit && <div className="text-[11px] text-zinc-600 mt-0.5">{unit}</div>}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <SectionTitle icon={HeartPulse} tone="red">בדיקה רפואית</SectionTitle>
        <div className="flex gap-2">
          <button onClick={() => updateProfile({ healthy: true })} className={`flex-1 rounded-xl py-2.5 text-base font-bold border ${profile.healthy ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>בריא/ה</button>
          <button onClick={() => updateProfile({ healthy: false })} className={`flex-1 rounded-xl py-2.5 text-base font-bold border ${!profile.healthy ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>לא בריא/ה</button>
        </div>
        {!profile.healthy && (
          <div className="mt-2.5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {HEALTH_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => toggleIssue(opt)} className={`rounded-full px-3 py-1.5 text-sm font-bold border ${(profile.healthIssues || []).includes(opt) ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                  {opt}
                </button>
              ))}
            </div>
            {(profile.healthIssues || []).includes("אחר") && (
              <textarea value={profile.healthOtherNote || ""} onChange={(e) => updateProfile({ healthOtherNote: e.target.value })} placeholder="פרט/י..." rows={2} className="w-full bg-zinc-950 border border-red-500/30 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none" />
            )}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={Target} tone="amber">יעד קרבי</SectionTitle>
        {targetUnitObj && (
          <div className={`rounded-2xl px-4 py-4 bg-zinc-950 border-2 ${targetUnitObj.border} flex items-center justify-between`}>
            <div>
              <div className={`text-base font-black ${targetUnitObj.text}`}>{targetUnitObj.name}</div>
              <div className="text-[13px] text-zinc-500">{targetUnitObj.tagline}</div>
            </div>
            <Lock size={16} className="text-zinc-600" />
          </div>
        )}
        <div className="text-[12px] text-zinc-600 mt-2">היעד נקבע בהרשמה ואינו ניתן לשינוי עצמי</div>
      </Card>

      <style>{`
        @keyframes profFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes profDust { 0%, 100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(5px,-9px); opacity: 0.6; } }
        @keyframes profShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(250%) skewX(-15deg); } }
      `}</style>

      <div id="level-section" className="relative rounded-2xl overflow-hidden p-4 tech-grid tech-corners" style={{ background: "linear-gradient(150deg, #f59e0b16, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #f59e0b40 inset, 0 8px 20px -8px #f59e0b30", animation: "profFadeUp 0.35s ease-out 0s both" }}>
        <style>{`
          @keyframes profBorderSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes profIconRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes profTextGlow { 0%, 100% { text-shadow: 0 0 6px currentColor; } 50% { text-shadow: 0 0 12px currentColor; } }
          @keyframes profLineSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        `}</style>
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: "#f59e0b" }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="absolute rounded-full bg-amber-300 pointer-events-none" style={{ width: 2, height: 2, right: `${10 + i * 22}%`, top: `${15 + (i % 2) * 40}%`, opacity: 0.4, animation: `profDust ${4 + i}s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
        <div className="absolute top-0 right-0 w-0 h-0 pointer-events-none" style={{ borderStyle: "solid", borderWidth: "0 26px 26px 0", borderColor: "transparent #f59e0b transparent transparent", opacity: 0.35 }} />
        <span className="absolute top-1.5 left-3 text-[9px] font-mono font-black text-amber-500/40">01</span>
        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="relative w-9 h-9 shrink-0">
            <svg viewBox="0 0 36 36" className="absolute inset-0" style={{ animation: "profIconRing 6s linear infinite" }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="10 90" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="absolute inset-[3px] rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center">
              <GaugeIcon size={16} className="text-amber-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-black text-zinc-100" style={profile.level ? { color: "#fbbf24", animation: "profTextGlow 2.5s ease-in-out infinite" } : undefined}>רמת כושר</div>
            <div className="text-[11px] text-amber-500/70">{profile.level ? `נבחר: ${profile.level}` : "טרם נבחר"}</div>
          </div>
          {profile.level && <Check size={16} className="text-amber-400 shrink-0" />}
        </div>
        <div className="relative flex flex-wrap gap-1.5">
          {TIERS.map((t, i) => (
            <button key={t} onClick={() => updateProfile({ level: t })} className="relative rounded-full px-3 py-1.5 text-[13px] font-bold border transition-all duration-300 overflow-hidden" style={profile.level === t ? { backgroundColor: "#f59e0b22", borderColor: "#f59e0b", color: "#fbbf24", boxShadow: "0 0 10px 0 #f59e0b50", transform: "scale(1.05)" } : { backgroundColor: "#18181b", borderColor: "#3f3f46", color: "#a1a1aa" }}>
              {profile.level === t && <Check size={10} className="inline ml-1" />}
              {t}
            </button>
          ))}
        </div>
        <div className="relative h-px mt-3 overflow-hidden bg-amber-500/10 rounded-full">
          <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, #f59e0b, transparent)", animation: "profLineSweep 3s ease-in-out infinite" }} />
        </div>
      </div>

      <div id="team-section" className="relative rounded-2xl overflow-hidden p-4 tech-grid tech-corners" style={{ background: "linear-gradient(150deg, #10b98116, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #10b98140 inset, 0 8px 20px -8px #10b98130", animation: "profFadeUp 0.35s ease-out 0.06s both" }}>
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: "#10b981" }} />
        <div className="absolute top-0 right-0 w-0 h-0 pointer-events-none" style={{ borderStyle: "solid", borderWidth: "0 26px 26px 0", borderColor: "transparent #10b981 transparent transparent", opacity: 0.35 }} />
        <span className="absolute top-1.5 left-3 text-[9px] font-mono font-black text-emerald-500/40">02</span>
        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="relative w-9 h-9 shrink-0">
            <svg viewBox="0 0 36 36" className="absolute inset-0" style={{ animation: "profIconRing 6s linear infinite reverse" }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="10 90" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="absolute inset-[3px] rounded-xl bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center">
              <Users size={16} className="text-emerald-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-black text-emerald-400" style={{ animation: "profTextGlow 2.5s ease-in-out infinite" }}>צוות</div>
            <div className="text-[11px] text-emerald-500/70">מאומת בהרשמה</div>
          </div>
        </div>
        <div className="relative rounded-xl px-4 py-3.5 bg-black/40 border-2 flex items-center justify-between overflow-hidden" style={{ borderColor: "#10b98150" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-y-0 w-1/4" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.1), transparent)", animation: "profShimmer 3.5s ease-in-out 1s infinite" }} />
          </div>
          <div className="relative flex items-center gap-2">
            <div className="text-base font-black text-emerald-400">{profile.teamCode ? getTeamLabel(profile.teamCode) : "—"}</div>
            <button onClick={() => { navigator.clipboard?.writeText(String(profile.teamCode || "")); showToast?.("הועתק", "success"); }} className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Copy size={11} className="text-emerald-400" />
            </button>
          </div>
          <div className="relative w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
            <Lock size={13} className="text-zinc-500" />
          </div>
        </div>
        <div className="relative h-px mt-3 overflow-hidden bg-emerald-500/10 rounded-full">
          <div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)", animation: "profLineSweep 3s ease-in-out 0.5s infinite" }} />
        </div>
      </div>

      {allowedGibushTypes(profile).length > 0 && (() => {
        const gc = GIBUSH_TYPE_COLORS[profile.gibushType] || {};
        const ghex = gc.hex || "#f59e0b";
        const daysLeft = profile.gibushDate ? Math.ceil((new Date(`${profile.gibushDate}T00:00:00`) - new Date()) / 86400000) : null;
        return (
      <div id="gibush-section" className="relative rounded-2xl overflow-hidden p-4 tech-grid tech-corners" style={{ background: `linear-gradient(150deg, ${ghex}18, transparent 65%), var(--card-base)`, boxShadow: `0 0 0 1.5px ${ghex}45 inset, 0 8px 20px -8px ${ghex}30`, animation: "profFadeUp 0.35s ease-out 0.12s both" }}>
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: ghex, animation: "heroPulse 4s ease-in-out infinite" }} />
        <div className="absolute top-0 right-0 w-0 h-0 pointer-events-none" style={{ borderStyle: "solid", borderWidth: "0 26px 26px 0", borderColor: `transparent ${ghex} transparent transparent`, opacity: 0.35 }} />
        <span className="absolute top-1.5 left-3 text-[9px] font-mono font-black" style={{ color: `${ghex}70` }}>03</span>
        <div className="relative flex items-center gap-2.5 mb-3">
          <div className="relative w-9 h-9 shrink-0">
            <svg viewBox="0 0 36 36" className="absolute inset-0" style={{ animation: "profIconRing 6s linear infinite" }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke={ghex} strokeWidth="1.5" strokeDasharray="10 90" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="absolute inset-[3px] rounded-xl flex items-center justify-center border" style={{ backgroundColor: `${ghex}20`, borderColor: `${ghex}70` }}>
              <Clock size={16} style={{ color: ghex }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-black" style={{ color: ghex, animation: "profTextGlow 2.5s ease-in-out infinite" }}>מועד גיבוש</div>
            <div className="text-[11px]" style={{ color: `${ghex}c0` }}>{profile.gibushDate ? "מוגדר" : "טרם נקבע"}</div>
          </div>
          {daysLeft !== null && daysLeft >= 0 && (
            <span className="rounded-full text-[11px] font-black px-2.5 py-1 shrink-0" style={{ backgroundColor: `${ghex}22`, color: ghex }}>{daysLeft} ימים</span>
          )}
        </div>
        {profile.gibushDate && !editingGibush ? (
          <button
            onClick={() => { setGibushDraftDate(profile.gibushDate); setGibushDraftType(profile.gibushType); setEditingGibush(true); }}
            className="relative w-full rounded-xl px-4 py-4 bg-black border-2 flex items-center justify-between active:scale-[0.98] transition overflow-hidden"
            style={{ borderColor: ghex, boxShadow: `0 0 14px 0 ${ghex}30` }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-y-0 w-1/4" style={{ background: `linear-gradient(90deg, transparent, ${ghex}18, transparent)`, animation: "profShimmer 3.5s ease-in-out 0.5s infinite" }} />
            </div>
            <div className="relative text-right">
              <div className="text-base font-black" style={{ color: ghex }}>{profile.gibushType}</div>
              <div className="text-[13px] text-zinc-500">{new Date(`${profile.gibushDate}T00:00:00`).toLocaleDateString("he-IL")}</div>
            </div>
            <div className="relative text-[12px] text-zinc-600">לחץ/י לשינוי</div>
          </button>
        ) : (
          <>
            <label className="text-[12px] text-zinc-500 font-semibold mb-1.5 block">לאיזה גיבוש?</label>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {allowedGibushTypes(profile).map((t) => {
                const c = GIBUSH_TYPE_COLORS[t] || {};
                const sel = gibushDraftType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setGibushDraftType(t)}
                    className={`rounded-lg py-2 text-[13px] font-bold border-2 transition ${sel ? "bg-black" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
                    style={sel ? { borderColor: c.hex, color: c.hex, boxShadow: `0 0 8px 0 ${c.hex}40` } : undefined}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <label className="text-[12px] text-zinc-500 font-semibold mb-1.5 block">תאריך</label>
            <input type="date" value={gibushDraftDate} onChange={(e) => setGibushDraftDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
            <div className="flex gap-2 mt-3">
              {profile.gibushDate && (
                <GlowButton tone="ghost" className="flex-1" onClick={() => setEditingGibush(false)}>ביטול</GlowButton>
              )}
              <GlowButton tone="amber" className="flex-1" disabled={!gibushDraftDate || !gibushDraftType} onClick={() => { updateProfile({ gibushDate: gibushDraftDate, gibushType: gibushDraftType }); setEditingGibush(false); }}>
                שמור
              </GlowButton>
            </div>
          </>
        )}
      </div>
        );
      })()}
      </>
      )}

      {profileView === "settings" && (
      <>
      <Card className="p-4 relative overflow-hidden" style={profile.warMode ? { background: "linear-gradient(160deg, #dc262615, transparent 60%), var(--card-base)", boxShadow: "0 0 0 1.5px #dc262635 inset" } : undefined}>
        {profile.warMode && <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-25 bg-red-500" style={{ animation: "heroPulse 4s ease-in-out infinite" }} />}
        <SectionTitle icon={GaugeIcon}>הגדרות</SectionTitle>
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${profile.warMode ? "bg-red-500/20" : "bg-zinc-800"}`}>
                <Siren size={15} className={profile.warMode ? "text-red-400" : "text-zinc-500"} />
              </div>
              <div>
                <div className="text-base font-bold text-zinc-200">מצב מלחמה</div>
                <div className="text-[12px] text-zinc-600 mt-0.5">כשמופעל, דף הבית מוצג מלא בתוכנית החירום</div>
              </div>
            </div>
            <button
              onClick={() => (profile.warMode ? updateProfile({ warMode: false }) : setWarConfirmOpen(true))}
              className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${profile.warMode ? "bg-red-600" : "bg-zinc-700"}`}
              style={profile.warMode ? { boxShadow: "0 0 10px 1px rgba(220,38,38,0.6)" } : undefined}
            >
              <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${profile.warMode ? "right-0.5" : "right-5.5"}`} style={{ right: profile.warMode ? 2 : 22 }} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${profile.lightMode ? "bg-amber-500/20" : "bg-zinc-800"}`} style={{ transform: profile.lightMode ? "rotate(0deg)" : "rotate(180deg)" }}>
                {profile.lightMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-zinc-500" />}
              </div>
              <div>
                <div className="text-base font-bold text-zinc-200">מצב תצוגה</div>
                <div className="text-[12px] text-zinc-600 mt-0.5">{profile.lightMode ? "בהיר" : "כהה"}</div>
              </div>
            </div>
            <button
              onClick={() => updateProfile({ lightMode: !profile.lightMode })}
              className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${profile.lightMode ? "bg-amber-500" : "bg-zinc-700"}`}
              style={profile.lightMode ? { boxShadow: "0 0 10px 1px rgba(245,158,11,0.5)" } : undefined}
            >
              <span className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all" style={{ right: profile.lightMode ? 2 : 22 }} />
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${profile.customBgEnabled ? "bg-emerald-500/20" : "bg-zinc-800"}`}>
                  <ImageIcon size={15} className={profile.customBgEnabled ? "text-emerald-400" : "text-zinc-500"} />
                </div>
                <div>
                  <div className="text-base font-bold text-zinc-200">רקע אישי</div>
                  <div className="text-[12px] text-zinc-600 mt-0.5">תמונה משלכם כרקע לכל המסכים</div>
                </div>
              </div>
              <button
                onClick={() => updateProfile({ customBgEnabled: !profile.customBgEnabled })}
                className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${profile.customBgEnabled ? "bg-emerald-500" : "bg-zinc-700"}`}
                style={profile.customBgEnabled ? { boxShadow: "0 0 10px 1px rgba(16,185,129,0.5)" } : undefined}
              >
                <span className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all" style={{ right: profile.customBgEnabled ? 2 : 22 }} />
              </button>
            </div>
            {profile.customBgEnabled && (
              <div>
                {profile.customBgUrl && (
                  <div className="rounded-lg overflow-hidden mb-2" style={{ boxShadow: "0 0 0 2px #10b98150" }}>
                    <img src={profile.customBgUrl} alt="" className="w-full h-24 object-cover" />
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg py-3 cursor-pointer transition ${uploadingBg ? "border-zinc-700 text-zinc-600" : "border-zinc-700 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400"}`}>
                  {uploadingBg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  <span className="text-sm font-bold">{uploadingBg ? "מעלה..." : profile.customBgUrl ? "החליפו תמונה" : "העלו או צלמו תמונה"}</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploadingBg} onChange={(e) => handleBgFile(e.target.files?.[0])} />
                </label>
              </div>
            )}
          </div>
        </div>
      </Card>
      </>
      )}

      {profileView === "about" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden p-6 tech-grid" style={{ background: "linear-gradient(160deg, #10b98122, transparent 55%), var(--card-base)", boxShadow: "0 0 0 1px #10b98135 inset" }}>
            <div className="absolute -left-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-30 bg-emerald-500" />
            <div className="relative">
              <div className="text-2xl font-black text-zinc-50 mb-1.5">על המערכת</div>
              <div className="text-[13px] text-emerald-400 font-bold leading-relaxed">מערכת חדשנית וטכנולוגית שנבנתה במטרה להעניק לכל מתאמן בכושר קרבי את הכלים המתקדמים ביותר</div>
            </div>
          </div>

          {[
            { icon: Bot, hex: "#10b981", title: "AI מתקדם שמכיר אותך", text: "מנגנון בינה מלאכותית ייעודי המתמחה בכושר וההכנה הצבאית, מנתח את הנתונים, רמת הכושר והיעדים שלך, ומתאים את האימון הנכון ביותר - כוח, ריצה, סיבולת, הכנה לגיבושים. מבוסס על מחקרים ותובנות ממוסדות מחקר מובילים בישראל ובעולם." },
            { icon: BarChart3, hex: "#38bdf8", title: "לוח זמנים ומאגר מקצועי", text: "כל משתמש מקבל את לוח הזמנים השבועי שנבנה עבורו על ידי המאמן, לצד אפשרות להוסיף אימונים נוספים ממאגר עצום שנוצר במיוחד עבור עולם הכושר הקרבי - הכל במקום אחד, מסודר וברור." },
            { icon: Newspaper, hex: "#f59e0b", title: "תוכן שנכתב על ידי מי שהיה שם", text: "אחת לכמה ימים עולים תכנים חדשים - טיפים ותובנות שנכתבו על ידי מלש\"בים שעברו את הדרך והתקבלו ליחידות מיוחדות, לצד תוכן ערכי שעוזר להכיר לעומק את היחידות והגיבושים." },
            { icon: TrendingUp, hex: "#ef4444", title: "מעקב התקדמות אמיתי", text: "מדידות כוח, תוצאות ריצה ומבחני יכולת נשמרים ומוצגים בגרפים ברורים. מד העומס השבועי מנתח את רמת העומס המצטברת, ומד הרצף עוקב אחר ההתמדה - כמה אימונים בוצעו וכמה הגעה נשמרה." },
            { icon: Shield, hex: "#a78bfa", title: "המאמן רואה את התמונה המלאה", text: "בסוף כל חודש המאמן רואה את רמת ההשקעה של כל מתאמן, אחוזי הנוכחות והמחויבות שהוצגה - כי הצלחה בגיבושים לא נבנית ביום אחד, אלא מהרגלים קטנים והתמדה לאורך זמן." },
          ].map((box) => (
            <div key={box.title} className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${box.hex}15, transparent 60%), var(--card-base-alt)`, boxShadow: `0 0 0 1px ${box.hex}30 inset` }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${box.hex}20` }}>
                  <box.icon size={17} style={{ color: box.hex }} />
                </div>
                <div className="text-base font-black text-zinc-100">{box.title}</div>
              </div>
              <div className="text-[13px] text-zinc-400 leading-relaxed">{box.text}</div>
            </div>
          ))}

          <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #10b98118, transparent 60%), var(--card-base-alt)", boxShadow: "0 0 0 1px #10b98130 inset" }}>
            <div className="text-[14px] text-zinc-300 leading-relaxed font-semibold">המטרה שלנו: לא רק להכין מתאמנים חזקים יותר פיזית, אלא לבנות אנשים מוכנים יותר - עם ידע, משמעת, וחוסן מנטלי.</div>
          </div>
        </div>
      )}

      <GlowButton tone="ghost" icon={LogOut} className="w-full" onClick={() => setLogoutConfirmOpen(true)}>
        התנתקות
      </GlowButton>

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setLogoutConfirmOpen(false)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-4">
              <LogOut size={28} className="text-zinc-400 mb-2" />
              <div className="text-base font-black text-zinc-100">האם אתה בטוח שאתה רוצה לצאת מהמערכת?</div>
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setLogoutConfirmOpen(false)}>לא</GlowButton>
              <GlowButton tone="red" icon={LogOut} className="flex-1" onClick={onLogout}>כן</GlowButton>
            </div>
          </div>
        </div>
      )}

      {warConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setWarConfirmOpen(false)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-red-600/40 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-4">
              <Siren size={28} className="text-red-400 mb-2" />
              <div className="text-base font-black text-zinc-100">להפעיל מצב מלחמה?</div>
              <div className="text-sm text-zinc-500 mt-1.5">דף הבית שלך יוצג מלא בתוכנית חירום של 6 שבועות. אפשר לכבות בחזרה בכל רגע מכאן.</div>
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setWarConfirmOpen(false)}>ביטול</GlowButton>
              <GlowButton tone="red" icon={Siren} className="flex-1" onClick={() => { updateProfile({ warMode: true }); setWarConfirmOpen(false); }}>כן, בטוח/ה</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== ATTENDANCE TAB (TEAM LEADER) ============================== */

function AttendanceTab({ users, currentUser, officialEvents, showToast }) {
  const myTeamId = currentUser.profile?.teamCode || "";
  const [cadets, setCadets] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const todayEvent = officialEvents.find((e) => e.date === toKey(new Date()));

  useEffect(() => {
    const registered = users
      .filter((u) => (u.role === "trainee" || u.role === "team_leader") && u.onboarded && u.profile?.teamCode === myTeamId)
      .map((u) => ({ id: u.id, name: u.profile?.fullName || u.email.split("@")[0], present: false, isMe: u.id === currentUser.id }));
    setCadets(registered);
    setLoadingRoster(false);
  }, [users, myTeamId]);

  // ---- Monthly trainee evaluation (opens on the 30th, stays open until every
  // trainee on the roster has been evaluated - persists across sessions via Supabase) ----
  const monthKey = currentEvalMonthKey();
  const evalOpen = isEvalPeriodOpen();
  const [evaluatedIds, setEvaluatedIds] = useState([]);
  const [loadingEval, setLoadingEval] = useState(true);
  const [evaluatingTrainee, setEvaluatingTrainee] = useState(null);
  const [perfRating, setPerfRating] = useState(0);
  const [attitudeRating, setAttitudeRating] = useState(0);
  const [evalComments, setEvalComments] = useState("");
  const [submittingEval, setSubmittingEval] = useState(false);

  useEffect(() => {
    if (!evalOpen) { setLoadingEval(false); return; }
    loadMyEvaluationsRemote(currentUser.id, monthKey).then((ids) => {
      setEvaluatedIds(ids);
      setLoadingEval(false);
    });
  }, [currentUser.id, monthKey, evalOpen]);

  const evalRoster = cadets.filter((c) => !c.isMe);
  const pendingEval = evalRoster.filter((c) => !evaluatedIds.includes(c.id));

  function openEvaluation(trainee) {
    setEvaluatingTrainee(trainee);
    setPerfRating(0);
    setAttitudeRating(0);
    setEvalComments("");
  }

  async function submitEvaluation() {
    if (!perfRating || !attitudeRating) { showToast("נא לדרג את שני הקריטריונים", "error"); return; }
    setSubmittingEval(true);
    try {
      await submitTraineeEvaluationRemote({
        teamLeaderId: currentUser.id, traineeId: evaluatingTrainee.id, monthKey,
        performanceRating: perfRating, attitudeRating: attitudeRating, comments: evalComments.trim(),
      });
      setEvaluatedIds((prev) => [...prev, evaluatingTrainee.id]);
      showToast(`חוות הדעת על ${evaluatingTrainee.name} נשלחה למאמן`, "success");
      setEvaluatingTrainee(null);
    } catch (e) {
      showToast("שגיאה בשליחה", "error");
    } finally {
      setSubmittingEval(false);
    }
  }

  const presentCount = cadets.filter((c) => c.present).length;
  const pct = cadets.length ? Math.round((presentCount / cadets.length) * 100) : 0;

  async function submit() {
    setSubmitting(true);
    try {
      const dateKey = toKey(new Date());
      await submitAttendanceRemote({ teamId: myTeamId, eventId: todayEvent.id, date: dateKey, percentage: pct });
      await submitIndividualAttendanceRemote(
        cadets.map((c) => ({ id: `${todayEvent.id}_${c.id}`, eventId: todayEvent.id, date: dateKey, teamId: myTeamId, userId: c.id, present: c.present }))
      );
      showToast("נוכחות נשמרה בהצלחה", "success");
    } catch (e) {
      showToast("שגיאה בשמירה", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const RATING_LABELS = ["חלש", "מתחת לממוצע", "ממוצע", "טוב", "מצוין"];
  const evaluationModal = evaluatingTrainee && (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setEvaluatingTrainee(null)}>
      <div className="w-full sm:max-w-sm bg-zinc-950 border-2 border-violet-500/40 rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 text-violet-400 font-black text-base mb-1">
          <Star size={18} /> חוות דעת - {evaluatingTrainee.name}
        </div>
        <div className="text-[12px] text-zinc-500 mb-4">נשלח ישירות למאמן, לא ניתן לערוך אחרי שליחה</div>

        <label className="text-[13px] text-zinc-400 font-semibold mb-1.5 block">ביצועים פיזיים</label>
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setPerfRating(n)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold border transition ${perfRating >= n ? "bg-violet-500/20 border-violet-500 text-violet-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>{n}</button>
          ))}
        </div>
        {perfRating > 0 && <div className="text-[11px] text-violet-400/70 -mt-3 mb-3">{RATING_LABELS[perfRating - 1]}</div>}

        <label className="text-[13px] text-zinc-400 font-semibold mb-1.5 block">גישה ומחויבות</label>
        <div className="flex gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setAttitudeRating(n)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold border transition ${attitudeRating >= n ? "bg-violet-500/20 border-violet-500 text-violet-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>{n}</button>
          ))}
        </div>
        {attitudeRating > 0 && <div className="text-[11px] text-violet-400/70 -mt-3 mb-3">{RATING_LABELS[attitudeRating - 1]}</div>}

        <label className="text-[13px] text-zinc-400 font-semibold mb-1.5 block">הערות (אופציונלי)</label>
        <textarea value={evalComments} onChange={(e) => setEvalComments(e.target.value)} rows={3} placeholder="משהו שהמאמן צריך לדעת..." className="w-full mb-4 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40" />

        <div className="flex gap-2">
          <GlowButton tone="ghost" className="flex-1" onClick={() => setEvaluatingTrainee(null)}>ביטול</GlowButton>
          <GlowButton tone="emerald" icon={submittingEval ? Loader2 : Send} className="flex-1" disabled={submittingEval} onClick={submitEvaluation}>{submittingEval ? "שולח..." : "שלח למאמן"}</GlowButton>
        </div>
      </div>
    </div>
  );

  const evalSection = evalOpen && !loadingEval && evalRoster.length > 0 && (
    <div className="rounded-3xl overflow-hidden p-4 relative" style={{ background: "linear-gradient(160deg, #a78bfa25, transparent 60%), var(--card-base)", boxShadow: "0 0 0 1.5px #a78bfa45 inset" }}>
      <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full blur-3xl opacity-25 bg-violet-500" />
      <div className="relative flex items-center gap-2 mb-1">
        <Star size={16} className="text-violet-400" />
        <span className="text-base font-black text-zinc-100">חוות דעת חודשית על חניכים</span>
      </div>
      <div className="relative text-[12px] text-zinc-500 mb-3">
        {pendingEval.length > 0 ? `נותרו ${pendingEval.length} חניכים למילוי - נשלח ישירות למאמן` : "כל החניכים דורגו החודש - כל הכבוד!"}
      </div>
      {pendingEval.length > 0 && (
        <div className="relative space-y-1.5">
          {pendingEval.map((c) => (
            <button key={c.id} onClick={() => openEvaluation(c)} className="w-full flex items-center justify-between rounded-xl bg-black/40 px-3.5 py-2.5 active:scale-[0.98] transition">
              <span className="text-sm font-bold text-zinc-200">{c.name}</span>
              <ChevronLeft size={15} className="text-violet-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (!todayEvent) {
    return (
      <div className="p-4 space-y-4">
        {evalSection}
        <Card className="p-6 text-center">
          <ClipboardCheck size={28} className="text-zinc-600 mx-auto mb-2" />
          <div className="text-base text-zinc-400">אין אימון רשמי היום</div>
          <div className="text-sm text-zinc-600 mt-1">נוכחות ניתן לרשום רק כשהמאמן פרסם אימון לתאריך הנוכחי</div>
        </Card>
        {evaluationModal}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {evalSection}
      <Card className="p-4">
        <SectionTitle icon={ClipboardCheck} tone="amber">נוכחות - {todayEvent.title} {myTeamId && `(${getTeamLabel(myTeamId)})`}</SectionTitle>
        <div className="text-[12px] text-zinc-600 mb-3">הרשימה כוללת רק חניכים רשומים באמת בצוות שלך - אין אפשרות להוסיף שמות ידנית</div>
        {loadingRoster ? (
          <div className="text-center py-4 text-sm text-zinc-600">טוען...</div>
        ) : cadets.length === 0 ? (
          <div className="text-center py-4 text-sm text-zinc-600">אין עדיין חניכים רשומים בצוות שלך</div>
        ) : (
          <div className="space-y-1.5">
            {cadets.map((c) => (
              <div key={c.id} className={`flex items-center justify-between rounded-lg px-3 py-2 border ${c.isMe ? "bg-emerald-500/10 border-emerald-500/40" : "bg-zinc-950 border-zinc-800"}`}>
                <button onClick={() => setCadets((cs) => cs.map((x) => (x.id === c.id ? { ...x, present: !x.present } : x)))} className="flex items-center gap-2 flex-1">
                  <span className={`w-5 h-5 rounded flex items-center justify-center border ${c.present ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}>
                    {c.present && <Check size={13} className="text-black" />}
                  </span>
                  <span className="text-base text-zinc-200">{c.name}</span>
                  {c.isMe && <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 rounded-full px-2 py-0.5">אני</span>}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-zinc-300">אחוז נוכחות</span>
          <span className="text-2xl font-black text-emerald-400">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
        <GlowButton tone="emerald" icon={submitting ? Loader2 : Send} className="w-full" disabled={submitting || cadets.length === 0} onClick={submit}>
          {submitting ? "שולח..." : "שלח נוכחות"}
        </GlowButton>
      </Card>
      {evaluationModal}
    </div>
  );
}

/* ============================== MANAGEMENT TAB (ADMIN) ============================== */

const CONTENT_CATEGORIES = [
  { id: "unit_info", label: "תוכן ערכי" },
];
const TRAINING_SUBCATS = TRAINING_BANK.map((b) => [b.id, b.title]);
const UNIT_INFO_SUBCATS = [["ערכים", "ערכים"]];

/* ============================== COACH HOME (teams, members, push training, appoint leaders) ============================== */

function CoachHomeTab({ users, toggleTeamLeader, toggleAdmin, togglePaymentConfirmed, addOfficialEvent, officialEvents, removeOfficialEvent, showToast, onLogout }) {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [openTeam, setOpenTeam] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [search, setSearch] = useState("");
  const [eventForm, setEventForm] = useState({ date: "", title: "", time: "", endTime: "", location: "" });
  const [pushing, setPushing] = useState(false);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState(null);
  const [injectForm, setInjectForm] = useState(null); // { date, time, title, detail }
  const [injecting, setInjecting] = useState(false);

  const roster = users.filter((u) => u.role !== "admin");
  const teamGroups = TEAM_LIST.map((t) => ({ ...t, members: roster.filter((u) => u.onboarded && u.profile?.teamCode === t.id) }));

  function leaderCountFor(teamId) {
    return roster.filter((u) => u.profile?.teamCode === teamId && u.role === "team_leader").length;
  }

  async function injectWorkout(member) {
    if (!injectForm?.date || !injectForm?.title?.trim()) { showToast("נא למלא תאריך וכותרת", "error"); return; }
    setInjecting(true);
    try {
      await addPersonalLogRemote(member.id, { id: Date.now(), date: injectForm.date, time: injectForm.time || "", title: injectForm.title.trim(), detail: injectForm.detail?.trim() || "" });
      showToast("האימון נוסף ליומן האישי של החניך/ה", "success");
      setInjectForm(null);
    } catch (e) {
      showToast("שגיאה בהוספה", "error");
    } finally {
      setInjecting(false);
    }
  }

  function handleMakeLeader(member) {
    const teamId = member.profile?.teamCode;
    if (member.role !== "team_leader" && leaderCountFor(teamId) >= 3) {
      showToast("הגעתם למכסה של 3 ראשי צוות לצוות זה", "error");
      return;
    }
    toggleTeamLeader(member.id);
    setViewingMember((prev) => (prev ? { ...prev, role: prev.role === "team_leader" ? "trainee" : "team_leader" } : prev));
  }

  function pushEvent() {
    if (!eventForm.date || !eventForm.title.trim()) { showToast("נא למלא תאריך וכותרת", "error"); return; }
    setPushing(true);
    addOfficialEvent({ id: Date.now(), ...eventForm });
    setEventForm({ date: "", title: "", time: "", endTime: "", location: "" });
    setPushing(false);
    showToast("האימון נוסף ליומני כל החניכים", "success");
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: "radial-gradient(ellipse 130% 100% at 30% -20%, #dc262635, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #dc262630 inset" }}>
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30" style={{ backgroundColor: "#dc2626", animation: "coachHeroPulse 4s ease-in-out infinite" }} />
        <style>{`
          @keyframes coachHeroPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.25); opacity: 0.45; }
          }
        `}</style>
        <div className="relative flex items-center gap-2">
          <Shield size={16} className="text-red-400" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-red-400">ממשק מאמן</span>
        </div>
        <div className="relative text-2xl font-black text-zinc-50 mt-1">בית - מאמן</div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="relative overflow-hidden rounded-2xl p-3 text-center tech-grid" style={{ background: "linear-gradient(160deg, #dc262625, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1px #dc262640 inset" }}>
          <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-30 bg-red-500" />
          <div className="relative text-2xl font-black text-red-400 font-mono tabular-nums">{roster.filter((u) => u.onboarded).length}</div>
          <div className="relative text-[11px] text-zinc-500 font-semibold mt-0.5">חניכים</div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-3 text-center tech-grid" style={{ background: "linear-gradient(160deg, #10b98125, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1px #10b98140 inset" }}>
          <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-30 bg-emerald-500" />
          <div className="relative text-2xl font-black text-emerald-400 font-mono tabular-nums">{teamGroups.filter((t) => t.members.length > 0).length}</div>
          <div className="relative text-[11px] text-zinc-500 font-semibold mt-0.5">צוותים פעילים</div>
        </div>
        <div className="relative overflow-hidden rounded-2xl p-3 text-center tech-grid" style={{ background: "linear-gradient(160deg, #f59e0b25, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1px #f59e0b40 inset" }}>
          <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-30 bg-amber-500" />
          <div className="relative text-2xl font-black text-amber-400 font-mono tabular-nums">{(officialEvents || []).filter((e) => e.date >= toKey(new Date())).length}</div>
          <div className="relative text-[11px] text-zinc-500 font-semibold mt-0.5">אימונים קרובים</div>
        </div>
      </div>

      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש מהיר של חניך..."
          className="w-full bg-black border border-zinc-700 rounded-xl pr-10 pl-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all duration-300"
        />
        <Compass size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        {search.trim() && (
          <div className="absolute top-full mt-1.5 w-full bg-zinc-950 border border-red-500/30 rounded-xl overflow-hidden z-10 max-h-56 overflow-y-auto">
            {(() => {
              const q = search.trim().toLowerCase();
              const matches = roster.filter((u) => (u.profile?.fullName || u.email || "").toLowerCase().includes(q));
              return matches.length === 0 ? (
                <div className="text-[13px] text-zinc-600 text-center py-3">אין תוצאות</div>
              ) : (
                matches.slice(0, 8).map((m) => (
                  <button key={m.id} onClick={() => { setViewingMember(m); setSearch(""); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-zinc-900 transition">
                    <div className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                      {m.profile?.photoUrl ? <img src={m.profile.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-[11px] font-black text-red-400">{(m.profile?.fullName || m.email || "?").trim().charAt(0)}</span>}
                    </div>
                    <span className="text-sm font-bold text-zinc-200 flex-1 text-right">{m.profile?.fullName || m.email}</span>
                    <span className="text-[11px] text-zinc-600">צוות {m.profile?.teamCode || "-"}</span>
                  </button>
                ))
              );
            })()}
          </div>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {teamGroups.filter((t) => t.members.length > 0).map((t) => (
          <button
            key={t.id}
            onClick={() => setOpenTeam(openTeam === t.id ? null : t.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold border transition ${openTeam === t.id ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}
          >
            {t.label} · {t.members.length}
          </button>
        ))}
      </div>

      <Card className="p-4">
        <SectionTitle icon={Users} tone="red">צוותים</SectionTitle>
        <div className="space-y-1.5">
          {teamGroups.map((t) => {
            const maxMembers = Math.max(1, ...teamGroups.map((g) => g.members.length));
            const fillPct = Math.round((t.members.length / maxMembers) * 100);
            return (
            <div key={t.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <button onClick={() => setOpenTeam(openTeam === t.id ? null : t.id)} className="w-full flex items-center justify-between px-3.5 py-2.5">
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base font-bold text-zinc-200">{t.label}</span>
                    <div className="flex items-center gap-2">
                      <Pill tone="zinc">{t.members.length} חברים</Pill>
                      <ChevronDown size={14} className={`text-zinc-500 transition ${openTeam === t.id ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  {t.members.length > 0 && (
                    <div className="h-1 rounded-full bg-zinc-900 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500/60" style={{ width: `${fillPct}%` }} />
                    </div>
                  )}
                </div>
              </button>
              {openTeam === t.id && (
                <div className="px-3 pb-3 space-y-1">
                  {t.members.length === 0 ? (
                    <div className="text-[13px] text-zinc-600 px-1">אין עדיין חברים בצוות זה</div>
                  ) : (
                    t.members.map((m) => (
                      <button key={m.id} onClick={() => { setViewingMember(m); setInjectForm(null); }} className="w-full flex items-center gap-2.5 bg-zinc-900 rounded-lg px-3 py-2 hover:border-red-500/40 border border-transparent transition">
                        <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 overflow-hidden">
                          {m.profile?.photoUrl ? <img src={m.profile.photoUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-black text-red-400">{(m.profile?.fullName || m.email || "?").trim().charAt(0)}</span>}
                        </div>
                        <span className="text-sm font-bold text-zinc-300 flex-1 text-right">{m.profile?.fullName || m.email}</span>
                        {m.role === "team_leader" && <Pill tone="amber">ראש צוות</Pill>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 tech-grid tech-corners border border-amber-500/25">
        <SectionTitle icon={CalendarDays} tone="amber">פרסום אימון שבועי ליומני החניכים</SectionTitle>
        <div className="grid grid-cols-3 gap-2 mb-2.5">
          <div>
            <label className="text-[11px] text-zinc-500 font-semibold block mb-1">תאריך</label>
            <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="w-full bg-black border border-amber-500/30 rounded-lg px-2 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 font-semibold block mb-1">משעה</label>
            <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="w-full bg-black border border-amber-500/30 rounded-lg px-2 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 font-semibold block mb-1">עד שעה</label>
            <input type="time" value={eventForm.endTime} onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })} className="w-full bg-black border border-amber-500/30 rounded-lg px-2 py-2.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
          </div>
        </div>
        <div className="text-[12px] text-amber-400/70 mb-2.5 flex items-center gap-1.5">
          <Clock size={12} /> משוב האימון ייפתח לחניכים 3 שעות מרגע הסיום
        </div>
        <input placeholder="סוג אימון (לדוגמה: דיונות)" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full mb-2.5 bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
        <input placeholder="מיקום" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full mb-3 bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
        <GlowButton tone="amber" icon={pushing ? Loader2 : Plus} className="w-full" disabled={pushing} onClick={pushEvent}>הוסף ליומן כל החניכים</GlowButton>
      </Card>

      <Card className="p-4 tech-grid">
        <SectionTitle icon={CalendarDays} tone="red">אימונים קרובים</SectionTitle>
        {(() => {
          const upcoming = (officialEvents || []).filter((e) => e.date >= toKey(new Date())).sort((a, b) => (a.date < b.date ? -1 : 1));
          return upcoming.length === 0 ? (
            <div className="text-sm text-zinc-600 text-center py-3">אין אימונים קרובים מתוכננים</div>
          ) : (
            <div className="relative space-y-2.5 pr-4">
              <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-red-500/20" />
              {upcoming.map((ev) => {
                const uploader = users.find((u) => u.id === ev.createdBy);
                const isToday = ev.date === toKey(new Date());
                return (
                  <div key={ev.id} className="relative flex items-start gap-3">
                    <span className={`absolute right-[-19px] top-1.5 w-3 h-3 rounded-full border-2 ${isToday ? "bg-red-500 border-red-400 glow-pulse" : "bg-black border-red-500/50"}`} style={isToday ? glowVars("#ef4444") : undefined} />
                    <div className="flex-1 rounded-xl p-3" style={{ background: "linear-gradient(120deg, #dc262615, transparent 70%), var(--card-base-alt)", boxShadow: "0 0 0 1px #dc262625 inset" }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-bold text-red-400 tabular-nums">{ev.date}{ev.time ? ` · ${ev.time}` : ""}</span>
                          {isToday && <span className="text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full px-1.5 py-0.5">היום</span>}
                        </div>
                        <button onClick={() => setConfirmDeleteEvent(ev)} className="text-zinc-600 hover:text-red-400 p-1 shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="text-[14px] font-bold text-zinc-100">{ev.title}</div>
                      <div className="text-[11px] text-emerald-500/80 mt-0.5">הועלה ע״י {uploader?.profile?.fullName || uploader?.email || "-"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Card>

      {confirmDeleteEvent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setConfirmDeleteEvent(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border-2 border-red-500/40 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-red-400 font-black text-base mb-2">
              <Trash2 size={18} /> ביטול אימון
            </div>
            <div className="text-sm text-zinc-400 mb-2">
              לבטל את <span className="font-bold text-zinc-200">{confirmDeleteEvent.title}</span> בתאריך {confirmDeleteEvent.date}? הפעולה תמחק אותו מיומני כל החניכים ולא ניתן לשחזר אותה.
            </div>
            <div className={`text-[12px] rounded-lg px-2.5 py-2 mb-4 ${eventHasEnded(confirmDeleteEvent) ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
              {eventHasEnded(confirmDeleteEvent) ? "האימון כבר הסתיים - נתוני הנוכחות שנרשמו יישארו." : "האימון עוד לא הסתיים - נתוני הנוכחות שנרשמו לו יימחקו יחד איתו."}
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setConfirmDeleteEvent(null)}>ביטול</GlowButton>
              <GlowButton tone="red" icon={Trash2} className="flex-1" onClick={() => { removeOfficialEvent(confirmDeleteEvent); showToast("האימון בוטל", "success"); setConfirmDeleteEvent(null); }}>מחק</GlowButton>
            </div>
          </div>
        </div>
      )}

      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => { setViewingMember(null); setInjectForm(null); }}>
          <div className="w-full sm:max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-base font-black text-zinc-100">{viewingMember.profile?.fullName || viewingMember.email}</div>
              <button onClick={() => { setViewingMember(null); setInjectForm(null); }} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
            </div>
            <div className="space-y-2 text-sm text-zinc-400 mb-4">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">אימייל</span><span dir="ltr">{viewingMember.email}</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">גיל</span><span>{viewingMember.profile?.age || "—"}</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">גובה / משקל</span><span>{viewingMember.profile?.height || "—"} ס״מ / {viewingMember.profile?.weight || "—"} ק״ג</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">רמת כושר</span><span>{viewingMember.profile?.level || "—"}</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">יעד קרבי</span><span>{viewingMember.profile?.targetUnitName || "—"}</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">בעיות בריאות</span><span>{(viewingMember.profile?.healthIssues || []).join(", ") || "אין"}</span></div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">צוות</span><span>{viewingMember.profile?.teamCode || "—"}</span></div>
              {viewingMember.profile?.gibushDate && (
                <div className="flex justify-between border-b border-zinc-900 pb-1.5"><span className="text-zinc-600">{viewingMember.profile?.gibushType}</span><span>{viewingMember.profile.gibushDate}</span></div>
              )}
            </div>

            {injectForm ? (
              <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-3 mb-2 space-y-2">
                <div className="text-sm font-bold text-emerald-400">הוספת אימון ליומן האישי</div>
                <input type="date" value={injectForm.date} onChange={(e) => setInjectForm({ ...injectForm, date: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                <input placeholder="שעה (אופציונלי)" value={injectForm.time} onChange={(e) => setInjectForm({ ...injectForm, time: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                <input placeholder="כותרת האימון" value={injectForm.title} onChange={(e) => setInjectForm({ ...injectForm, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                <input placeholder="פירוט (אופציונלי)" value={injectForm.detail} onChange={(e) => setInjectForm({ ...injectForm, detail: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
                <div className="flex gap-2">
                  <GlowButton tone="ghost" className="flex-1" onClick={() => setInjectForm(null)}>ביטול</GlowButton>
                  <GlowButton tone="emerald" icon={injecting ? Loader2 : Plus} className="flex-1" disabled={injecting} onClick={() => injectWorkout(viewingMember)}>הוסף</GlowButton>
                </div>
              </div>
            ) : (
              <GlowButton tone="emerald" icon={Plus} className="w-full mb-2" onClick={() => setInjectForm({ date: toKey(new Date()), time: "", title: "", detail: "" })}>
                הוסף אימון ליומן החניך/ה
              </GlowButton>
            )}

            <GlowButton tone={viewingMember.role === "team_leader" ? "ghost" : "amber"} icon={ClipboardCheck} className="w-full mb-2" onClick={() => handleMakeLeader(viewingMember)}>
              {viewingMember.role === "team_leader" ? "הסר מתפקיד ראש צוות" : "סמן כראש צוות"}
            </GlowButton>
            {viewingMember.requiresPayment && (
              <GlowButton tone={viewingMember.paymentStatus === "confirmed" ? "ghost" : "emerald"} icon={viewingMember.paymentStatus === "confirmed" ? X : Check} className="w-full mb-2" onClick={() => togglePaymentConfirmed(viewingMember.id)}>
                {viewingMember.paymentStatus === "confirmed" ? "בטל אישור תשלום" : "אשר תשלום (9₪ התקבלו)"}
              </GlowButton>
            )}
            <button onClick={() => toggleAdmin(viewingMember.id)} className="w-full text-center text-[13px] text-red-400/70 hover:text-red-400 py-1">
              מנה למאמן
            </button>
          </div>
        </div>
      )}

      <GlowButton tone="ghost" icon={LogOut} className="w-full" onClick={() => setLogoutConfirmOpen(true)}>
        התנתקות
      </GlowButton>

      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setLogoutConfirmOpen(false)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-4">
              <LogOut size={28} className="text-zinc-400 mb-2" />
              <div className="text-base font-black text-zinc-100">האם אתה בטוח שאתה רוצה לצאת מהמערכת?</div>
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setLogoutConfirmOpen(false)}>לא</GlowButton>
              <GlowButton tone="red" icon={LogOut} className="flex-1" onClick={onLogout}>כן</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== COACH CALENDARS (trainee monitoring by team) ============================== */

function CoachCalendarsTab({ users }) {
  const [openTeam, setOpenTeam] = useState(null);
  const [viewingTrainee, setViewingTrainee] = useState(null);
  const [traineeLogs, setTraineeLogs] = useState([]);
  const [loadingTraineeLogs, setLoadingTraineeLogs] = useState(false);

  const roster = users.filter((u) => u.role !== "admin" && u.onboarded);
  const teamGroups = TEAM_LIST.map((t) => ({ ...t, members: roster.filter((u) => u.profile?.teamCode === t.id) }));

  async function openTraineeCalendar(trainee) {
    setViewingTrainee(trainee);
    setLoadingTraineeLogs(true);
    const logs = await loadPersonalLogsRemote(trainee.id);
    setTraineeLogs(logs.sort((a, b) => (a.date < b.date ? 1 : -1)));
    setLoadingTraineeLogs(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-black text-zinc-100">יומני מתאמנים</div>
      <div className="text-[13px] text-zinc-600 -mt-2">בדיקת עומס אימונים אישי לפי צוות - לזיהוי מתאמנים שמתאמנים יותר מדי</div>

      <div className="space-y-1.5">
        {teamGroups.map((t) => (
          <Card key={t.id} className="overflow-hidden p-0">
            <button onClick={() => setOpenTeam(openTeam === t.id ? null : t.id)} className="w-full flex items-center justify-between px-3.5 py-2.5">
              <span className="text-base font-bold text-zinc-200">{t.label}</span>
              <div className="flex items-center gap-2">
                <Pill tone="zinc">{t.members.length} חברים</Pill>
                <ChevronDown size={14} className={`text-zinc-500 transition ${openTeam === t.id ? "rotate-180" : ""}`} />
              </div>
            </button>
            {openTeam === t.id && (
              <div className="px-3 pb-3 space-y-1">
                {t.members.length === 0 ? (
                  <div className="text-[13px] text-zinc-600 px-1">אין עדיין חברים בצוות זה</div>
                ) : (
                  t.members.map((m) => (
                    <button key={m.id} onClick={() => openTraineeCalendar(m)} className="w-full flex items-center justify-between bg-zinc-950 rounded-lg px-3 py-2 hover:border-red-500/40 border border-zinc-800 transition">
                      <span className="text-sm font-bold text-zinc-300">{m.profile?.fullName || m.email}</span>
                      <CalendarDays size={13} className="text-zinc-600" />
                    </button>
                  ))
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {viewingTrainee && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setViewingTrainee(null)}>
          <div className="w-full sm:max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-base font-black text-zinc-100">{viewingTrainee.profile?.fullName || viewingTrainee.email}</div>
              <button onClick={() => setViewingTrainee(null)} className="text-zinc-500 hover:text-zinc-300"><X size={18} /></button>
            </div>
            {loadingTraineeLogs ? (
              <div className="text-center py-6 text-sm text-zinc-600">טוען...</div>
            ) : traineeLogs.length === 0 ? (
              <div className="text-center py-6 text-sm text-zinc-600">המתאמן/ת עדיין לא הוסיף/ה אירועים אישיים ליומן</div>
            ) : (
              <div className="space-y-1.5">
                {traineeLogs.map((l) => (
                  <div key={l.id} className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-200">{l.title}</span>
                      <span className="text-[12px] text-zinc-500">{l.date} {l.time || ""}</span>
                    </div>
                    {l.detail && <div className="text-[13px] text-zinc-500 mt-0.5">{l.detail}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== COACH FEEDBACK (attendance %, end-of-training feedback, monthly leaderboard) ============================== */

function CoachFeedbackTab({ users, officialEvents, showToast }) {
  const [openEventId, setOpenEventId] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [individualAttendance, setIndividualAttendance] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [openEvalId, setOpenEvalId] = useState(null);

  useEffect(() => {
    (async () => {
      setFeedbackList(await loadFeedbackRemote());
      setLoadingFeedback(false);
      setAttendanceReports(await loadAttendanceReportsRemote());
      setIndividualAttendance(await loadAllIndividualAttendance());
      setEvaluations(await loadAllEvaluationsRemote());
    })();
  }, []);

  async function approveFeedback(id) {
    await approveFeedbackRemote(id);
    setFeedbackList((prev) => prev.map((f) => (f.id === id ? { ...f, status: "approved" } : f)));
    showToast("המשוב אושר", "success");
  }

  function nameOf(userId) {
    const u = users.find((x) => x.id === userId);
    return u ? u.profile?.fullName || u.email : "משתמש לא ידוע";
  }

  // The "kind word" feedback field is one free-text message that names a teammate
  // and praises them together (e.g. "אלון עזר לי היום, תמיד תומך בכולם"). To build
  // a real kudos leaderboard, we match each message against that team's actual
  // roster - checking each member's first name as a whole word, not a substring,
  // so "דן" doesn't false-match inside "דניאל".
  function matchKudosRecipient(text, teamId) {
    if (!text || !teamId) return null;
    const roster = users.filter((u) => (u.role === "trainee" || u.role === "team_leader") && u.profile?.teamCode === teamId && u.profile?.fullName);
    for (const member of roster) {
      const firstName = member.profile.fullName.trim().split(/\s+/)[0];
      if (!firstName) continue;
      const re = new RegExp(`(^|\\s)${firstName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`);
      if (re.test(text)) return member;
    }
    return null;
  }

  const kudosCounts = {};
  feedbackList
    .filter((f) => f.kindWord?.text)
    .forEach((f) => {
      const recipient = matchKudosRecipient(f.kindWord.text, f.kindWord.team);
      if (recipient) kudosCounts[recipient.id] = (kudosCounts[recipient.id] || 0) + 1;
    });
  const kudosLeaderboard = Object.entries(kudosCounts)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyCounts = {};
  individualAttendance
    .filter((r) => r.present && r.date && r.date.startsWith(monthKey))
    .forEach((r) => { monthlyCounts[r.userId] = (monthlyCounts[r.userId] || 0) + 1; });
  const leaderboard = Object.entries(monthlyCounts)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Attendance aggregated per team, across all recorded events - not per-event like
  // the log below, but a single clear "how is each team doing overall" snapshot.
  const teamAttendance = {};
  individualAttendance.forEach((r) => {
    const key = String(r.teamId);
    if (!teamAttendance[key]) teamAttendance[key] = { present: 0, total: 0 };
    teamAttendance[key].total += 1;
    if (r.present) teamAttendance[key].present += 1;
  });
  const teamAttendanceRows = Object.entries(teamAttendance)
    .map(([teamId, { present, total }]) => ({ teamId, present, total, pct: total ? Math.round((present / total) * 100) : 0 }))
    .sort((a, b) => Number(a.teamId) - Number(b.teamId));

  return (
    <div className="p-4 space-y-4">
      <div className="text-lg font-black text-zinc-100">מה שהתקבל</div>

      <Card className="p-4">
        <SectionTitle icon={Users} tone="emerald">הגעה לפי צוות</SectionTitle>
        {teamAttendanceRows.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">אין עדיין נתוני נוכחות</div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {teamAttendanceRows.map((row) => (
              <div key={row.teamId} className="rounded-2xl p-3.5" style={{ background: `linear-gradient(140deg, ${row.pct >= 75 ? "#10b981" : row.pct >= 50 ? "#f59e0b" : "#ef4444"}20, transparent 70%), var(--card-base-alt)` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-bold text-zinc-300">צוות {row.teamId}</span>
                  <span className="text-lg font-black" style={{ color: row.pct >= 75 ? "#10b981" : row.pct >= 50 ? "#f59e0b" : "#ef4444" }}>{row.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.pct >= 75 ? "#10b981" : row.pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">{row.present} מתוך {row.total} סימוני נוכחות</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={CalendarDays} tone="amber">לוח האימונים שפרסמת</SectionTitle>
        {officialEvents.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">עדיין לא פרסמת אימונים</div>
        ) : (
          <div className="space-y-1.5">
            {officialEvents.map((ev) => {
              const reports = attendanceReports.filter((r) => r.eventId === ev.id);
              return (
                <div key={ev.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenEventId(openEventId === ev.id ? null : ev.id)} className="w-full flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-sm font-bold text-zinc-200">{ev.title} · {ev.date}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition ${openEventId === ev.id ? "rotate-180" : ""}`} />
                  </button>
                  {openEventId === ev.id && (
                    <div className="px-4 pb-3">
                      {reports.length === 0 ? (
                        <div className="text-[13px] text-zinc-600">ראשי הצוות עדיין לא סימנו נוכחות לאימון זה</div>
                      ) : (
                        <div className="space-y-1">
                          {reports.map((r, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-400">צוות {r.teamId}</span>
                              <Pill tone="emerald">{r.percentage}%</Pill>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={Star} tone="amber">חוות דעת ראשי צוות</SectionTitle>
        <div className="text-[12px] text-zinc-600 mb-3">נשלח ישירות מראשי הצוות, אחת לחודש</div>
        {evaluations.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">עדיין לא התקבלו חוות דעת</div>
        ) : (
          <div className="space-y-1.5">
            {evaluations.map((ev) => {
              const trainee = users.find((u) => u.id === ev.traineeId);
              const leader = users.find((u) => u.id === ev.teamLeaderId);
              const isOpen = openEvalId === ev.id;
              const avgRating = ((ev.performanceRating + ev.attitudeRating) / 2).toFixed(1);
              return (
                <div key={ev.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenEvalId(isOpen ? null : ev.id)} className="w-full flex items-center justify-between px-3.5 py-2.5">
                    <div className="text-right">
                      <div className="text-sm font-bold text-zinc-200">{trainee?.profile?.fullName || trainee?.email || "משתמש לא ידוע"}</div>
                      <div className="text-[11px] text-zinc-600">{ev.monthKey} · ע״י {leader?.profile?.fullName || leader?.email || "-"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone="amber">{avgRating}/5</Pill>
                      <ChevronDown size={14} className={`text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-zinc-500">ביצועים פיזיים</span>
                        <span className="font-bold text-zinc-300">{ev.performanceRating}/5</span>
                      </div>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-zinc-500">גישה ומחויבות</span>
                        <span className="font-bold text-zinc-300">{ev.attitudeRating}/5</span>
                      </div>
                      {ev.comments && <div className="text-[13px] text-zinc-400 pt-1.5 border-t border-zinc-800 mt-1.5">{ev.comments}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={ClipboardCheck} tone="amber">משובי סוף אימון</SectionTitle>
        {(() => {
          const realFeedback = feedbackList.filter((f) => f.opinion?.trim());
          return loadingFeedback ? (
            <div className="text-sm text-zinc-600 text-center py-3">טוען...</div>
          ) : realFeedback.length === 0 ? (
            <div className="text-sm text-zinc-600 text-center py-3">עדיין לא התקבלו משובים</div>
          ) : (
            <div className="space-y-2">
              {realFeedback.map((f) => (
                <div key={f.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-zinc-200">{f.firstName} · צוות {f.teamCode}</span>
                  {f.status === "approved" ? <Pill tone="emerald">אושר</Pill> : <Pill tone="amber">חדש</Pill>}
                </div>
                <div className="text-[13px] text-zinc-500 mb-1">מאמן: {f.coach} · ציון: {f.valueRating}/5 · המלצה: {f.recommendRating}/5</div>
                <div className="text-sm text-zinc-400">{f.opinion}</div>
                {f.status !== "approved" && (
                  <button onClick={() => approveFeedback(f.id)} className="mt-2 text-[13px] font-bold text-emerald-400 hover:text-emerald-300">סמן כנקרא</button>
                )}
                </div>
              ))}
            </div>
          );
        })()}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={TrendingUp} tone="amber">הכי הרבה אימונים החודש</SectionTitle>
        <div className="text-[12px] text-zinc-600 mb-3">מתאפס בכל חודש - לפי נוכחות שראשי הצוות סימנו</div>
        {leaderboard.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">אין עדיין נתוני נוכחות החודש</div>
        ) : (
          <div className="space-y-1.5">
            {leaderboard.map((row, i) => {
              const medal = i === 0 ? "#fbbf24" : i === 1 ? "#d4d4d8" : i === 2 ? "#b45309" : null;
              return (
                <div key={row.userId} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${medal ? "bg-black" : "bg-zinc-950 border-zinc-800"}`} style={medal ? { borderColor: `${medal}60`, boxShadow: `0 0 12px ${medal}25` } : undefined}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black w-5 text-center" style={{ color: medal || "#71717a" }}>{i + 1}</span>
                    <span className="text-sm font-bold text-zinc-200">{nameOf(row.userId)}</span>
                  </div>
                  <Pill tone="emerald">{row.count} אימונים</Pill>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <SectionTitle icon={Star} tone="amber">שיאני הפרגונים</SectionTitle>
        <div className="text-[12px] text-zinc-600 mb-3">מי קיבל הכי הרבה "מילה טובה" ממשוב סוף אימון - זוהה אוטומטית מהשם שהוזכר</div>
        {kudosLeaderboard.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">אין עדיין פרגונים שזוהו</div>
        ) : (
          <div className="space-y-1.5">
            {kudosLeaderboard.map((row, i) => {
              const medal = i === 0 ? "#fbbf24" : i === 1 ? "#d4d4d8" : i === 2 ? "#b45309" : null;
              return (
                <div key={row.userId} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${medal ? "bg-black" : "bg-zinc-950 border-zinc-800"}`} style={medal ? { borderColor: `${medal}60`, boxShadow: `0 0 12px ${medal}25` } : undefined}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black w-5 text-center" style={{ color: medal || "#71717a" }}>{i + 1}</span>
                    <span className="text-sm font-bold text-zinc-200">{nameOf(row.userId)}</span>
                  </div>
                  <Pill tone="amber">{row.count} פרגונים</Pill>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================== COACH CONTENT (publishing - articles, training bank, unit info, values) ============================== */

function CoachContentTab({ addArticle, addContent, showToast }) {
  const [contentForm, setContentForm] = useState({ category: "unit_info", subcategory: "ערכים", title: "", body: "", unit: "", imageUrl: "", dateLabel: "" });
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [published, setPublished] = useState([]);
  const [loadingPublished, setLoadingPublished] = useState(true);
  const [confirmDeleteContent, setConfirmDeleteContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [justPublishedId, setJustPublishedId] = useState(null);

  async function refreshPublished(subcat) {
    setLoadingPublished(true);
    const rows = await loadContentRemote("unit_info", subcat || contentForm.subcategory);
    setPublished(rows);
    setLoadingPublished(false);
  }
  useEffect(() => { refreshPublished("ערכים"); }, []);

  async function handleImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("נא לבחור קובץ תמונה", "error"); return; }
    setUploadingImage(true);
    try {
      const url = await uploadUnitImage(file);
      setContentForm((f) => ({ ...f, imageUrl: url }));
      showToast("התמונה הועלתה", "success");
    } catch (e) {
      showToast(`שגיאת העלאה: ${e.message || "לא ידוע"}`, "error");
    } finally {
      setUploadingImage(false);
    }
  }

  async function publish() {
    if (!contentForm.title.trim()) return;
    setPublishing(true);
    try {
      if (contentForm.category === "tip_article") {
        await addArticle({ id: Date.now(), title: contentForm.title, unit: contentForm.unit || "כללי", author: "מאמן", excerpt: contentForm.body, imageUrl: contentForm.imageUrl.trim() });
      } else {
        if (!contentForm.subcategory) { showToast("נא לבחור תת-קטגוריה", "error"); setPublishing(false); return; }
        const saved = await addContent({ category: contentForm.category, subcategory: contentForm.subcategory, title: contentForm.title, body: contentForm.body, dateLabel: contentForm.dateLabel.trim(), imageUrl: contentForm.imageUrl.trim() });
        if (saved?.id) {
          setJustPublishedId(saved.id);
          setTimeout(() => setJustPublishedId(null), 2500);
        }
      }
      showToast("התוכן פורסם", "success");
      setContentForm({ category: contentForm.category, subcategory: "", title: "", body: "", unit: "", imageUrl: "", dateLabel: "" });
      setShowPreview(false);
      refreshPublished();
    } catch (e) {
      showToast("שגיאה בפרסום", "error");
    } finally {
      setPublishing(false);
    }
  }

  async function deletePublished(item) {
    try {
      await removeContentRemote(item.id);
      setPublished((prev) => prev.filter((p) => p.id !== item.id));
      showToast("התוכן נמחק", "success");
    } catch (e) {
      showToast("שגיאה במחיקה", "error");
    }
    setConfirmDeleteContent(null);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: "radial-gradient(ellipse 130% 100% at 30% -20%, #0ea5e935, transparent 65%), var(--card-base)", boxShadow: "0 0 0 1.5px #0ea5e930 inset" }}>
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30" style={{ backgroundColor: "#0ea5e9", animation: "coachHeroPulse 4s ease-in-out infinite" }} />
        <style>{`
          @keyframes coachHeroPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.25); opacity: 0.45; }
          }
        `}</style>
        <div className="relative flex items-center gap-2">
          <Star size={16} className="text-sky-400" />
          <span className="text-[11px] font-bold tracking-wide uppercase text-sky-400">מאגר תוכן</span>
        </div>
        <div className="relative text-2xl font-black text-zinc-50 mt-1">פרסום תוכן למאגר</div>
      </div>

      <Card className="p-4 tech-grid relative overflow-hidden border-2 border-sky-500/30" style={glowVars("#0ea5e9")}>
        <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-sky-500 pointer-events-none" />
        <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-3 mb-4 relative">
          <div className="text-sm font-black text-sky-400 flex items-center gap-1.5 mb-1"><Star size={13} /> פרסום תוכן ערכי</div>
          <div className="text-[13px] text-zinc-400">תוכן ערכי לקראת השירות - מופיע לכל החניכים במאגר. (יחידות, גיבושים, ירפ״א ומאגר האימונים מנוהלים ישירות במסד הנתונים)</div>
        </div>

        <div className="space-y-2 relative">
          <input placeholder="כותרת" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all duration-300" />
          {contentForm.category === "tip_article" && (
            <>
              <label className="text-[12px] text-zinc-500 font-semibold block">סיווג לפי יחידה (אופציונלי - משמש לסינון בעיתון)</label>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setContentForm({ ...contentForm, unit: "" })} className={`rounded-full px-3 py-1.5 text-[13px] font-bold border ${!contentForm.unit ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>כללי</button>
                {ARTICLE_UNIT_TAGS.map((tag) => (
                  <button key={tag} onClick={() => setContentForm({ ...contentForm, unit: tag })} className={`rounded-full px-3 py-1.5 text-[13px] font-bold border ${contentForm.unit === tag ? "bg-red-500/15 border-red-500 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>{tag}</button>
                ))}
              </div>
              <input placeholder="קישור לתמונה (אופציונלי - אם ריק, ייווצר עיצוב אוטומטי)" dir="ltr" value={contentForm.imageUrl} onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all duration-300" />
            </>
          )}
          {contentForm.category === "training_pool" && (
            <div className="text-[12px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
              פורמט לטבלת תרגילים - שורה לכל תרגיל: <span dir="ltr" className="font-mono">שם תרגיל|סטים|חזרות|מנוחה</span><br/>
              שורת הערה (אופציונלי, למעלה): <span dir="ltr" className="font-mono">META|הטקסט שלך</span>
            </div>
          )}
          <textarea placeholder={contentForm.category === "training_pool" ? "לדוגמה: מתח רגיל|5|5-8|2-3 דקות" : "תוכן / הקשר"} value={contentForm.body} onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })} rows={4} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">{contentForm.body.length} תווים</span>
            {contentForm.body.trim() && <button type="button" onClick={() => setShowPreview((s) => !s)} className="text-[12px] font-bold text-sky-400 flex items-center gap-1"><Eye size={12} /> {showPreview ? "הסתר תצוגה מקדימה" : "תצוגה מקדימה"}</button>}
          </div>
          {showPreview && contentForm.body.trim() && (
            <div className="rounded-xl p-3 bg-black/50 border border-sky-500/20">
              <div className="text-[10px] font-bold text-sky-500/70 uppercase tracking-wide mb-1.5">כך זה ייראה לחניכים</div>
              <div className="text-base font-black text-zinc-100 mb-1.5">{contentForm.title || "כותרת"}</div>
              <div className="text-[15px] text-zinc-300 leading-8 [&>*:last-child]:mb-0">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 whitespace-pre-line">{children}</p>,
                    strong: ({ children }) => <strong className="font-black text-white">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pr-4 space-y-1 mb-2">{children}</ul>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  }}
                >
                  {contentForm.body}
                </ReactMarkdown>
              </div>
            </div>
          )}
          <GlowButton tone="red" icon={publishing ? Loader2 : Send} className="w-full" disabled={publishing || !contentForm.title.trim()} onClick={publish}>{publishing ? "מפרסם..." : "פרסם"}</GlowButton>
        </div>
      </Card>

      <Card className="p-4 tech-grid">
        <SectionTitle icon={ClipboardCheck} tone="emerald">תוכן שפורסם - ניתן למחוק</SectionTitle>
        <style>{`
          @keyframes justPublished {
            0% { box-shadow: 0 0 0 2px #10b981; background-color: #10b98122; }
            100% { box-shadow: 0 0 0 1px #27272a; background-color: transparent; }
          }
        `}</style>
        {loadingPublished ? (
          <div className="text-sm text-zinc-600 text-center py-3">טוען...</div>
        ) : published.length === 0 ? (
          <div className="text-sm text-zinc-600 text-center py-3">עדיין לא פורסם תוכן ב{UNIT_INFO_SUBCATS.find(([id]) => id === contentForm.subcategory)?.[1] || "קטגוריה זו"}</div>
        ) : (
          <div className="space-y-1.5">
            {published.map((item, i) => {
              const unitObj = contentForm.subcategory === "יחידות" ? UNITS.find((u) => u.id === item.title) : null;
              return (
                <div key={item.id} className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5" style={item.id === justPublishedId ? { animation: "justPublished 2.5s ease-out" } : undefined}>
                  <span className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="text-sm font-bold text-zinc-200 flex-1">{unitObj ? unitObj.name : item.title}</div>
                  {item.id === justPublishedId && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 rounded-full px-2 py-0.5 shrink-0">חדש</span>}
                  <button onClick={() => setConfirmDeleteContent(item)} className="text-red-400 hover:text-red-300 p-1.5 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {confirmDeleteContent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl" onClick={() => setConfirmDeleteContent(null)}>
          <div className="w-full sm:max-w-xs bg-zinc-950 border-2 border-red-500/40 rounded-t-3xl sm:rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-red-400 font-black text-base mb-2">
              <Trash2 size={18} /> מחיקת תוכן
            </div>
            <div className="text-sm text-zinc-400 mb-4">
              למחוק את <span className="font-bold text-zinc-200">{confirmDeleteContent.title}</span>? זה יוסר מיד מהמאגר של כל החניכים ולא ניתן לשחזר.
            </div>
            <div className="flex gap-2">
              <GlowButton tone="ghost" className="flex-1" onClick={() => setConfirmDeleteContent(null)}>ביטול</GlowButton>
              <GlowButton tone="red" icon={Trash2} className="flex-1" onClick={() => deletePublished(confirmDeleteContent)}>מחק</GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== TRAINING FEEDBACK PAGE ============================== */

function FeedbackTab({ currentUser, officialEvents, showToast, onBack }) {
  const [openEvent] = useState(() => getOpenFeedbackEvent(officialEvents));
  const [checking, setChecking] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [teamCode, setTeamCode] = useState(currentUser.profile?.teamCode || "");
  const [coach, setCoach] = useState("");
  const [coachOther, setCoachOther] = useState("");
  const [valueRating, setValueRating] = useState(0);
  const [recommendRating, setRecommendRating] = useState(0);
  const [opinion, setOpinion] = useState("");
  const [kindWordText, setKindWordText] = useState("");
  const [howAreYou, setHowAreYou] = useState("");
  const [messageToYuval, setMessageToYuval] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!openEvent) { setChecking(false); return; }
      const already = await checkFeedbackSubmitted(currentUser.id, openEvent.id);
      setAlreadySubmitted(already);
      setChecking(false);
    })();
  }, [openEvent, currentUser.id]);

  async function submit() {
    if (!firstName.trim() || !teamCode || !coach || valueRating === 0 || recommendRating === 0 || !opinion.trim()) {
      showToast("נא למלא את כל השדות המסומנים כחובה", "error");
      return;
    }
    setSaving(true);
    try {
      const entry = {
        id: Date.now(),
        userId: currentUser.id,
        eventId: openEvent?.id || null,
        eventTitle: openEvent?.title || "",
        submittedAt: new Date().toISOString(),
        status: "pending",
        firstName: firstName.trim(),
        teamCode,
        coach: coach === "אחר" ? coachOther.trim() || "אחר" : coach,
        valueRating,
        recommendRating,
        opinion: opinion.trim(),
        kindWord: kindWordText.trim() ? { team: teamCode, text: kindWordText.trim() } : null,
        howAreYou: howAreYou.trim(),
        messageToYuval: messageToYuval.trim(),
      };
      await submitFeedbackRemote(entry);
      setSubmitted(true);
      showToast("המשוב נשלח למאמן בהצלחה", "success");
    } catch (e) {
      showToast("שגיאה בשליחה, נסה שוב", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 text-base font-bold mb-4">
        <ChevronRight size={16} /> חזרה לדף הבית
      </button>

      {checking ? (
        <div className="text-center py-10 text-zinc-600 text-base">בודק זמינות...</div>
      ) : !openEvent ? (
        <Card className="p-6 text-center">
          <ClipboardCheck size={28} className="text-zinc-600 mx-auto mb-2" />
          <div className="text-base text-zinc-400">אין כרגע משוב אימון פתוח למילוי.</div>
          <div className="text-sm text-zinc-600 mt-1">הטופס נפתח לשלוש שעות מרגע סיום כל אימון רשמי.</div>
        </Card>
      ) : alreadySubmitted || submitted ? (
        <Card className="p-6 text-center">
          <CheckCircle2 size={28} className="text-emerald-400 mx-auto mb-2" />
          <div className="text-base text-zinc-300 font-bold">כבר שלחת משוב לאימון הזה. תודה!</div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 space-y-5">
            <div>
              <SectionTitle icon={ClipboardCheck} tone="amber">משוב אימון - {openEvent.title}</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="text-[13px] text-zinc-500 font-semibold">שם פרטי</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">מספר צוות</label>
                <div className="text-base font-black text-amber-400 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5">
                  {teamCode ? getTeamLabel(teamCode) : "לא הוגדר בפרופיל"}
                </div>
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">אצל מי התאמנת?</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["עוז", "יובל", "אור", "אחר"].map((c) => (
                    <button key={c} onClick={() => setCoach(c)} className={`rounded-lg py-2 text-sm font-bold border ${coach === c ? "bg-amber-500/15 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                      {c}
                    </button>
                  ))}
                </div>
                {coach === "אחר" && (
                  <input value={coachOther} onChange={(e) => setCoachOther(e.target.value)} placeholder="שם המאמן" className="w-full mt-2 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
                )}
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">האימון נתן לי ערך (1-5)</label>
                <RatingButtons value={valueRating} onChange={setValueRating} />
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold mb-1.5 block">האם היית ממליץ לחברייך להצטרף אלינו? (1-5)</label>
                <RatingButtons value={recommendRating} onChange={setRecommendRating} />
              </div>
              <div>
                <label className="text-[13px] text-zinc-500 font-semibold">מה דעתך על האימון?</label>
                <textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} rows={3} className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all duration-300" />
              </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-5">
              <SectionTitle icon={Heart} tone="red">מילה טובה (לא חובה)</SectionTitle>
              <div className="text-[12px] text-zinc-600 mb-2">כתוב/י על מישהו/י מהצוות שלך - אנחנו נדע למי זה שייך</div>
              <textarea value={kindWordText} onChange={(e) => setKindWordText(e.target.value)} placeholder="כתוב/י מילה טובה על מישהו/י מהצוות..." rows={3} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/60 transition-all duration-300" />
            </div>

            <div className="border-t border-zinc-800 pt-5">
              <SectionTitle icon={MessageSquare}>עוד כמה דברים (לא חובה)</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="text-[13px] text-zinc-500 font-semibold">מה שלומך?</label>
                  <textarea value={howAreYou} onChange={(e) => setHowAreYou(e.target.value)} rows={2} className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                </div>
                <div>
                  <label className="text-[13px] text-zinc-500 font-semibold">משהו שתרצה/י להגיד ליובל?</label>
                  <textarea value={messageToYuval} onChange={(e) => setMessageToYuval(e.target.value)} rows={2} className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-base text-zinc-100 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all duration-300" />
                </div>
              </div>
            </div>
          </Card>

          <GlowButton tone="amber" icon={saving ? Loader2 : Send} className="w-full" disabled={saving} onClick={submit}>
            {saving ? "שולח..." : "שלח משוב"}
          </GlowButton>
        </div>
      )}
    </div>
  );
}

/* ============================== ROOT APP ============================== */

export default function CombatFitApp() {
  const [authState, setAuthState] = useState(() => {
    // Skips the intro screen entirely for anyone who's already seen it on this
    // device/browser before - localStorage persists across visits, which is what
    // actually achieves "remember this computer already came here" (a literal IP
    // address isn't something a website can reliably read or store client-side).
    try {
      return localStorage.getItem("sayert_intro_seen") ? "auth" : "intro";
    } catch (e) {
      return "intro";
    }
  }); // 'intro' | 'auth' | 'onboarding' | 'app'
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  // Single source of truth for premium status - reuses the payment infrastructure:
  // not required to pay at all (free network) counts as premium; required but not
  // yet confirmed by an admin means still on the free tier.
  const isPremium = !currentUser?.requiresPayment || currentUser?.paymentStatus === "confirmed";
  const [jumpToValueId, setJumpToValueId] = useState(null);
  const [tabResetSignal, setTabResetSignal] = useState(0);
  const mainScrollRef = useRef(null);
  const scrollContentToTop = () => mainScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });

  const [users, setUsers] = useState([]);
  const [officialEvents, setOfficialEvents] = useState([]);
  const [personalLogs, setPersonalLogs] = useState([]);
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [valuesContent, setValuesContent] = useState([]);
  const [trainingContent, setTrainingContent] = useState([]);

  function showToast(msg, tone = "info") { setToast({ msg, tone }); }
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (authState !== "app" || !currentUser) return;
    let cancelled = false;
    (async () => {
      const [u, ev, arts, logs, tb, vals] = await Promise.all([
        loadUsers(),
        loadOfficialEvents(),
        loadArticlesRemote(),
        loadPersonalLogsRemote(currentUser.id),
        loadContentRemote("training_pool"),
        loadContentRemote("unit_info", "ערכים"),
      ]);
      if (cancelled) return;
      setUsers(u);
      setOfficialEvents(ev);
      setArticles(arts);
      setPersonalLogs(logs);
      setTrainingContent(tb);
      setValuesContent(vals);
    })();
    return () => { cancelled = true; };
  }, [authState, currentUser?.id]);

  function handleAuthed(user) {
    setCurrentUser(user);
    setAuthState(user.onboarded ? "app" : "onboarding");
    if (user.role === "admin") setActiveTab("coach_home");
  }
  const [restoringSession, setRestoringSession] = useState(() => useSupabase());
  useEffect(() => {
    if (currentUser || !useSupabase()) return; // already logged in, or running in local-demo mode - nothing to restore
    (async () => {
      const authData = await restorePersistedSession();
      if (!authData) { setRestoringSession(false); return; }
      try {
        const appUser = await fetchOwnProfile(authData.user?.id);
        if (appUser) { handleAuthed(appUser); } else { clearPersistedSession(); }
      } catch (e) {
        clearPersistedSession();
      } finally {
        setRestoringSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!currentUser) return;
    touchSessionActivity();
    const id = setInterval(touchSessionActivity, 5 * 60 * 1000); // keep the 7-day window alive while actively using the app
    return () => clearInterval(id);
  }, [currentUser]);
  function handleOnboardingDone(user) {
    setCurrentUser(user);
    setAuthState("app");
  }
  function handleLogout() {
    clearPersistedSession();
    setCurrentUser(null);
    setAuthState("auth");
    setActiveTab("home");
  }

  async function addPersonalLog(entry) {
    const saved = await addPersonalLogRemote(currentUser.id, entry);
    setPersonalLogs((prev) => [saved, ...prev]);
  }
  async function updatePersonalLog(id, patch) {
    setPersonalLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    await updatePersonalLogRemote(currentUser.id, id, patch);
  }
  async function removePersonalLog(id) {
    await removePersonalLogRemote(currentUser.id, id);
    setPersonalLogs((prev) => prev.filter((l) => l.id !== id));
  }
  async function updateProfile(patch) {
    const newUser = { ...currentUser, profile: { ...currentUser.profile, ...patch } };
    setCurrentUser(newUser);
    try {
      await saveUserProfile(newUser);
    } catch (e) {
      showToast("שגיאה בשמירה", "error");
    }
  }
  async function setGibushDate(dateStr, gibushType) {
    const newUser = { ...currentUser, profile: { ...currentUser.profile, gibushDate: dateStr, gibushType: gibushType || currentUser.profile?.gibushType || "" } };
    setCurrentUser(newUser);
    try {
      await saveUserProfile(newUser);
    } catch (e) {
      showToast("שגיאה בשמירת מועד הגיבוש", "error");
    }
  }
  async function addOfficialEvent(entry) {
    const saved = await addOfficialEventRemote(entry);
    setOfficialEvents((prev) => [saved, ...prev]);
  }
  async function removeOfficialEvent(event) {
    const id = typeof event === "object" ? event.id : event;
    // A training canceled before it ended never really happened, so any attendance
    // already marked for it is cleared out too. One canceled after it already ended
    // keeps its attendance - that already occurred and stays as real history.
    if (typeof event === "object" && !eventHasEnded(event)) {
      await removeAttendanceForEventRemote(id);
    }
    await removeOfficialEventRemote(id);
    setOfficialEvents((prev) => prev.filter((e) => e.id !== id));
  }
  async function addArticle(entry) {
    const saved = await addArticleRemote(entry);
    setArticles((prev) => [saved, ...prev]);
  }
  async function addContent(entry) {
    const saved = await addContentRemote(entry);
    if (entry.category === "training_pool") setTrainingContent((prev) => [saved, ...prev]);
    return saved;
  }
  async function toggleTeamLeader(userId) {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const updated = { ...target, role: target.role === "team_leader" ? "trainee" : "team_leader" };
    await saveUserProfile(updated);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    showToast("העדכון בוצע", "success");
  }
  async function toggleAdmin(userId) {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const updated = { ...target, role: target.role === "admin" ? "trainee" : "admin" };
    await saveUserProfile(updated);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    showToast("העדכון בוצע", "success");
  }

  async function togglePaymentConfirmed(userId) {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const updated = { ...target, paymentStatus: target.paymentStatus === "confirmed" ? "pending" : "confirmed" };
    await saveUserProfile(updated);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    showToast("סטטוס התשלום עודכן", "success");
  }

  const baseTabs = [
    { id: "home", label: "בית", icon: Home },
    { id: "values", label: "עבודה ערכית", icon: Heart },
    { id: "chat", label: "צ'אט", icon: MessageSquare },
    { id: "hub", label: "מאגר", icon: BookOpen },
    { id: "fitness", label: "מד הכושר", icon: TrendingUp },
  ];
  const individualTabs = [
    { id: "home", label: "בית", icon: Home },
    { id: "values", label: "עבודה ערכית", icon: Heart },
    { id: "path", label: "המסלול שלי", icon: Crosshair },
    { id: "hub", label: "מאגר", icon: BookOpen },
    { id: "profile", label: "פרופיל", icon: User },
  ];
  const coachTabs = [
    { id: "coach_home", label: "בית", icon: Home },
    { id: "coach_calendars", label: "יומנים", icon: CalendarDays },
    { id: "coach_feedback", label: "התקבל", icon: ClipboardCheck },
    { id: "coach_content", label: "מאגר", icon: BookOpen },
  ];
  const isIndividualAccount = currentUser?.accountType === "individual";
  const tabs =
    currentUser?.role === "admin" ? coachTabs
    : isIndividualAccount ? individualTabs
    : currentUser?.role === "team_leader" ? [...baseTabs, { id: "attendance", label: "נוכחות", icon: ClipboardCheck }]
    : baseTabs;
  const isLight = Boolean(currentUser?.profile?.lightMode);
  const customBg = currentUser?.profile?.customBgEnabled ? currentUser?.profile?.customBgUrl : null;

  return (
    <ErrorBoundary>
    <style>{`
      /* The app is designed for phone width only. Every place that needs the shell width
         (the shell itself, ambient layers, the top progress bar) reads this one variable. */
      :root { --app-max-width: 448px; }

      /* Print mode: strip every decorative/interactive layer (ambient backgrounds, glow,
         tilt, frames, scroll bars, nav, buttons) down to plain readable black-on-white
         content. Scoped under body.print-mode so it only applies when the person actually
         asks to print a specific screen, not globally on every real print accidentally. */
      @media print {
        body.print-mode .fx-ambience, body.print-mode .hm-ambience, body.print-mode [class*="FxScrollBar"],
        body.print-mode button, body.print-mode .no-print { display: none !important; }
        body.print-mode, body.print-mode * { background: #fff !important; color: #000 !important; box-shadow: none !important; animation: none !important; transform: none !important; }
        body.print-mode .print-show { display: block !important; }
      }
    `}</style>
    <div dir="rtl" className="w-full min-h-screen bg-black flex justify-center" style={{ fontFamily: "'Heebo', system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" }}>
      <div
        className={`w-full min-h-screen border-x flex flex-col h-screen relative ${isLight ? "light-theme border-zinc-200" : "border-zinc-900"}`}
        style={{
          maxWidth: "var(--app-max-width)",
          background: customBg
            ? `linear-gradient(${isLight ? "rgba(248,250,252,0.88)" : "rgba(0,0,0,0.82)"}, ${isLight ? "rgba(248,250,252,0.88)" : "rgba(0,0,0,0.82)"}), url(${customBg})`
            : isLight
            ? "radial-gradient(ellipse 100% 40% at 50% 0%, rgba(16,185,129,0.08), transparent 70%), #f8fafc"
            : "radial-gradient(ellipse 100% 40% at 50% 0%, rgba(16,185,129,0.06), transparent 70%), #000",
          backgroundSize: customBg ? "cover" : undefined,
          backgroundPosition: customBg ? "center" : undefined,
          backgroundAttachment: customBg ? "fixed" : undefined,
        }}
      >
        {!isLight && !customBg && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-[0.12] bg-emerald-500" style={{ top: "-5%", right: "-15%", animation: "floatBlob1 18s ease-in-out infinite" }} />
            <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-[0.10] bg-sky-500" style={{ top: "35%", left: "-20%", animation: "floatBlob2 22s ease-in-out infinite" }} />
            <div className="absolute w-56 h-56 rounded-full blur-3xl opacity-[0.09] bg-amber-500" style={{ bottom: "5%", right: "-10%", animation: "floatBlob3 26s ease-in-out infinite" }} />
            <div className="absolute inset-0 tech-grid opacity-[0.35]" />
          </div>
        )}
        <style>{`
          /* Heebo font is loaded via <link> in index.html, not @import, for performance */
          @keyframes floatBlob1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(-30px, 40px) scale(1.15); }
          }
          @keyframes floatBlob2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(25px, -35px) scale(1.1); }
          }
          @keyframes floatBlob3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(-20px, -25px) scale(1.2); }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 6px 1px var(--glow-strong), 0 0 18px 4px var(--glow-soft); }
            50%      { box-shadow: 0 0 14px 3px var(--glow-strong), 0 0 34px 8px var(--glow-soft); }
          }
          .glow-btn {
            background-color: #000;
            animation: glowPulse 2.2s ease-in-out infinite;
          }
          .glow-pulse {
            animation: glowPulse 2.2s ease-in-out infinite;
          }
          .tech-grid {
            background-image: linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px);
            background-size: 18px 18px;
          }
          .tech-corners {
            position: relative;
          }
          .tech-corners::before, .tech-corners::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border-color: inherit;
            pointer-events: none;
          }
          .tech-corners::before {
            top: -1px; right: -1px;
            border-top: 2px solid; border-right: 2px solid;
          }
          .tech-corners::after {
            bottom: -1px; left: -1px;
            border-bottom: 2px solid; border-left: 2px solid;
          }
          @keyframes tabFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .tab-fade {
            animation: tabFadeIn 0.2s ease-out;
          }

          /* ===== Light theme overrides (freshly re-scanned against every class in the file) ===== */
          .light-theme [class~="bg-black"] { background-color: #ffffff !important; }
          .light-theme [class~="bg-black/30"] { background-color: rgba(0,0,0,0.12) !important; }
          .light-theme [class~="bg-black/60"] { background-color: rgba(255,255,255,0.9) !important; }
          .light-theme [class~="bg-black/70"] { background-color: rgba(255,255,255,0.92) !important; }
          .light-theme [class~="bg-black/80"] { background-color: rgba(255,255,255,0.94) !important; }
          .light-theme [class~="bg-black/90"] { background-color: rgba(255,255,255,0.96) !important; }
          .light-theme [class~="bg-zinc-700"] { background-color: #cbd5e1 !important; }
          .light-theme [class~="bg-zinc-800"] { background-color: #e2e8f0 !important; }
          .light-theme [class~="bg-zinc-900"] { background-color: #ffffff !important; }
          .light-theme [class~="bg-zinc-900/40"] { background-color: rgba(241,245,249,0.75) !important; }
          .light-theme [class~="bg-zinc-900/60"] { background-color: rgba(248,250,252,0.9) !important; }
          .light-theme [class~="bg-zinc-900/70"] { background-color: rgba(255,255,255,0.92) !important; }
          .light-theme [class~="bg-zinc-900/80"] { background-color: rgba(255,255,255,0.95) !important; }
          .light-theme [class~="bg-zinc-950"] { background-color: #f1f5f9 !important; }
          .light-theme [class~="border-zinc-600"] { border-color: #cbd5e1 !important; }
          .light-theme [class~="border-zinc-700"] { border-color: #cbd5e1 !important; }
          .light-theme [class~="border-zinc-800"] { border-color: #e2e8f0 !important; }
          .light-theme [class~="border-zinc-800/60"] { border-color: rgba(226,232,240,0.8) !important; }
          .light-theme [class~="border-zinc-800/80"] { border-color: rgba(226,232,240,0.9) !important; }
          .light-theme [class~="border-zinc-900"] { border-color: #e2e8f0 !important; }
          .light-theme [class~="text-zinc-50"] { color: #000000 !important; }
          .light-theme [class~="text-zinc-100"] { color: #000000 !important; }
          .light-theme [class~="text-zinc-200"] { color: #111111 !important; }
          .light-theme [class~="text-zinc-300"] { color: #1f1f1f !important; }
          .light-theme [class~="text-zinc-400"] { color: #3f3f46 !important; }
          .light-theme [class~="text-zinc-500"] { color: #52525b !important; }
          .light-theme [class~="text-zinc-600"] { color: #71717a !important; }
          .light-theme [class~="text-zinc-700"] { color: #a1a1aa !important; }
          .light-theme [class~="placeholder-zinc-600"]::placeholder { color: #a1a1aa !important; }
          .light-theme [class~="shadow-black"] { --tw-shadow-color: rgba(0,0,0,0.08) !important; }
          :root { --card-base: #0a0a0a; --card-base-alt: #111113; --card-base-2: #000; }
          .light-theme { --card-base: #ffffff; --card-base-alt: #f8fafc; --card-base-2: #ffffff; }
          .light-theme [class~="shadow-black/50"] { --tw-shadow-color: rgba(0,0,0,0.08) !important; }
        `}</style>
        {restoringSession ? (
          <div className="flex-1 flex items-center justify-center min-h-screen">
            <Loader2 size={24} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <>
            {authState === "intro" && <IntroCarousel onDone={() => setAuthState("auth")} />}
            {authState === "auth" && <AuthScreen onAuthed={handleAuthed} showToast={showToast} />}
          </>
        )}
        {authState === "onboarding" && currentUser && <OnboardingFlow user={currentUser} onDone={handleOnboardingDone} showToast={showToast} />}
        {authState === "app" && currentUser && (
          <>
            <AppHeader user={currentUser} />
            <div key={activeTab} ref={mainScrollRef} className="flex-1 overflow-y-auto tab-fade">
              <ErrorBoundary key={activeTab}>
              {activeTab === "home" && (
                <HomeTab
                  warMode={Boolean(currentUser.profile?.warMode)}
                  goToWarChat={() => setActiveTab("chat")}
                  officialEvents={officialEvents}
                  personalLogs={personalLogs}
                  goToHub={() => setActiveTab("hub")}
                  goToValue={(id) => { setJumpToValueId(id); setActiveTab("hub"); }}
                  goToFitness={() => setActiveTab("fitness")}
                  goToPath={() => setActiveTab("path")}
                  goToProfile={() => setActiveTab("profile")}
                  goToFeedback={() => setActiveTab("feedback")}
                  goToCalendar={() => setActiveTab(isIndividualAccount ? "path" : "home")}
                  role={currentUser.role}
                  isIndividual={currentUser.accountType === "individual"}
                  trainingContent={trainingContent}
                  articles={articles}
                  valuesContent={valuesContent}
                  profile={currentUser.profile}
                  showToast={showToast}
                  userId={currentUser.id}
                  networkId={currentUser.network}
                  requiresPayment={currentUser.requiresPayment}
                  isPremium={isPremium}
                  paymentStatus={currentUser.paymentStatus}
                  removePersonalLog={removePersonalLog}
                  updateProfile={updateProfile}
                  resetSignal={tabResetSignal}
                  scrollToTop={scrollContentToTop}
                />
              )}
              {activeTab === "values" && <ValuesWorkTab userId={currentUser.id} profile={currentUser.profile} showToast={showToast} />}
              {activeTab === "chat" && <ChatTab warMode={Boolean(currentUser.profile?.warMode)} showToast={showToast} profile={currentUser.profile} userId={currentUser.id} isPremium={isPremium} />}
              {activeTab === "path" && (isPremium ? (
                <PathTab profile={currentUser.profile} userId={currentUser.id} showToast={showToast} trainingContent={trainingContent} addPersonalLog={addPersonalLog} officialEvents={officialEvents} personalLogs={personalLogs} removePersonalLog={removePersonalLog} isPremium={isPremium} onSetGibushDate={setGibushDate} />
              ) : (
                <PremiumLock icon={Crosshair} title="המסלול שלי - פיצ׳ר פרימיום" description="בניית תוכנית אימונים אישית ב-AI, מותאמת ליעד ולגיבוש שלך, זמינה רק במנוי הפרימיום." goToUpgrade={() => setActiveTab("home")} />
              ))}
              {activeTab === "hub" && <HubTab articles={articles} valuesContent={valuesContent} profile={currentUser.profile} resetSignal={tabResetSignal} scrollToTop={scrollContentToTop} userId={currentUser.id} showToast={showToast} jumpToValueId={jumpToValueId} onJumpHandled={() => setJumpToValueId(null)} isPremium={isPremium} />}
              {activeTab === "fitness" && <FitnessTab userId={currentUser.id} showToast={showToast} goToHome={() => setActiveTab("home")} />}
              {activeTab === "profile" && <ProfileTab user={currentUser} setCurrentUser={setCurrentUser} showToast={showToast} onLogout={handleLogout} goBack={() => setActiveTab("home")} />}
              {activeTab === "attendance" && currentUser.role === "team_leader" && <AttendanceTab users={users} currentUser={currentUser} officialEvents={officialEvents} showToast={showToast} />}
              {activeTab === "coach_home" && currentUser.role === "admin" && (
                <CoachHomeTab users={users} toggleTeamLeader={toggleTeamLeader} toggleAdmin={toggleAdmin} togglePaymentConfirmed={togglePaymentConfirmed} addOfficialEvent={addOfficialEvent} officialEvents={officialEvents} removeOfficialEvent={removeOfficialEvent} showToast={showToast} onLogout={handleLogout} />
              )}
              {activeTab === "coach_calendars" && currentUser.role === "admin" && <CoachCalendarsTab users={users} />}
              {activeTab === "coach_feedback" && currentUser.role === "admin" && (
                <CoachFeedbackTab users={users} officialEvents={officialEvents} showToast={showToast} />
              )}
              {activeTab === "coach_content" && currentUser.role === "admin" && (
                <CoachContentTab addArticle={addArticle} addContent={addContent} showToast={showToast} />
              )}
              {activeTab === "feedback" && (
                <FeedbackTab currentUser={currentUser} officialEvents={officialEvents} showToast={showToast} onBack={() => setActiveTab("home")} />
              )}
              </ErrorBoundary>
            </div>
            {activeTab !== "feedback" && <BottomNav tabs={tabs} active={activeTab} setActive={setActiveTab} onSameTabClick={() => setTabResetSignal((n) => n + 1)} />}
          </>
        )}
        <Toast toast={toast} />
      </div>
    </div>
    </ErrorBoundary>
  );
}
