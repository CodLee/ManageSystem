<template>
  <div class='data_section homeContent'>
    <el-row :gutter="10">
      <el-col :span="16">
        <div class='search_box'>
          <div class="hotWord">
            热搜词：
            <span v-for="(item,index) in hotWordList" v-if="index <= forPage" :key="index" class="word" @click="hotWordClick(item)" href="#">{{ item.hotWord }}</span>
          </div>
          <el-input v-model="searchWord" @keyup.enter.native="handleIconClick" placeholder="产品搜索" suffix-icon style='width:100%'>
            <!-- <i v-if="searchWord !==''" class="el-icon-close el-input__icon" slot="suffix" @click="clearSearch">
            </i> -->
            <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick">
            </i>
          </el-input>
        </div>

        <div class="findLogo">
          <!-- hyh  -->
          <!-- <div class="txl">
            <span @click="allLogo" class="all" :class='{active:activeWord==""?true:false}'>全部</span>
            <span class="zm" v-for='(word, i) in wordsData' :key="i" type="default" size="mini" @click="findLogoByWord(word)" :class='{active:activeWord==word?true:false}'>{{word}}</span>
          </div> -->

          <div>
            <ul class="txl">
              <li @click="allLogo" class="all" :class='{active:activeWord==""?true:false}'>全部</li>
              <li class="zm" v-for='(word, i) in wordsData' :key="i" @click="findLogoByWord(word)" :class='{active:activeWord==word?true:false}'>{{word}}</li>
            </ul>
          </div>
          <!-- hyh end -->

          <!-- <el-row>
            <el-col :span="2">
              <span @click="allLogo" class="all" :class='{active:activeWord==""?true:false}'>全部</span>
            </el-col>
            <el-col :span="22">
              <span class="zm grid-content bg-purple" v-for='(word, i) in wordsData' :key="i" type="default" size="mini" @click="findLogoByWord(word)" :class='{active:activeWord==word?true:false}'>{{word}}</span>
            </el-col>
          </el-row> -->

          <div class="section company">
            <div class="main bd-top">
              <el-carousel height="100px" indicator-position='none'>
                <el-carousel-item v-for="(items,index) in companyLists" :key="index" class='carousItem'>
                  <div v-for='(item, i) in  items' :key="i">
                    <img :src="item.comLogo" alt="" width='230' height='50'>
                  </div>
                </el-carousel-item>
              </el-carousel>

            </div>
          </div>
        </div>

        <div class="section">
          <div class="title">
            <span>
              <i class="iconfont el-icon-dt-shangjia icon-notice"></i>&nbsp;产品概况</span>
          </div>
          <div class="main bd-top-pro">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="home_tabs" style="border:none;width:100%">
              <el-tab-pane name="four" :class='{active:activeName=="four"?true:false}'>
                <span slot="label">
                  <!-- <i class="iconfont el-icon-dt-dot-3 mr0"> </i>-->近30天未上架</span>
                <el-table :data="untableMonths" highlight-current-row style="width: 100%" :show-header='false' @cell-click="detail">
                  <el-table-column label="名称" prop="productName"></el-table-column>
                  <el-table-column label="修改时间" prop="editTime" align='right' class-name='grey' :formatter='formatterData'></el-table-column>
                </el-table>
                <div class="pagediv">
                  <el-pagination @current-change="doPageUnMonth" :current-page="unMonthCurrentPage" :page-size="pageUnMonth.pageSize" layout="prev, pager, next" :total="totalUnMonth">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane name="third" :class='{active:activeName=="third"?true:false}'>
                <span slot="label">
                  <!-- <i class="iconfont el-icon-dt-dot-3 mr0"> </i>-->近30天上架</span>
                <el-table :data="tableMonth" highlight-current-row style="width: 100%" :show-header='false' @cell-click="detail">
                  <el-table-column label="名称" prop="productName"></el-table-column>
                  <el-table-column label="上架时间" prop="newTime" align='right' class-name='grey' :formatter='formatterData'></el-table-column>
                </el-table>
                <div class="pagediv">
                  <el-pagination @current-change="doPageMonth" :current-page="monthCurrentPage" :page-size="pageMonth.pageSize" layout="prev, pager, next" :total="totalMonth">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane name="second" :class='{active:activeName=="second"?true:false}'>
                <span slot="label">
                  <!-- <i class="iconfont el-icon-dt-dot-3 mr0"></i> -->近7天上架</span>
                <el-table :data="tableWeek" highlight-current-row style="width: 100%" :show-header='false' @cell-click="detail">
                  <el-table-column label="名称" prop="productName"></el-table-column>
                  <el-table-column label="上架时间" prop="newTime" align='right' class-name='grey' :formatter='formatterData'></el-table-column>
                </el-table>
                <div class="pagediv">
                  <el-pagination @current-change="doPageWeek" :current-page="weekCurrentPage" :page-size="pageWeek.pageSize" layout="prev, pager, next" :total="totalWeek">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane name="first" :class='{active:activeName=="first"?true:false}'>
                <span slot="label">
                  <!-- <i class="iconfont el-icon-dt-dot-3 mr0"> </i>-->本日上架</span>
                <el-table :data="tableToday" highlight-current-row style="width: 100%" :show-header='false' @cell-click="detail">
                  <el-table-column label="名称" prop="productName"></el-table-column>
                  <el-table-column label="上架时间" prop="newTime" align='right' class-name='grey' :formatter='formatterData'></el-table-column>
                </el-table>
                <div class="pagediv">
                  <el-pagination @current-change="doPageToday" :current-page="todayCurrentPage" :page-size="pageToday.pageSize" layout="prev, pager, next" :total="totalToday">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :span="8">

        <div class="section noticeList">
          <div class="title b-1-b">
            <span>
              <i class="iconfont el-icon-dt-gonggao1 icon-notice"></i>&nbsp;公告</span>
          </div>
          <div class="main bd-top-pro notice-table">
            <el-table :data="noticeData" highlight-current-row style="width: 100%" :show-header='false' class='' height="190">
              <!-- <el-table-column width="100" label="标题" prop="text"></el-table-column> -->
              <el-table-column label="内容">
                <template slot-scope="scope">
                  <div class="notice-value" @click='showNotice(scope.row)'>
                    <i class="iconfont el-icon-dt-dot icon-notice"></i>{{'[' + scope.row.startTime + ']' + '&nbsp;' + scope.row.title }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="section suggeset">
          <div class="title">
            <span>
              <i class="iconfont el-icon-dt-gongsi2 icon-notice"></i>&nbsp;强烈推荐</span>
          </div>
          <div class="main bd-top-pro">
            <div class="img-list">
              <div v-for="(item, index) in imgRList " :key="index" class="img-item">
                <img :src="item.imgPath" alt="" width="346">
                <!-- <div class="img-name">{{item.productName}}</div> -->
              </div>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-dialog :title="dialogContent.title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="dialogContent" label-width="0px">
        <el-form-item label="">
          <el-input type="textarea" autosize style='color:#000;' :value="dialogContent.content" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size='small' type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {  } from "@/api/getData";
import { fetchDics, dicFormatter } from "@/config/tool.js";
import { clone } from "@/config/mUtils.js";
export default {
  data() {
    return {
      dicationary: [
        { id: "market.company", property: "companyId", force: false },
        { id: "salesType.enum", property: "salesType", force: false },
        { id: "isIllustration.enum", property: "isIllustration", force: false },
        { id: "productState.enum", property: "productState", force: false }
      ],
      wordsData: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "l",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      hotWordList: [], //热搜词数组
      activeWord: "",
      tableData: [],
      companyList: [],
      companyLists: [],
      isActived: false,
      activeName: "four",
      tableToday: [],
      tableWeek: [],
      tableMonth: [],
      tableMonth: [],
      untableMonths: [],
      imgRList: [],
      totalToday: 0,
      totalWeek: 0,
      totalMonth: 0,
      totalUnMonth: 0,
      pageNum: 1,
      todayCurrentPage: 1,
      weekCurrentPage: 1,
      monthCurrentPage: 1,
      unMonthCurrentPage: 1,
      pageToday: {
        pageNum: 1,
        pageSize: 7
      },
      pageWeek: {
        pageNum: 1,
        pageSize: 7
      },
      pageMonth: {
        pageNum: 1,
        pageSize: 7
      },
      pageUnMonth: {
        pageNum: 1,
        pageSize: 7
      },
      searchWord: "",
      word: "", //搜索路由接收参数
      flag: 0,
      productId: "",
      //热搜词查询参数
      queryForm: {
        hotWord: ""
      },
      forPage: 8,
      noticeData: [],
      dialogVisible: false,
      dialogContent: {}
    };
  },
  created() {},
  methods: {
    formatterData(row, column, cellValue) {
      // console.log(row, column, cellValue)
      return cellValue.split(" ")[0];
    },
    async initNoticeFn() {},
    showNotice(data) {
      this.dialogVisible = true;
      this.dialogContent = data;
    },
    handleClose() {
      this.dialogContent = {};
      this.dialogVisible = false;
    },
    async findLogoByWord(word) {},
    allLogo() {},
    getRoute() {},
    async initHotWord() {},
    handleIconClick() {},
    hotWordClick(data) {},
    querySearch(queryString, cb) {},
    querySearchAsync() {},
    async initDatas() { },
    doPageToday(val) {},
    //本周的列表翻页
    doPageWeek(val) {},
    //本月的列表翻页
    doPageMonth(val) {},
    //每30天未上架产品的列表翻页
    doPageUnMonth(val) {},
    async getTodayList() {},
    async getWeekList() {},
    async getMonthList() {},
    async getUnMonthList() {},
    imgList(arr) {
      let list = [];
      var len = arr.length;
      var k = 0;
      var compLen = Math.ceil(len / 10);
      for (var j = 0; j < compLen; j++) {
        list.push([]);
      }
      for (var i = 0; i < arr.length; i++) {
        list[k].push(arr[i]);
        if (list[k].length == 10) {
          k++;
        }
      }
      this.companyList = list;
    },
    imgLists(arr) {
      let list = [];
      var len = arr.length;
      var k = 0,
        num = 4;

      var compLen = Math.ceil(len / num);
      for (var j = 0; j < compLen; j++) {
        list.push([]);
      }
      for (var i = 0; i < arr.length; i++) {
        list[k].push(arr[i]);
        if (list[k].length == num) {
          k++;
        }
      }
      return list;
    },
    handleClick(tab, event) {},
    detail(row) {}
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.carousItem {
  div {
    width: 25%;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    padding: 20px 15px;
    img {
      width: 100%;
      margin-top: 3%;
    }
  }
  div:nth-of-type(2n) {
    //border-bottom: 1px solid #ECEDEF;
  }
  div:nth-of-type(2n + 1) {
    //border-bottom: 1px solid #ECEDEF;
    //border-right: 1px solid #ECEDEF;
  }
}

.data_section {
  padding: 20px;
  background-color: #ccc;
  .section {
    background-color: #fff;
    border-radius: 10px;
    .grey {
      color: #ccc;
    }
    //overflow: hidden;
    .title {
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      color: #5a94e8;
      margin-left: 10px;
      padding-top: 5px;
    }
    .img-list {
      text-align: center;
    }
    .img-item {
      margin: 10px 0;
    }
  }
  .section.notice {
    height: 250px;
    margin: 0 20px 20px 0;
    border-radius: 10px;
    .title {
      height: 26px;
      line-height: 26px;
      color: #5a94e8;
    }
    .main {
      height: 160px;
      overflow: auto;
    }
  }
  .section.company {
    //height:100px;
    //margin-right:20px;
    border-radius: 10px;
    margin-top: 20px;
    .title {
      height: 26px;
      line-height: 26px;
      color: #5a94e8;
      margin-left: 10px;
    }
  }
  .section.suggeset {
    .main {
      //max-height:540px;
      max-height: 430px;
      overflow: auto;
    }
  }
  .section.noticeList {
    margin-bottom: 10px;
    overflow: hidden;
    height: 255px;
  }
}

.wan {
  .sc(16px, #333);
}

.homeContent {
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__title {
    font-size: 16px;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #000;
  }
  background-color: #f5f5f5;
  .search_box {
    padding: 25px 30px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
    position: relative;
    .el-input__inner {
      background: #f0eff5;
      color: #a5a5a5;
    }
    .hotWord {
      font-size: 14px;
      padding-left: 3px;
      padding-bottom: 5px;
      color: #666;
      .word {
        color: orange;
        padding: 0 6px;
        font-size: 12px;
        text-decoration: underline;
      }
    }

    // .clearKeyWord {
    //   width: 20px;
    //   height: 20px;
    //   position: absolute;
    //   top: 32px;
    //   right: 50px;
    //   color: #000;
    //   border: none;
    // }
  }

  .findLogo {
    background: #fff;
    height: 127px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    padding-top: 5px;
    .txl {
      background: #fff;
      color: gray;
      li {
        float: left;
        text-align: center;
      }
      li:nth-of-type(2) {
        border-left: 0;
      }
      .zm {
        font-size: 12px;
        background: #fff;
        //display: inline-block;
        //padding: 0 8px;
        width: 3.3%;
        border-left: 1px solid #ccc;
        cursor: pointer;
      }

      .zm.active {
        color: #e24c4c;
      }

      .all {
        font-size: 12px;
        cursor: pointer;
        //display: inline-block;
        //padding: 0 10px;
        margin-left: 10px;
        padding-right: 10px;
        border-right: 1px solid #ccc;
      }
      .all.active {
        color: #e24c4c;
      }
    }
  }
}

.homeContent .home_tabs .el-tabs__header {
  margin: 0;
}

.homeContent .home_tabs .el-tabs__content {
  height: 390px;
}

.homeContent .home_tabs .el-table__empty-block {
  min-height: 40px;
}

.homeContent .home_tabs .el-table__row {
  //cursor: pointer;
}

.pagediv {
  text-align: center;
  position: absolute;
  bottom: 5px;
  width: 100%;
}

.homeContent .bd-top {
  border-top: 1px solid #eee;
  margin-top: 5px;
}

.homeContent .bd-top-pro {
  margin-top: 5px;
}

.homeContent .notice-table {
  position: relative;
  height: 190px;
  overflow: hidden;
}

.homeContent .home-canpony {
  width: 48%;
  margin-left: 2%;
}

.homeContent .home-notice {
  width: 99%;
  margin-left: 15px;
}

.homeContent .home-product {
  width: 50%;
}

.homeContent .mr0 {
  margin-right: 0;
}

.homeContent i.icon-notice {
  display: inline-block;
  vertical-align: 1px;
  margin: 0 !important;
  color: #40cfac;
}

.homeContent .el-carousel {
  text-align: center; //cursor: pointer;
  overflow-x: visible;
}

.homeContent .el-carousel:last-of-type {
  text-align: left; //cursor: pointer;
}

.homeContent .mb20 {
  margin-bottom: 20px;
}

.homeContent i.el-icon-dt-gonggao1 {
  font-size: 20px !important;
  display: inline-block;
  vertical-align: -2px;
  color: #5a94e8;
}

.homeContent i.el-icon-dt-shangjia {
  font-size: 20px !important;
  display: inline-block;
  vertical-align: -2px;
  color: #5a94e8;
}

.homeContent i.el-icon-dt-gongsi2 {
  font-size: 20px !important;
  display: inline-block;
  vertical-align: -2px;
  color: #5a94e8;
}

.homeContent .el-tabs__nav {
  width: 100%;
  .el-tabs__item {
    text-align: center;
    width: 25%;
    color: #909399;
  }
}

.homeContent .notice-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>
