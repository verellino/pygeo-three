<template>
  <div
    id="contextmenuTable"
    class="crudtablewrap"
    :style="`padding:0 ${isLRpadding}`"
    @contextmenu.prevent="contextmenushow"
  >
    <!-- <v-card elevation="0"> -->
    <!--表格-->
    <v-data-table
      height="100%"
      class="crud-table elevation-0"
      :style="paging ? 'marginBottom:80px' : ''"
      dense
      :hide-default-header="pageOptions.viewGrid || pageOptions.viewGeneralize"
      hide-default-footer
      :show-expand="showExpand"
      :item-key="itemKeyName"
      v-model="selectedTasks"
      :headers="headerArray"
      :items="records"
      :options.sync="pageOptions"
      :items-per-page="page.size"
      :loading="loading"
      :server-items-length="total"
      :single-select="singleSelect"
      :show-select="showSelect"
      @toggle-select-all="toggleSelectAll"
      :value="selectedTasks"
      :disable-sort="pageOptions.disSort" 
    >
      <!-- 表格 头部 -->
      <template v-slot:top>
        <!-- 表单控件 -->
        <!-- <v-row style="width: 96%" class="ma-auto"
          v-if="froms.length"
        > 
        <v-col
          v-for="(item,index) in froms"

        >

        </v-col>
        </v-row> -->

        <!--按钮及控件-->
        <v-row
          v-if="buttons.length || rButtons.length"
          no-gutters
          dense
          justify="space-between"
          lg
          class="py-4 tableTopButton"
          :style="`margin:0 -${isLRpadding};padding:0 ${isLRpadding}`"
        >
          <v-col class="d-flex align-center">
            <!-- <ButtonRender
              :buttons="buttons"
              @buttonClick="doAction"
              @clickmune="clickmune"
            /> -->
          </v-col>
          <!--控件的渲染-->
          <v-col align="end">
            <!-- <template v-if="widgets && widgets.length > 0">
                <div class="col-item" @click="showFilter = !showFilter">
                  <v-icon small color="#8091a5">mdi-filter-menu-outline</v-icon>
                  过滤
                </div>
                <FilterNavigation
                  v-model="showFilter"
                  :widgets="widgets"
                  :widget-model="queryParam"
                  @confirm="queryPage"
                />
                <span class="separator"></span>
              </template> -->

            <div v-if="rButtons.length" class="col-item-readonly">
              <!-- <ButtonRender :buttons="rButtons" @buttonClick="doAction" /> -->
            </div>
            <!-- <span class="separator"></span> -->

            <!-- 页面设置 -->
            <!-- <div class="col-item">
                <v-menu offset-y rounded="0" eager>
                  <template v-slot:activator="{ on }">
                    <v-icon small color="#8091a5" v-on="on"
                      >mdi-cog-outline</v-icon
                    >
                  </template>
                  <v-list dense> -->
            <!-- <v-list-item>
                      <v-list-item-content>
                        <v-menu
                          left
                          :close-on-content-click="false"
                          eager
                          nudge-left="20"
                          nudge-top="20"
                          offset-x
                          rounded="0"
                        >
                          <template v-slot:activator="{ on: fieldOn, value }">
                            <div v-on="{ ...fieldOn }" class="setting-content">
                              <span :class="[value ? 'per-current' : '']"
                                >设置显示的字段</span
                              >
                            </div>
                          </template>
                          <v-card rounded="0">
                            <div
                              class="pa-2"
                              id="sortable-container"
                              ref="sortable-container"
                            >
                              <div
                                class="settable-headers "
                                v-for="header in sortableHeaders"
                                :key="header.text"
                              >
                                <v-icon>mdi-drag-vertical</v-icon>
                                <span class="settable-text">{{
                                  header.text
                                }}</span>
                                <label>
                                  <input
                                    class="settable-checkbox"
                                    type="checkbox"
                                    :value="header.value"
                                    v-model="displayHeaderValues"
                                  />
                                </label>
                              </div>
                            </div>
                          </v-card>
                        </v-menu>
                      </v-list-item-content>
                    </v-list-item> -->
            <!-- 设置每页显示的数量 -->
            <!-- <v-list-item>
                      <v-list-item-content>
                        <v-list-item-subtitle class="setting-title">
                          每页显示数量
                        </v-list-item-subtitle>
                        <div class="setting-content">
                          <template v-for="(perPage, index) in perPageOptions">
                            <span
                              :key="index"
                              :class="[
                                page.size === perPage ? 'per-current' : '',
                              ]"
                              @click="page.size = perPage"
                              >{{ perPage }}</span
                            >
                          </template>
                        </div>
                      </v-list-item-content>
                    </v-list-item> -->
            <!-- </v-list>
                </v-menu>
              </div> -->
          </v-col>
        </v-row>
        <v-row
          v-if="isAllSize && !isGetData && records.length"
          no-gutters
          style="height: 44px; position: relative"
        >
          <div
            style="
              text-align: center;
              font-size: 12px;
              line-height: 44px;
              position: absolute;
              right: 0;
            "
          >
            共 <span style="color: #2a859d">{{ records.length }}</span>

            个内容, 文件夹大小:
            <span style="color: #2a859d; cursor: pointer" @click="allSize">
              {{ theAllSize.size }}
            </span>
          </div>
        </v-row>
        <!-- 筛选条件 -->
        <v-row
          no-gutters
          :style="`padding:${isLRpadding}`"
          class="mx-0"
          v-if="filter.length && filter"
        >
          <template v-for="(item, index) in filter">
            <div class="mr-2" v-if="item.type == 'text'" :key="index">
              <v-text-field
                hide-details
                dense
                :label="item.label"
                :placeholder="item.placeholder"
                v-model="param[item.key]"
              ></v-text-field>
            </div>
            <div class="mr-2" v-if="item.type == 'select'" :key="index">
              <v-select
                dense
                :items="item.options"
                :placeholder="item.placeholder"
                :label="item.label"
                item-text="label"
                item-value="value"
                v-model="param[item.key]"
                @change="search()"
              ></v-select>
            </div>
            <div class="mr-2" v-if="item.type == 'datePicker'" :key="index">
              <v-menu
                ref="menu"
                v-model="item.pickermenu"
                :close-on-content-click="false"
                :close-on-click="true"
                transition="scale-transition"
                offset-y
                bottom
                @input="datePickerMenu(arguments[0], item)"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    dense
                    :value="param[item.key]"
                    :label="item.label"
                    :placeholder="item.placeholder"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="zh-cn"
                  @change="changeDateTimePicker"
                  v-model="param[item.key]"
                  range
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="cencel(item)">
                    取消
                  </v-btn>
                  <v-btn text color="primary" @click="changeDateTime(item)">
                    确定
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>

            <div
              class="mb-3"
              style="display: flex; align-items: center"
              v-if="item.type == 'button'"
              :key="index"
            >
              <v-btn
                style="color: white"
                class="mx-2"
                :color="item.color"
                @click="item.isSearch ? search() : refresh(true)"
              >
                <v-icon class="mr-1" small>{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-btn>
            </div>
          </template>
        </v-row>
      </template>

      <template v-slot:header.data-table-select="{ props, on }">
        <!-- <v-simple-checkbox v-bind="props" v-on="on"></v-simple-checkbox> -->
        <v-simple-checkbox v-bind="props" v-on="on"></v-simple-checkbox>
      </template>
      <!--行内操作按钮事件-->
      <template
        v-if="!pageOptions.viewGrid && !pageOptions.viewGeneralize"
        v-slot:item="props"
      >
        <tr
          :disabled="props.item.disabled"
          :class="props.item.disabled ? 'pitchColor' : null"
          @contextmenu.stop="
            tableContextmenudata(arguments[0], props, props.index)
          "
          @click.stop="clickTableItem(props, props.index)"
        >
          <td v-if="showSelect">
            <v-simple-checkbox
              :disabled="props.item.disabled"
              v-ripple="false"
              @click.stop="
                itemSelected(props.isSelected, props.item, props.index)
              "
              v-model="props.isSelected"
            ></v-simple-checkbox>
          </td>
          <template v-for="(it, index) in headerArray">
            <td
              v-if="it.type == 'html'"
              :style="{cursor:it.onClick ? 'pointer' : 'auto',minWidth:it.minWidth ? it.minWidth : ''}"
              @click="
                it.onClick ? it.onClick(props.item, it.value, index) : () => {}
              "
              :key="index"
              v-html="it.computedRow(props.item, it.value)"
            ></td>
            <!-- name -->
            <td
              v-else-if="it.type == 'fileClick'"
              @dblclick="it.dblclick(props.item)"
              :style="it.minWidth ? `min-width:${it.minWidth}` : ''"
              :key="index"
            >
              <span
                v-if="it.computedIcon"
                style="
                  display: flex;
                  justify-content: start;
                  align-items: center;
                "
              >
                <template v-if="it.computedIcon(props.item, it.value).img">
                  <img
                    style="width: 26px; height: 26px; margin-right: 3px"
                    :src="it.computedIcon(props.item, it.value).img"
                  />
                </template>
                <v-icon
                  v-else
                  :style="{
                    color: it.computedIcon(props.item, it.value).color,
                    'margin-right': '5px',
                  }"
                  size="24px"
                  >{{ it.computedIcon(props.item, it.value).icon }}</v-icon
                >
                <v-icon
                  v-if="props.item.isQuote"
                  size="12px"
                  color="blue"
                  class="mx-1"
                >
                  mdi-link-variant
                </v-icon>
                <v-tooltip
                  bottom
                  color="#eee"
                  :disabled="it.computedName(props.item, it.value).length < 13"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-on="on"
                      v-bind="attrs"
                      class="textHover"
                      style="max-width: 200px; min-width: 50px"
                      >{{ it.computedName(props.item, it.value) }}</span
                    >
                  </template>
                  <span style="color: black">
                    {{ it.computedName(props.item, it.value) }}
                  </span>
                </v-tooltip>
              </span>
              <span v-else>
                {{ props.item[it.value] }}
              </span>
            </td>
            <!-- 标签 -->
            <td
              :key="index"
              v-else-if="it.type == 'chip'"
              :style="{cursor:it.onClick ? 'pointer' : 'auto',minWidth:it.minWidth ? it.minWidth : ''}"
            >
              <div
                class="chipbox"
                :style="{ width: it.width }"
                @click="
                  it.onClick ? it.onClick(props.item, it.value) : () => {}
                "
              >
                <r-chip
                  v-for="(chipItem, chipindex) in it.computedRow(props.item)"
                  :key="chipindex"
                  :color="chipItem.colorCode"
                  :name="chipItem.labelName"
                ></r-chip>
              </div>
            </td>
            <!-- 时间 -->
            <!-- <td
            v-else-if="it.type == 'time'"
              :key="index"
            >
              <span>
                {{props.item[it.value]}}
              </span>
            </td> -->
            <td v-else-if="it.type == 'icon'" :key="index" :style="it.minWidth ? `min-width:${it.minWidth}` : ''">
              <v-icon large :color="props.item.colorCode">mdi-moon-full</v-icon>
              <!-- <v-btn icon fab small > </v-btn> -->
            </td>
            <td
              v-else-if="it.type == 'state'"
              :key="index"
              :style="it.minWidth ? `min-width:${it.minWidth}` : ''"
              @click="
                it.onClick
                  ? it.onClick(props.item, it.value, props.index)
                  : () => {}
              "
            >
              {{ props.item.isDelete ? "禁用中" : "启用中" }}
            </td>
            <!-- 角色状态 -->
            <td v-else-if="it.type == 'switch'" :key="index" :style="it.minWidth ? `min-width:${it.minWidth}` : ''">
              <v-switch
                class="my-0"
                dense
                hide-details="auto"
                v-model="props.item[it.value]"
                :false-value="it.falseValue"
                :true-value="it.trueValue"
                @click="it.onClick(props.item)"
              ></v-switch>
            </td>
            <td
              v-else-if="it.type == 'btnSize'"
              :style="{ color: it.color,minWidth:it.minWidth ? it.minWidth : '' }"
              :class="it.onClick ? 'pointer' : ''"
              @click="
                it.onClick &&
                it.computedRow &&
                it.computedRow(props.item, it.value, it.calculation) == '计算'
                  ? it.onClick(props.item, it.value, props.index)
                  : () => {}
              "
              :key="index"
            >
              <template
                v-if="
                  it.computedRow &&
                  it.computedRow(props.item, it.value, it.calculation) == '计算'
                "
              >
                <div style="color: #2a859d">计算</div>
              </template>
              <template v-else>{{
                it.computedRow && it.computedRow(props.item, it.value)
              }}</template>
            </td>
            <td
              v-else-if="it.type == 'color'"
              :style="{
                color:
                  it.computedRow && it.computedRow(props.item, it.value) != '/'
                    ? it.color
                    : null,
                    minWidth:it.minWidth ? it.minWidth : ''
              }"
              :class="it.onClick ? 'pointer' : ''"
              @click="
                it.onClick ? it.onClick(props.item, it.value, index) : () => {}
              "
              :key="index"
            >
              {{ it.computedRow && it.computedRow(props.item, it.value) }}
            </td>
            <td
              v-else-if="it.computed"
              :style="{cursor:it.onClick ? 'pointer' : 'auto',minWidth:it.minWidth ? it.minWidth : ''}"
              @click="
                it.onClick ? it.onClick(props.item, it.value, index) : () => {}
              "
              :key="index"
            >
              {{ it.computed(props.item[it.value]) }}
            </td>
            <td
              v-else-if="it.computedRow"
              :style="{cursor:it.onClick ? 'pointer' : 'auto',minWidth:it.minWidth ? it.minWidth : ''}"
              @click="
                it.onClick ? it.onClick(props.item, it.value, index) : () => {}
              "
              :key="index"
            >
              {{ it.computedRow(props.item, it.value) }}
            </td>
            <td v-else-if="it.type == 'remark'" :key="index" :style="it.minWidth ? `min-width:${it.minWidth}` : ''">
              <v-tooltip
                bottom
                color="#eee"
                max-width="200"
                :disabled="props.item.remark ? false : true"
              >
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-on="on"
                    v-bind="attrs"
                    style="
                      max-width: 150px;
                      min-width: 50px;
                      display: -webkit-box;
                      overflow: hidden;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 3;
                    "
                    >{{ props.item.remark }}</span
                  >
                </template>
                <span style="color: black; word-break: break-all">{{
                  props.item.remark
                }}</span>
              </v-tooltip>
            </td>
            <td v-else-if="it.type == 'echarts'" :key="index" :style="it.minWidth ? `min-width:${it.minWidth}` : ''">
              <v-tooltip
                bottom
                nudge-left="120"
                color="#eee"
                min-width="200"
                :disabled="props.item.remark ? false : true"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div v-on="on" v-bind="attrs">
                    <!-- {{index}} -->
                    <v-row
                      no-gutters
                      style="color: black; word-break: break-all"
                    >
                      <echarts-component
                        class="ma-auto"
                        style="width: 15%"
                        :echarStyle="{ width: '50px', height: '50px' }"
                        :echartId="'LeftEcharts' + props.item.id"
                        :echartRef="'LeftEcharts' + props.item.id"
                        :echartsdatas="props.item.echarts"
                      ></echarts-component>
                      <echarts-component
                        class="ma-auto"
                        style="width: 45%"
                        :echarStyle="{ width: '50px', height: '50px' }"
                        :echartId="'RightEcharts' + props.item.id"
                        :echartRef="'RightEcharts' + props.item.id"
                        :echartsdatas="props.item.echarts"
                      ></echarts-component>
                    </v-row>
                  </div>
                </template>
                <v-row no-gutters style="color: black; word-break: break-all">
                  <echarts-component
                    class="ma-auto"
                    style="width: 50%"
                    :echarStyle="{ width: '150px', height: '150px' }"
                    :echartId="'tableLeftEcharts' + index"
                    :echartRef="'tableLEcharts' + index"
                    :echartsdatas="props.item.echarts"
                  ></echarts-component>
                  <echarts-component
                    class="ma-auto"
                    style="width: 50%"
                    :echarStyle="{ width: '150px', height: '150px' }"
                    :echartId="'tabelRightEcharts' + index"
                    :echartRef="'tabelRightEcharts' + index"
                    :echartsdatas="props.item.echarts"
                  ></echarts-component>
                </v-row>
              </v-tooltip>
            </td>
            <td v-else-if="it.type == 'buttons'" :key="index" :style="it.minWidth ? `min-width:${it.minWidth}` : ''">
              <v-btn
                text
                v-for="(btn, inx) in it.children"
                :key="inx"
                :color="btn.color ? btn.color : '#primary'"
                @click="btn.onClick(props.item, index)"
                >{{ btn.text }}</v-btn
              >
              <!-- </td>
            <td
              :key="index"
              v-else-if="it.type == 'time'"
            >
            {{
               props.item[it.value]
            }}
            </td> -->
            </td>

            <td
              v-else
              :style="{cursor:it.onClick ? 'pointer' : 'auto',minWidth:it.minWidth ? it.minWidth : ''}"
              @click="
                it.onClick ? it.onClick(props.item, it.value, index) : () => {}
              "
              :key="index"
            >
              <div v-if="it.type == 'time'">
                {{
                  commonListfilter(
                    cutTime(props.item[it.value], 0, 10),
                    it.value
                  )
                }}
              </div>
              <div v-else>
                {{
                  commonListfilter(props.item[it.value], it.value) ||
                  $lodash.get(props.item, it.value)
                }}
              </div>
            </td>
          </template>
        </tr>
      </template>
      <!-- 自定义展开行插槽 -->
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <slot
            name="data-expanded-item"
            :headers="headers"
            :item="item"
          ></slot>
        </td>
      </template>

      <template
        v-if="
          pageOptions.viewGrid ||
          pageOptions.viewGeneralize ||
          records.length < 1
        "
        v-slot:body
      >
        <tr v-if="records.length < 1">
          <td :colspan="12">
            <v-img
              style="display: block; margin: 0 auto"
              width="350"
              height="350"
              src="../assets/img/noData.png"
            ></v-img>
          </td>
        </tr>
        <!-- 图标展示 -->
        <template
          v-if="
            pageOptions.viewGrid &&
            !pageOptions.viewGeneralize &&
            records.length > 0
          "
        >
          <!-- <viewGrid
            :records="records"
            :headerArray="headerArray"
            :selectedTasks="selectedTasks"
            @clickPitchOn="clickPitchOn"
            @tableContextmenudata="tableContextmenudata"
          ></viewGrid> -->
          <!-- <v-item-group active-class="primary">
            <v-container>
              <v-row>
                <v-col
                  v-for="(n, nindex) in records"
                  :key="nindex"
                  cols="12"
                  md="2"
                  sm="2"
                  @click="clickPitchOn(n)"
                  :class="n.class"
                >
                  <template v-for="(it, index) in headerArray">
                    <v-item :key="index" v-if="it.type == 'fileClick'">
                      <div
                        class="align-center text-center"
                        :class="
                          selectedTasks.indexOf(n) == '-1' ? '' : 'iconClass'
                        "
                        @dblclick="it.dblclick(n)"
                        @contextmenu.stop="
                          tableContextmenudata(arguments[0], { item: n }, index)
                        "
                      >
                        <template
                          v-if="
                            n.type == 1 && setIconStyle(n.fileExtension).img
                          "
                        >
                          <img
                            style="
                              width: 70px;
                              height: 70px;
                              display: block;
                              margin-bottom: 3px;
                              margin: 0 auto;
                            "
                            :src="setIconStyle(n.fileExtension).img"
                          />
                        </template>
                        <v-icon
                          v-else
                          :color="
                            n.type == 1
                              ? setIconStyle(n.fileExtension).color
                              : '#ffe69a'
                          "
                          style="font-size: 70px"
                          >{{
                            n.type == 1
                              ? setIconStyle(n.fileExtension).icon
                              : "mdi-folder"
                          }}</v-icon
                        >

                        <div style="text-aligin: center" class="overflowName">
                          <v-icon
                            v-if="n.isQuote"
                            size="12px"
                            color="blue"
                            class="mx-1"
                          >
                            mdi-link-variant</v-icon
                          >
                          {{ n.name }}
                          {{ n.type == 1 ? "." + n.fileExtension : "" }}
                        </div>
                        <div style="width: 100%" class="chipbox">
                          <v-chip
                            style="
                              margin-right: 5px;
                              text-align: center;
                              color: white;
                            "
                            x-small
                            v-for="(chipItem, it) in n.label"
                            :key="it"
                            :color="chipItem.colorCode"
                            >{{ chipItem.labelName }}
                          </v-chip>
                        </div>
                      </div>
                    </v-item>
                  </template>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>  -->
        </template>
        <template>
          <!-- <viewGeneralize
            v-if="
              pageOptions.viewGeneralize &&
              !pageOptions.viewGrid &&
              records.length > 0
            "
            :records="records"
            :headerArray="headerArray"
            :selectedTasks="selectedTasks"
            @clickPitchOn="clickPitchOn"
            @tableContextmenudata="tableContextmenudata"
          ></viewGeneralize> -->
        </template>
      </template>
    </v-data-table>

    <!--分页相关组件-->
    <v-row
      justify="end"
      no-gutters
      :style="itemKeyName == 'deptId' ? 'bottom: 34px;' : ''"
      class="fixtable mb-n3 mr-5 crud-table-pagination"
      v-if="pageTotal >= 1 && paging"
    >
      <pagination
        v-if="showpage"
        :total="pageTotal"
        :currentPage="page.current"
        :pagerCount="10"
        @prev-click="prevClick"
      ></pagination>
      <!-- <v-col md="auto"> -->
      <!-- <v-pagination
        class="page-selection"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        v-model="page.current"
        :length="pageTotal"
        color="#245363"
        ref="pagination"
        :total-visible="10"
      /> -->
      <div class="ml-3 page-selection v-size--small">
        每页
        <v-select
          v-model="page.size"
          solo
          style="display: inline-block; width: 80px"
          dense
          :items="perPageOptions"
        ></v-select>
        条, 共{{ total }}条
      </div>
      <!-- </v-col> -->
      <!-- <v-col md="auto">
          <v-text-field
            label="跳转到"
            style="width: 60px"
            type="number"
            class="mt-5"
            dense
            v-model="jumpToPage"
            @keydown="queryPage"
          />
        </v-col> -->
    </v-row>

    <slot name="add-dialog">
      <!-- <FormNavigation
        v-model="actionSwitch.add"
        :dialog-view="dialogView"
        :current-item="currentItem"
        @confirm="edit_"
      /> -->
    </slot>
    <slot name="edit-dialog">
      <!-- <FormNavigation
        v-model="actionSwitch.edit"
        :dialog-view="dialogView"
        :current-item="currentItem"
        @confirm="edit_"
      /> -->
    </slot>

    <slot name="delete-dialog">
      <!-- <tips-dialog
        v-model="actionSwitch.delete"
        width="300px"
        title="确认要删除当前数据项吗?"
        @confirm="delete_(currentItem)"
      /> -->
    </slot>

    <slot name="delete-batch-dialog">
      <!-- <tips-dialog
        width="350px"
        v-model="actionSwitch.batchDelete"
        title="确认要删除当前所选数据项吗?"
        @confirm="batchDelete_(selected)"
      /> -->
    </slot>

    <slot name="import-dialog">
      <!-- <v-dialog v-model="actionSwitch.import" width="400">
        <v-card class="pa-2">
          <v-row no-gutters justify="space-between" align="center">
            <v-col md="6" align="center" class="import-col">
              <v-hover v-slot:default="{ hover }">
                <div
                  class="import-item-box"
                  :class="{ 'on-hover': hover }"
                  @click="exportTemplate"
                >
                  <div>
                    <v-icon color="primary" size="100"
                      >mdi-file-download-outline
                    </v-icon>
                  </div>
                  <div class="text">下载模板</div>
                </div>
              </v-hover>
            </v-col>

            <v-col md="6" align="center" class="import-col">
              <v-hover v-slot:default="{ hover }">
                <div class="import-item-box" :class="{ 'on-hover': hover }">
                  <div>
                  </div>
                </div>
              </v-hover>
            </v-col>
          </v-row>
          <v-row no-gutters justify="space-between" align="center">
            <v-col md="12">
              <v-progress-linear
                v-if="importFiles.length"
                color="light-blue"
                height="10"
                :value="importFiles[0].progress"
                striped
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog> -->
    </slot>
    <!-- <conTextMenuTemplate
      :contextmenuDatas="contextmenuDatas"
      @crudTableindex="crudTableindex"
      @closeContextmenu="closeContextmenu"
    ></conTextMenuTemplate> -->
    <!-- </v-card> -->
  </div>
