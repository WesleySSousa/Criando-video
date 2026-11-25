import { forwardRef, useId, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { C, R } from '@/lib/theme';

/** Ícone do Nexy: N com os dois pontinhos (rodas do carrinho). */
export function Logo({ size = 40 }: { size?: number }) {
  const gid = 'nexy-g' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6d28d9" />
          <Stop offset="0.6" stopColor="#7c3aed" />
          <Stop offset="1" stopColor="#8b5cf6" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="24" height="24" rx="7.2" fill={`url(#${gid})`} />
      <Path
        d="M9.7 15.1V8.9l4.6 6.2V8.9"
        stroke="#fff"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="9.7" cy="17.6" r="0.9" fill="#fff" />
      <Circle cx="14.3" cy="17.6" r="0.9" fill="#fff" />
    </Svg>
  );
}

export function Brand() {
  return (
    <View style={s.brand}>
      <Logo size={36} />
      <Text style={s.brandText}>NEXY</Text>
    </View>
  );
}

/** Tela com rolagem, área segura e teclado. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Title({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.title}>{children}</Text>
      {sub ? <Text style={s.sub}>{sub}</Text> : null}
    </View>
  );
}

type FieldProps = TextInputProps & { label: string; error?: string | null; right?: ReactNode };

export const Field = forwardRef<TextInputInstance, FieldProps>(function Field({ label, error, right, style, ...rest }, ref) {
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, error ? { borderColor: C.danger } : null]}>
        <TextInput
          ref={ref}
          placeholderTextColor={C.faint}
          selectionColor={C.accentHi}
          style={[s.input, style]}
          {...rest}
        />
        {right}
      </View>
      {error ? <Text style={s.err}>{error}</Text> : null}
    </View>
  );
});

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'glass' | 'link';
}) {
  const off = disabled || loading;
  if (variant === 'link')
    return (
      <Pressable onPress={onPress} disabled={off} hitSlop={8} style={{ alignSelf: 'center', padding: 6, opacity: off ? 0.5 : 1 }}>
        <Text style={s.link}>{title}</Text>
      </Pressable>
    );
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        s.btn,
        variant === 'glass' ? s.btnGlass : s.btnPrimary,
        { opacity: off ? 0.5 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>{title}</Text>}
    </Pressable>
  );
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'ok' }) {
  const color = tone === 'error' ? C.danger : tone === 'ok' ? C.ok : C.accentHi;
  return (
    <View style={[s.notice, { borderColor: color + '55', backgroundColor: color + '14' }]}>
      <Text style={{ color: C.fg, fontSize: 14, lineHeight: 20 }}>{children}</Text>
    </View>
  );
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, padding: 22, gap: 18 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { color: C.fg, fontSize: 20, fontWeight: '800', letterSpacing: 3 },
  title: { color: C.fg, fontSize: 28, fontWeight: '700', letterSpacing: -0.6, lineHeight: 33 },
  sub: { color: C.muted, fontSize: 15, lineHeight: 21 },
  label: { color: C.muted, fontSize: 13, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: R.field,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 15,
  },
  input: { flex: 1, color: C.fg, fontSize: 16, paddingVertical: 12 },
  err: { color: C.danger, fontSize: 13 },
  btn: { height: 54, borderRadius: R.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  btnPrimary: { backgroundColor: C.accent },
  btnGlass: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.lineHi },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: C.accentHi, fontSize: 15, fontWeight: '600' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 14 },
});
