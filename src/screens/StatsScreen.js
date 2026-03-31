import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';
import { allPairs, activePairs, calcStats, hasCurrent, ms2 } from '../utils/data';
import { getKidAvatar, getAcadIcon } from '../assets/avatars';
import { Card, Tag, FilterChip, ProgressBar, EmptyState } from '../components/UIComponents';
import Calendar from '../components/Calendar';

const StatsScreen = ({ data, setData }) => {
  const [filter, setFilter] = useState('all');
  const [calMonth, setCalMonth] = useState(new Date());

  const pairs = allPairs(data, false);
  if (!pairs.length) {
    return (
      <ScrollView style={styles.page} contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon={<View style={styles.emptyIcon}><Text style={{ fontSize: 48 }}>📊</Text></View>}
          text="데이터가 없습니다"
        />
      </ScrollView>
    );
  }

  if (filter !== 'all' && !pairs.some(p => `${p.kid.id}_${p.acad.id}` === filter)) {
    setFilter('all');
  }

  const ap = activePairs(data, filter, false);
  const y = calMonth.getFullYear(), m = calMonth.getMonth();

  const rateColor = (rate) => rate >= 80 ? COLORS.green : rate >= 50 ? COLORS.amber : COLORS.red;
  const rateBg = (rate) => rate >= 80 ? COLORS.greenBg : rate >= 50 ? COLORS.amberBg : COLORS.redBg;

  // Settlement logs
  const logs = (data.settlements || [])
    .filter(s => filter === 'all' || (s.kidId === filter.split('_')[0] && s.acadId === filter.split('_')[1]))
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 20);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <FilterChip label="전체" active={filter==='all'} onPress={() => setFilter('all')} />
        {pairs.map(p => (
          <FilterChip
            key={`${p.kid.id}_${p.acad.id}`}
            label={`${p.kid.name}`}
            active={filter === `${p.kid.id}_${p.acad.id}`}
            onPress={() => setFilter(`${p.kid.id}_${p.acad.id}`)}
            icon={getKidAvatar(p.kid.avatarId, 18)}
          />
        ))}
      </ScrollView>

      {/* Stat Cards */}
      {ap.map(p => {
        const stats = calcStats(data, y, m, p.kid.id, p.acad.id);
        const rate = stats.total > 0 ? Math.round(stats.attended / stats.total * 100) : 0;
        const rc = rateColor(rate);
        const rb = rateBg(rate);
        const current = hasCurrent(data, p.kid.id, p.acad.id);

        return (
          <Card key={`${p.kid.id}_${p.acad.id}`} borderColor={COLORS.borderWarm}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {getKidAvatar(p.kid.avatarId, 32)}
                {getAcadIcon(p.acad.iconId, 20)}
                <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.textDark }}>{p.kid.name} · {p.acad.name}</Text>
              </View>
              <Tag bg={current ? COLORS.greenBg : COLORS.amberBg} color={current ? COLORS.green : COLORS.amber}>
                {current ? '현재' : '과거'}
              </Tag>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
              <View style={[styles.bigRate, { backgroundColor: rb }]}>
                <Text style={[styles.bigRateText, { color: rc }]}>{rate}%</Text>
              </View>
            </View>

            <ProgressBar rate={rate} color={rc} />

            <View style={styles.statGrid6}>
              <View style={[styles.statCell, { backgroundColor: COLORS.greenBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.green }]}>{stats.attended}</Text>
                <Text style={styles.statCellLabel}>출석</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: COLORS.redBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.red }]}>{stats.absent}</Text>
                <Text style={styles.statCellLabel}>결석</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: COLORS.amberBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.amber }]}>{stats.total}</Text>
                <Text style={styles.statCellLabel}>수업일</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: COLORS.amberBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.amber }]}>{stats.earned}</Text>
                <Text style={styles.statCellLabel}>보강발생</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: COLORS.blueBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.blue }]}>{stats.used}</Text>
                <Text style={styles.statCellLabel}>보강시행</Text>
              </View>
              <View style={[styles.statCell, { backgroundColor: COLORS.purpleBg }]}>
                <Text style={[styles.statCellNum, { color: COLORS.purple }]}>{stats.balance}</Text>
                <Text style={styles.statCellLabel}>남은보강</Text>
              </View>
            </View>
          </Card>
        );
      })}

      {/* Calendar */}
      <Calendar
        year={y}
        month={m}
        pairs={ap}
        data={data}
        onPrevYear={() => setCalMonth(new Date(y-1, m, 1))}
        onPrev={() => setCalMonth(new Date(y, m-1, 1))}
        onNext={() => setCalMonth(new Date(y, m+1, 1))}
        onNextYear={() => setCalMonth(new Date(y+1, m, 1))}
        onDayPress={() => {}}
      />

      {/* Settlement Log */}
      <Card borderColor={COLORS.border}>
        <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 }}>📝 정산 이력</Text>
        {logs.length === 0
          ? <Text style={{ fontSize: 12, color: COLORS.textMuted }}>정산 이력 없음</Text>
          : logs.map((l, i) => {
            const kid = data.kids.find(k => k.id === l.kidId);
            const acad = data.academies.find(a => a.id === l.acadId);
            return (
              <View key={i} style={styles.logItem}>
                {kid && getKidAvatar(kid.avatarId, 20)}
                {acad && getAcadIcon(acad.iconId, 14)}
                <Text style={{ flex: 1, fontSize: 12, color: COLORS.textMid }}>
                  {l.date}{' '}
                  <Text style={{ fontWeight: '700', color: l.delta < 0 ? COLORS.red : COLORS.green }}>
                    {l.delta > 0 ? '+' : ''}{l.delta}
                  </Text>
                  {l.memo ? ` · ${l.memo}` : ''}
                </Text>
              </View>
            );
          })
        }
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigRate: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  bigRateText: {
    fontSize: 20,
    fontWeight: '900',
  },
  statGrid6: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 12,
  },
  statCell: {
    width: '32%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 4,
  },
  statCellNum: {
    fontSize: 20,
    fontWeight: '900',
  },
  statCellLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgWarm,
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
});

export default StatsScreen;
