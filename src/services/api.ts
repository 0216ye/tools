import { message } from 'ant-design-vue';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HostType } from '@/utils/url';
import http from './service';
export interface IAxiosResponse<T> extends AxiosResponse {
  status: number;
  data: T;
  message?: string;
  error?: string;
  [key: string]: any;
}
const env = import.meta.env.DEV;

export interface RequestConfig extends AxiosRequestConfig {
  closeErrorMessage?: boolean;
  hostType?: HostType;
  successStatusCheckValue?: number | 'none';
}

/**
 * GET 一个示例: GET('/edit', { name: 'libai' }, { baseUrl: 'www.baidu.com' })
 * @param url
 * @param params
 * @param config
 */
export function GET<T, K = any>(url: string, params?: T, config?: RequestConfig): Promise<IAxiosResponse<K>> {
  return http
    .get<K>(url, { ...config, params })
    .catch(error => {
      if (env) {
        console.error('GET接口请求异常。下面是请求参数和异常信息：');
        console.error(url);
        console.error(error);
      }

      if (config && config.closeErrorMessage) {
        return Promise.reject(error);
      }
      if (error.response?.status === 400) {
        // 刷新频率过高
        message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
      } else {
        message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
      }
      return Promise.reject(error);
    });
}

/**
 * POST 一个示例: POST('/edit', { name: 'libai' }, { params: { id: 2 } })
 * @param url
 * @param data
 * @param config
 */
export function POST<T, K = any>(url: string, data?: T, config?: RequestConfig): Promise<IAxiosResponse<K>> {
  return http.post<K>(url, data, config).catch(error => {
    if (env) {
      console.error('POST接口请求异常。下面是请求参数和异常信息：');
      console.error(url);
      console.error(error);
    }
    if (config && config.closeErrorMessage) {
      return Promise.reject(error);
    }
    if (error.response?.status === 400) {
      // 刷新频率过高
      message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
    } else {
      message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
    }
    return Promise.reject(error);
  });
}

/**
 * 返回对应角色的数据
 * @param role 角色值，'super' 或为 ''
 * @param superData super对应数据
 * @param shopData 商家对应数据
 */
const getRoleData = (role: string, superData: any, shopData: any) => (role === 'super' ? superData : shopData);

/**
 * 图片库相关 start
 */
// 分类tree，包括两组数据，不区分
export const APIcateTree = (params: any) =>
  http.get(getRoleData(params.role, '/super/image/category-data', '/gallery/category-data'), params.data);
// 素材列表
export const APIgalleryList = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/gallery', '/gallery/gallery-index'), params.data);
// 删除图片或文件夹
export const APIdelGallery = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/delete-photo-or-dir', '/gallery/delete-photo-or-dir'), params.data);
// 更换分组
export const APIgroupGallery = (params: any) =>
  http.post(
    getRoleData(params.role, '/super/image/photo-change-category', '/gallery/photo-change-category'),
    params.data,
  );
// 新建分组
export const APIaddGroup = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/add-category', '/gallery/add-category'), params.data);
// 修改分类名称
export const APIChangeCateName = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/edit-category', '/gallery/edit-category'), params.data);
// 修改名称
export const APIChangeGalleryName = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/edit-photo-name', '/gallery/edit-photo-name'), params.data);
// 文件上传
export const APIUploadFile = (params: any) =>
  http.post(getRoleData(params.role, '/super/image/upload-gallery', '/gallery/upload-gallery'), params.data);
/**
 * 图片库相关 end
 */

/* 消息推送相关 start */
// 站内信列表
export const getMessageList = (params: any) =>
  http.get(
    getRoleData(params.role, '/super/message-v3/get-message-list', '/message-v3/get-message-server-list'),
    params.data,
  );

// 站内信详情
export const getMessageDetail = (params: any) =>
  http.get(
    getRoleData(params.role, '/super/message-v3/get-message-details', '/message-v3/get-message-server-details'),
    params.data,
  );

