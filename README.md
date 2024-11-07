# react-drag-images-component

## 介绍

图片拖拽排序的组件

## 安装

```
npm i -D react-drag-images-component
```

## 参数说明

| 参数        | 说明                                      | 类型     | 默认值 |
| ----------- | ----------------------------------------- | -------- | ------ |
| data        | 图片渲染数据列表，[{url: '', id: ''},...] | Array    | []     |
| width       | 图片宽度                                  | Number   | 200    |
| height      | 图片高度                                  | Number   | 200    |
| isOpen      | 是否展示展开收起按钮                      | Boolean  | true   |
| isDrag      | 是否允许拖拽                              | Boolean  | true   |
| col         | 展示的列数                                | Number   | 5      |
| row         | 默认展示的行数                            | Number   | 1      |
| isBorder    | 最外层边框                                | Boolean  | true   |
| borderColor | 最外层边框颜色                            | String   | -      |
| onChage     | 拖拽 change 事件                          | Function | -      |

## 通过数据渲染

```javascript
import DragImages from "react-drag-images-component";

const App = () => {
  const handleChange = (data) => {
    console.log(data);
  };

  return <DragImages data={[]} onChange={handleChange} />;
};
```

## 自定义数据渲染

**请确保 key 与 id 保持一致且不重复**

```javascript
import DragImages from "react-drag-images-component";

const App = () => {
  const [data, setData] = useState([]);

  const handleChange = (data) => {
    console.log(data);
  };
  return (
    <DragImges data={data} onChange={handleChange}>
      {data.map((item) => (
        <div key={item.id} className="aaa">
          <img
            src={item.url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            draggable="false"
          />
        </div>
      ))}
    </DragImges>
  );
};
```
