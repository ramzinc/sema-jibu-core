import { axiosService } from 'services';
import { createActions } from 'redux-actions';

export const LOAD_SALES_CHANNELS = 'LOAD_SALES_CHANNELS';

export const { loadSalesChannels } = createActions({
  LOAD_SALES_CHANNELS: payload => payload
});

export const getSalesChannels = () => dispatch =>
  axiosService
    .get('/sema/api/sales-channel')
    .then(response => dispatch(loadSalesChannels(response.data)))
    .catch(err => {
      throw err;
    });
