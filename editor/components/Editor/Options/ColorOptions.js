import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

import create from '../../creator';


class ColorOptions extends Component {

  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a ? color.rgb.a : 1})`;
    const params = {};
    params[this.props.blockProp] = rgba;
    const newState = window.RevealEditor.currentSection.getSelectedBlocks()[0].setState(params);
    this.props.editor_set_current_block(newState);
  };

  styles = reactCSS({
    default: {
      popover: {
        position: 'absolute',
        margin: '50px 10px',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  render = () => {
    const selectedBlock = this.props.selectedBlocks[0];
    return (
      <div className="color-option">
        <div className="color-square" style={ {
          display: 'inherit!important',
          background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")', // eslint-disable-line
        } }
          onTouchTap={ this.handleClick }
        >
          <div className="color" style={ {
            borderRadius: 'inherit',
            width: '100%',
            height: '100%',
            backgroundColor: selectedBlock[this.props.blockProp],
          } }
          ></div>
        </div>
        { this.state.displayColorPicker ?
          <div style={ this.styles.popover }>
            <div style={ this.styles.cover } onTouchTap={ this.handleClose }/>
            <SketchPicker width={ 200 }
              color={ selectedBlock[this.props.blockProp] }
              onChange={ this.handleChange }
            />
          </div> : null }
      </div>
    );
  }
}

ColorOptions.propTypes = {
  label: PropTypes.string,
  blockProp: PropTypes.string.isRequired,
  selectedBlocks: PropTypes.array.isRequired,
  editor_set_current_block: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedBlocks: state.editor.toJSON().currentSection.selectedBlocks,
  };
};

export default create(ColorOptions, mapStateToProps);
