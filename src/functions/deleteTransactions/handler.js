import Transactions from '../../database/transactions';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const deleteAccountEvents = event.Records.filter(
    (record) =>
      record.eventName === 'REMOVE' &&
      record.dynamodb.Keys.SK.S.startsWith('ACCOUNT#')
  );

  try {
    for (const deleteAccountEvent of deleteAccountEvents) {
      const accountId = deleteAccountEvent.dynamodb.Keys.SK.S.split('#')[1];
      const userId = deleteAccountEvent.dynamodb.Keys.PK.S.split('#')[1];
      await Transactions(userId).deleteAllTransactions(accountId);
    }

    return generateResponse({
      statusCode: 200,
    });
  } catch (err) {
    return generateResponse({
      statusCode: 500,
    });
  }
};
