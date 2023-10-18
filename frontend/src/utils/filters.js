import * as utils from './index'
export function commonListfilter(value,name){
    switch (name){
        case 'createTime':
        case 'updateTime':
        case 'lastUpdateTime':
        case 'operTime':
        return utils.formatDateTimeRT(value)
        default:
        return value
    }
}