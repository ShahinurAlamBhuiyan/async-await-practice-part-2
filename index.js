const axios = require('axios');
// https://fixer.io/
const FIXER_API_KEY = 'b0fc76a20cce2f97c60aceb60352e004'
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;

    // https://restcountries.eu
    const REST_COUNTRY_API = `https://restcountries.eu/rest/v2/currency`;


// first function - getExchangeRate
const getExchangeRate = async (formCurrency, toCurrency) => {
    const response = await axios.get(`${FIXER_API}`)
    const rate = response.data.rates;
    const euro = 1 / rate[formCurrency];
    const exchangedRate = euro * rate[toCurrency];


    
    if (isNaN(exchangedRate)) {
        throw new Error(`Unable to get ${formCurrency} and ${toCurrency}`)
    }
    return exchangedRate;

}

// second function - getCountries
const getCountries = async (toCurrency) =>{
    try {
        const response = await axios.get(`${REST_COUNTRY_API}/${toCurrency}`)
        
        return response.data.map(country => country.name);
        
    } catch (error) {
        throw new Error(`Unable to get countries that use ${toCurrency}!`)
    }
}

// third function - convertCurrency
const convertCurrency = async (formCurrency, toCurrency, amount) =>{

    let countries = await getCountries(toCurrency);
    const exchangeRate = await getExchangeRate(formCurrency, toCurrency);
    

    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${formCurrency} is worth ${convertedAmount} to ${toCurrency}. You can spent these to the following countries : ${countries}`;
}

// call convert Currency to get meaningful data.
convertCurrency('USD','HRK', 30)
.then((message)=>{
    console.log(message);
}).catch((error)=>{
    console.log(error.message)
});