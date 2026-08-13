const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/';

export const getOptimizedCloudinaryImage = (url, options = {}) => {
  if (!url || typeof url !== 'string' || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) return url;
  const { width = 640, height, crop = 'fill', gravity = 'auto', quality = 'auto:eco' } = options;
  const transformations = ['f_auto', `q_${quality}`, `c_${crop}`, `w_${width}`, height ? `h_${height}` : null, gravity ? `g_${gravity}` : null, 'dpr_auto'].filter(Boolean).join(',');
  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transformations}/`);
};

export const getCloudinarySrcSet = (url, widths, options = {}) => {
  if (!url || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) return undefined;
  const { heightRatio, ...imageOptions } = options;
  return widths.map((width) => {
    const height = heightRatio ? Math.round(width * heightRatio) : imageOptions.height;
    return `${getOptimizedCloudinaryImage(url, { ...imageOptions, width, height })} ${width}w`;
  }).join(', ');
};
