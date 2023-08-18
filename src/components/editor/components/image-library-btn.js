import { $, BtnMenu } from 'wangeditor';

// 第一，菜单 class ，Button 菜单继承 BtnMenu class
class ImageLibraryBtn extends BtnMenu {

  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = $(
      `<div class="w-e-menu" data-title="插入图片">
        <i class="w-e-icon-image"></i>
      </div>`
    );
    super($elem, editor);
    this.editor = editor;
  }

  // 菜单点击事件
  clickHandler() {
    if (typeof this.editor.openImageLibrary === 'function') {
      this.editor.openImageLibrary();
    }
  }

  tryChangeActive() {
    // 这个方法不能删，会报错。
  }
}

export default ImageLibraryBtn;
