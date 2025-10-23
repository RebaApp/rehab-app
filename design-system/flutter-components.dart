// REBA Design System - Flutter Components

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'reba_theme.dart';

// 1. Button Component
class REBAButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final REBAButtonType type;
  final REBAButtonSize size;
  final bool isLoading;
  final bool fullWidth;
  final IconData? icon;

  const REBAButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = REBAButtonType.primary,
    this.size = REBAButtonSize.medium,
    this.isLoading = false,
    this.fullWidth = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Color backgroundColor;
    Color foregroundColor;
    
    switch (type) {
      case REBAButtonType.primary:
        backgroundColor = REBATheme.primary;
        foregroundColor = REBATheme.white;
        break;
      case REBAButtonType.secondary:
        backgroundColor = REBATheme.white;
        foregroundColor = REBATheme.primary;
        break;
      case REBAButtonType.outline:
        backgroundColor = Colors.transparent;
        foregroundColor = REBATheme.primary;
        break;
      case REBAButtonType.text:
        backgroundColor = Colors.transparent;
        foregroundColor = REBATheme.primary;
        break;
    }

    double padding;
    double fontSize;
    
    switch (size) {
      case REBAButtonSize.small:
        padding = REBATheme.spacing3;
        fontSize = REBATheme.fontSizeSm;
        break;
      case REBAButtonSize.medium:
        padding = REBATheme.spacing4;
        fontSize = REBATheme.fontSizeBase;
        break;
      case REBAButtonSize.large:
        padding = REBATheme.spacing5;
        fontSize = REBATheme.fontSizeLg;
        break;
    }

    Widget child = isLoading
        ? SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 20, color: foregroundColor),
                const SizedBox(width: REBATheme.spacing2),
              ],
              Text(
                text,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.w600,
                  color: foregroundColor,
                ),
              ),
            ],
          );

    Widget button = ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        padding: EdgeInsets.symmetric(horizontal: padding),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(REBATheme.radiusMd),
        ),
        elevation: type == REBAButtonType.primary ? 2 : 0,
        shadowColor: type == REBAButtonType.primary 
            ? REBATheme.primary.withOpacity(0.3) 
            : Colors.transparent,
      ),
      child: child,
    );

    if (type == REBAButtonType.outline) {
      button = OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: foregroundColor,
          side: const BorderSide(color: REBATheme.primary, width: 2),
          padding: EdgeInsets.symmetric(horizontal: padding),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(REBATheme.radiusMd),
          ),
        ),
        child: child,
      );
    } else if (type == REBAButtonType.text) {
      button = TextButton(
        onPressed: isLoading ? null : onPressed,
        style: TextButton.styleFrom(
          foregroundColor: foregroundColor,
          padding: EdgeInsets.symmetric(horizontal: padding),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(REBATheme.radiusMd),
          ),
        ),
        child: child,
      );
    }

    return SizedBox(
      height: REBATheme.minTouchTarget,
      width: fullWidth ? double.infinity : null,
      child: button,
    );
  }
}

enum REBAButtonType { primary, secondary, outline, text }
enum REBAButtonSize { small, medium, large }

// 2. Input Component
class REBAInput extends StatefulWidget {
  final String? label;
  final String? hint;
  final String? errorText;
  final TextEditingController? controller;
  final bool obscureText;
  final TextInputType? keyboardType;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final bool enabled;
  final int? maxLines;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;

  const REBAInput({
    super.key,
    this.label,
    this.hint,
    this.errorText,
    this.controller,
    this.obscureText = false,
    this.keyboardType,
    this.suffixIcon,
    this.prefixIcon,
    this.enabled = true,
    this.maxLines = 1,
    this.onChanged,
    this.onTap,
  });

  @override
  State<REBAInput> createState() => _REBAInputState();
}

class _REBAInputState extends State<REBAInput> {
  late FocusNode _focusNode;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _focusNode.addListener(() {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: REBATheme.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: REBATheme.spacing2),
        ],
        TextFormField(
          controller: widget.controller,
          focusNode: _focusNode,
          obscureText: widget.obscureText,
          keyboardType: widget.keyboardType,
          enabled: widget.enabled,
          maxLines: widget.maxLines,
          onChanged: widget.onChanged,
          onTap: widget.onTap,
          decoration: InputDecoration(
            hintText: widget.hint,
            errorText: widget.errorText,
            suffixIcon: widget.suffixIcon,
            prefixIcon: widget.prefixIcon,
            filled: true,
            fillColor: widget.enabled ? REBATheme.white : REBATheme.backgroundTertiary,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(REBATheme.radiusMd),
              borderSide: const BorderSide(color: REBATheme.borderLight),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(REBATheme.radiusMd),
              borderSide: const BorderSide(color: REBATheme.borderLight),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(REBATheme.radiusMd),
              borderSide: const BorderSide(color: REBATheme.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(REBATheme.radiusMd),
              borderSide: const BorderSide(color: REBATheme.error),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: REBATheme.spacing4,
              vertical: REBATheme.spacing3,
            ),
            hintStyle: const TextStyle(
              color: REBATheme.textTertiary,
              fontSize: REBATheme.fontSizeBase,
            ),
          ),
        ),
      ],
    );
  }
}

