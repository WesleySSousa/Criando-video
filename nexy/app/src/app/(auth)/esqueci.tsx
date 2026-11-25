import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { PhoneField } from '@/components/PhoneField';
import { Button, Notice, Screen, Title } from '@/components/ui';
import { friendlyError } from '@/lib/errors';
import { isMobileBR, toE164 } from '@/lib/phone';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

export default function Esqueci() {
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function enviar() {
    setErr(null);
    if (!isMobileBR(phone)) return setPhoneErr('Digite o celular com DDD, por exemplo (11) 91234-5678.');
    setPhoneErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: toE164(phone), options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) return setErr(friendlyError(error));
    router.push({ pathname: '/verificar', params: { phone: toE164(phone), mode: 'recovery' } });
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Voltar">
        <Text style={{ color: C.accentHi, fontWeight: '600', fontSize: 15 }}>‹ Voltar</Text>
      </Pressable>
      <Title sub="Digite o celular da sua conta. Enviamos um código por SMS e você cria uma senha nova.">Esqueci minha senha</Title>
      <PhoneField value={phone} onChange={setPhone} error={phoneErr} returnKeyType="send" onSubmitEditing={enviar} />
      {err ? <Notice tone="error">{err}</Notice> : null}
      <Button title="Enviar código" onPress={enviar} loading={busy} />
    </Screen>
  );
}
