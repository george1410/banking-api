const stripInternalAttributes = ({
  PK,
  SK,
  GSI1PK: GSI1PK,
  GSI1SK: GSI1SK,
  ...account
}) => account;

export default stripInternalAttributes;
