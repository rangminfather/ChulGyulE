import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';
import { generateId, ds2, normPeriod, periodList, hasCurrent, addDays, validatePeriods, saveData } from '../utils/data';
import { KID_AVATARS, ACADEMY_ICONS, getKidAvatar, getAcadIcon } from '../assets/avatars';
import { Card, CardTitle, FormInput, Button, DeleteBtn, Divider, ListItem, ToggleRow, DowGrid, Tag } from '../components/UIComponents';

const RegisterScreen = ({ data, setData }) => {
  const [kidName, setKidName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(KID_AVATARS[0].id);
  const [acadName, setAcadName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ACADEMY_ICONS[0].id);
  const [optAbsence, setOptAbsence] = useState(true);
  const [optHoliday, setOptHoliday] = useState(true);
  const [optCarry, setOptCarry] = useState(true);

  const save = (newData) => {
    setData(newData);
    saveData(newData);
  };

  // ─── Add Kid ───
  const addKid = () => {
    if (!kidName.trim()) { Alert.alert('알림', '이름을 입력해주세요'); return; }
    const id = generateId();
    const newData = { ...data };
    newData.kids = [...newData.kids, { id, name: kidName.trim(), avatarId: selectedAvatar }];
    newData.kidAcademies = { ...newData.kidAcademies, [id]: {} };
    setKidName('');
    save(newData);
  };

  const delKid = (id) => {
    Alert.alert('삭제', '정말 삭제할까요?', [
      { text: '취소' },
      { text: '삭제', style: 'destructive', onPress: () => {
        const newData = { ...data };
        newData.kids = newData.kids.filter(x => x.id !== id);
        delete newData.kidAcademies[id];
        save(newData);
      }},
    ]);
  };

  // ─── Add Academy ───
  const addAcad = () => {
    if (!acadName.trim()) { Alert.alert('알림', '학원 이름을 입력해주세요'); return; }
    const newData = { ...data };
    newData.academies = [...newData.academies, {
      id: generateId(),
      name: acadName.trim(),
      iconId: selectedIcon,
      optAbsenceMakeup: optAbsence,
      optHolidayMakeup: optHoliday,
      optCarryOver: optCarry,
    }];
    setAcadName('');
    save(newData);
  };

  const delAcad = (id) => {
    Alert.alert('삭제', '정말 삭제할까요?', [
      { text: '취소' },
      { text: '삭제', style: 'destructive', onPress: () => {
        const newData = { ...data };
        newData.academies = newData.academies.filter(x => x.id !== id);
        Object.keys(newData.kidAcademies).forEach(kid => {
          if (newData.kidAcademies[kid][id]) delete newData.kidAcademies[kid][id];
        });
        save(newData);
      }},
    ]);
  };

  // ─── Link toggle ───
  const toggleLink = (ki, ai) => {
    const newData = { ...data };
    if (!newData.kidAcademies[ki]) newData.kidAcademies[ki] = {};
    if (newData.kidAcademies[ki][ai]) {
      Alert.alert('연결 해제', '연결을 해제할까요?\n(출결 데이터는 유지됩니다)', [
        { text: '취소' },
        { text: '해제', onPress: () => {
          delete newData.kidAcademies[ki][ai];
          save(newData);
        }},
      ]);
    } else {
      newData.kidAcademies[ki][ai] = { periods: [normPeriod({ from: ds2(new Date()), to: null, dow: [] })] };
      save(newData);
    }
  };

  // ─── Period management ───
  const addPeriod = (ki, ai) => {
    const newData = { ...data };
    const ps = periodList(newData, ki, ai);
    const last = ps[ps.length-1];
    ps.push(normPeriod({
      from: last && last.to ? addDays(last.to, 1) : ds2(new Date()),
      to: null,
      dow: last ? [...last.dow] : [],
    }));
    save(newData);
  };

  const delPeriod = (ki, ai, pid) => {
    const newData = { ...data };
    const ps = periodList(newData, ki, ai);
    if (ps.length === 1) { Alert.alert('알림', '최소 1개 구간은 남아야 해요'); return; }
    Alert.alert('삭제', '이 구간을 삭제할까요?', [
      { text: '취소' },
      { text: '삭제', onPress: () => {
        newData.kidAcademies[ki][ai].periods = ps.filter(p => p.id !== pid);
        save(newData);
      }},
    ]);
  };

  const toggleDow = (ki, ai, pid, dowIdx) => {
    const newData = { ...data };
    const p = periodList(newData, ki, ai).find(x => x.id === pid);
    if (!p) return;
    const idx = p.dow.indexOf(dowIdx);
    if (idx >= 0) p.dow.splice(idx, 1);
    else p.dow.push(dowIdx);
    p.dow.sort((a,b) => a - b);
    save(newData);
  };

  const toggleOngoing = (ki, ai, pid) => {
    const newData = { ...data };
    const p = periodList(newData, ki, ai).find(x => x.id === pid);
    if (!p) return;
    p.to = p.to ? null : ds2(new Date());
    save(newData);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* ═══ Kids ═══ */}
      <Card borderColor={COLORS.borderWarm}>
        <CardTitle>👶 아이 등록</CardTitle>
        {data.kids.length === 0
          ? <Text style={styles.emptySmall}>등록된 아이가 없습니다</Text>
          : data.kids.map(k => (
            <ListItem key={k.id} left={getKidAvatar(k.avatarId, 36)} right={<DeleteBtn onPress={() => delKid(k.id)} />}>
              <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.textDark }}>{k.name}</Text>
            </ListItem>
          ))
        }
        <Divider />
        <FormInput label="이름" placeholder="아이 이름" value={kidName} onChangeText={setKidName} />
        <Text style={styles.sectionLabel}>아바타 선택</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
            {KID_AVATARS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[styles.avatarOpt, selectedAvatar === a.id && styles.avatarOptSel]}
                onPress={() => setSelectedAvatar(a.id)}
              >
                {a.render(38)}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Button title="+ 아이 추가" onPress={addKid} variant="primary" full />
      </Card>

      {/* ═══ Academies ═══ */}
      <Card borderColor={COLORS.borderWarm}>
        <CardTitle>🏫 학원 등록</CardTitle>
        {data.academies.length === 0
          ? <Text style={styles.emptySmall}>등록된 학원이 없습니다</Text>
          : data.academies.map(a => (
            <ListItem key={a.id} left={getAcadIcon(a.iconId, 28)} right={<DeleteBtn onPress={() => delAcad(a.id)} />}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: COLORS.textDark }}>{a.name}</Text>
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                {a.optAbsenceMakeup && <Tag bg={COLORS.greenBg} color={COLORS.green}>결석보강</Tag>}
                {a.optHolidayMakeup && <Tag bg={COLORS.amberBg} color={COLORS.amber}>공휴일보강</Tag>}
                {a.optCarryOver && <Tag bg={COLORS.blueBg} color={COLORS.blue}>이월</Tag>}
              </View>
            </ListItem>
          ))
        }
        <Divider />
        <FormInput label="학원 이름" placeholder="학원 이름" value={acadName} onChangeText={setAcadName} />
        <Text style={styles.sectionLabel}>아이콘 선택</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
            {ACADEMY_ICONS.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[styles.iconOpt, selectedIcon === a.id && styles.iconOptSel]}
                onPress={() => setSelectedIcon(a.id)}
              >
                {a.render(32)}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <ToggleRow label="미출석 시 보강 인정" value={optAbsence} onToggle={() => setOptAbsence(!optAbsence)} />
        <ToggleRow label="공휴일 휴강 시 보강" value={optHoliday} onToggle={() => setOptHoliday(!optHoliday)} />
        <ToggleRow label="남은 보강 이월" value={optCarry} onToggle={() => setOptCarry(!optCarry)} />
        <Button title="+ 학원 추가" onPress={addAcad} variant="primary" full style={{ marginTop: 8 }} />
      </Card>

      {/* ═══ Linking ═══ */}
      <Card borderColor={COLORS.borderWarm}>
        <CardTitle>🔗 아이 — 학원 연결 & 요일 설정</CardTitle>
        <Text style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 12 }}>
          아이별로 학원을 선택하고, 수업 요일을 설정하세요
        </Text>
        {(!data.kids.length || !data.academies.length) ? (
          <Text style={styles.emptySmall}>아이와 학원을 먼저 등록하세요</Text>
        ) : data.kids.map(k => {
          const ka = data.kidAcademies[k.id] || {};
          return (
            <View key={k.id} style={styles.linkKidBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {getKidAvatar(k.avatarId, 28)}
                <Text style={{ fontWeight: '800', fontSize: 15, color: COLORS.textDark }}>{k.name}</Text>
              </View>
              {data.academies.map(a => {
                const linked = !!ka[a.id];
                const ps = linked ? periodList(data, k.id, a.id) : [];
                const current = linked && hasCurrent(data, k.id, a.id);
                return (
                  <View key={a.id} style={[styles.linkBox, linked && styles.linkBoxActive]}>
                    <TouchableOpacity style={styles.linkHeader} onPress={() => toggleLink(k.id, a.id)}>
                      <View style={[styles.checkbox, linked && styles.checkboxActive]}>
                        {linked && <Text style={{ color: '#FFF', fontSize: 12 }}>✓</Text>}
                      </View>
                      {getAcadIcon(a.iconId, 20)}
                      <Text style={{ fontWeight: '600', fontSize: 13, color: COLORS.textDark }}>{a.name}</Text>
                    </TouchableOpacity>
                    {linked && (
                      <View style={{ marginTop: 8 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Tag bg={current ? COLORS.greenBg : COLORS.amberBg} color={current ? COLORS.green : COLORS.amber}>
                            {current ? '현재 연결' : '과거 이력만'}
                          </Tag>
                          <Button title="+ 구간 추가" onPress={() => addPeriod(k.id, a.id)} variant="outline" small />
                        </View>
                        {ps.map((p, idx) => (
                          <View key={p.id} style={[styles.periodItem, !p.to && styles.periodItemCurrent]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textDark }}>구간 {idx+1}</Text>
                              <DeleteBtn onPress={() => delPeriod(k.id, a.id, p.id)} />
                            </View>
                            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                              <View style={{ flex: 1 }}>
                                <FormInput
                                  label="시작일"
                                  placeholder="YYYY-MM-DD"
                                  value={p.from || ''}
                                  onChangeText={(val) => {
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(val) || val === '') {
                                      const newData = { ...data };
                                      const pp = periodList(newData, k.id, a.id).find(x => x.id === p.id);
                                      if (pp) { pp.from = val || ds2(new Date()); save(newData); }
                                    }
                                  }}
                                  onEndEditing={(e) => {
                                    const val = e.nativeEvent.text;
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                                      const newData = { ...data };
                                      const pp = periodList(newData, k.id, a.id).find(x => x.id === p.id);
                                      if (pp) { pp.from = val; save(newData); }
                                    }
                                  }}
                                  keyboardType="numbers-and-punctuation"
                                />
                              </View>
                              <View style={{ flex: 1 }}>
                                <FormInput
                                  label="종료일"
                                  placeholder={!p.to ? '계속' : 'YYYY-MM-DD'}
                                  value={p.to || ''}
                                  editable={!!p.to}
                                  onChangeText={(val) => {
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(val) || val === '') {
                                      const newData = { ...data };
                                      const pp = periodList(newData, k.id, a.id).find(x => x.id === p.id);
                                      if (pp) { pp.to = val || null; save(newData); }
                                    }
                                  }}
                                  onEndEditing={(e) => {
                                    const val = e.nativeEvent.text;
                                    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                                      const newData = { ...data };
                                      const pp = periodList(newData, k.id, a.id).find(x => x.id === p.id);
                                      if (pp) { pp.to = val; save(newData); }
                                    }
                                  }}
                                  keyboardType="numbers-and-punctuation"
                                />
                              </View>
                            </View>
                            <ToggleRow label="계속 (종료일 없음)" value={!p.to} onToggle={() => toggleOngoing(k.id, a.id, p.id)} />
                            <DowGrid selected={p.dow} onToggle={(dowIdx) => toggleDow(k.id, a.id, p.id, dowIdx)} />
                          </View>
                        ))}
                      </View>
                    )}
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
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptySmall: {
    fontSize: 12,
    color: COLORS.textMuted,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  avatarOpt: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgWarm,
    overflow: 'hidden',
  },
  avatarOptSel: {
    borderColor: COLORS.primary,
    borderWidth: 3,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  iconOpt: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgWarm,
    overflow: 'hidden',
  },
  iconOptSel: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  linkKidBlock: {
    backgroundColor: COLORS.bgWarm,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 10,
  },
  linkBox: {
    marginBottom: 8,
    padding: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  linkBoxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPale + '40',
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodItem: {
    backgroundColor: COLORS.bgWarm,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodItemCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryPale + '30',
  },
});

export default RegisterScreen;