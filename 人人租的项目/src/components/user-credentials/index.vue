<template>
  <a-modal
    title="用户凭证"
    :visible="hasIdCard"
    :width="640"
    @cancel="closeHasIdCardModal"
    @ok="closeHasIdCardModal"
  >
    <div class="content-wrap">
      <div class="id-card-wrap flex-wrap flex-x-justify">
        <div class="face-wrap">
          <p>身份证正面</p>
          <div class="face-img-wrap">
            <div class="water-mark-Background">
              <img src="https://img1.rrzuji.cn/uploads/scheme/2206/17/m/aUMknu6r2Cl3luxnI3Co.png">
            </div>
            <div class="face-img-con">
              <a-image
                v-if="IdCardList.face_url"
                alt="身份证正面照"
                :src="IdCardList.face_url"
                style="width: 100%; height: 100%; object-fit: contain"
              />
              <a-spin
                v-else
                class="flex-wrap flex-y-center flex-x-center"
                style="width: 100%; height: 100%"
              />
            </div>
            <img
              class="download-icon"
              src="https://img1.rrzuji.cn/uploads/scheme/2206/09/m/4hVadoyf5JLKRELcoCVi.png"
              @click="downLoad('身份证正面', IdCardList.face_url)"
            >
          </div>
        </div>

        <div class="back-wrap">
          <p>身份证反面</p>
          <div class="back-img-wrap">
            <div class="water-mark-Background">
              <img src="https://img1.rrzuji.cn/uploads/scheme/2206/17/m/aUMknu6r2Cl3luxnI3Co.png">
            </div>
            <div class="back-img-con">
              <a-image
                v-if="IdCardList.back_url"
                alt="身份证反面照"
                :src="IdCardList.back_url"
                style="width: 100%; height: 100%; object-fit: contain"
              />
              <a-spin
                v-else
                class="flex-wrap flex-y-center flex-x-center"
                style="width: 100%; height: 100%"
              />
            </div>
            <img
              class="download-icon"
              src="https://img1.rrzuji.cn/uploads/scheme/2206/09/m/4hVadoyf5JLKRELcoCVi.png"
              @click="downLoad('身份证反面', IdCardList.back_url)"
            >
          </div>
        </div>
      </div>
      <div
        class="des"
        :style="{ 'margin-bottom': showViewNum ? '24px' : '0px' }"
      >
        租户身份证照片仅可用于在人人租平台产生的租赁业务，若需身份证照片原件可向平台申请
      </div>
      <div
        v-if="roleType == 'super' && showViewNum"
        class="number-of-views"
      >
        <info-circle-outlined /> <span>剩余查看次数：{{ hasIdCardInfo.surplus_view_num }}次</span>
      </div>

      <div
        v-else-if="roleType == 'merchant' && showViewNum"
        class="expiration-date"
      >
        <div class="num">
          <info-circle-outlined /> <span>剩余查看次数：{{ hasIdCardInfo.surplus_view_num }}次</span>
        </div>
        <div class="expiration-date-text">
          该身份证信息在{{ hasIdCardInfo.expire_at }}之前可见
        </div>
      </div>
    </div>
  </a-modal>
  <!-- 不展示身份证，展示示例图 -->
  <a-modal
    title="用户凭证"
    :visible="noIdCard"
    :width="640"
    @cancel="() => emits('update:noIdCard', false)"
  >
    <div class="no-idcard-content-wrap">
      <img
        class="demo-img"
        src="https://img1.rrzuji.cn/uploads/scheme/2212/03/m/PVL20T1N0ZrvVxjUfbrT.png"
      >

      <div class="tips">
        <div class="tips-title">
          已上传身份证正反面照片！
        </div>
        <div class="tips-text">
          已通过ocr认证，ocr识别技术可保证98%准确率
        </div>
      </div>

      <div :class="['expiry-date-con flex-wrap flex-x-justify flex-y-center', expiryDateClass[idCardValidRange]]">
        <img
          alt=""
          class="icon"
          :src="iconList[idCardValidRange]"
        >
        <span class="text">身份证有效期限：{{ noIdCardExpiration }}</span>
      </div>
    </div>
    <template #footer>
      <a-button
        type="primary"
        @click="() => emits('update:noIdCard', false)"
      >
        知道了
      </a-button>
    </template>
  </a-modal>
  <!-- 上传新身份证 -->
  <a-modal
    :confirm-loading="uploadIdCardInfo.loading"
    title="用户凭证"
    :visible="updateIdCard"
    :width="640"
    @cancel="() => emits('update:updateIdCard', false)"
    @ok="uploadSubmit"
  >
    <div class="upload-id-card-wrap flex-wrap flex-x-justify">
      <div class="fack-wrap">
        <p>身份证正面</p>
        <a-upload
          accept="image/*"
          :before-upload="(file:any) => beforeUpload(file, 'fackUrl')"
          class="avatar-uploader"
          list-type="picture-card"
          name="avatar"
          :show-upload-list="false"
        >
          <img
            v-if="uploadIdCardInfo.fackUrl"
            class="avatar"
            :src="uploadIdCardInfo.host + uploadIdCardInfo.fackUrl"
          >
          <div v-else>
            <loading-outlined v-if="uploadIdCardInfo.fackUrlLoading" />
            <upload-outlined v-else />
            <div class="ant-upload-text">
              上传身份证正面
            </div>
          </div>
        </a-upload>
      </div>
      <div class="back-wrap">
        <p>身份证反面</p>
        <a-upload
          accept="image/*"
          :before-upload="(file:any) => beforeUpload(file, 'backUrl')"
          class="avatar-uploader"
          list-type="picture-card"
          name="avatar"
          :show-upload-list="false"
        >
          <img
            v-if="uploadIdCardInfo.backUrl"
            class="avatar"
            :src="uploadIdCardInfo.host + uploadIdCardInfo.backUrl"
          >
          <div v-else>
            <loading-outlined v-if="uploadIdCardInfo.backUrlLoading" />
            <upload-outlined v-else />
            <div class="ant-upload-text">
              上传身份证反面
            </div>
          </div>
        </a-upload>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { InfoCircleOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { reactive, defineEmits, defineProps, onMounted } from 'vue';
import { getOssImageParams } from '@/utils/oss-helper';
import { THasIdCard, IHasIDCardInfo, IUploadIdCardInfo } from './data';

interface IProps {
  // 展示身份证详情弹窗
  hasIdCard: boolean;
  // 身份证详情数据
  hasIdCardInfo: THasIdCard;
  // 展示示例图弹窗
  noIdCard: boolean;
  // 身份证过期时间
  noIdCardExpiration: string;
  // 身份证过期状态
  idCardValidRange: number;
  // 展示修改身份证弹窗
  updateIdCard: boolean;
  // 图片是否已有加水印
  hasWatermark: boolean;
  // 是否展示剩余次数
  showViewNum: boolean;

  // 用户身份
  roleType: string;
}

const props = withDefaults(defineProps<IProps>(), {
  hasIdCard: false,
  noIdCard: false,
  noIdCardExpiration: '',
  idCardValidRange: 0,
  updateIdCard: false,
  hasWatermark: false,
  showViewNum: true,
  roleType: '',
  hasIdCardInfo: () => ({
    face_url: '',
    back_url: '',
    surplus_view_num: 0,
  }),
});

const emits = defineEmits([
  'update:hasIdCard',
  'update:noIdCard',
  'update:updateIdCard',
  'submit-update',
  'closeHasIdCard',
]);

// 上传身份证的
const uploadIdCardInfo = reactive<IUploadIdCardInfo>({
  fackUrl: '',
  backUrl: '',
  faceWaterUrl: '',
  backWaterUrl: '',
  host: '',
  loading: false,
  fackUrlLoading: false,
  backUrlLoading: false,
});

const iconList = {
  1: 'https://img1.rrzuji.cn/uploads/scheme/2212/03/m/CKmz4QIouKkP6jycGmxu.png',
  2: 'https://img1.rrzuji.cn/uploads/scheme/2212/03/m/AgsZl3g2kxnCoYd2fnWK.png',
  3: 'https://img1.rrzuji.cn/uploads/scheme/2212/03/m/MeTzEhdW3bWMUKqAuBi7.png',
};

// 身份证状态值: 0(已失效) 1(1年后过期) 2(1年内过期)
const expiryDateClass = [
  'expiry-date-background-error',
  'expiry-date-background-success',
  'expiry-date-background-warning',
];

// 展示身份证详情的
const IdCardList = reactive<IHasIDCardInfo>({
  face_url: '',
  back_url: '',
});

/**
 *  imgSrc: 将传入的图片地址转到canvas上
 *  flag: 默认将传入的图片添加水印
 */
//
const initCanvas = function (imgSrc: string, flag = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const cvs = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
    let imgEle = new Image();
    imgEle.src = imgSrc;
    imgEle.setAttribute('crossOrigin', 'Anonymous');
    cvs.setAttribute('width', '1');
    cvs.setAttribute('height', '1');
    imgEle.onload = function () {
      cvs.setAttribute('width', imgEle.width.toString());
      cvs.setAttribute('height', imgEle.height.toString());
      ctx.drawImage(imgEle, 0, 0);
      let resuleSrc = flag ? drawWaterMark(ctx, imgEle.width, imgEle.height, cvs) : cvs.toDataURL('image/png', 1);
      resolve(resuleSrc);
    };
    imgEle.onerror = function () {
      reject('身份证图片加载失败!');
    };
  });
};

