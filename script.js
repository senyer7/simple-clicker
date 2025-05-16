let money = 0,
  clickGain = 1,
  autoGain = 1,
  interval;

const element = {
  clicker: document.getElementById("main-clicker"),
  money: document.getElementById("money"),
};

function formatMoney(value) {
  return "₽" + value.toLocaleString("ru-RU");
}

function addMoney() {
  money += clickGain;
}

function updateMoney(check = true) {
  element.money.innerHTML = formatMoney(money);
  if (check) checkPrices();
}

function autoMoney(amount) {
  clearInterval(interval);
  interval = setInterval(() => {
    money += autoGain;
    updateMoney();
  }, 200 / amount);
}

function checkPrices() {
  shop.forEach((s) => {
    if (money >= s.price) s.element.disabled = false;
  });
}

function onBuy(obj) {
  money -= obj.price;
  updateMoney(false);
  shop.forEach((s) => (s.element.disabled = true));
}

class ShopElement {
  constructor(id, newprice_func, onclick_func) {
    this.id = id;
    this.element = document.getElementById(id);
    this.element.onclick = this.purchase.bind(this);
    this.text_element = this.element.getElementsByTagName("b")[0];

    this._updatePrice = newprice_func;
    this._onClick = onclick_func;

    this.price = 0;
    this.purchaseLvl = 1;
    this.update();
  }

  onClick() {
    this._onClick(this);
  }
  updatePrice() {
    this._updatePrice(this);
  }
  updateText() {
    this.text_element.innerHTML = formatMoney(this.price) + ": ";
  }
  update() {
    this.updatePrice();
    this.updateText();
  }

  purchase() {
    this.purchaseLvl++;
    this.onClick();
    onBuy(this);
    this.update();
    checkPrices();
  }
}

function newPrice1(obj) {
  obj.price = clickGain * 25 * obj.purchaseLvl;
}

function newPrice2(obj) {
  obj.price = 200 * obj.purchaseLvl;
}

function newPrice3(obj) {
  obj.price = autoGain * 30 * obj.purchaseLvl + 500;
}

function onClick1(obj) {
  clickGain *= 2;
}
function onClick2(obj) {
  autoMoney(obj.purchaseLvl);
}
function onClick3(obj) {
  autoGain *= 2;
}

const shop = [
  new ShopElement("b1", newPrice1, onClick1),
  new ShopElement("b2", newPrice2, onClick2),
  new ShopElement("b3", newPrice3, onClick3),
];

updateMoney();
shop.forEach((s) => s.update());

element.clicker.onclick = () => {
  element.clicker.disabled = true;
  addMoney();
  updateMoney();
  element.clicker.disabled = false;
};
