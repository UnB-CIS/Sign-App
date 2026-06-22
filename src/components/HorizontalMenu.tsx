import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, BorderRadius } from '../theme';
import { ThemeColors } from '../theme/colors';
import { useThemeColors, useFontScale } from '../contexts/AccessibilityContext';

interface HorizontalMenuProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export default function HorizontalMenu({ items, selected, onSelect }: HorizontalMenuProps) {
  const colors = useThemeColors();
  const fontScale = useFontScale();
  const styles = useStyles(colors, fontScale);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityRole="tablist"
    >
      {items.map((item) => {
        const isActive = item === selected;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onSelect(item)}
            accessibilityRole="tab"
            accessibilityLabel={item}
            accessibilityState={{ selected: isActive }}
            accessibilityHint={`Filtrar por ${item}`}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function useStyles(colors: ThemeColors, fontScale: number) {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.sm,
          gap: Spacing.sm,
        },
        item: {
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.xl,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        itemActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        text: {
          fontSize: FontSize.md * fontScale,
          color: colors.textSecondary,
        },
        textActive: {
          color: colors.textOnPrimary,
          fontWeight: '600',
        },
      }),
    [colors, fontScale],
  );
}
