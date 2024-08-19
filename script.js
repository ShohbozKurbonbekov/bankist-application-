'use strict';

// BANKIST APP

// Data sets
const account1 = {
  owner: 'Shaxboz Kurbonbekov',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1997,
  movementsDates: [
    '2023-12-31T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-05-28T09:15:04.904Z',
    '2024-06-01T10:17:24.185Z',
    '2024-08-04T14:11:59.604Z',
    '2024-08-05T17:01:17.194Z',
    '2024-08-08T23:36:17.929Z',
    '2024-08-10T10:51:36.790Z',
  ],
  currency: 'UZS',
  locale: 'uz-UZ', // de-DE
};

const account2 = {
  owner: 'Madina Kurbonova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1997,
  movementsDates: [
    '2023-12-31T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-05-28T09:15:04.904Z',
    '2024-06-01T10:17:24.185Z',
    '2024-08-04T14:11:59.604Z',
    '2024-08-05T17:01:17.194Z',
    '2024-08-08T23:36:17.929Z',
    '2024-08-10T10:51:36.790Z',
  ],
  currency: 'KZT',
  locale: 'kk-KZ', // de-DE
};

const account3 = {
  owner: 'Lochinbek Kurbonbekov',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 2000,
  movementsDates: [
    '2023-12-31T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-05-28T09:15:04.904Z',
    '2024-06-01T10:17:24.185Z',
    '2024-08-04T14:11:59.604Z',
    '2024-08-05T17:01:17.194Z',
    '2024-08-08T23:36:17.929Z',
    '2024-08-10T10:51:36.790Z',
  ],
  currency: 'AUD',
  locale: 'en-AU', // de-DE
};

const account4 = {
  owner: 'Daniel Radcliffe',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1985,
  movementsDates: [
    '2023-12-31T21:31:17.178Z',
    '2024-01-23T07:42:02.383Z',
    '2024-05-28T09:15:04.904Z',
    '2024-06-01T10:17:24.185Z',
    '2024-08-04T14:11:59.604Z',
    '2024-08-05T17:01:17.194Z',
    '2024-08-08T23:36:17.929Z',
    '2024-08-10T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS
const formatMovementsDate = function (date, accountLocale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = Intl.DateTimeFormat(accountLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
  return day;
};

// formated currency function
const formatingCurrency = (locale, currency, value) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

const displayMovements = function (account, sorting = false) {
  containerMovements.innerHTML = '';

  const movs = sorting
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // displaying the movement times
    const movementsDate = new Date(account.movementsDates[i]);
    const displayMovements = formatMovementsDate(movementsDate, account.locale);

    const formatedMovement = formatingCurrency(
      account.locale,
      account.currency,
      mov
    );

    const html = `
          <div class="movements__row">
              <div class="movements__type  movements__type--${type}">${
      i + 1
    } ${type}</div>
              <div class="movements__date">${displayMovements}</div>
              <div class="movements__value">${formatedMovement}</div>
          </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = formatingCurrency(
    account.locale,
    account.currency,
    account.balance
  );
};

const calcDisplaySummary = function (account) {
  // showing the positive values in the array
  const sumIn = account.movements
    .filter(positive => positive > 0)
    .reduce((accumulator, positive) => accumulator + positive);
  0;

  labelSumIn.textContent = formatingCurrency(
    account.locale,
    account.currency,
    sumIn
  );

  // showing a negative values in the array
  const sumOut = account.movements
    .filter(negative => negative < 0)
    .reduce((accumulator, negative) => accumulator + negative, 0);

  labelSumOut.textContent = formatingCurrency(
    account.locale,
    account.currency,
    Math.abs(sumOut)
  );

  // displaying the Cashback by counting
  const interestRate = account.movements
    .filter(filterPossitive => filterPossitive > 0)
    .map(positiveforBonus => positiveforBonus * (account.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((accumulator, interestRate) => accumulator + interestRate, 0);
  labelSumInterest.textContent = formatingCurrency(
    account.locale,
    account.currency,
    interestRate
  );
};

const createUserName = function (accounts) {
  accounts.forEach(function (el) {
    el.userName = el.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUserName(accounts);

const updateUI = function (account) {
  // Display comes and goes
  displayMovements(account);

  //Display balance
  calcDisplayBalance(account);

  //Display summary
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  // set the time to every 5 minuts.
  let time = 300;

  const tick = function () {
    // setting the minutes and seconds
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(time % 60).padStart(2, 0);

    // in each of calling the function, show the remaining the time to UI
    labelTimer.textContent = `${min}:${secs}`;

    // when 0 seconds. stop timer and Log out user.
    if (time === 0) {
      clearInterval(renderingtime);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }

    // Decrease the time to 1s.
    time--;
  };
  tick();

  // call the timer every second
  const renderingtime = setInterval(tick, 1000);

  return renderingtime;
};

// Event Listeners
let currentAccount, renderingtime;

// Login  event listener
btnLogin.addEventListener('click', function (event) {
  //Removing the default task of the button
  event.preventDefault();

  //Finding user's data
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  //  checking the user's data from their general database
  if (currentAccount === undefined)
    alert('OOPS: ⛔⛔⛔, NOT Found, Please Contact Bank Service ');
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display welcome message above and userpage on the app
    // create time and dates
    setInterval(() => {
      const now = new Date();
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      labelDate.textContent = Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
    }, 1000);
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    } 😊`;
    containerApp.style.opacity = '100%';

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // show LogOutimer
    if (renderingtime) clearInterval(renderingtime);
    renderingtime = startLogOutTimer();

    //Update the UI
    updateUI(currentAccount);

    // getting rid of the close input fields ' data desiplayes entered.
    inputClosePin.value = inputCloseUsername.value = '';
  }
});
// console.log(0 % 2);

// transfer event listener
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );
  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    // adding  the movement to  both account owners
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(+amount);

    // adding to the transfer times
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    // reset rendertime
    clearInterval(renderingtime);
    renderingtime = startLogOutTimer();
  }
});

