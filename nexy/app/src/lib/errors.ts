import { isAuthError } from '@supabase/supabase-js';

const MSGS: Record<string, string> = {
  invalid_credentials: 'Celular ou senha incorretos.',
  user_already_exists: 'Já existe uma conta com esse celular. Entre com ele.',
  phone_exists: 'Já existe uma conta com esse celular. Entre com ele.',
  email_exists: 'Esse e-mail já está em outra conta.',
  otp_expired: 'Código errado ou vencido. Confira os números ou peça outro.',
  sms_send_failed: 'Não conseguimos enviar o SMS. Confira o número e tente de novo.',
  weak_password: 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.',
  over_sms_send_rate_limit: 'Muitos SMS em pouco tempo. Espere um minuto e peça de novo.',
  over_request_rate_limit: 'Muitas tentativas. Espere um pouco e tente de novo.',
  phone_not_confirmed: 'Esse celular ainda não foi confirmado. Enviamos um novo código.',
  phone_provider_disabled: 'O login por celular ainda não foi ativado no Supabase.',
  signup_disabled: 'Novos cadastros estão desativados no momento.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  user_not_found: 'Não encontramos uma conta com esse celular.',
  validation_failed: 'Algum dado está em formato inválido. Confira e tente de novo.',
};

/** Converte erros do Supabase em mensagens em português. */
export function friendlyError(e: unknown): string {
  if (isAuthError(e)) {
    if (e.code && MSGS[e.code]) return MSGS[e.code];
    if (/network|fetch/i.test(e.message)) return 'Sem conexão. Confira a internet e tente de novo.';
    return e.message;
  }
  if (e instanceof Error && /network|fetch/i.test(e.message)) return 'Sem conexão. Confira a internet e tente de novo.';
  return 'Algo deu errado. Tente de novo.';
}

export const errorCode = (e: unknown) => (isAuthError(e) ? e.code : undefined);
