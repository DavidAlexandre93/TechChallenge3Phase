import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      primary: string;
      secondary: string;
      card: string;
      border: string;
      button: {
        primary: string;
        secondary: string;
        ghost: string;
        danger: string;
        primaryHover: string;
        secondaryHover: string;
        ghostHover: string;
        dangerHover: string
      }
    }
  }
}
