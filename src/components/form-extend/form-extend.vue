<template>
  <a-form
    v-bind="$attrs"
    ref="ruleForm"
    :label-align="labelAlign"
    :label-col="labelCol"
    :layout="layout"
    :model="form"
    :rules="rules"
    :wrapper-col="wrapperCol"
  >
    <div
      v-for="formItem in formGroup"
      :key="formItem"
      class="form-extend-wrap"
      :style="{ ...formItemStyle }"
    >
      <a-form-item
        :label="formItem.title"
        :label-col="formItem.labelCol || labelCol"
        :name="formItem.key"
        :wrapper-col="formItem.wrapperCol || wrapperCol"
      >
        <template
          v-if="formItem.extraDesc"
          #extra
        >
          {{ formItem.extraDesc }}
        </template>
        <template v-if="formItem.type === 'string'">
          <!-- v-bind="formItem.otherConfig" 无破坏性植入, 只是新增一些属性, 不影响原有逻辑 -->
          <a-input
            v-model:value="form[formItem.key]"
            allow-clear
            :disabled="formItem.disabled"
            :maxlength="formItem.maxlength"
            :placeholder="formItem.placeholder || '请输入'"
            :type="formItem.type"
            v-bind="formItem.otherConfig"
            @change="onChange"
          >
            <template
              v-if="formItem.maxlength"
              #suffix
            >
              <span class="input-max-number">{{ form[formItem.key].length }}/{{ formItem.maxlength }}</span>
            </template>
          </a-input>
        </template>
        <template v-else-if="formItem.type === 'number'">
          <a-input-number
            v-model:value="form[formItem.key]"
            :max="formItem.max"
            :min="formItem.min"
            :step="formItem.step"
            style="width: 100%"
          />
        </template>
        <template v-else-if="formItem.type === 'textarea'">
          <a-textarea
            v-model:value="form[formItem.key]"
            allow-clear
            :disabled="formItem.disabled"
            :placeholder="formItem.placeholder || '请输入'"
            :rows="formItem.rows || 4"
          />
        </template>
        <template v-else-if="formItem.type === 'uploadImage'">
          <image-upload
            v-model:value="form[formItem.key]"
            :action="imageAction"
            :max="formItem.max"
            @change="formItem.onChange"
          />
        </template>
        <template v-else-if="formItem.type === 'richText'">
          <Editor
            v-model:value="form[formItem.key]"
            :config="formItem.config"
            style="margin-bottom: 8px"
          />
        </template>
        <template v-else-if="formItem.type === 'select'">
          <a-select
            v-model:value="form[formItem.key]"
            allow-clear
            :disabled="formItem.disabled"
            :filter-option="formItem.filterOption || filterOption"
            :mode="formItem.mode || (formItem.multiple && 'multiple') || undefined"
            option-filter-prop="label"
            :options="formItem.url ? selectOptions[formItem.key] : formItem.options"
            :placeholder="formItem.placeholder || '请选择'"
            :show-search="formItem.showSearch"
            @change="onComponentChange('select')"
            @click="onSelectClick(formItem)"
            @dropdown-visible-change="
              open => {
                selectDropdownChange(open, formItem);
              }
            "
          >
            <!-- 远程加载状态 -->
            <template
              v-if="formItem.url && selectLoadingStatus[formItem.key]"
              #notFoundContent
            >
              <a-spin size="small" />
            </template>
            <!-- 远程加载 -->
            <!-- <template v-if="formItem.url">
              <a-select-option
                v-for="option in selectOptions[formItem.key]"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </template>
            <template v-else>
              <a-select-option
                v-for="option in formItem.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </template> -->
          </a-select>
        </template>
        <template v-else-if="formItem.type === 'datepicker'">
          <a-date-picker
            v-model:value="form[formItem.key]"
            :placeholder="formItem.placeholder || '请选择'"
            :show-time="formItem.showTime"
            type="date"
          />
        </template>
        <template v-else-if="formItem.type === 'switch'">
          <a-switch
            v-model:checked="form[formItem.key]"
            checked-children="开"
            un-checked-children="关"
          />
        </template>
        <template v-else-if="formItem.type === 'checkbox'">
          <a-checkbox-group
            v-model:value="form[formItem.key]"
            :disabled="formItem.disabled"
            @change="val => $emit('checkbox-change', { val, formItem, form })"
          >
            <a-checkbox
              v-for="option in formItem.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-checkbox>
          </a-checkbox-group>
        </template>
        <template v-else-if="formItem.type === 'radio'">
          <a-radio-group
            v-model:value="form[formItem.key]"
            :disabled="formItem.disabled"
            @change="e => $emit('radio-change', { e, formItem, form })"
          >
            <a-radio
              v-for="option in formItem.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-radio>
          </a-radio-group>
        </template>
        <!-- 卡片组，添加商品 -->
        <template v-else-if="formItem.type === 'card'">
          <card-list
            v-model:value="form[formItem.key]"
            :add-btn-subtitle="formItem.addBtnSubtitle"
            :add-btn-text="formItem.addBtnText"
            :add-btn-title="formItem.addBtnTitle"
            :allow-add="formItem.allowAdd"
            :allow-delete="formItem.allowDelete"
            :allow-edit="formItem.allowEdit"
            :card-form="formItem.cardForm"
            :card-switch-false-value="formItem.cardSwitchFalseValue"
            :card-switch-name="formItem.cardSwitchName"
            :card-switch-show="formItem.cardSwitchShow"
            :card-switch-true-value="formItem.cardSwitchTrueValue"
            :card-text="formItem.cardText"
            :card-text-type="formItem.cardTextType"
            :card-title="formItem.cardTitle"
            :card-type="formItem.cardType"
            :card-width="formItem.cardWidth"
            :default-card-switch-value="formItem.defaultCardSwitchValue"
            :dialog-confirm-showe-message="dialogConfirmShoweMessage"
            :image-height="formItem.imageHeight"
            :image-key="formItem.imageKey"
            :image-width="formItem.imageWidth"
            :is-add-sign="formItem.isAddSign"
            :is-edit="formItem.isEdit"
            :is-order-cancel-pop="formItem.isOrderCancelPop"
            :item-width="formItem.itemWidth"
            :max="formItem.max"
            :modal-show="formItem.modalShow"
            :proxy-child-switch="formItem.proxyChildSwitch"
            :proxy-module-switch="formItem.proxyModuleSwitch"
            :same-sign="formItem.sameSign"
            :show-image-path="formItem.showImagePath"
            :vali-data="formItem.valiData"
          />
        </template>
        <template v-else-if="formItem.type === 'slide'">
          <a-slider
            v-model:value="form[formItem.key]"
            :disabled="formItem.disabled"
            :max="formItem.max"
            :min="formItem.min"
            :step="formItem.step"
            @change="onChange"
          />
        </template>
        <!-- 搜索栏热门 -->
        <template v-else-if="formItem.type === 'search-card'">
          <div class="recom-product">
            <div class="title">
              固定推荐坑位内容不限产品、活动等
              <span>（图片尺寸要求：212*220px）</span>
            </div>
            <div class="product-list">
              <div
                v-for="(item, index) in searchFixData"
                :key="index"
                class="product-item"
              >
                <a-image
                  :height="220"
                  :src="item.cover"
                  :width="212"
                />
                <div
                  class="edit-product item"
                  @click="handleEdit('edit', 1, item, index)"
                >
                  <FormOutlined style="font-size: 14px" />
                  编辑
                </div>
              </div>
              <div
                v-if="searchFixData.length < 3"
                class="add-product"
                @click="handleEdit('add', 1)"
              >
                <PlusOutlined style="font-size: 20px" />
                点击添加坑位
              </div>
            </div>
          </div>
          <div class="recom-banner">
            <div class="title">
              活动推荐位
              <span>（图片尺寸要求：686*150px）</span>
            </div>
            <div class="banner-list">
              <div
                v-for="(item, index) in searchActivityData"
                :key="index"
                class="banner-item"
              >
                <a-image
                  :height="150"
                  :src="item.cover"
                  :width="686"
                />
                <div
                  class="edit-banner item"
                  @click="handleEdit('edit', 2, item, index)"
                >
                  <FormOutlined style="font-size: 14px" />
                  编辑
                </div>
                <div
                  class="del-banner item"
                  @click="handleDel(index)"
                >
                  <DeleteOutlined style="font-size: 14px" />
                  删除
                </div>
              </div>
              <div
                class="add-banner"
                @click="handleEdit('add', 2)"
              >
                <PlusOutlined style="margin-right: 5px; font-size: 14px" />
                点击添加活动
              </div>
            </div>
          </div>
          <div class="recom-banner">
            <div class="title">
              搜索推荐词配置
            </div>
            <div style="padding-bottom: 10px">
              <a-form layout="vertical">
                <a-form-item
                  v-for="(item, index) in searchHotWordData"
                  :key="index"
                  label=""
                >
                  <a-input
                    disabled
                    :placeholder="item.word || '请配置推荐词'"
                    style="width: 520px"
                  >
                    <template #addonAfter>
                      <setting-outlined @click="OpenSearchHotWor(item)" />
                    </template>
                  </a-input>
                </a-form-item>
              </a-form>
            </div>
          </div>
          <form-modal
            v-model:visible="formModal.visible"
            :async-data="formModal.asyncData"
            :form="formModal.form"
            :title="formModal.title"
            :width="formWidth"
            @on-validate="onValidate"
          />
        </template>
        <!-- 商品详情页广告banner -->
        <template v-else-if="formItem.type === 'ad-banner-talbe'">
          <div class="ad-banner-talbe">
            <div style="margin-bottom: 20px; font-weight: 500; font-size: 20px">
              {{ formItem.title }}
            </div>
            <a-row style="margin-bottom: 40px">
              <div style="line-height: 32px">
                广告横幅名称：
              </div>
              <a-input-search
                v-model:value="banner"
                placeholder="输入关键词"
                style="width: 200px"
                @search="searchBanner"
              />
              <a-button
                style="margin-left: 30px"
                type="primary"
                @click="searchBanner"
              >
                筛选
              </a-button>
              <a-button
                style="margin-left: auto"
                @click="createAdBanner('add')"
              >
                创建横幅
              </a-button>
            </a-row>
            <a-table
              :columns="formItem.columns"
              :data-source="form[formItem.key]"
              :loading="adBannerForm.isTableLoading"
              :pagination="false"
              row-key="id"
            >
              <template #pic="{ text: src }">
                <image-item :img="src" />
              </template>
              <template #position>
                <div>商品详情页腰部</div>
              </template>

              <template #products="{ text: productsId }">
                <div class="productsId">
                  <div>{{ productsId.split(',').join('、') }}</div>
                  <span
                    class="detail"
                    @click="toggleEllipsis"
                  > 更多 </span>
                </div>
              </template>
              <template #actions="{ record }">
                <a
                  style="padding: 0 5px"
                  @click="createAdBanner('edit', record)"
                >编辑</a>
                <a
                  style="padding: 0 5px"
                  @click="deleteBanner(record.id)"
                >删除</a>
              </template>
            </a-table>
            <div style="display: flex; justify-content: center; margin-top: 60px">
              <a-pagination
                v-if="formItem.pageInfo.count"
                v-model:current="formItem.pageInfo.page"
                v-model:pageSize="formItem.pageInfo.pageSize"
                show-quick-jumper
                show-size-changer
                :total="formItem.pageInfo.count"
                @change="searchBanner({ page: formItem.pageInfo.page, pageSize: formItem.pageInfo.pageSize })"
                @show-size-change="searchBanner({ page: formItem.pageInfo.page, pageSize: formItem.pageInfo.pageSize })"
              />
            </div>
          </div>
          <form-modal
            v-model:visible="adBannerForm.visible"
            :auto-close="false"
            :form="adBannerForm.form"
            :loading="adBannerForm.loading"
            :title="adBannerForm.title"
            :width="670"
            @on-validate="onAdBannerSubmit"
            @radio-change="radioChange"
          />
        </template>
        <!-- 商品详情页浮轮滚条配置 -->
        <template v-else-if="formItem.type === 'roll-write'">
          <div class="recom-product">
            <div class="roll-title">
              添加商品
            </div>
            <div class="edit-roll">
              <div>
                <a-input
                  v-model:value="rollId"
                  :class="[isRoll ? 'input-roll' : '']"
                  placeholder="请输入"
                  style="width: 560px; margin-right: 8px"
                />
                <div class="roll-text">
                  {{ rollText }}
                </div>
              </div>
              <a-button
                style="width: 88px"
                type="primary"
                @click="handleAddRoll"
              >
                确认添加
              </a-button>
            </div>

            <div class="add-roll">
              当前已添加
            </div>
            <div class="roll-list">
              <template
                v-for="item in formItem.value"
                :key="item"
              >
                <a-tag
                  closable
                  @close="handleDeleteRoll(item)"
                >
                  <span style="margin-right: 5px">{{ item }}</span>
                </a-tag>
              </template>
            </div>
          </div>
        </template>
        <!-- 粘贴商家id -->
        <template v-else-if="formItem.type === 'server_id'">
          <a-select
            v-model:value="form[formItem.key]"
            allow-clear
            :mode="formItem.mode ?? 'tags'"
            :open="formItem.open ?? false"
            :options="options"
            :placeholder="formItem.placeholder ?? '请输入商家ID，多个商家ID可使用空格或者回车分隔'"
            :token-separators="formItem.tokenSeparators ?? [',', '，', ' ']"
          >
            <a-select-option
              v-for="option in selectOptions[formItem.key]"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </template>

        <!-- 城市级联选择 -->
        <template v-else-if="formItem.type === 'cascader'">
          <a-tree-select
            v-model:value="form[formItem.key]"
            dropdown-class-name="category-select-content"
            placeholder="请选择展示城市"
            :show-checked-strategy="SHOW_PARENT"
            tree-checkable
            :tree-data="cascaderOptions[formItem.key]"
            tree-node-filter-prop="title"
          />
        </template>
      </a-form-item>
    </div>
    <slot name="content" />
  </a-form>
  <a-modal
    v-model:visible="visible"
    title="搜索推荐词配置修改"
    @ok="handleOk"
  >
    <a-form layout="vertical">
      <a-form-item>
        <template #label>
          <span style="color: red">*</span> 推荐词
        </template>
        <a-input
          v-model:value="searchHotData.word"
          placeholder="请输入推荐词"
          style="width: 320px"
        />
      </a-form-item>
      <a-form-item label="跳转链接">
        <a-input
          v-model:value="searchHotData.link"
          placeholder="请输入跳转链接"
          style="width: 320px"
        />
      </a-form-item>
      <a-form-item label="标签图案地址">
        <a-input
          v-model:value="searchHotData.cover"
          placeholder="请输入标签图案地址"
          style="width: 320px"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
