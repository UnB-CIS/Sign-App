import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme';

interface HorizontalMenuProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export default function HorizontalMenu({ items, selected, onSelect }: HorizontalMenuProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item) => {
        const isActive = item === selected;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onSelect(item)}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  item: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  textActive: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
});
