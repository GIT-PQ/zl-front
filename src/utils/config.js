/*
 * @Author: pang-q pang-q@neusoft.com
 * @Date: 2025-11-15 19:39:00
 * @LastEditors: pang-q pang-q@neusoft.com
 * @LastEditTime: 2025-11-15 19:46:28
 * @FilePath: \zl-front\src\utils\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 系统配置
 */

// 系统名称配置
export const SYSTEM_CONFIG = {
  // 系统全称（用于页脚等完整显示）
  fullName: '医疗器械发明专利分类系统',
  // 系统简称（用于头部导航等）
  shortName: '医疗器械发明专利分类系统',
  // 版权年份
  copyrightYear: 2025
}

// 页脚文本
export const getFooterText = () => {
  return `${SYSTEM_CONFIG.fullName} © ${SYSTEM_CONFIG.copyrightYear}`
}
