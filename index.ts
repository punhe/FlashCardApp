// Polyfills and environment setup need to be first
import 'react-native-url-polyfill/auto';

// Import the WebSocket from the websocket package that's already a dependency
import { w3cwebsocket as W3CWebSocket } from 'websocket';

// Provide a proper WebSocket implementation
if (!global.WebSocket) {
  // @ts-ignore
  global.WebSocket = W3CWebSocket;
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
