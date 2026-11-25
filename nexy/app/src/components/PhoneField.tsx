import { forwardRef } from 'react';
import { Text, type TextInputInstance, type TextInputProps } from 'react-native';

import { Field } from '@/components/ui';
import { maskPhone } from '@/lib/phone';
import { C } from '@/lib/theme';

type Props = Omit<TextInputProps, 'value' | 'onChangeText' | 'onChange'> & {
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  label?: string;
};

/** Celular brasileiro com +55 fixo e máscara (11) 91234-5678. */
export const PhoneField = forwardRef<TextInputInstance, Props>(function PhoneField(
  { value, onChange, error, label = 'Celular', ...rest },
  ref,
) {
  return (
    <Field
      ref={ref}
      label={label}
      value={value}
      onChangeText={(t) => onChange(maskPhone(t))}
      placeholder="(11) 91234-5678"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel-national"
      maxLength={15}
      error={error}
      {...rest}
      // prefixo do país dentro do campo
      right={<Text style={{ color: C.faint, fontWeight: '600', marginLeft: 8 }}>+55</Text>}
    />
  );
});
