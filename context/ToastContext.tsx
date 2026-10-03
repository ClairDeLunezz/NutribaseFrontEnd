import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

type ToastType = 'success' | 'error';

interface ToastState {
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setToast(null);
    });
  }, [opacity]);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast({ type, message });
      opacity.setValue(0);
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timeoutRef.current = setTimeout(hide, AUTO_DISMISS_MS);
    },
    [hide, opacity],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <SafeAreaView style={styles.wrapper} pointerEvents="none">
          <Animated.View
            style={[
              styles.toast,
              { backgroundColor: toast.type === 'success' ? colors.safeGreen : colors.dangerRed, opacity },
            ]}
          >
            <Text style={styles.icon}>{toast.type === 'success' ? '✓' : '⚠'}</Text>
            <Text style={styles.message}>{toast.message}</Text>
          </Animated.View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa ser usado dentro de <ToastProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.card,
    maxWidth: '92%',
  },
  icon: { color: colors.white, fontSize: 16, marginRight: spacing.sm },
  message: { color: colors.white, ...typography.label, flexShrink: 1 },
});