// 3. Card Component
class REBACard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final double? elevation;
  final REBACardVariant variant;
  final VoidCallback? onTap;

  const REBACard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.elevation,
    this.variant = REBACardVariant.default_,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = Card(
      elevation: elevation ?? (variant == REBACardVariant.elevated ? 4 : 2),
      margin: margin ?? const EdgeInsets.all(REBATheme.spacing2),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(REBATheme.radiusLg),
        side: variant == REBACardVariant.outlined
            ? const BorderSide(color: REBATheme.borderLight)
            : BorderSide.none,
      ),
      child: Padding(
        padding: padding ?? const EdgeInsets.all(REBATheme.spacing4),
        child: child,
      ),
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(REBATheme.radiusLg),
        child: card,
      );
    }

    return card;
  }
}

enum REBACardVariant { default_, elevated, outlined }

// 4. Tag Component
class REBATag extends StatelessWidget {
  final String text;
  final REBATagVariant variant;
  final VoidCallback? onTap;
  final bool removable;
  final VoidCallback? onRemove;

  const REBATag({
    super.key,
    required this.text,
    this.variant = REBATagVariant.default_,
    this.onTap,
    this.removable = false,
    this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color textColor;

    switch (variant) {
      case REBATagVariant.default_:
        backgroundColor = REBATheme.backgroundTertiary;
        textColor = REBATheme.textSecondary;
        break;
      case REBATagVariant.primary:
        backgroundColor = REBATheme.primary.withOpacity(0.1);
        textColor = REBATheme.primary;
        break;
      case REBATagVariant.secondary:
        backgroundColor = REBATheme.secondary.withOpacity(0.1);
        textColor = REBATheme.secondaryDark;
        break;
      case REBATagVariant.success:
        backgroundColor = REBATheme.success.withOpacity(0.1);
        textColor = REBATheme.success;
        break;
      case REBATagVariant.warning:
        backgroundColor = REBATheme.warning.withOpacity(0.1);
        textColor = REBATheme.warning;
        break;
      case REBATagVariant.error:
        backgroundColor = REBATheme.error.withOpacity(0.1);
        textColor = REBATheme.error;
        break;
    }

    Widget content = Container(
      padding: const EdgeInsets.symmetric(
        horizontal: REBATheme.spacing3,
        vertical: REBATheme.spacing1,
      ),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(REBATheme.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            text,
            style: TextStyle(
              fontSize: REBATheme.fontSizeXs,
              fontWeight: FontWeight.w500,
              color: textColor,
            ),
          ),
          if (removable) ...[
            const SizedBox(width: REBATheme.spacing1),
            GestureDetector(
              onTap: onRemove,
              child: Icon(
                Icons.close,
                size: 14,
                color: textColor,
              ),
            ),
          ],
        ],
      ),
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: content,
      );
    }

    return content;
  }
}

enum REBATagVariant { default_, primary, secondary, success, warning, error }

// 5. Rating Component
class REBARating extends StatelessWidget {
  final double rating;
  final int maxRating;
  final REBARatingSize size;
  final bool readonly;
  final ValueChanged<double>? onRatingChanged;
  final bool showText;

  const REBARating({
    super.key,
    required this.rating,
    this.maxRating = 5,
    this.size = REBARatingSize.medium,
    this.readonly = true,
    this.onRatingChanged,
    this.showText = false,
  });

  @override
  Widget build(BuildContext context) {
    double starSize;
    switch (size) {
      case REBARatingSize.small:
        starSize = 12;
        break;
      case REBARatingSize.medium:
        starSize = 16;
        break;
      case REBARatingSize.large:
        starSize = 20;
        break;
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: List.generate(maxRating, (index) {
            final starIndex = index + 1;
            final isActive = starIndex <= rating;
            final isHalf = starIndex == rating.ceil() && rating % 1 != 0;

            IconData iconData;
            if (isActive) {
              iconData = Icons.star;
            } else if (isHalf) {
              iconData = Icons.star_half;
            } else {
              iconData = Icons.star_border;
            }

            return GestureDetector(
              onTap: readonly ? null : () => onRatingChanged?.call(starIndex.toDouble()),
              child: Icon(
                iconData,
                size: starSize,
                color: const Color(0xFFFFD700),
              ),
            );
          }),
        ),
        if (showText) ...[
          const SizedBox(width: REBATheme.spacing2),
          Text(
            '${rating.toStringAsFixed(1)} ($maxRating)',
            style: TextStyle(
              fontSize: REBATheme.fontSizeSm,
              color: REBATheme.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ],
    );
  }
}

enum REBARatingSize { small, medium, large }

// 6. Search Input Component
class REBASearchInput extends StatelessWidget {
  final String? placeholder;
  final String value;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onClear;
  final VoidCallback? onFilterPress;
  final bool showFilter;
  final bool filterActive;

