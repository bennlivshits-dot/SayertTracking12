const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
const Module = require('module');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const lucideProxy = new Proxy({}, { get: (t, p) => p === '__esModule' ? true : (props) => React.createElement('span', { 'data-icon': String(p) }) });
const configMock = { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'anon', GEMINI_API_KEY: '' };
const reactMarkdownMock = (props) => React.createElement('div', null, props.children);
const origRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'react') return React;
  if (id === 'react-dom') return require('react-dom');
  if (id === 'lucide-react') return lucideProxy;
  if (id.endsWith('config.js')) return { default: configMock, CONFIG: configMock };
  if (id === 'react-markdown') return { default: reactMarkdownMock };
  return origRequire.apply(this, arguments);
};
const appModule = require('/tmp/interview_bundle.cjs');
const PathTab = appModule.__PathTab;
const mockProfile = { fullName: 'בדיקה', targetUnitName: 'שייטת 13', targetUnit: 'shayetet', age: 17, level: 'מתקדם' };

try {
  const html = ReactDOMServer.renderToString(React.createElement(PathTab, {
    profile: mockProfile, userId: 'test-user', showToast: () => {}, trainingContent: [], addPersonalLog: () => {},
    officialEvents: [], personalLogs: [], removePersonalLog: () => {},
  }));
  console.log('SUCCESS -', html.length, 'chars');
  console.log('Interview prompt present:', html.includes('בואו נכיר לפני שמתחילים'));
  console.log('Mentions target unit:', html.includes('שייטת 13'));
} catch (e) {
  console.log('CRASH:');
  console.log(e.stack);
}
