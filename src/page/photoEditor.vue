<template>
  <div class="main">
    <div class="content" ref="content">
      <div class="tui-image-editor" ref="tuiImageEditor"></div> 
      <div class="tui-image-editor-controls">
        <ul class="menu">
          <li
            class="menu-item"
            :class="btnUndoDisabled?'disabled':''"
            @click="handleBtnUndo"
            id="btn-undo"
          >Undo(撤销)</li>
          <li class="menu-item" id="btn-clear-objects" @click="handleBtnClear">ClearObjects(清除编辑)</li>
          <li class="menu-item" id="btn-draw-line" @click="handleDrawLine('FREE_DRAWING')">DrawLine(画笔)</li> 
          <li class="menu-item" id="btn-arrow" @click="handleArrow()">直线箭头(图标)</li>
          <li class="menu-item" id="btn-draw-shape" @click="handleDrawShape('rect')">方形</li>
          <li class="menu-item" id="btn-draw-shape" @click="handleDrawShape('circle')">圆形</li>
          <li class="menu-item" id="btn-text" @click="handleBtnAddText">Text(添加文字)</li>
          <li class="menu-item" id="btn-draw-shape" @click="handleDrawCrop()">剪切</li>
          <li class="menu-item" id="btn-rotation" @click="handleRotation()">旋转</li> 
        </ul> 
        <!-- 划线 -->
        <div
          class="sub-menu-container menu"
          v-if="showSubMenuLine&&!hideAllSubMenu"
          id="draw-line-sub-menu">
          <ul class="menu">
            <li class="menu-item">
              <div
                v-for="(item,index) of colorPicker"
                @click="changeColorValue(item)"
                class="color-item"
                :key="index"
                :style="{backgroundColor:item.color}"
              ></div>
            </li>
          </ul>
        </div> 
        <!-- 形状 -->
        <div
          class="sub-menu-container"
          v-if="showSubMenuShape&&!hideAllSubMenu"
          id="draw-shape-sub-menu">
          <ul class="menu">
            <li class="menu-item">
              <div
                v-for="(item,index) of colorPicker"
                @click="changeColorValue(item)"
                class="color-item"
                :key="index"
                :style="{backgroundColor:item.color}"
              ></div>
            </li>
          </ul>
        </div>
         
        <!-- 文字 -->
        <div class="sub-menu-container" v-if="showSubMenuText&&!hideAllSubMenu" id="text-sub-menu">
          <ul class="menu">
            <li class="menu-item">
              <div
                v-for="(item,index) of colorPicker"
                @click="changeColorValue(item)"
                class="color-item"
                :key="index"
                :style="{backgroundColor:item.color}"
              ></div>
            </li>
          </ul>
        </div>

        <!-- 剪切 -->
        <div class="sub-menu-container" v-if="showSubMenuCrop&&!hideAllSubMenu" id="crop-sub-menu">
            <ul class="menu">
                <li class="menu-item" id="btn-apply-crop" @click="applyCrop">Apply(应用)</li>
                <li class="menu-item" id="btn-cancel-crop" @click="cancelCrop">Cancel(取消)</li>
            </ul>
        </div>
        
      </div> 
      <!-- <button class="menu-item border" id="btn-download" @click="handleEdit">Edit</button>   -->
      <button class="menu-item border" id="btn-download" @click="hanleSave">Save</button> 
      
    </div>
  </div>
</template>

