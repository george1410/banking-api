import currency from 'currency.js';

const generateAccounts = (customData, quantity = 1) => {
  const customDataArray = customData || Array.from({ length: quantity });

  const ACCOUNT_TYPES = ['Current', 'Savings'];

  return customDataArray.map((accountData) => {
    const { balance, accountType } = accountData || {};
    const randomAccountType =
      ACCOUNT_TYPES[Math.floor(Math.random() * ACCOUNT_TYPES.length)];

    return {
      balance: currency(balance ?? 0.0),
      accountType: accountType ?? randomAccountType,
    };
  });
};

export default generateAccounts;
