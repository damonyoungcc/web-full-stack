# 启动项目步骤

```
1、首先安装nodejs和mysql，启动mysql服务
2、切换到src/db目录下，运行node init_db.js初始化数据表
3、切换到event-manage-server根目录运行yarn install / npm install安装依赖
4、切换到event-manage-server根目录运行yarn dev / npm run dev启动项目
```

# 文档

## 后端技术栈

```text
基于nodejs的koa框架 – 服务端
mysql-数据库
sequelize-ORM框架
kwt-登录

```

## 后端目录结构

```
src
  -app.js          --项目启动文件
  -config/index.js --配置文件
  -routes          --路由
  -controllers     --控制层
  -model           --模型层
  -db              --连接数据库及一键生成表结构
  -------------------------------------------

app.js主要是实例化一个koa对象，并添加一些koa插件
config主要是配置的文件，
  有mysql相关的，设置参数nodejs好连接到mysql，
  tokenSecret主要是设置kwt登录的密钥
routes主要是路由文件，
  events persons users三个最终都会被统一被index里面的脚本读写，并导出
  这里面主要是路由列表，就是前端请求数据的接口，主要与mysql交互的，都是交给controllers层做
  路由层可以嵌套，
controllers是控制层，使用sequlize方便的操作数据表，增删查改数据给路由
db/models是模型层，主要就是sequlize定义表结构，以及每个字段的类型，大小等
  init_models是读取所有models文件夹下的文件，统一处理并且自动生成表结构
  init_db调用models模型，在mysql中生成数据表
  dbConn是nodejs和mysql连接连接
```

# 数据表的要求

```
1. 数据库中表events存储事件数据（列有:数据Id, 事件创立时间，一个短文本title，一个长文本内容）
2. 数据库表ers存储事件关系（三列，一列是子元素，一列是父元素，一列是关系内容简述）
3. 数据库表persons记录人员信息（有三列，人员Id, 人员名称，人员简介）
4. 数据库表eps记录事件和人员对应关系（两列，一列事件id，一列人员id）
```

## 用户相关的接口

```
user.js

/api/user/login 登录
/api/user/logout 登出
/api/user/register 注册（默认只有查看权限）
/api/user/list 超级管理员查询可登录用户接口（仅限admin用户）
/api/user/delete 超级管理员删除某个可登录账户（仅限admin用户）
/api/user/update 超级管理员编辑某个可登录账户的权限（仅限admin用户）
```

## 事件相关的接口

```
events.js

/api/event/list 查询所有事件列表 （管理员和所有注册人员）
/api/event/create 添加事件 （管理员及有权限人员）
/api/event/update 编辑（管理员及有权限人员）
/api/event/delete 删除（管理员及有权限人员）
```

# 建表

## users 表 注册的用户名密码

```
id(主键自增), username(用户名), password(密码), auth(权限，默认false 0)
id | username   | password | auth
1  | 'zhangsan' | '123456' | 1
2  | 'lisi'     | '123456' | 0
```

## persons 表，事件相关人员的表

```
id(主键自增), name(名字，可以同名),brief(人员简介)
id | name | brief
1  | 张三 | '张三的简介'
2  | 李四 | '李四的简介'
3  | 王五 | '王五的简介'
4  | 李六 | '李六的简介'
5  | 徐七 | '徐七的简介'
```

## eps 表，事件和人员对应关系的表

```
eventId  | personId
1        | 1
1        | 2
1        | 3
2        | 1
3        | 1
4        | 1

```

## events 表，事件表

```
id | createtime | title   | content
1  | '20190306' | '事件1' | 'xxxxxxxxxxxxxxxx'
2  | '20190306' | '事件2' | 'xxxxxxxxxxxxxxxx'
3  | '20190306' | '事件3' | 'xxxxxxxxxxxxxxxx'
4  | '20190306' | '事件4' | 'xxxxxxxxxxxxxxxx'
```

## ers 事件之间关系表

```
id      | pid  | description
1       | -1   | '一级事件'
2       | -1   | '一级事件'
3       | 1    | '二级事件'
4       | 2    | '二级事件'
```

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
