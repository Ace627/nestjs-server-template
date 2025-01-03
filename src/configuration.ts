import { join } from 'path'
import jsYaml from 'js-yaml'
import merge from 'lodash/merge'
import { readFileSync, existsSync } from 'fs'

export default (): Record<string, any> => {
  // 获取配置文件的存放目录 开发环境读取根目录的 config 目录；生产环境直接读取根目录
  const CONFIG_DIR_PATH = process.env.NODE_ENV === 'development' ? join(__dirname, '../config') : __dirname
  // 通用配置文件的路径
  const YAML_COMMON_CONFIG_PATH = join(CONFIG_DIR_PATH, 'config.yaml')
  // 读取通用配置文件的内容
  const COMMON_CONFIG = existsSync(YAML_COMMON_CONFIG_PATH) ? jsYaml.load(readFileSync(YAML_COMMON_CONFIG_PATH, 'utf-8')) : {}
  // 特点环境的配置文件的路径
  const YAML_ENV_CONFIG_PATH = join(CONFIG_DIR_PATH, `config.${process.env.NODE_ENV || 'development'}.yaml`)
  // 读取特定环境的配置文件的内容
  const ENV_CONFIG = existsSync(YAML_ENV_CONFIG_PATH) ? jsYaml.load(readFileSync(YAML_ENV_CONFIG_PATH, 'utf-8')) : {}
  // 合并通用配置和特点环境的配置 然后暴露出去
  const MERGE_CONFIG = merge(COMMON_CONFIG, ENV_CONFIG)

  return MERGE_CONFIG
}
