import videoLength from 'video-length';

export const videoMetaInfo = async (videoPath: string): Promise<any> => {
  if (
    videoPath.endsWith('.mp4') ||
    videoPath.endsWith('.mkv') ||
    videoPath.endsWith('.mov') ||
    videoPath.endsWith('.avi')
  ) {
    const metaInfo = await videoLength(videoPath, {
      bin: '/usr/bin/mediainfo',
      extented: true,
    });

    return metaInfo;
  }

  return 0;
};
