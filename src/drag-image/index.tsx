/**
 * @description 图片拖拽组件
 * @author zhaoyi 
**/
import React, { useEffect, useState, useCallback, useRef } from "react";
import type { DragImageProps, Images } from "./drag";
import { computedTop, computedLeft, computedWidth, getTranslateValues, BubblingSort, updateList } from "../utils/dragImgUtils";
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from "lodash-es";
import classNames from "classnames";
import "./style/index.scss";
import Down from "../assets/down.svg";
import Upoutlined from "../assets/upoutlined.svg";
import Drag from "../assets/drag.svg";

const DragImges = (props: DragImageProps) => {
  const { 
    isBorder = true, 
    borderColor = "",
    data = [],
    width = 200,
    height = 200,
    col = 5,
    row = 1,
    isOpen = true,
    isDrag = true,
    children = null
  } = props;

  // 格式化后的图片数据
  const [list, setList] = useState<DragImageProps['data']>([]);
  // 设置当前收起｜展开的状态
  const [open, setOpen] = useState<boolean>(false);
  // 要移动的目标
  const containerRef = useRef<any>(null);
  // 图片 wd-img-preview 元素
  const previewRef = useRef<any>(null);
   // 过渡动画的定时器
   const timerRef = useRef<any>(null);
   // 移动的元素
  const moveContainerRef = useRef<any>({});
  // 创建一个 ref 数组来存储每个子元素的 ref
  // const childRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // 初始化参数
  useEffect(() => {
    if(data.length) {
      setList(data.map((item, index: number) => {
        return {
          ...item,
          id: item.id ?? uuidv4().replace(/-/g, ''),
          position: index + 1,
        }
      }))
    } 
  }, [data])

  // 初始化 ref 数组
  // useEffect(() => {
  //   moveContainerRef.current = [];
  //   moveContainerRef.current = moveContainerRef.current.slice(0, React.Children.count(children));
  // }, [children]);

  // 计算图片的位置
  const computedImgPosition = (list: Images[]) => {
    list.forEach((item: Images) => {
      const target: any = document.querySelector(`#img-${item.id}`)
      const top = computedTop(item.position!, col, height) + 'px';
      const left = computedLeft(item.position!, col, width) + 'px';
      target.style.transform = `translate(${left}, ${top})`;
    })
  }

  // 计算图片所在的位置
  useEffect(() => {
    if (list.length && !children) computedImgPosition(list);
  }, [list])

  /**
   * @description 计算container容器的高度, hideOrShow = false
   * 收起 hideOrShow = true 展开
   * */
  const formulaConHeight = useCallback(
    (flag: boolean) => {
      if (!flag) {
        return row * height + row * 10;
      } else {
        const rows = Math.ceil(list.length / col);
        return rows * height + rows * 10;
      }
    },
    [list, open])

  // 1.开始拖拽
  const handleDragStart = (event: React.MouseEvent<any, MouseEvent>, item: Images) => {
    if(timerRef.current) return false;
    // 复制数据
    let copyList = list.slice();
    // 获取container最大高度
    const maxHeight = formulaConHeight(true);
    // 节流定时器
    let throttleTimer: any = null;
    // 获取图片地址
    const url = item.url;
    // 选中的图片的dom和数据
    const selectDom = moveContainerRef.current[url].current ?? moveContainerRef.current[url];
    const selectMenuData = item;

    // 获取父级容器滚动条位置
    const originTop = containerRef.current.scrollTop;
    let scrollTop = originTop;
    // 记录图片的top和left
    let moveTop: any
    let moveLeft: any
    // 记录起始选中位置
    let OriginPositionObj = {
      left: 0,
      top: 0,
      originNum: -1,
    }
    // 起始鼠标信息
    let OriginMousePosition = {
      x: 0,
      y: 0,
    }
    // 记录交换位置的号码
    let OldPosition: number = 0;
    let NewPosition: number = 0;

    // 1.保存点击的起始鼠标位置
    OriginMousePosition.x = event.screenX;
    OriginMousePosition.y = event.screenY;

    // 2.给选中图片一个transition：none的class，去除默认过渡
    selectDom.classList.add('zy_drag-trans-move-box');
    //3.保存现在卡片的top和left
    const { x, y } = getTranslateValues(selectDom);
    moveLeft = OriginPositionObj.left = x;
    moveTop = OriginPositionObj.top = y;

    //4.添加其他鼠标事件
    /* eslint-disable */
    previewRef.current.addEventListener('mousemove', mouseMoveListener);
    previewRef.current.addEventListener('mouseup', mouseUpListener);
    containerRef.current.addEventListener('scroll', mouseScroll);
    // 鼠标开始移动
    function mouseMoveListener(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
      const container = containerRef.current;
      // 在原来的top和left基础上，加上鼠标的偏移量
      moveTop = OriginPositionObj.top + (event.screenY - OriginMousePosition.y);
      moveLeft = OriginPositionObj.left + (event.screenX - OriginMousePosition.x);

      // 边界检测
      // 获取当前移动元素的left 与 top
      const { x, y } = getTranslateValues(selectDom);
      const currPositionLeft = x;
      const currPositionTop = y;
      
      // 左右
      if (moveLeft <= 0) {
        moveLeft = 0;
      } else if (moveLeft + width + 20 >= container.offsetWidth) {
        moveLeft = selectDom.clientX - currPositionLeft;
      }

      // 上下
      if (moveTop <= 0) {
        moveTop = 0;
      } else if (
        moveTop  >= maxHeight ||
        (moveTop + scrollTop + height + 10 >= maxHeight && moveTop <= scrollTop)
      ) {
        moveTop = selectDom.clientY - currPositionTop;
      }

      // 移动元素到指定位置
      const moveBox: any = document.querySelector('.zy_drag-trans-move-box')
      const left = moveLeft + 'px'
      const top = moveTop + (scrollTop - originTop) + 'px' //这里要加上滚动的高度
      moveBox.style.transform = `translate(${left}, ${top})`;

      // 在鼠标移动的监听中添加如下代码，节流调用检测函数，传入当前位置信息
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          computedPosition(moveTop + (scrollTop - originTop), moveLeft)
          //调用结束清空定时器
          throttleTimer = null
        }, 200)
      }
    }

    // 计算img的位置
    function computedPosition(moveItemTop: number, moveItemLeft: number) {
      //计算当前移动图片，可以覆盖的号码位置，计算出可以覆盖号码的地方
      let newWidthNum = Math.round(moveItemLeft / width) + 1;
      let newHeightNum = Math.round(moveItemTop / height);

      if (
        newHeightNum > Math.ceil(copyList.length / col) - 1 ||
        newHeightNum < 0 ||
        newWidthNum <= 0 ||
        newWidthNum > col
      ) {
        return false
      }
      // 计算新的位置编号
      const newPosition = newWidthNum + newHeightNum * col;
      // 如果新的位置与当前位置编号不相等，则进行位置交换
      if (newPosition !== selectMenuData.position) {
        let newItem = copyList.find((item: Images) => {
          return item.position === newPosition;
        })
        // 如果是默认图片则不交换位置
        if (newItem) {
          // 位置交换逻辑
          switchPosition(newItem, selectMenuData);
        }
      }
    }
    /**
     * @description 图片位置交换，核心逻辑
     * 图片的位置是在初始化的时候根据索引号+1计算的position字段，每次交换位置
     * 需要更新对应的position
     * @param newItem 新的
     * @param originItem 旧的
     * */
    function switchPosition(newItem: Images, originItem: Images) {
      OldPosition = originItem.position!;
      NewPosition = newItem.position!;

      //位置号码从小移动到大
      if (NewPosition > OldPosition) { 
        let changeArray: Images[] = []
        //从小移动到大，那小的号码就会空出来，其余卡片应往前移动一位
        //找出两个号码中间对应的卡片数据
        for (let i = OldPosition + 1; i <= NewPosition; i++) {
          let pushData = copyList.find((item: Images) => item.position === i);
          changeArray.push(pushData as Images);
        }
        // 更新当前移动图片下方图片的位置
        for (let i = 0; i < changeArray.length; i++) {
          const item = changeArray[i] as Images;
          item.position = item.position! - 1;
          // 更新位置
          const positionTarget: any = document.querySelector(`#img-${item.id}`)
          const top = computedTop(item.position, col, height) + 'px';
          const left = computedLeft(item.position, col, width) + 'px';
          positionTarget.style.transform = `translate(${left}, ${top})`;
        }
        // 更新移动的元素的position
        originItem.position = NewPosition
        // 更新copyList列表数据，重新排序
        copyList = BubblingSort(updateList(copyList, changeArray, originItem))
      }

      //位置号码从大移动到小
      if (NewPosition < OldPosition) {
        let changeArray: Images[] = []
        //从大移动到小，那大的号码就会空出来，其余卡片应往后移动一位
        //找出两个号码中间对应的卡片数据
        for (let i = OldPosition - 1; i >= NewPosition; i--) {
          let pushData = copyList.find((item: Images) => item.position === i);
          changeArray.push(pushData as Images);
        }
        // 更新当前移动图片下方图片的位置
        for (let i = 0; i < changeArray.length; i++) {
          const item = changeArray[i] as Images;
          item.position = item.position! + 1;
          // 更新位置
          const positionTarget: any = document.querySelector(`#img-${item.id}`)
          const top = computedTop(item.position!, col, height) + 'px';
          const left = computedLeft(item.position!, col, width) + 'px';
          positionTarget.style.transform = `translate(${left}, ${top})`;
        }
        // 更新移动的元素的position
        originItem.position = NewPosition;
        // 更新copyList列表数据，重新排序
        copyList = BubblingSort(updateList(copyList, changeArray, originItem));
      }
      console.log("change copy list:", copyList);
      
    }

    // 鼠标抬起
    function mouseUpListener(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
      // 取消位于交换队列的检测事件、对位置进行最后一次检测
      clearTimeout(throttleTimer);
      throttleTimer = null;
      computedPosition(moveTop + (scrollTop - originTop), moveLeft);

      // 更新最后一次移动元素的位置，防止跑出所在区域（解决边界问题）
      const zyTransMoveBox: any = document.querySelector('.zy_drag-trans-move-box');
      zyTransMoveBox.classList.add('zy_drag-transition');
      const top = computedTop(selectMenuData.position!, col, height) + 'px';
      const left = computedLeft(selectMenuData.position!, col, width) + 'px';
      zyTransMoveBox.style.transform = `translate(${left}, ${top})`;

      timerRef.current = setTimeout(() => {
        /**
         * 用0.3秒来过渡
         * mousedownTimer在一开始对点击事件进行了判断，若还在过渡则不能进行下一次点击
         * */
        const zyTransMoveBox: any = document.querySelector('.zy_drag-trans-move-box');
        zyTransMoveBox?.classList.remove('zy_drag-transition');
        zyTransMoveBox?.classList.remove('zy_drag-trans-move-box');
        clearTimeout(timerRef.current);
        timerRef.current = null;

        if (props.onChange) {
          // 通知外面更新data
          const arr = cloneDeep(copyList)
          props.onChange(
            arr.map(item => {
              delete item.position
              return item
            }),
          )
        } else {
          setList(copyList)
        }
      }, 300)

      // 移除监听事件
      previewRef.current.removeEventListener('mousemove', mouseMoveListener)
      previewRef.current.removeEventListener('mouseup', mouseUpListener)
      containerRef.current.removeEventListener('scroll', mouseScroll)

    }
    // 父级元素滚动事件
    function mouseScroll(event: any) {
      scrollTop = containerRef.current.scrollTop;
      const moveBox: any = document.querySelector('.zy_drag-trans-move-box');
      moveBox.style.transform = `translate(${moveLeft}px, ${moveTop + scrollTop - originTop}px)`;
    }
  }

  // 渲染子元素并为每个子元素增加 ref 和 className
  const renderedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const mappingData = data.find(item => item.id === child.key) as Images;
      mappingData['position'] = index + 1;
      const ref = moveContainerRef.current[mappingData.url] || React.createRef<HTMLDivElement>();
      moveContainerRef.current[mappingData.url] = ref;
      console.log(child);
      
      // 获取子元素现有的 className
      const existingClassName = child.props.className || '';
      // const existingId = child.props.id || '';

      // 合并现有的 className 和新的 className
      const newClassName = `${existingClassName} zy_drag-container-main-sub-item`;
      const newId = `img-${child.key}`;

      // 初始化位置
      const top = computedTop(mappingData['position'], col, height) + 'px';
      const left = computedLeft(mappingData['position'], col, width) + 'px';
      // 为每一项绑定拖拽事件
      const onDragStart = (event: React.MouseEvent) => handleDragStart(event, mappingData);
      
      return React.cloneElement(child, {
        ...child.props,
        ref,
        className: newClassName,
        id: newId,
        style: {
          width,
          height,
          transform: `translate(${left}, ${top})`,
        },
        onMouseDown: onDragStart,
      });
    }

    return child;
  });

  // 渲染图片区域
  const renderImage = () => {
    return (
      <>
        {
          list.map((item, index: number) => (
            <div 
              ref={el => {
                moveContainerRef.current[item.url] = el
              }}
              id={`img-${item.id}`}
              style={{width: width + 'px', height: height + 'px'}}
              className="zy_drag-container-main-sub-item" 
              key={item.id}
            >
              <img className="zy_drag-container-main-sub-item-img" src={item.url} alt="" />
              <div className={'zy_drag-container-main-sub-item-drag'}>
                {isDrag ? (
                  <span
                    className="zy_drag-container-main-sub-item-drag-span"
                    title="移动"
                    onMouseDown={event => handleDragStart(event, item)}
                  >
                    <img className="zy_drag-container-main-sub-item-drag-span-icon" src={Drag} draggable="false" />
                    <span className="text">拖拽排序</span>
                  </span>
                ) : null}
              </div>
            </div>
          ))
        }
      </>
    )
  }

  return (
    <div 
      className={classNames("zy_drag-container", {"zy_drag-border": isBorder})} 
      style={{
        "borderColor": borderColor,
        width: computedWidth(width, list.length, col)
      }}
    >
      <div 
        ref={containerRef}
        className="zy_drag-container-main"
        style={{
          width: computedWidth(width, list.length, col),
          height: `${formulaConHeight(isOpen ? open : true)}px`,
        }}
      >
        <div ref={previewRef} className="zy_drag-container-main-sub">
          { children ? renderedChildren : renderImage()}
        </div>
      </div>
      {/* 底部操作区域 */}
      {list.length / col > 1 && isOpen ? (
        <div className="zy_drag-footer">
          <span className="zy_drag-footer-text" onClick={() => setOpen(prevState => !prevState)}>
            {open ? '收起' : '展开'}
            {open ? <img className="zy_drag-footer-text-icon" src={Upoutlined} /> : <img className="zy_drag-footer-text-icon" src={Down}/> }
          </span>
        </div>
      ) : null}
    </div>
  )
}
export default DragImges;