// Closing account listener
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const closingAccount = accounts.find(
    account => account.userName === inputCloseUsername.value
  );
  if (
    currentAccount.pin === Number(closingAccount.pin) &&
    currentAccount.userName === closingAccount.userName
  ) {
    //deletinf user's info from array
    const index = accounts.findIndex(
      account => account.pin === closingAccount.pin
    );
    accounts.splice(index, 1);

    // hiding UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputTransferAmount.blur();
  labelWelcome.textContent = 'Log in to get started';
});

// Requesting loan listener
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  //Clear input fields
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  // Checking user's movements
  setTimeout(function () {
    if (
      currentAccount.movements.some(mov => loanAmount * 0.1 <= mov) &&
      loanAmount > 0
    ) {
      //Adding that loan
      currentAccount.movements.push(loanAmount);

      // adding to the transfer times
      currentAccount.movementsDates.push(new Date().toISOString());

      // Updating UI
      updateUI(currentAccount);

      // reset rendertime
      clearInterval(renderingtime);
      renderingtime = startLogOutTimer();
    }
  }, 5000);
});

let sorted = false;
// sorting listener
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// LECTURES

// console.log(23 === 23.0);

// BASE 10 - 0 to 9. 1 / 10 = 0.1
// console.log(1 / 10);
// console.log(10 / 3);
// console.log(0.1 + 0.2 === 0.3);

// conversion
// console.log(Number('23'));
// console.log(+'23');

// Parsing  Number.parseInt()
// it converts numberic strings into integers based on redix given.
// console.log(Number.parseInt('1997rem'));
// console.log(Number.parseInt('23%'));

// Number.parseFloat(); always use in order to read numbers from strings;
// const floatNum = '3.14159';
// console.log(Number.parseFloat(floatNum));

// Number.isNaN()
// This method checks whether a certain value is a number or not. but it does check some operations like 24 / 0 = infinity

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'23N'));
// console.log(Number.isNaN(1997 / 0));

// Number.isFinite(). this method checks if something is number or not {real number not tring}
// console.log(Number.isFinite(20.6));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20c'));
// console.log(Number.isFinite(45 / 0));

// sqaureRoot method of Math namespace
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// console.log(Math.sqrt(64));
// console.log(64 ** (1 / 2));
// console.log(27 ** (1 / 3));