  const REBASearchInput({
    super.key,
    this.placeholder = 'Поиск...',
    required this.value,
    this.onChanged,
    this.onClear,
    this.onFilterPress,
    this.showFilter = false,
    this.filterActive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: REBATheme.white,
              borderRadius: BorderRadius.circular(REBATheme.radiusMd),
              border: Border.all(color: REBATheme.borderLight),
            ),
            child: TextField(
              onChanged: onChanged,
              decoration: InputDecoration(
                hintText: placeholder,
                hintStyle: const TextStyle(
                  color: REBATheme.textTertiary,
                  fontSize: REBATheme.fontSizeBase,
                ),
                prefixIcon: const Icon(
                  Icons.search,
                  color: REBATheme.textTertiary,
                  size: 20,
                ),
                suffixIcon: value.isNotEmpty && onClear != null
                    ? IconButton(
                        icon: const Icon(
                          Icons.clear,
                          color: REBATheme.textTertiary,
                          size: 20,
                        ),
                        onPressed: onClear,
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: REBATheme.spacing4,
                  vertical: REBATheme.spacing3,
                ),
              ),
            ),
          ),
        ),
        if (showFilter) ...[
          const SizedBox(width: REBATheme.spacing3),
          GestureDetector(
            onTap: onFilterPress,
            child: Container(
              width: REBATheme.minTouchTarget,
              height: REBATheme.minTouchTarget,
              decoration: BoxDecoration(
                color: filterActive 
                    ? REBATheme.primary 
                    : REBATheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(REBATheme.radiusBase),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      Icons.tune,
                      color: filterActive ? REBATheme.white : REBATheme.primary,
                      size: 20,
                    ),
                  ),
                  if (filterActive)
                    Positioned(
                      top: 4,
                      right: 4,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: REBATheme.error,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}

// 7. Loading Spinner Component
class REBALoadingSpinner extends StatelessWidget {
  final REBALoadingSize size;
  final Color? color;
  final String? text;

  const REBALoadingSpinner({
    super.key,
    this.size = REBALoadingSize.medium,
    this.color,
    this.text,
  });

  @override
  Widget build(BuildContext context) {
    double spinnerSize;
    switch (size) {
      case REBALoadingSize.small:
        spinnerSize = 20;
        break;
      case REBALoadingSize.medium:
        spinnerSize = 24;
        break;
      case REBALoadingSize.large:
        spinnerSize = 32;
        break;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: spinnerSize,
          height: spinnerSize,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(
              color ?? REBATheme.primary,
            ),
          ),
        ),
        if (text != null) ...[
          const SizedBox(height: REBATheme.spacing3),
          Text(
            text!,
            style: const TextStyle(
              fontSize: REBATheme.fontSizeBase,
              color: REBATheme.textSecondary,
            ),
          ),
        ],
      ],
    );
  }
}

enum REBALoadingSize { small, medium, large }

// 8. Empty State Component
class REBAEmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? description;
  final String? actionText;
  final VoidCallback? onActionPress;

  const REBAEmptyState({
    super.key,
    this.icon = Icons.description_outlined,
    required this.title,
    this.description,
    this.actionText,
    this.onActionPress,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(REBATheme.spacing8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 64,
              color: REBATheme.textTertiary,
            ),
            const SizedBox(height: REBATheme.spacing4),
            Text(
              title,
              style: const TextStyle(
                fontSize: REBATheme.fontSizeLg,
                fontWeight: FontWeight.w600,
                color: REBATheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            if (description != null) ...[
              const SizedBox(height: REBATheme.spacing2),
              Text(
                description!,
                style: const TextStyle(
                  fontSize: REBATheme.fontSizeBase,
                  color: REBATheme.textSecondary,
                  height: 1.6,
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionText != null && onActionPress != null) ...[
              const SizedBox(height: REBATheme.spacing6),
              REBAButton(
                text: actionText!,
                onPressed: onActionPress,
                type: REBAButtonType.primary,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

