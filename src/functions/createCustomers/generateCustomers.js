import axios from 'axios';

const generateCustomers = async (customData, quantity = 1) => {
  const customDataArray = customData || Array.from({ length: quantity });
  const { data: randomUsers } = await axios.get(
    'https://random-data-api.com/api/users/random_user',
    {
      params: {
        size: customDataArray.length,
      },
    }
  );

  return customDataArray.map((customerData, i) => {
    const {
      firstName,
      lastName,
      email,
      address: { city, streetAddress, zipCode, state, country } = {},
    } = customerData || {};

    const {
      first_name: randomFirstName,
      last_name: randomLastName,
      email: randomEmail,
      address: {
        city: randomCity,
        street_address: randomStreetAddress,
        zip_code: randomZipCode,
        state: randomState,
        country: randomCountry,
      } = {},
    } = randomUsers[i];

    return {
      firstName: firstName ?? randomFirstName,
      lastName: lastName ?? randomLastName,
      email: email ?? randomEmail,
      address: {
        city: city ?? randomCity,
        streetAddress: streetAddress ?? randomStreetAddress,
        zipCode: zipCode ?? randomZipCode,
        state: state ?? randomState,
        country: country ?? randomCountry,
      },
    };
  });
};

export default generateCustomers;
