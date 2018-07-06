import { Provider } from 'react-redux';
import { defaultProps } from 'recompose';

import store from 'src/client/store';

export default defaultProps({ store })(Provider);
