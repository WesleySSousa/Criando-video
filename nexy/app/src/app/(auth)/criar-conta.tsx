import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View, type TextInputInstance } from 'react-native';

import { PhoneField } from '@/components/PhoneField';
import { Brand, Button, Field, Notice, Screen, Title, s } from '@/components/ui';
import { friendlyError } from '@/lib/errors';
import { isEmail, isMobileBR, toE164 } from '@/lib/phone';
import { supabase } from '@/lib/supabase';
import { C } from '@/lib/theme';

type Errors = Partial<Record<'nome' | 'email' | 'phone' | 'senha' | 'termos', string>>;

export default function CriarConta() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [senha, setSenha] = useState('');
  const [show, setShow] = useState(false);
  const [termos, setTermos] = useState(false);
  const [errs, setErrs] = useState<Errors>({});
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<TextInputInstance>(null);
  const phoneRef = useRef<TextInputInstance>(null);
  const senhaRef = useRef<TextInputInstance>(null);

  const forca = senha.length === 0 ? 0 : senha.length < 8 ? 1 : /\d/.test(senha) && /[a-zA-Z]/.test(senha) ? (senha.length >= 12 ? 3 : 2) : 1;

  function validar() {
    const e: Errors = {};
    if (nome.trim().length < 2) e.nome = 'Digite seu nome.';
    if (!isEmail(email)) e.email = 'Digite um e-mail válido, como nome@exemplo.com.';
    if (!isMobileBR(phone)) e.phone = 'Digite o celular com DDD, por exemplo (11) 91234-5678.';
    if (senha.length < 8) e.senha = 'Use pelo menos 8 caracteres.';
    else if (!/\d/.test(senha) || !/[a-zA-Z]/.test(senha)) e.senha = 'Misture letras e números.';
    if (!termos) e.termos = 'Aceite os termos para continuar.';
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  async function criar() {
    setErr(null);
    if (!validar()) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      phone: toE164(phone),
      password: senha,
      options: { data: { nome: nome.trim(), email: email.trim().toLowerCase() } },
    });
    setBusy(false);
    if (error) return setErr(friendlyError(error));
    // Se a confirmação por SMS estiver desligada no Supabase, a sessão já vem aberta.
    if (data.session) return;
    router.push({ pathname: '/verificar', params: { phone: toE164(phone), mode: 'signup' } });
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Voltar">
        <Text style={{ color: C.accentHi, fontWeight: '600', fontSize: 15 }}>‹ Voltar</Text>
      </Pressable>
      <Brand />
      <Title sub="Leva 1 minuto. Depois enviamos um código por SMS para confirmar seu celular.">Criar conta</Title>

      <Field
        label="Nome"
        value={nome}
        onChangeText={setNome}
        placeholder="Como você se chama"
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        error={errs.nome}
      />
      <Field
        ref={emailRef}
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
        error={errs.email}
      />
      <PhoneField ref={phoneRef} value={phone} onChange={setPhone} error={errs.phone} returnKeyType="next" onSubmitEditing={() => senhaRef.current?.focus()} />
      <View style={{ gap: 8 }}>
        <Field
          ref={senhaRef}
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!show}
          placeholder="Mínimo de 8, com letras e números"
          autoComplete="new-password"
          textContentType="newPassword"
          error={errs.senha}
          right={
            <Pressable onPress={() => setShow(!show)} hitSlop={10}>
              <Text style={{ color: C.accentHi, fontWeight: '600' }}>{show ? 'Ocultar' : 'Mostrar'}</Text>
            </Pressable>
          }
        />
        {senha ? (
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            {[1, 2, 3].map((n) => (
              <View key={n} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: forca >= n ? [C.danger, '#fbbf24', C.ok][forca - 1] : C.line }} />
            ))}
            <Text style={{ color: C.muted, fontSize: 12, width: 54, textAlign: 'right' }}>{['', 'Fraca', 'Boa', 'Forte'][forca]}</Text>
          </View>
        ) : null}
      </View>

      <Pressable onPress={() => setTermos(!termos)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }} accessibilityRole="checkbox" accessibilityState={{ checked: termos }}>
        <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: termos ? C.accent : C.lineHi, backgroundColor: termos ? C.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {termos ? <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text> : null}
        </View>
        <Text style={[s.sub, { flex: 1, fontSize: 14 }]}>Li e aceito os Termos de uso e a Política de privacidade.</Text>
      </Pressable>
      {errs.termos ? <Text style={s.err}>{errs.termos}</Text> : null}

      {err ? <Notice tone="error">{err}</Notice> : null}
      <Button title="Criar conta e receber código" onPress={criar} loading={busy} />
      <Notice>Você ganha 7 dias de IA grátis ao criar a conta.</Notice>
    </Screen>
  );
}
