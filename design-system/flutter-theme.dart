// REBA Design System 2025 - Flutter Theme
import 'package:flutter/material.dart';

class REBATheme {
  // Colors
  static const Map<int, Color> primarySwatch = {
    50: Color(0xFFE6F3FF),
    100: Color(0xFFCCE7FF),
    200: Color(0xFF99CFFF),
    300: Color(0xFF66B7FF),
    400: Color(0xFF339FFF),
    500: Color(0xFF0A84FF),
    600: Color(0xFF086ACC),
    700: Color(0xFF065099),
    800: Color(0xFF043666),
    900: Color(0xFF021D33),
  };

  static const Color primary = Color(0xFF0A84FF);
  static const Color primaryLight = Color(0xFF339FFF);
  static const Color primaryDark = Color(0xFF065099);

  static const Color secondary = Color(0xFF9AA0A6);
  static const Color secondaryLight = Color(0xFFBDC1C6);
  static const Color secondaryDark = Color(0xFF5F6368);

  static const Color success = Color(0xFF34A853);
  static const Color warning = Color(0xFFFF9800);
  static const Color error = Color(0xFFF44336);
  static const Color info = Color(0xFF2196F3);

  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF0B0B0B);

  static const Color backgroundPrimary = Color(0xFFFFFFFF);
  static const Color backgroundSecondary = Color(0xFFFAFAFA);
  static const Color backgroundTertiary = Color(0xFFF5F5F5);

  static const Color textPrimary = Color(0xFF0B0B0B);
  static const Color textSecondary = Color(0xFF424242);
  static const Color textTertiary = Color(0xFF757575);
  static const Color textDisabled = Color(0xFFBDBDBD);

  static const Color borderLight = Color(0xFFE0E0E0);
  static const Color borderMedium = Color(0xFFBDBDBD);
  static const Color borderDark = Color(0xFF757575);

  // Spacing
  static const double spacing0 = 0.0;
  static const double spacing1 = 4.0;
  static const double spacing2 = 8.0;
  static const double spacing3 = 12.0;
  static const double spacing4 = 16.0;
  static const double spacing5 = 20.0;
  static const double spacing6 = 24.0;
  static const double spacing8 = 32.0;
  static const double spacing10 = 40.0;
  static const double spacing12 = 48.0;
  static const double spacing16 = 64.0;
  static const double spacing20 = 80.0;
  static const double spacing24 = 96.0;
  static const double spacing32 = 128.0;

  // Border Radius
  static const double radiusNone = 0.0;
  static const double radiusSm = 4.0;
  static const double radiusBase = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 20.0;
  static const double radius2xl = 24.0;
  static const double radiusFull = 9999.0;

  // Font Sizes
  static const double fontSizeXs = 12.0;
  static const double fontSizeSm = 14.0;
  static const double fontSizeBase = 16.0;
  static const double fontSizeLg = 18.0;
  static const double fontSizeXl = 20.0;
  static const double fontSize2xl = 24.0;
  static const double fontSize3xl = 30.0;
  static const double fontSize4xl = 36.0;
  static const double fontSize5xl = 48.0;

  // Line Heights
  static const double lineHeightTight = 1.2;
  static const double lineHeightNormal = 1.4;
  static const double lineHeightRelaxed = 1.6;
  static const double lineHeightLoose = 1.8;

  // Letter Spacing
  static const double letterSpacingTight = -0.025;
  static const double letterSpacingNormal = 0.0;
  static const double letterSpacingWide = 0.025;
  static const double letterSpacingWider = 0.05;

  // Animation Durations
  static const Duration durationFast = Duration(milliseconds: 120);
  static const Duration durationNormal = Duration(milliseconds: 240);
  static const Duration durationSlow = Duration(milliseconds: 360);
  static const Duration durationSlower = Duration(milliseconds: 480);

  // Accessibility
  static const double minTouchTarget = 44.0;

  // Theme Data
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      
      colorScheme: const ColorScheme.light(
        primary: primary,
        primaryContainer: Color(0xFFE6F3FF),
        secondary: secondary,
        secondaryContainer: Color(0xFFF1F3F4),
        surface: backgroundPrimary,
        surfaceContainerHighest: backgroundSecondary,
        background: backgroundPrimary,
        error: error,
        onPrimary: white,
        onSecondary: white,
        onSurface: textPrimary,
        onBackground: textPrimary,
        onError: white,
        outline: borderLight,
        outlineVariant: borderLight,
      ),

      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: fontSize4xl,
          fontWeight: FontWeight.w700,
          height: lineHeightTight,
          letterSpacing: letterSpacingTight,
          color: textPrimary,
        ),
        displayMedium: TextStyle(
          fontSize: fontSize3xl,
          fontWeight: FontWeight.w700,
          height: lineHeightTight,
          letterSpacing: letterSpacingTight,
          color: textPrimary,
        ),
        displaySmall: TextStyle(
          fontSize: fontSize2xl,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        headlineLarge: TextStyle(
          fontSize: fontSize2xl,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        headlineMedium: TextStyle(
          fontSize: fontSizeXl,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        headlineSmall: TextStyle(
          fontSize: fontSizeLg,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        titleLarge: TextStyle(
          fontSize: fontSizeLg,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        titleMedium: TextStyle(
          fontSize: fontSizeBase,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        titleSmall: TextStyle(
          fontSize: fontSizeSm,
          fontWeight: FontWeight.w600,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        bodyLarge: TextStyle(
          fontSize: fontSizeBase,
          fontWeight: FontWeight.w400,
          height: lineHeightRelaxed,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        bodyMedium: TextStyle(
          fontSize: fontSizeSm,
          fontWeight: FontWeight.w400,
          height: lineHeightNormal,
          letterSpacing: letterSpacingNormal,
          color: textSecondary,
        ),
        bodySmall: TextStyle(
          fontSize: fontSizeXs,
          fontWeight: FontWeight.w400,
          height: lineHeightNormal,
          letterSpacing: letterSpacingWide,
          color: textTertiary,
        ),
        labelLarge: TextStyle(
          fontSize: fontSizeBase,
          fontWeight: FontWeight.w600,
          height: lineHeightTight,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        labelMedium: TextStyle(
          fontSize: fontSizeSm,
          fontWeight: FontWeight.w600,
          height: lineHeightTight,
          letterSpacing: letterSpacingNormal,
          color: textPrimary,
        ),
        labelSmall: TextStyle(
          fontSize: fontSizeXs,
          fontWeight: FontWeight.w600,
          height: lineHeightTight,
          letterSpacing: letterSpacingWide,
          color: textTertiary,
        ),
      ),

      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: white,
          elevation: 2,
          shadowColor: Colors.black.withOpacity(0.1),
          padding: const EdgeInsets.symmetric(
            horizontal: spacing6,
            vertical: spacing4,
          ),
          minimumSize: const Size(0, minTouchTarget),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w600,
            height: lineHeightTight,
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          side: const BorderSide(color: borderLight),
          padding: const EdgeInsets.symmetric(
            horizontal: spacing6,
            vertical: spacing4,
          ),
          minimumSize: const Size(0, minTouchTarget),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w600,
            height: lineHeightTight,
          ),
        ),
      ),

      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          padding: const EdgeInsets.symmetric(
            horizontal: spacing6,
            vertical: spacing4,
          ),
          minimumSize: const Size(0, minTouchTarget),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w600,
            height: lineHeightTight,
          ),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: error),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: spacing4,
          vertical: spacing3,
        ),
        hintStyle: const TextStyle(
          color: textTertiary,
          fontSize: fontSizeBase,
        ),
      ),

      cardTheme: CardTheme(
        color: white,
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        margin: const EdgeInsets.all(spacing2),
      ),

      appBarTheme: const AppBarTheme(
        backgroundColor: backgroundPrimary,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: fontSizeLg,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
      ),

      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: white,
        selectedItemColor: primary,
        unselectedItemColor: textTertiary,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),

      dividerTheme: const DividerThemeData(
        color: borderLight,
        thickness: 1,
        space: 1,
      ),
    );
  }
}

