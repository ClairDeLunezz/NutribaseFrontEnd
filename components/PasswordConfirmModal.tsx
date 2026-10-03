import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import AppTextInput from './AppTextInput';

interface PasswordConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: string;
  loading?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onConfirm: (senha: string) => void;
}

export default function PasswordConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor,
  loading,
  errorMessage,
  onCancel,
  onConfirm,
}: PasswordConfirmModalProps) {
  const [senha, setSenha] = useState('');

  const handleConfirm = () => {
    onConfirm(senha);
  };

  const handleCancel = () => {
    setSenha('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <AppTextInput label="Senha" secure value={senha} onChangeText={setSenha} />

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          {loading ? (
            <ActivityIndicator color={colors.buttonBg} style={{ marginTop: spacing.md }} />
          ) : (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, confirmColor ? { backgroundColor: confirmColor } : null]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  title: { ...typography.h2, color: colors.textDark, marginBottom: spacing.sm },
  message: { ...typography.body, color: colors.textDark, marginBottom: spacing.lg },
  errorText: { color: colors.dangerRed, fontSize: 14, marginTop: -spacing.sm, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm },
  cancelButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  cancelText: { color: colors.textDark, ...typography.label },
  confirmButton: {
    backgroundColor: colors.buttonBg,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginLeft: spacing.sm,
  },
  confirmText: { color: colors.white, ...typography.label },
});
