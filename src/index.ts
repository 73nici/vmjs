import { createMemory } from './create-memory'
import CPU from './cpu'
import { Instructions } from './instructions'
import { Registers } from './registers'
import * as readline from 'readline'
import * as process from 'process'

const memory = createMemory(256 * 256)
const writeableBytes = new Uint8Array(memory.buffer)
const cpu = new CPU(memory)

let i = 0

writeableBytes[i++] = Instructions.MOV_LIT_REG
writeableBytes[i++] = 0x00
writeableBytes[i++] = 0x01
writeableBytes[i++] = Registers.R1

writeableBytes[i++] = Instructions.MOV_LIT_REG
writeableBytes[i++] = 0x00
writeableBytes[i++] = 0x03
writeableBytes[i++] = Registers.R2

writeableBytes[i++] = Instructions.PSH_REG
writeableBytes[i++] = Registers.R1

writeableBytes[i++] = Instructions.PSH_REG
writeableBytes[i++] = Registers.R2

writeableBytes[i++] = Instructions.POP
writeableBytes[i++] = Registers.R1

writeableBytes[i++] = Instructions.POP
writeableBytes[i++] = Registers.R2

const rl = readline.promises.createInterface({
    input: process.stdin,
    output: process.stdout,
})

cpu.debug()
cpu.viewMemoryAt(cpu.getRegister(Registers.IP))
cpu.viewMemoryAt(0x0200)

rl.on('line', () => {
    cpu.step()
    cpu.debug()
    cpu.viewMemoryAt(cpu.getRegister(Registers.IP))
    cpu.viewMemoryAt(memory.byteLength - 8)
})