// How to read the maximum value of the elements  max method can does type coersion.
// console.log(Math.max(1, 5, 6, 7, 34, 66, 5, 334));
// console.log(Math.max(2, 5, 4, 9, 23, 14, 35, '34'));
// console.log(Math.max(4, 56, 3, 13, 45, '23px'));
// console.log(Math.min((2, 4, 5, 6, 23, 12, 34, 1)));

// How to get the radius of the a circle with some unit amounts
// console.log(Math.PI + Number.parseFloat('10px') ** 2);
// console.log(Math.PI + Number.parseFloat('100px') ** 2);
// console.log(Math.PI + Number.parseFloat('13px') ** 2);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;
// console.log(randomInt(1, 10));

// Rounding Integers
// console.log(Math.round(23.5));
// console.log(Math.round(23.49));
// console.log(Math.round(27.51));
// console.log(Math.round(178.47928375));

// rounding up;
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// rounding down all the methods can do type coersion
// console.log(Math.floor(23.3));
// console.log(Math.floor('34.9'));

// removing decimal parts from a number
// console.log(Math.trunc(3.9));
// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-34.4));

// Rounding Decimals
// console.log((2.5).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.356).toFixed(2));
// console.log((4.3579).toFixed(3));
// console.log(+(3.566).toFixed(2));

// // Reminder operator (%) this remainder operator help us to do something in each of NTH times
// console.log(8 % 3);
// console.log(8 / 3); // 8 = 2 * 3 + 2
// console.log(6 % 2); // 6 = 3 * 2 + 0
// console.log(7 % 2); // 7  = 3 * 2 + 1
// console.log(8 % 2); // 8 = 4 * 2 + 0

// const isEven = number => number % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(14));
// console.log(isEven(33)); // 33 = 16 * 2 + 1

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((mov, i) => {
//     if (i % 2 === 0) mov.style.backgroundColor = 'red';
//     if (i % 3 === 0) mov.style.backgroundColor = 'skyblue';
//   });
// });

// NUMERIC SEPARATOR "Underscore" (_)
// (_) underscore it improves  the readibilty of large numbers by visually grouping digits

const largeNumber = 1000000; // which one is easy to understand?
const largeNumber2 = 1_000_000; // underscore helps developers to understand large numbers.
// console.log(largeNumber2);
const biggerNumber = 1_000_000_000;
const biggerNumer2 = 1000000000;
const priceEasyToUnderstand = 123_000;
const priceDifficultToUnderstand = 123000;

// console.log(Number('234_000'));
// console.log(Number('127_957'));
// console.log(parseInt('176_000px')); // it ignore other parts after underscore
// console.log(parseInt('345_233%'));

// bigInt  stands for big integers
// the biggest number in javascript is 2 ** 53 - 1
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// if any number is bigger than that one, javascript loses it precision in some way.
// console.log(237981237598732985671893789); // the result is (2.37981237598733e+26). it means it lost its accuracy.
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 0);

// But there is a way of handing with  big big numbers in javascript.
// it is bigInt (primitive data types)
// console.log(7357328962936498723894673n); // n can be used for any large numbers
// console.log(BigInt(271359871293856912835912837)); // bigInt is more used for smaller numbers
// console.log(BigInt(985863257627358));

// we can do some operations in bigInt data types like below
// console.log(20000n + 20000n);

// one imposible thing is that we can not mix regular numbers with bigInt number in math operations
// console.log(100n + 200); // we get this error ( Cannot mix BigInt and other types,)

// But with the help of bigInt function we can do math operation between regular and bigInt values
const huge = 38672386923746736838957n;
const number = 1997;
// console.log(huge + number); // we need to convert regular value into bigInt.
// console.log(huge + BigInt(number));

// But there are two exceptions, comparision and plus operators when working with strings. lets see exceptions
// console.log(20n > 15);
// console.log(20n === 20); // false because there is not gonna be a type coersion here
// console.log(20n == '20');
// console.log(huge + ' is really big number');
// but we cannot do that
// console.log(Math.sqrt(16n));

// DEVISION WITH BigInt numbers. when we devide two bigInt data types, javaScript cuts off decimal part if it exists.
// console.log(10n / 3n); // 10 / 3 = 3.333333 result is 3n
// console.log(17n / 5n); // 17 / 5 = 3.66  the result is gonna be 3n

/**
 * ! WORKING WITH DATES AND TIMES FUNDAMENTALS
 */

// create a date: there are four ways of creating a date in javascript. So we will see one by one
/*
// 1)
const now = new Date();
console.log(now);

// 2)
console.log(new Date('10 april 1977'));
console.log(new Date('december 20, 2004'));
console.log(new Date('1977 15 august'));
console.log(new Date('2000 april 04'));
console.log(new Date('May 15 1997 '));

// 3)
console.log(new Date(1997, 4, 15, 23, 56, 45, 12));
console.log(new Date(2000, 3, 11, 12, 59, 59, 0));

// 4)
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
console.log(new Date(365 * 24 * 60 * 60 * 1000));
*/

// Working with Dates
// const future = new Date(2037, 10, 19, 15, 23);
// Thu Nov 19 2037 15:23:00 GMT+0900
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.getMilliseconds());

