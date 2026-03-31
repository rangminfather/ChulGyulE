import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Share,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Updates from 'expo-updates';
import { COLORS } from '../utils/theme';
import {
  ds2,
  saveData,
  exportData,
  importData,
  createDefaultData,
} from '../utils/data';
import {
  Card,
  CardTitle,
  FormInput,
  Button,
  DeleteBtn,
  Divider,
  ListItem,
} from '../components/UIComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_VERSION, CHANGELOG } from '../constants/version';

const BACKUP_LIST_KEY = 'chulgyule_backups';

const SettingsScreen = ({ data, setData }) => {
  const [holDate, setHolDate] = useState('');
  const [holName, setHolName] = useState('');
  const [backups, setBackups] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null); // 'none' | 'available' | 'error'
  const [pasteBackup, setPasteBackup] = useState('');
  useEffect(() => {
    loadBackups();
  }, []);

  const save = (newData) => {
    setData(newData);
    saveData(newData);
  };

  // ─── OTA Update ───
  const checkForUpdate = async () => {
    if (updating) return;

    setUpdating(true);
    setUpdateStatus(null);

    try {
      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        setUpdateStatus('none');
        Alert.alert('최신 버전', '현재 최신 버전을 사용 중입니다! ✅');
        setUpdating(false);
        return;
      }

      setUpdateStatus('available');

      Alert.alert(
        '새 업데이트 발견!',
        '최신 버전을 다운로드하시겠습니까?',
        [
          {
            text: '나중에',
            style: 'cancel',
            onPress: () => setUpdating(false),
          },
          {
            text: '업데이트',
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                Alert.alert('업데이트 완료', '앱을 재시작합니다.', [
                  {
                    text: '확인',
                    onPress: async () => {
                      await Updates.reloadAsync();
                    },
                  },
                ]);
              } catch (e) {
                setUpdateStatus('error');
                Alert.alert(
                  '업데이트 다운로드 오류',
                  e?.message || '업데이트 다운로드 중 오류가 발생했습니다.'
                );
                setUpdating(false);
              }
            },
          },
        ]
      );
    } catch (e) {
      setUpdateStatus('error');

      if (__DEV__) {
        Alert.alert(
          '개발 모드',
          'OTA 업데이트는 빌드된 APK에서만 동작합니다.\n개발 모드에서는 자동으로 최신 코드가 반영됩니다.'
        );
      } else {
        Alert.alert(
          '업데이트 확인 오류',
          e?.message || '업데이트 확인 중 오류가 발생했습니다.'
        );
      }

      setUpdating(false);
    }
  };

  // ─── Backup System ───
  const loadBackups = async () => {
    try {
      const raw = await AsyncStorage.getItem(BACKUP_LIST_KEY);
      if (raw) setBackups(JSON.parse(raw));
    } catch (e) {}
  };

  const saveBackupList = async (list) => {
    await AsyncStorage.setItem(BACKUP_LIST_KEY, JSON.stringify(list));
    setBackups(list);
  };

  const doBackup = async () => {
    try {
      const json = exportData(data);
      const now = new Date();
      const label = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const key = `backup_${Date.now()}`;

      await AsyncStorage.setItem(key, json);

      const newList = [
        {
          key,
          label,
          date: now.toISOString(),
          kids: data.kids.length,
          academies: data.academies.length,
        },
        ...backups,
      ].slice(0, 20);

      await saveBackupList(newList);
      Alert.alert('백업 완료', `"${label}" 백업이 저장되었습니다.`);
    } catch (e) {
      Alert.alert('오류', e.message);
    }
  };

  const doRestore = async (backup) => {
    Alert.alert(
      '복원',
      `"${backup.label}" 백업을 복원하시겠습니까?\n현재 데이터가 덮어씌워집니다.`,
      [
        { text: '취소' },
        {
          text: '복원',
          onPress: async () => {
            try {
              const raw = await AsyncStorage.getItem(backup.key);
              if (!raw) {
                Alert.alert('오류', '백업 데이터를 찾을 수 없습니다');
                return;
              }

              const result = importData(raw);

              if (result.success) {
                save(result.data);
                Alert.alert('완료', '데이터가 복원되었습니다!');
              } else {
                Alert.alert('오류', result.error);
              }
            } catch (e) {
              Alert.alert('오류', e.message);
            }
          },
        },
      ]
    );
  };

  const doDeleteBackup = async (backup) => {
    Alert.alert('삭제', `"${backup.label}" 백업을 삭제할까요?`, [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(backup.key);
          const newList = backups.filter((b) => b.key !== backup.key);
          await saveBackupList(newList);
        },
      },
    ]);
  };

  const doShareExport = async () => {
    try {
      const json = exportData(data);
      await Share.share({
        message: json,
        title: `출결이_백업_${ds2(new Date())}.json`,
      });
    } catch (e) {
      Alert.alert('오류', e.message);
    }
  };

  // ─── Holidays ───
  const addHoliday = () => {
    if (!holDate) {
      Alert.alert('알림', '날짜를 입력해주세요 (YYYY-MM-DD)');
      return;
    }
    if (!holName.trim()) {
      Alert.alert('알림', '명칭을 입력해주세요');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(holDate)) {
      Alert.alert('알림', '날짜 형식: YYYY-MM-DD');
      return;
    }

    const newData = {
      ...data,
      customHolidays: {
        ...data.customHolidays,
        [holDate]: holName.trim(),
      },
    };

    setHolDate('');
    setHolName('');
    save(newData);
  };
  




  const doPasteRestore = async () => {
  const raw = pasteBackup.trim();

  if (!raw) {
    Alert.alert('알림', '붙여넣은 백업 내용이 없습니다');
    return;
  }

  Alert.alert(
    '붙여넣기 복원',
    '붙여넣은 백업 내용으로 현재 데이터를 덮어쓸까요?',
    [
      { text: '취소' },
      {
        text: '복원',
        onPress: async () => {
          try {
            const result = importData(raw);

            if (!result.success) {
              Alert.alert('복원 실패', result.error || '백업 형식이 올바르지 않습니다.');
              return;
            }

            save(result.data);
            setPasteBackup('');
            Alert.alert('완료', '붙여넣은 백업으로 복원되었습니다.');
          } catch (e) {
            Alert.alert('오류', e.message || '복원 중 오류가 발생했습니다.');
          }
        },
      },
    ]
  );
};





  const delHoliday = (date) => {
    const newData = {
      ...data,
      customHolidays: { ...data.customHolidays },
    };
    delete newData.customHolidays[date];
    save(newData);
  };

  const resetAll = () => {
    Alert.alert(
      '전체 초기화',
      '정말 모든 데이터를 삭제할까요?\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('hakwon_v4');
            setData(createDefaultData());
          },
        },
      ]
    );
  };

  const hols = Object.entries(data.customHolidays || {}).sort();

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* ── Update ── */}
      <Card borderColor={COLORS.greenBg}>
        <CardTitle>🔄 앱 업데이트</CardTitle>
        <Text style={styles.desc}>새로운 기능이나 버그 수정이 있는지 확인합니다.</Text>

        <View style={styles.updateRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.currentVersionLabel}>현재 버전</Text>
            <Text style={styles.currentVersionValue}>v{APP_VERSION}</Text>
          </View>

          <TouchableOpacity
            style={[styles.updateBtn, updating && { opacity: 0.6 }]}
            onPress={checkForUpdate}
            disabled={updating}
            activeOpacity={0.7}
          >
            {updating ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.updateBtnText}>업데이트 확인</Text>
            )}
          </TouchableOpacity>
        </View>

        {updateStatus === 'none' && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>✅ 최신 버전입니다</Text>
          </View>
        )}
      </Card>

      {/* ── Backup ── */}
      <Card borderColor={COLORS.borderWarm}>
        <CardTitle>💾 백업 관리</CardTitle>
        <Text style={styles.desc}>자동으로 앱 내에 저장됩니다. 외부 공유도 가능해요.</Text>

        <View style={styles.backupButtonsRow}>
          <View style={{ flex: 1 }}>
            <Button title="📦 백업 저장" onPress={doBackup} variant="primary" full />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="📤 외부 공유" onPress={doShareExport} variant="outline" full />
          </View>
        </View>
      
      
      <Divider />

