import React, { useState, useEffect } from 'react';

const App = () => {
  const [sales, setSales] = useState({
    salesDE: '',
    salesUK: '',
    salesES: '',
    salesNL: '',
    salesPL: '',
    salesFR: '',
    salesIT: '',
    salesPT: '',
    salesSE: '',
    salesDK: '',
    salesFI: '',
    combinedTotal: ''
  });
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return parseFloat(data[0].total_sales).toFixed(2); // Fix to 2 decimal places
    } catch (err) {
      setError(err.message);
      return '0.00'; // Default to '0.00' if there's an error
    }
  };

  const sendToBackend = async (salesData) => {
    try {
      const res = await fetch('https://businessupdate-server-4bow.vercel.app/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData),
      });

      const data = await res.json();
      console.log('Data sent to backend:', data);
      if (data.combinedTotal) {
        setSales(prevState => ({
          ...prevState,
          combinedTotal: data.combinedTotal
        }));
      }
    } catch (err) {
      console.error('Error sending data to backend:', err.message);
    }
  };

  const handleFetchData = async () => {
    const urls = {
      salesDE: "https://tktxtattoo.de/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_a569ecf96bc360a15f8eaf9b9096741cea4241d5&consumer_secret=cs_fc3a5eb07116ab7b2f9b1dde2e2621438dc98ca3",
      salesUK: "https://tktxtattoo.uk/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_96c186068b04dc031c6c93113a63f642f50e0845&consumer_secret=cs_e569f73ba22dbdd34b0a90a4b97a07be996bee36",
      salesES: "https://tktxtattoo.es/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_a55714790a50443f44ff0da1cf23c478ff9309ec&consumer_secret=cs_abbb2c7ed3364f4d4454fd8aad7d6559b8e658a2",
      salesNL: "https://tktxtattoo.nl/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_d09d2a495090ff53dc97345eded911f07bfe58af&consumer_secret=cs_4f314fa7466e18cc0aee3ab7da23f6172a024007",
      salesPL: "https://tktxtattoo.pl/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_54fb8c20fe51ff1a8350bdfadea0fc6315069802&consumer_secret=cs_31161fa8663fac2bdef282a49933f7a4bb900331",
      salesFR: "https://tktxtattoo.fr/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_f088b46d552bf1ce53843450a803fa1a7e2595e5&consumer_secret=cs_2a833550e98343b874ebff14c1038e547b641b1b",
      salesIT: "https://tktxtattoo.it/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_56b04ef7429d0ed69149cb9715638609327f4532&consumer_secret=cs_88fd79e3ead26eca6a84a8233c0d1ecbc0f8808b",
      salesPT: "https://tktxtattoo.pt/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_5652addf603514bf173f39a42cfe4e0c6c00d28d&consumer_secret=cs_9c430efc0573329f4a8dd566c68d0d5cd9724b83",
      salesSE: "https://tktxtattoo.se/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_8c3ead6978e8359a81729452ceb430a9f16beac8&consumer_secret=cs_07ede001b3d579e8148baa8adf910441fc391f9a",
      salesDK: "https://tktxtattoo.dk/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_745664222f83ac6acfe799ffcd5260b97267b91a&consumer_secret=cs_161e8f74acd2113563a55b59330c7c5adb7bbd08",
      salesFI: "https://tktxtattoo.fi/wp-json/wc/v3/reports/sales?total_sales&consumer_key=ck_0df1a0752aa14190a79417d6a46751e45be08a1b&consumer_secret=cs_3aca46d823c8b771dea431f9debb94b13f663606"
    };

    const salesData = {};
    let combinedTotal = 0;

    for (const [key, url] of Object.entries(urls)) {
      const salesValue = await fetchData(url);
      salesData[key] = salesValue;
      combinedTotal += parseFloat(salesValue);
    }

    salesData.combinedTotal = combinedTotal.toFixed(2);

    setSales(salesData);
    await sendToBackend(salesData);
  };

  useEffect(() => {
    const timesToRun = ["08:00", "12:00", "16:00", "20:00", "23:59"];

    const checkTimeAndFetch = () => {
      const now = new Date();
      const currentTime = now.toTimeString().substring(0, 5); // Format "HH:MM"

      if (timesToRun.includes(currentTime)) {
        handleFetchData();
      }
    };

    // Check every minute
    const intervalId = setInterval(checkTimeAndFetch, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-28">
      <div>
        <h1 className="text-5xl text-center mb-10">Dag Overzicht</h1>
      </div>
      <div className="text-center">
        <h3 className="text-2xl">DE: {sales.salesDE}</h3>
        <h3 className="text-2xl">UK: {sales.salesUK}</h3>
        <h3 className="text-2xl">ES: {sales.salesES}</h3>
        <h3 className="text-2xl">NL: {sales.salesNL}</h3>
        <h3 className="text-2xl">PL: {sales.salesPL}</h3>
        <h3 className="text-2xl">FR: {sales.salesFR}</h3>
        <h3 className="text-2xl">IT: {sales.salesIT}</h3>
        <h3 className="text-2xl">PT: {sales.salesPT}</h3>
        <h3 className="text-2xl">SE: {sales.salesSE}</h3>
        <h3 className="text-2xl">DK: {sales.salesDK}</h3>
        <h3 className="text-2xl">FI: {sales.salesFI}</h3>

        <h3 className="text-2xl">Combined Total: {sales.combinedTotal}</h3>

        <br />
        <button
          onClick={handleFetchData}
          className="bg-blue-500 text-white p-5 rounded-md mb-5"
        >
          Fetch and Send Data
        </button>
      </div>
    </div>
  );
};

export default App;