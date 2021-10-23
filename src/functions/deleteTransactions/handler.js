import Transactions from '../../database/transactions';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const deleteAccountEvents = event.Records.filter(
    (record) =>
      record.eventName === 'REMOVE' &&
      record.dynamodb.Keys.SK.S.startsWith('ACCOUNT#')
  );

  try {
    const deletions = [];
    for (const deleteAccountEvent of deleteAccountEvents) {
      const accountId = deleteAccountEvent.dynamodb.Keys.SK.S.split('#')[1];
      const userId = deleteAccountEvent.dynamodb.Keys.PK.S.split('#')[1];
      deletions.push(Transactions(userId).deleteAllTransactions(accountId));
    }
    await Promise.all(deletions);

    return generateResponse({
      statusCode: 200,
    });
  } catch (err) {
    return generateResponse({
      statusCode: 500,
    });
  }
};
