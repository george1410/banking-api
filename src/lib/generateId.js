import base from 'base-x';
import { v4 as uuid4 } from 'uuid';

const B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const b62 = base(B62);

export default () => b62.encode(Buffer.from(uuid4().replace(/-/g, ''), 'hex'));
