import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { Button, Field, Notice, Screen, Title } from '@/components/ui';
import { friendlyError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

export default function NovaSenha() {
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function salvar() {
    setErr(null);
    if (senha.length < 8 || !/\d/.test(senha) || !/[a-zA-Z]/.test(senha)) return setErr('Use pelo menos 8 caracteres, com letras e números.');
    if (senha !== conf) return setErr('As duas senhas não são iguais.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setBusy(false);
    if (error) return setErr(friendlyError(error));
    setOk(true);
    setTimeout(() => router.back(), 1200);
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Voltar">
        <Text style={{ color: C.accentHi, fontWeight: '600', fontSize: 15 }}>‹ Voltar</Text>
      </Pressable>
      <Title sub="Escolha uma senha que você não usa em outros apps.">Nova senha</Title>
      <Field label="Nova senha" value={senha} onChangeText={setSenha} secureTextEntry autoComplete="new-password" textContentType="newPassword" />
      <Field label="Repita a nova senha" value={conf} onChangeText={setConf} secureTextEntry autoComplete="new-password" textContentType="newPassword" onSubmitEditing={salvar} />
      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="ok">Senha alterada.</Notice> : null}
      <Button title="Salvar senha" onPress={salvar} loading={busy} />
    </Screen>
  );
}
