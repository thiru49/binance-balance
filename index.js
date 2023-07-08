let accountData = {};

function createSignature(data, secretKey) {
  const hmac = CryptoJS.HmacSHA256(data, secretKey);
  return hmac.toString(CryptoJS.enc.Hex);
}

function updateAccountBalance() {
    const storedApiKey = localStorage.getItem('api-key');
    const storedSecretKey = localStorage.getItem('secret-key');
  
    // Check if API Key and Secret Key are stored in localStorage
    if (!storedApiKey || !storedSecretKey) {
      console.log('API Key and Secret Key are not stored in localStorage');
      return;
    }
  
    const apiKey = storedApiKey;
    const secretKey = storedSecretKey;
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = createSignature(queryString, secretKey);
  
    const url = `https://fapi.binance.com/fapi/v2/balance?${queryString}&signature=${signature}`;
  
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Update accountData object with balance information
        accountData = {};
  
        data.forEach(asset => {
          const { asset: assetName, balance, availableBalance } = asset;
          accountData[assetName] = { balance, availableBalance };
        });
  
        // Display the account balances
        const balanceContainer = document.getElementById('balance-container');
        balanceContainer.innerHTML = '';
  
        Object.keys(accountData).forEach(assetName => {
          const { balance, availableBalance } = accountData[assetName];
          const balanceElement = document.createElement('div');
          balanceElement.innerHTML = `<h1>${assetName}</h1>
          <p>balance :  ${balance}</p>;
          <p>availableBalance : ${availableBalance}</p>`;
          balanceContainer.appendChild(balanceElement);
        });
  
        // Hide the container
        const container = document.querySelector('.container');
        container.style.display = 'none';
      })
      .catch(error => {
        console.error(error);
      });
  }
  

  
  // Function to update account balance at regular intervals
  let intervalId;
  
  function startLiveUpdates() {
    updateAccountBalance(); // Initial update
  
    // Clear previous interval if exists
    if (intervalId) {
      clearInterval(intervalId);
    }
  
    // Set interval to update every 10 seconds (adjust as needed)
    intervalId = setInterval(updateAccountBalance, 10000);
  }
  
// Function to store API Key and Secret Key in localStorage
function saveKeys() {
  const apiKey = document.getElementById('api-key').value;
  const secretKey = document.getElementById('secret-key').value;

  localStorage.setItem('api-key', apiKey);
  localStorage.setItem('secret-key', secretKey);

  console.log('API Key and Secret Key saved in localStorage');
}

// Start live updates
startLiveUpdates();

// Function to clear API Key and Secret Key from localStorage

function clearKeys() {
    localStorage.removeItem('api-key');
    localStorage.removeItem('secret-key');
    console.log('API Key and Secret Key cleared from localStorage');
  

    document.getElementById('api-key').value = '';
    document.getElementById('secret-key').value = '';
  
    // Show the container box again
    const container = document.querySelector('.container');
    container.style.display = 'flex';
  }
  