// 发布站内信
export const sendMessage = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-v3/create-message', ''), params.data);

// 获取商家组列表
export const getServerGroupList = (params: any) =>
  http.get(getRoleData(params.role, '/super/message-server-group/get-server-group-list', ''), params.data);

// 新增商家组
export const addServerGroup = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-server-group/create-server-group', ''), params.data);

// 删除商家组
export const delServerGroup = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-server-group/delete-server-group', ''), params.data);

// 商家组详情
export const serverGroupDetail = (params: any) =>
  http.get(getRoleData(params.role, '/super/message-server-group/get-server-group-details', ''), params.data);

// 商家组基本信息修改
export const serverGroupUpdate = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-server-group/edit-server-group', ''), params.data);

// 商家组商家列表
export const serverGroupDetailList = (params: any) =>
  http.get(getRoleData(params.role, '/super/message-server-group/get-server-group-details-list', ''), params.data);

// 商家组新增商家
export const serverGroupPush = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-server-group/batch-create-server-group-bind', ''), params.data);

// 商家组删除商家
export const serverGroupSplice = (params: any) =>
  http.post(getRoleData(params.role, '/super/message-server-group/delete-server-group-bind', ''), params.data);

// 商家后台消息未读数
export const getMessageCount = (params: any) =>
  http.get(getRoleData(params.role, '', '/message-v3/get-message-unread-count'), params.data);

// 商家后台标记已读
export const readMessage = (params: any) =>
  http.post(getRoleData(params.role, '', '/message-v3/message-mark-read'), params.data);
/* 消息推送相关 end */

// 商家分列表
export const merchantScoreList = (params: any) =>
  http.get(getRoleData(params.role, '/super/statistics/get-server-score', ''), params.data);

// 销售白名单的码商绑定添加
export const addSellAndMerchAccount = (params: any) => http.post('/super/sales-bind-merch/do-bind', params);
// 销售白名单添加
export const addSellAccount = (params: any) => http.get('/super/user-white-list/add', params);

// 获取销售白名单列表
export const sellAccountList = (params: any) => http.get('/super/user-white-list/get-list', params);
// 获取销售白名单的渠道绑定列表
export const sellBindMerchList = (params: any) => http.get('/super/sales-bind-merch/index', params);

// 删除销售白名单
export const delSellAccount = (params: any) => http.get('/super/user-white-list/del', params);
//删除码商绑定
export const unBind = (params: any) => http.get('/super/sales-bind-merch/un-bind', params);

/**
 * 订单关闭相关 start
 */
/** 任务列表**************** */
// 订单任务列表
export const APIOrderTask = (params: any) => http.get('/super/v2-order-task', params.data);
// 添加跟单员
export const APIOrderAddFollow = (params: any) => http.post('/super/v2-order-task/create-user', params.data);
// 更新跟单员
export const APIOrderUpdateFollow = (params: any) =>
  http.post(`/super/v2-order-task/update-user?${params.query}`, params.data);
// 删除跟单员
export const APIOrderDelFollow = (params: any) =>
  http.post(`/super/v2-order-task/delete-user?${params.query}`, params.data);
// 新建任务
export const APIOrderAddTask = (params: any) => http.post('/super/v2-order-task/create-task', params.data);
// 更新任务
export const APIOrderUpdateTask = (params: any) =>
  http.post(`/super/v2-order-task/update-task?${params.query}`, params.data);
// 风控状态
export const APIOrderRankStatus = (params: any) =>
  http.get(`/super/v2-order-task/rank-status?${params.query}`, params.data);
/* 订单列表******************* */
// 分配订单列表
export const APIOrderFollowList = (params: any) =>
  http.get('/super/v2-order-task/follow-list', { params: params.data });
// 刷新订单列表
export const APIOrderFollowListUpdate = () => http.get('/super/v2-order-task/refresh-list');
// 订单其它信息
export const APIOrderOtherMessage = (params: any) =>
  http.get('/super/v2-order/order-list-second', { params: params.data });
