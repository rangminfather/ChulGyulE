import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';
import { ds2, DW, isHoliday, holidayName, getDow, getRecord } from '../utils/data';
import { getKidAvatar } from '../assets/avatars';
import { IconChevronLeft, IconChevronRight, IconChevronDoubleLeft, IconChevronDoubleRight } from '../assets/icons';

const Calendar = ({ year, month, pairs, data, onPrevYear, onPrev, onNext, onNextYear, onDayPress }) => {
  const fd = new Date(year, month, 1).getDay();
  const dim = new Date(year, month+1, 0).getDate();
  const pd = new Date(year, month, 0).getDate();
  const today = ds2(new Date());

  const days = [];
  for (let i = fd-1; i >= 0; i--) days.push({ num: pd-i, outside: true });
  for (let d = 1; d <= dim; d++) {
    const date = new Date(year, month, d);
    const dstr = ds2(date);
    const dow = date.getDay();
    const hol = isHoliday(dstr, data.customHolidays);
    const holN = holidayName(dstr, data.customHolidays);

    const badges = [];
    (pairs || []).forEach(p => {
      const rec = getRecord(data, dstr, p.kid.id, p.acad.id);
      const activeDow = getDow(data, p.kid.id, p.acad.id, dstr);
      const sched = activeDow.includes(dow);
      const schedN = sched && !hol;
      const schedH = sched && hol;

      let color = null;
      if (rec.absent && schedN) color = COLORS.red;
      else if (rec.makeupUsed) color = COLORS.blue;
      else if (rec.makeupForced) color = COLORS.amber;
      else if (schedH) color = COLORS.pinkLight;
      else if (schedN) color = COLORS.green;

      if (color) badges.push({ color, avatarId: p.kid.avatarId });
    });

    days.push({
      num: d, dstr,
      isToday: dstr === today,
      isSunday: dow === 0,
      isSaturday: dow === 6,
      isHoliday: !!hol,
      holName: holN && holN.length > 4 ? holN.slice(0,4) : holN,
      badges,
    });
  }
  const rem = (7 - days.length % 7) % 7;
  for (let i = 1; i <= rem; i++) days.push({ num: i, outside: true });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navGroup}>
          <TouchableOpacity style={styles.navBtn} onPress={onPrevYear}><IconChevronDoubleLeft size={16} /></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={onPrev}><IconChevronLeft size={16} /></TouchableOpacity>
        </View>
        <Text style={styles.monthTitle}>{year}년 {month+1}월</Text>
        <View style={styles.navGroup}>
          <TouchableOpacity style={styles.navBtn} onPress={onNext}><IconChevronRight size={16} /></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={onNextYear}><IconChevronDoubleRight size={16} /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.weekRow}>
        {DW.map((d, i) => (
          <Text key={i} style={[styles.weekDay, i===0 && {color: COLORS.redLight}, i===6 && {color: COLORS.blueLight}]}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.dayCell,
              day.outside && styles.dayCellOutside,
              day.isToday && styles.dayCellToday,
              day.isHoliday && styles.dayCellHoliday,
            ]}
            onPress={() => !day.outside && day.dstr && onDayPress && onDayPress(day.dstr)}
            disabled={day.outside}
            activeOpacity={0.6}
          >
            <Text style={[
              styles.dayNum,
              day.isSunday && { color: COLORS.redLight },
              day.isSaturday && { color: COLORS.blueLight },
              day.outside && { opacity: 0.25 },
              day.isToday && { color: COLORS.primary },
            ]}>{day.num}</Text>
            {day.holName ? <Text style={styles.holName}>{day.holName}</Text> : null}
            {day.badges && day.badges.length > 0 && (
              <View style={styles.badgeRow}>
                {day.badges.slice(0, 3).map((b, bi) => (
                  <View key={bi} style={[styles.badge, { borderColor: b.color, borderWidth: 1.5, marginLeft: bi > 0 ? -5 : 0, zIndex: 3 - bi }]}>
                    {getKidAvatar(b.avatarId, 12)}
                  </View>
                ))}
                {day.badges.length > 3 && (
                  <View style={[styles.badge, { marginLeft: -5, backgroundColor: COLORS.textLight }]}>
                    <Text style={{ fontSize: 6, color: '#fff', fontWeight: '800' }}>+{day.badges.length - 3}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.legend}>
        <LegendDot color={COLORS.green} label="출석" />
        <LegendDot color={COLORS.red} label="결석" />
        <LegendDot color={COLORS.blue} label="보강" />
        <LegendDot color={COLORS.amber} label="강제보강" />
      </View>
    </View>
  );
};

const LegendDot = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navGroup: { flexDirection: 'row', gap: 4 },
  navBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center', justifyContent: 'center',
  },
  monthTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: COLORS.textLight },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.285%',
    minHeight: 52,
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 2,
    borderRadius: 8,
  },
  dayCellOutside: { opacity: 0.2 },
  dayCellToday: { backgroundColor: COLORS.primaryPale, borderWidth: 1.5, borderColor: COLORS.primary },
  dayCellHoliday: { backgroundColor: COLORS.redPale },
  dayNum: { fontSize: 11, fontWeight: '700', color: COLORS.textDark },
  holName: { fontSize: 5.5, color: COLORS.red, fontWeight: '700', marginTop: 0 },
  badgeRow: { flexDirection: 'row', marginTop: 1, justifyContent: 'center' },
  badge: {
    width: 16, height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgWarm,
    overflow: 'hidden',
  },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600' },
});

export default Calendar;