// Custom Widget Examples
class REBAButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final REBAButtonType type;
  final REBAButtonSize size;
  final bool isLoading;

  const REBAButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = REBAButtonType.primary,
    this.size = REBAButtonSize.medium,
    this.isLoading = false,
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

    return SizedBox(
      height: REBATheme.minTouchTarget,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: foregroundColor,
          padding: EdgeInsets.symmetric(horizontal: padding),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(REBATheme.radiusMd),
          ),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
                ),
              )
            : Text(
                text,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }
}

enum REBAButtonType { primary, secondary, outline }
enum REBAButtonSize { small, medium, large }

class REBACard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final double? elevation;

  const REBACard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.elevation,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: elevation ?? 2,
      margin: margin ?? const EdgeInsets.all(REBATheme.spacing2),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(REBATheme.radiusLg),
      ),
      child: Padding(
        padding: padding ?? const EdgeInsets.all(REBATheme.spacing4),
        child: child,
      ),
    );
  }
}

class REBAInput extends StatelessWidget {
  final String? label;
  final String? hint;
  final String? errorText;
  final TextEditingController? controller;
  final bool obscureText;
  final TextInputType? keyboardType;
  final Widget? suffixIcon;
  final Widget? prefixIcon;

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
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(
            label!,
            style: Theme.of(context).textTheme.labelMedium,
          ),
          const SizedBox(height: REBATheme.spacing2),
        ],
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            errorText: errorText,
            suffixIcon: suffixIcon,
            prefixIcon: prefixIcon,
          ),
        ),
      ],
    );
  }
}

