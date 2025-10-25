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
      button_primary: string;
      button_secondary: string;
    };
  }
}
