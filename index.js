const headers = new Headers();
headers.append('x-rapidapi-host', 'numbersapi.p.rapidapi.com');
headers.append('x-rapidapi-key', '5996381262mshf4e959959641cbcp12735ejsn6d9e1fe8bac1');

//Fetch data from the NumerAPI
async function getApi() {
  try {
    const response = await fetch('https://numbersapi.p.rapidapi.com/random/trivia?json=true', {
      method: 'GET',
      headers,
    });
    const apiData = await response.json();
    return apiData;
  } catch (err) {
    console.log('fetch failed', err);
  }
}

//Class to store and display numbers
class NumberStore {
  constructor() {
    //With this Set the numbers will be displayed only one time and wont be repeted
    this._numbers = new Set();
    this._counter = 0;
    this._container = document.querySelector('.numbers');
  }

  async addNumbers() {
    const apiCall = await getApi();

    //If the API call returns an error or the number has already been saved in the Set, launch the function again
    if (!apiCall || this._numbers.has(apiCall.number)) {
      this.addNumbers();
      return;
      //Or add the number to the Set and do displayNumer() with the current number data
    } else {
      this._numbers.add(apiCall.number);
      this.displayNumber(apiCall);
    }
  }

  displayNumber(apiCall) {
    //Select corresponding container and add the data retrieved
    const currentContainer = this._container.children[this._counter];

    currentContainer.innerHTML = `<h3>${apiCall.number}</h3><p>${apiCall.text}</p>`;

    //Modify counter to loop through the containers
    if (this._counter === 2) {
      this._counter = 0;
    } else {
      this._counter++;
    }
  }
}

const Numbers = new NumberStore();


//On load display first 3 numbers and then run the function with interval.
window.onload = async function () {
  await Numbers.addNumbers();
  await Numbers.addNumbers();
  await Numbers.addNumbers();

  setInterval(async function () {
    await Numbers.addNumbers();
  }, 2000);
};
