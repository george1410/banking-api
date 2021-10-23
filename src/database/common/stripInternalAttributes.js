const stripInternalAttributes = ({
  PK,
  SK,
  GSI1PK,
  GSI1SK,
  ...entity
}) => entity;

export default stripInternalAttributes;
