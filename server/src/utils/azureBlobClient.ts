import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNSTRING,
  //"DefaultEndpointsProtocol=https;AccountName=elearnr;AccountKey=RWa6yv5DFCUqxAkFWo/BOEPOeJLtOve0PezEOIA9gcj9WbOTxJYHmiMjvZMv5hvSez5hc43LKn5P+AStcAGxGw==;EndpointSuffix=core.windows.net"
);

export { blobServiceClient };
