const handlers = {
  GET_INTERTVIEWER_INFO: (state, action) => ({
    companyName: action.companyName,
    websiteLink: action.websiteLink,
  }),
  DEFAULT: state => state,
};

export const InterviewerReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT;
  return handle(state, action);
};
