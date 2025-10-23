// REBA Design System - React Native Components

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REBATheme } from './react-native-theme';

// 1. Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export const REBAButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: REBATheme.borderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: REBATheme.accessibility.minTouchTarget,
    };

    const sizeStyles = {
      small: { paddingHorizontal: REBATheme.spacing[3], paddingVertical: REBATheme.spacing[2] },
      medium: { paddingHorizontal: REBATheme.spacing[6], paddingVertical: REBATheme.spacing[4] },
      large: { paddingHorizontal: REBATheme.spacing[8], paddingVertical: REBATheme.spacing[5] },
    };

    const variantStyles = {
      primary: {
        backgroundColor: REBATheme.colors.primary[500],
        ...REBATheme.shadows.sm,
      },
      secondary: {
        backgroundColor: REBATheme.colors.neutral.white,
        borderWidth: 1,
        borderColor: REBATheme.colors.border.light,
        ...REBATheme.shadows.sm,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: REBATheme.colors.primary[500],
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: REBATheme.typography.fontSize.base,
      fontWeight: REBATheme.typography.fontWeight.semibold,
    };

    const sizeStyles = {
      small: { fontSize: REBATheme.typography.fontSize.sm },
      medium: { fontSize: REBATheme.typography.fontSize.base },
      large: { fontSize: REBATheme.typography.fontSize.lg },
    };

    const variantStyles = {
      primary: { color: REBATheme.colors.neutral.white },
      secondary: { color: REBATheme.colors.primary[500] },
      outline: { color: REBATheme.colors.primary[500] },
      text: { color: REBATheme.colors.primary[500] },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? REBATheme.colors.neutral.white : REBATheme.colors.primary[500]}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon as any}
              size={20}
              color={variant === 'primary' ? REBATheme.colors.neutral.white : REBATheme.colors.primary[500]}
              style={{ marginRight: REBATheme.spacing[2] }}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// 2. Input Component
interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

