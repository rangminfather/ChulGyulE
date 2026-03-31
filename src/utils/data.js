import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'hakwon_v4';

// ─── PUBLIC HOLIDAYS ───
const PH = {};
const _p = (y,m,d,n) => { PH[`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`] = n; };
for (let y = 2024; y <= 2030; y++) {
  _p(y,1,1,'신정'); _p(y,3,1,'삼일절'); _p(y,5,5,'어린이날');
  _p(y,6,6,'현충일'); _p(y,8,15,'광복절'); _p(y,10,3,'개천절');
  _p(y,10,9,'한글날'); _p(y,12,25,'크리스마스');
}

// ─── DEFAULT DATA ───
const uid = () => Math.random().toString(36).substr(2, 9);

export const createDefaultData = () => ({
  kids: [],
  academies: [],
  kidAcademies: {},
  attendance: {},
  customHolidays: {},
  settlements: [],
  makeupCarry: {},
});

// ─── DATE UTILS ───
export const DW = ['일','월','화','수','목','금','토'];

export const ds2 = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
};

export const ms2 = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;

export const addDays = (s, days) => {
  const d = new Date(s+'T00:00:00');
  d.setDate(d.getDate() + days);
  return ds2(d);
};

export const isHoliday = (s, customHolidays={}) => PH[s] || customHolidays[s];
export const holidayName = (s, customHolidays={}) => PH[s] || customHolidays[s] || '';

export const generateId = uid;

// ─── PERIOD MANAGEMENT ───
export const normPeriod = (p) => ({
  id: p.id || uid(),
  from: p.from || ds2(new Date()),
  to: p.to === undefined ? null : (p.to || null),
  dow: Array.isArray(p.dow) ? [...new Set(p.dow)].sort((a,b) => a - b) : [],
});

export const periodList = (data, kidId, acadId) => {
  const ka = data.kidAcademies[kidId];
  if (!ka || !ka[acadId]) return [];
  if (!ka[acadId].periods) {
    const schs = (ka[acadId].schedules || []).slice().sort((a,b) => a.from.localeCompare(b.from));
    ka[acadId].periods = schs.length
      ? schs.map((s,i) => normPeriod({
          from: s.from === '2000-01-01' ? ds2(new Date()) : s.from,
          to: i < schs.length - 1 ? addDays(schs[i+1].from, -1) : null,
          dow: s.dow || [],
        }))
      : [normPeriod({ from: ds2(new Date()), to: null, dow: [] })];
  }
  ka[acadId].periods = ka[acadId].periods.map(normPeriod).sort((a,b) => (a.from||'').localeCompare(b.from||''));
  delete ka[acadId].schedules;
  return ka[acadId].periods;
};

export const getActivePeriod = (data, kidId, acadId, dateStr) => {
  const ps = periodList(data, kidId, acadId);
  return ps.find(p => p.from <= dateStr && (!p.to || dateStr <= p.to)) || null;
};

export const getDow = (data, kidId, acadId, dateStr) => {
  const p = getActivePeriod(data, kidId, acadId, dateStr);
  return p ? p.dow : [];
};

export const hasCurrent = (data, kidId, acadId) => {
  return !!getActivePeriod(data, kidId, acadId, ds2(new Date()));
};

// ─── PAIRS ───
export const allPairs = (data, activeOnly=false) => {
  const pairs = [];
  data.kids.forEach(k => {
    const ka = data.kidAcademies[k.id];
    if (!ka) return;
    Object.keys(ka).forEach(aid => {
      const a = data.academies.find(x => x.id === aid);
      const ps = periodList(data, k.id, aid);
      if (a && ps.length && (!activeOnly || hasCurrent(data, k.id, aid))) {
        pairs.push({ kid: k, acad: a });
      }
    });
  });
  return pairs;
};

export const activePairs = (data, filter, activeOnly=false) => {
  const p = allPairs(data, activeOnly);
  return filter === 'all' ? p : p.filter(x => `${x.kid.id}_${x.acad.id}` === filter);
};

// ─── ATTENDANCE ───
export const getRecord = (data, d, ki, ai) => {
  return (data.attendance[d] && data.attendance[d][`${ki}_${ai}`]) || {};
};

