import { Instructions } from '../instructions'
import { createMemory } from '../create-memory'
import CPU from '../cpu'
import { Registers } from '../registers'

let memory: DataView
let writeableBytes: Uint8Array
let cpu: CPU

beforeEach(() => {
    memory = createMemory(256 * 256)
    writeableBytes = new Uint8Array(memory.buffer)
    cpu = new CPU(memory)
})

describe('Testing instruction set', () => {
    test('Testing MOV_LIT_REG', () => {
        let i = 0

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(4)
    })

    test('Testing MOV_REG_REG', () => {
        let i = 0

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        writeableBytes[i++] = Instructions.MOV_REG_REG
        writeableBytes[i++] = Registers.R1
        writeableBytes[i++] = Registers.R2

        cpu.step()
        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.R2)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(7)
    })

    test('Testing MOV_REG_MEM', () => {
        let i = 0

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        writeableBytes[i++] = Instructions.MOV_REG_MEM
        writeableBytes[i++] = Registers.R1
        writeableBytes[i++] = 0x10
        writeableBytes[i++] = 0x00

        cpu.step()
        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(memory.getUint16(0x1000)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(8)
    })

    test('Testing MOV_MEM_REG', () => {
        let i = 0

        memory.setUint16(0x1000, 1)

        writeableBytes[i++] = Instructions.MOV_MEM_REG
        writeableBytes[i++] = 0x10
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = Registers.R1

        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(4)
    })

    test('Testing ADD_REG_REG', () => {
        let i = 0

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R2

        writeableBytes[i++] = Instructions.ADD_REG_REG
        writeableBytes[i++] = Registers.R1
        writeableBytes[i++] = Registers.R2

        cpu.step()
        cpu.step()
        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.R2)).toBe(1)
        expect(cpu.getRegister(Registers.ACC)).toBe(2)
        expect(cpu.getRegister(Registers.IP)).toBe(11)
    })

    test('Testing JMP_NOT_EQ - NOT EQ', () => {
        let i = 0

        memory.setUint16(0x1000, 1)

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        writeableBytes[i++] = Instructions.ADD_REG_REG
        writeableBytes[i++] = Registers.R1
        writeableBytes[i++] = Registers.R2

        writeableBytes[i++] = Instructions.JMP_NOT_EQ
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x02
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x20

        cpu.step()
        cpu.step()
        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.ACC)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(0x0020)
    })

    test('Testing JMP_NOT_EQ - EQ', () => {
        let i = 0

        memory.setUint16(0x1000, 1)

        writeableBytes[i++] = Instructions.MOV_LIT_REG
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = Registers.R1

        writeableBytes[i++] = Instructions.ADD_REG_REG
        writeableBytes[i++] = Registers.R1
        writeableBytes[i++] = Registers.R2

        writeableBytes[i++] = Instructions.JMP_NOT_EQ
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x01
        writeableBytes[i++] = 0x00
        writeableBytes[i++] = 0x20

        cpu.step()
        cpu.step()
        cpu.step()

        expect(cpu.getRegister(Registers.R1)).toBe(1)
        expect(cpu.getRegister(Registers.ACC)).toBe(1)
        expect(cpu.getRegister(Registers.IP)).toBe(12)
    })
})