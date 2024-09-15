import { GetListDeviceResult } from "/src/api"

export interface ListProps {
    deviceData: GetListDeviceResult[]
    layout: 'list' | 'table'
}