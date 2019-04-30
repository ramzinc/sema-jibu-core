export const updateObjectInArray = (array = [], obj = {}) =>
  array.map(item => {
    if (item.id !== obj.id) {
      // This isn't the item we care about - keep it as-is
      return item;
    }
    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      ...obj
    };
  });
