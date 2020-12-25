import Request from '@/utils/request';
const pathname = '/upload';

// 上传整体文件
export function uploadBaseic(data, onUploadProgres) {
  return Request({
    url: `${pathname}/baseic`,
    method: 'POST',
    reqType: 'upload',
    data,
    onUploadProgres
  });
}

// 切片上传
export function uploadSectioning(data, onUploadProgres) {
  return Request({
    url: `${pathname}/sectioning`,
    method: 'POST',
    reqType: 'upload',
    data,
    onUploadProgres
  });
}

// 合并切片
export function uploadMerge(data) {
  return Request({
    url: `${pathname}/merge`,
    method: 'POST',
    data
  });
}

// verify 检测是否已有文件存在
export function uploadVerify(data) {
  return Request({
    url: `${pathname}/verify`,
    method: 'POST',
    data
  });
}

export function uploadOther(data) {
  return Request({
    url: `${pathname}/other`,
    method: 'POST',
    data
  });
}
