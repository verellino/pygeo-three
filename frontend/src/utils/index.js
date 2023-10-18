import store from '@/store';
// 数据状态
// export function getFileStatus(value) {
//   let options = {
//     1: '已删除',
//     3: '待处理',
//     5: '已处理',
//     7: '已下线',
//   };
//   return options[value];
// }

// 是否
export function getWhether(value) {
  let options = { 0: '否', 1: '是' };
  return options[value] || '否';
}
// 系统类型
export function getSystemType(value) {
  let options = { 1: 'Android', 2: 'IOS' };
  return options[value];
}
// 角色
export function getRoles(value) {
  let result = [];
  value.forEach(item => {
    result.push(item.name);
  });
  return result.join(',');
}
// 内容自动换行
export function getAutoWrapContent(value) {
  return value ? value.replace(/\r\n|\n/g, '<br>') : '';
}
// 日期格式化 hh-mm-ss
export function getTime(value) {
  if (!value) {
    return 0;
  }
  return value ? `${leftPad(date.getHours())}:${leftPad(date.getMinutes())}:${leftPad(date.getSeconds())}` : '';
}
//毫秒转时长
export function formatDuring(mss) {
  if (!mss || mss === 0 || (mss < 100 && mss > 0)) {
    return 0;
  }
  if (mss < 0) {
    let str = mss.toString();
    mss = str.split('-')[1];

    // var days = leftPad(parseInt(mss / (1000 * 60 * 60 * 24)))
    let days = '00';
    let hours = leftPad(
      // parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      parseInt(mss / (1000 * 60 * 60)),
    );
    let minutes = leftPad(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = leftPad(parseInt((mss % (1000 * 60)) / 1000));
    if (days === '00' && hours === '00' && minutes === '00') {
      return ' 负' + seconds + '秒';
    } else if (days === '00' && hours === '00') {
      return ' 负' + minutes + '分' + seconds + '秒';
    } else if (days === '00') {
      return ' 负' + hours + '时' + minutes + '分' + seconds + '秒';
    } else {
      return ' 负' + days + '天' + hours + '时' + minutes + '分' + seconds + '秒';
    }
  } else {
    // var days = leftPad(parseInt(mss / (1000 * 60 * 60 * 24)))
    let days = '00';
    let hours = leftPad(parseInt(mss / (1000 * 60 * 60)));
    let minutes = leftPad(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = leftPad(parseInt((mss % (1000 * 60)) / 1000));
    if (days === '00' && hours === '00' && minutes === '00') {
      return seconds + '秒';
    } else if (days === '00' && hours === '00') {
      return minutes + '分' + seconds + '秒';
    } else if (days === '00') {
      return hours + '时' + minutes + '分' + seconds + '秒';
    } else {
      return days + '天' + hours + '时' + minutes + '分' + seconds + '秒';
    }
  }
}

// 日期格式化 yyyy-mm-dd
export function formatDate(value) {
  let date = new Date(value);
  return value ? `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}` : '';
}
// 日期格式化 yyyy.mm.dd 周五
export function formatWeekDate(value) {
  let date = new Date(value);
  var weekDay = ['周天', '周一', '周二', '周三', '周四', '周五', '周六'];
  return value ? `${date.getFullYear()}.${leftPad(date.getMonth() + 1)}.${leftPad(date.getDate())} ${weekDay[date.getDay()]}` : '';
}
//日期格式移除T
export function formatDateTimeRT(value) {
  return value ? value.replace(/T/g, " ").replace(/.[\d]{3}Z/, "") : ""
}
// 日期格式化 yyyy-mm-dd hh-mm-ss
export function formatDateTime(value) {
  let date = new Date(parseInt(value));
  return value
    ? `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())} ${leftPad(date.getHours())}:${leftPad(date.getMinutes())}:${leftPad(date.getSeconds())}`
    : '';
}

// 日期格式化 yyyy-mm-dd hh-mm-ss 几天后的时间
export function formatDateTimeNextDays(value, days, type) {
  let date = new Date(parseInt(value));
  if (date) {
    date.setDate(date.getDate() + Number(days));
  }
  switch (type) {
    case 'date':
      return value ? `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())}` : '';
      break
    case 'dateTime':
      return value
        ? `${date.getFullYear()}-${leftPad(date.getMonth() + 1)}-${leftPad(date.getDate())} ${leftPad(date.getHours())}:${leftPad(date.getMinutes())}:${leftPad(date.getSeconds())}`
        : '';
      break;
    default:
      break;
  }
}


//获取某个时间段日期
export function sectionTime(start, end) {
  let startTime = gDate(start);
  let endTime = gDate(end);
  let arr = [];
  while (endTime.getTime() - startTime.getTime() >= 0) {
    let year = startTime.getFullYear();
    let month = startTime.getMonth().toString().length == 1 ? '0' + (startTime.getMonth() + 1).toString() : startTime.getMonth() + 1;
    let day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate();
    // arr.push({ date: year + '-' + month + '-' + day, hours: [] })
    arr.push({ date: startTime.getTime(), hours: [] });
    startTime.setDate(startTime.getDate() + 1);
  }
  return arr;
}
function gDate(datestr) {
  return new Date(datestr);
}
// 左侧补零
function leftPad(n) {
  return n < 10 ? `0${n}` : n;
}

// 用户注册来源
export function getUserSource(value) {
  switch (value) {
    case 0:
      return '无';
    case 1:
      return '手机号';
    case 2:
      return '邮箱';
    case 3:
      return 'QQ';
    case 4:
      return '微信';
    case 5:
      return '微博';
    case 99:
      return '其他';
    default:
      return '未知';
  }
}

// 截取两位
export function setFixed(value) {
  let number = new Number(value);
  number = number.toFixed(2);
  if (number === '0.00') {
    return 0;
  }
  return number;
}


export function isNull(value) {
  if (value == null || value == '' || value == 'undefined' || value == undefined || value == 'null' || Object.keys(value).length == 0) {
    return true;
  } else {
    value = typeof value == String ? value.replace(/\s/g, '') : value;
    if (value == '') {
      return true;
    }
    return false;
  }
}
export function isAdv(value, phone) {
  if (!phone || phone.length < 11) {
    return false;
  }
  // phone = phone.substring(phone.length - 11)
  if (value.indexOf(phone) > -1) {
    return true;
  } else {
    return false;
  }
}



export function smartDuration(startTime, endTime, preStr = '距离开始', startedStr = '已开始', ingStr = '距离结束', endStr = '已结束') {
  let currentTime = Date.now();
  if (endTime && currentTime >= endTime) {
    return endStr;
  } else if (startTime && currentTime < startTime) {
    let offset = timeDifference(startTime - currentTime);
    return preStr + offset;
  } else if (startTime & endTime && currentTime >= startTime && currentTime < endTime) {
    let offset = timeDifference(endTime - currentTime);
    return ingStr + offset;
  } else if (startTime && currentTime >= startTime) {
    let offset = timeDifference(currentTime - startTime);
    return startedStr + offset;
  } else {
    return '';
  }
}

function timeDifference(elapsed) {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + '秒';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + '分组';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + '小时';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + '天';
  } else {
    return Math.round(elapsed / msPerDay) + '天';
  }

  // else if (elapsed < msPerYear) {
  //   return Math.round(elapsed / msPerMonth) + '月';
  // } else {
  //   return Math.round(elapsed / msPerYear) + '年';
  // }
}
export function dayDuration(
  startTime,
  endTime,
  preStr = '${}天后开始',
  startedStr = '已开始${}天',
  ingStr = '${}天后结束',
  endStr = '已结束',
  startTodayStr = '今天开始',
  endTodayStr = '今天结束',
) {
  let currentTime = Date.now();
  if (endTime && currentTime >= endTime) {
    return endStr;
  } else if (startTime && currentTime < startTime) {
    let offset = dayDifference(startTime);
    if (offset == 0) {
      return startTodayStr;
    }
    return preStr ? preStr.replace('${}', offset) : offset;
  } else if (startTime & endTime && currentTime >= startTime && currentTime < endTime) {
    let offset = dayDifference(endTime);
    if (offset == 0) {
      return endTodayStr;
    }
    return ingStr ? ingStr.replace('${}', offset) : offset;
  } else if (startTime && currentTime >= startTime) {
    let offset = dayDifference(startTime);
    return startedStr ? startedStr.replace('${}', startedStr) : offset;
  } else {
    return '';
  }
}
function dayDifference(time) {
  let now = getDate();
  let aftertime = getDate(time);
  let year = now.getFullYear();
  let mon = now.getMonth() + 1;
  let day = now.getDate();
  let year_after = aftertime.getFullYear();
  let mon_after = aftertime.getMonth() + 1;
  let day_after = aftertime.getDate();
  let chs = 0;
  //获取当月的天数

  if (aftertime.getTime() - now.getTime() < 0) {
    let temp1 = day_after;
    let temp2 = mon_after;
    let temp3 = year_after;
    day_after = day;
    mon_after = mon;
    year_after = year;
    day = temp1;
    mon = temp2;
    year = temp3;
  }
  if (year == year_after) {
    //不跨年
    if (mon == mon_after) {
      //不跨年不跨月
      chs += day_after - day;
    } else {
      //不跨年跨月
      chs += DayNumOfMonth(year, mon) - day + 1; //加上第一个不满的
      for (let i = 1; i < mon_after - mon; i++) {
        chs += DayNumOfMonth(year, mon + i);
      }
      chs += day_after - 1; //加上
    }
  } else {
    //存在跨年
    chs += DayNumOfMonth(year, mon) - day + 1; //加上开始年份不满的一个月
    for (let m = 1; m < 12 - mon; m++) {
      chs += DayNumOfMonth(year, mon + m);
    }
    for (let j = 1; j < year_after - year; j++) {
      if ((year + j) % 400 == 0 || ((year + j) % 4 == 0 && (year + j) % 100 != 0)) {
        chs += 366;
      } else {
        chs += 365;
      }
    }
    // debugger
    for (let n = 1; n <= mon_after; n++) {
      chs += DayNumOfMonth(year_after, n);
    }
    chs += day_after - 1;
  }
  if (aftertime.getTime() - now.getTime() < 0) {
    return -chs;
  } else {
    return chs;
  }
}

function DayNumOfMonth(year, month) {
  let days = [31, 28, 31, 30, 31, 30, 31, 30, 30, 31, 30, 31];
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    days[1] = 29;
  }
  return days[month - 1];
}
function getDate(n) {
  if (n) {
    return new Date(n);
  } else {
    return new Date();
  }
}

