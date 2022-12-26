const makeName = (from, to) => {
	return [from, to].sort().join("_");
};

const Subscription = {
  message: {
    subscribe: (parent, { from, to }, { pubsub }) => {
    const chatBoxName = makeName(from, to);
    return pubsub.subscribe(`chatBox ${chatBoxName}`);
    },
  },
};

export { Subscription as default };