// 下单记录
export const APIOrderRecord = (params: any) => http.get('/super/v2-order/user-order-num', { params: params.data });
// 查询crm备注
export const APICrmRecord = (params: any) => http.get('/crm/log', { params: params.data });
// crm备注
export const APICrmEdit = (params: any) => http.post('/crm/push', params.data);
// 订单放弃跟进或继续跟进
export const APIFollowOrder = (params: any) => http.post('/super/v2-order-task/follow-order', params.data);
// 支付宝风控
export const APIAplipayRisk = (params: any) => http.post('/super/risk/alipay-risk', params.data);
// 详细
export const APIbaiRiongRisk = (params: any) => http.post(`/super/risk/bai-riong?${params.query}`, params.data);
// 区域
export const APIAreaRisk = (params: any) => http.post('/super/order-area-info/get-bad-info', params.data);
// 蚊盾
export const APIYiDunRisk = (params: any) => http.post('/super/risk/yi-dun-risk', params.data);
// 列入黑名单
export const APIToBlack = (params: any) => http.post('/api/gateway', params.data);
/**
 * 订单关闭相关 end
 */

// 会员中心问卷列表
export const questionList = (params: any) => http.post('/super/questionnaire/list', params);

// 会员中心问卷发布，不发布
export const questionPublish = (params: any) => http.post('/super/questionnaire/set-publish-status', params);

// 会员中心问卷删除
export const questionDel = (params: any) => http.post('/super/questionnaire/delete', params);

// 问卷详情
export const questionDetail = (params: any) => http.post('/super/questionnaire/detail', params);

// 问卷保存，新增
export const questionUpdate = (params: any) => http.post('/super/questionnaire/save', params);
/**
 * 企业销售回款相关 start
 * 以下接口都有三个角色。
 * entrance：financer | member | leader (财务 | 销售员 | 销售主管)
 */
