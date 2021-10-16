const stripInternalAttributes = ({
  PK,
  SK,
  GSI1PK: GSI1PK,
  GSI1SK: GSI1SK,
  ...entity
}) => entity;

export default stripInternalAttributes;
