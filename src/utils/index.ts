import type { Images } from "../types/drag";
/**
 * @description 计算容器top值
 * @param num 位置数
 * @param col 列数
 * @param height 图片高度
 * */ 
export const computedTop = (num: number, col: number, height: number) => {
  // 上下间距 = 10
  return (Math.ceil(num / col) - 1) * height + (Math.ceil(num / col) - 1) * 10
}
/**
 * @description 计算容器left值
 * @param num 位置数
 * @param col 列数
 * @param width 图片宽度
 * */ 
export const computedLeft = (num: number, col: number, width: number) => {
  // 左右间距 = 10
  return ((num - 1) % col) * width + ((num - 1) % col) * 10
}
/**
 * @description 公式计算一行展示的行数,通过行计算出图片的间距
 * @param len 图片数据的长度
 * @param n 列数
 * @param width 图片宽度
 * */ 
export const formula = (len: number, n: number) => {
  const num = len / n < 1 ? 1 : n;
  return  (num + 1) * 10 // (2 * num - 2) * 10
}

/**
 * @description 计算盒子的宽度
 * @param w 图片宽度
 * @param len 图片数据的长度
 * @param colNum 列数
 * */ 
export const computedWidth = (w: number, len: number, colNum: number) => {
  return w * colNum + formula(len, colNum) + 'px';
}

/**
 * @description 获取transform：translate的参数
 * @param element 元素
 * @return {x, y} x: left, y: top
 * */
export const getTranslateValues = (element: any): { x: number; y: number } => {
  // 获取元素的transform属性值
  const transform = window.getComputedStyle(element).transform;

  if (transform.startsWith('matrix')) {
    // 通过逗号分隔并提取最后两个数值
    // @ts-ignore
    const matrixValues = transform
      .match(/matrix\((.+)\)/)[1]
      .split(',')
      .map(Number)
    // 最后两个值对应于translateX和translateY
    return {
      x: matrixValues[4], // 第五个值是translateX
      y: matrixValues[5], // 第六个值是translateY
    }
  }
  // 使用正则表达式匹配translate函数中的数值
  const regex = /translate\((-?\d+(\.\d+)?px,\s?-?\d+(\.\d+)?px\))/
  const match = transform.match(regex)

  if (match) {
    // 解析匹配到的字符串，提取像素值
    const values = match[0].replace(/translate\(|px|\s/g, '').split(',')
    return {
      x: parseFloat(values[0]),
      y: parseFloat(values[1]),
    }
  } else {
    // 如果没有匹配到，返回默认值或者处理错误情况
    return { x: 0, y: 0 }
  }
}
// 修改数组中位置改变的数据
export const updateList = (list: Images[], changeArray: Images[], originItem: Images) => {
  const arr = list.map(item => {
    const changeItem = changeArray.find((curr: Images) => curr.url === item.url);
    if (changeItem) {
      item.position = changeItem.position;
    }
    if (item.url === originItem.url) {
      item.position = originItem.position;
    }
    return item;
  })
  return arr;
}

// 交换图片位置
export const BubblingSort = (arr: Images[]) => {
  return arr.slice().sort((a, b) => a.position! - b.position!);
}