import { axiosService } from 'services';
import { createActions } from 'redux-actions';

export const LOAD_KIOSKS = 'LOAD_KIOSKS';

export const { loadKiosks } = createActions({
  LOAD_KIOSKS: payload => payload
});

export const getKiosks = () => dispatch =>
  axiosService
    .get('/sema/kiosks')
    .then(response => dispatch(loadKiosks(response.data)))
    .catch(err => {
      throw err;
    });
