import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, SIZES } from '../utils/theme';
import {
  DW,
  TIME_OPTIONS,
  addDays,
  ds2,
  formatTimeRange,
  generateId,
  getPeriodDayTime,
  hasCurrent,
  normPeriod,
  periodList,
  saveData,
  setPeriodDayTime,
  timeToMinutes,
  validatePeriods,
} from '../utils/data';
import { ACADEMY_ICONS, KID_AVATARS, getAcadIcon, getKidAvatar } from '../assets/avatars';
import {
  Button,
  Card,
  CardTitle,
  DeleteBtn,
  Divider,
  DowGrid,
  FormInput,
  ListItem,
  Tag,
  ToggleRow,
} from '../components/UIComponents';
import Calendar from '../components/Calendar';

const RegisterScreen = ({ data, setData }) => {
  const [datePicker, setDatePicker] = useState(null);
  const [pickerMonth, setPickerMonth] = useState(new Date());
  const [timeEditor, setTimeEditor] = useState(null);
  const [kidName, setKidName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(KID_AVATARS[0].id);
  const [acadName, setAcadName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ACADEMY_ICONS[0].id);
  const [optAbsence, setOptAbsence] = useState(true);
  const [optHoliday, setOptHoliday] = useState(true);
  const [optCarry, setOptCarry] = useState(true);

  const save = (nextData) => {
    setData(nextData);
    saveData(nextData);
  };

  const saveKid = () => {
    if (!kidName.trim()) return Alert.alert('알림', '아이 이름을 입력해 주세요');
    const id = generateId();
    const next = { ...data, kids: [...data.kids, { id, name: kidName.trim(), avatarId: selectedAvatar }] };
    next.kidAcademies = { ...data.kidAcademies, [id]: {} };
    setKidName('');
    save(next);
  };

  const saveAcademy = () => {
    if (!acadName.trim()) return Alert.alert('알림', '학원 이름을 입력해 주세요');
    const next = {
      ...data,
      academies: [...data.academies, {
        id: generateId(),
        name: acadName.trim(),
        iconId: selectedIcon,
        optAbsenceMakeup: optAbsence,
        optHolidayMakeup: optHoliday,
        optCarryOver: optCarry,
      }],
    };
    setAcadName('');
    save(next);
  };

  const removeKid = (kidId) => {
    Alert.alert('삭제', '아이를 삭제할까요?', [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const next = { ...data, kids: data.kids.filter((kid) => kid.id !== kidId) };
          next.kidAcademies = { ...data.kidAcademies };
          delete next.kidAcademies[kidId];
          save(next);
        },
      },
    ]);
  };

  const removeAcademy = (acadId) => {
    Alert.alert('삭제', '학원을 삭제할까요?', [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          const next = { ...data, academies: data.academies.filter((academy) => academy.id !== acadId) };
          next.kidAcademies = { ...data.kidAcademies };
          Object.keys(next.kidAcademies).forEach((kidId) => {
            if (next.kidAcademies[kidId]?.[acadId]) delete next.kidAcademies[kidId][acadId];
          });
          save(next);
        },
      },
    ]);
  };

  const toggleLink = (kidId, acadId) => {
    const next = { ...data, kidAcademies: { ...data.kidAcademies } };
    if (!next.kidAcademies[kidId]) next.kidAcademies[kidId] = {};
    if (next.kidAcademies[kidId][acadId]) {
      return Alert.alert('연결 해제', '아이와 학원 연결을 해제할까요?', [
        { text: '취소' },
        { text: '해제', onPress: () => { delete next.kidAcademies[kidId][acadId]; save(next); } },
      ]);
    }
    next.kidAcademies[kidId][acadId] = { periods: [normPeriod({ from: ds2(new Date()), to: null, dow: [] })] };
    save(next);
  };

  const addPeriod = (kidId, acadId) => {
    const next = { ...data };
    const periods = periodList(next, kidId, acadId);
    const last = periods[periods.length - 1];
    periods.push(normPeriod({
      from: last?.to ? addDays(last.to, 1) : ds2(new Date()),
      to: null,
      dow: last ? [...last.dow] : [],
      dayTimes: last?.dayTimes || {},
    }));
    save(next);
  };

  const removePeriod = (kidId, acadId, periodId) => {
    const next = { ...data };
    const periods = periodList(next, kidId, acadId);
    if (periods.length === 1) return Alert.alert('알림', '최소 1개 구간은 남아 있어야 합니다');
    next.kidAcademies[kidId][acadId].periods = periods.filter((period) => period.id !== periodId);
    save(next);
  };

  const updatePeriodDate = (kidId, acadId, periodId, field, value) => {
    const next = { ...data };
    const period = periodList(next, kidId, acadId).find((item) => item.id === periodId);
    if (!period) return;
    period[field] = value;
    const error = validatePeriods(next, kidId, acadId);
    if (error) return Alert.alert('날짜 오류', error);
    save(next);
  };

  const toggleDow = (kidId, acadId, periodId, dow) => {
    const next = { ...data };
    const period = periodList(next, kidId, acadId).find((item) => item.id === periodId);
    if (!period) return;
    const exists = period.dow.includes(dow);
    period.dow = exists ? period.dow.filter((item) => item !== dow) : [...period.dow, dow].sort((a, b) => a - b);
    save(next);
  };

  const toggleOngoing = (kidId, acadId, periodId) => {
    const next = { ...data };
    const period = periodList(next, kidId, acadId).find((item) => item.id === periodId);
    if (!period) return;
    period.to = period.to ? null : ds2(new Date());
    save(next);
  };

  const openTimeEditor = (kidId, acadId, periodId, dow) => {
    const period = periodList(data, kidId, acadId).find((item) => item.id === periodId);
    const current = getPeriodDayTime(period, dow);
    setTimeEditor({ kidId, acadId, periodId, dow, start: current.start, end: current.end, applyDays: [] });
  };

  const applyDays = useMemo(() => {
    if (!timeEditor) return [];
    const period = periodList(data, timeEditor.kidId, timeEditor.acadId).find((item) => item.id === timeEditor.periodId);
    return (period?.dow || []).filter((dow) => dow !== timeEditor.dow);
  }, [data, timeEditor]);

  const saveTime = () => {
    if (!timeEditor) return;
    if ((timeEditor.start && !timeEditor.end) || (!timeEditor.start && timeEditor.end)) {
      return Alert.alert('시간 설정', '시작 시간과 종료 시간을 모두 선택해 주세요');
    }
    if (timeEditor.start && timeEditor.end && timeToMinutes(timeEditor.start) >= timeToMinutes(timeEditor.end)) {
      return Alert.alert('시간 설정', '종료 시간은 시작 시간보다 늦어야 합니다');
    }
    const next = { ...data };
    const period = periodList(next, timeEditor.kidId, timeEditor.acadId).find((item) => item.id === timeEditor.periodId);
    if (!period) return;
    setPeriodDayTime(period, timeEditor.dow, { start: timeEditor.start, end: timeEditor.end });
    timeEditor.applyDays.forEach((dow) => setPeriodDayTime(period, dow, { start: timeEditor.start, end: timeEditor.end }));
    save(next);
    setTimeEditor(null);
  };

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Card borderColor={COLORS.borderWarm}>
            <CardTitle>아이 등록</CardTitle>
            {data.kids.length === 0 ? <Text style={styles.emptyText}>등록된 아이가 없습니다</Text> : data.kids.map((kid) => (
              <ListItem key={kid.id} left={getKidAvatar(kid.avatarId, 36)} right={<DeleteBtn onPress={() => removeKid(kid.id)} />}>
                <Text style={styles.titleText}>{kid.name}</Text>
              </ListItem>
            ))}
            <Divider />
            <FormInput label="이름" placeholder="아이 이름" value={kidName} onChangeText={setKidName} />
            <Text style={styles.sectionLabel}>아바타 선택</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.optionRow}>
                {KID_AVATARS.map((avatar) => (
                  <TouchableOpacity key={avatar.id} style={[styles.avatarOpt, selectedAvatar === avatar.id && styles.selectedOpt]} onPress={() => setSelectedAvatar(avatar.id)}>
                    {avatar.render(38)}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Button title="+ 아이 추가" onPress={saveKid} variant="primary" full />
          </Card>

          <Card borderColor={COLORS.borderWarm}>
            <CardTitle>학원 등록</CardTitle>
            {data.academies.length === 0 ? <Text style={styles.emptyText}>등록된 학원이 없습니다</Text> : data.academies.map((academy) => (
              <ListItem key={academy.id} left={getAcadIcon(academy.iconId, 28)} right={<DeleteBtn onPress={() => removeAcademy(academy.id)} />}>
                <Text style={styles.titleText}>{academy.name}</Text>
                <View style={styles.tagRow}>
                  {academy.optAbsenceMakeup && <Tag bg={COLORS.greenBg} color={COLORS.green}>결석보강</Tag>}
                  {academy.optHolidayMakeup && <Tag bg={COLORS.amberBg} color={COLORS.amber}>공휴일보강</Tag>}
                  {academy.optCarryOver && <Tag bg={COLORS.blueBg} color={COLORS.blue}>이월</Tag>}
                </View>
              </ListItem>
            ))}
            <Divider />
            <FormInput label="학원 이름" placeholder="학원 이름" value={acadName} onChangeText={setAcadName} />
            <Text style={styles.sectionLabel}>아이콘 선택</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={styles.optionRow}>
                {ACADEMY_ICONS.map((icon) => (
                  <TouchableOpacity key={icon.id} style={[styles.iconOpt, selectedIcon === icon.id && styles.selectedOpt]} onPress={() => setSelectedIcon(icon.id)}>
                    {icon.render(32)}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <ToggleRow label="결석 시 보강 인정" value={optAbsence} onToggle={() => setOptAbsence(!optAbsence)} />
            <ToggleRow label="공휴일 보강 인정" value={optHoliday} onToggle={() => setOptHoliday(!optHoliday)} />
            <ToggleRow label="잔여 보강 이월" value={optCarry} onToggle={() => setOptCarry(!optCarry)} />
            <Button title="+ 학원 추가" onPress={saveAcademy} variant="primary" full style={{ marginTop: 8 }} />
          </Card>

          <Card borderColor={COLORS.borderWarm}>
            <CardTitle>아이-학원 연결</CardTitle>
            <Text style={styles.desc}>요일을 고른 뒤 각 요일별 시간대를 설정할 수 있습니다.</Text>
            {(!data.kids.length || !data.academies.length) ? <Text style={styles.emptyText}>아이와 학원을 먼저 등록해 주세요</Text> : data.kids.map((kid) => {
              const kidLinks = data.kidAcademies[kid.id] || {};
              return (
                <View key={kid.id} style={styles.kidBlock}>
                  <View style={styles.kidHeader}>
                    {getKidAvatar(kid.avatarId, 28)}
                    <Text style={styles.kidHeaderText}>{kid.name}</Text>
                  </View>
                  {data.academies.map((academy) => {
                    const linked = !!kidLinks[academy.id];
                    const periods = linked ? periodList(data, kid.id, academy.id) : [];
                    return (
                      <View key={academy.id} style={[styles.linkBox, linked && styles.linkBoxActive]}>
                        <TouchableOpacity style={styles.linkHeader} onPress={() => toggleLink(kid.id, academy.id)}>
                          <View style={[styles.check, linked && styles.checkActive]}>{linked ? <Text style={styles.checkText}>✓</Text> : null}</View>
                          {getAcadIcon(academy.iconId, 20)}
                          <Text style={styles.linkTitle}>{academy.name}</Text>
                        </TouchableOpacity>
                        {linked ? (
                          <View style={{ marginTop: 8 }}>
                            <View style={styles.linkMetaRow}>
                              <Tag bg={hasCurrent(data, kid.id, academy.id) ? COLORS.greenBg : COLORS.amberBg} color={hasCurrent(data, kid.id, academy.id) ? COLORS.green : COLORS.amber}>
                                {hasCurrent(data, kid.id, academy.id) ? '현재 연결' : '과거 이력'}
                              </Tag>
                              <Button title="+ 구간 추가" onPress={() => addPeriod(kid.id, academy.id)} variant="outline" small />
                            </View>
                            {periods.map((period, idx) => (
                              <View key={period.id} style={[styles.periodBox, !period.to && styles.periodCurrent]}>
                                <View style={styles.periodHeader}>
                                  <Text style={styles.periodTitle}>구간 {idx + 1}</Text>
                                  <DeleteBtn onPress={() => removePeriod(kid.id, academy.id, period.id)} />
                                </View>
                                <View style={styles.dateRow}>
                                  <TouchableOpacity style={styles.dateBtn} onPress={() => { setPickerMonth(new Date(`${period.from}T00:00:00`)); setDatePicker({ kidId: kid.id, acadId: academy.id, periodId: period.id, field: 'from' }); }}>
                                    <Text style={styles.dateLabel}>시작일</Text>
                                    <Text style={styles.dateValue}>{period.from}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[styles.dateBtn, !period.to && styles.dateBtnDim]} disabled={!period.to} onPress={() => { setPickerMonth(period.to ? new Date(`${period.to}T00:00:00`) : new Date()); setDatePicker({ kidId: kid.id, acadId: academy.id, periodId: period.id, field: 'to' }); }}>
                                    <Text style={styles.dateLabel}>종료일</Text>
                                    <Text style={styles.dateValue}>{period.to || '계속'}</Text>
                                  </TouchableOpacity>
                                </View>
                                <ToggleRow label="계속 진행 중" value={!period.to} onToggle={() => toggleOngoing(kid.id, academy.id, period.id)} />
                                <DowGrid selected={period.dow} onToggle={(dow) => toggleDow(kid.id, academy.id, period.id, dow)} />
                                <View style={styles.timeList}>
                                  {period.dow.map((dow) => {
                                    const time = getPeriodDayTime(period, dow);
                                    return (
                                      <TouchableOpacity key={`${period.id}_${dow}`} style={styles.timeRow} onPress={() => openTimeEditor(kid.id, academy.id, period.id, dow)}>
                                        <View>
                                          <Text style={styles.timeDay}>{DW[dow]}</Text>
                                          <Text style={styles.timeValue}>{formatTimeRange(time.start, time.end)}</Text>
                                        </View>
                                        <Text style={styles.timeAction}>{time.start && time.end ? '수정' : '설정'}</Text>
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </Card>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={!!datePicker} transparent animationType="slide" onRequestClose={() => setDatePicker(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{datePicker?.field === 'from' ? '시작일 선택' : '종료일 선택'}</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setDatePicker(null)}><Text style={styles.closeText}>닫기</Text></TouchableOpacity>
            </View>
            <Calendar
              year={pickerMonth.getFullYear()}
              month={pickerMonth.getMonth()}
              pairs={[]}
              data={data}
              onPrevYear={() => setPickerMonth(new Date(pickerMonth.getFullYear() - 1, pickerMonth.getMonth(), 1))}
              onPrev={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1))}
              onNext={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1))}
              onNextYear={() => setPickerMonth(new Date(pickerMonth.getFullYear() + 1, pickerMonth.getMonth(), 1))}
              onDayPress={(value) => {
                if (!datePicker) return;
                updatePeriodDate(datePicker.kidId, datePicker.acadId, datePicker.periodId, datePicker.field, value);
                setDatePicker(null);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal visible={!!timeEditor} transparent animationType="slide" onRequestClose={() => setTimeEditor(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{timeEditor ? `${DW[timeEditor.dow]}요일 시간 설정` : '시간 설정'}</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setTimeEditor(null)}><Text style={styles.closeText}>닫기</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>시작 시간</Text>
              <View style={styles.optionGrid}>
                {TIME_OPTIONS.map((option) => (
                  <TouchableOpacity key={`start_${option}`} style={[styles.timeChip, timeEditor?.start === option && styles.timeChipActive]} onPress={() => setTimeEditor((prev) => ({ ...prev, start: option }))}>
                    <Text style={[styles.timeChipText, timeEditor?.start === option && styles.timeChipTextActive]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalLabel}>종료 시간</Text>
              <View style={styles.optionGrid}>
                {TIME_OPTIONS.map((option) => (
                  <TouchableOpacity key={`end_${option}`} style={[styles.timeChip, timeEditor?.end === option && styles.timeChipActive]} onPress={() => setTimeEditor((prev) => ({ ...prev, end: option }))}>
                    <Text style={[styles.timeChipText, timeEditor?.end === option && styles.timeChipTextActive]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.modalLabel}>다른 요일에도 일괄 적용</Text>
              <View style={styles.applyRow}>
                {applyDays.map((dow) => {
                  const active = !!timeEditor?.applyDays.includes(dow);
                  return (
                    <TouchableOpacity key={`apply_${dow}`} style={[styles.applyChip, active && styles.applyChipActive]} onPress={() => setTimeEditor((prev) => ({ ...prev, applyDays: active ? prev.applyDays.filter((item) => item !== dow) : [...prev.applyDays, dow].sort((a, b) => a - b) }))}>
                      <Text style={[styles.applyChipText, active && styles.applyChipTextActive]}>{DW[dow]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>미리보기</Text>
                <Text style={styles.previewValue}>{formatTimeRange(timeEditor?.start, timeEditor?.end)}</Text>
              </View>
              <View style={styles.modalButtons}>
                <Button title="시간 지우기" onPress={() => setTimeEditor((prev) => ({ ...prev, start: '', end: '', applyDays: [] }))} variant="outline" full />
                <Button title="저장" onPress={saveTime} variant="primary" full />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16, paddingTop: 12 },
  emptyText: { fontSize: 12, color: COLORS.textMuted, paddingVertical: 8 },
  titleText: { fontWeight: '700', fontSize: 14, color: COLORS.textDark },
  desc: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  optionRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  avatarOpt: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgWarm, overflow: 'hidden' },
  iconOpt: { width: 46, height: 46, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgWarm, overflow: 'hidden' },
  selectedOpt: { borderColor: COLORS.primary, borderWidth: 3 },
  tagRow: { flexDirection: 'row', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  kidBlock: { backgroundColor: COLORS.bgWarm, borderRadius: SIZES.radius, padding: 12, marginBottom: 10 },
  kidHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  kidHeaderText: { fontWeight: '800', fontSize: 15, color: COLORS.textDark },
  linkBox: { marginBottom: 8, padding: 10, borderRadius: SIZES.radius, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgCard },
  linkBoxActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale + '40' },
  linkHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.textLight, alignItems: 'center', justifyContent: 'center' },
  checkActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  linkTitle: { fontWeight: '600', fontSize: 13, color: COLORS.textDark },
  linkMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  periodBox: { backgroundColor: COLORS.bgWarm, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  periodCurrent: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale + '30' },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  periodTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textDark },
  dateRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dateBtn: { flex: 1, minHeight: 54, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.white, paddingHorizontal: 12, justifyContent: 'center' },
  dateBtnDim: { opacity: 0.7, backgroundColor: COLORS.bgWarm },
  dateLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4, fontWeight: '700' },
  dateValue: { fontSize: 13, color: COLORS.textDark, fontWeight: '600' },
  timeList: { marginTop: 10, gap: 8 },
  timeRow: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeDay: { fontSize: 12, fontWeight: '800', color: COLORS.textDark, marginBottom: 3 },
  timeValue: { fontSize: 13, color: COLORS.primaryDark, fontWeight: '700' },
  timeAction: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  overlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, paddingHorizontal: 16, paddingBottom: 24, maxHeight: '88%' },
  handle: { width: 46, height: 5, borderRadius: 3, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
  closeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: COLORS.primaryPale },
  closeText: { color: COLORS.primaryDark, fontWeight: '700', fontSize: 12 },
  modalLabel: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginTop: 12, marginBottom: 8 },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { width: '22%', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgWarm, alignItems: 'center' },
  timeChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  timeChipText: { fontSize: 12, fontWeight: '700', color: COLORS.textMid },
  timeChipTextActive: { color: COLORS.white },
  applyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  applyChip: { minWidth: 48, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgWarm, alignItems: 'center' },
  applyChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale },
  applyChipText: { fontSize: 12, fontWeight: '700', color: COLORS.textMid },
  applyChipTextActive: { color: COLORS.primaryDark },
  previewBox: { marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: COLORS.primaryPale, alignItems: 'center' },
  previewLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  previewValue: { fontSize: 18, fontWeight: '900', color: COLORS.primaryDark },
  modalButtons: { gap: 10, marginTop: 16, marginBottom: 16 },
});

export default RegisterScreen;
