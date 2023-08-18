import { POST } from '@/services/api';

// 商家名称搜索
export function getBusinessOptionsByName(data: any) {
  return POST('/super/data-center/server/serverList', data);
}

// 商家id搜索
export function getBusinessOptionsById(data: any) {
  return POST('/super/statistics-new/server-id-search', data);
}