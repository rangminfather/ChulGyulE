import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../utils/theme';
import {
  allPairs,
  activePairs,
  calcStats,
  DW,
  isHoliday,
  holidayName,
  getDow,
  getRecord,
  setRecord,
  saveData,
} from '../utils/data';
import { getKidAvatar, getAcadIcon } from '../assets/avatars';
import { IconBox } from '../assets/icons';
import {
  Card,
  Tag,
  FilterChip,
  ProgressBar,
  StatBox,
  Button,
  Toggle,
  EmptyState,
} from '../components/UIComponents';
import Calendar from '../components/Calendar';

const MainScreen = ({ data, setData, navigation }) => {
  const [filter, setFilter] = useState('all');
  const [calMonth, setCalMonth] = useState(new Date());
  const [dayModal, setDayModal] = useState(null);
  const [settleModal, setSettleModal] = useState(null);
  const [settleDelta, setSettleDelta] = useState(0);
  const [settleMemo, setSettleMemo] = useState('');
  const [kidAcadTab, setKidAcadTab] = useState({});
  const [expandedKids, setExpandedKids] = useState({});
  const [settleManual, setSettleManual] = useState('0');
  const [editingSettle, setEditingSettle] = useState(false);
  const settleScrollRef = useRef(null);

  useFocusEffect(useCallback(() => {}, [data]));

  const pairs = allPairs(data, true);

  if (!pairs.length) {
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
      >
        <EmptyState
          icon={
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 48 }}>📚</Text>
            </View>
          }
          text="아이와 학원을 먼저 등록해주세요"
        >
          <Button
            title="✏️ 등록하러 가기"
            onPress={() => navigation.navigate('등록')}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </EmptyState>
      </ScrollView>
    );
  }

  if (filter !== 'all' && !pairs.some((p) => `${p.kid.id}_${p.acad.id}` === filter)) {
    setFilter('all');
  }

  const ap = activePairs(data, filter, true);
  const y = calMonth.getFullYear();
  const m = calMonth.getMonth();

  const rateColor = (r) => (r >= 80 ? COLORS.green : r >= 50 ? COLORS.amber : COLORS.red);
  const rateBg = (r) => (r >= 80 ? COLORS.greenBg : r >= 50 ? COLORS.amberBg : COLORS.redBg);

  const kidGroups = {};
  ap.forEach((p) => {
    if (!kidGroups[p.kid.id]) kidGroups[p.kid.id] = { kid: p.kid, acads: [] };
    kidGroups[p.kid.id].acads.push(p.acad);
  });

  const openDay = (dstr) => setDayModal(dstr);
  const closeDay = () => setDayModal(null);

  const toggleAtt = (dstr, ki, ai, field) => {
    const rec = { ...getRecord(data, dstr, ki, ai) };
    rec[field] = !rec[field];
    const newData = setRecord({ ...data }, dstr, ki, ai, rec);
    setData(newData);
    saveData(newData);
  };

  const getMinSettleDelta = () => {
    if (!settleModal) return 0;
    return -(settleModal.balance || 0);
  };

  const clampSettleDelta = (value) => {
    const num = Number.isFinite(value) ? value : 0;
    const min = getMinSettleDelta();
    return Math.max(min, num);
  };

  const formatSigned = (value) => {
    if (value > 0) return `+${value}`;
    if (value < 0) return `${value}`;
    return '+0';
  };

  const sanitizeSignedNumberInput = (text) => {
    const raw = String(text || '');
    const sign = raw.trim().startsWith('-') ? '-' : raw.trim().startsWith('+') ? '+' : '';
    const digits = raw.replace(/\D/g, '').slice(0, 4);

    if (!digits) {
      return sign || '';
    }

    return `${sign}${String(Number(digits))}`;
  };

  const parseSignedNumber = (text) => {
    const raw = String(text || '').trim();

    if (!raw || raw === '-' || raw === '+') {
      return 0;
    }

    const sign = raw.startsWith('-') ? -1 : 1;
    const digits = raw.replace(/\D/g, '');

    if (!digits) return 0;

    return sign * Number(digits);
  };

  const updateSettleDelta = (nextValue) => {
    const next = clampSettleDelta(nextValue);
    setSettleDelta(next);
    setSettleManual(next === 0 ? '0' : String(next));
  };

  const openSettle = (ki, ai) => {
    const stats = calcStats(data, y, m, ki, ai);
    setSettleModal({ kidId: ki, acadId: ai, balance: stats.balance });
    setSettleDelta(0);
    setSettleMemo('');
    setSettleManual('0');
    setEditingSettle(false);
  };

  const applyManualSettle = (text) => {
    const sanitized = sanitizeSignedNumberInput(text);
    setSettleManual(sanitized);

    const parsed = clampSettleDelta(parseSignedNumber(sanitized));
    setSettleDelta(parsed);
  };

  const finishManualEdit = () => {
    const parsed = clampSettleDelta(parseSignedNumber(settleManual));
    setSettleDelta(parsed);
    setSettleManual(parsed === 0 ? '0' : String(parsed));
    setEditingSettle(false);
  };

  const cancelSettle = () => {
    if (settleDelta !== 0 || settleMemo.trim()) {
      Alert.alert('정산 취소', '입력한 내용이 사라집니다. 취소하시겠습니까?', [
        { text: '계속 입력', style: 'cancel' },
        { text: '취소', style: 'destructive', onPress: () => setSettleModal(null) },
      ]);
    } else {
      setSettleModal(null);
    }
  };

  const doSettle = () => {
    if (!settleDelta) {
      Alert.alert('알림', '정산할 수량을 입력해주세요');
      return;
    }
    if (!settleModal) return;

    const mstr = `${y}-${String(m + 1).padStart(2, '0')}`;
    const newData = { ...data };
    newData.settlements = [
      ...(newData.settlements || []),
      {
        date: `${mstr}-01`,
        kidId: settleModal.kidId,
        acadId: settleModal.acadId,
        delta: settleDelta,
        memo: settleMemo.trim(),
        ts: new Date().toISOString(),
      },
    ];

    setData(newData);
    saveData(newData);
    setSettleModal(null);
  };

  const toggleExpand = (kidId) => {
    setExpandedKids((prev) => ({ ...prev, [kidId]: !prev[kidId] }));
  };

  const renderSixStats = (stats) => (
    <>
      <View style={styles.statsGrid}>
        <StatBox value={stats.attended} label="출석" bg={COLORS.greenBg} color={COLORS.green} />
        <StatBox value={stats.absent} label="결석" bg={COLORS.redBg} color={COLORS.red} />
        <StatBox value={stats.total} label="수업일" bg={COLORS.amberBg} color={COLORS.amber} />
      </View>

      <View style={styles.statsGrid}>
        <StatBox value={stats.earned} label="보강발생" bg={COLORS.amberBg} color={COLORS.amber} />
        <StatBox value={stats.used} label="보강시행" bg={COLORS.blueBg} color={COLORS.blue} />
        <StatBox value={stats.balance} label="남은보강" bg={COLORS.purpleBg} color={COLORS.purple} />
      </View>
    </>
  );

  const renderTagsAndSettle = (stats, kidId, acadId) => (
    <View style={styles.tagsRow}>
      <View style={styles.tagsWrap}>
        {stats.carry > 0 && (
          <Tag bg={COLORS.blueBg} color={COLORS.blue} icon={<IconBox size={12} color={COLORS.blue} />}>
            이월 {stats.carry}
          </Tag>
        )}
        {stats.holOff > 0 && (
          <Tag bg={COLORS.redBg} color={COLORS.red}>
            공휴일 {stats.holOff}
          </Tag>
        )}
      </View>
      <Button title="⚖️ 정산" onPress={() => openSettle(kidId, acadId)} variant="outline" small />
    </View>
  );

  const renderSingleAcadCard = (kid, acad, showExpandButton = false, expandLabel = '▼ 전체 학원 보기') => {
    const stats = calcStats(data, y, m, kid.id, acad.id);
    const rate = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;
    const rc = rateColor(rate);
    const rb = rateBg(rate);

    return (
      <Card key={acad.id} borderColor={COLORS.borderWarm}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryLeft}>
            {getKidAvatar(kid.avatarId, 44)}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.kidName}>{kid.name}</Text>
              <View style={styles.acadLine}>
                {getAcadIcon(acad.iconId, 18)}
                <Text style={styles.acadName}>{acad.name}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.rateBadge, { backgroundColor: rb }]}>
            <Text style={[styles.rateText, { color: rc }]}>{rate}%</Text>
          </View>
        </View>

        <ProgressBar rate={rate} color={rc} />

        {renderSixStats(stats)}
        {renderTagsAndSettle(stats, kid.id, acad.id)}

        {showExpandButton && (
          <TouchableOpacity onPress={() => toggleExpand(kid.id)} style={styles.expandBtn} activeOpacity={0.7}>
            <Text style={styles.expandBtnText}>{expandLabel}</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderKidDashboard = (kid, acads) => {
    const selectedAcadId = kidAcadTab[kid.id] || acads[0]?.id;
    const expanded = expandedKids[kid.id];

    if (expanded) {
      return (
        <View key={kid.id}>
          {acads.map((acad) => renderSingleAcadCard(kid, acad, false))}
          <TouchableOpacity onPress={() => toggleExpand(kid.id)} style={styles.expandBtnCenter} activeOpacity={0.7}>
            <Text style={styles.expandBtnText}>▲ 접기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const acad = acads.find((a) => a.id === selectedAcadId) || acads[0];
    if (!acad) return null;

    return (
      <Card key={kid.id} borderColor={COLORS.borderWarm}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryLeft}>
            {getKidAvatar(kid.avatarId, 44)}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.kidName}>{kid.name}</Text>
              <View style={styles.acadLine}>
                {getAcadIcon(acad.iconId, 18)}
                <Text style={styles.acadName}>{acad.name}</Text>
              </View>
            </View>
          </View>

          {(() => {
            const stats = calcStats(data, y, m, kid.id, acad.id);
            const rate = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;
            const rc = rateColor(rate);
            const rb = rateBg(rate);

            return (
              <View style={[styles.rateBadge, { backgroundColor: rb }]}>
                <Text style={[styles.rateText, { color: rc }]}>{rate}%</Text>
              </View>
            );
          })()}
        </View>

        {acads.length > 1 && (
          <View style={{ marginTop: 8, marginBottom: 4 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.acadTabsRow}>
                {acads.map((a) => {
                  const isSel = a.id === selectedAcadId;
                  return (
                    <TouchableOpacity
                      key={a.id}
                      style={[styles.acadTab, isSel && styles.acadTabActive]}
                      onPress={() => setKidAcadTab((prev) => ({ ...prev, [kid.id]: a.id }))}
                      activeOpacity={0.7}
                    >
                      {getAcadIcon(a.iconId, 14)}
                      <Text style={[styles.acadTabText, isSel && { color: COLORS.white }]}>{a.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {(() => {
          const stats = calcStats(data, y, m, kid.id, acad.id);
          const rate = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;
          const rc = rateColor(rate);

          return (
            <>
              <ProgressBar rate={rate} color={rc} />
              {renderSixStats(stats)}
              {renderTagsAndSettle(stats, kid.id, acad.id)}
            </>
          );
        })()}

        <TouchableOpacity onPress={() => toggleExpand(kid.id)} style={styles.expandBtn} activeOpacity={0.7}>
          <Text style={styles.expandBtnText}>▼ 전체 학원 보기</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>오늘도 화이팅! 💪</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <FilterChip label="전체" active={filter === 'all'} onPress={() => setFilter('all')} />
        {pairs.map((p) => (
          <FilterChip
            key={`${p.kid.id}_${p.acad.id}`}
            label={`${p.kid.name} · ${p.acad.name}`}
            active={filter === `${p.kid.id}_${p.acad.id}`}
            onPress={() => setFilter(`${p.kid.id}_${p.acad.id}`)}
            icon={getKidAvatar(p.kid.avatarId, 18)}
          />
        ))}
      </ScrollView>

      {Object.values(kidGroups).map(({ kid, acads }) => renderKidDashboard(kid, acads))}

      <Calendar
        year={y}
        month={m}
        pairs={ap}
        data={data}
        onPrevYear={() => setCalMonth(new Date(y - 1, m, 1))}
        onPrev={() => setCalMonth(new Date(y, m - 1, 1))}
        onNext={() => setCalMonth(new Date(y, m + 1, 1))}
        onNextYear={() => setCalMonth(new Date(y + 1, m, 1))}
        onDayPress={openDay}
      />

      <View style={{ height: 100 }} />

      <Modal visible={!!dayModal} transparent animationType="slide" onRequestClose={closeDay}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              {dayModal &&
                (() => {
                  const date = new Date(dayModal + 'T00:00:00');
                  const dow2 = date.getDay();
                  const hn = holidayName(dayModal, data.customHolidays);
                  return (
                    <Text style={styles.sheetTitle}>
                      {date.getMonth() + 1}월 {date.getDate()}일 ({DW[dow2]}){hn ? ` · 🔴 ${hn}` : ''}
                    </Text>
                  );
                })()}
              <TouchableOpacity onPress={closeDay} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator style={{ maxHeight: Dimensions.get('window').height * 0.6 }}>
              {dayModal &&
                ap.map((p) => {
                  const date = new Date(dayModal + 'T00:00:00');
                  const dow2 = date.getDay();
                  const rec = getRecord(data, dayModal, p.kid.id, p.acad.id);
                  const activeDow = getDow(data, p.kid.id, p.acad.id, dayModal);
                  const sched = activeDow.includes(dow2) && !isHoliday(dayModal, data.customHolidays);
                  const schedH = activeDow.includes(dow2) && isHoliday(dayModal, data.customHolidays);

                  let statusEl;
                  if (sched) {
                    statusEl = rec.absent ? (
                      <Tag bg={COLORS.redBg} color={COLORS.red}>
                        ❌ 결석
                      </Tag>
                    ) : (
                      <Tag bg={COLORS.greenBg} color={COLORS.green}>
                        ✅ 출석
                      </Tag>
                    );
                  } else if (schedH) {
                    statusEl = (
                      <Tag bg={COLORS.redBg} color={COLORS.red}>
                        🔴 공휴일 휴강
                      </Tag>
                    );
                  } else {
                    statusEl = <Text style={{ fontSize: 12, color: COLORS.textMuted }}>수업 없는 날</Text>;
                  }

                  return (
                    <View key={`${p.kid.id}_${p.acad.id}`} style={styles.dayCard}>
                      <View style={styles.dayCardHeader}>
                        {getKidAvatar(p.kid.avatarId, 28)}
                        {getAcadIcon(p.acad.iconId, 20)}
                        <Text style={styles.dayCardTitle}>
                          {p.kid.name} · {p.acad.name}
                        </Text>
                      </View>

                      <View style={{ marginBottom: 10 }}>{statusEl}</View>

                      {sched && (
                        <View style={styles.dayRow}>
                          <Text style={styles.dayRowText}>❌ 미출석 처리</Text>
                          <Toggle value={!!rec.absent} onToggle={() => toggleAtt(dayModal, p.kid.id, p.acad.id, 'absent')} />
                        </View>
                      )}

                      <View style={styles.dayRow}>
                        <Text style={styles.dayRowText}>🔄 보강시행 (-1)</Text>
                        <Toggle
                          value={!!rec.makeupUsed}
                          onToggle={() => toggleAtt(dayModal, p.kid.id, p.acad.id, 'makeupUsed')}
                        />
                      </View>

                      <View style={[styles.dayRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.dayRowText}>⚡ 강제보강 (+1)</Text>
                        <Toggle
                          value={!!rec.makeupForced}
                          onToggle={() => toggleAtt(dayModal, p.kid.id, p.acad.id, 'makeupForced')}
                        />
                      </View>
                    </View>
                  );
                })}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={!!settleModal} transparent animationType="slide" onRequestClose={cancelSettle}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        >
          <View style={[styles.sheet, styles.settleSheet]}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>⚖️ 보강 정산</Text>
              <TouchableOpacity onPress={cancelSettle} style={styles.closePillBtn}>
                <Text style={styles.closePillBtnText}>취소</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={settleScrollRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.settleScrollContent}
            >
              {settleModal &&
                (() => {
                  const kid = data.kids.find((k) => k.id === settleModal.kidId);
                  const acad = data.academies.find((a) => a.id === settleModal.acadId);
                  const previewBalance = (settleModal.balance || 0) + settleDelta;

                  return (
                    <>
                      <View style={styles.settleTopInfo}>
                        <View style={styles.settleKidRow}>
                          {kid && getKidAvatar(kid.avatarId, 34)}
                          {acad && getAcadIcon(acad.iconId, 24)}
                          <Text style={styles.settleKidName}>
                            {kid?.name} · {acad?.name}
                          </Text>
                        </View>

                        <Text style={styles.settleSubLine}>
                          {y}년 {m + 1}월 기준 ·{' '}
                          <Text style={styles.currentCountText}>현재 {settleModal.balance}건</Text>
                        </Text>
                      </View>

                      <View style={styles.settleAdjustRow}>
                        <TouchableOpacity
                          style={styles.settleAdjustBtnLarge}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta - 1)}
                        >
                          <Text style={styles.settleAdjustBtnLargeText}>－</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setEditingSettle(true);
                            setTimeout(() => {
                              settleScrollRef.current?.scrollTo({ y: 180, animated: true });
                            }, 150);
                          }}
                          style={styles.settleNumberTap}
                        >
                          {editingSettle ? (
                            <TextInput
                              style={styles.settleManualInput}
                              value={settleManual}
                              onChangeText={applyManualSettle}
                              keyboardType="numbers-and-punctuation"
                              autoFocus
                              maxLength={5}
                              onBlur={finishManualEdit}
                              onSubmitEditing={finishManualEdit}
                              returnKeyType="done"
                            />
                          ) : (
                            <Text style={styles.settleNum}>{formatSigned(settleDelta)}</Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.settleAdjustBtnLarge}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta + 1)}
                        >
                          <Text style={styles.settleAdjustBtnLargeText}>＋</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.quickAdjustRow}>
                        <TouchableOpacity
                          style={styles.quickAdjustBtn}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta - 10)}
                        >
                          <Text style={styles.quickAdjustText}>-10</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickAdjustBtn}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta - 5)}
                        >
                          <Text style={styles.quickAdjustText}>-5</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickAdjustBtn}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta + 5)}
                        >
                          <Text style={styles.quickAdjustText}>+5</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.quickAdjustBtn}
                          activeOpacity={0.8}
                          onPress={() => updateSettleDelta(settleDelta + 10)}
                        >
                          <Text style={styles.quickAdjustText}>+10</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.settleGuideText}>
                        보강 필요분 추가는 +, 이미 사용한 보강 차감은 −
                      </Text>

                      <View style={styles.settlePreviewBox}>
                        <Text style={styles.settlePreviewText}>
                          반영 후 남은 보강: <Text style={styles.settlePreviewNum}>{previewBalance}건</Text>
                        </Text>
                      </View>

                      <Text style={styles.memoLabel}>사유 (선택)</Text>
                      <TextInput
                        style={styles.memoInput}
                        placeholder="예: 26년 3월까지 보강 정산"
                        placeholderTextColor={COLORS.textPlaceholder}
                        value={settleMemo}
                        onChangeText={setSettleMemo}
                        multiline
                        onFocus={() => {
                          setTimeout(() => {
                            settleScrollRef.current?.scrollToEnd({ animated: true });
                          }, 180);
                        }}
                      />

                      <View style={styles.sheetBtnRow}>
                        <TouchableOpacity style={styles.secondaryBtn} onPress={cancelSettle} activeOpacity={0.8}>
                          <Text style={styles.secondaryBtnText}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.primaryBtn} onPress={doSettle} activeOpacity={0.8}>
                          <Text style={styles.primaryBtnText}>정산 확인</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                })()}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  kidName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  acadLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  acadName: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  rateBadge: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  rateText: {
    fontSize: 17,
    fontWeight: '900',
  },
  acadTabsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  acadTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderWarm,
    backgroundColor: COLORS.white,
  },
  acadTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  acadTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  expandBtn: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primaryPale,
  },
  expandBtnCenter: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primaryPale,
  },
  expandBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    flex: 1,
    marginRight: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomWidth: 0,
  },
  settleSheet: {
    maxHeight: '92%',
    paddingBottom: 22,
  },
  settleScrollContent: {
    paddingBottom: 28,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMid,
  },
  closePillBtn: {
    minWidth: 62,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F9E6E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePillBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D64C55',
  },
  cancelBtn: {
    backgroundColor: COLORS.redBg,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.red,
  },
  dayCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dayCardTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.textDark,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  dayRowText: {
    fontSize: 13,
    color: COLORS.textMid,
  },
  settleTopInfo: {
    alignItems: 'center',
    marginBottom: 18,
  },
  settleKidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  settleKidName: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  settleSubLine: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  currentCountText: {
    color: COLORS.primaryDark,
    fontWeight: '900',
    fontSize: 16,
  },
  settleAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 8,
    marginBottom: 18,
  },
  settleAdjustBtnLarge: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settleAdjustBtnLargeText: {
    fontSize: 46,
    fontWeight: '800',
    color: COLORS.textMid,
    lineHeight: 50,
  },
  settleNumberTap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 94,
  },
  settleNum: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.primary,
    minWidth: 120,
    textAlign: 'center',
  },
  settleManualInput: {
    minWidth: 140,
    textAlign: 'center',
    fontSize: 50,
    fontWeight: '900',
    color: COLORS.primary,
    paddingVertical: 8,
  },
  quickAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: -4,
    marginBottom: 16,
  },
  quickAdjustBtn: {
    minWidth: 76,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: COLORS.bgWarm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  quickAdjustText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textMid,
  },
  settleGuideText: {
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.textMid,
    marginBottom: 14,
    fontWeight: '800',
    lineHeight: 22,
  },
  settlePreviewBox: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  settlePreviewText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  settlePreviewNum: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  memoLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textMid,
    marginBottom: 8,
  },
  memoInput: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: COLORS.textDark,
    minHeight: 110,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  sheetBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  secondaryBtn: {
    flex: 0.8,
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textMid,
  },
  primaryBtn: {
    flex: 1.6,
    height: 62,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
  },
});

export default MainScreen;