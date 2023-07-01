import { BlobItem } from '@azure/storage-blob';
import { GraphQLError } from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { AZURE_BLOB_CDN, CONTAINER_PREFIX } from '../types/constants';
import { ServerContext } from '../types/customTypes';
import { blobServiceClient } from '../utils/azureBlobClient';
import logger from '../utils/logger';
//import { videoMetaInfo } from '../utils/videoMetaInfo';

@Resolver()
export class FileResolver {
  @Mutation(() => GraphQLJSON)
  async uploadFile(
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename, mimetype }: FileUpload,
    @Arg('path', () => String) path: string,
    @Ctx() { req }: ServerContext,
  ) {
    const blockBlobClient = blobServiceClient
      .getContainerClient(`${CONTAINER_PREFIX}${req.session.userId}/${path}`)
      .getBlockBlobClient(filename);
    try {
      const upload = await blockBlobClient.uploadStream(
        createReadStream(),
        parseInt(req.headers['content-length'] ?? 'undefined', 10),
        20,
        { blobHTTPHeaders: { blobContentType: mimetype } },
      );

      logger.info(
        `${AZURE_BLOB_CDN}${CONTAINER_PREFIX}${req.session.userId}/${path}/${filename}`,
      );
      // const videoLength = await videoMetaInfo(
      //   `${AZURE_BLOB_CDN}${CONTAINER_PREFIX}${req.session.userId}/${path}/${filename}`,
      // );

      return {
        upload,
        // videoDuration: videoLength,
      };
    } catch (err) {
      logger.error('error in uploadFile()');
      throw new GraphQLError(err);
    }
  }

  @Query(() => GraphQLJSON, { nullable: true })
  async getContainer(
    @Arg('id', () => Int, { nullable: false }) id: number,
  ): Promise<BlobItem[] | null> {
    try {
      const data: BlobItem[] | any = [];
      const userContainer = await blobServiceClient.getContainerClient(
        `${CONTAINER_PREFIX}${id}`,
      );
      const blobs = userContainer.listBlobsFlat();
      for await (const blob of blobs) {
        data.push({
          blobName: blob.name,
          properties: {
            link: `${AZURE_BLOB_CDN}${CONTAINER_PREFIX}${id}/${blob.name}`,
            createdOn: blob.properties.createdOn,
            lastModified: blob.properties.lastModified,
            lastAccessedOn: blob.properties.lastAccessedOn,
            contentType: blob.properties.contentType,
            contentLength: blob.properties.contentLength,
          },
        });
      }
      return data;
    } catch (err) {
      logger.error('error in getUserContainer()');
      throw new GraphQLError(err);
    }
  }
}
