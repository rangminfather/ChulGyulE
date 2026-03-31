import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { COLORS, SIZES } from '../utils/theme';

// ─── CARD ───
export const Card = ({ children, style, borderColor }) => (
  <View style={[styles.card, borderColor && { borderColor }, style]}>
    {children}
  </View>
);

export const CardTitle = ({ icon, children }) => (
  <View style={styles.cardTitleRow}>
    {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
    <Text style={styles.cardTitle}>{children}</Text>
  </View>
);

// ─── TAG ───
export const Tag = ({ children, bg, color, icon, style }) => (
  <View style={[styles.tag, { backgroundColor: bg || COLORS.primaryPale }, style]}>
    {icon && <View style={{ marginRight: 3 }}>{icon}</View>}
    <Text style={[styles.tagText, { color: color || COLORS.primaryDark }]}>{children}</Text>
  </View>
);

// ─── FILTER CHIP ───
export const FilterChip = ({ label, active, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ─── PROGRESS BAR ───
export const ProgressBar = ({ rate, color }) => (
  <View style={styles.progressTrack}>
    <View style={[styles.progressFill, { width: `${rate}%`, backgroundColor: color || COLORS.green }]} />
  </View>
);

// ─── TOGGLE ───
export const Toggle = ({ value, onToggle }) => (
  <TouchableOpacity
    style={[styles.toggle, value && styles.toggleOn]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
  </TouchableOpacity>
);

// ─── STAT BOX ───
export const StatBox = ({ value, label, bg, color }) => (
  <View style={[styles.statBox, { backgroundColor: bg || COLORS.greenBg }]}>
    <Text style={[styles.statNum, { color: color || COLORS.green }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── BUTTON ───
export const Button = ({ title, onPress, variant='primary', full, small, icon, style }) => {
  const btnStyles = [
    styles.btn,
    variant === 'primary' && styles.btnPrimary,
    variant === 'outline' && styles.btnOutline,
    variant === 'danger' && styles.btnDanger,
    full && { width: '100%' },
    small && { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
    style,
  ];
  const textStyles = [
    styles.btnText,
    variant === 'primary' && { color: COLORS.white },
    variant === 'outline' && { color: COLORS.textMid },
    variant === 'danger' && { color: COLORS.white },
    small && { fontSize: 11 },
  ];
  return (
    <TouchableOpacity style={btnStyles} onPress={onPress} activeOpacity={0.75}>
      {icon && <View style={{ marginRight: 5 }}>{icon}</View>}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

// ─── DELETE BUTTON ───
export const DeleteBtn = ({ onPress }) => (
  <TouchableOpacity style={styles.deleteBtn} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.deleteBtnText}>×</Text>
  </TouchableOpacity>
);

// ─── FORM INPUT ───
export const FormInput = ({ label, style, ...props }) => (
  <View style={styles.formGroup}>
    {label && <Text style={styles.formLabel}>{label}</Text>}
    <TextInput
      style={[styles.formInput, style]}
      placeholderTextColor={COLORS.textPlaceholder}
      {...props}
    />
  </View>
);

// ─── DIVIDER ───
export const Divider = () => <View style={styles.divider} />;

// ─── EMPTY STATE ───
export const EmptyState = ({ icon, text, children }) => (
  <View style={styles.emptyState}>
    {icon && <View style={{ marginBottom: 16 }}>{icon}</View>}
    <Text style={styles.emptyText}>{text}</Text>
    {children}
  </View>
);

// ─── LIST ITEM ───
export const ListItem = ({ left, children, right }) => (
  <View style={styles.listItem}>
    {left && <View style={{ marginRight: 12 }}>{left}</View>}
    <View style={{ flex: 1 }}>{children}</View>
    {right && <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>{right}</View>}
  </View>
);

// ─── TOGGLE ROW ───
export const ToggleRow = ({ label, value, onToggle }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Toggle value={value} onToggle={onToggle} />
  </View>
);

// ─── DOW GRID ───
export const DowGrid = ({ selected=[], onToggle }) => {
  const days = ['일','월','화','수','목','금','토'];
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {days.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.dowBtn, selected.includes(i) && styles.dowBtnSel]}
          onPress={() => onToggle(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dowBtnText, selected.includes(i) && { color: COLORS.white }]}>{d}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.paddingLg,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderWarm,
    backgroundColor: COLORS.white,
    marginRight: 7,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.primaryPale,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {
    transform: [{ translateX: 20 }],
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '700',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: SIZES.radius,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: '#FF9A6C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  btnDanger: {
    backgroundColor: COLORS.red,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.redBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.red,
    lineHeight: 18,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    fontSize: 14,
    backgroundColor: COLORS.bgWarm,
    color: COLORS.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  toggleLabel: {
    fontSize: 13,
    color: COLORS.textMid,
    fontWeight: '500',
  },
  dowBtn: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dowBtnSel: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMid,
  },
});