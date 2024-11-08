

export interface Images {
  url: string;
  id?: number | string;
  position?: number;
  [key: string]: any
}

export interface DragImageProps {
  /** 显示边框 **/ 
  isBorder?: boolean;
  /** 边框颜色 **/ 
  borderColor?: string;
  /** 图片数据 **/ 
  data: Images[]
  /** 图片宽度 **/ 
  width?: number
  /** 图片高度 **/ 
  height?: number
  /** 图片显示的列 **/ 
  col?: number
  /** 图片默认展示几行 **/ 
  row?: number
  /** 是否展示展开收起按钮 **/ 
  isOpen?: boolean
  /** 是否展示拖拽按钮 **/ 
  isDrag?: boolean
  /** 图片拖拽change事件 **/ 
  onChange: (data: Images[]) => void
  /** ReactNode **/
  children?: React.ReactNode | null | undefined;
}