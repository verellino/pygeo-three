import axios from 'axios'
import store from "../store";
// import {API_BASE_PATH} from "@/config";
// import qs from 'qs';
import Toast from "vue-toastification";
import Vue from "vue";
import router from "../router"
axios.defaults.withCredentials = true;
const request = axios.create({
    // baseURL: '/api', // url = base url + request url
    // baseURL:'http://127.0.0.1:9000',
    // baseURL:"http://server.natappfree.cc:36853",
    baseURL:'/',
    // send cookies when cross-domain requests
    timeout: 50000 // request timeout
});

/**
 * 请求带上token
 */
request.interceptors.request.use(function (config) {
    config.headers['Accept'] = '*/*'
    config.headers = {
        // ...(store.state.user.token ? { Authorization: 'Bearer ' + store.state.user.token } : {}),
        ...(config.headers || {})
    };
    if (config.method === 'get') {
        // config.paramsSerializer = function (params) {
        //     return qs.stringify(params, { arrayFormat: 'repeat' })
        // }
    }

    // if(config.method==='post' && config.headers['Content-Type']=='application/x-www-form-urlencoded'){

    // }
    return config
}, function (err) {
    return Promise.reject(err)
});

/**
 * 处理响应
 */
request.interceptors.response.use(function (res) {

    //如果是下载文件，则直接返回
    if (res.request.responseType === 'blob') {
        return res;
    }
    if (res.data.code == 200) {
        return res.data
    } else if (res.data.code == 401) {
        store.dispatch('logout')
        router.push({ path: '/login' })
        return Promise.reject(res.data)
    } else if (res.data.code !== 200) {
        Vue.$toast.error(res.data.msg || "服务器异常,请稍后再试")
        return Promise.reject(res.data)
    }

}, function (err) {
    Vue.$toast.error(err.data && err.data.msg || '服务器异常,请稍后再试');
    return Promise.reject(err)
});

export default request;

// export const download = (url, filename = '') => {
//     request.get(`${url}?fileName=${filename}`, {responseType: 'blob'}).then(response => {
//         const blob = new Blob([response.data]);
//         const tempLink = document.createElement('a');     // 创建a标签
//         const href = window.URL.createObjectURL(blob);       // 创建下载的链接
//         //filename
//         const fileName = decodeURI(response.headers['content-disposition'].split('filename=')[1]);
//         tempLink.href = href;
//         tempLink.target = "_blank";
//         tempLink.download = fileName;
//         document.body.appendChild(tempLink);
//         tempLink.click();     // 点击下载
//         document.body.removeChild(tempLink); // 下载完成移除元素
//         window.URL.revokeObjectURL(href) // 释放掉blob对象
//     })
// };


/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

// 通用下载方法
export function download(url, params, filename) {
    console.log('下载');
    return request.post((process.env.VUE_APP_BASE_API + url), params, {
        transformRequest: [(params) => {
            return tansParams(params)
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'blob'
    }).then((data) => {
        const content = data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
            const elink = document.createElement('a')
            elink.download = filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, filename)
        }
    }).catch((r) => {
        console.error(r)
    })
}