// 绑定列表
export const APIBindList = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/list-order`, params.data);
// 汇总列表
export const APITotalList = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/list-statistics`, params.data);
// 结算详情 - 本月新增订单
export const APIBindDetail = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/list-statistics-detail-bind`, params.data);
// 结算详情 - 本月新增续租订单
export const APIGetContinueOrder = (params: any) =>
  http.get('/super/sales-perform/get-continue-order', { params: params.data });
// 结算详情 - 本月回款
export const APIChargeDetail = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/list-statistics-detail-charge`, params.data);
// 结算详情 - 本月结算后退款
export const APIRefundDetail = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/list-statistics-detail-after-refund`, params.data);
// 结算详情 - 刷新
export const APIDetailRefresh = (params: any) =>
  http.post(`/super/sales-perform-${params.entrance}/refresh-sale-statistics`, params.data);
// 绑定
export const APIBindSingle = (params: any) => http.post('/super/sales-perform-financer/add-order-bind', params.data);
// 验证通过，保存
export const APIBindSave = (params: any) =>
  http.post('/super/sales-perform-financer/add-order-batch-bind', params.data);
// 财务解绑操作
export const APIBindCancel = (params: any) => http.post('/super/sales-perform-financer/del-order-bind', params.data);
// 结算
export const APICountSettle = (params: any) =>
  http.post('/super/sales-perform-financer/settle-sales-statistics', params.data);
// 重新结算
export const APICountReSettle = (params: any) =>
  http.post('/super/sales-perform-financer/sales-again-settle', params.data);
// 销售部门列表
export const APISalesDepartmentList = (params: any) =>
  http.get('/super/sales-perform-financer/list-sales-department', params.data);
// 获取业绩计算数据
export const APIStatisticsRatio = () =>
  http.get('/super/operation-v3/config-base?configType=admin.super.statistics.ratio');
// 保存业绩计算数据
export const APIStatisticsRatioSave = (params: any) => http.post('/super/operation-v3/save-config', params.data);
/**
 * 企业销售回款相关 end
 */
/**
 *SPM码设置相关 start
 */
// 获取A码列表
export const APISPMPortList = (params: any) => http.get('/super/spm/port-list', { params: params.data });
// 创建、修改 A码名称
export const APISPMAddEditPort = (params: any) => http.post('/super/spm/add-edit-port', params.data);
// 获取BCD码页面-选项卡
export const APISPMCodeTap = (params: any) => http.get('/super/spm/code-tap', { params: params.data });
// 获取BCD码列表
export const APISPMCodeList = (params: any) => http.get('/super/spm/code-list', { params: params.data });
// 添加、编辑 SPM-BCD码
export const APISPMAddEditCode = (params: any) => http.post('/super/spm/add-edit-code', params.data);
/**
 *SPM码设置相关 end
 */
/**
 *SPM 统计数据展示相关 start
 */
// 图表—事件趋势—展示选项
export const APISPMSpmCode = (params: any) => http.get('/super/spm/s-p-m-code', { params: params.data });

/**
 *SPM 统计数据展示相关 end
 */
/**
 * 销售列表、扫码下单 相关api start
 */
// 漏斗-数据报表
export const APISalesGetQrcode = (params: any) => http.get('/super/sales-qrcode/get-qrcode', { params: params.data });
// 通过手机号获取用户名称
export const APISalesGetUserName = (params: any) =>
  http.get('/super/sales-qrcode/get-user-name', { params: params.data });
// 修改销售订单绑定
export const APISalesSetSalesOrder = (params: any) =>
  http.get('/super/sales-qrcode/set-sales-order', { params: params.data });
// 获取销售订单列表
export const APISalesGetOrders = (params: any) =>
  http.get('/super/sales-order/get-sales-orders', { params: params.data });
// 获取区块链文本存证标签
export const APISalesGetChainPhaseLabels = (params: any) =>
  http.get('/super/sales-order/get-chain-phase-labels', { params: params.data });

/**
 * 销售列表、扫码下单 相关api  end
 */

//  获取搜索词统计数据
export const getSearchWordData = (params: any) => http.get('/super/search-word/overview', { params: params.data });

export const postSearchWordData = (params: any) => http.post('/super/search-word/overview', params.data);

//  获取搜索词详细列表数据
export const getSearchDetailData = (params: any) => http.get('/super/search-word/detail', { params: params.data });

export const postSearchDetailData = (params: any) => http.post('/super/search-word/detail', params.data);

/**
 * 设置相关
 */
// 获取新预授权配置列表
export const getConfigListFreezeSite = (params: any) =>
  http.get('/super/site-config/list-freeze-site', { params: params.data });
// 保存新预授权配置
export const postConfigListFreezeSite = (params: any) => http.post('/super/site-config/push-freeze-site', params.data);

// 获取图片oss上传参数
export const getOssImage = () => http.get('/common/ossimage', { params: { pathName: 'scheme', oss: 1 } });

/**
 * 获取生成风控信息按钮权限
 */
export const ApiGetCreateRiskAuthority = () => {
  return POST('/api/gateway', { method: 'operation.bg.check.riskInfo.btn' });
};

/**
 * 用户工单相关
 * 参数看接口文档：http://yapi.rrzuji.net/project/83/interface/api/19445
 */
// 获取表格自定义列
export const getColumns = (params: any): Promise<any> => {
  return http.get('/super/userWO/work-order/get-query-field', { params });
};
// 接单
export const receiveOrder = (data: { id: number }) => {
  return POST('/super/userWO/work-order/receive', data);
};

// 保存表单字段
export const saveField = (data: any): Promise<any> => {
  return POST('/super/userWO/work-order/save-query-field', data);
};
// 获取商家表格自定义列
export const getMerchantColunms = (params: any): Promise<any> => {
  return http.get('/user-wo/get-query-field', { params });
};

/** 权限校验 */
export const queryRoutePermission = (params: string[]): Promise<any[]> => {
  return http.post('/super/common/has-permission', { route: params });
};