export function deepClone(obj = {}) {
  if (typeof obj !== 'object' || obj == null) {
    // obj 是null  或者是值类型，直接返回。
    return obj;
  }
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }
  for (const key in obj) {
    // 保证 key  不是原型的属性
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // const element = obj[key];
      // 递归调用！！！
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}

export function validateKeywords(value, type = null) {
  if (!type && !store.state.app.openShop) {
    return false;
  }
  const verificationStr = /古董|文物|秦代|汉代|唐代|宋代|元代|明代|清代|秦朝|汉朝|唐朝|宋朝|元朝|明朝|清朝/;
  if (!verificationStr.test(value)) {
    return false;
  } else {
    return `请更正敏感词 ${verificationStr.exec(value)}`;
  }
}

export function getVipPriceData(data) {
  var res = {};
  if (data && data.memberPrice >= 0) {
    res.mark = data.mainCurrency && data.mainCurrency.mark ? data.mainCurrency.mark : '¥';
    res.vipPrice = data.memberPrice;
    res.type = data.memberPriceType;
  }
  return res;
}


export function getBase64Img(file) {
  function readFile(file, cb) {
    let FR = new FileReader();
    FR.readAsDataURL(file);
    FR.onloadend = () => {
      cb(FR.result);
    };
  }

  return new Promise((resolve) => {
    if (file) {
      readFile(file, resolve);
    }
  });
}
export function setIconStyle(fileExtension) {
  var iconitem = {
    type: "folder",
    icon: 'mdi-file',
    color: '#2A859d'
  }
  if (!fileExtension) {
    return iconitem
  }
  var icondatas = [
    {
      type: "doc",
      icon: "mdi-microsoft-word",
      color: "blue",
    },
    {
      type: "docx",
      icon: "mdi-microsoft-word",
      img: null,
      color: "blue",
    },
    {
      type: "xlsx",
      icon: "mdi-microsoft-excel",
      color: "green",
    },
    {
      type: "xls",
      icon: "mdi-microsoft-excel",
      img: "",
      color: "green",
    },
    {
      type: "pdf",
      icon: "null",
      img: require("@/assets/img/pdf.png"),
      color: "red",
    },
    {
      type: "txt",
      icon: "mdi-text-box",
      img: null,

      color: "#999",
    },
    {
      type: "gif",
      icon: "mdi-file-gif-box",
      img: null,

      color: "blue",
    },
    {
      type: "jpg",
      icon: "null",
      img: require("@/assets/img/jpg.png"),
      color: "blue",
    },
    {
      type: "png",
      icon: "null",
      img: require("@/assets/img/png.png"),
      color: "blue",
    },
    {
      type: "zip",
      icon: "null",
      img: require("@/assets/img/zip.png"),
      color: "blue",
    },
    {
      type: "mp3",
      icon: "null",
      img: require("@/assets/img/mp3.png"),
      color: "blue",
    },
    {
      type: "mp4",
      icon: "mdi-file-video",
      img: null,
      color: "blue",
    },
  ];
  // for (let i = 0; i = icondatas.length - 1; i++) {
  //   if (icondatas[i].type == fileExtension) {
  //     iconitem = icondatas[i]
  //     break
  //   }
  // }
  icondatas.map(item => {
    if (item.type == fileExtension) {
      iconitem = item
    }
  })
  return iconitem
}


