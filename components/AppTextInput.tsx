import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface AppTextInputProps {
  label: string;
  placeholder?: string;
  secure?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}


export default function AppTextInput({ label, placeholder, secure, value, onChangeText }: AppTextInputProps) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && hidden}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeButton}>
            <Text style={styles.eyeIcon}>{hidden ? '👁' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  inputRow: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textDark,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  eyeIcon: {
    fontSize: 18,
  },
});
