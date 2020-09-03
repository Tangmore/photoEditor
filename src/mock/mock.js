const Mock = require('mockjs');
//格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/projectList', 'get', require('./json/projectList'));
Mock.mock('/order/orderList', 'get', require('./json/orderList'));
Mock.mock('/person/personList', 'get', require('./json/personList'));
Mock.mock('/person/person-areacheckbox', 'get', require('./json/person-areacheckbox'));
Mock.mock('/monitor/list', 'get', require('./json/monitor'));