//根据子节点查出所有父级id
export function getParent(data2, nodeID2) {
  var arrRes = []
  if (data2.length == 0) {
    if (!!nodeID2) {
      arrRes.unshift(data2)
    }
    return arrRes
  }
  let rev = (data, nodeID) => {
    for (var i = 0, length = data.length; i < length; i++) {
      let node = data[i]
      // console.log(node)

      if (node.acId == nodeID || node.acId == ('ID' + nodeID)) {
        arrRes.unshift(node)
        rev(data2, node.parentId)
        break
      } else {
        if (!!node.children) {
          rev(node.children, nodeID)
        }
      }
    }
    return arrRes
  }
  console.log(arrRes)
  arrRes = rev(data2, nodeID2)
  return arrRes
}
export function setEncoded(type, data) {
  const encodedData = encodeURIComponent(data);
  if (data) {
    if (type === 'XML') {
      return {
        filename: 'diagram.bpmn20.xml',
        href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        data: data
      }
    }
    if (type === 'BPMN') {
      return {
        filename: 'diagram.bpmn',
        href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        data: data
      }
    }
    if (type === 'SVG') {
      return {
        filename: 'diagram.svg',
        href: "data:application/text/xml;charset=UTF-8," + encodedData,
        data: data
      }
    }
  }
}
// 截掉字符串中的几位字符
export function cutTime(value,from,to) {
  console.log(value);
 let time = value.substring(from,value.length - to);
 return time
}
export function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children'
	};

	var childrenListMap = {};
	var nodeIds = {};
	var tree = [];

	for (let d of data) {
		let parentId = d[config.parentId];
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentId].push(d);
	}

	for (let d of data) {
		let parentId = d[config.parentId];
		if (nodeIds[parentId] == null) {
			tree.push(d);
		}
	}

	for (let t of tree) {
		adaptToChildrenList(t);
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	return tree;
}


