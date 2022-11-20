const parseProductDetailsInoObject = (products) => {
  const obj = {}
  for (const product of products) {
    obj[product.id] = {price: product.price, name: product.name}
  }
  return obj
}

const getCartTotal = (cartObj, productDetails) => {
  return Object.keys(cartObj).reduce((total, item) => (
    (productDetails[item].price * cartObj[item]) + total
  ), 0);
}

const findBestPackage = (cartObj, packages, productDetais) => {
  const cartTotal = getCartTotal(cartObj, productDetais)
  let bestOffer;
  for (const packageObj of packages) {
    let remaining = cartTotal;
    const itemsLeft = {...cartObj};
    const viable = packageObj.items.every((item) => {
      if (Object.keys(itemsLeft).includes(String(item.id))) {
        const viable = item.qty <= itemsLeft[item.id]
        if (!viable) return false
        itemsLeft[item.id] -= item.qty
        if (itemsLeft[item.id] <= 0) {
          delete itemsLeft[item.id];
        }
        remaining -= (item.qty * productDetais[item.id].price)
        return true
      }
      return false
    })
    if (!viable) continue
    const totalPrice = packageObj.price + remaining;
    if (!bestOffer || bestOffer.saved < cartTotal - totalPrice)
      bestOffer = {
        ...packageObj,
        otherItems: {...itemsLeft},
        total: totalPrice,
        saved: cartTotal - totalPrice,
      };
  }
  if (!bestOffer) bestOffer = {
    otherItems: {...cartObj},
    total: cartTotal,
    saved: 0,
  }
  return bestOffer
}

export {
  parseProductDetailsInoObject,
  getCartTotal,
  findBestPackage,
}