// we can convert a specific date into string which will be helpful sometimes
// that method is "toISOString"
// console.log(future.toISOString()); // 2037-11-19T06:23:00.000Z
// console.log(new Date().toISOString()); // 2024-08-10T03:53:04.079Z

// when can get the milliseconds passed from 1970 till right now. for it, we can use "Date.now()" method
// console.log(new Date(Date.now()));

// we can set the components of the date. for it we use "set" extra
// Mon Nov 19 2040 15:23:00 GMT+0900
// future.setFullYear(2040);
// console.log(future);
// future.setMonth(8);
// console.log(future);

/**
 * ! OPERATIONS WITH DATES
 */

// we can subtract one date from another date in order to do calculate how many dates passed between two days
// we can convert a certain date to the timestamp in milliseconds using Number() method

// const future = new Date(2000, 3, 11);
// console.log(+future);

// const calcDaysPassed = function (date1, date2) {
//   return Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
// };
// const passedDays = calcDaysPassed(new Date(2000, 3, 10), new Date(1997, 4, 15));
// console.log(passedDays);

/**
 * ! internationalizing dates
 *
 * ? Internationalizing a date means making sure a date is shown in a way that people from different countries can understand it easily.
 */

// javacript has a new Internationalization API. it is "new Intl.DateTimeFormat()
// EXPERIMENTING WITH INTERNATIONALIZATION API

// const options = {
//   day: 'numeric',
//   month: 'short', // numeric,
//   year: 'numeric', // numeric, 2-digit
//   hour: '2-digit',
//   weekday: 'short', // short, narrow, long;
//   minute: '2-digit',
//   second: '2-digit',
// };

// const userLanguage = navigator.language;
// setInterval(() => {
//   const now = new Date();
//   labelDate.textContent = new Intl.DateTimeFormat(userLanguage, options).format(
//     now
//   );
// }, 1000);

/***
 * ! INTERNATIOLIZATIONING NUMBERS
 */
// const options = {
//   style: 'percent', // in numbers we can set the "style":, percent, currency, unit
//   unit: 'kilogram',
// };

// const num = 357893457.75;
// console.log('US', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany', new Intl.NumberFormat('de-De', options).format(num));
// console.log(
//   'Uzbekistan',
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );
// console.log('Syria', new Intl.NumberFormat('ar-SY', options).format(num));

/**
 * ! SETTIMEOUT FUNCTION DETAILS
 */

// This function runs only once after certain time passed.

const ingredients = ['olives', 'spinach'];
const stopTimeOutFunc = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1}, ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting......'); // Asynchronous situation here.

// we can stop that setTimeOut function as well, for that we need to give a name for that function and extra, we should use "ClearTimeout" function.
if (true) clearTimeout(stopTimeOutFunc);

/**
 * ! SETINTERVAL FUNCTION DETAILS
 */
// this functions runs at each of the specific, given time forever

// setInterval(
//   () =>
//     console.log(
//       new Intl.DateTimeFormat('ko-KR', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//       }).format(new Date())
//     ),
//   1000
// );
