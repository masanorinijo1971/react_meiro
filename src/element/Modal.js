import React, { Component } from "react";
import { View, TouchableWithoutFeedback, Dimensions } from "react-native";

/**
 * @typedef {Object} ModalOptions
 * @property {string} direction
 * @property {string} adjust
 * @property {number} width
 * @property {number} height
 * @property {Object} props
 * @property {bool} isBackgroundVisible
 * @property {bool} enableBackgroundClose
 */

export class ModalManager {
  static _modals = [];
  static _contents = [];

  static addModal(modal) {
    this._modals.push(modal);
  }

  static removeModal(modal) {
    const index = this._modals.indexOf(modal);
    if (index >= 0) {
      this._modals.splice(index, 1);
    }
  }

  static _getModal() {
    if (this._modals.length === 0) {
      return null;
    } else {
      return this._modals[this._modals.length - 1];
    }
  }

  static open(content, options, closeCurrentModal = false) {
    if (this._modals.length === 0) {
      console.error("Cannot open modal");
      return;
    }

    if (closeCurrentModal) {
      this.close();
    }
    this._contents.push({ content, options });
    this._open(content, options);
  }

  static openBy(content, ref, options) {
    if (this._modals.length === 0) {
      console.error("Cannot open modal");
      return;
    }

    options = Object.assign({}, options);
    ref.measure((a, b, width, height, px, py) => {
      let direction = options.direction;
      if (!direction) {
        console.warn("options.direction is required");
        direction = Modal.DIRECTION.BOTTOM;
      }

      // 画面サイズに合わせてスケール (defaultWidthの幅前提でデザインされているため)
      const windowSize = Dimensions.get("window");
      const scale = windowSize.width;

      px /= scale;
      py /= scale;
      width /= scale;
      height /= scale;

      let adjust = options.adjust || Modal.ADJUST.CENTER;

      let contentWrapperStyle = {
        width: windowSize.width,
        height: windowSize.height,
        left: 0,
        top: 0,
      };

      const contentHeight = options.height ? options.height : 0;
      const contentWidth = options.width ? options.width : 0;

      switch (direction) {
        case Modal.DIRECTION.LEFT:
          contentWrapperStyle.width = px;
          contentWrapperStyle.alignItems = "flex-end";
          this._adjustVertical(
            adjust,
            contentWrapperStyle,
            windowSize.height,
            py,
            height,
            contentHeight
          );
          break;

        case Modal.DIRECTION.RIGHT:
          contentWrapperStyle.left = px + width;
          contentWrapperStyle.width = windowSize.width - px - width;
          this._adjustVertical(
            adjust,
            contentWrapperStyle,
            windowSize.height,
            py,
            height,
            contentHeight
          );
          break;

        case Modal.DIRECTION.TOP:
          contentWrapperStyle.flexDirection = "row";
          contentWrapperStyle.alignItems = "flex-end";
          contentWrapperStyle.height = py;
          this._adjustHorizontal(
            adjust,
            contentWrapperStyle,
            windowSize.width,
            px,
            width,
            contentWidth
          );
          break;

        case Modal.DIRECTION.BOTTOM:
          contentWrapperStyle.flexDirection = "row";
          contentWrapperStyle.top = py + height;
          contentWrapperStyle.height = windowSize.height - py - height;
          this._adjustHorizontal(
            adjust,
            contentWrapperStyle,
            windowSize.width,
            px,
            width,
            contentWidth
          );
          break;
      }

      options.contentWrapperStyle = contentWrapperStyle;
      options.overrideState = this._overrideState(options);

      this._contents.push({ content, ref, options });
      this._open(content, options);
    });
  }

  static _adjustVertical(
    adjust,
    style,
    windowHeight,
    py,
    height,
    contentHeight
  ) {
    switch (adjust) {
      case Modal.ADJUST.TOP:
        style.top = py;
        style.height = windowHeight - py;
        break;

      case Modal.ADJUST.CENTER:
        style.top =
          py + height / 2 + contentHeight / 2 > windowHeight
            ? (windowHeight - contentHeight) / 2
            : py - windowHeight / 2 + height / 2;
        style.justifyContent = "center";
        break;

      case Modal.ADJUST.BOTTOM:
        style.height = py + height;
        style.justifyContent = "flex-end";
        break;

      default:
        console.warn("invalid adjust value");
        style.top = py - windowHeight / 2 + height / 2;
        style.justifyContent = "center";
        break;
    }
  }

