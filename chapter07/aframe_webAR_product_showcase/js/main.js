window.addEventListener("load", function () {
  start();
});

///close the splash screen when the camera is ready
window.addEventListener("camera-init", function () {
  document.querySelector('#splash').classList.remove('show');
});

///used to make some wait time between functions - use it along with async
const Delay = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};

///array containing the products info
const products = {
  product01: {
    name: 'Product 01',
    description: 'This is the description of the Product 01'
  },
  product02: {
    name: 'Product 02',
    description: 'This is the description of the Product 02'
  },
  product03: {
    name: 'Product 03',
    description: 'This is the description of the Product 03'
  },
}

let activeProduct = null;
let productList;


async function start() {

  document.querySelector('#tap_to_place_btn').addEventListener('click', async function() {
    tapToPlace();
  })

  document.querySelector('#btn_activate').addEventListener('click', async function() {
    activateProduct();
  });

  document.querySelector('#btn_deactivate').addEventListener('click', async function() {
    deactivateProduct();
  });

  document.querySelector('#close_btn').addEventListener('click', async function() {
    closeProductPopup();
  });
  
}


const tapToPlace = async function() {

  ///remove the Tap to Place message, component and the placement marker
  document.querySelector('#tap_to_place_btn').classList.remove('show');
  document.querySelector('#placement-container').removeAttribute('tap-to-place');
  document.querySelector('#placement-marker').emit('placementMarkerScaleDown');

  await Delay(1600);

  ///scale the products up and move them to the right position
  document.querySelector('#product02 a-entity').emit('productScaleUp');
  document.querySelector('#product02 a-entity').emit('productMoveUp');

  await Delay(800);

  document.querySelector('#product01 a-entity').emit('productScaleUp');
  document.querySelector('#product01 a-entity').emit('productMoveUp');

  await Delay(800);

  document.querySelector('#product03 a-entity').emit('productScaleUp');
  document.querySelector('#product03 a-entity').emit('productMoveUp');

  await Delay(800);

  ///show the Tap to the product message
  document.querySelector('#tap_product').classList.add('show');

  productList = document.querySelectorAll('#products-container .container');

  ///iterate through the products to read the clicks on them
  productList.forEach(function(element) {
    element.addEventListener('click', async function() {
      activeProduct = this.id;
      selectProduct(activeProduct);

      ///show the popup with the clicked product information
      document.querySelector('#product_info').classList.add('show');
      document.querySelector('#product_info h1').innerHTML = products[activeProduct].name;
      document.querySelector('#product_info p').innerHTML = products[activeProduct].description;
    })
  })
}


const activateProduct = async function() {
  ///activate/deactivate buttons and play the 'open' animation on the selected product
  document.querySelector('#btn_activate').classList.add('disabled');
  document.querySelector('#btn_deactivate').classList.remove('disabled');
  document.querySelector('#'+activeProduct + ' .product').setAttribute('animation-mixer','timeScale: 3; loop: once; clampWhenFinished: true; crossFadeDuration: 0; clip: open');
}


const deactivateProduct = async function() {
  ///activate/deactivate buttons and play the 'close' animation on the selected product
  document.querySelector('#btn_activate').classList.remove('disabled');
  document.querySelector('#btn_deactivate').classList.add('disabled');
  document.querySelector('#'+activeProduct + ' .product').setAttribute('animation-mixer','timeScale: 3; loop: once; clampWhenFinished: true; crossFadeDuration: 0; clip: close');
}

const selectProduct = async function(product) {
  document.querySelector('#tap_product').classList.remove('show');

  ///if the product is null, move the selected product back 
  if (product === null) {
    productList.forEach(function(element) {
      document.querySelector('#'+element.id + ' .product').emit('productMoveBack');
    })
    return;
  }

  ///move the product forward
  document.querySelector('#'+product + ' .product').emit('productMoveForward');

}


const closeProductPopup = async function() {

  ///if the selected product is open, closes it.
  const animationMixer = document.querySelector('#'+activeProduct + ' .product').getAttribute('animation-mixer');
  if (animationMixer && animationMixer.clip === 'open') {
    document.querySelector('#'+activeProduct + ' .product').setAttribute('animation-mixer','timeScale: 3; loop: once; clampWhenFinished: true; crossFadeDuration: 0; clip: close');
  }

  ///reset the active product and close the product info popup
  activeProduct = null;
  document.querySelector('#product_info').classList.remove('show');

  selectProduct(null);

  await Delay(500);

  document.querySelector('#tap_product').classList.add('show');

  ///reset the activate/deactivate buttons to prepare for the next interaction
  document.querySelector('#btn_activate').classList.remove('disabled');
  document.querySelector('#btn_deactivate').classList.add('disabled'); 
}
