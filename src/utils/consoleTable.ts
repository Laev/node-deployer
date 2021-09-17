import type { PutObjectResult } from 'ali-oss';

export default function consoleTable(uploadCallback: any[]) {
  const result = uploadCallback.reduce((obj: any, item) => {
    const status = item?.res?.status === 200 ? `success` : `fail`;
    obj[item.name] = { status }
    return obj
  }, {})
  console.table(result)
}