// 给对应的canvas添加水印
const drawWaterMark = function (
  ctx: CanvasRenderingContext2D,
  imgWidth: number,
  imgHeight: number,
  cvs: HTMLCanvasElement,
): string {
  const maskText = '仅限人人租平台租赁使用'; // 水印文字
  const fontColor = 'rgba(0, 0, 0, 0.1)'; // 水印颜色
  const lineHeight = 250; // 水印文字行高
  const textWidth = 700; // 水印文字宽度
  const diagonalLength = imgHeight > imgWidth ? imgHeight * 2 : imgWidth; // 选取最长边
  ctx.translate(-imgWidth / 2, imgHeight / 2 - 200); // 画布旋转原点 移到 图片中心
  ctx.rotate(-Math.PI / 5);
  // ctx.setGlobalAlpha(0.8);
  const crossTime = Math.ceil((diagonalLength * 2) / textWidth);
  // 竖向循环次数
  const verticalTime = Math.ceil((diagonalLength * 2) / lineHeight);
  for (let j = 0; j < verticalTime; j++) {
    // 纵向循环
    ctx.font = '50px Arial';
    ctx.fillStyle = fontColor;
    ctx.fillText(maskText, 0, lineHeight * j);
    for (let i = 1; i < crossTime; i++) {
      // 横向循环
      ctx.font = '50px Arial';
      ctx.fillStyle = fontColor;
      ctx.fillText(maskText, textWidth * i, lineHeight * j);
    }
  }
  return cvs.toDataURL('image/png', 1);
};

