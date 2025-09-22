declare module "react-native-slider" {
  import { Component } from "react";
  import { StyleProp, ViewStyle } from "react-native";

  export interface SliderProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    minimumTrackTintColor?: any;
    maximumTrackTintColor?: any;
    thumbTintColor?: string;
    trackStyle?: StyleProp<ViewStyle>;
    thumbStyle?: StyleProp<ViewStyle>;
    onValueChange?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
  }

  export default class Slider extends Component<SliderProps> {}
}
