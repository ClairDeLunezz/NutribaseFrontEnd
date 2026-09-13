import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showAvatar?: boolean;
}


export default function AppHeader({ title, showBack, onBack, showAvatar }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="Voltar">
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      )}
      {showAvatar && (
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>🙂</Text>
        </View>
      )}
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBg,
    minHeight: 110,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 22,
  },
  title: {
    ...typography.h1,
    color: colors.inputBg,
  },
});