  static _adjustHorizontal(
    adjust,
    style,
    windowWidth,
    px,
    width,
    contentWidth
  ) {
    switch (adjust) {
      case Modal.ADJUST.LEFT:
        style.left = px;
        style.width = windowWidth - px;
        break;

      case Modal.ADJUST.CENTER:
        style.left = px - windowWidth / 2 + width / 2;
        style.justifyContent = "center";
        break;

      case Modal.ADJUST.RIGHT:
        style.width = px + width;
        style.justifyContent = "flex-end";
        break;

      default:
        console.warn("invalid adjust value");
        style.left = px - windowWidth / 2 + width / 2;
        style.justifyContent = "center";
        break;
    }
  }

  static _open(content, options) {
    const modal = this._getModal();
    options = Object.assign({}, options);
    options.overrideState = this._overrideState(options);
    if (modal) {
      modal.open(content, options);
    }
  }

  static _overrideState(options) {
    const state = {};
    if (options.enableBackgroundClose !== undefined) {
      state.enableBackgroundClose = options.enableBackgroundClose;
    }
    if (options.isBackgroundVisible !== undefined) {
      state.isBackgroundVisible = options.isBackgroundVisible;
    }
    if (options.cannotAbort !== undefined) {
      state.cannotAbort = options.cannotAbort;
    }
    return state;
  }

  static close() {
    const modal = this._getModal();
    this._contents.pop();
    if (modal) {
      if (this._contents.length > 0) {
        const content = this._contents[this._contents.length - 1];
        this._open(content.content, content.options);
      } else {
        modal.close();
      }
    }
  }

  static closeAll() {
    var isOpen = this._getModal().state.isOpen;
    while (isOpen) {
      this.close();
      isOpen = this._getModal().state.isOpen;
    }
  }

  static cannotAbort() {
    return this._getModal().state.cannotAbort;
  }
}

export default class Modal extends Component {
  static DIRECTION = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
  };

  static ADJUST = {
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
    TOP: "top",
    BOTTOM: "bottom",
  };

  constructor() {
    super();
    this.state = {
      isOpen: false,
      content: null,
      position: null,
      isBackgroundVisible: true,
      contentWrapperStyle: null,
      enableBackgroundClose: true,
      cannotAbort: false,
    };
  }

  componentDidMount() {
    ModalManager.addModal(this);
  }

  componentWillUnmount() {
    ModalManager.removeModal(this);
  }

  open(content, options) {
    const { contentWrapperStyle, overrideState, props } = options || {};
    this.setState({
      ...this.state,
      isOpen: true,
      content,
      contentWrapperStyle,
      ...overrideState,
      props: props || {},
    });
  }

  close() {
    this.setState({
      ...this.state,
      isOpen: false,
      contentWrapperStyle: null,
      content: null,
    });
  }

  /**
   * Open modal on center of windows
   * @param content - React component
   * @param {ModalOptions} options
   */
  static open(content, options, closeCurrentModal = false) {
    ModalManager.open(content, options, closeCurrentModal);
  }

  /**
   * Open modal by other content
   * @param content - React component
   * @param ref - Component reference
   * @param {ModalOptions} options
   */
  static openBy(content, ref, options) {
    ModalManager.openBy(content, ref, options);
  }

  static async close() {
    ModalManager.close();
    return true;
  }

  static closeAll() {
    ModalManager.closeAll();
  }

  static cannotAbort() {
    return ModalManager.cannotAbort();
  }

  _renderContent() {
    const Content = this.state.content || (() => null);
    if (this.state.contentWrapperStyle) {
      return (
        <View
          style={{ ...this.state.contentWrapperStyle, position: "absolute" }}
        >
          <TouchableWithoutFeedback onPress={() => ModalManager.close()}>
            <View
              style={{ width: "100%", height: "100%", position: "absolute" }}
            />
          </TouchableWithoutFeedback>
          <Content {...this.state.props} />
        </View>
      );
    } else {
      const contentWrapperStyle = {
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
      };

      return (
        <View style={contentWrapperStyle}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.enableBackgroundClose) {
                ModalManager.close();
              }
            }}
          >
            <View
              style={{ width: "100%", height: "100%", position: "absolute" }}
            />
          </TouchableWithoutFeedback>
          <Content {...this.state.props} />
        </View>
      );
    }
  }

  _backgroundColorStyle() {
    if (this.state.isBackgroundVisible) {
      return {
        backgroundColor: "gray",
        opacity: 0.5,
      };
    } else {
      return {
        backgroundColor: "#00000000",
      };
    }
  }

  render() {
    return !this.state.isOpen ? null : (
      <View
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      >
        <TouchableWithoutFeedback onPress={() => ModalManager.close()}>
          <View
            style={[
              {
                height: "100%",
                width: "100%",
              },
              this._backgroundColorStyle(),
            ]}
          />
        </TouchableWithoutFeedback>
        {this._renderContent()}
      </View>
    );
  }
}
