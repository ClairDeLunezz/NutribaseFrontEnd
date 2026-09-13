import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography, spacing } from '../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export default function PrimaryButton({ label, onPress, color, textColor, style }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, color ? { backgroundColor: color } : null, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.label, textColor ? { color: textColor } : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.buttonBg,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    ...typography.button,
    color: colors.white,
  },
});