<script>
import axios from "../axios.js";
//   import editor from "./editor";
import sampleImage from "../assets/other/sampleImage.jpg";
export default {
  name: "photoEditor",
  data() {
    return {
      horizontalScreen: false,
      editorInstance: "",
      viewHeight:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      viewWidth: document.documentElement.clientWidth,

      // 所有子菜单隐藏
      hideAllSubMenu: false,
      // 是否可以撤销
      btnUndoDisabled: false,
      // 文字菜单是否显示
      showSubMenuText: false, 
      // 划线菜单是否显示
      showSubMenuLine: false,
      // 线
      lineType:'',
      // 形状菜单是否显示
      showSubMenuShape: false,
      // 形状
      shapeType: "",
      // 箭头图标
      showSubMenuArrow:false,
      // 剪切
      showSubMenuCrop:false,
      // 旋转
      showSubMenuRotation:false,

      activeObjectId: "",
      colorPicker: [
        { color: "#f00" },
        { color: "#fff" },
        { color: "#000" },
        { color: "#ff0" }
      ],
      colorpickerValue: "#f00", //当前颜色 
      rImageType:/data:(image\/.+);base64,/,
    };
  },
  mounted() {
    let $this = this;
    window.addEventListener("resize", $this.renderResize, false);

    //   实例editor
    $this.editorInstance = new tui.ImageEditor(".tui-image-editor", {
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70
      },
      uiSize: {
        width: $this.viewWidth,
        height: 320
      },
      cssMaxHeight: 320,
      cssMaxWidth: $this.viewWidth
    });
    //   加载图片
    $this.editorInstance
      .loadImageFromURL(sampleImage, "SampleImage")
      .then(sizeValue => {
        console.log(sizeValue);
        $this.editorInstance.clearUndoStack();
      });
    $this.editorInstance.on({
      objectAdded(objectProps) {
        console.info(objectProps);
      },
      undoStackChanged(length) {
        console.log(length);
        if (length) {
          $this.btnUndoDisabled = false;
        } else {
          $this.btnUndoDisabled = true;
        }
      },
      addText(pos) {
        $this.editorInstance
          .addText("Double Click1", {
            position: pos.originPosition
          })
          .then(objectProps => {
            console.log(objectProps);
          });
      }, 
      objectActivated(obj) {
        $this.activeObjectId = obj.id;
      },
      mousedown(event, originPointer) {
        console.log('mousedown')
        // $this.editorInstance.stopDrawingMode();
     }
    });
    // 实例
    $this.$nextTick(() => {
      $this.renderResize();
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.renderResize, false);
    this.editorInstance.destroy();
    this.editorInstance=null;
  },
  watch: {
    colorpickerValue(value) {
      let $this = this;
      // 文字
      if (this.showSubMenuText) {
        $this.editorInstance.changeTextStyle($this.activeObjectId, {
          fill: value
        });
        $this.activateTextMode();
      }
      // 箭头图标
      if (this.showSubMenuArrow) {
        $this.editorInstance.changeIconColor($this.activeObjectId, {
          fill: value
        });
        $this.activateIconMode();
      }

      // 画形状
      if (this.showSubMenuShape) {
        var settings = {
          fill: "transparent",
          stroke: value,
          strokeWidth: 10
        };
        this.editorInstance.changeShape($this.activeObjectId, settings);
        this.activateShapeMode();
      }
      // 划线
      if (this.showSubMenuLine) {
        var settings = {
          width: 10,
          color: value.split("#")[1]
        };
        console.log(settings);
        this.editorInstance.stopDrawingMode();
        this.editorInstance.startDrawingMode($this.lineType, settings);
      }
    }
  },
  methods: {
    // 监听浏览器横竖屏
    renderResize() {
      let $this = this;
      $this.h =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight; //屏幕可视高度
      $this.w = document.documentElement.clientWidth; //屏幕可视宽度
      this.$refs.content.style.height = this.h - 80 + "px";
      if (this.w > this.h) {
        console.log("横屏");
        this.horizontalScreen = true;
        $this.$refs.tuiImageEditor.style.height = $this.viewHeight - 80 + "px";
        $this.$refs.tuiImageEditor.style.width = "86%";
      } else {
        console.log("竖屏");
        this.horizontalScreen = false;
        $this.$refs.tuiImageEditor.style.height = $this.viewHeight * 0.4 + "px";
        $this.$refs.tuiImageEditor.style.width = "100%";
      }
    },
    //   撤销
    handleBtnUndo() {
      this.hideAllSubMenu = true;
      this.showSubMenuText = false;
      this.showSubMenuLine = false;
      this.showSubMenuShape = false;
      if (!this.btnUndoDisabled) {
        this.editorInstance.undo();
      }
    }, 
    // 清除编辑
    handleBtnClear() {
      this.hideAllSubMenu = true;
      this.showSubMenuText = false;
      this.showSubMenuLine = false;
      this.showSubMenuShape = false;
      this.editorInstance.clearObjects();
    },
    // 添加文字
    handleBtnAddText() {
      this.hideAllSubMenu = false;
      this.showSubMenuLine = false;
      this.showSubMenuShape = false;
      this.showSubMenuText = !this.showSubMenuText;
      this.activateTextMode();
    },
    activateTextMode() {
      if (this.editorInstance.getDrawingMode() !== "TEXT") {
        this.editorInstance.stopDrawingMode();
        this.editorInstance.startDrawingMode("TEXT");
      }
    },
    // 添加箭头
    handleArrow(){
      let $this=this;
      this.hideAllSubMenu = true;
      this.showSubMenuText = false;
      this.showSubMenuLine = true;
      this.showSubMenuShape = false; 
      this.editorInstance.stopDrawingMode(); 
      this.editorInstance.once('mousedown', function(e, originPointer) {
        $this.editorInstance.addIcon('arrow', {
            left: originPointer.x,
            top: originPointer.y,
            fill:'#f00'
        }).then(objectProps => {
            console.log(objectProps);
        });
      });
    }, 
    // 划线
    handleDrawLine(type) {
      let $this=this;
      $this.lineType=type;
      this.hideAllSubMenu = false;
      this.showSubMenuText = false;
      this.showSubMenuShape = false;
      this.showSubMenuLine = true;
      this.editorInstance.stopDrawingMode();
      var settings = {
        width: 10,
        color: this.colorpickerValue.split("#")[1]
      };
      this.editorInstance.startDrawingMode($this.lineType, settings);
    },
    // 画形状
    handleDrawShape(type) {
      this.shapeType = type;
      this.hideAllSubMenu = false;
      this.showSubMenuText = false;
      this.showSubMenuLine = false;
      this.showSubMenuShape = true;
      var settings = {
        fill: "transparent",
        stroke: this.colorpickerValue,
        strokeWidth: 10
      };
      this.editorInstance.setDrawingShape(type, settings);
      this.activateShapeMode();
    },
    activateShapeMode() {
      if (this.editorInstance.getDrawingMode() !== "SHAPE") {
        this.editorInstance.stopDrawingMode();
        this.editorInstance.startDrawingMode("SHAPE");
      }
    },
    // 剪切
    handleDrawCrop(){
      this.editorInstance.startDrawingMode('CROPPER');
      this.hideAllSubMenu = false;
      this.showSubMenuCrop=true;
    },
    // 应用剪切
    applyCrop(){
      let $this=this;
      $this.editorInstance.crop($this.editorInstance.getCropzoneRect()).then(() => {
        $this.editorInstance.stopDrawingMode();
      });
    },
    // 取消剪切
    cancelCrop(){
      this.editorInstance.stopDrawingMode();
      this.showSubMenuCrop=false;
    }, 
    // 旋转
    handleRotation(){
      let $this=this;
      $this.editorInstance.stopDrawingMode();
      $this.hideAllSubMenu=true;
      $this.showSubMenuRotation = true;
      $this.editorInstance.rotate(90);
    },
    // 颜色
    changeColorValue(item) {
      this.colorpickerValue = item.color;
      console.log(item.color);
    }, 
    base64ToBlob(data) {
        let $this=this;
        var mimeString = '';
        var raw, uInt8Array, i, rawLength; 
        raw = data.replace($this.rImageType, function(header, imageType) {
            mimeString = imageType; 
            return '';
        }); 
        raw = atob(raw);
        rawLength = raw.length;
        uInt8Array = new Uint8Array(rawLength);  
        for (i = 0; i < rawLength; i += 1) {
            uInt8Array[i] = raw.charCodeAt(i);
        } 
        return new Blob([uInt8Array], {type: mimeString});
    },
    // 保存
    hanleSave(){
      let $this=this; 
      var imageName = this.editorInstance.getImageName();
      var dataURL = this.editorInstance.toDataURL();
      console.log(imageName,dataURL)
      // 重新加载图片
      this.editorInstance.stopDrawingMode();
      $this.editorInstance
        .loadImageFromURL(dataURL, "SampleImage")
        .then(sizeValue => {
          console.log(sizeValue);
          $this.editorInstance.clearUndoStack();
        });
      // var blob = this.base64ToBlob(dataURL);
      // var type = blob.type.split('/')[1];
      // if (imageName.split('.').pop() !== type) {
      //     imageName += '.' + type;
      // } 
      // saveAs(blob, imageName);
    },
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/photoEditor.scss";
</style>