export const REBAInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  success = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
}) => {
  const getInputStyle = () => {
    const baseStyle = {
      backgroundColor: REBATheme.colors.neutral.white,
      borderRadius: REBATheme.borderRadius.md,
      paddingHorizontal: REBATheme.spacing[4],
      paddingVertical: REBATheme.spacing[3],
      fontSize: REBATheme.typography.fontSize.base,
      color: REBATheme.colors.text.primary,
      minHeight: REBATheme.accessibility.minTouchTarget,
      borderWidth: 1,
      borderColor: REBATheme.colors.border.light,
    };

    if (error) {
      return { ...baseStyle, borderColor: REBATheme.colors.semantic.error[500], borderWidth: 2 };
    }

    if (success) {
      return { ...baseStyle, borderColor: REBATheme.colors.semantic.success[500], borderWidth: 2 };
    }

    return baseStyle;
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={REBATheme.colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[getInputStyle(), multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={REBATheme.colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={REBATheme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

// 3. Card Component
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
  style?: any;
}

export const REBACard: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: REBATheme.colors.neutral.white,
      borderRadius: REBATheme.borderRadius.lg,
      padding: REBATheme.spacing[4],
    };

    const variantStyles = {
      default: { ...REBATheme.shadows.base },
      elevated: { ...REBATheme.shadows.lg },
      outlined: { borderWidth: 1, borderColor: REBATheme.colors.border.light },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  if (onPress) {
    return (
      <TouchableOpacity style={[getCardStyle(), style]} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

// 4. Tag Component
interface TagProps {
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onPress?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export const REBATag: React.FC<TagProps> = ({
  text,
  variant = 'default',
  onPress,
  removable = false,
  onRemove,
}) => {
  const getTagStyle = () => {
    const baseStyle = {
      paddingHorizontal: REBATheme.spacing[3],
      paddingVertical: REBATheme.spacing[1],
      borderRadius: REBATheme.borderRadius.full,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    };

    const variantStyles = {
      default: {
        backgroundColor: REBATheme.colors.neutral.gray[100],
        color: REBATheme.colors.text.secondary,
      },
      primary: {
        backgroundColor: REBATheme.colors.primary[50],
        color: REBATheme.colors.primary[500],
      },
      secondary: {
        backgroundColor: REBATheme.colors.secondary[100],
        color: REBATheme.colors.secondary[700],
      },
      success: {
        backgroundColor: REBATheme.colors.semantic.success[50],
        color: REBATheme.colors.semantic.success[500],
      },
      warning: {
        backgroundColor: REBATheme.colors.semantic.warning[50],
        color: REBATheme.colors.semantic.warning[500],
      },
      error: {
        backgroundColor: REBATheme.colors.semantic.error[50],
        color: REBATheme.colors.semantic.error[500],
      },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: REBATheme.typography.fontSize.xs,
      fontWeight: REBATheme.typography.fontWeight.medium,
    };

    const variantStyles = {
      default: { color: REBATheme.colors.text.secondary },
      primary: { color: REBATheme.colors.primary[500] },
      secondary: { color: REBATheme.colors.secondary[700] },
      success: { color: REBATheme.colors.semantic.success[500] },
      warning: { color: REBATheme.colors.semantic.warning[500] },
      error: { color: REBATheme.colors.semantic.error[500] },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  const content = (
    <View style={getTagStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
      {removable && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="close" size={14} color={getTextStyle().color} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// 5. Rating Component
interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
}

export const REBARating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  readonly = true,
  onRatingChange,
  showText = false,
}) => {
  const getStarSize = () => {
    const sizes = {
      small: 12,
      medium: 16,
      large: 20,
    };
    return sizes[size];
  };

  const renderStars = () => {
    const stars = [];
    const starSize = getStarSize();

    for (let i = 1; i <= maxRating; i++) {
      const isActive = i <= rating;
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;

      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => !readonly && onRatingChange?.(i)}
          disabled={readonly}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isActive ? 'star' : isHalf ? 'star-half' : 'star-outline'}
            size={starSize}
            color="#FFD700"
          />
        </TouchableOpacity>
      );
    }

    return stars;
  };

  return (
    <View style={styles.ratingContainer}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showText && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)} ({maxRating})
        </Text>
      )}
    </View>
  );
};

// 6. Search Input Component
interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  filterActive?: boolean;
}

export const REBASearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Поиск...',
  value,
  onChangeText,
  onClear,
  onFilterPress,
  showFilter = false,
  filterActive = false,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrapper}>
        <Ionicons
          name="search-outline"
          size={20}
          color={REBATheme.colors.text.tertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={REBATheme.colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={REBATheme.colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
      {showFilter && (
        <TouchableOpacity
          style={[styles.filterButton, filterActive && styles.filterButtonActive]}
          onPress={onFilterPress}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? REBATheme.colors.neutral.white : REBATheme.colors.primary[500]}
          />
          {filterActive && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

// 7. Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export const REBALoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = REBATheme.colors.primary[500],
  text,
}) => {
  const getSpinnerSize = () => {
    const sizes = {
      small: 20,
      medium: 24,
      large: 32,
    };
    return sizes[size];
  };

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={getSpinnerSize()} color={color} />
      {text && (
        <Text style={styles.loadingText}>{text}</Text>
      )}
    </View>
  );
};

// 8. Empty State Component
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const REBAEmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  description,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={styles.emptyStateContainer}>
      <Ionicons name={icon as any} size={64} color={REBATheme.colors.text.tertiary} />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      {description && (
        <Text style={styles.emptyStateDescription}>{description}</Text>
      )}
      {actionText && onActionPress && (
        <REBAButton
          title={actionText}
          onPress={onActionPress}
          variant="primary"
          style={styles.emptyStateButton}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    left: REBATheme.spacing[4],
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: REBATheme.spacing[4],
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: REBATheme.typography.fontSize.sm,
    color: REBATheme.colors.semantic.error[500],
    marginTop: REBATheme.spacing[1],
  },
  removeButton: {
    marginLeft: REBATheme.spacing[1],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: REBATheme.spacing[2],
  },
  ratingText: {
    fontSize: REBATheme.typography.fontSize.sm,
    color: REBATheme.colors.text.secondary,
    fontWeight: REBATheme.typography.fontWeight.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: REBATheme.spacing[3],
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: REBATheme.colors.neutral.white,
    borderWidth: 1,
    borderColor: REBATheme.colors.border.light,
    borderRadius: REBATheme.borderRadius.md,
    paddingHorizontal: REBATheme.spacing[4],
    paddingLeft: REBATheme.spacing[12],
    paddingVertical: REBATheme.spacing[3],
    fontSize: REBATheme.typography.fontSize.base,
    color: REBATheme.colors.text.primary,
    minHeight: REBATheme.accessibility.minTouchTarget,
  },
  searchIcon: {
    position: 'absolute',
    left: REBATheme.spacing[4],
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: REBATheme.spacing[4],
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  filterButton: {
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderRadius: REBATheme.borderRadius.base,
    padding: REBATheme.spacing[2],
    minWidth: REBATheme.accessibility.minTouchTarget,
    minHeight: REBATheme.accessibility.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: REBATheme.colors.primary[500],
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: REBATheme.colors.semantic.error[500],
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: REBATheme.spacing[6],
  },
  loadingText: {
    fontSize: REBATheme.typography.fontSize.base,
    color: REBATheme.colors.text.secondary,
    marginTop: REBATheme.spacing[3],
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: REBATheme.spacing[8],
  },
  emptyStateTitle: {
    fontSize: REBATheme.typography.fontSize.lg,
    fontWeight: REBATheme.typography.fontWeight.semibold,
    color: REBATheme.colors.text.primary,
    marginTop: REBATheme.spacing[4],
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: REBATheme.typography.fontSize.base,
    color: REBATheme.colors.text.secondary,
    marginTop: REBATheme.spacing[2],
    textAlign: 'center',
    lineHeight: REBATheme.typography.fontSize.base * REBATheme.typography.lineHeight.relaxed,
  },
  emptyStateButton: {
    marginTop: REBATheme.spacing[6],
  },
});

