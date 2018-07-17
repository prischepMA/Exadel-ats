const INITIAL_STATE = {
  tasksList: 123,
  error: null,
  isLoading: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  console.log('state, action', state, action);
  switch (type) {
    case 'Entity/Tasks/Error':
      return {
        ...state,
        error: payload.error,
        isLoading: false,
      };

    case 'Entity/Tasks/Request':
      return {
        ...state,
        isLoading: true,
      };

    case 'Entity/Tasks/Success':
      return {
        tasksList: payload.tasksList,
        error: null,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default reducer;