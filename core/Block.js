import { expect } from 'chai';
import _ from 'lodash';
import _u from './util';
import config from './config';
import Transformer from './Transformer';
import BlockContent from './BlockContent';
import Elements from './Elements';
import CKEditorConfig from './configs/CKEditorConfig';

/* eslint-disable no-param-reassign, radix */

class Block extends Elements {
  constructor({ parent, el }) {
    super({ parent, el });
    this.blockType = el.dataset.blockType;

    this.editor = parent.editor;

    _u.findChildren(this.dom, config.selectors.content).forEach((dom) => {
      if (!this.blockContent) {
        this.blockContent = new BlockContent({
          parent: this,
          el: dom,
        });
      } else {
        _u.remove(dom);
      }
    });

    _u.findChildren(this.dom, config.selectors.transform).forEach((dom) => {
      _u.remove(dom);
    });

    this.dom.append(_u.create('div', [config.classnames.transform, 'editing-ui'], config.styles.transform));

    const transformer = _u.findChildren(this.dom, config.selectors.transform)[0];
    this.blockTransformer = new Transformer({
      parent: this,
      el: transformer,
    });

    this.blockTransformer.hide();

    this.D2R = Math.PI / 180;
    this.updateTransformMatrix();
  }

  updateTransformMatrix() {
    this.transform = this.getTransform();
    const rd = this.transform * this.D2R;
    this.transformMatrix = {
      m11: Math.cos(rd * this.D2R),
      m12: Math.sin(rd * this.D2R),
      m21: -Math.sin(rd * this.D2R),
      m22: Math.cos(rd * this.D2R),
    };
  }

  getTransform = () => {
    if (this.dom.dataset.transform) {
      return parseInt(this.dom.dataset.transform);
    }
    return 0;
  };

  setTransform = (degree) => {
    const rd = Math.round(degree);
    this.dom.style.transform = `rotate(${rd}deg)`;
  }

  saveTransform = (degree) => {
    const rd = Math.round(degree);
    _u.setAttr(this.dom, 'data-transform', rd);
    this.updateTransformMatrix();
  }

  toEdit = () => {
    this.parent.blocks.forEach((block) => {
      block.toPreview();
    });
    this.parent.parent.dom.setAttribute('draggable', false);

    this.mode = 'editing';
    expect(this.blockType).to.exist;

    switch (this.blockType) {
      case 'text': {
        this.blockContent.dom.setAttribute('contenteditable', 'true');
        let initiatedFlag = false;
        Object.keys(CKEDITOR.instances).some((name) => {
          const ariaLabel = this.blockContent.dom.getAttribute('aria-label');
          if (ariaLabel && ariaLabel.split(', ')[1] === name) {
            CKEDITOR.instances[name].focus();
            this.CKEDITORInstance = CKEDITOR.instances[name];
            initiatedFlag = true;
            return true;
          }
          return false;
        });
        if (!initiatedFlag) {
          this.CKEDITORInstance = CKEDITOR.inline(this.blockContent.dom, CKEditorConfig);
        }
        _u.clearUserSelection();
        break;
      }
      case 'image': {
        break;
      }
      default:
    }
  }

  // when selected;
  toManipulate = () => {
    this.mode = 'manipulating';
    // no need to call toPreview() for other blocks, when select multiple blocks, for Example.

    this.blockTransformer.show();
  }

  toPreview = () => {
    this.mode = 'previewing';

    if (this.CKEDITORInstance) {
      this.CKEDITORInstance.destroy();
    }
    this.blockContent.dom.setAttribute('contenteditable', false);
    this.blockTransformer.hide();
  }

  remove = () => {
    // to be testify
    _.remove(this.parent.blocks, { dom: this.dom });
    _u.remove(this.dom);
  }
}

export default Block;
