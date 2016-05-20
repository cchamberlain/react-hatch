import { resolveRoot } from '../config.js'
import { resolve } from 'path'

export const configPath = resolveRoot('./config.js')
export const libFolder = resolveRoot('./src/lib')

export function getAlias(name) {
  return  { 'config': configPath
          }
}
