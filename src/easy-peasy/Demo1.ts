import { thunk, action } from 'easy-peasy';
//        👆

const productsModel = {
  items: {
    1: { id: 1, name: 'Peas', price: 10 }
  },
  //               👇
  setProduct: action((state, payload) => {
    state['items'][payload.id] = payload;
  }),
  updateProduct: thunk(async (actions, payload) => {
    // const updated = await productService.update(payload.id, payload);
    // actions.setProduct(updated); // 👈 dispatch local actions to update state
  }),
}