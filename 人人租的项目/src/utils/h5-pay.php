<?php
?>

<?php //echo '<pre>';
?>
<?php //print_r($data);
?>
<?php //echo '</pre>';die();
?>

<?php $this->beginBlock("styles_placeholder"); ?>
<!-- 引入样式文件 -->
<link rel="stylesheet" href="/static/api/js/jsdelivr/index.css" />
<style>
    body,
    html,
    .page {
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .logo {
        display: block !important;
        margin: 24px auto 20px;
    }

    .main-block {
        background-color: #fff;
        border-radius: 8px;
        padding: 14px 10px;
        margin: 0px 10px 44px;
    }

    .min-title {
        color: #333;
        font-size: 14px;
        text-align: left;
        margin-bottom: 16px;
    }

    .money-input {
        width: auto !important;
        background: #f5f5f5;
        border-radius: 8px;
    }

    .money-input .money-unit {
        color: #333;
        font-size: 24px;
        font-weight: bold;
    }

    .money-input .van-field__label {
        line-height: 44px;
        width: auto;
        font-size: 24px;
        font-weight: bold;
    }

    .money-input .van-field__label span {
        position: relative;
    }

    .money-input .van-field__control {
        font-size: 24px;
    }

    .remark {
        line-height: 20px;
        font-size: 12px;
        margin-top: 10px;
    }

    .remark .btn-remark {
        color: #1792FE;
        margin-right: 4px;
    }

    .remark .remark-desc {
        color: #999;
    }

    .page-bottom-btn {
        margin-left: 15px !important;
        width: calc(100% - 30px);
        border-radius: 4px;
    }

    .wx-btn {
        background-color: #00ae2e !important;
        border: 1px solid #00ae2e !important;
    }

    .wx-keyboard .van-key--blue {
        background-color: #00ae2e !important;
    }

    .remark-input {
        width: 256px;
        line-height: 21px;
        background: #f5f5f5;
        font-size: 15px;
        color: #333;
        padding: 7px 12px;
        margin: 8px auto 19px;
    }

    .remark-dialog {
        border-radius: 8px;
    }

    .remark-dialog .van-hairline--left::after {
        border: 0 solid #e5e5e5;
        border-left-width: 1px;
    }

    .remark-dialog .van-dialog__header {
        padding-top: 20px;
    }
</style>
<?php $this->endBlock(); ?>

<div id="content" class="page" v-cloak>
    <van-image class="logo" width="180" height="81" src="https://img1.rrzuji.cn/uploads/scheme/2209/13/m/suCgA4Oa5bt7zBoOq1d1.png"></van-image>
    <div class="main-block">
        <div class="min-title">付款金额</div>
        <van-field disabled class="money-input" placeholder="付款金额" label="￥" label-class="money-unit" v-model="g_config.money" type="number" :clickable="true" @touchstart.native.stop="show = true">
        </van-field>
    </div>
    <van-button class="page-bottom-btn" :class="{'wx-btn': g_config.method == 'weixin'}" type="info" @click="ajaxPay">确认支付</van-button>
</div>
<script type="text/javascript">
    window.g_config = window.g_config || {};
    g_config['data'] = <?= json_encode($data); ?>
</script>

<?php $this->beginBlock("scripts_placeholder"); ?>
<!-- 引入 Vue 和 Vant 的 JS 文件 -->
<script src="/static/api/js/jsdelivr/vue.min.js"></script>
<script src="/static/api/js/jsdelivr/vant.min.js"></script>
<script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js"></script>
<script type="text/javascript">
    sram.use([], function() {
        var $ = Zepto;
        Vue.use(vant);
        var vm = new Vue({
            el: '#content',
            data: {
                g_config: {},
                success: false
            },
            mounted: function() {
                this.g_config = g_config.data;
            },
            methods: {
                ajaxPay() {
                    const {
                        money,
                        openid,
                        method,
                        order_id,
                        user_id
                    } = this.g_config;
                    $.ajax({
                        url: '/commerce-code-pay/code-pay',
                        type: 'POST',
                        data: {
                            method: method || 'alipay',
                            money,
                            openid,
                            user_id,
                            order_id
                        },
                        success: function(res) {
                            if (g_config.data.method == 'weixin' && res.wxPayConfig) {
                                onBridgeReady(res.wxPayConfig);
                            } else if (g_config.data.method == 'alipay') {
                                // 字符串格式
                                // https://openapi.alipay.com/gateway.do?app_id=2017102709563092&method=alipay.trade.wap.pay&format=JSON&charset=utf-8&sign_type=RSA2&version=1.0&timestamp=2023-08-25+15%3A14%3A11&notify_url=https%3A%2F%2Fdev6-admin.rrzuji.com%2Fpayment%2Falipay-v2%2Fv2-notify&biz_content=%7B%22out_trade_no%22%3A%22230825151411300006%22%2C%22subject%22%3A%22%E6%8B%9B%E5%95%86%E6%9C%8D%E5%8A%A1%E6%94%AF%E4%BB%98%22%2C%22total_amount%22%3A%220.01%22%2C%22product_code%22%3A%22QUICK_WAP_WAY%22%7D&sign=kbglaiRlDbQPOq31QnqmY5B8vYJzvRLgcsf5jUSccrWUjoDAKmjA2rl5Dw9Wsq4%2FoFAi4YhoQeOs3fp6wLnsU4pXzT2hasnpnPtuStTCAKOmmSPdg8K8R2zTW6zbAwsGoaYAqDcZEUvxiqc5VWWwoizwcOmMkV7DMf8Z%2FkmlMNEgQEOfxqKEG7HkkVBrsXwckGwskILTlf0mUBl5EDz%2FoVBMcmszqusAysDzGPRTv9FDCQx9QYfbSeS9cC6K2AQpo61IAQsCemOo6upvdGJ%2BsE5rJo3LGoS4PUjTty1FcFaJMXXp4rWzSEL5Vov1a60ThgQgFuYHH%2BfxYLhkla4GwA%3D%3D
                                window.location.href = res.jump_value
                            } else {
                                window.location.href = res.jump_value;
                            }
                        },
                        error: function(err) {
                            alert("失败:" + JSON.stringify(err));
                        }
                    })
                },
            }
        })
        // 支付宝支付文档:https://opendocs.alipay.com/open/203/107091?pathHash=45006f4f
        // 微信支付文档： https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter4_1_4.shtml
        function onBridgeReady(wxPayConfig) {
            if (!wxPayConfig.appId) return;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', wxPayConfig,
                function(res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        window.location.href = '/user-code-pay/success';
                    }
                });
        }
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    })
</script>
<?php $this->endBlock(); ?>