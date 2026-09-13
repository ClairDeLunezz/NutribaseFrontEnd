import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';


export default function BrandHeader() {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo-nutribase.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.brand}>NUTRIBASE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: spacing.md,
  },
  brand: {
    ...typography.brand,
    color: colors.inputBg,
  },
});
