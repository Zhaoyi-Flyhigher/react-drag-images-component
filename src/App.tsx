import React, { useState } from "react";
import type { Images } from "./drag-image/drag";
import DragImges from "./drag-image";

const App = () => {
  const [data, setData] = useState<Images[]>([
    { url: 'https://p1.ssl.qhimg.com/t014978afdbc61a3298.jpg', id: 'wu-yan-zu' },
    {
      url: 'https://ts1.cn.mm.bing.net/th/id/R-C.d33c3b6dfd8893a4d9714225ceff8606?rik=PyIuaxE3iJkxPw&riu=http%3a%2f%2fpuui.qpic.cn%2fvcover_vt_pic%2f0%2fqhyaluz62avc9au1500774355%2f0&ehk=mxMHeV7ZJAVXh95kZk65c8FYMRm1ckDOnNQv57TBfzQ%3d&risl=&pid=ImgRaw&r=0',
      id: 'zhou-xing-chi',
    },
    {
      url: 'https://pic4.zhimg.com/v2-545ae3c5f31f6c32dc7f7e5d38887be6_r.jpg?source=1940ef5c',
      id: 'hu-ge',
    },
    {
      url: 'https://p1.ssl.qhimg.com/t016a00bb709c0df0ba.jpg',
      id: 'wang-jia-er',
    },
    {
      url: 'https://n.sinaimg.cn/sinacn20112/706/w1674h2232/20200206/517d-inzcrxs9308090.jpg',
      id: 'yi-yang-qian-xi',
    },
    {
      url: 'https://ts1.cn.mm.bing.net/th/id/R-C.947446cce1db24147c8bfbb7c94afd66?rik=vQ88GMJfHqH3%2fg&riu=http%3a%2f%2fp3-tt.byteimg.com%2flarge%2fpgc-image%2fa7f7b3d419b34c1ca3cdc86b358a891f%3ffrom%3dpc&ehk=ZtXisYcPtQ%2bhmjro%2bRgoBcL8QNZ9F6Dbip8WehrOvFg%3d&risl=&pid=ImgRaw&r=0',
      id: 'liu-yi-fei',
    },
    {
      url: 'https://d.ifengimg.com/q100/img1.ugc.ifeng.com/newugc/20210223/18/wemedia/693d1ef2042cd22c4344956d137c31c8a34eda32_size939_w1835_h2500.jpg',
      id: 'zhang-yi-xing',
    },
    {
      url: 'https://pic2.zhimg.com/v2-ca3cb2019eecfd99c726db6294d5bdaf_r.jpg?source=1940ef5c',
      id: 'wang-yi-bo',
    },
    {
      url: 'https://ts1.cn.mm.bing.net/th/id/R-C.335714337adeccc0972dafda32d16b5c?rik=sdzLuDwFKscP%2bA&riu=http%3a%2f%2fe0.ifengimg.com%2f06%2f2019%2f0126%2fD3E0FC0E06A3792E9D4100C6D03781DDBA410B98_size45_w502_h665.jpeg&ehk=JF5UO59KLkLqzruhoYGkkEts85ZPr82tPhcJKjXPsnQ%3d&risl=&pid=ImgRaw&r=0',
      id: 'shen-teng',
    },
    {
      url: 'https://ts1.cn.mm.bing.net/th/id/R-C.dc9bbfd770a9a90ca12a090beb69f64a?rik=Le%2fH%2fk5XqQpZVA&riu=http%3a%2f%2fyweb1.cnliveimg.com%2f1423%2fimg%2f2021%2f0507%2f1620369631945.jpg&ehk=NbbWcp8dgbiiOhA6JYlewWKzyS5Nx188HMbuIv3wBv4%3d&risl=&pid=ImgRaw&r=0',
      id: 'xu-song',
    },
    {
      url: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.3ly54i5IiVh7f--3v8CtHwHaLH?pid=ImgDet&w=474&h=711&rs=1',
      id: 'yang-yin',
    },
    {
      url: 'https://p3.itc.cn/q_70/images01/20220712/d040527df3014d88a0a097bb427e3b7d.jpeg',
      id: 'zhao-jing-mai',
    },
    {
      url: 'https://k.sinaimg.cn/n/ent/4_img/upload/3c638c8b/796/w690h906/20201217/f669-kfnaptt5300378.jpg/w640slw.jpg',
      id: 'ni-ni',
    },
  ]);

  // 拖拽改变事件 
  const onChange = (data: Images[]) => {
    console.log("new-data", data);
    setData(data)
  }

  return (
    <>
      <p style={{padding: '0 20px'}}>数据：</p>
      <DragImges data={data} onChange={onChange} row={1} col={5} />
      <p style={{padding: '0 20px'}}>自定义样式：<text style={{color: 'red'}}>（当前数据只做演示，效果差别是由于id唯一性导致的！）</text>  </p>
      <DragImges data={data} onChange={onChange} row={2} col={5}>
        { data.map(item => (
            <div key={item.id} className="aaa">
              <img src={item.url} style={{width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer'}} draggable="false" />
            </div>)
          ) 
        }
      </DragImges>
    </>
  )
}

export default App