</template>

<script>
import { convertWidget } from "@/utils/widget";
// import TipsDialog from "@/components/TipsDialog";
// import FormNavigation from "@/components/FormNavigation";
// import ButtonRender from "@/components/ButtonRender";
// import FilterNavigation from "@/components/FilterNavigation";
// import FileUpload from "vue-upload-component";
// import viewGrid from "./viewGrid.vue";
// import viewGeneralize from "./viewGeneralize.vue";
import { commonListfilter } from "@/utils/filters";
import { setIconStyle, cutTime } from "@/utils/index";
// import echartsComponent from "../view/admin/project/echarts.vue";

import pagination from "./Pagination.vue";
import { strict } from "assert";
// import conTextMenuTemplate from "../view/admin/common/conTextMenuTemplate.vue";
// crudMixins.methods.transform = convertWidget;

export default {
  name: "CrudTable",
  // mixins: [crudMixins],
  components: {
    // echartsComponent,
    // TipsDialog,
    // ButtonRender,
    // FormNavigation,
    // FilterNavigation,
    // FileUpload,
    // viewGrid,
    // viewGeneralize,
    pagination,
    // conTextMenuTemplate,
  },
  props: {
    //计算大小
    theAllSize: {},
    //分页显示
    paging: {
      type: Boolean,
      default: () => true,
    },
    //表单数据
    froms: {
      type: Array,
      default: () => [],
    },
    // 是否显示计算全部文件大小
    isAllSize: {
      type: Boolean,
      default: () => false,
    },
    //后端返回数据名
    recordsData: {
      type: String,
      default: () => "records",
    },
    // 唯一属性
    itemKeyName: {
      type: String,
      default: () => "id",
    },
    //表头
    headers: {
      type: Array,
      default: () => [],
    },
    /**
     * 控件
     */
    widgetModels: {
      type: Array,
      default: () => [],
    },
    /**
     * 顶部按钮
     */
    buttonModels: {
      type: Array,
      default: () => [],
    },
    //顶部右边按钮
    rButtons: {
      type: Array,
      default: () => [],
    },
    showExpand: {
      type: Boolean,
      default: () => false,
    },
    singleSelect: {
      type: Boolean,
      default: () => false,
    },
    showSelect: {
      type: Boolean,
      default: () => false,
    },
    option: {
      type: Object,
      default: () => {},
    },
    isJapge: {
      //前端分页
      type: Boolean,
      default: () => false,
    },
    tableDatas: {
      type: Array, //前端处理分页数据
      default: () => [],
    },
    isCreated: {
      //是否Created调
      type: Boolean,
      default: () => false,
    },
    // 左侧上层树结构点击传递数据
    leftTopTreeData: {},
    value: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Array,
      default: () => [],
    },
    folderdata: {},
    isLRpadding: {
      type: String,
      default: () => "24px",
    },
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
  data: () => ({
    showpage: true,
    pickermenu: false,
    dates: [],
    // theAllSize: "计算",
    iconClass: false,
    //表头数组
    headerArray: [],
    //每页的条数定义
    perPageOptions: [10, 20, 30],
    //页面的定义信息，外部排序，外部分页等
    pageOptions: {
      viewGrid: false,
      viewGeneralize: false,
    },
    param: null,
    // 页面信息，查询条数，及当前页
    page: {
      size: 10,
      current: 1,
    },
    //跳转到的页数
    jumpToPage: 1,
    //最多
    pageCount: 10,
    //总页数
    pageTotal: 0,

    //加载中...
    loading: true,
    //总记录数
    total: 0,
    //记录数组
    records: [],
    localTableDatas: [], //存本地数据
    //是否可选
    checkable: true,
    //行内操作事件按钮
    loadMethod: "queryPage",
    showFilter: false,
    //可排序设置的表头，一般是第一次请求时赋值
    sortableHeaders: [],
    //显示的列头的表头value值
    displayHeaderValues: [],
    isGetData: false, //是否本地数据
    // 按钮点击数据
    selectedTasks: [], //选择框
    contextmenuDatas: {
      show: false,
      x: 0,
      y: 0,
      datas: [],
      pullDown: false,
    }, //控制右键菜单数据
  }),
  watch: {
    // namespace: "initCrud",
    "page.current": function (value, old) {
      if (value === old || this.isJapge) {
        return;
      }
      this.jumpToPage = value;
      if (this.isGetData) {
        this.init(this.localTableDatas, this.page.current);
        return;
      }
    },
    jumpToPage: function (value, old) {
      if (
        value === old ||
        value < 1 ||
        value === "" ||
        value > this.pageTotal
      ) {
        return;
      }
      this.page.current = Number(value);
      if (this.isGetData) {
        return;
      }
      this.queryPage();
    },
    "page.size": function (value, old) {
      if (value === old) {
        return;
      }
      this.page.current = 1;
      if (this.isGetData) {
        this.init(this.localTableDatas);
      } else {
        this.queryPage();
      }
    },
    value() {
      this.selectedTasks = this.value;
    },
  },
  created() {
    this.reset();
    this.isGetData = this.isJapge;
    if (this.isCreated) {
      this.init();
    } else {
      this.headerArray = this.headers;
      this.widgets = this.widgetModels;
      this.buttons = this.buttonModels;
      this.loading = false;
    }
  },
  mounted() {
    //初始化可设置表头的拖拽
    // const this_ = this;
    // Sortable.create(this.$refs["sortable-container"], {
    //   animation: 150,
    //   ghostClass: "sortable-ghost",
    //   dragClass: "sortable-drag",
    //   onUpdate: function(event) {
    //     var sortableHeaders = this_.sortableHeaders.splice(event.oldIndex, 1);
    //     this_.sortableHeaders.splice(event.newIndex, 0, sortableHeaders[0]);
    //     var newArray = this_.sortableHeaders.splice(0);
    //     this_.$nextTick(function() {
    //       this_.sortableHeaders = newArray;
    //     });
    //   },
    // });
  },
  methods: {
    prevClick(page) {
      this.page.current = page;
    },
    cutTime,
    //截取时间
    // cutTime(time) {
    //   let timedatas = time.substring(0,time.length - 10);
    //   return timedatas;
    // },
    //计算全部文件大小
    allSize() {
      this.$emit("allSize");
    },
    clickPitchOn(item) {
      this.selectedTasks = [item];
      this.clickTableItemView(item)
    },
    // table数据 右键行内事件
    tableContextmenudata(e, data, index) {
      e.preventDefault();

      console.log(data, index);
      this.selectedTasks = [data.item];
      this.$emit("tableContextmenudata", data.item, true);
    },
    clickTableItemView(data){
      this.$emit("clickTableItem", data);
    },
    clickTableItem(data, index) {
      // console.log(data, index);
      this.$emit("clickTableItem", data.item);
    },
    // 鼠标右击事件
    contextmenushow(e) {
      // console.log(e);
      if (e.clientX > 160 && e.clientY > 188) {
        if (
          (!this.selectedTasks.length && this.leftTopTreeData.length) ||
          this.leftTopTreeData.length
        ) {
          this.$emit("showContextmenu", false);
          // this.showContextmenu(false);
        }
        // console.log(this.selectedTasks, this.leftTopTreeData.length);
      }
      e.preventDefault();
    },
    showContextmenu(table = true) {
      // this.thecontextmenu(table);
      // console.log(this.contextmenuDatas.datas);
      if (this.contextmenuDatas.datas.length) {
        this.$contextmenu({
          items: this.contextmenuDatas.datas,
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
        });
      }
    },

    // 右键点击的按钮
    crudTableindex(item) {
      console.log(item);
      this.$emit("crudTableindex", item);
    },
    closeContextmenu() {
      this.$emit("closeContextmenu");
    },
    setIconStyle,
    // 点击更多中的事件
    clickmune(data) {
      this.$emit("clickmune", data);
    },
    // 按钮点击事件
    doAction(data) {
      console.log(data);
      this.clickbtn = data[2];
    },
    commonListfilter,
    init(data = [], current = 1) {
      this.loading = true;
      this.headerArray = this.headers;
      this.widgets = this.widgetModels;
      this.buttons = this.buttonModels;
      this.actions = [];
      this.pageOptions = this.option;
      // console.log(this.isGetData);
      if (this.isGetData) {
        // this.records = data && data.length ? data : this.tableDatas;
        this.localTableDatas = data && data.length ? data : this.tableDatas;
        this.records = this.localTableDatas.slice(
          (this.page.current - 1) * this.page.size,
          this.page.current * this.page.size
        );
        this.total = this.localTableDatas.length || 1;
        this.pageTotal = Math.ceil(
          this.localTableDatas.length / this.page.size < 1
            ? 1
            : this.localTableDatas.length / this.page.size
        );
        this.page.current = current;
        this.loading = false;
      } else {
        this.queryPage();
      }
    },
    queryPage(obj = null) {
      this.showpage = false;
      this.loading = true;
      let fetch = this.option.fetch;
      fetch(Object.assign(this.param, obj, this.page)).then((res) => {
        if (res.data) {
          res.data[this.recordsData].length &&
            res.data[this.recordsData].map((item) => {
              item.disabled = false;
            });
          if (this.itemKeyName == "approve") {
            res.data[this.recordsData].map((item, index) => {
              item.metaInfo = JSON.parse(item.metaInfo);
              item.description = item.metaInfo.description;
            });
          }
          if (this.itemKeyName == "acId") {
            res.data[this.recordsData].map((item, index) => {
              item.acId = item.id + "-" + item.type;
            });
          }
          // this.page.current = this.page.current;
        }
        this.records = res.data ? res.data[this.recordsData] : [];
        this.total = res.data ? res.data.total : 0;
        this.pageTotal = Math.ceil(
          this.total != 0
            ? parseInt(res.data.total) / this.page.size < 1
              ? 1
              : res.data.total / this.page.size
            : 0
        );
        console.log(this.pageTotal);
        this.$nextTick(() => {
          this.showpage = true;
        });
        this.loading = false;
      });
      // this.crudService.list(queryParams).then((data) => {
      //   this.total = data.total;
      //   this.itemKey = data.itemKey;

      //   this.records = handlerRecord(data);
      //   this.pageTotal = data.pages;
      //   const pageView = data.view || {};
      //   this.checkable = pageView.checkable;
      //   if (pageView.editableView) {
      //     this.dialogView = pageView.editableView;
      //   }

      //   if (data.pages !== null && data.pages <= 10) {
      //     this.pageCount = data.pages || 1;
      //   }
      //   //若表头没定义则用数据列的
      //   if (!this.headerArray || this.headerArray.length === 0) {
      //     if (pageView.headers) {
      //       const displayHeaders = pageView.headers.filter(
      //         (item) => !item.hidden
      //       );
      //       this.headerArray = displayHeaders;

      //       this.sortableHeaders = JSON.parse(
      //         JSON.stringify(pageView.headers)
      //       );
      //       this.displayHeaderValues = displayHeaders
      //         .filter((item) => !item.hidden)
      //         .map((header) => header.value);
      //     } else {
      //       const record = data.records[0];
      //       Object.keys(record).forEach((key) => {
      //         this.headerArray.push({ text: key, value: key });
      //       });
      //     }
      //   }

      //   //初始化控件
      //   if (
      //     (!this.widgets || this.widgets.length === 0) &&
      //     pageView.widgets
      //   ) {
      //     this.widgets = pageView.widgets;
      //   }

      //   //初始化按钮
      //   if (
      //     (!this.buttons || this.buttons.length === 0) &&
      //     pageView.buttons
      //   ) {
      //     this.buttons = pageView.buttons;
      //   }

      //   //初始化列事件
      //   this.initActionHeader(pageView.actions);
      //   this.initTableExpandHeader();
      //   this.loading = false;
      // });
    },
    initActionHeader(actions) {
      if (
        (!this.actions || this.actions.length === 0) &&
        actions &&
        actions.length > 0
      ) {
        this.actions = actions;
      }

      if (
        this.actions &&
        this.actions.length > 0 &&
        this.headerArray.map((item) => item.value).indexOf("actions") < 0
      ) {
        this.headerArray.unshift({
          text: "",
          value: "actions",
          class: "crud-actons-td",
          align: "start",
          sortable: false,
          width: "1",
        });
      }
    },
    initTableExpandHeader() {
      if (
        this.showExpand &&
        this.headerArray
          .map((item) => item.value)
          .indexOf("data-table-expand") < 0
      ) {
        this.headerArray.push({
          text: "",
          value: "data-table-expand",
          class: "crud-actons-td",
          align: "start",
          sortable: false,
          width: "1",
        });
      }
    },
    toggleSelectAll(data) {
      // console.log(data);
      this.$emit("toggleSelectAll", data);
    },
    itemSelected(status, data, index) {
      if (!this.singleSelect) {
        status && this.selectedTasks.push(data);
        !status &&
          this.selectedTasks.splice(
            this.selectedTasks.findIndex(
              (item) => item[this.itemKeyName] == data[this.itemKeyName]
            ),
            1
          );
      } else {
        this.selectedTasks = [data];
      }
      this.$emit("itemSelected", { status, data, index });
    },
    updateData(item, index) {
      this.records.splice(index, 1, item);
    },
    // 取消所有disabled
    closeDisabled() {
      this.records.map((item) => {
        item.disabled = false;
      });
    },
    //刷新
    refresh(state) {
      if (state) {
        this.reset();
      }
      this.queryPage();
    },
    search() {
      this.page = {
        size: 10,
        current: 1,
      };
      this.queryPage();
    },
    reset() {
      this.page = {
        size: 10,
        current: 1,
      };
      this.param = this.option
        ? Object.assign({}, this.option.params, this.page)
        : {};
    },
    changeDateTimePicker(e) {},
    datePickerMenu(e, item) {
      if (!e) {
        this.param[item.key] = [];
        this.param[item.keys[0]] = "";
        this.param[item.keys[1]] = "";
        this.search();
      }
    },
    cencel(item) {
      item.pickermenu = false;
      this.param[item.key] = [];
      this.param[item.keys[0]] = "";
      this.param[item.keys[1]] = "";
      this.search();
    },
    changeDateTime(item) {
      if (this.param[item.key].length != 2) {
        this.$toast.error("请选择完整的时间：开始-结束", {
          position: "top-center",
        });
        return;
      }
      if (item.keys.length) {
        this.param[item.keys[0]] = this.param[item.key][0];
        this.param[item.keys[1]] = this.param[item.key][1];
      }
      item.pickermenu = false;
      this.search();
    },
  },
};
</script>

