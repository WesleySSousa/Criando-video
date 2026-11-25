import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { OtpInput } from '@/components/OtpInput';
import { Button, Notice, Screen, Title, s } from '@/components/ui';
import { friendlyError } from '@/lib/errors';
import { flow } from '@/lib/flow';
import { fromE164 } from '@/lib/phone';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

type Mode = 'signup' | 'login' | 'recovery';
const ESPERA = 60;

export default function Verificar() {
  const { phone = '', mode = 'signup' } = useLocalSearchParams<{ phone: string; mode: Mode }>();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [left, setLeft] = useState(ESPERA);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  async function confirmar(token = code) {
    if (token.length !== 6 || busy) return;
    setErr(null);
    setBusy(true);
    if (mode === 'recovery') flow.pendingRecovery = true;
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    setBusy(false);
    if (error) {
      flow.pendingRecovery = false;
      setCode('');
      setErr(friendlyError(error));
    }
    // Sem erro: a sessão abre e o app segue para a tela inicial (ou Nova senha).
  }

  async function reenviar() {
    setErr(null);
    setInfo(null);
    const { error } =
      mode === 'signup'
        ? await supabase.auth.resend({ type: 'sms', phone })
        : await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
    if (error) return setErr(friendlyError(error));
    setLeft(ESPERA);
    setInfo('Enviamos um novo código.');
  }

  const titulo = mode === 'signup' ? 'Confirme seu celular' : mode === 'recovery' ? 'Recuperar senha' : 'Digite o código';

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Voltar">
        <Text style={{ color: C.accentHi, fontWeight: '600', fontSize: 15 }}>‹ Trocar número</Text>
      </Pressable>
      <Title
        sub={
          <>
            Enviamos um código de 6 números por SMS para <Text style={{ color: C.fg, fontWeight: '700' }}>+55 {fromE164(phone)}</Text>.
          </>
        }
      >
        {titulo}
      </Title>

      <OtpInput value={code} onChange={setCode} onFilled={(v) => confirmar(v)} error={!!err} />

      {err ? <Notice tone="error">{err}</Notice> : null}
      {info ? <Notice tone="ok">{info}</Notice> : null}

      <Button title="Confirmar" onPress={() => confirmar()} loading={busy} disabled={code.length !== 6} />

      <View style={{ alignItems: 'center' }}>
        {left > 0 ? (
          <Text style={s.sub}>Reenviar código em {left}s</Text>
        ) : (
          <Button variant="link" title="Reenviar código" onPress={reenviar} />
        )}
      </View>
      <Text style={[s.sub, { fontSize: 13, textAlign: 'center' }]}>O código pode levar até 1 minuto para chegar.</Text>
    </Screen>
  );
}
