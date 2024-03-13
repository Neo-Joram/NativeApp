import React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export const Text = React.forwardRef(
  (props: TextProps, ref: React.Ref<DefaultText>) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText ref={ref} style={[{ color }, style]} {...otherProps} />;
  }
);

export const View = React.forwardRef(
  (props: ViewProps, ref: React.Ref<DefaultView>) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );

    return (
      <DefaultView
        ref={ref}
        style={[{ backgroundColor }, style]}
        {...otherProps}
      />
    );
  }
);