const downLoad = async function (name: string, src: string) {
  if (src === '身份证正面照加载失败' || src === '身份证反面照加载失败') {
    message.error(src);
    return;
  }
  if (src.indexOf('http') === 0) {
    src = await initCanvas(src, false);
  }
  const el = document.createElement('a') as any;
  el.href = src;
  el.download = name;
  // 创建一个点击事件并对 a 标签进行触发
  const event = new MouseEvent('click');
  el.dispatchEvent(event);
};
const getRandomName = function (len = 15): string {
  // 上传文件名
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

const beforeUpload = async (file: any, type: string) => {
  if (type === 'fackUrl' || type == 'backUrl') {
    uploadIdCardInfo[type + 'Loading'] = true;
  }
  const imageParams = await getOssImageParams();
  const uploadParam = {
    key: imageParams['dir'] + getRandomName() + file.name,
    OSSAccessKeyId: imageParams.accessid,
    policy: imageParams.policy,
    signature: imageParams.signature,
    success_action_status: '200',
    dir: imageParams.dir,
    file,
  };
  await ossUpload(uploadParam, imageParams.imgOssServer, type);
  return false;
};

const ossUpload = function (uploadParam: any, host: string, type: string) {
  return new Promise(async resolve => {
    const formData = new FormData();
    for (const key in uploadParam) {
      formData.append(key, uploadParam[key]);
    }
    await fetch(host, {
      method: 'POST',
      body: formData,
    });
    if (type === 'fackUrl' || type == 'backUrl') {
      uploadIdCardInfo[type + 'Loading'] = false;
    }
    uploadIdCardInfo.host = host;
    uploadIdCardInfo[type] = `/${uploadParam['key']}`;
    resolve('');
  });
};

const dataURLToBlobOrFile = function (fileDataURL: any, name: string | undefined = undefined, flag = false) {
  let arr = fileDataURL.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (flag) {
    let file = new File([u8arr], name as string, { type: mime });
    return file;
  }
  return new Blob([u8arr], { type: mime });
};

// 利用上传的两张无水印的生成两张带水印的
const newWatermark = function () {
  return new Promise(async resolve => {
    uploadIdCardInfo.faceWaterUrl = await initCanvas(uploadIdCardInfo.host + uploadIdCardInfo.fackUrl);
    let fackFile = dataURLToBlobOrFile(uploadIdCardInfo.faceWaterUrl, '身份证正面照.jpg', true);
    await beforeUpload(fackFile, 'faceWaterUrl');
    uploadIdCardInfo.backWaterUrl = await initCanvas(uploadIdCardInfo.host + uploadIdCardInfo.backUrl);
    let backFile = dataURLToBlobOrFile(uploadIdCardInfo.backWaterUrl, '身份证反面照.jpg', true);
    await beforeUpload(backFile, 'backWaterUrl');
    resolve('');
  });
};

const uploadSubmit = async function () {
  if (!uploadIdCardInfo.backUrl || !uploadIdCardInfo.fackUrl) {
    message.warning('请上传身份证照片！');
    return false;
  }
  uploadIdCardInfo.loading = true;
  await newWatermark();
  emits('submit-update', uploadIdCardInfo);
};

// 关闭身份证详情弹窗
const closeHasIdCardModal = function () {
  emits('closeHasIdCard');
  emits('update:hasIdCard', false);
};

defineExpose({
  uploadIdCardInfo,
});
onMounted(async () => {
  // 展示身份证的
  if (props.hasIdCard) {
    if (!props.hasWatermark) {
      IdCardList.face_url = await initCanvas(props.hasIdCardInfo.face_url).catch(() => {
        message.error('身份证正面照加载失败');
        return '身份证正面照加载失败';
      });
      IdCardList.back_url = await initCanvas(props.hasIdCardInfo.back_url).catch(() => {
        message.error('身份证反面照加载失败');
        return '身份证反面照加载失败';
      });
    } else {
      IdCardList.face_url = props.hasIdCardInfo.face_url;
      IdCardList.back_url = props.hasIdCardInfo.back_url;
    }
  }
});
</script>

<style lang="less" scoped>
.content-wrap {
  .id-card-wrap {
    .face-wrap,
    .back-wrap {
      p {
        margin-bottom: 8px;
        color: rgba(6, 21, 51, 0.85);

        font-weight: bold;
        line-height: 22px;
        text-align: center;
      }
      .face-img-wrap,
      .back-img-wrap {
        position: relative;
        cursor: zoom-in;
        .water-mark-Background {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .face-img-con,
        .back-img-con {
          width: 256px;
          height: 194px;
          border-radius: 6px;
          ::v-deep(.ant-image) {
            width: 100%;
            height: 100%;
          }
        }

        .download-icon {
          position: absolute;
          right: 8px;
          bottom: 8px;
          z-index: 3;
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
      }
    }
  }

  .des {
    margin: 24px 0;
    color: rgba(6, 21, 51, 0.45);
    font-weight: 400;
    line-height: 22px;
  }
  .number-of-views {
    margin-bottom: 8px;
    color: #ff4d4f;
    text-align: center;
  }
  .expiration-date {
    box-sizing: border-box;
    width: 400px;
    height: 84px;
    margin: 8px auto;
    padding: 16px;
    text-align: center;
    background: #fff2f0;
    border-radius: 4px;
    .num {
      margin-bottom: 8px;
      color: #ff4d4f;
    }
    .expiration-date-text {
      color: rgba(6, 21, 51, 0.85);
      font-weight: 500;
    }
  }
}

.no-idcard-content-wrap {
  .demo-img {
    width: 592px;
    height: 240px;
  }

  .tips {
    margin: 24px 0;
    text-align: center;
    &-title {
      margin-bottom: 8px;
      color: rgba(6, 21, 51, 0.85);
      font-weight: bold;
      line-height: 24px;
    }

    &-text {
      color: var(--ant-primary-color);
    }
  }

  .expiry-date-con {
    margin: 0 96px 8px;
    padding: 16px 32px;
    .icon {
      width: 16px;
      height: 16px;
    }
    .text {
      color: rgba(6, 21, 51, 0.85);
      font-weight: bold;
      font-size: 16px;
      /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 24px;
    }
  }

  .expiry-date-background-success {
    background: #ebfafa;
    border: 1px solid #7fe0da;
    border-radius: 4px;
  }
  .expiry-date-background-warning {
    background: #fffbe6;
    border: 1px solid #ffe58f;
    border-radius: 4px;
  }
  .expiry-date-background-error {
    background: #fff1f0;
    border: 1px solid #ffa39e;
    border-radius: 4px;
  }
}

.upload-id-card-wrap {
  .fack-wrap,
  .back-wrap {
    > p {
      height: 22px;
      color: rgba(6, 21, 51, 0.85);
      font-weight: bold;
      font-size: 14px;
      /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
      font-family: PingFangSC-Medium, PingFang SC;
      line-height: 22px;
      text-align: center;
    }

    .avatar-uploader {
      width: 256px;
      height: 194px;
      background: rgba(6, 21, 51, 0.04);
      border: 1px dashed rgba(6, 21, 51, 0.15);
      border-radius: 2px;
      ::v-deep(.ant-upload-select-picture-card) {
        width: 256px;
        height: 194px;
        margin: 0;
        background: #f5f6f7;
        border: none;
        border-right: 1px dashed rgba(6, 21, 51, 0.15);
        border-bottom: 1px dashed rgba(6, 21, 51, 0.15);
      }
      .avatar {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
