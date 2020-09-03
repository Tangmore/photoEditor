// const baseURL = 'http://192.168.2.224:8088/clouds';
const baseURL = 'http://cloud.cqhaiyue.com/clouds';
// const baseURL = 'http://192.168.2.227:8080/clouds';
let par=sessionStorage.getItem('localUrl');
const videoSrc='ws://192.168.2.103:';
const navList=[];

const navId=0;

const navChildId=-1;//nav父级id

const navHasChild1=-1;//nav子集id,

const navHasChild2=-1;

const  interceptors=true;//是否进行axios拦截

const canvasColor=['#6ce9ff', '#7ecef4', '#3abfff', '#009afc','#588aff','#5b52bf','#7456ff','#a537f6','#ffa337','#fff771','#13ab6d','#42df9f','#49e3d6'];     

const isLogin=false;//false为未登录或登录已过期，true为已登录
 
export default {
  baseURL,
  videoSrc,
  navList,
  navId,
  navChildId,
  navHasChild1,
  navHasChild2,
  canvasColor,
  isLogin,
  interceptors
}
