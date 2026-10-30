import { createJsonListSchema } from './createJsonListSchema';

export default createJsonListSchema({
  name: 'certificateList',
  title: 'My Certificates',
  description: 'Paste your items array here. e.g. [{"id": "cert1", "label": "Network", "filetype": "txt", "content": "..."}]',
});