<Text style={styles.muted}>카카오톡이나 메모장에서 백업 JSON 전체를 복사해 붙여넣을 수 있어요.</Text>

<FormInput
  label="백업 붙여넣기"
  placeholder='{"kids":[...]}'
  value={pasteBackup}
  onChangeText={setPasteBackup}
  multiline
  numberOfLines={8}
  style={styles.pasteInput}
/>

<View style={styles.backupButtonsRow}>
  <View style={{ flex: 1 }}>
    <Button title="📥 붙여넣기 복원" onPress={doPasteRestore} variant="primary" full />
  </View>
  <View style={{ flex: 1 }}>
    <Button title="🧹 입력 비우기" onPress={() => setPasteBackup('')} variant="outline" full />
  </View>
</View>







        {backups.length === 0 ? (
          <Text style={styles.muted}>저장된 백업이 없습니다</Text>
        ) : (
          <>
            <Text style={[styles.muted, { marginBottom: 8 }]}>최근 백업 (최대 20개)</Text>
            {backups.map((b) => (
              <View key={b.key} style={styles.backupItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.backupLabel}>{b.label}</Text>
                  <Text style={styles.backupMeta}>아이 {b.kids}명 · 학원 {b.academies}곳</Text>
                </View>
                <TouchableOpacity style={styles.restoreBtn} onPress={() => doRestore(b)}>
                  <Text style={styles.restoreBtnText}>복원</Text>
                </TouchableOpacity>
                <DeleteBtn onPress={() => doDeleteBackup(b)} />
              </View>
            ))}
          </>
        )}
      </Card>

      {/* ── Custom Holidays ── */}
      <Card borderColor={COLORS.border}>
        <CardTitle>📅 임시공휴일</CardTitle>
        <Text style={styles.desc}>학원 휴무 등 추가 휴일 등록</Text>

        {hols.length === 0 ? (
          <Text style={styles.muted}>없음</Text>
        ) : (
          hols.map(([date, name]) => (
            <ListItem key={date} right={<DeleteBtn onPress={() => delHoliday(date)} />}>
              <Text style={styles.holidayText}>
                <Text style={styles.holidayDate}>{date}</Text> · {name}
              </Text>
            </ListItem>
          ))
        )}

        <Divider />

        <FormInput
          label="날짜"
          placeholder="YYYY-MM-DD"
          value={holDate}
          onChangeText={setHolDate}
          keyboardType="numbers-and-punctuation"
        />
        <FormInput
          label="명칭"
          placeholder="예: 학원 자체 휴무"
          value={holName}
          onChangeText={setHolName}
        />
        <Button title="+ 임시공휴일 추가" onPress={addHoliday} variant="primary" full />
      </Card>

      {/* ── Reset ── */}
      <Card borderColor={COLORS.redBg}>
        <CardTitle>🗑️ 데이터 초기화</CardTitle>
        <Text style={styles.desc}>백업 후 진행하세요. 이 작업은 되돌릴 수 없습니다.</Text>
        <Button title="전체 초기화" onPress={resetAll} variant="danger" full />
      </Card>

      {/* ── Version ── */}
      <Card borderColor={COLORS.border}>
        <View style={styles.versionHeader}>
          <View style={styles.versionBadge}>
            <Text style={styles.versionBadgeText}>v{APP_VERSION}</Text>
          </View>
          <Text style={styles.appTitle}>출결이</Text>
          <Text style={styles.appSubtitle}>학원 출결 관리 앱</Text>
        </View>

        <View style={styles.changelogBox}>
          <Text style={styles.changelogTitle}>📋 업데이트 내역</Text>

          {CHANGELOG.map((item) => (
            <View key={item.version} style={styles.changelogItem}>
              <Text style={styles.changelogDate}>
                {item.date} — v{item.version} ({item.title})
              </Text>
              <Text style={styles.changelogBody}>
                {item.changes.map((change) => `• ${change}`).join('\n')}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  pasteInput: {
  minHeight: 150,
  textAlignVertical: 'top',
  paddingTop: 12,
  lineHeight: 20,
  },
  
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  desc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  muted: {
    fontSize: 12,
    color: COLORS.textMuted,
    paddingVertical: 4,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgWarm,
    borderRadius: 12,
    padding: 14,
  },
  currentVersionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  currentVersionValue: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  updateBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  updateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  statusBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.greenPale,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '600',
  },
  backupButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgWarm,
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    gap: 8,
  },
  backupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  backupMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  restoreBtn: {
    backgroundColor: COLORS.greenBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  restoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.green,
  },
  holidayText: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  holidayDate: {
    fontWeight: '700',
  },
  versionHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  versionBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  changelogBox: {
    backgroundColor: COLORS.bgWarm,
    borderRadius: 12,
    padding: 14,
  },
  changelogTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  changelogItem: {
    marginBottom: 10,
  },
  changelogDate: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  changelogBody: {
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: 20,
  },
});

export default SettingsScreen;