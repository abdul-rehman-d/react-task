import { useEffect, useState } from 'react'
import productsJSON from './data/products.json'
import packagesJSON from './data/packages.json'
import { findBestPackage, getCartTotal, parseProductDetailsInoObject } from './helpers'

function App() {
  const [products, setProducts] = useState([])
  const [packages, setPackages] = useState([])
  const [productDetais, setProductDetais] = useState([])
  const [cartObj, setCartObj] = useState({})
  const [bestOffer, setBestOffer] = useState(null)

  useEffect(() => {
    setProducts(productsJSON.products);
    setPackages(packagesJSON.packages);
    setProductDetais(parseProductDetailsInoObject(productsJSON.products))
  }, [])

  const getCart = (e) => {
    e.preventDefault();
    setBestOffer(findBestPackage(cartObj, packages, productDetais))
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
    <main className='main-container'>
      {products.length ?
        <form onSubmit={getCart} className='form-container'>
          <h2>Place your order:</h2>
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
          <button type='submit' className='submit-button'>submit</button>
        </form>
        : null
      }
    <div>
      <h2>Best Offer</h2>
      {bestOffer ?
        <div className='offer-table'>
          {
            bestOffer.name ?
            <>
              <h3>Offers</h3>
              <div className='table-row'>
                <p>{bestOffer.name}</p>
                <p>{bestOffer.price}</p>
              </div>
            </>
            : null
          }
          {
            bestOffer.otherItems && Object.keys(bestOffer.otherItems).length ?
            <>
              <h3>Other Items</h3>
              {Object.keys(bestOffer.otherItems).map(item => (
                <div className='table-row'>
                  <p>
                    {`${bestOffer.otherItems[item]}x ${productDetais[item].name}`}
                  </p>
                  <p>
                    {productDetais[item].price}
                  </p>
                </div>
              ))}
            </>
            : null
          }

          <h3>Total</h3>
          <div className='table-row'>
            <p>Total Saved</p>
            <p>-{bestOffer.saved}</p>
          </div>
          <div className='table-row'>
            <p>TOTAL</p>
            <p>{bestOffer.total}</p>
          </div>
        </div>
      :
        <p>Best offer will appear here once you submit your order.</p>
      }
    </div>
    </main>
  )
}

export default App