export const setRecord = (data, d, ki, ai, rec) => {
  if (!data.attendance[d]) data.attendance[d] = {};
  data.attendance[d][`${ki}_${ai}`] = rec;
  return { ...data };
};

// ─── MONTHLY STATS ───
export const calcStats = (data, y, m, ki, ai) => {
  const acad = data.academies.find(a => a.id === ai);
  if (!acad) return { total:0, attended:0, absent:0, earned:0, used:0, balance:0, holOff:0, carry:0, settled:0 };

  const dim = new Date(y, m+1, 0).getDate();
  let total=0, attended=0, absent=0, earned=0, used=0, holOff=0;

  for (let d = 1; d <= dim; d++) {
    const date = new Date(y, m, d);
    const dstr = ds2(date);
    const dow2 = date.getDay();
    const rec = getRecord(data, dstr, ki, ai);
    const hol = isHoliday(dstr, data.customHolidays);
    const activeDow = getDow(data, ki, ai, dstr);
    const sched = activeDow.includes(dow2);

    if (sched && !hol) {
      total++;
      if (rec.absent) {
        absent++;
        if (acad.optAbsenceMakeup) earned++;
      } else {
        attended++;
      }
    }
    if (sched && hol) {
      holOff++;
      if (acad.optHolidayMakeup) earned++;
    }
    if (rec.makeupForced) earned++;
    if (rec.makeupUsed) used++;
  }

  const mstr = ms2(new Date(y, m, 1));
  const settled = (data.settlements || [])
    .filter(s => s.kidId === ki && s.acadId === ai && s.date.startsWith(mstr))
    .reduce((s, x) => s + x.delta, 0);

  let carry = 0;
  if (acad.optCarryOver) {
    const prev = new Date(y, m-1, 1);
    carry = data.makeupCarry[`${ms2(prev)}_${ki}_${ai}`] || 0;
  }

  const balance = carry + earned - used + settled;
  data.makeupCarry[`${mstr}_${ki}_${ai}`] = balance;

  return { total, attended, absent, earned, used, balance, holOff, carry, settled };
};

// ─── VALIDATION ───
export const validatePeriods = (data, ki, ai) => {
  const ps = periodList(data, ki, ai);
  for (const p of ps) {
    if (!p.from) return '시작일을 입력해주세요';
    if (p.to && p.from > p.to) return '종료일은 시작일보다 빠를 수 없어요';
  }
  const sorted = [...ps].sort((a,b) => a.from.localeCompare(b.from));
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i-1], cur = sorted[i];
    if (!prev.to) return '계속 구간이 있으면 뒤에 구간을 만들 수 없어요';
    if (cur.from <= prev.to) return '기간이 서로 겹치고 있어요';
  }
  return '';
};

// ─── STORAGE ───
export const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save error:', e);
  }
};

export const loadData = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // ensure all fields exist
      if (!parsed.settlements) parsed.settlements = [];
      if (!parsed.makeupCarry) parsed.makeupCarry = {};
      if (!parsed.customHolidays) parsed.customHolidays = {};
      if (!parsed.kidAcademies) parsed.kidAcademies = {};
      // migrate
      Object.keys(parsed.kidAcademies).forEach(kidId => {
        const obj = parsed.kidAcademies[kidId] || {};
        Object.keys(obj).forEach(acadId => {
          periodList(parsed, kidId, acadId);
        });
      });
      return parsed;
    }
  } catch (e) {
    console.error('Load error:', e);
  }
  return createDefaultData();
};

export const exportData = (data) => JSON.stringify(data, null, 2);

export const importData = (jsonStr) => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.kids && parsed.academies) {
      if (!parsed.settlements) parsed.settlements = [];
      if (!parsed.makeupCarry) parsed.makeupCarry = {};
      if (!parsed.customHolidays) parsed.customHolidays = {};
      if (!parsed.kidAcademies) parsed.kidAcademies = {};
      return { success: true, data: parsed };
    }
    return { success: false, error: '올바른 파일이 아닙니다' };
  } catch (e) {
    return { success: false, error: '파싱 오류: ' + e.message };
  }
};
