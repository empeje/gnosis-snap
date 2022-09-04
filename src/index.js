module.exports.onRpcRequest = async ({ origin, request }) => {
  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = { book: [] };
    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'storeAddress':
      state.book.push({
        name: request.nameToStore,
        address: request.addressToStore,
      });

      await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });

      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description: 'The address has been saved to your address book',
            textAreaContent: `Name to store: ${request.nameToStore}\nAddress: ${state.addressToStore}\n Addresses in book: ${state.book.length}`,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
