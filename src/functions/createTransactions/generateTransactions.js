import axios from 'axios';
import currency from 'currency.js';

const generateTransactions = async (customData, quantity = 1) => {
  const customDataArray = customData || Array.from({ length: quantity });
  const { data: randomCompanies } = await axios.get(
    'https://random-data-api.com/api/company/random_company',
    {
      params: {
        size: customDataArray.length,
      },
    }
  );

  return customDataArray.map((transactionData, i) => {
    const { merchant, category, amount, transactionDate } =
      transactionData || {};

    const { business_name: randomMerchant, industry: randomCategory } =
      randomCompanies[i];

    const randomAmount = -1 * (Math.round(Math.random() * 1000 * 100) / 100); // TODO: should be smarter
    const randomDate = new Date().toISOString(); // TODO: should be randomised

    return {
      merchant: merchant ?? randomMerchant,
      category: category ?? randomCategory,
      amount: currency(amount ?? randomAmount),
      transactionDate: transactionDate ?? randomDate,
    };
  });
};

export default generateTransactions;
