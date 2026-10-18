import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface AvatarProps {
  name?: string | null;
  photoUri?: string | null;
  size?: number;
}


function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return '?';
  const partes = name.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}


export default function Avatar({ name, photoUri, size = 48 }: AvatarProps) {
  const dimensao = { width: size, height: size, borderRadius: size / 2 };

  if (photoUri) {
    return <Image source={{ uri: photoUri }} style={[styles.image, dimensao]} />;
  }

  return (
    <View style={[styles.fallback, dimensao]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.inputBg },
  fallback: {
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.inputBg,
    fontWeight: '700',
  },
});