// select 的 mode 为 multiple 时。checkbox。uploadImage。时vulue为数组类型
import ImageUpload from '../image-upload/image-upload.vue';
import Editor from '../editor/editor.vue';
import { editorFilter } from '@/utils/filters';
import { loadChineseDistricts, loadProvinces } from '@/utils/static-load';
import { GET, POST } from '@/services/api';
import {
  PlusOutlined,
  DeleteOutlined,
  FormOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue';
import { formConfig } from '../../config/form-config';
import { TreeSelect } from 'ant-design-vue';
import { createVNode, h } from 'vue';

export default {
  components: {
    ImageUpload,
    Editor,
    PlusOutlined,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined,
    SettingOutlined,
  },
  provide() {
    return {
      formGroup: this.formGroup,
    };
  },
  props: {
    errorText: {
      type: String,
      default: '请将表单填写完整',
    },
    labelCol: {
      type: Object,
      default() {
        return {
          span: 4,
        };
      },
    },
    wrapperCol: {
      type: Object,
      default() {
        return {
          span: 14,
        };
      },
    },
    formGroup: {
      type: Array,
      default() {
        return [];
      },
    },
    layout: {
      type: String,
      default: 'horizontal', // 'horizontal'|'vertical'|'inline'
    },
    labelAlign: {
      type: String,
      default: 'right', // 	'left' | 'right'
    },
    formItemStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    dialogConfirmShoweMessage: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change', 'getData', 'search-banner', 'radio-change', 'getConfig', 'checkbox-change', 'componentChange'],
  data() {
    return {
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      // 开启展示城市，但没有选中城市时的提示文本
      cityVerifyText: null,
      visible: false,
      searchHotData: {
        id: '',
        link: '',
        word: '',
        cover: '',
      },
      rollText: '',
      isRoll: false,
      rollList: [],
      rollId: '', //滚动文字商品
      currentIndex: '',
      handle: '',
      searchFixData: [],
      searchActivityData: [],
      searchHotWordData: [
        { id: '', word: '', link: '', cover: '' },
        { id: '', word: '', link: '', cover: '' },
        { id: '', word: '', link: '', cover: '' },
      ],
      formWidth: 800,
      formModal: {
        visible: false,
        form: [],
        title: '',
        asyncData: false,
      },
      text: '坑位',
      cardForm: 'imageFormConfig', //搜索热门
      banner: '',
      adBannerForm: {
        visible: false,
        loading: false,
        form: [],
        title: '',
        asyncData: false,
        isTableLoading: false,
      },
      rules: {}, // 需要通过formGroup的项目rules生成
      form: {}, // 需要通过formGroup的项目key value生成
      resultRules: {}, // 需要通过formGroup的项目dataType生成
      editorConfig: editorFilter(),
      imageAction: 'site',
      selectOptions: {}, // 可能存在多个异步选择器
      selectLoadingStatus: {}, // 可能存在多个异步选择器
      selectDropdownStatus: {}, // 可能存在多个异步选择器
      // 城市级联
      cascaderOptions: [],
    };
  },
  watch: {
    formGroup: {
      handler(formGroup) {
        if (!Array.isArray(formGroup)) {
          return;
        }
        const form = {};
        const rules = {};
        const resultRules = {};
        const selectLoadingStatus = {};
        const selectOptions = {};
        formGroup.forEach(item => {
          if (typeof item.key !== 'undefined') {
            // 支持数组，布尔值，数字，对象转换成 string
            if (item.type === 'string') {
              // 自定义处理函数
              if (typeof item.handleInitValue === 'function') {
                form[item.key] = item.handleInitValue(item.value) || '';
              } else {
                form[item.key] = item.value ? item.value.toString() : '';
              }
            } else if (item.type === 'number') {
              form[item.key] = isNaN(item.value) ? 0 : Number(item.value);
            } else {
              form[item.key] = item.value;
            }
            // 收集校验规则
            rules[item.key] = item.rules || [];
            // 收集提交格式
            if (item.dataType) {
              resultRules[item.key] = item.dataType;
            }
            // 处理异步选择器
            if (item.type === 'select' && item.url) {
              selectLoadingStatus[item.key] = true;
              selectOptions[item.key] = [];
              if (item.value) {
                this.onSelectClick(item);
              }
            }
            // 获取级联城市数据
            if (item.type === 'cascader') {
              // 保存未选城市时提示文本
              this.cityVerifyText = item.cityVerifyText;
              this.getCityCascader(item);
            }
            if (item.type === 'ad-banner-talbe') {
              this.adBannerForm.isTableLoading = false;
              this.$nextTick(() => {
                let doms = document.querySelectorAll('.productsId');
                doms.forEach(item => {
                  if (item.clientHeight > 44) {
                    item.classList.add('ellipsis');
                  } else {
                    const detail = item.children[1];
                    item.removeChild(detail);
                  }
                });
              });
            }
          }
        });
        this.form = form;
        this.rules = rules;
        this.resultRules = resultRules;
        this.initFormDisplayCity();
        this.selectLoadingStatus = selectLoadingStatus;
        this.selectDropdownStatus = {};
        this.selectOptions = selectOptions;
        // 表单改了，需要移除表单项的校验结果
        this.$nextTick(() => {
          this.clearValidate();
        });
      },
      immediate: true, // 立即以表达式的当前值触发回调
      deep: true,
    },
    searchFixData: {
      handler() {
        this.$emit('getData', { fixedData: this.searchFixData, activityData: this.searchActivityData });
      },
      deep: true, // 必须加这个属性
    },
    searchActivityData: {
      handler() {
        this.$emit('getData', { fixedData: this.searchFixData, activityData: this.searchActivityData });
      },
      deep: true, // 必须加这个属性
    },
  },
  mounted() {
    if (this.formGroup.length) {
      if (this.formGroup[0].type == 'search-card') {
        this.getSearchData();
      }
      if (this.formGroup[0].type === 'flow-role') {
        this.getCutFlowData();
      }
    }
  },
  methods: {
    handleOk() {
      if (this.searchHotData.word == '') {
        this.$message.error('推荐词为必填项!');
      } else {
        POST('/super/hot-recommend/save-search-hot-word', this.searchHotData).then(res => {
          if (res.status == 0) {
            this.visible = false;
            this.getSearchData();
            this.$message.success('操作成功');
          }
        });
      }
    },
    OpenSearchHotWor(e) {
      this.visible = true;
      this.searchHotData = e;
      console.log(e);
    },
    editRoll(id, type) {
      const data = {
        configType: 'base.conf.item.roll.write',
        bizContent: JSON.stringify({
          item_id: id,
          type,
        }),
      };
      POST('/super/operation-v3/save-config', data)
        .then(res => {
          if (res.status == 0) {
            if (type == 'add') {
              this.isRoll = false;
              this.rollText = '';
            }
            this.$message.success('操作成功');
            // this.getRollData();
            this.$emit('getConfig');
          }
        })
        .catch(err => {
          if (type == 'add') {
            this.isRoll = true;
            this.rollText = err.message;
          }
        });
    },
    handleDeleteRoll(id) {
      this.editRoll(id, 'delete');
    },
    handleAddRoll() {
      if (this.rollId == '') {
        this.$message.warn('请输入商品id');
        return;
      }
      this.editRoll(this.rollId, 'add');
    },
    // 获取滚动参数
    getRollData() {
      GET('/super/operation-v3/config-base?configType=base.conf.item.roll.write').then(res => {
        if (res.status == 0) {
          this.rollList = res.data.config;
        }
      });
    },
    handleDel(index) {
      this.searchActivityData.splice(index, 1);
    },
    // 获取搜索热门首页数据
    getSearchData() {
      GET('/super/hot-recommend/hot-recommend-list').then(res => {
        if (res.status == 0) {
          this.searchFixData = res.data.fixedData;
          this.searchActivityData = res.data.activityData;
          if (res.data.searchHotWord && res.data.searchHotWord.length > 0) {
            for (let index = 0; index < res.data.searchHotWord.length; index++) {
              this.searchHotWordData[index] = res.data.searchHotWord[index];
            }
          }
        }
      });
    },
    onValidate(newItem) {
      if (this.text == '坑位' && this.handle == 'add') {
        this.searchFixData.push(newItem);
      } else if (this.text == '活动' && this.handle == 'add') {
        this.searchActivityData.push(newItem);
      } else if (this.text == '坑位' && this.handle == 'edit') {
        this.searchFixData.splice(this.currentIndex, 1, newItem);
      } else {
        this.searchActivityData.splice(this.currentIndex, 1, newItem);
      }
    },
    handleEdit(handle, num, item, index) {
      if (!formConfig[this.cardForm]) {
        return;
      }
      this.text = num == 1 ? '坑位' : '活动';
      this.handle = handle;
      this.currentIndex = index;
      const form = formConfig[this.cardForm].map(formItem => {
        return { ...formItem };
      });

      if (item) {
        form.forEach(formItem => {
          if (typeof item[formItem.key] !== 'undefined') {
            if (formItem.key === 'type') {
              formItem.value = Number(item[formItem.key]);
            } else {
              formItem.value = item[formItem.key];
            }
          }
        });
        // this.activeItemId = item.dragId;
      }

      this.openModal({
        title: item ? `编辑${this.text}` : `添加${this.text}`,
        form,
      });
    },
    // 打开搜索热门配置
    openModal({ title, form }) {
      this.formModal.title = title;
      this.formModal.form = form;
      this.formModal.asyncData = undefined;
      this.formModal.visible = true;
    },
    //提交banner
    onAdBannerSubmit(form) {
      const data = {
        banner_id: form.id,
        cover: form.pic[0].replace('https://img-t1.rrzuji.cn/', '').replace('https://img1.rrzuji.cn/', ''),
        banner_name: form.name.trim(),
        type: form.type,
        app_position: form.position,
        app_item: form.applyProduct == 'all' ? 1 : 2,
        app_item_context: form.applyProduct == 'all' ? undefined : form.productIds,
        link: form.link,
        path: form.path,
        appId: form.appId,
        extraData: form.extraData,
        remark: form.remark.trim(),
      };
      let url = this.adBannerForm.title == '创建横幅' ? '/super/banner/add-banner' : '/super/banner/edit-banner';

      //校验成功后modal的loading为加载中
      this.adBannerForm.loading = true;

      POST(url, { ...data, banner_id: this.adBannerForm.id })
        .then(() => {
          this.adBannerForm.visible = false;
          this.banner = '';
          this.searchBanner({});
        })
        .finally(() => {
          this.adBannerForm.loading = false;
        });
    },
    //删除banner
    deleteBanner(banner_id) {
      this.$modal.confirm({
        title: '确认删除',
        icon: createVNode(ExclamationCircleOutlined),
        content: h('div', { style: 'color:red;' }, '删除后数据无法恢复', [
          h('span', { style: 'color:rgb(95 94 94)' }, '，你还要删除吗？'),
        ]),
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: () => {
          this.adBannerForm.isTableLoading = true;
          const success = () => this.$message.success('删除成功！');
          GET('/super/banner/delete-banner', { banner_id }).then(() => {
            success();
            this.searchBanner({});
          });
        },
      });
    },
    //创建或编辑banner
    async createAdBanner(handel, item) {
      const config = 'goodsDetailAdBannerFormConfig';
      if (!formConfig[config]) {
        return;
      }
      const form = formConfig[config].map(formItem => {
        return { ...formItem };
      });
      //编辑时
      if (item) {
        const { data } = await GET('/super/banner/banner-detail', { banner_id: item.id });
        item.pic = [data.cover];
        item.name = data.banner_name;
        item.type = data.type;
        item.position = data.app_position;
        item.applyProduct = data.app_item == '1' ? 'all' : 'part';
        item.productIds = data.app_item == '1' ? '全部' : data.app_item_context;
        item.link = data.link;
        item.path = data.path;
        item.appId = data.appId;
        item.extraData = data.extraData;
        item.remark = data.remark;
        if (item['applyProduct'] == 'part') {
          form.splice(-1, 0, {
            title: '指定页面',
            key: 'productIds',
            value: '',
            placeholder: '多个商品id以英文逗号","分隔；',
            type: 'textarea',
          });
        }
        form.forEach(formItem => {
          if (typeof item[formItem.key] !== 'undefined') {
            if (formItem.key === 'type') {
              formItem.value = Number(item[formItem.key]);
            } else {
              formItem.value = item[formItem.key];
            }
          }
        });
      }
      this.openAdModal({
        title: item ? '编辑横幅' : '创建横幅',
        form,
        id: item ? item.id : undefined,
      });
    },
    openAdModal({ title, form, id }) {
      this.adBannerForm.title = title;
      this.adBannerForm.form = form;
      this.adBannerForm.asyncData = undefined;
      this.adBannerForm.visible = true;
      this.adBannerForm.id = id;
    },
    toggleEllipsis(e) {
      const detail = e.target;
      const productId = detail.parentNode;
      if (detail.innerText == '更多') {
        detail.innerText = '收起';
      } else {
        detail.innerText = '更多';
      }
      productId.classList.toggle('ellipsis');
    },
    searchBanner({ page = 1, pageSize = 10 }) {
      this.adBannerForm.isTableLoading = true;
      this.$emit('search-banner', { banner_name: this.banner, page, pageSize });
    },
    radioChange({ e, formItem }) {
      if (formItem.key == 'applyProduct') {
        if (e.target.value == 'part') {
          this.adBannerForm.form.splice(-1, 0, {
            title: '指定页面',
            key: 'productIds',
            value: '',
            placeholder: '多个商品id以英文逗号","分隔；',
            type: 'textarea',
          });
        } else {
          this.adBannerForm.form.splice(-2, 1);
        }
        console.log(this.adBannerForm.form);
      }
    },
    async submit() {
      // 针对表单有展示城市项的数据进行处理
      let display_city;
      if (this.form.is_apply_city === 1 && this.form.display_city.length == 0) {
        return Promise.reject(new Error(this.cityVerifyText));
      } else if (this.form?.display_city && this.form.display_city.length > 0) {
        display_city = await this.submitCityData();
      }

      try {
        await this.$refs.ruleForm.validate();
        const form = { ...this.form };
        // 支持数组，布尔值，数字，对象转换成 string，定义了dataType为string,会将结果数据转换
        Object.keys(this.resultRules).forEach(key => {
          if (form[key] && this.resultRules[key] === 'string') {
            if (Array.isArray(form[key]) || typeof form[key] === 'boolean' || typeof form[key] === 'number') {
              form[key] = form[key].toString();
            }
            if (typeof form[key] === null) {
              form[key] = JSON.stringify(form[key]);
            }
          }
          // 过滤cardlist里的dragid。但非form-extend调用的，需要手动过滤
          if (Array.isArray(form[key]) && form[key].length && this.resultRules[key] === 'clear-drag-id') {
            const cardList = form[key].map(item => {
              return {
                ...item,
              };
            });
            cardList.forEach(item => {
              delete item.dragId;
            });
            form[key] = cardList;
          }
        });
        if (display_city) {
          return { ...form, display_city };
        } else {
          return { ...form };
        }
      } catch (e) {
        console.log(e);
        return Promise.reject(new Error('请将表单补充完善'));
      }
    },
    resetForm() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    clearValidate() {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
    },
    filterOption(input, option) {
      return option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    log(e) {
      console.log(e);
    },
    selectDropdownChange(open, formItem) {
      // 300是收起的动画耗时，防止闪烁
      setTimeout(() => {
        // 延迟执行
        this.selectDropdownStatus[formItem.key] = open;
        if (!open && formItem.url) {
          this.selectLoadingStatus[formItem.key] = true;
          // 关闭下拉时清空
          this.selectOptions[formItem.key] = [];
        }
      }, 350);
    },
    onSelectClick(formItem) {
      if (!formItem.url || this.selectDropdownStatus[formItem.key]) {
        return;
      }
      GET(formItem.url, formItem.urlParams)
        .then(res => {
          let options = [];
          if (typeof formItem.handlerFetch === 'function') {
            options = formItem.handlerFetch(res);
          }
          this.selectOptions[formItem.key] = options;
        })
        .finally(() => {
          this.selectLoadingStatus[formItem.key] = false;
        });
    },
    getCityCascader(formItem) {
      loadProvinces().then(data => {
        this.cascaderOptions[formItem.key] = data;
      });
    },
    onChange() {
      this.$emit('change');
    },
    // 目前仅支持 select 如需支持其他，请在模板里添加 @change 事件
    onComponentChange(component) {
      this.$emit('componentChange', component);
    },
    onSetComponentData(data) {
      this.$nextTick(() => {
        Object.assign(this.form, { ...this.form, ...data });
      });
    },

    // 对城市级联数据进行处理
    async submitCityData() {
      await loadChineseDistricts();
      // 对新疆地址特殊处理，“自治区直辖县级行政区划-code: 659000”中的数据需要向上级提取出一份
      const specialCity = [];
      this.form.display_city.forEach(item => {
        const tempArr = item.split('-');
        if (tempArr[1] && tempArr[1] === '自治区直辖县级行政区划') {
          if (tempArr[2]) {
            specialCity.push(`${tempArr[0]}-${tempArr[2]}`);
          } else {
            specialCity.push(...Object.values(ChineseDistricts[659000]).map(e => `${tempArr[0]}-${e}`));
          }
        }
      });
      specialCity.push(...this.form.display_city);

      const citys = {};
      const regions = {};
      specialCity.forEach(item => {
        const tempArr = item.split('-');
        if (tempArr[1] === '市辖区') {
          tempArr[1] = tempArr[0];
        }
        if (!citys[tempArr[0]]) {
          citys[tempArr[0]] = [];
        }
        if (tempArr[1] && !citys[tempArr[0]].includes(tempArr[1])) {
          citys[tempArr[0]].push(tempArr[1]);
        }
        if (tempArr[1]) {
          if (!regions[tempArr[1]]) {
            regions[tempArr[1]] = [];
          }
          if (tempArr[2]) {
            regions[tempArr[1]].push(tempArr[2]);
          }
        }
      });

      const CityData = await loadProvinces();
      const result = [];
      Object.keys(citys).forEach(key => {
        const child = citys[key].map(item => {
          let code;
          // 找到对应的市区code编码值
          for (let index = 0; index < CityData.length; index++) {
            let childItem = CityData[index].children;
            for (let childIndex = 0; childIndex < childItem.length; childIndex++) {
              let element = childItem[childIndex];
              if (element.value == `${key}-${item}`) {
                code = element.code;
                break;
              }
            }
            if (code !== undefined) {
              break;
            }
          }

          return {
            city: item === '市辖区' ? key : item,
            region: regions[item] || [],
            code,
          };
        });

        let code;
        // 找到对应的省份code值
        for (let index = 0; index < CityData.length; index++) {
          if (CityData[index].title == key) {
            code = CityData[index].code;
            break;
          }
        }

        result.push({
          province: key,
          child,
          code,
        });
      });

      return result;
    },

    getSelectKey(source, prefix) {
      const keys = [];
      const prefixArr = prefix.split('-');
      source.forEach(item => {
        const child = item.child || item.region || [];
        let label = item.province || item.city || item;
        if (label === prefixArr[prefixArr.length - 1]) {
          label = '市辖区';
        }
        const nextPrefix = prefix ? `${prefix}-${label}` : label;
        if (child.length) {
          keys.push(...this.getSelectKey(child, nextPrefix));
        } else {
          keys.push(nextPrefix);
        }
      });
      return keys;
    },
    // 判断当前表单项是否已有选中的展示城市
    async initFormDisplayCity() {
      if (Object.keys(this.form).length !== 0 && this.form.display_city?.length > 0) {
        const key = this.getSelectKey(this.form.display_city, '');
        await loadChineseDistricts();
        const specialKeys = Object.values(ChineseDistricts[659000]);
        this.form.display_city = key.filter(key => {
          const keyArr = key.split('-');
          return !(keyArr[0] === '新疆维吾尔自治区' && specialKeys.includes(keyArr[1]));
        });
      } else if (Object.keys(this.form).length !== 0 && this.form.display_city?.length == 0) {
        this.form.display_city = [];
      }
    },
  },
};
</script>
<style scoped lang="less">
.title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 400;
  font-size: 16px;
  span {
    color: rgba(0, 0, 0, 0.45);
    font-weight: 400;
    font-size: 12px;
  }
}
.add-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 212px;
  height: 220px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 400;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
}
.product-list {
  display: flex;
}
.product-item {
  position: relative;
  width: 212px;
  height: 220px;
  margin-right: 32px;
  overflow: hidden;
  // background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.08) 100%);
  border-radius: 8px;
  ::v-deep(.ant-image-img) {
    width: 212px;
    height: 220px;
  }
}
.item {
  width: 72px;
  height: 26px;
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 26px;
  text-align: center;
  background: #000;
  border-radius: 13px;
  cursor: pointer;
  opacity: 0.57;
}
.edit-product {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
.recom-banner {
  margin-top: 40px;
}
.add-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 595px;
  height: 42px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 400;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
}
.banner-item {
  position: relative;
  width: 595px;
  height: 130px;
  margin-bottom: 24px;
  overflow: hidden;
  border-radius: 8px;
  ::v-deep(.ant-image-img) {
    width: 100%;
    height: 100%;
  }
}
.edit-banner {
  position: absolute;
  right: 100px;
  bottom: 16px;
}
.del-banner {
  position: absolute;
  right: 16px;
  bottom: 16px;
}
.productsId {
  position: relative;
  padding-right: 30px;
}
.ellipsis {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.detail {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #3777ff;
  font-size: 14px;
  cursor: pointer;
}
// 滚动文字
.roll-title {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
}
.add-roll {
  margin: 10px 0 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.input-roll {
  border-color: #ff7875;
}
.input-roll:focus {
  box-shadow: 0 0 0 2px #ff4d4f33;
}
.edit-roll {
  display: flex;
}
.roll-text {
  height: 22px;
  color: #ff4a57;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.input-max-number {
  color: #ccc;
}

.cut_role_wrap {
  h2 {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
  .role_head {
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 24px;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px;

    & > div {
      cursor: pointer;
    }

    h2 {
      margin-right: 8px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      font-size: 16px;
    }

    span {
      margin-left: 8px;
      color: #00c8be;
      font-weight: 400;
    }
  }
}
.disabled {
  :deep(.ant-input) {
    color: rgba(6, 21, 51, 0.65) !important;
  }
}
</style>
