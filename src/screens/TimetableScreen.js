import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, EmptyState, Tag } from '../components/UIComponents';
import { getAcadIcon, getKidAvatar } from '../assets/avatars';
import { COLORS, SIZES } from '../utils/theme';
import { DW, formatTimeRange, getWeeklyTimetable } from '../utils/data';

const TimetableScreen = ({ data }) => {
  const timetable = getWeeklyTimetable(data);
  const groups = DW.map((label, dow) => ({
    dow,
    label,
    items: timetable.filter((item) => item.dow === dow),
  }));

  if (!timetable.length) {
    return (
      <ScrollView style={styles.page} contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <EmptyState
          icon={<View style={styles.emptyIcon}><Text style={{ fontSize: 42 }}>표</Text></View>}
          text="등록된 시간표가 없습니다. 아이와 학원을 연결하고 요일별 시간을 설정해 주세요."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <Card borderColor={COLORS.borderWarm}>
        <Text style={styles.headline}>시간표</Text>
        <Text style={styles.subline}>현재 연결 중인 아이와 학원의 요일별 수업 시간을 한눈에 봅니다.</Text>
      </Card>
      {groups.map((group) => (
        <Card key={group.dow} borderColor={group.items.length ? COLORS.borderWarm : COLORS.border}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{group.label}요일</Text>
            <Tag bg={group.items.length ? COLORS.primaryPale : COLORS.bgWarm} color={group.items.length ? COLORS.primaryDark : COLORS.textMuted}>
              {group.items.length}건
            </Tag>
          </View>
          {group.items.length === 0 ? (
            <Text style={styles.emptyDay}>등록된 수업이 없습니다.</Text>
          ) : group.items.map((item) => (
            <View key={item.key} style={styles.row}>
              <View style={styles.rowLeft}>
                {getKidAvatar(item.kid.avatarId, 30)}
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.kidName}>{item.kid.name}</Text>
                  <View style={styles.academyRow}>
                    {getAcadIcon(item.acad.iconId, 16)}
                    <Text style={styles.acadName}>{item.acad.name}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.timePill}>
                <Text style={styles.timeText}>{formatTimeRange(item.start, item.end)}</Text>
              </View>
            </View>
          ))}
        </Card>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16, paddingTop: 12 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { fontSize: 18, fontWeight: '900', color: COLORS.textDark, marginBottom: 6 },
  subline: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dayTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  emptyDay: { fontSize: 12, color: COLORS.textMuted },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  kidName: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 3 },
  academyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  acadName: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  timePill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.primaryPale,
    borderWidth: 1,
    borderColor: COLORS.borderWarm,
  },
  timeText: { fontSize: 12, fontWeight: '800', color: COLORS.primaryDark },
});

export default TimetableScreen;
