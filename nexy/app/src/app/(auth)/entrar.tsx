import { Link, router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View, type TextInputInstance } from 'react-native';

import { PhoneField } from '@/components/PhoneField';
import { Brand, Button, Field, Notice, Screen, Title, s } from '@/components/ui';
import { errorCode, friendlyError } from '@/lib/errors';
import { isMobileBR, toE164 } from '@/lib/phone';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

type Mode = 'senha' | 'sms';

export default function Entrar() {
  const [mode, setMode] = useState<Mode>('senha');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const passRef = useRef<TextInputInstance>(null);

  const checkPhone = () => {
    if (!isMobileBR(phone)) {
      setPhoneErr('Digite o celular com DDD, por exemplo (11) 91234-5678.');
      return false;
    }
    setPhoneErr(null);
    return true;
  };

  async function entrarComSenha() {
    setErr(null);
    if (!checkPhone()) return;
    if (!password) return setErr('Digite sua senha.');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ phone: toE164(phone), password });
    setBusy(false);
    if (!error) return; // a sessão abre e o app vai para a tela inicial sozinho
    if (errorCode(error) === 'phone_not_confirmed') {
      await supabase.auth.resend({ type: 'sms', phone: toE164(phone) });
      router.push({ pathname: '/verificar', params: { phone: toE164(phone), mode: 'signup' } });
      return;
    }
    setErr(friendlyError(error));
  }

  async function enviarCodigo() {
    setErr(null);
    if (!checkPhone()) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: toE164(phone), options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) return setErr(friendlyError(error));
    router.push({ pathname: '/verificar', params: { phone: toE164(phone), mode: 'login' } });
  }

  return (
    <Screen>
      <Brand />
      <Title sub="Sua lista de compras inteligente.">Entrar</Title>

      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, borderWidth: 1, borderColor: C.line }}>
        {(['senha', 'sms'] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => {
              setMode(m);
              setErr(null);
            }}
            style={{ flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: mode === m ? C.accent : 'transparent' }}
          >
            <Text style={{ color: mode === m ? '#fff' : C.muted, fontWeight: '700', fontSize: 14 }}>
              {m === 'senha' ? 'Celular e senha' : 'Código por SMS'}
            </Text>
          </Pressable>
        ))}
      </View>

      <PhoneField
        value={phone}
        onChange={setPhone}
        error={phoneErr}
        returnKeyType={mode === 'senha' ? 'next' : 'send'}
        onSubmitEditing={() => (mode === 'senha' ? passRef.current?.focus() : enviarCodigo())}
      />

      {mode === 'senha' ? (
        <Field
          ref={passRef}
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!show}
          textContentType="password"
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={entrarComSenha}
          right={
            <Pressable onPress={() => setShow(!show)} hitSlop={10}>
              <Text style={{ color: C.accentHi, fontWeight: '600' }}>{show ? 'Ocultar' : 'Mostrar'}</Text>
            </Pressable>
          }
        />
      ) : (
        <Text style={s.sub}>Enviamos um código de 6 números por SMS. Não precisa de senha.</Text>
      )}

      {err ? <Notice tone="error">{err}</Notice> : null}

      {mode === 'senha' ? (
        <Button title="Entrar" onPress={entrarComSenha} loading={busy} />
      ) : (
        <Button title="Enviar código" onPress={enviarCodigo} loading={busy} />
      )}

      {mode === 'senha' ? <Button variant="link" title="Esqueci minha senha" onPress={() => router.push('/esqueci')} /> : null}

      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        <Text style={s.sub}>Ainda não tem conta?</Text>
        <Link href="/criar-conta" style={s.link}>
          Criar conta
        </Link>
      </View>
    </Screen>
  );
}
