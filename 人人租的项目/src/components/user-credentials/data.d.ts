export interface IHasIDCardInfo {
  face_url: string;
  back_url: string;
  surplus_view_num?: number;
}
export interface THasIdCard extends IHasIDCardInfo {
  expirationDate?: string;
  needWatermark?: boolean;
}

export interface IUploadIdCardInfo {
  fackUrl: string;
  backUrl: string;
  faceWaterUrl: string;
  backWaterUrl: string;
  host: string;
  loading: boolean;
  fackUrlLoading: boolean;
  backUrlLoading: boolean;
}

export type TType = 'super' | 'supplier' | 'merchant';
