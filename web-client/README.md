# 启动项目步骤

```
1、首先安装nodejs和mysql，启动mysql服务,启动server端
2、切换到event-manage-client根目录运行yarn install / npm install安装依赖
3、切换到event-manage-client根目录运行yarn start / npm start启动项目
```

# 文档

## 前端技术栈


```text
基于react的前端项目
react-router-dom前端路由
ant-design UI框架
axios 发送ajax请求的库

```

## 前端目录结构

```
src
  -index.js          --项目启动文件
  -setupProxy.js     --设置代理，前端跨域请求后端
  -page/             --前端所有组件，APP.jsx为所有组件导出至这个入口总文件
    components/      --前端的一些公共组件，如页面公共头部，layout引入headerNav组件，每个不同的页面，只需要写不同的Content内容
    home/            --首页路由对应的组件
    manage/          --管理业对应的组件
    sign/            --登录和注册对应的组件
  -js/               --前端的一些工具函数，设置和获取token，将非树形的接口返回参数转化成树形的方法
  ----------------------------------------------------
基本就是一个递归的写法。

```js
// events/list查询所有事件的接口，返回的是非树形的结构，需要前端自己组装成树状数据机构
{
  "data": [
    {
      "id": 22,
      "createtime": 1564722153045,
      "title": "1级事件的",
      "content": "1级事件的内容",
      "personIds": [
        {
          "personId": 1
        },
        {
          "personId": 2
        },
        {
          "personId": 3
        }
      ],
      "pid": {
        "id": -1,
        "description": "1级事件的描述"
      }
    },
    {
      "id": 23,
      "createtime": 1564722153045,
      "title": "1.1级事件的",
      "content": "1.1级事件的内容",
      "personIds": [
        {
          "personId": 1
        },
        {
          "personId": 2
        },
        {
          "personId": 3
        }
      ],
      "pid": {
        "id": 22,
        "description": "1.1级事件的描述"
      }
    },
    {
      "id": 24,
      "createtime": 1564722153045,
      "title": "1.1.1级事件的",
      "content": "1.1.1级事件的内容",
      "personIds": [
        {
          "personId": 1
        },
        {
          "personId": 2
        },
        {
          "personId": 3
        },
        {
          "personId": 4
        }
      ],
      "pid": {
        "id": 23,
        "description": "1.1.1级事件的描述"
      }
    },
    {
      "id": 25,
      "createtime": 1564722153045,
      "title": "2事件的",
      "content": "2事件的内容",
      "personIds": [
        {
          "personId": 1
        },
        {
          "personId": 2
        },
        {
          "personId": 3
        },
        {
          "personId": 4
        }
      ],
      "pid": {
        "id": -1,
        "description": "2事件的描述"
      }
    },
    {
      "id": 26,
      "createtime": 1564722153045,
      "title": "2.1事件的",
      "content": "2.1事件的内容",
      "personIds": [
        {
          "personId": 1
        },
        {
          "personId": 2
        },
        {
          "personId": 3
        },
        {
          "personId": 4
        }
      ],
      "pid": {
        "id": 25,
        "description": "2.1事件的描述"
      }
    }
  ],
  "success": true
}


// 经过前端最终处理后组装的树形结构

[
  {
    id: 1,
    pid: 0,
    name: '一级事件',
    persions: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
    children: [
      {
        id: 2,
        pid: 1,
        name: '二级事件',
        persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }]
      },
      {
        id: 3,
        pid: 1,
        name: '二级事件',
        persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }]
      }
    ]
  },
  {
    id: 4,
    pid: 0,
    name: '一级事件',
    persions: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
    children: [
      {
        id: 5,
        pid: 3,
        name: '二级事件',
        persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }]
      },
      {
        id: 6,
        pid: 3,
        name: '二级事件',
        persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }],
        children: [
          {
            id: 7,
            pid: 6,
            name: '三级事件',
            persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }]
          },
          {
            id: 8,
            pid: 6,
            name: '三级事件',
            persions: [{ id: 3, name: '张三' }, { id: 4, name: '李四' }]
          }
        ]
      }
    ]
  }
];
```