<style scoped>
.iconClass {
  border: 1px solid #eee;
  background-color: #eee;
}
.crudtablewrap {
  /* padding-top: 10px; */
  /* padding: 0 24px; */
  /* padding-bottom: 64px; */
  /* border: 1px solid #ccc; */
  min-height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 2px;
}
.tableTopButton {
  border: 1px solid #ccc;
  border-left: none;
  border-right: 0;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
body >>> .v-data-table__checkbox .mdi-checkbox-marked {
  color: #3582fb;
}

.page-selection >>> .v-pagination__item:focus {
  border: none !important;
}
.crud-table >>> .v-data-table__wrapper {
  overflow: hidden;
}

.crud-table >>> .v-icon {
  font-size: 16px;
}

.crud-table >>> .mdi-checkbox-marked {
  color: #3582fb;
}

/* .crud-table >>> tbody tr:hover {
    box-shadow: 0 3px 15px -2px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    background: #fff !important;
  } */

.crud-table >>> .crud-actons-td {
  padding: 0 1px !important;
}

.crud-table >>> .actions-menu {
  border-radius: unset !important;
}
.crud-table >>> .v-btn {
  text-transform: none !important;
}
.col-item,
.col-item-readonly {
  display: inline-block;
  font-size: 14px;
  color: #8091a5;
  cursor: pointer;
  flex: 1;
}

.col-item:hover,
.col-item:hover > * {
  color: #3582fb !important;
}

.total-count {
  color: #000;
  padding: 0 5px;
}

.per-page {
  display: inline-block;
  width: 30px;
  height: 20px;
}

.separator {
  border-right: 1px solid #dfe6ee;
  width: 1px;
  height: 18px;
  margin-left: 15px;
  margin-right: 15px;
}

.setting-title {
  min-width: 20px;
  font-size: 12px;
  color: #8091a5;
}

.setting-content {
  margin-top: 5px;
}

.setting-content span {
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin: 0 1px;
  border: 1px solid #ebebeb;
}

.setting-content span:hover {
  background: #d7e6fe;
  color: #3582fb;
  border: 1px solid #3582fb !important;
  z-index: 1;
  cursor: pointer;
}

.per-current {
  background: #d7e6fe;
  color: #3582fb;
  border: 1px solid #3582fb !important;
  z-index: 1;
  cursor: default;
}

.crud-table >>> .v-progress-linear {
  height: 1px !important;
}

.crud-table >>> .v-data-table__expanded__content {
  box-shadow: unset;
}

.import-item-box {
  margin: 10px;
  cursor: pointer;
  background-color: #fafafa;
  transition: opacity 0.4s ease-in-out;
}

.import-item-box:not(.on-hover) {
  opacity: 0.6;
}

.import-upload >>> label {
  cursor: pointer;
}

.import-item-box .text {
  color: #80abfa;
  font-weight: bold;
  padding-bottom: 10px;
}

.settable-headers {
  position: relative;
  padding: 8px 5px 8px 5px;
  margin: auto auto 2px;
  border-radius: 4px;
  font-size: 14px;
}

.settable-text {
  padding-right: 20px;
}

.settable-checkbox {
  position: absolute;
  right: 5px;
  top: 12px;
}

.settable-headers:hover {
  cursor: move;
}

.sortable-ghost {
  background-color: #ffffff;
}

.sortable-drag {
  background-color: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.13);
}
.chipbox {
  height: 40px;
  width: 220px;
  line-height: 40px;
  /* display: flex;
    align-items: center; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.fixtable {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
}
.deptId {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34px;
}
.overflowName {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.pitchColor {
  opacity: 0.5;
}
.textHover {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.textHover:hover {
  color: #6961fc;
  cursor: pointer;
}
.pointer {
  cursor: pointer;
}
.select {
  position: absolute;
  width: 155px !important;
  /* margin-left: 10px; */
  padding-right: 10px;

  flex: none;
  right: 5%;
}
.text-field {
  padding-top: 18px;
  padding-right: 10px;
}
li {
  background-color: red !important;
}
</style>
