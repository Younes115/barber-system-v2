import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'

export type InertiaProps<T extends Record<string, any> = {}> = PropsWithChildren<Data.SharedProps & T>
