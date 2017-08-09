import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import 'whatwg-fetch';
import injectTapEventPlugin from 'react-tap-event-plugin';

import store from './store';
import Main from './components/Main';
import '../css/editor.scss';

injectTapEventPlugin();

document.getElementsByClassName('reveal')[0]
    .insertAdjacentHTML('afterend', '<div id="reveal_editor"></div>');

ReactDom.render((
  <Provider store={ store }>
    <Main/>
  </Provider>),
document.getElementById('reveal_editor'));
