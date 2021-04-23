import { defineConfig } from 'dumi';

export default defineConfig({
  title: '面试指个北',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'dist',
  // more config: https://d.umijs.org/config
  dynamicImport: {
    loading: '@/loading',
  },
  exportStatic: {},
  mode: 'site',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/virgoone/interview',
    },
  ],
  headScripts: [
    { content: `!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"JHRJXYlwhd65yctP",ck:"JHRJXYlwhd65yctP",hashMode: true});`, charset: 'utf-8' },
  ],
  // metas: [
  //   {
  //     name: 'keywords',
  //     content: '面试,面试指个北,前端面试,react,js,css,html,前端工程化,面试指南,前端',
  //   },
  //   {
  //     name: 'description',
  //     content: '前端面试指南,常用面试题、手写代码',
  //   },
  // ],
});
