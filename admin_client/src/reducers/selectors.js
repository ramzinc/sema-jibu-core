import _ from 'lodash';

export const createLoadingSelector = actions => state =>
  // returns true only when all actions is not loading
  _(actions).some(action => _.get(state, `loading.${action}`));

export const createAlertMessageSelector = actions => state =>
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  _(actions)
    .map(action => _.get(state, `alert.error`))
    .compact()
    .first() || '';
