import { LOAD_KIOSKS } from '../actions/KioskActions';

const kioskReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_KIOSKS:
      return action.payload.kiosks;
    default:
      return state;
  }
};
export default kioskReducer;
