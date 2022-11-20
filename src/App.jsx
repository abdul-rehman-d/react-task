import { useEffect, useState } from 'react'
import productsJSON from './data/products.json'
import packagesJSON from './data/packages.json'

const parsePrices = (products) => {
  const obj = {}
  for (const product of products) {
    obj[product.id] = {price: product.price, name: product.name}
  }
  return obj
}

function App() {
  const [products, setProducts] = useState([])
  const [packages, setPackages] = useState([])
  const [productDetais, setProductDetais] = useState([])
  const [cartObj, setCartObj] = useState({})
  const [bestOffer, setBestOffer] = useState(null)

  useEffect(() => {
    setProducts(productsJSON.products);
    setPackages(packagesJSON.packages);
    setProductDetais(parsePrices(productsJSON.products))
  }, [])

  const findBestPackage = (obj) => {
    const total = Object.keys(obj).reduce((total, item) => (
      (productDetais[item].price * obj[item]) + total
    ), 0);
    let bestOffer;
    for (const packageObj of packages) {
      let remaining = total;
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
      if (!bestOffer || bestOffer.saved < total - totalPrice)
        bestOffer = {
          ...packageObj,
          otherItems: {...itemsLeft},
          total: totalPrice,
          saved: total - totalPrice,
        };
    }
    return bestOffer
  }

  const getCart = (e) => {
    e.preventDefault();
    // finding best package
    setBestOffer(findBestPackage(cartObj))
  }

  const handleProductChange = (e) => {
    if (parseInt(e.target.value) > 0) {
      setCartObj(curr => ({
        ...curr,
        [parseInt(e.target.id)]: parseInt(e.target.value)
      }))
    } else if (cartObj.hasOwnProperty(parseInt(e.target.id))) {
      setCartObj(curr => {
        delete curr[parseInt(e.target.id)]
        return {...curr}
      })
    }
  }

  return (
    <div>
      {products.length ?
        <form onSubmit={getCart}>
          {products.map(product => (
            <div className='product-card' key={`product-${product.id}`}>
              <p>{product.name}</p>
              <input
                id={product.id}
                type='number'
                min='0'
                defaultValue='0'
                name={`product-${product.id}`}
                onChange={handleProductChange}
              />
              <p>{product.name}</p>
            </div>
          ))}
          <button type='submit'>submit</button>
        </form>
        : null
      }
    <div>
      <h2>Best Offer</h2>
      {bestOffer ?
        <>
          <p>
            <span>{bestOffer.name}</span>
            <span>
              {Object.keys(bestOffer.otherItems).length ?
                ` + ${Object.keys(bestOffer.otherItems).map(
                  item => (bestOffer.otherItems[item] + ' ' + productDetais[item].name)
                ).join(' + ')}`
              : ''
            }
            </span>
          </p>
          <p>{`Saved => ${bestOffer.saved}`}</p>
        </>
      :
        <p>Best offer will appear here once you submit your order.</p>
      }
    </div>
    </div>
  )
}

export default App
