import { LOAD_SALES_CHANNELS } from '../actions/SalesChannelActions';

const salesChannelReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_SALES_CHANNELS:
      return action.payload.salesChannels;
    default:
      return state;
  }
};
export default salesChannelReducer;
