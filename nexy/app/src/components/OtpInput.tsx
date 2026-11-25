import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';

import { C } from '@/lib/theme';

/**
 * Campo de código de 6 números.
 * Usa um único TextInput invisível: funciona com colar e com o preenchimento
 * automático do SMS (iOS: oneTimeCode, Android: sms-otp).
 */
export function OtpInput({
  value,
  onChange,
  onFilled,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onFilled?: (v: string) => void;
  error?: boolean;
}) {
  const ref = useRef<TextInputInstance>(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="Código de 6 números">
      <View style={st.row}>
        {Array.from({ length: 6 }).map((_, i) => {
          const active = i === Math.min(value.length, 5);
          return (
            <View
              key={i}
              style={[st.box, active && st.boxActive, error && { borderColor: C.danger }, value[i] ? st.boxFilled : null]}
            >
              <Text style={st.digit}>{value[i] ?? ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => {
          const v = t.replace(/\D/g, '').slice(0, 6);
          onChange(v);
          if (v.length === 6) onFilled?.(v);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={6}
        caretHidden
        style={st.hidden}
      />
    </Pressable>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  box: {
    flex: 1,
    maxWidth: 52,
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.lineHi,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: C.accent },
  boxFilled: { backgroundColor: 'rgba(124,58,237,0.12)' },
  digit: { color: C.fg, fontSize: 24, fontWeight: '700' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
