<template>
  <div
    class="pagination"
    :class="{ ' pagination-vertical': mode === 'vertical' }"
  >
    <ul class="pager">
      <li class="btn-prev px-6" @click="goPage(1)">首页</li>
      <li class="btn-prev" @click="prevPage">上一页</li>
      <li
        v-for="(page, index) in pageList"
        :key="index"
        :class="{
          active: page === current && typeof page !== 'string',
          'more btn-quickprev': page === 'prev',
          'more btn-quicknext': page === 'next',
        }"
        @click="pagerClick(page)"
      >
        {{ typeof page === "number" ? page + suffix : "•••" }}
      </li>
      <li
        type="button"
        :disabled="current === total"
        class="btn-next"
        @click="nextPage"
      >
        下一页
      </li>
      <li type="button" class="btn-prev px-6" @click="goPage(total)">末页</li>
    </ul>

    <span class="go-page" v-if="showJumper && mode === 'horizontal'">
      前往&thinsp;
      <input
        ref="goPageInput"
        type="text"
        @blur="goPage($refs.goPageInput.value * 1)"
      />&thinsp;页
    </span>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    //总页数
    total: {
      type: Number,
      default: 30,
    },
    //当前页
    currentPage: {
      type: Number,
      default: 1,
    },
    //页码显示数量
    pagerCount: {
      type: Number,
      default: 7,
    },
    //展示模式横向或竖向
    mode: {
      type: String,
      default: "horizontal",
    },
    //分页跳转
    showJumper: {
      type: Boolean,
      default: false,
    },
    //分页码后缀
    suffix: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      current: 1,
      pageList: [], //分页列表
    };
  },
  watch: {
    total() {
      this.getPageList(this.current);
    },
    currentPage(val) {
      this.current = val;
    },
    pagerCount() {
      this.getPageList(this.current);
    },
    current(val, old) {
      this.pageList = this.getPageList(val);
      this.$emit("current-change", val, old);
    },
  },
  mounted() {
    this.current = this.currentPage;
    this.pageList = this.getPageList(this.current);
  },
  created() {},
  methods: {
    getPageList(current) {
      let { total, pagerCount } = this;
      let pageList = [];
      //如果总页数在可显示页码数量以内，全部显示
      if (pagerCount > total - 1) {
        for (let i = 1; i <= total; i++) {
          pageList.push(i);
        }
      } else {
        //如果总页数超过可显示页码数量，根据不同情况显示

        //当前页能连到开始
        if (current < pagerCount - 1) {
          for (let i = 1; i < pagerCount; i++) {
            pageList.push(i);
          }
          pageList.push("next");
          pageList.push(total);
        } else {
          //当前页能连到结束
          if (current >= total - 1 - Math.floor(pagerCount / 2)) {
            pageList.push(1);
            pageList.push("prev");
            for (let i = total - (pagerCount - 2); i <= total; i++) {
              pageList.push(i);
            }
          } else {
            //当前页不能连到结束
            pageList.push(1);
            pageList.push("prev");

            for (
              let i = current - Math.floor((pagerCount - 2) / 2);
              i <= current + (Math.ceil((pagerCount - 2) / 2) - 1);
              i++
            ) {
              pageList.push(i);
            }

            pageList.push("next");
            pageList.push(total);
          }
        }
      }

      return pageList;
    },
    /**
     * 上一页
     */
    prevPage() {
      if (this.current > 1) {
        this.current--;

        this.$emit("prev-click", this.current);
      }
    },
    /**
     * 下一页
     */
    nextPage() {
      if (this.current < this.total) {
        this.current++;
        this.$emit("prev-click", this.current);
      }
    },
    /**
     * 分页点击
     * @param {Number} page 目标页面
     */
    pagerClick(page) {
      if (typeof page === "number") {
        this.current = page;
        this.$emit("prev-click", page);
      } else {
        let quickPage = 1;
        if (page === "prev") {
          quickPage = this.current - (this.pagerCount - 2);
          quickPage < 1 && (quickPage = 1);
        }

        if (page === "next") {
          quickPage = this.current + (this.pagerCount - 2);
          quickPage > this.total && (quickPage = this.total);
        }
        this.current = quickPage;

        this.$emit(`${page}-quick-click`, this.current);
      }
    },
    /**
     * 跳转页
     * @param {Number} page 目标页面
     */
    goPage(page) {
      // this.current = page < 1 ? 1 : page > this.total ? this.total : page;
      // this.$refs.goPageInput.value = this.current;

      this.$emit("prev-click", page);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  &,
  & * {
    box-sizing: border-box;
  }
  display: flex;
  ul {
    li {
      border: 1px solid #ddd;
      border-right: none;
      padding: 0 16px;
    }
  }
  .pager {
    display: flex;
    margin: 0;
    padding: 0;

    li {
      list-style: none;
      color: #606266;
      &:not(.disabled).active {
        color: #fff;
        background-color: #2a859d;
        pointer-events: none;
        cursor: none;
      }
      &:hover {
        color: #2a859d;
      }
    }
    .more {
      color: #ccc;
      background: #e6ecec;
    }
  }

  .pager li,
  .btn-next,
  .btn-prev {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    user-select: none;
  }

  button {
    display: block;
    border: 0;
    font-weight: 600;
    color: #888;
    vertical-align: top;

    &:focus {
      outline: none;
      border: none;
    }
    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .btn-prev {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .btn-next {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
  .go-page {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    margin-right: 10px;
    input {
      width: 40px;
      height: 22px;
      line-height: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #606266;
      text-align: center;
      &:focus {
        outline: none;
      }
    }
  }
}
.pagination ul li:first-child {
  border-radius: 5px 0 0 5px;
}
.pagination ul li:last-child {
  border: 1px solid #ddd;
  border-radius: 0 5px 5px 0;
}
.pagination-vertical {
  flex-direction: column-reverse;

  .pager {
    flex-direction: column-reverse;
  }

  button {
    transform: rotate(-90deg);
  }

  .btn-prev {
    border-top-left-radius: 2px;
    border-bottom-right-radius: 0;
  }

  .btn-next {
    border-top-left-radius: 0;
    border-bottom-right-radius: 2px;
  }
}
</style>
