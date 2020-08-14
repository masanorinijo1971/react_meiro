import React from "react";
import { Text, View, StyleSheet } from "react-native";
// import I18n from 'i18n-js'
import PropTypes from "prop-types";
import styles from "../../styles/elements/NumberBox";
// import baseStyle from 'common/styles/baseStyle'
import TouchableOpacitySfx from "./TouchableOpacitySfx";
import CustomPropTypes from "../CustomPropTypes";
import AmountPadModal from "./AmountPadModal";
import { AMOUNT_PAD_MODE } from "./AmountPad";
import { DEFAULT_AMOUNT_MAX_LENGTH } from "common/models";

export default class NumberBox extends React.Component {
  static propTypes = {
    style: CustomPropTypes.Style,
    amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Decimal),
    ]),
    maxAmount: PropTypes.number,
    justAmount: PropTypes.number,
    formatAmount: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    mode: PropTypes.number,
    maxLength: PropTypes.number,
    disableCounterSuffix: PropTypes.bool,
    maxUsePoint: PropTypes.number,
    useableBasePoints: PropTypes.number,
  };

  _openNumberPad() {
    AmountPadModal.open({
      mode: this.props.mode ? this.props.mode : AMOUNT_PAD_MODE.CASH,
      maxLength: this.props.maxLength
        ? this.props.maxLength
        : DEFAULT_AMOUNT_MAX_LENGTH,
      maxValue: this.props.maxAmount,
      justValue: this.props.justAmount,
      useableBasePoints: this.props.useableBasePoints,
      maxUsePoint: this.props.maxUsePoint,
      onComplete: async (amount) => {
        await this.props.onChange(amount);
        return true;
      },
      disableCounterSuffix: this.props.disableCounterSuffix,
    });
  }

  render() {
    const {
      fontSize,
      fontWeight,
      lineHeight,
      ...baseStyle
    } = StyleSheet.flatten(this.props.style);
    const fontStyleOverride = {};
    if (fontSize) fontStyleOverride["fontSize"] = fontSize;
    if (fontWeight) fontStyleOverride["fontWeight"] = fontWeight;
    if (lineHeight) fontStyleOverride["lineHeight"] = lineHeight;
    if (lineHeight) fontStyleOverride["height"] = lineHeight;

    return (
      <TouchableOpacitySfx
        onPress={() => this._openNumberPad()}
        disabled={this.props.disabled}
      >
        <View style={[styles.layoutRoot, baseStyle]}>
          <Text style={[styles.mainText, fontStyleOverride]}>
            {this.props.formatAmount
              ? this.props.formatAmount(this.props.amount)
              : this.props.amount}
          </Text>
        </View>
      </TouchableOpacitySfx>
    );
  }
}