/**
 * 获取当前时间
 * @param timeStr 时分秒 字符串 格式为 xx:xx:xx
 */
 export function getNowDateTime(timeStr) {
  let now = new Date();
  let year = now.getFullYear(); //得到年份
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); //得到月份
  let day = now.getDate().toString().padStart(2, "0"); //得到日期

  if (timeStr != null) {
    return `${year}-${month}-${day} ${timeStr}`;
  }
  let hours = now.getHours().toString().padStart(2, "0") // 得到小时;
  let minutes = now.getMinutes().toString().padStart(2, "0") // 得到分钟;
  let seconds = now.getSeconds().toString().padStart(2, "0") // 得到秒;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

//根据id 查询数据
export function idFindData(id,name,data=[]){
    let ids=id.toString().split(',')
    let arr=[]
    ids.map(item=>{
      arr.push(data.filter((v)=>{return v[name]==item})[0])
    })
    return arr 
}

export function getTreeObject(id,idName,list){
  let fun=(id,idName,list) => {
    for (let i = 0; i < list.length; i++) {
      let item=list[i]
      if(item[idName]===id){
        return item
      }else{
        if(item.children && item.children.length>0){
          let res=fun(id,idName,item.children)
          if(res){
            return res
          }
        }
      }
    }
  }
  let obj=fun(id,idName,list)
  return obj
}


import * as THREE from "three";
// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
export function onTransitionMouseXYZ( event, domElement ) {
  let mouse = new THREE.Vector2();
  let domElementLeft = domElement.getBoundingClientRect().left
  let domElementTop = domElement.getBoundingClientRect().top
  mouse.x =  ((event.clientX - domElementLeft) / domElement.clientWidth) * 2 - 1
  mouse.y = -((event.clientY - domElementTop) / domElement.clientHeight) * 2 + 1
  // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  return mouse;
}