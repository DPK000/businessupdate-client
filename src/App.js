import React, { useState, useEffect } from 'react';

const App = () => {
  const [sales, setSales] = useState({
    salesDE: '',
  });
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data[0].total_sales;
    } catch (err) {
      setError(err.message);
      return '';
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

      if (!res.ok) {
        const errorDetails = await res.json();
        throw new Error(`Network response was not ok: ${res.status} - ${errorDetails.error}`);
      }

      const data = await res.json();
      console.log('Data sent to backend:', data);
    } catch (err) {
      console.error('Error sending data to backend:', err.message);
    }
  };

  const fetchAllData = async () => {
    const salesDE = await fetchData("https://tktxtattoo.eu/wp-json/wc/v3/reports/sales?total_sales&period=month&consumer_key=ck_e62df8dec57d875284b722dccddf69c714ed1b25&consumer_secret=cs_74757a188af974b0613fedaf17f1b024b8f982e0");

    const salesData = {
      salesDE,
    };

    setSales(salesData);
    await sendToBackend(salesData);
  };

  useEffect(() => {
    // Initial fetch
    fetchAllData();

    // Set up interval to call fetchAllData every 36,000 milliseconds (36 seconds)
    const intervalId = setInterval(fetchAllData, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-28">
      <div>
        <h1 className="text-5xl text-center mb-10">Maand overzicht</h1>
      </div>
      <div className="text-center">
        <h3 className="text-2xl">EU: {sales.salesDE}</h3>

        <br />
        <button className="bg-green-500 text-white p-5 rounded-md mb-5">Jaaroverzicht</button>
        <button className="bg-green-500 text-white p-5 rounded-md mb-5">Afgelopen Maand</button>
        <br />
        <button className="bg-yellow-600 text-white p-5 rounded-md mb-5">Dagoverzicht</button>
      </div>
    </div>
  );
}

export default App;