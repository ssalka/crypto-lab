const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
global.fetch = require('node-fetch');

Enzyme.configure({ adapter: new Adapter() });
